import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {createRequire} from 'node:module';
import {parse} from 'acorn';
import {createServer} from './serve.mjs';
import {inject} from './inject.mjs';
import {createEvaluator} from '../evaluator/server.mjs';
const require=createRequire(import.meta.url);
const {parser:cssParser}=createRequire(require.resolve('@codemirror/lang-css'))('@lezer/css');
const {parser:htmlParser}=createRequire(require.resolve('@codemirror/lang-html'))('@lezer/html');
const context={window:{}};
for(const file of ['site/course.js','site/exam-data.js'])vm.runInNewContext(await fs.readFile(file,'utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.TW_COURSE));
const bank=JSON.parse(JSON.stringify(context.window.TW_EXAM.exercises));
const lessons=course.chapters.flatMap(chapter=>chapter.lessons),byId=new Map(lessons.map(item=>[item.id,item]));
const baseline=JSON.parse(await fs.readFile('scripts/course-lesson-ids.json','utf8'));
for(const id of baseline)assert(byId.has(id),'Lost lesson ID: '+id);
const ids=new Set();
for(const item of bank){
 assert(!ids.has(item.id),item.id+' duplicate');ids.add(item.id);
 assert(item.hint&&(item.task?.solution||item.answer),item.id);
 if(item.lessonId)assert(byId.has(item.lessonId),item.id+' missing lesson');
 if(item.task){assert.equal(item.task.id,item.id);if(item.task.mode==='sql')assert(item.task.tables&&item.task.expectedResult,item.id+' missing SQL tables');}
}
const positions=new Map(lessons.map((item,index)=>[item.id,index]));
for(const id of ['node-send-file','node-listen-port','express-all-methods','express-template-engine','express-nodemon'])assert(positions.get('express-first')<positions.get(id),id);
assert(positions.get('storage-model')<positions.get('storage-remove-one'));
assert(byId.get('dulc-filter-dom').task.fixture.includes('value="not"'));
assert(byId.get('ejs-conditions').task.variants.some(item=>item.data.available===false));
for(const file of ['site/app.js','site/exam-session.js','site/exam.js','site/runner.js','scripts/serve.mjs','scripts/lab-worker.mjs','site/template-worker-source.js']){
 parse(await fs.readFile(file,'utf8'),{ecmaVersion:'latest',sourceType:file.endsWith('.mjs')||file.includes('worker-source')?'module':'script'});
}
const html=await fs.readFile('site/exam.html','utf8');
for(const text of ['ID 2025–2026','nodemon','5 minute','3,5 puncte','0,3','15 minute','20 minute','10 minute','2 minute','1 minut','30 de minute'])assert(html.includes(text),text);
assert(!html.includes('id="exam-bank"')&&!html.includes('id="exam-search"'),'Exercise bank must not be visible');
for(const [parser,content] of [[htmlParser,html],[cssParser,await fs.readFile('site/exam.css','utf8')]]){
 parser.parse(content).iterate({enter(node){assert(!node.type.isError,'Page syntax at '+node.from);}});
}
function run(task,code,bundle=false){
 return new Promise((resolve,reject)=>{
  const bridge='const {parentPort}=require("node:worker_threads");const fs=require("node:fs/promises");const nativeFetch=fetch;globalThis.fetch=async(input,options)=>{const url=new URL(typeof input==="string"?input:input.url||input.href);if(url.protocol==="file:"){const bytes=await fs.readFile(url);return new Response(bytes,{headers:{"Content-Type":url.pathname.endsWith(".wasm")?"application/wasm":"application/json"}});}return nativeFetch(input,options);};globalThis.self=globalThis;globalThis.location=new URL("https://training.invalid/site/template-worker.js");self.postMessage=value=>parentPort.postMessage(value);globalThis.process=undefined;import('+JSON.stringify(new URL('../site/template-worker.js',import.meta.url).href)+').then(()=>parentPort.on("message",data=>self.onmessage({data})));';
  const worker=bundle?new Worker(bridge,{eval:true}):new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code}});
  const timeout=setTimeout(()=>{worker.terminate();reject(new Error(task.id+' timed out'));},45000);
  worker.once('message',value=>{clearTimeout(timeout);worker.terminate();resolve(value);});
  worker.once('error',error=>{clearTimeout(timeout);worker.terminate();reject(error);});
  if(bundle)worker.postMessage({task,code});
 });
}
const selectedIds=process.argv.find(value=>value.startsWith('--only='))?.slice(7).split(',');
const report=[],allCandidates=[...bank.filter(item=>item.task),...['node-read-callback','project-sort','project-pg-ejs-route','project-json-error-page','scss-bootstrap','ejs-conditions'].map(id=>byId.get(id))];
const candidates=selectedIds?allCandidates.filter(item=>selectedIds.includes(item.id)):allCandidates;
for(const item of candidates){
 const task=item.task;
 if(['node','express','sql'].includes(task.mode)){
  const good=await run(task,task.solution),bad=await run(task,'');
  report.push({id:item.id,mode:task.mode,passed:good.results?.length>0&&good.results.every(row=>row.passed),negativeRejected:bad.results?.some(row=>!row.passed),failures:good.results?.filter(row=>!row.passed)});
 }else if(task.mode==='js'){
  for(const test of task.cases){
   const input=structuredClone(test.input),before=JSON.stringify(input);
   const result=await vm.runInNewContext(task.solution+'\nsolve(input)',{input},{timeout:1500});
   assert.deepEqual(JSON.parse(JSON.stringify(result)),test.expected,item.id);
   assert.equal(JSON.stringify(input),before,item.id+' mutated input');
  }
  report.push({id:item.id,mode:task.mode,passed:true});
 }else if(['scss','ejs'].includes(task.mode)){
  const good=await run(task,task.solution),field=task.mode==='scss'?'compiled':'rendered';
  assert.equal(typeof good[field],'string',item.id+': '+JSON.stringify(good));
  assert(good[field].length,item.id);
  if(task.bootstrap){
   assert(/h1, \.h1\s*\{\s*font-size: 2\.5rem;/.test(good.compiled),item.id+' h1 configuration');
   assert(good.compiled.includes('.container')&&good.compiled.includes('.btn'),item.id+' genuine Bootstrap');
  }
  const browser=await run(task,task.solution,true);
  assert(browser[field]===good[field],item.id+' shipped worker differs: '+JSON.stringify(browser.results));
  const bad=await run(task,'');
  assert(!bad[field]?.trim(),item.id+' empty answer');
  for(const variant of task.variants||[]){
   const other=await run({...task,...variant,variants:undefined},task.solution,true);
   assert.equal(typeof other[field],'string',item.id+' variant');
   for(const test of variant.tests||[])if(test.kind==='text')assert(other.rendered.includes(test.value),item.id+' variant');
  }
  report.push({id:item.id,mode:task.mode,passed:true,limit:'Actual compilation/rendering; visual selectors not executed'});
 }else{
  if(task.mode==='dom')parse(task.solution,{ecmaVersion:'latest'});
  if(task.mode==='css')cssParser.parse(task.solution);
  if(task.mode==='html')htmlParser.parse(task.solution);
  report.push({id:item.id,mode:task.mode,passed:true,limit:'Syntax only; DOM/layout requires a browser'});
 }
 if(report.length%15===0)console.log('CLI exercise checks:',report.length);
}
await fs.mkdir('.audit',{recursive:true});
await fs.writeFile('.audit/exam-cli-results.json',JSON.stringify(report,null,2));
const failures=report.filter(row=>!row.passed||row.negativeRejected===false);
console.log(JSON.stringify({exercises:bank.length,checked:report.length,failures},null,2));
assert.equal(failures.length,0,'See .audit/exam-cli-results.json');
const server=createServer();
try{
 const handler=server.listeners('request')[0];
 for(const url of ['/examen','/examen/','/site/exam.js','/site/exam-data.js','/site/bootstrap-scss.json'])assert.equal((await inject(handler,{path:url})).status,200,url);
 for(const id of ['exam-server-gallery-periods','exam-server-clock-folder','exam-bridge-project-pg-ejs-route']){
  const item=bank.find(item=>item.id===id);
  const response=await inject(handler,{path:'/api/check',method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,code:item.task.solution}),timeout:30000});
  assert.equal(response.status,200,id);
  const result=JSON.parse(response.body);assert(result.results?.length>0&&result.results.every(row=>row.passed),id+': '+response.body);
 }
 for(const id of ['exam-bridge-project-pg-ejs-route','exam-server-gallery-periods']){
  const evaluator=createEvaluator();
  try{
   const item=bank.find(item=>item.id===id);
   const response=await inject(evaluator.listeners('request')[0],{path:'/evaluate',method:'POST',body:JSON.stringify({task:item.task,code:item.task.solution}),timeout:15000});
   assert.equal(response.status,200,id+' isolated evaluator');
   assert(JSON.parse(response.body).results.every(row=>row.passed),id+' isolated evaluator: '+response.body);
  }finally{evaluator.close();}
 }
 const invalid=await inject(handler,{path:'/api/check',method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'not-a-real-exercise',code:'anything'})});
 assert.equal(invalid.status,400);
}finally{await server.closeProgress();server.close();}
console.log('PASS: '+baseline.length+' preserved lesson IDs; '+bank.length+' exam entries; runtime solutions, native/shipped Sass/EJS, variants, syntax and HTTP. No browser was launched; DOM/layout was not verified.');
