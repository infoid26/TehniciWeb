import {Pool} from 'pg';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const claimNames={
  tenant:['tid','http://schemas.microsoft.com/identity/claims/tenantid'],
  object:['oid','http://schemas.microsoft.com/identity/claims/objectidentifier'],
  username:['preferred_username','upn','http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
};
const empty=()=>({version:2,records:{},resume:''});
export const progressLimit=6000000;

export function progressDatabaseSettings(env){
  if(env.PROGRESS_DATABASE_URL)return {connectionString:env.PROGRESS_DATABASE_URL};
  if(env.PROGRESS_USE_AZURE_POSTGRESQL!=='true')return {};
  for(const name of ['AZURE_POSTGRESQL_HOST','AZURE_POSTGRESQL_USER','AZURE_POSTGRESQL_PASSWORD','AZURE_POSTGRESQL_DATABASE']){
    if(!env[name])throw new Error('Missing PostgreSQL setting: '+name);
  }
  const port=Number(env.AZURE_POSTGRESQL_PORT||5432);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PostgreSQL port');
  return {connectionOptions:{host:env.AZURE_POSTGRESQL_HOST,port,user:env.AZURE_POSTGRESQL_USER,password:env.AZURE_POSTGRESQL_PASSWORD,database:env.AZURE_POSTGRESQL_DATABASE,ssl:{rejectUnauthorized:true}}};
}

export function accountSettings(env){
  if(env.AUTH_ENABLED!=='true')return null;
  const tenants=(env.AUTH_UNIVERSITY_TENANT_IDS||'').split(',').map(id=>id.trim().toLowerCase()).filter(Boolean);
  const origin=new URL(env.AUTH_ORIGIN||'https://tw.infoid26.ro');
  // Identity headers are trusted ONLY behind Azure's enabled Easy Auth module.
  // Never enable a local/header-based development bypass in the shipped server.
  if(!env.WEBSITE_INSTANCE_ID||!['true','1'].includes((env.WEBSITE_AUTH_ENABLED||'').toLowerCase())||!tenants.length||tenants.some(id=>!uuid.test(id))||origin.protocol!=='https:'||origin.origin!==origin.href.replace(/\/$/,'')){
    throw new Error('Account configuration requires Azure Easy Auth, university tenant IDs and an HTTPS origin.');
  }
  return {tenants:new Set(tenants),origin:origin.origin};
}

export function accountIdentity(headers,settings){
  if(!settings)return null;
  const encoded=headers['x-ms-client-principal'];
  if(!encoded)return null;
  if(typeof encoded!=='string'||encoded.length>64000)throw new Error('Forbidden account');
  let principal;
  try{principal=JSON.parse(Buffer.from(encoded,'base64').toString('utf8'));}catch{throw new Error('Forbidden account');}
  if(principal.auth_typ!=='aad'||!Array.isArray(principal.claims))throw new Error('Forbidden account');
  const read=names=>{
    const values=[...new Set(principal.claims.filter(c=>names.includes(c.typ)).map(c=>c.val))];
    if(values.some(v=>typeof v!=='string')||values.length>1)throw new Error('Conflicting identity claims');
    return values[0];
  };
  const tenant=read(claimNames.tenant)?.toLowerCase();
  const object=read(claimNames.object)?.toLowerCase();
  // Do not authorize using a mutable email/contact claim or principal-name header.
  const username=read(claimNames.username)?.toLowerCase();
  if(!uuid.test(tenant||'')||!uuid.test(object||'')||!settings.tenants.has(tenant)||!username||username.length>254||! /^[^\s@#]+@(?:s\.unibuc\.ro|unibuc\.ro)$/.test(username))throw new Error('Forbidden account');
  if(principal.claims.some(c=>c.typ==='idtyp'&&c.val!=='user')||principal.claims.some(c=>c.typ==='acct'&&c.val!=='0'))throw new Error('Forbidden account');
  // Display names are presentation only; authorization above uses tenant/oid/UPN.
  const display=principal.claims.find(c=>c.typ==='name'&&typeof c.val==='string'&&c.val.trim())
    ||principal.claims.find(c=>c.typ==='http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'&&typeof c.val==='string'&&c.val.trim());
  return {tenant,object,id:tenant+':'+object,email:username,name:display?display.val.trim().slice(0,200):username};
}

export function normalizeProgress(value,lessons){
  if(!value||value.version!==2||!value.records||typeof value.records!=='object'||Array.isArray(value.records)||Object.keys(value.records).length>lessons.size)throw new Error('Invalid progress');
  const records={};
  for(const [id,record] of Object.entries(value.records)){
    const lesson=lessons.get(id);
    if(!lesson||!record||typeof record!=='object'||Array.isArray(record)||typeof record.code!=='string'||record.code.length>100000)throw new Error('Invalid lesson record');
    const revision=lesson.task.revision||1;
    if((record.revision||1)!==revision)continue;
    records[id]={revision,code:record.code,quiz:record.quiz===lesson.quiz.correct?record.quiz:null,verified:record.verified===record.code?record.code:null};
  }
  return {version:2,records,resume:lessons.has(value.resume)?value.resume:''};
}

export function createProgressStore({connectionString,connectionOptions,database}={}){
  let pool=database,initializing;
  async function ready(){
    if(!pool){
      if(!connectionString&&!connectionOptions)throw new Error('Progress database is not configured');
      pool=new Pool({...connectionOptions,...(connectionString?{connectionString}:{}),max:4,connectionTimeoutMillis:5000,idleTimeoutMillis:30000,query_timeout:7000,statement_timeout:5000});
      // Never log connection strings or student code on a database error.
      pool.on('error',()=>console.warn('Progress database connection unavailable.'));
    }
    initializing??=(async()=>{await pool.query(`CREATE TABLE IF NOT EXISTS tw_account_progress (
      tenant_id uuid NOT NULL, object_id uuid NOT NULL,
      version integer NOT NULL CHECK (version > 0), progress jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (tenant_id, object_id)
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS tw_account_exam_tickets (
      tenant_id uuid NOT NULL, object_id uuid NOT NULL, ticket_id text NOT NULL,
      completed_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (tenant_id, object_id, ticket_id)
    )`);})().catch(error=>{initializing=undefined;throw error;});
    await initializing;
    return pool;
  }
  const convert=row=>row?{version:Number(row.version),progress:row.progress}:{version:0,progress:empty()};
  return {
    async read(user){
      const db=await ready();
      const result=await db.query('SELECT version, progress FROM tw_account_progress WHERE tenant_id=$1 AND object_id=$2',[user.tenant,user.object]);
      return convert(result.rows[0]);
    },
    async write(user,version,progress){
      const db=await ready();
      const values=[user.tenant,user.object,JSON.stringify(progress)];
      // Compare-and-swap prevents an old tab/device overwriting newer progress.
      const result=version===0
        ?await db.query('INSERT INTO tw_account_progress (tenant_id,object_id,version,progress) VALUES ($1,$2,1,$3::jsonb) ON CONFLICT DO NOTHING RETURNING version,progress',values)
        :await db.query('UPDATE tw_account_progress SET version=version+1,progress=$3::jsonb,updated_at=now() WHERE tenant_id=$1 AND object_id=$2 AND version=$4 RETURNING version,progress',[...values,version]);
      return result.rows[0]?convert(result.rows[0]):null;
    },
    async examHistory(user){
      const db=await ready();
      return (await db.query('SELECT ticket_id FROM tw_account_exam_tickets WHERE tenant_id=$1 AND object_id=$2 ORDER BY ticket_id',[user.tenant,user.object])).rows.map(row=>row.ticket_id);
    },
    async completeTicket(user,ticketId){
      const db=await ready();
      await db.query('INSERT INTO tw_account_exam_tickets (tenant_id,object_id,ticket_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',[user.tenant,user.object,ticketId]);
    },
    async close(){if(pool&&!database)await pool.end();},
  };
}

export function createAccountHandler({env,lessons,tickets,store}){
  const settings=accountSettings(env);
  const json=(res,status,value)=>{
    for(const [name,header] of Object.entries({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}))res.setHeader(name,header);
    res.writeHead(status);res.end(JSON.stringify(value));
  };
  return async(req,res,pathname)=>{
    if(pathname==='/account/logout'){
      // End only this host's Easy Auth browser session; do not call the IdP logout.
      if(req.method!=='POST'){
        res.setHeader('Allow','POST');json(res,405,{error:'Este necesara o cerere POST.'});return true;
      }
      if(!settings||req.headers.origin!==settings.origin||req.headers['sec-fetch-site']==='cross-site'){
        json(res,403,{error:'Deconectarea trebuie initiata de pe site.'});return true;
      }
      const names=new Set(['AppServiceAuthSession','AppServiceAuthSession1']);
      for(const cookie of (req.headers.cookie||'').split(';')){
        const name=cookie.split('=',1)[0].trim();
        if(/^AppServiceAuthSession\d{0,3}$/.test(name))names.add(name);
      }
      res.setHeader('Set-Cookie',[...names].map(name=>`${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None`));
      res.writeHead(303,{'Location':'/','Cache-Control':'no-store','Vary':'Cookie','Referrer-Policy':'no-referrer'});
      res.end();return true;
    }
    if(!['/api/account','/api/progress','/api/exam/tickets'].includes(pathname))return false;
    try{
      if(!settings){json(res,pathname==='/api/account'?200:503,{enabled:false,user:null,error:'Sincronizarea conturilor nu este încă activată.'});return true;}
      let user;
      try{user=accountIdentity(req.headers,settings);}catch{json(res,403,{enabled:true,user:null,error:'Conectarea este permisă numai conturilor universitare @s.unibuc.ro și @unibuc.ro.',logoutUrl:'/account/logout'});return true;}
      if(pathname==='/api/account'){
        if(req.method!=='GET'){json(res,405,{error:'Metodă nepermisă.'});return true;}
        json(res,200,{enabled:true,user:user?{id:user.id,email:user.email,name:user.name}:null,loginUrl:'/.auth/login/aad?post_login_redirect_uri=/',logoutUrl:'/account/logout'});return true;
      }
      if(!user){json(res,401,{error:'Conectează-te pentru sincronizarea progresului.'});return true;}
      if(req.headers['x-tw-account']!==user.id){json(res,409,{code:'account-changed',error:'Contul conectat s-a schimbat. Reîncarcă pagina; copia locală este păstrată.'});return true;}
      if(pathname==='/api/exam/tickets'){
        if(req.method==='GET'){json(res,200,{completed:await store.examHistory(user)});return true;}
        if(req.method!=='POST'){json(res,405,{error:'Metoda nepermisă.'});return true;}
        if(req.headers.origin!==settings.origin||req.headers['x-tw-exam']!=='1'||req.headers['sec-fetch-site']==='cross-site'){
          json(res,403,{error:'Cererea trebuie trimisă de pe site.'});return true;
        }
        if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||'')){json(res,415,{error:'Este necesar JSON.'});return true;}
        const chunks=[];let size=0;
        for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>50000){json(res,413,{error:'Cerere prea mare.'});return true;}chunks.push(Buffer.from(chunk));}
        let input;
        try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{json(res,400,{error:'JSON invalid.'});return true;}
        const bank=await tickets();
        if(input?.action==='complete'){
          if(!bank.some(t=>t.id===input.ticketId)){json(res,400,{error:'Bilet invalid.'});return true;}
          await store.completeTicket(user,input.ticketId);
          json(res,200,{completed:await store.examHistory(user)});return true;
        }
        if(input?.action!=='draw'||!['css','server','client'].includes(input.category)||!Array.isArray(input.exclude)||input.exclude.length>bank.length||input.exclude.some(id=>typeof id!=='string')){
          json(res,400,{error:'Extragere invalidă.'});return true;
        }
        const completed=await store.examHistory(user),excluded=new Set([...completed,...input.exclude]);
        const pool=bank.filter(t=>t.category===input.category&&!excluded.has(t.id));
        if(!pool.length){json(res,409,{code:'tickets-exhausted',error:'Ai parcurs toate biletele acestei probe. Nu mai sunt bilete noi.'});return true;}
        json(res,200,{ticketId:pool[Math.floor(Math.random()*pool.length)].id,remaining:pool.length-1,completed});return true;
      }
      if(req.method==='GET'){json(res,200,await store.read(user));return true;}
      if(req.method!=='PUT'){json(res,405,{error:'Metodă nepermisă.'});return true;}
      if(req.headers.origin!==settings.origin||req.headers['x-tw-progress']!=='1'||req.headers['sec-fetch-site']==='cross-site'){
        json(res,403,{error:'Cererea de salvare trebuie trimisă de pe site.'});return true;
      }
      if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||'')){json(res,415,{error:'Este necesar JSON.'});return true;}
      const chunks=[];let size=0;
      for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>progressLimit){json(res,413,{error:'Progresul depășește limita de 6 MB. Descarcă o copie locală.'});return true;}chunks.push(Buffer.from(chunk));}
      let input,progress;
      try{
        input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if(!Number.isSafeInteger(input.version)||input.version<0||input.version>=2147483647)throw new Error('Invalid version');
        progress=normalizeProgress(input.progress,await lessons());
      }catch{json(res,400,{error:'Formatul progresului nu este valid.'});return true;}
      const saved=await store.write(user,input.version,progress);
      if(!saved){json(res,409,{error:'Progresul s-a schimbat pe alt dispozitiv.',...await store.read(user)});return true;}
      json(res,200,saved);
    }catch{json(res,503,{error:pathname==='/api/exam/tickets'?'Istoricul biletelor nu poate fi sincronizat momentan. Încearcă din nou.':'Progresul nu a putut fi sincronizat. Copia locală este păstrată.'});}
    return true;
  };
}
