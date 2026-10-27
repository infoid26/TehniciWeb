import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};
for(const file of ['site/exam-data.js','site/exam-session.js'])vm.runInNewContext(await fs.readFile(file,'utf8'),context);
const {exercises,tickets}=JSON.parse(JSON.stringify(context.window.TW_EXAM));
const engine=context.window.TW_EXAM_SESSION;
const used=new Set();
const counts=['css','server','client'].map(category=>tickets.filter(t=>t.category===category).length);
for(let n=0;n<Math.max(...counts);n++){
 const state=engine.create(0);
 for(let index=0;index<4;index++){
  engine.draw(state,exercises,()=>((n%counts[index])+.5)/counts[index],index*1e7);
  const stage=state.stages[index];
  assert.equal(stage.deadline-stage.preparedAt,300000,'Every ticket gets five minutes');
  if(index<3)used.add(stage.ticketId);
  else{
   assert.equal(stage.ticketId,state.stages[2].ticketId,'Bonus continues the same ticket');
   assert.equal(stage.answers[stage.ids[0]].code,'student filter','Bonus keeps the student answer');
  }
  engine.tick(state,stage.deadline);
  assert.equal(state.phase,'working');
  assert.equal(stage.deadline-stage.startedAt,stage.seconds*1000);
  if(index===2)stage.answers[stage.ids.at(-1)].code='student filter';
  engine.submit(state,stage.startedAt+1);
  engine.graded(state,Object.fromEntries(stage.ids.map(id=>[id,[{passed:true}]])));
  const saved=JSON.parse(JSON.stringify(state));
  engine.restore(saved,exercises);
  if(index===0){saved.stages[0].ids.reverse();assert.throws(()=>engine.restore(saved,exercises));}
  engine.advance(state);
 }
 assert.equal(state.phase,'finished');
}
assert.equal(used.size,tickets.length,'All authored tickets must be reachable');
assert.equal(new Set(tickets.map(t=>t.ids.join('|'))).size,tickets.length);

// Exercise the event handlers and storage lifecycle without opening a browser.
// CSS layout/cascade is outside this fixture harness.
function runDOM(task,code){
 const elements=new Map(),storage={...task.storage};
 const node=()=>({hidden:false,style:{},textContent:'',value:'',checked:false,parentElement:{style:{}}});
 for(const id of ['search','filter','count'])elements.set('#'+id,node());
 const radioTags=[...task.fixture.matchAll(/<input type="radio" name="([^"]+)"(?: value="([^"]+)")?([^>]*)>/g)];
 const radios=radioTags.map(([,name,value,rest])=>Object.assign(node(),{name,value:value||'on',checked:rest.includes('checked')}));
 for(const [,id] of task.fixture.matchAll(/data-id="([^"]+)"/g))elements.set('[data-id="'+id+'"]',node());
 const query=selector=>{
  if(elements.has(selector))return elements.get(selector);
  const label=selector.match(/^#choices label:nth-of-type\((\d+)\)$/);
  if(label)return radios.filter(r=>r.name==='catalog-filter')[Number(label[1])-1]?.parentElement;
  if(selector==='[name=other]:checked')return radios.find(r=>r.name==='other'&&r.checked);
  if(selector.startsWith('[name=')){
   const name=selector.match(/name=([^\]]+)/)?.[1];
   const value=selector.match(/value="([^"]+)"/)?.[1];
   return radios.find(r=>r.name===name&&(value===undefined||r.value===value)&&(!selector.includes(':checked')||r.checked));
  }
  throw new Error('Unsupported fixture selector: '+selector);
 };
 for(const radio of radios)radio.click=()=>{for(const r of radios)if(r.name===radio.name)r.checked=r===radio;};
 const document={querySelector:query,querySelectorAll:selector=>radios.filter(r=>r.name===selector.match(/name=([^\]]+)/)?.[1])};
 const localStorage={getItem:key=>storage[key]??null,setItem:(key,value)=>{storage[key]=String(value);}};
 vm.runInNewContext(code,{document,localStorage},{timeout:1000});
 for(const action of task.actions||[]){const el=query(action.selector);assert(el,action.selector);if(action.type==='click'){if(el.click)el.click();else el.onclick?.();}if(action.type==='fill')el.value=action.value;}
 return (task.tests||[]).map(test=>{
  const el=test.selector?query(test.selector):null;
  let pass=false;
  if(test.kind==='text')pass=el.textContent===test.value;
  if(test.kind==='count')pass=Boolean(el);
  if(test.kind==='storage')pass=storage[test.key]===test.value;
  if(test.kind==='style'&&test.name==='display')pass=(el.hidden?'none':'block')===test.value;
  if(test.kind==='style'&&test.name==='border-top-color')pass=el.style.border==='2px solid blue';
  return {label:test.label,pass};
 });
}
let cases=0;
for(const item of exercises.filter(item=>item.task.mode==='dom')){
 for(const variant of [null,...item.task.variants||[]]){
  const task=variant?{...item.task,...variant}:item.task;
  const result=runDOM(task,item.task.solution);
  assert(result.length&&result.every(row=>row.pass),item.id+': '+JSON.stringify(result));
  assert(runDOM(task,'').some(row=>!row.pass),item.id+' must reject an empty answer');
  cases++;
 }
}
console.log('PASS: '+tickets.length+' fixed tickets reachable; five-minute preparation per draw; correct work timers; linked bonus and saved answers; '+cases+' DOM/storage fixture cases. Browser layout not tested.');

