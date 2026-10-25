import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {PGlite} from '@electric-sql/pglite';
import {accountIdentity,accountSettings,createProgressStore,progressDatabaseSettings} from './accounts.mjs';
import {createServer} from './serve.mjs';
import {inject} from './inject.mjs';

const tenant='11111111-1111-4111-8111-111111111111';
const object='22222222-2222-4222-8222-222222222222';
const other='33333333-3333-4333-8333-333333333333';
const env={AUTH_ENABLED:'true',WEBSITE_INSTANCE_ID:'test-only',WEBSITE_AUTH_ENABLED:'True'.toLowerCase(),AUTH_UNIVERSITY_TENANT_IDS:tenant,AUTH_ORIGIN:'https://tw.infoid26.ro'};
const settings=accountSettings(env);
assert.deepEqual(progressDatabaseSettings({AZURE_POSTGRESQL_HOST:'unused'}),{});
const azureDatabase={PROGRESS_USE_AZURE_POSTGRESQL:'true',AZURE_POSTGRESQL_HOST:'test.postgres.database.azure.com',AZURE_POSTGRESQL_USER:'test',AZURE_POSTGRESQL_PASSWORD:'test-only',AZURE_POSTGRESQL_DATABASE:'infoid-db',AZURE_POSTGRESQL_PORT:'5432',AZURE_POSTGRESQL_SSL:'false'};
const connection=progressDatabaseSettings(azureDatabase).connectionOptions;
assert.equal(connection.database,'infoid-db');assert.equal(connection.password,'test-only');assert.equal(connection.port,5432);
assert.deepEqual(connection.ssl,{rejectUnauthorized:true},'Legacy SSL settings must never disable verified TLS for progress');
assert.throws(()=>progressDatabaseSettings({...azureDatabase,AZURE_POSTGRESQL_PASSWORD:''}));
assert.throws(()=>progressDatabaseSettings({...azureDatabase,AZURE_POSTGRESQL_PORT:'0'}));
assert.deepEqual(progressDatabaseSettings({...azureDatabase,PROGRESS_DATABASE_URL:'postgresql://configured'}),{connectionString:'postgresql://configured'});
const principal=(email='student@s.unibuc.ro',overrides={})=>Buffer.from(JSON.stringify({auth_typ:'aad',claims:[{typ:'tid',val:tenant},{typ:'oid',val:object},{typ:'preferred_username',val:email}],...overrides})).toString('base64');
const identity=(email,overrides)=>accountIdentity({'x-ms-client-principal':principal(email,overrides)},settings);
assert.equal(identity('STUDENT@S.UNIBUC.RO').email,'student@s.unibuc.ro');
assert.equal(identity('teacher@unibuc.ro').id,tenant+':'+object);
assert.equal(identity('teacher@unibuc.ro').name,'teacher@unibuc.ro');
assert.equal(identity(undefined,{claims:[{typ:'tid',val:tenant},{typ:'oid',val:object},{typ:'preferred_username',val:'student@s.unibuc.ro'},{typ:'name',val:'Ionuț Axinte'}]}).name,'Ionuț Axinte');
for(const email of ['someone@gmail.com','student@s.unibuc.ro.attacker.test','student@sub.unibuc.ro','student@s.unibuc.ro\n','name#EXT#@unibuc.ro','student@@s.unibuc.ro'])assert.throws(()=>identity(email));
assert.equal(accountIdentity({'x-ms-client-principal-name':'student@s.unibuc.ro'},settings),null);
assert.throws(()=>accountSettings({...env,WEBSITE_AUTH_ENABLED:'false'}));
assert.throws(()=>accountSettings({...env,WEBSITE_INSTANCE_ID:''}));
assert.throws(()=>accountSettings({...env,AUTH_UNIVERSITY_TENANT_IDS:''}));
assert.equal(accountSettings({}),null);
assert.throws(()=>accountIdentity({'x-ms-client-principal':'bad-json'},settings));
assert.throws(()=>identity(undefined,{auth_typ:'google'}));
for(const claims of [
 [{typ:'tid',val:other},{typ:'oid',val:object},{typ:'preferred_username',val:'student@s.unibuc.ro'}],
 [{typ:'tid',val:tenant},{typ:'oid',val:object},{typ:'email',val:'student@s.unibuc.ro'}],
 [{typ:'tid',val:tenant},{typ:'oid',val:object},{typ:'preferred_username',val:'student@s.unibuc.ro'},{typ:'acct',val:'1'}],
 [{typ:'tid',val:tenant},{typ:'oid',val:object},{typ:'preferred_username',val:'student@s.unibuc.ro'},{typ:'oid',val:other}],
])assert.throws(()=>identity(undefined,{claims}));
const mapped=identity(undefined,{claims:[
 {typ:'http://schemas.microsoft.com/identity/claims/tenantid',val:tenant},
 {typ:'http://schemas.microsoft.com/identity/claims/objectidentifier',val:object},
 {typ:'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',val:'student@s.unibuc.ro'},
]});assert.equal(mapped.id,tenant+':'+object);

