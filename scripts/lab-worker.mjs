import {parentPort,workerData} from 'node:worker_threads';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import url from 'node:url';
import querystring from 'node:querystring';
import assert from 'node:assert/strict';
import express from 'express';
import ejs from 'ejs';
import * as sass from 'sass';
import {inject} from './inject.mjs';

const {task,code}=workerData;
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function virtualFS(files){
 const data={...files};
 const key=p=>path.posix.normalize(String(p).replaceAll('\\','/')).replace(/^\/project\//,'');
 const directories=new Set(['.']);
 for(const name of Object.keys(data)){let parent=path.posix.dirname(name);while(parent!=='.'){directories.add(parent);parent=path.posix.dirname(parent);}}
 const directory=p=>directories.has(key(p));
 const mkdir=(p,options={})=>{
  const name=key(p);if(name in data)throw new Error(`EEXIST: ${name}`);
  if(directory(name)){if(options.recursive)return;throw new Error(`EEXIST: ${name}`);}
  const parent=path.posix.dirname(name);
  if(!directory(parent)){if(!options.recursive)throw new Error(`ENOENT: ${parent}`);mkdir(parent,options);}
  directories.add(name);
 };
 return {
  readFileSync(p,encoding){const k=key(p);if(!(k in data))throw new Error(`ENOENT: ${k}`);return encoding?data[k]:Buffer.from(data[k]);},
  existsSync:p=>key(p) in data||directory(p),
  lstatSync(p){const file=key(p) in data,dir=directory(p);if(!file&&!dir)throw new Error(`ENOENT: ${p}`);return {isFile:()=>file,isDirectory:()=>dir};},
  lstat(p,callback){setTimeout(()=>{try{callback(null,this.lstatSync(p));}catch(e){callback(e);}},0);},
  readdirSync(p){if(!directory(p))throw new Error(`ENOENT: ${p}`);return [...new Set([...Object.keys(data),...directories].filter(k=>k!==key(p)&&path.posix.dirname(k)===key(p)).map(k=>path.posix.basename(k)))];},
  writeFileSync(p,value){data[key(p)]=String(value);},
  mkdirSync:mkdir,
  mkdir(p,options,callback){if(typeof options==='function'){callback=options;options={};}setTimeout(()=>{try{mkdir(p,options);callback(null);}catch(e){callback(e);}},0);},
  copyFileSync(a,b){if(!(key(a) in data))throw new Error(`ENOENT: ${a}`);data[key(b)]=data[key(a)];},
  readFile(p,encoding,callback){try{callback(null,this.readFileSync(p,encoding));}catch(e){callback(e);}},
  promises:{async readFile(p,encoding){const k=key(p);if(!(k in data))throw new Error(`ENOENT: ${k}`);return encoding?data[k]:Buffer.from(data[k]);}},
 };
}
async function run(){
 if(task.mode==='scss'){
  const css=sass.compileString(code,{importers:[{canonicalize(url){return Object.hasOwn(task.files||{},url)||Object.hasOwn(task.files||{},'_'+url.replace(/\.scss$/,'')+'.scss')?new URL(url,'virtual:///'):null;},load(url){const name=url.pathname.slice(1);const content=task.files?.[name]??task.files?.['_'+name.replace(/\.scss$/,'')+'.scss'];return content===undefined?null:{contents:content,syntax:'scss'};}}],style:'expanded'}).css;
  return {compiled:css};
 }
 if(task.mode==='ejs'){
  const rendered=ejs.render(code,task.data||{},{filename:'/virtual/page.ejs',includer(name){const content=task.partials?.[name];if(content===undefined)throw new Error(`Unknown training partial: ${name}`);return {template:content};}});
  return {rendered};
 }
 if(task.mode==='sql'){
  const {PGlite}=await import('@electric-sql/pglite');const db=new PGlite();
  try{
   if(task.setup)await db.exec(task.setup);
   const results=await db.exec(code);
   const rows=task.checkQuery?(await db.exec(task.checkQuery)).at(-1)?.rows:results.at(-1)?.rows;
   return {results:[{label:'Rezultatul PostgreSQL',expected:task.expected,actual:rows,passed:canonical(rows)===canonical(task.expected)}]};
  }finally{await db.close();}
 }
 // Express checks RegExp with instanceof; literals created inside vm belong to
 // another realm. Recreate only route patterns in the host realm at the boundary.
 const routePath=value=>Object.prototype.toString.call(value)==='[object RegExp]'?new RegExp(value.source,value.flags):Array.isArray(value)?value.map(routePath):value;
 const trainingExpress=Object.assign((...args)=>{
  const app=express(...args);
  for(const method of ['use','route','all','get','post','put','patch','delete','head','options']){
   const original=app[method];app[method]=function(first,...rest){return original.call(this,routePath(first),...rest);};
  }
  return app;
 },express);
 const allowed={path:path.posix,crypto,http,url,querystring,fs:virtualFS(task.files||{}),express:trainingExpress};
 const context=vm.createContext({module:{exports:{}},exports:{},require:name=>{if(!Object.hasOwn(allowed,name))throw new Error(`Modulul ${name} nu este disponibil în acest laborator.`);return allowed[name];},Buffer,console:{log(){}},setTimeout,clearTimeout,__dirname:'/project',__filename:'/project/app.js',URL,URLSearchParams});
 new vm.Script(code,{filename:'student.js'}).runInContext(context,{timeout:1500});
 if(task.mode==='express'){
  const exported=context.module.exports;
  const app=exported instanceof http.Server?exported.listeners('request')[0]:exported;
  if(typeof app!=='function')throw new Error('Exportă aplicația cu module.exports = app; Nu apela app.listen în laborator.');
  {
   const results=[];
   for(const request of task.requests){
    let res=await inject(app,{path:request.path,method:request.method||'GET',headers:request.headers,body:request.body});
    for(let redirects=0;res.status>=300&&res.status<400&&res.headers.location&&redirects<5;redirects++)res=await inject(app,{path:res.headers.location});
    const actual=request.json!==undefined?JSON.parse(res.body):res.body;
    const expected=request.json!==undefined?request.json:request.bodyExpected;
    results.push({label:`${request.method||'GET'} ${request.path}`,expected,actual,status:res.status,passed:res.status===(request.status||200)&&(request.includes!==undefined?String(actual).includes(request.includes):canonical(actual)===canonical(expected))});
   }
   return {results};
  }
 }
 const results=[];
 for(const test of task.cases){
  context.input=structuredClone(test.input);const before=canonical(context.input);
  try{
   const actual=await new vm.Script('solve(input)').runInContext(context,{timeout:1500});
   results.push({label:`Testul ${results.length+1}`,input:test.input,expected:test.expected,actual,passed:before===canonical(context.input)&&canonical(actual)===canonical(test.expected)});
  }catch(e){results.push({label:`Testul ${results.length+1}`,passed:false,error:e.message});}
 }
 return {results};
}
try{parentPort.postMessage(await run());}catch(e){parentPort.postMessage({results:[{label:'Execuție '+task.mode,passed:false,error:e.message.slice(0,1200)}]});}
