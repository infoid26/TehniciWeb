import {parentPort,workerData} from 'node:worker_threads';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
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
 return {
  readFileSync(p,encoding){const k=key(p);if(!(k in data))throw new Error(`ENOENT: ${k}`);return encoding?data[k]:Buffer.from(data[k]);},
  existsSync:p=>key(p) in data,
  readdirSync:p=>Object.keys(data).filter(k=>k.startsWith(key(p).replace(/\/$/,'')+'/')).map(k=>k.split('/').at(-1)),
  writeFileSync(p,value){data[key(p)]=String(value);},
  mkdirSync(){},copyFileSync(a,b){data[key(b)]=data[key(a)];},
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
 const allowed={path:path.posix,crypto,fs:virtualFS(task.files||{}),express};
 const context=vm.createContext({module:{exports:{}},exports:{},require:name=>{if(!Object.hasOwn(allowed,name))throw new Error(`Modulul ${name} nu este disponibil în acest laborator.`);return allowed[name];},Buffer,console:{log(){}},setTimeout,clearTimeout,__dirname:'/project',__filename:'/project/app.js',URL,URLSearchParams});
 new vm.Script(code,{filename:'student.js'}).runInContext(context,{timeout:1500});
 if(task.mode==='express'){
  const app=context.module.exports;
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