// Run the production SQL against real PostgreSQL (PGlite), not a SQL string mock.
const db=new PGlite();
await db.waitReady;
const store=createProgressStore({database:db});
const server=createServer({env,production:true,progressStore:store});
const headers={'X-MS-CLIENT-PRINCIPAL':principal(),'X-TW-Account':tenant+':'+object,Origin:env.AUTH_ORIGIN,'Content-Type':'application/json','X-TW-Progress':'1'};
const request=(path='/api/progress',method='GET',body,extra={})=>inject(server.listeners('request')[0],{path,method,body:body===undefined?undefined:typeof body==='string'?body:JSON.stringify(body),headers:{...headers,...extra},timeout:10000});
const progress={version:2,records:{'start-browser':{revision:1,code:"<h1>'); DROP TABLE tw_account_progress; --</h1>",quiz:1,verified:null}},resume:'start-browser'};
try{
 let response=await request('/api/account');assert.equal(response.status,200);assert.equal(JSON.parse(response.body).user.id,tenant+':'+object);assert.equal(response.headers['cache-control'],'no-store');
 response=await request();assert.deepEqual(JSON.parse(response.body),{version:0,progress:{version:2,records:{},resume:''}});
 response=await request('/api/progress','PUT',{version:0,progress});assert.equal(response.status,200);assert.equal(JSON.parse(response.body).version,1);
 assert.equal(JSON.parse((await request()).body).progress.records['start-browser'].code,progress.records['start-browser'].code);
 const results=await Promise.all([request('/api/progress','PUT',{version:1,progress}),request('/api/progress','PUT',{version:1,progress})]);
 assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 response=await request('/api/progress','PUT',{version:0,progress});assert.equal(response.status,409);assert.equal(JSON.parse(response.body).version,2);
 const second=principal(undefined,{claims:[{typ:'tid',val:tenant},{typ:'oid',val:other},{typ:'preferred_username',val:'second@s.unibuc.ro'}]});
 response=await request('/api/progress','GET',undefined,{'X-MS-CLIENT-PRINCIPAL':second,'X-TW-Account':tenant+':'+other});assert.equal(JSON.parse(response.body).version,0);
 response=await request('/api/progress','PUT',{version:0,progress},{'X-MS-CLIENT-PRINCIPAL':second});assert.equal(response.status,409);assert.equal(JSON.parse(response.body).code,'account-changed');
 response=await request('/api/progress','PUT',{version:2,progress},{Origin:'https://evil.test'});assert.equal(response.status,403);
 response=await request('/api/progress','PUT',{version:2,progress},{'X-TW-Progress':''});assert.equal(response.status,403);
 response=await request('/api/progress','PUT',{version:2,progress},{'Content-Type':'text/plain'});assert.equal(response.status,415);
 response=await request('/api/progress','PUT','{');assert.equal(response.status,400);
 response=await request('/api/progress','PUT',{version:2,progress:{...progress,records:{unknown:{code:'bad'}}}});assert.equal(response.status,400);
 response=await request('/api/progress','PUT','x'.repeat(6000001));assert.equal(response.status,413);
 response=await request('/api/progress','GET',undefined,{'X-MS-CLIENT-PRINCIPAL':''});assert.equal(response.status,401);
 response=await request('/api/progress','GET',undefined,{'X-MS-CLIENT-PRINCIPAL':principal('no@gmail.com')});assert.equal(response.status,403);
 assert.equal(JSON.parse((await request()).body).version,2,'Rejected requests must not change stored progress');
 const unavailable=createServer({env,production:true,progressStore:{read:()=>{throw new Error('secret connection string');},close:async()=>{}}});
 response=await inject(unavailable.listeners('request')[0],{path:'/api/progress',headers});assert.equal(response.status,503);assert(!response.body.includes('secret'));
 const disabled=createServer({env:{},production:true});response=await inject(disabled.listeners('request')[0],{path:'/api/account',headers});assert.equal(JSON.parse(response.body).enabled,false);
 console.log('PASS: Microsoft claims, university tenant/domain restrictions, disabled header trust outside Easy Auth, account isolation, real SQL storage, atomic conflicts, CSRF, request limits and private API responses.');
}finally{await db.close();}

