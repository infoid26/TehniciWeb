import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';
import {parse} from 'acorn';
import {createServer} from './serve.mjs';

// Real HTTP requests verify binary compression, validators and HEAD responses.
const server=createServer({production:true,env:{}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const request=(url,headers={},method='GET')=>new Promise((resolve,reject)=>{
 const req=http.request({host:'127.0.0.1',port:server.address().port,path:url,headers,method},res=>{
  const chunks=[];res.on('data',chunk=>chunks.push(chunk));
  res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));
 });
 req.on('error',reject);req.end();
});
try{
 const original=await fs.readFile('site/course.js');
 const packed=await request('/site/course.js',{'Accept-Encoding':'gzip, deflate, br'});
 assert.equal(packed.status,200);assert.equal(packed.headers['content-encoding'],'gzip');
 assert.deepEqual(gunzipSync(packed.body),original);
 assert(packed.body.length<original.length/2);
 assert.equal(Number(packed.headers['content-length']),packed.body.length);
 const cached=await request('/site/course.js',{'If-None-Match':packed.headers.etag});
 assert.equal(cached.status,304);assert.equal(cached.body.length,0);
 const plain=await request('/site/course.js',{'Accept-Encoding':'gzip;q=0, identity'});
 assert.equal(plain.headers['content-encoding'],undefined);assert.deepEqual(plain.body,original);
 const head=await request('/site/course.js',{'Accept-Encoding':'gzip'},'HEAD');
 assert.equal(head.body.length,0);assert.equal(Number(head.headers['content-length']),packed.body.length);
 const home=await request('/');
 assert(!home.body.toString().includes('src="site/editor.js"'));
 const health=await request('/api/health');assert.equal(health.headers['cache-control'],'no-store');
 const missing=await request('/site/does-not-exist.js');assert.equal(missing.status,404);
 console.log(`PASS: course transfer ${original.length} -> ${packed.body.length} bytes (${Math.round(100*(1-packed.body.length/original.length))}% smaller), gzip round-trip, 304, HEAD, no eager editor and uncached health.`);
}finally{await new Promise(resolve=>server.close(resolve));}

// Execute the shipped loader and router to check download sharing and navigation races.
const source=await fs.readFile('site/app.js','utf8');
const nodes=parse(source,{ecmaVersion:'latest'}).body[0].expression.callee.body.body;
const scripts=[];let homeCount=0;const pages=[];
const main={textContent:'',focus(){}};
const context=vm.createContext({window:{scrollTo(){}},document:{createElement:()=>({remove(){}}),head:{append:script=>scripts.push(script)}},Promise,Error,main,
 location:{hash:'#acasa'},byId:new Map([['example',{id:'example'}]]),home:()=>homeCount++,updateProgress(){},
 quizDone:()=>true,codeDone:()=>false,startStep:()=>3,lessonPage:(lesson,step)=>pages.push({id:lesson.id,step})});
vm.runInContext('let editorPromise;let routeGeneration=0;let cancelRun=null;let running=false;',context);
for(const name of ['loadEditor','route']){
 const fn=nodes.find(node=>node.type==='FunctionDeclaration'&&node.id.name===name);
 vm.runInContext(source.slice(fn.start,fn.end),context);
}
await vm.runInContext('route()',context);assert.equal(scripts.length,0);assert.equal(homeCount,1);
context.location.hash='#lectie/example/3';
const first=vm.runInContext('route()',context);
const second=vm.runInContext('route()',context);
assert.equal(scripts.length,1,'Concurrent routes must share the editor download');
context.location.hash='#acasa';await vm.runInContext('route()',context);
context.window.TW_EDITOR={clear(){}};scripts[0].onload();await Promise.all([first,second]);
assert.equal(pages.length,0,'A stale editor download must not replace the home page');
context.location.hash='#lectie/example/3';await vm.runInContext('route()',context);
assert.equal(pages.length,1);assert.equal(scripts.length,1);
console.log('PASS: home skips editor download; lesson navigation loads it once and ignores stale navigation.');
