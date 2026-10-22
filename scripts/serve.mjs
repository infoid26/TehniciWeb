import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {Worker} from 'node:worker_threads';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {gzip} from 'node:zlib';
import {promisify} from 'node:util';
import {createSessionEvaluator} from './azure-sessions.mjs';
import {createSandboxEvaluator,sandboxSettings} from './azure-sandboxes.mjs';

const require=createRequire(import.meta.url);
let projectPromise;
export async function closeProject(){
  if(!projectPromise)return;
  const pending=projectPromise;projectPromise=undefined;
  const app=await pending;
  await app.locals.close();
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function runtimeSettings(env=process.env,portArgument) {
  const production=env.NODE_ENV==='production'||Boolean(env.WEBSITE_INSTANCE_ID||env.WEBSITE_SITE_NAME);
  const port=Number(env.PORT||portArgument||8088);
  if(!Number.isInteger(port)||port<0||port>65535)throw new Error('PORT must be an integer between 0 and 65535.');
  return {port,host:env.HOST||(production?'0.0.0.0':'127.0.0.1'),production};
}
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.webp':'image/webp','.wasm':'application/wasm'};
export function createServer(options={}) {
  const production=options.production??runtimeSettings().production;
  const env=options.env||process.env;
  const sandbox=sandboxSettings(env);
  const sessionEndpoint=options.sessionEndpoint??process.env.LAB_AZURE_SESSION_ENDPOINT;
  if([sandbox,sessionEndpoint,options.evaluatorUrl||process.env.LAB_EVALUATOR_URL].filter(Boolean).length>1)throw new Error('Configure only one lab evaluator.');
  const evaluatorUrl=sandbox?'https://sandbox.internal/evaluate':sessionEndpoint||options.evaluatorUrl||process.env.LAB_EVALUATOR_URL;
  const evaluatorFetch=sandbox?createSandboxEvaluator({env,runCommand:options.sandboxCommand,onCleanupError:()=>console.warn('Lab sandbox cleanup failed; evaluator paused. Check tw-eval sandboxes before restart.')}):sessionEndpoint?createSessionEvaluator({endpoint:sessionEndpoint,env,fetchImpl:options.fetch||fetch,onCleanupError:()=>console.warn('Lab session cleanup failed; pool cooldown must reclaim it.')}):(options.fetch||fetch);
  const evaluatorToken=options.evaluatorToken??process.env.LAB_EVALUATOR_TOKEN;
  if(evaluatorUrl){const url=new URL(evaluatorUrl);if(url.protocol!=='https:'||url.username||url.password)throw new Error('LAB_EVALUATOR_URL must be an HTTPS URL without embedded credentials.');}
  const maxChecks=2;
  const staticFiles=new Map();
  const compress=promisify(gzip);
  const loadStatic=async target=>{
    const load=async()=>{
      const content=await fs.readFile(target);
      const etag='"'+createHash('sha256').update(content).digest('hex')+'"';
      return {content,etag,compressed:undefined};
    };
    if(!production)return load();
    if(!staticFiles.has(target))staticFiles.set(target,load().catch(error=>{staticFiles.delete(target);throw error;}));
    return staticFiles.get(target);
  };
  let activeChecks=0;
  let tasksPromise;
  const tasks=()=>tasksPromise??=(async()=>{const context={window:{}};vm.runInNewContext(await fs.readFile(path.join(root,'site/course.js'),'utf8'),context);return new Map(context.window.TW_COURSE.chapters.flatMap(c=>c.lessons).map(l=>[l.id,JSON.parse(JSON.stringify(l.task))]));})();
  const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  return http.createServer(async (req,res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(pathname==='/api/health'&&req.method==='GET'){json(res,200,{status:'ok',service:'tehnici-web',labs:evaluatorUrl?'remote':production?'not-configured':'development'});return;}
      if(pathname==='/project' || pathname.startsWith('/project/')) {
        if(pathname==='/project') { res.writeHead(302,{Location:'/project/'});res.end();return; }
        projectPromise ||= require('../project-reference/app.js').createApp().then(app=>{app.locals.basePath='/project';return app;});
        const app=await projectPromise;
        req.url=req.url.slice('/project'.length);
        app(req,res);
        return;
      }
      if(pathname==='/api/check' && req.method==='POST'){
        const parts=[];let bytes=0;for await(const chunk of req){bytes+=Buffer.byteLength(chunk);if(bytes>120000){json(res,413,{error:'Codul depășește dimensiunea permisă.'});return;}parts.push(Buffer.from(chunk));}const body=Buffer.concat(parts).toString('utf8');
        let input;try{input=JSON.parse(body);}catch{json(res,400,{error:'Cererea trebuie să conțină JSON valid.'});return;}
        const task=(await tasks()).get(input?.id);
        if(!task||!['scss','ejs','sql','node','express'].includes(task.mode)||typeof input.code!=='string'){json(res,400,{error:'Exercițiu sau cod invalid.'});return;}
        if(production&&!['node','express'].includes(task.mode)){json(res,400,{error:'Acest exercițiu se verifică în browser.'});return;}
        if(production&&!evaluatorUrl){json(res,503,{error:'Evaluatorul Node/Express nu este încă activat pe platformă.'});return;}
        if(activeChecks>=maxChecks){res.setHeader('Retry-After','3');json(res,429,{error:'Evaluatorul este ocupat. Încearcă din nou în câteva secunde.'});return;}
        activeChecks++;
        try{
        if(evaluatorUrl){
          // This endpoint belongs to a separately isolated execution service.
          // The App Service itself never executes student code in production.
          const response=await evaluatorFetch(evaluatorUrl,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(evaluatorToken?{Authorization:'Bearer '+evaluatorToken}:{})},body:JSON.stringify({task,code:input.code}),signal:AbortSignal.timeout(sandbox?40000:15000)});
          if(!response.ok){json(res,502,{error:'Evaluatorul nu este disponibil momentan.'});return;}
          const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.byteLength;if(size>1048576)throw new Error('Evaluator response too large');chunks.push(Buffer.from(chunk));}
          const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if(!value||!((Array.isArray(value.results)&&value.results.length>0&&value.results.every(r=>r&&typeof r.passed==='boolean'))||typeof value.compiled==='string'||typeof value.rendered==='string'))throw new Error('Invalid evaluator response');
          json(res,200,value);return;
        }
        const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code:input.code},resourceLimits:{maxOldGenerationSizeMb:192}});
        const result=await new Promise(resolve=>{
          let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);worker.terminate();resolve(value);};
          const timer=setTimeout(()=>finish({results:[{label:'Limită de execuție',passed:false,error:'Execuția a fost oprită după 12 secunde. Verifică buclele și cerința.'}]}),12000);
          worker.on('message',finish);worker.on('error',e=>finish({results:[{label:'Laborator',passed:false,error:e.message}]}));
          worker.on('exit',code=>{if(code!==0&&!done)finish({results:[{label:'Laborator',passed:false,error:'Procesul de verificare s-a oprit.'}]});});
        });
        json(res,200,result);return;
        }catch{json(res,502,{error:'Evaluatorul nu a putut finaliza verificarea.'});return;}
        finally{activeChecks--;}
      }
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      if (/^site\/(?:sources\.js|source-)/.test(relative)) { res.writeHead(404); res.end('Pagina nu exista.'); return; }
      if (relative !== 'index.html' && !/^site\/[a-zA-Z0-9._-]+$/.test(relative)) { res.writeHead(404); res.end('Pagina nu există.'); return; }
      const target = path.resolve(root,relative);
      if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      const file=await loadStatic(target);
      const headers={'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':production?'public, no-cache':'no-store','X-Content-Type-Options':'nosniff','ETag':'W/'+file.etag,'Vary':'Accept-Encoding'};
      if(production&&(req.method==='GET'||req.method==='HEAD')&&(req.headers['if-none-match']||'').split(',').some(tag=>tag.trim().replace(/^W\//,'')===file.etag||tag.trim()==='*')){
        res.writeHead(304,headers);res.end();return;
      }
      let content=file.content;
      const acceptsGzip=(req.headers['accept-encoding']||'').split(',').some(entry=>{
        const [encoding,...parameters]=entry.trim().toLowerCase().split(';');
        const quality=parameters.map(value=>value.trim()).find(value=>value.startsWith('q='));
        return encoding==='gzip'&&(quality===undefined||Number(quality.slice(2))>0);
      });
      if(content.length>=1024&&/\.(?:html|css|js|json|svg|wasm|data)$/.test(target)&&acceptsGzip){
        file.compressed??=compress(content).catch(error=>{file.compressed=undefined;throw error;});
        content=await file.compressed;headers['Content-Encoding']='gzip';
      }
      headers['Content-Length']=content.length;
      res.writeHead(200,headers);
      res.end(req.method==='HEAD'?undefined:content);
    } catch { res.writeHead(404); res.end('Pagina nu există.'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const {port,host}=runtimeSettings(process.env,process.argv[2]);
  const server=createServer();
  server.requestTimeout=20000;server.headersTimeout=10000;server.keepAliveTimeout=5000;
  server.listen(port,host,() => console.log(`Tehnici Web listening on ${host}:${port}`));
  const stop=()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),15000).unref();};
  process.once('SIGTERM',stop);process.once('SIGINT',stop);
}
