import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createSandboxEvaluator,sandboxSettings} from './azure-sandboxes.mjs';
import {createServer} from './serve.mjs';
import {inject} from './inject.mjs';
const env={LAB_AZURE_SUBSCRIPTION_ID:'11111111-1111-4111-8111-111111111111',LAB_AZURE_RESOURCE_GROUP:'infoid_group',LAB_AZURE_SANDBOX_GROUP:'tw-labs',LAB_AZURE_SANDBOX_DISK_ID:'22222222-2222-4222-8222-222222222222'};
const id='33333333-3333-4333-8333-333333333333';
const calls=[];let inputFile;
const payload=JSON.stringify({task:{mode:'node'},code:'process.exit(); $(touch /tmp/oops) `example` "quotes"'});
const fake=async(args,options)=>{
 calls.push({args,options});
 assert(args.includes('--managed-identity'));assert(args.includes('system'));
 if(args[1]==='create'){
  for(const value of ['250m','512Mi','Deny','Full'])assert(args.includes(value));
  assert(!args.includes('--env')&&!args.includes('--port'));
  return JSON.stringify({id});
 }
 if(args[1]==='fs'){
  inputFile=args[3];assert.equal(await fs.readFile(inputFile,'utf8'),payload);assert.equal(args[4],id+':/tmp/tw-input.json');
 }
 if(args[1]==='exec'){
  assert(args.includes('--id')&&args.includes(id));assert(!args.includes('--selector'));
  assert(!args.join(' ').includes('process.exit'));assert(!args.join(' ').includes('$(touch'));
  return JSON.stringify({exitCode:0,stdout:'{"results":[{"passed":true}]}'});
 }
 return '{}';
};
assert.equal(sandboxSettings({}),null);
assert.throws(()=>sandboxSettings({LAB_AZURE_SANDBOX_GROUP:'tw-labs'}));
const evaluate=createSandboxEvaluator({env,runCommand:fake});
for(let i=0;i<2;i++)assert.equal((await evaluate('',{body:payload})).status,200);
assert.notEqual(calls.filter(c=>c.args[1]==='create')[0].args.find(x=>x.startsWith('name=')),calls.filter(c=>c.args[1]==='create')[1].args.find(x=>x.startsWith('name=')));
for(const create of calls.filter(c=>c.args[1]==='create')){
 const label=create.args.find(x=>x.startsWith('name='));
 assert(calls.some(c=>c.args[1]==='delete'&&c.args.includes('--id')&&c.args.includes(id)));
}
await assert.rejects(()=>fs.access(inputFile));
// Regression: real ACA preview.4 creation output is text despite --output json.
for(const output of [`Created sandbox: ${id}\n`,`Created sandbox: ${id}\r\n`]){
 const steps=[];
 const textEvaluator=createSandboxEvaluator({env,runCommand:async(args,options)=>{
  steps.push(args[1]);
  return args[1]==='create'?output:fake(args,options);
 }});
 const response=await textEvaluator('',{body:payload});
 assert(JSON.parse(await response.text()).results[0].passed);
 assert.deepEqual(steps,['create','lifecycle','fs','exec','delete']);
 await assert.rejects(()=>fs.access(inputFile));
}
for(const output of ['{}',`Created sandbox: invalid`,`Unexpected ${id}`,`Created sandbox: ${id}\nextra output`]){
 const steps=[];
 const invalid=createSandboxEvaluator({env,runCommand:async args=>{
  steps.push(args[1]);return args[1]==='create'?output:'{}';
 }});
 await assert.rejects(()=>invalid('',{body:payload}),/Missing sandbox ID/);
 assert.deepEqual(steps,['create','delete']);
}
// Real exec output is the evaluator JSON itself, including ordinary failed tests.
for(const passed of [true,false]){
 const body=JSON.stringify({results:[{label:'Testul 1',input:'app.js',expected:'.js',actual:passed?'.js':'.txt',passed}]});
 const steps=[];
 const direct=createSandboxEvaluator({env,runCommand:async(args,options)=>{
  steps.push(args[1]);
  if(args[1]==='create')return `Created sandbox: ${id}\n`;
  if(args[1]==='exec')return body;
  return fake(args,options);
 }});
 assert.equal(await (await direct('',{body:payload})).text(),body);
 assert.deepEqual(steps,['create','lifecycle','fs','exec','delete']);
 await assert.rejects(()=>fs.access(inputFile));
}
for(const output of ['null','{}','not json','{"results":[{"passed":"true"}]}',JSON.stringify({exitCode:1,stdout:'{"results":[{"passed":true}]}'}),JSON.stringify({exit_code:2,results:[{passed:true}]})]){
 let deleted=false;
 const invalid=createSandboxEvaluator({env,runCommand:async(args,options)=>{
  if(args[1]==='exec')return output;
  if(args[1]==='delete')deleted=true;
  return fake(args,options);
 }});
 await assert.rejects(()=>invalid('',{body:payload}));
 assert(deleted,'Invalid exec output must still delete sandbox');
}
for(const failAt of ['create','exec','fs']){
 let deleted=false;
 const broken=createSandboxEvaluator({env,runCommand:async args=>{
  if(args[1]==='delete'){deleted=true;return '{}';}
  if(args[1]===failAt)throw new Error('Simulated failure');
  return fake(args,{});
 }});
 await assert.rejects(()=>broken('',{body:payload}));assert(deleted,failAt);
}
// A failed setup call must not delete the sandbox while its sibling still runs.
let finishUpload;let uploadFinished=false;let setupFailed;
const failedSetup=new Promise(resolve=>{setupFailed=resolve;});
const overlapping=createSandboxEvaluator({env,runCommand:async(args)=>{
 if(args[1]==='create')return JSON.stringify({id});
 if(args[1]==='lifecycle'){assert(args.includes('--id'));setupFailed();throw new Error('Setup failure');}
 if(args[1]==='fs')return new Promise(resolve=>{finishUpload=()=>{uploadFinished=true;resolve('{}');};});
 if(args[1]==='exec')assert.fail('Do not execute after setup failure');
 if(args[1]==='delete'){assert(uploadFinished,'Wait for upload before deleting');return '{}';}
}});
const failedEvaluation=overlapping('',{body:payload});
const rejected=assert.rejects(()=>failedEvaluation,/Setup failure/);
await failedSetup;assert.equal(uploadFinished,false);assert.equal(typeof finishUpload,'function');
finishUpload();await rejected;
let failures=0;
const cleanupBroken=createSandboxEvaluator({env,runCommand:async args=>{
 if(args[1]==='delete')throw new Error('Delete failed');return fake(args,{});
},onCleanupError:()=>failures++});
await cleanupBroken('',{body:payload});assert.equal(failures,1);
await assert.rejects(()=>cleanupBroken('',{body:payload}),/paused/);
const app=createServer({production:true,env,sandboxCommand:async(args,options)=>{
 if(args[1]==='fs')return '{}';return fake(args,options);
}});
try{
 const response=await inject(app.listeners('request')[0],{path:'/api/check',method:'POST',body:JSON.stringify({id:'node-read',code:'function solve(){return "ok";}'})});
 assert.equal(response.status,200);assert(JSON.parse(response.body).results[0].passed);
 assert.throws(()=>createServer({env,sessionEndpoint:'https://example.azurecontainerapps.io'}));
}finally{app.close();}
console.log('PASS: fresh sandbox per request, deny egress, resource limits, file upload without shell interpolation, deletion on create/exec/upload failure, cleanup failure gate and production API. Azure CLI/cloud not executed.');