const clientSource=await fs.readFile('site/account.js','utf8');
const empty=()=>({version:2,records:{},resume:''});
const copy=value=>JSON.parse(JSON.stringify(value));
function clientFixture({email='student@s.unibuc.ro',name='Ionuț Axinte',id=tenant+':'+object,storage=new Map(),api,anonymous=false}={}){
 const elements=new Map();
 const element=()=>({children:[],textContent:'',hidden:false,listeners:{},append(el){this.children.push(el);},replaceChildren(){this.children=[];},addEventListener(type,fn){this.listeners[type]=fn;}});
 for(const id of ['#account-panel','#account-controls','#account-status','#account-actions'])elements.set(id,element());
 const events={};const timers=new Map();let timerId=0;let state=empty();const downloads=[];
 const context=vm.createContext({window:{addEventListener:(name,fn)=>{events[name]=fn;}},document:{querySelector:id=>elements.get(id),createElement:element,addEventListener:(name,fn)=>{events[name]=fn;}},
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},location:{protocol:'https:'},AbortSignal,console,confirm:()=>true,
  setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),
  fetch:async(path,options)=>{
    const result=path==='/api/account'?{status:200,value:{enabled:true,user:anonymous?null:{id,email,name}}}:await api(path,options);
    return {ok:result.status<400,status:result.status,json:async()=>copy(result.value)};
  }});
 vm.runInContext(clientSource,context);
 const controller=context.window.TW_ACCOUNTS.create({storageKey:'progress',normalize:copy,getState:()=>state,setState:value=>{state=copy(value);},refresh(){},download:(name,value)=>downloads.push(JSON.parse(value))});
 return {controller,context,elements,storage,downloads,get state(){return state;},set state(value){state=copy(value);}};
}
let remote={version:0,progress:empty()},writes=0;
const api=async(path,options)=>{
 if(options.method!=='PUT')return {status:200,value:remote};
 const body=JSON.parse(options.body);writes++;
 if(body.version!==remote.version)return {status:409,value:remote};
 remote={version:remote.version+1,progress:copy(body.progress)};return {status:200,value:remote};
};
const first=clientFixture({api});await first.controller.start();
assert(first.elements.get('#account-controls').children.some(el=>el.children.some(child=>child.textContent==='Ionuț Axinte')));
assert(first.elements.get('#account-controls').children.some(el=>el.children.some(child=>child.textContent==='Logout')&&el.href.startsWith('/.auth/logout')));
const anonymous=clientFixture({anonymous:true,api});await anonymous.controller.start();
assert(anonymous.elements.get('#account-controls').children.some(el=>el.textContent==='Conectare cu Microsoft'&&el.href.startsWith('/.auth/login/aad')));
first.state=progress;first.controller.save();await first.controller.flush();assert.equal(remote.version,1);
const second=clientFixture({api});await second.controller.start();assert.deepEqual(second.state,remote.progress,'New device restores progress');
first.state={...progress,records:{...progress.records,'start-file':{revision:1,code:'index.html',quiz:null,verified:null}}};first.controller.save();await first.controller.flush();
second.state={...second.state,records:{...second.state.records,'start-folder':{revision:1,code:'images/cake.svg',quiz:null,verified:null}}};second.controller.save();await second.controller.flush();await second.controller.flush();
assert(Object.hasOwn(remote.progress.records,'start-file'));assert(Object.hasOwn(remote.progress.records,'start-folder'));
const third=clientFixture({api});await third.controller.start();third.state.records['start-browser'].code='other device';third.controller.save();await third.controller.flush();
second.state.records['start-browser'].code='local edit';second.controller.save();await second.controller.flush();
assert(second.elements.get('#account-status').textContent.includes('Am oprit sincronizarea'));
assert(second.elements.get('#account-controls').children.some(el=>el.children.some(child=>child.textContent==='Logout')),'Conflict actions must not remove account controls');
const count=writes;await second.controller.flush();assert.equal(writes,count);assert.equal(remote.progress.records['start-browser'].code,'other device');
const cached=JSON.parse(second.storage.get('progress:account:'+tenant+':'+object));assert.equal(cached.progress.records['start-browser'].code,'local edit');
const offline=clientFixture({storage:second.storage,api:async()=>{throw new Error('offline');}});await offline.controller.start();assert.equal(offline.state.records['start-browser'].code,'local edit');
const switched=clientFixture({email:'second@s.unibuc.ro',id:tenant+':'+other,storage:second.storage,api:async()=>({status:200,value:{version:0,progress:empty()}})});await switched.controller.start();assert.deepEqual(switched.state,empty(),'A different account must not inherit the previous account cache');
const guestStorage=new Map([['progress',JSON.stringify(progress)]]);
let migrated={version:0,progress:empty()};let failMigration=true;
const migrationApi=async(path,options)=>{
 if(options.method!=='PUT')return {status:200,value:migrated};
 if(failMigration)throw new Error('Connection lost during first save');
 migrated={version:migrated.version+1,progress:JSON.parse(options.body).progress};return {status:200,value:migrated};
};
const fresh=clientFixture({storage:guestStorage,api:migrationApi});await fresh.controller.start();
assert.deepEqual(fresh.state,progress,'First login automatically retains anonymous progress');
assert.equal(guestStorage.get('progress:anonymous-owner'),tenant+':'+object);
assert.deepEqual(JSON.parse(guestStorage.get('progress:account:'+tenant+':'+object)).progress,progress);
failMigration=false;
const resumed=clientFixture({storage:guestStorage,api:migrationApi});await resumed.controller.start();assert.deepEqual(migrated.progress,progress,'Migration retries after reload without losing pending data');
const different=clientFixture({id:tenant+':'+other,storage:guestStorage,api:async()=>({status:200,value:{version:0,progress:empty()}})});await different.controller.start();assert.deepEqual(different.state,empty(),'Anonymous progress is not imported into a second account');
console.log('PASS: shipped client restores a second device, merges independent edits, preserves conflicts/offline work, displays name/logout and automatically migrates anonymous progress once, including failed-save recovery.');
