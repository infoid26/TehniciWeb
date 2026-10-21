import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Worker} from 'node:worker_threads';

// This entire process belongs INSIDE a disposable, isolated session. Worker/VM
// limits are robustness measures; Azure's Hyper-V session is the trust boundary.
export function createEvaluator({timeoutMs=8000}={}) {
  let used=false;
  const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  return http.createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://session').pathname;
    if(req.method==='GET'&&pathname==='/health'){json(res,200,{status:'ok',service:'tehnici-web-session'});return;}
    if(req.method!=='POST'||pathname!=='/evaluate'){json(res,404,{error:'Not found'});return;}
    // Each container accepts at most one valid evaluation, including after failure.
    if(used){json(res,409,{error:'This session has already been used.'});return;}
    let worker;
    try{
      const chunks=[];let size=0;
      for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>524288){json(res,413,{error:'Request too large'});return;}chunks.push(Buffer.from(chunk));}
      let input;try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{json(res,400,{error:'Invalid JSON'});return;}
      if(!input?.task||!['node','express'].includes(input.task.mode)||typeof input.code!=='string'||Buffer.byteLength(input.code)>120000){json(res,400,{error:'Invalid exercise'});return;}
      // A concurrent request may have finished reading its body first.
      if(used){json(res,409,{error:'This session has already been used.'});return;}
      used=true;
      worker=new Worker(new URL('../scripts/lab-worker.mjs',import.meta.url),{workerData:input,env:{NODE_ENV:'production'},resourceLimits:{maxOldGenerationSizeMb:192}});
      const result=await new Promise(resolve=>{
        let done=false;
        const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolve(value);};
        const failure=error=>({results:[{label:'Executare',passed:false,error}]});
        const timer=setTimeout(()=>finish(failure('Limita de timp a fost depășită. Verifică buclele din cod.')),timeoutMs);
        worker.once('message',finish);
        worker.once('error',()=>finish(failure('Codul nu a putut fi executat.')));
        worker.once('exit',()=>finish(failure('Execuția s-a oprit înainte de rezultat.')));
      });
      await worker.terminate();
      const output=JSON.stringify(result);
      if(Buffer.byteLength(output)>1048576){json(res,200,{results:[{label:'Rezultat',passed:false,error:'Rezultatul este prea mare.'}]});return;}
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(output);
    }catch{json(res,500,{error:'Evaluation failed'});}
    finally{await worker?.terminate();}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const server=createEvaluator();server.requestTimeout=12000;server.headersTimeout=5000;
  server.listen(8080,'0.0.0.0',()=>console.log('Tehnici Web session ready'));
}
