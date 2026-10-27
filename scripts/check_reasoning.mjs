import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import ejs from 'ejs';
const context={window:{}};
for(const file of ['site/course.js','site/exam-data.js','site/exam-session.js'])vm.runInNewContext(await fs.readFile(file,'utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.TW_COURSE));
const bank=JSON.parse(JSON.stringify(context.window.TW_EXAM.exercises));
const lessons=course.chapters.flatMap(chapter=>chapter.lessons);
const positions=new Map(lessons.map((lesson,index)=>[lesson.id,index]));
const challenges=lessons.filter(lesson=>lesson.challenge);
const executable=new Set(['html','css','scss','js','json','dom','node','express','ejs','sql']);
const tickets=JSON.parse(JSON.stringify(context.window.TW_EXAM.tickets));
assert.equal(tickets.length,360);
for(const [category,total] of [['css',120],['server',120],['client',120]])assert.equal(tickets.filter(t=>t.category===category).length,total);
const taskIds=new Set(bank.map(item=>item.id));
assert.equal(taskIds.size,bank.length);
assert(bank.every(item=>item.task&&!['html','js','json','node','sql'].includes(item.task.mode)),'Use applied practical objectives, not foundation drills');
const combinations=new Set();
for(const ticket of tickets){
 assert.equal(ticket.ids.length,2);
 assert(ticket.ids.every(id=>taskIds.has(id)));
 assert(!combinations.has(ticket.ids.join('|')));combinations.add(ticket.ids.join('|'));
 if(ticket.category==='client')assert(ticket.bonusIds?.every(id=>taskIds.has(id)));
}
assert(challenges.length>=25);
for(const l of challenges){
 assert(l.reasoning.questions.length>=2,l.id);
 assert(l.reasoning.explanation&&l.reasoning.counterexample,l.id);
 for(const id of l.reasoning.prerequisites)assert(positions.has(id)&&positions.get(id)<positions.get(l.id),l.id+' future prerequisite '+id);
 if(l.task.mode==='js')assert(l.task.cases.length>=3,l.id+' needs contrasting cases');
}
const picture=challenges.find(l=>l.id==='reason-picture-choice'),img=challenges.find(l=>l.id==='reason-img-enough');
assert.equal(picture.task.mode,'html');assert.equal(img.task.mode,'html');
assert(picture.task.solution.includes('<picture>'));assert(!img.task.solution.includes('<picture>'));
const engine=context.window.TW_EXAM_SESSION;
const state=engine.create(1000);
assert.equal(engine.answer(state,'missing',{code:'x'},1000),false);
for(let stageIndex=0;stageIndex<4;stageIndex++){
 assert.equal(state.phase,'ready');engine.draw(state,bank,()=>0,1000+stageIndex*1000000);
 const stage=state.stages[stageIndex];
 assert.equal(stage.ids.length,stageIndex===3?1:2);
 if(stageIndex===0)assert.equal(stage.name,'CSS');
 if(stageIndex===1)assert.equal(stage.name,'Node + EJS');
 if(stageIndex===2)assert.equal(stage.name,'BD + JavaScript client');
 if(stageIndex===3)assert.equal(stage.ticketId,state.stages[2].ticketId);
 assert.equal(engine.answer(state,stage.ids[0],{code:'early'},stage.preparedAt),false);
 assert.throws(()=>engine.draw(state,bank,()=>0,stage.preparedAt),'Cannot reroll a drawn ticket');
 const restored=engine.restore(JSON.parse(JSON.stringify(state)),bank);
 assert.equal(restored.stages[stageIndex].deadline,stage.deadline);
 engine.begin(state,stage.preparedAt+1000);
 assert.equal(engine.answer(state,stage.ids[0],{code:'answer',explanation:'My reasoning'},stage.startedAt+1),true);
 assert.equal(engine.submit(state,stage.startedAt+2000),true);
 assert.equal(engine.answer(state,stage.ids[0],{code:'late'},stage.startedAt+2001),false);
 engine.graded(state,Object.fromEntries(stage.ids.map(id=>[id,[{label:'Test',passed:true}]])));
 assert.equal(engine.advance(state),true);
}
assert.equal(state.phase,'finished');
const all=state.stages.flatMap(stage=>stage.ids);assert.equal(all.length,new Set(all).size,'Tickets must not repeat within an attempt');
const late=engine.create(0);engine.draw(late,bank,()=>0,0);
assert.equal(engine.tick(late,300000),null);assert.equal(late.phase,'working');
assert.equal(late.stages[0].startedAt,300000);
assert.equal(engine.tick(late,1200000),'submit');assert.equal(late.phase,'grading');
assert.equal(late.stages[0].endedAt,1200000);
assert.equal(engine.answer(late,late.selected,{code:'after deadline'},1200000),false);
const refreshed=engine.restore(JSON.parse(JSON.stringify(late)),bank);assert.equal(refreshed.phase,'grading');
const overdue=engine.create(0);engine.draw(overdue,bank,()=>0,0);
engine.begin(overdue,450000);assert.equal(overdue.stages[0].startedAt,300000,'Late begin must not extend preparation');
assert.equal(overdue.stages[0].deadline,1200000);
const page=await fs.readFile('site/exam.html','utf8');
assert(!/id="exam-(bank|search|category|level)"/.test(page));
for(const name of ['start-simulation','draw-ticket','begin-stage','submit-stage','simulation-clock','exam-report'])assert(page.includes('id="'+name+'"'),name);
const ui=await fs.readFile('site/exam.js','utf8');
assert(!ui.includes("id=\"exam-search\""));
assert(ui.includes("tw-infoid26-exam-simulation-v3"));
assert(!ui.includes("localStorage.clear("));
function run(task,code){
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./lab-worker.mjs',import.meta.url),{workerData:{task,code}});
  const timer=setTimeout(()=>{worker.terminate();reject(new Error(task.id+' timeout'));},20000);
  worker.once('message',value=>{clearTimeout(timer);worker.terminate();resolve(value);});
  worker.once('error',error=>{clearTimeout(timer);worker.terminate();reject(error);});
 });
}
let native=0;
for(const l of challenges){
 const task=l.task;
 if(['node','express','sql'].includes(task.mode)){
  const good=await run(task,task.solution),bad=await run(task,'');
  assert(good.results?.length&&good.results.every(row=>row.passed),l.id+': '+JSON.stringify(good));
  assert(bad.results?.some(row=>!row.passed),l.id+' empty answer');
  native++;
 }else if(task.mode==='ejs'){
  const rendered=ejs.render(task.solution,task.data);
  assert(rendered.includes('&lt;b&gt;Pen&lt;/b&gt;')&&!rendered.includes('<b>Pen</b>'));
  for(const variant of task.variants){
   const output=ejs.render(task.solution,variant.data);
   if(!variant.data.items.length)assert(output.includes('No items')&&!output.includes('<ul>'));
  }
 }
}
console.log('PASS: '+challenges.length+' transfer lessons; contrasting cases/prerequisites; picture versus img; '+native+' runtime exercises; draw/preparation/timing/locked submission/restore/finish. DOM and visual rendering are not tested here.');
