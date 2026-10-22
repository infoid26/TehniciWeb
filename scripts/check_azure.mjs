import assert from 'node:assert/strict';
import {createServer,runtimeSettings} from './serve.mjs';
import {inject} from './inject.mjs';
import './check_performance.mjs';
assert.deepEqual(runtimeSettings({}),{port:8088,host:'127.0.0.1',production:false});
assert.deepEqual(runtimeSettings({PORT:'8123',WEBSITE_SITE_NAME:'infoid26'}),{port:8123,host:'0.0.0.0',production:true});
assert.equal(runtimeSettings({PORT:'8123'},'9999').port,8123);
assert.throws(()=>runtimeSettings({PORT:'invalid'}));
const request=async(options,path='/api/health',body)=>{
 const server=createServer(options),handler=server.listeners('request')[0];
 try{return await inject(handler,{path,method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json'},body,timeout:20000});}
 finally{server.close();}
};
let response=await request({production:true});
assert.equal(response.status,200);assert.equal(JSON.parse(response.body).labs,'not-configured');
response=await request({production:true},'/');assert.equal(response.status,200);assert(response.body.includes('Tehnici Web'));
const payload=JSON.stringify({id:'node-read',code:'throw new Error("must not execute in production");'});
response=await request({production:true},'/api/check',payload);assert.equal(response.status,503);
response=await request({production:true},'/api/check','{');assert.equal(response.status,400);
response=await request({production:true},'/api/check','x'.repeat(120001));assert.equal(response.status,413);
assert.throws(()=>createServer({evaluatorUrl:'http://example.com/check'}));
let calls=0;
response=await request({production:true,evaluatorUrl:'https://evaluator.example/check',evaluatorToken:'test-token',fetch:async(url,options)=>{
 calls++;assert.equal(url,'https://evaluator.example/check');assert.equal(options.headers.Authorization,'Bearer test-token');assert.equal(options.redirect,'error');
 const input=JSON.parse(options.body);assert.equal(input.task.id,'node-read');assert(input.task.files);assert.equal(input.code,JSON.parse(payload).code);
 return new Response(JSON.stringify({results:[{label:'Test',passed:true}]}),{headers:{'Content-Type':'application/json'}});
}},'/api/check',payload);
assert.equal(response.status,200);assert.equal(calls,1);assert(JSON.parse(response.body).results[0].passed);
response=await request({production:true,evaluatorUrl:'https://evaluator.example/check',fetch:async()=>new Response('{}')},'/api/check',payload);assert.equal(response.status,502);
const server=createServer({production:true,evaluatorUrl:'https://evaluator.example/check',fetch:async()=>{await new Promise(resolve=>setTimeout(resolve,30));return new Response('{"results":[{"passed":true}]}');}});
try{
 const handler=server.listeners('request')[0];
 const responses=await Promise.all(Array.from({length:3},()=>inject(handler,{path:'/api/check',method:'POST',body:payload})));
 assert.equal(responses.filter(r=>r.status===200).length,2);assert.equal(responses.filter(r=>r.status===429).length,1);
}finally{server.close();}
console.log('PASS: Azure port/binding, health, static course, input limits, production isolation gate, remote evaluator contract and concurrency limit. Cloud deployment not tested.');
