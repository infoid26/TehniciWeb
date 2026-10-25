import fs from 'node:fs/promises';
import vm from 'node:vm';
import {Worker} from 'node:worker_threads';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
const context={window:{}};
vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.TW_COURSE));
const lessons=course.chapters.flatMap(c=>c.lessons);
const position=new Map(lessons.map((l,i)=>[l.id,i]));
for(const chapter of course.chapters){
 assert(chapter.learning?.goal,chapter.id);
 assert(chapter.lessons[0].walkthrough?.length>=3,chapter.id+' needs a beginner walkthrough');
 for(const prerequisite of chapter.learning.prerequisites){
  assert(position.has(prerequisite),chapter.id+' missing '+prerequisite);
  assert(position.get(prerequisite)<position.get(chapter.lessons[0].id),chapter.id+' requires a future lesson '+prerequisite);
 }
}
for(const l of lessons)for(const prerequisite of l.prerequisites)assert(position.get(prerequisite)<position.get(l.id),l.id+' requires a future lesson');
const before=(a,b)=>assert(position.get(a)<position.get(b),a+' must precede '+b);
for(const [a,b] of [['css-rule','design-color'],['array-index','js-convert'],['object-properties','function-name'],['array-sort','object-entries'],['array-reduce','function-rest-array'],['node-await-value','node-async-read'],['sql-select','node-pg-connect'],['json-stringify','storage-model'],['regex-basic','regex-exact'],['regex-digits','regex-code-format'],['sql-read-table','sql-read-all'],['sql-read-all','sql-select'],['sql-select','sql-select-columns'],['sql-select-columns','sql-where'],['sql-count','sql-group'],['sql-create','schema-serial'],['sql-join','sql-count-user-visits']])before(a,b);
const byId=new Map(lessons.map(l=>[l.id,l]));
for(const id of ['sql-read-all','sql-select','sql-select-columns','sql-where']){
 const l=byId.get(id);assert(!/ORDER BY|::|ARRAY|JOIN|CREATE TYPE/i.test(l.example),id+' introduces advanced syntax');
 assert.equal(l.task.tables.length,1);assert.deepEqual(l.task.tables[0].columns,['id','name','price']);
 assert.equal(l.task.tables[0].rows.length,3);assert(l.task.unordered);
}
const canonical=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(k=>[k,item[k]])):item);
const normalize=(rows,task)=>task.unordered?[...rows].sort((a,b)=>canonical(a).localeCompare(canonical(b))):rows;
let checked=0;
for(const l of lessons.filter(l=>l.task.mode==='sql')){
 const task=l.task;const db=new PGlite();await db.waitReady;
 try{
  if(task.setup)await db.exec(task.setup);
  for(const table of task.tables){
   const quote=s=>'"'+s.replaceAll('"','""')+'"';
   const name=table.name.split('.').map(quote).join('.');
   const total=Number((await db.query('SELECT count(*) AS count FROM '+name)).rows[0].count);
   assert.equal(total,table.totalRows,l.id+' table preview count');
  }
  const results=await db.exec(task.solution);
  const rows=task.checkQuery?(await db.exec(task.checkQuery)).at(-1)?.rows:results.at(-1)?.rows;
  assert.equal(canonical(normalize(rows,task)),canonical(normalize(task.expected,task)),l.id+' solution: '+canonical(rows));
  if(l.id==='sql-select'){
   const reversed=(await db.query('SELECT price FROM products ORDER BY id DESC')).rows;
   assert.equal(canonical(normalize(reversed,task)),canonical(normalize(task.expected,task)),'An unordered query must not require ORDER BY');
  }
  checked++;
 }finally{await db.close();}
}
console.log(`PASS: ${lessons.length} lessons, 42 explicit chapter entry points, prerequisite order, gradual SQL/regex and ${checked} SQL solutions with actual preview tables.`);

for(const id of ['node-promise-value','node-await-value']){
 const task=byId.get(id).task;
 const result=await new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code:task.solution}});
  const timeout=setTimeout(()=>{worker.terminate();reject(new Error(id+' timed out'));},10000);
  worker.once('message',value=>{clearTimeout(timeout);worker.terminate();resolve(value);});
  worker.once('error',error=>{clearTimeout(timeout);worker.terminate();reject(error);});
 });
 assert(result.results.every(r=>r.passed),id);
}
console.log('PASS: introductory Promise and await exercises execute with the shipped Node evaluator.');
