import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createEvaluator} from '../evaluator/server.mjs';
import {createSessionEvaluator} from './azure-sessions.mjs';
import {createServer} from './serve.mjs';
import {inject} from './inject.mjs';

const context={window:{}};vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const lessons=JSON.parse(JSON.stringify(context.window.TW_COURSE.chapters.flatMap(c=>c.lessons))).filter(l=>['node','express'].includes(l.task.mode));
async function call(server,body,path='/evaluate',method='POST'){
  try{return await inject(server.listeners('request')[0],{path,method,body,timeout:12000});}finally{server.close();}
}
const selectedLessons=process.argv.includes('--adapter-only')?[]:lessons;
for(const lesson of selectedLessons){
  for(const [code,expected] of [[lesson.task.solution,true],['',false]]){
    const response=await call(createEvaluator(),JSON.stringify({task:lesson.task,code}));
    assert.equal(response.status,200,lesson.id);
    const result=JSON.parse(response.body);
    assert.equal(Boolean(result.results?.length&&result.results.every(r=>r.passed)),expected,lesson.id+': '+response.body);
  }
  if((lessons.indexOf(lesson)+1)%10===0)console.log('Verified session exercises:',lessons.indexOf(lesson)+1,'/',lessons.length);
}
const task=lessons.find(l=>l.task.mode==='node').task;
const payload=JSON.stringify({task,code:task.solution});
const once=createEvaluator();
assert.equal((await call(once,payload)).status,200);
assert.equal((await call(once,payload)).status,409);
assert.equal((await call(createEvaluator(),'{')).status,400);
assert.equal((await call(createEvaluator(),'x'.repeat(524289))).status,413);
assert.equal((await call(createEvaluator(),JSON.stringify({task:{mode:'sql'},code:''}))).status,400);
const timeout=await call(createEvaluator({timeoutMs:100}),JSON.stringify({task,code:'while(true){}'}));
assert.equal(timeout.status,200);assert.equal(JSON.parse(timeout.body).results[0].passed,false);

const env={IDENTITY_ENDPOINT:'http://identity.local/token',IDENTITY_HEADER:'identity-header'};
const endpoint='https://pool.example.westeurope.azurecontainerapps.io';
const calls=[];
const fake=async(url,options)=>{
  url=new URL(url);calls.push({url,options});
  assert.equal(options.redirect,'error');
  if(url.hostname==='identity.local'){
    assert.equal(url.searchParams.get('resource'),'https://dynamicsessions.io');
    assert.equal(options.headers['X-IDENTITY-HEADER'],'identity-header');
    return Response.json({access_token:'entra-token'});
  }
  assert.equal(options.headers.Authorization,'Bearer entra-token');
  assert(!('X-IDENTITY-HEADER' in options.headers));
  if(url.pathname.endsWith('/stopSession'))return new Response('Stopped');
  assert.equal(url.pathname,'/evaluate');
  return Response.json({results:[{label:'Remote',passed:true}]});
};
const evaluate=createSessionEvaluator({endpoint,env,fetchImpl:fake});
for(let i=0;i<2;i++)assert.equal((await evaluate(endpoint,{method:'POST',body:payload})).status,200);
const executions=calls.filter(c=>c.url.pathname==='/evaluate');
assert.notEqual(executions[0].url.searchParams.get('identifier'),executions[1].url.searchParams.get('identifier'));
for(const execution of executions)assert(calls.some(c=>c.url.pathname.endsWith('/stopSession')&&c.url.searchParams.get('identifier')===execution.url.searchParams.get('identifier')));
let stopped=false;
const broken=createSessionEvaluator({endpoint,env,fetchImpl:async(url,options)=>{
  if(new URL(url).hostname==='identity.local')return fake(url,options);
  if(new URL(url).pathname.endsWith('/stopSession')){stopped=true;return new Response('Stopped');}
  throw new Error('Network failure');
}});
await assert.rejects(()=>broken(endpoint,{method:'POST',body:payload}));assert(stopped);
assert.throws(()=>createSessionEvaluator({endpoint:'http://pool.azurecontainerapps.io'}));
assert.throws(()=>createSessionEvaluator({endpoint:'https://evil.example'}));
let cleanupAfterLarge=false;
const oversized=createSessionEvaluator({endpoint,env,fetchImpl:async(url,options)=>{
  if(new URL(url).hostname==='identity.local')return fake(url,options);
  if(new URL(url).pathname.endsWith('/stopSession')){cleanupAfterLarge=true;return new Response('Stopped');}
  return new Response('x'.repeat(1048577));
}});
await assert.rejects(()=>oversized(endpoint,{method:'POST',body:payload}));assert(cleanupAfterLarge);
await assert.rejects(()=>createSessionEvaluator({endpoint,env:{}})(endpoint,{}));
const app=createServer({production:true,sessionEndpoint:endpoint,env,fetch:fake});
const response=await call(app,JSON.stringify({id:task.id,code:task.solution}),'/api/check');
assert.equal(response.status,200);assert(JSON.parse(response.body).results[0].passed);
assert.throws(()=>createServer({sessionEndpoint:endpoint,evaluatorUrl:'https://other.example'}));
console.log(`PASS: ${selectedLessons.length} Node/Express solutions and negative controls through the session handler; single use, timeout, limits, managed identity, unique sessions, cleanup on failure and production integration. Azure/Docker deployment not tested.`);
