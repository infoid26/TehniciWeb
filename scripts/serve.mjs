import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {Worker} from 'node:worker_threads';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
let projectPromise;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.webp':'image/webp'};
export function createServer() {
  return http.createServer(async (req,res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(pathname==='/project' || pathname.startsWith('/project/')) {
        if(pathname==='/project') { res.writeHead(302,{Location:'/project/'});res.end();return; }
        projectPromise ||= require('../project-reference/app.js').createApp().then(app=>{app.locals.basePath='/project';return app;});
        const app=await projectPromise;
        req.url=req.url.slice('/project'.length);
        app(req,res);
        return;
      }
      if(pathname==='/api/check' && req.method==='POST'){
        let body='';for await(const chunk of req){body+=chunk;if(body.length>120000){res.writeHead(413);res.end();return;}}
        const input=JSON.parse(body);const context={window:{}};
        vm.runInNewContext(await fs.readFile(path.join(root,'site/course.js'),'utf8'),context);
        const task=context.window.TW_COURSE.chapters.flatMap(c=>c.lessons).find(l=>l.id===input.id)?.task;
        if(!task||!['scss','ejs','sql','node','express'].includes(task.mode)||typeof input.code!=='string'){res.writeHead(400);res.end('{}');return;}
        const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task:JSON.parse(JSON.stringify(task)),code:input.code}});
        const result=await new Promise(resolve=>{
          let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);worker.terminate();resolve(value);};
          const timer=setTimeout(()=>finish({results:[{label:'Limită de execuție',passed:false,error:'Execuția a fost oprită după 12 secunde. Verifică buclele și cerința.'}]}),12000);
          worker.on('message',finish);worker.on('error',e=>finish({results:[{label:'Laborator',passed:false,error:e.message}]}));
          worker.on('exit',code=>{if(code!==0&&!done)finish({results:[{label:'Laborator',passed:false,error:'Procesul de verificare s-a oprit.'}]});});
        });
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(result));return;
      }
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      if (relative !== 'index.html' && !/^site\/[a-zA-Z0-9._-]+$/.test(relative)) { res.writeHead(404); res.end('Pagina nu există.'); return; }
      const target = path.resolve(root,relative);
      if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      const content = await fs.readFile(target);
      res.writeHead(200,{'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(content);
    } catch { res.writeHead(404); res.end('Pagina nu există.'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 8088);
  createServer().listen(port,'127.0.0.1',() => console.log(`Tehnici Web: http://127.0.0.1:${port}`));
}
