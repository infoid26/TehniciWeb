// Execute the shipped browser bundles with a worker message bridge in Node.
// This checks compilers and protocols; it does not replace an actual browser test.
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {Worker} from 'node:worker_threads';
import assert from 'node:assert/strict';
const context={window:{}};
vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const lessons=JSON.parse(JSON.stringify(context.window.TW_COURSE.chapters.flatMap(c=>c.lessons)));
function workerRun(task,code){
 return new Promise((resolve,reject)=>{
  const file=task.mode==='sql'?'sql-worker.js':'template-worker.js';
  const bridge=`const {parentPort}=require('node:worker_threads');const fs=require('node:fs/promises');const nativeFetch=fetch;globalThis.fetch=async(input,options)=>{const url=new URL(typeof input==='string'?input:input.url||input.href);if(url.protocol==='file:'){const bytes=await fs.readFile(url);return new Response(bytes,{headers:{'Content-Type':url.pathname.endsWith('.wasm')?'application/wasm':'application/octet-stream'}});}return nativeFetch(input,options);};globalThis.self=globalThis;self.postMessage=value=>parentPort.postMessage(value);globalThis.process=undefined;import(${JSON.stringify(new URL('../site/'+file,import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data}))).catch(e=>{throw e;});`;
  const worker=new Worker(bridge,{eval:true});
  const timer=setTimeout(()=>{worker.terminate();reject(new Error('Worker timeout: '+task.id));},45000);
  worker.once('message',value=>{clearTimeout(timer);worker.terminate();resolve(value);});
  worker.once('error',e=>{clearTimeout(timer);worker.terminate();reject(e);});
  worker.postMessage({task,code});
 });
}
let count=0;
for(const l of lessons.filter(l=>['scss','ejs'].includes(l.task.mode))){
 const result=await workerRun(l.task,l.task.solution);
 const field=l.task.mode==='scss'?'compiled':'rendered';
 assert.equal(typeof result[field],'string',l.id+': '+JSON.stringify(result));
 assert(result[field].trim().length,l.id);
 // Both bundles must produce the same output as the native evaluation path.
 const native=JSON.parse(await fs.readFile('.audit/server-results.json','utf8')).find(r=>r.id===l.id);
 assert.equal(result[field],native[field],l.id);
 count++;
}
const sql=lessons.find(l=>l.id==='sql-having');
const good=await workerRun(sql.task,sql.task.solution);
assert(good.every(r=>r.passed),JSON.stringify(good));
const bad=await workerRun(sql.task,'SELECT 0 AS wrong;');
assert(bad.some(r=>!r.passed));
console.log(`PASS: ${count} Sass/EJS browser-bundle outputs match native evaluation; shipped SQL bundle accepts a solution and rejects wrong output. Browser UI not covered.`);
