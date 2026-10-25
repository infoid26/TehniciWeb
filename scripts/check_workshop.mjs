
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {Worker} from 'node:worker_threads';
import {execFileSync} from 'node:child_process';
const context={window:{}};
vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.TW_COURSE));
const lessons=course.chapters.flatMap(c=>c.lessons);
const selected=lessons.filter(l=>l.id.startsWith('dulc-')||l.id.startsWith('project-'));
assert.equal(selected.length,70);
assert(!JSON.stringify(course).includes('Sweet Corner'));
const display=selected.map(l=>[l.intro,l.example,l.explain,l.task]);
assert(!JSON.stringify(display).includes('Dulcelind'));
assert(!JSON.stringify(display).includes('build:project'));
assert(!JSON.stringify(display).includes('setup:project-db'));
assert(selected.find(l=>l.id==='project-assets').example.includes('Create build-assets.mjs'));
assert(selected.find(l=>l.id==='dulc-start-script').example.includes('build:assets'));
assert(selected.find(l=>l.id==='dulc-permissions').example.includes('Create setup-db.cjs'));
assert(selected.find(l=>l.id==='dulc-pool').example.includes('Create db.cjs'));
const ui=await fs.readFile('site/app.js','utf8');
assert(ui.includes('Vezi exemplul separat'));
for(const id of ['project-shell','project-menu','project-gallery','project-picture','project-video','project-faq','project-table','project-grid','project-menu-action','project-filter','project-sort','project-cart','project-ejs','project-route-id','project-query','project-assets','project-errors','project-checklist'])assert(selected.some(l=>l.id===id),id);
assert(lessons.some(l=>l.example.includes('pg_advisory_xact_lock')));
assert(lessons.some(l=>l.example.includes('rejectUnauthorized:true')));
assert(lessons.some(l=>l.example.includes('AZURE_POSTGRESQL_DATABASE')));
assert.equal(selected.find(l=>l.id==='project-menu-action').task.mode,'css');
assert(selected.find(l=>l.id==='project-filter').example.includes('startsWith'));
assert(selected.find(l=>l.id==='project-filter').example.includes('>=i.minPrice'));
assert(selected.find(l=>l.id==='dulc-cookies').example.includes('banner_accepted'));
function run(task,code){
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code}});
  const timer=setTimeout(()=>{worker.terminate();reject(new Error('Timeout: '+task.id));},30000);
  worker.once('message',r=>{clearTimeout(timer);worker.terminate();resolve(r);});
  worker.once('error',e=>{clearTimeout(timer);worker.terminate();reject(e);});
 });
}
let checks=0;
for(const l of selected.filter(l=>['sql','express','ejs'].includes(l.task.mode))){
 const good=await run(l.task,l.task.solution);
 const bad=await run(l.task,'');
 if(l.task.mode==='ejs'){
  assert(good.rendered?.includes('<'),l.id+': '+JSON.stringify(good));
  assert(!bad.rendered?.trim(),l.id+' empty template');
 }else{
  assert(good.results?.length&&good.results.every(r=>r.passed),l.id+': '+JSON.stringify(good));
  assert(bad.results?.some(r=>!r.passed),l.id+' accepts empty answer');
 }
 checks++;
 console.log('PASS',l.id);
}
// A build must neither rewrite the app's README nor mutate reference resources.
const readme=await fs.readFile('project-reference/README.md','utf8');
const first=await fs.readFile('site/course.js','utf8');
execFileSync('python',['scripts/build_course.py'],{stdio:'pipe'});
assert.equal(await fs.readFile('project-reference/README.md','utf8'),readme);
assert.equal(await fs.readFile('site/course.js','utf8'),first);
console.log('PASS: '+selected.length+' workshop lessons; '+checks+' backend solutions and negative controls; stable lesson IDs, independent example contracts and reproducible generation. Browser layout and live Azure are not covered.');
