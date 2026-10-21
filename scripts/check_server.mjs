import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {createServer} from './serve.mjs';
import {inject} from './inject.mjs';
const context={window:{}};vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const lessons=JSON.parse(JSON.stringify(context.window.TW_COURSE.chapters.flatMap(c=>c.lessons)));
async function run(task,code) {
 return new Promise(resolve=>{
  const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code}});
  const timer=setTimeout(()=>{worker.terminate();resolve({results:[{passed:false,error:'Timeout'}]});},18000);
  worker.once('message',value=>{clearTimeout(timer);worker.terminate();resolve(value);});
  worker.once('error',e=>{clearTimeout(timer);worker.terminate();resolve({results:[{passed:false,error:e.message}]});});
 });
}
const integrationOnly=process.argv.includes('--integration-only');
const newOnly=process.argv.includes('--new');
const results=integrationOnly||newOnly?JSON.parse(await fs.readFile('.audit/server-results.json','utf8')).filter(r=>r.passed&&r.negativeRejected&&(!process.argv.includes('--refresh-runtime')||!['node','express'].includes(r.mode))):[];
const existing=new Set(results.filter(r=>r.passed&&r.negativeRejected).map(r=>r.id));
for(const lesson of (integrationOnly?[]:lessons.filter(l=>['scss','ejs','sql','node','express'].includes(l.task.mode)&&(!newOnly||!existing.has(l.id))))) {
 const good=await run(lesson.task,lesson.task.solution);
 const bad=await run(lesson.task,'');
 const success=typeof good.compiled==='string' || typeof good.rendered==='string' || (good.results?.length && good.results.every(t=>t.passed));
 const negative=typeof bad.compiled==='string'?bad.compiled==='':typeof bad.rendered==='string'?bad.rendered==='':!bad.results?.every(t=>t.passed);
 results.push({id:lesson.id,mode:lesson.task.mode,passed:!!success,negativeRejected:negative,detail:success?undefined:good,compiled:good.compiled,rendered:good.rendered});
 if(results.length%5===0){await fs.writeFile('.audit/server-results.json',JSON.stringify(results,null,2));console.log('Checked',results.length,'server exercises');}
}
await fs.writeFile('.audit/server-results.json',JSON.stringify(results,null,2));
console.log('Failures:',JSON.stringify(results.filter(r=>!r.passed||!r.negativeRejected),null,2));
assert(results.every(r=>r.passed&&r.negativeRejected),'Server exercise failures');
const server=createServer();const handler=server.listeners('request')[0];
try {
 for(const [route,status,text] of [['/',200,'Tehnici Web'],['/site/journey.css',200,'.node-bubble'],['/project/',200,'Sweet Corner'],['/project/products',200,'Chocolate cake'],['/project/product/1',200,'Chocolate cake'],['/project/product/abc',400,'Invalid request'],['/project/product/999',404,'Page not found'],['/project/missing',404,'Page not found'],['/project/assets/css/site.css',200,'.product-card'],['/project/assets/images/cake-300.webp',200,null]]) {
  const response=await inject(handler,{path:route,timeout:20000});assert.equal(response.status,status,route);if(text)assert(response.body.includes(text),route);console.log(status,route);
 }
 const res=await inject(handler,{path:'/api/check',method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'node-read',code:lessons.find(l=>l.id==='node-read').task.solution})});assert.equal(res.status,200);assert(JSON.parse(res.body).results.every(t=>t.passed));
 console.log('PASS:',results.length,'server exercises with negative controls; HTTP routes, data, templates, compilation, images, API.');
} finally {server.closeAllConnections();server.close();}
