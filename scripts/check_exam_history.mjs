import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile('site/exam-history.js','utf8');
const storage=new Map(),histories=new Map();let offline=false;
const bank=['css','server','client'].flatMap(category=>[1,2].map(n=>({id:category+'-0'+n,category})));
const submission=(name,n=1)=>({submissionId:'simulation-'+name,ticketIds:['css','server','client'].map(category=>category+'-0'+n)});
function client(id='user-a',accountPromise=Promise.resolve({user:{id}}),disk=storage){
 const messages=[];
 const context={window:{TW_EXAM:{tickets:bank}},AbortSignal,localStorage:{getItem:key=>disk.get(key)||null,setItem:(key,value)=>disk.set(key,value)},fetch:async(path,options)=>{
  assert.equal(path,'/api/exam/tickets');
  if(offline)throw new Error('Offline');
  const owner=options.headers['X-TW-Account'];let history=histories.get(owner);
  if(!history){history={completed:new Set(),submissions:new Set()};histories.set(owner,history);}
  const {completed,submissions}=history;let value;
  if(options.method==='GET')value={completed:[...completed]};
  else{
   const body=JSON.parse(options.body);
   if(body.action==='complete'){
    assert.equal(body.ticketIds.length,3,'Completions are sent as one whole simulation');
    if(!submissions.has(body.submissionId)){for(const id of body.ticketIds)completed.add(id);submissions.add(body.submissionId);}
    value={completed:[...completed]};
   }else{
    const category=bank.filter(t=>t.category===body.category);
    let pool=category.filter(t=>!completed.has(t.id));
    if(!pool.length){for(const ticket of category)completed.delete(ticket.id);pool=category;}
    value={ticketId:pool[0].id,completed:[...completed]};
   }
  }
  return {ok:true,json:async()=>value};
 }};
 vm.runInNewContext(source,context);
 return {history:context.window.TW_EXAM_HISTORY.create({accountPromise,onStatus:text=>messages.push(text)}),messages};
}
const first=client();await first.history.ready;
assert.equal(await first.history.draw('css'),'css-01');
assert.equal(await first.history.draw('css'),'css-01','Drawing without full submission must not consume a ticket');
await first.history.complete(submission('one'));
assert.equal(await first.history.draw('css'),'css-02');
const secondDevice=client('user-a',undefined,new Map());await secondDevice.history.ready;
assert.equal(await secondDevice.history.draw('css'),'css-02','Server history works on another device');
const other=client('user-b');await other.history.ready;
assert.equal(await other.history.draw('css'),'css-01','Accounts on the same browser are isolated');
offline=true;await first.history.complete(submission('two',2));
assert(first.messages.some(text=>text.includes('salvat')));
await assert.rejects(()=>first.history.draw('css'),'A failed synchronization must not silently repeat a ticket');
offline=false;
const reload=client();await reload.history.ready;
assert(histories.get('user-a').completed.has('css-02'),'Whole pending simulations survive reload and reach the server');
assert.equal(await reload.history.draw('css'),'css-01','An exhausted CSS pool starts again');
assert(histories.get('user-a').completed.has('server-01'),'A CSS reset retains other categories');
assert.equal(await secondDevice.history.draw('css'),'css-01','A stale device accepts the server reset instead of reviving old exclusions');
await secondDevice.history.complete(submission('one'));
assert(!histories.get('user-a').completed.has('css-01'),'An old report replay does not consume a new-round ticket');
const unavailable=client('user-c',Promise.resolve({unavailable:true}));
await assert.rejects(()=>unavailable.history.ready);
await assert.rejects(()=>unavailable.history.draw('css'));
const guest=client(null,Promise.resolve({user:null}));await guest.history.ready;
await guest.history.complete(submission('guest-one'));
assert.equal(await guest.history.draw('css'),'css-02');
await guest.history.complete(submission('guest-two',2));
const restarted=await guest.history.draw('css');assert(['css-01','css-02'].includes(restarted));

await guest.history.complete(submission('guest-one'));
const guestSaved=JSON.parse(storage.get('tw-exam-history-v2:guest'));
assert(!guestSaved.completed.includes('css-01'),'An old guest report is idempotent after reset');
assert(guestSaved.completed.includes('server-01'),'The guest reset retains other categories');
console.log('PASS: account isolation, cross-device reset, whole-simulation offline retry, replay after reset, network failure and independent guest rounds.');
// Verify the shipped UI waits for account identity and ignores a late draw
// after the user has returned to the start screen.
const examSource=await fs.readFile('site/exam.js','utf8');
const examData=await fs.readFile('site/exam-data.js','utf8');
const sessionSource=await fs.readFile('site/exam-session.js','utf8');
const nodes=new Map(),uiStorage=new Map(),uiEvents=new Map();
let resolveDraw,interval,runnerChecks=0;const previewFrames=[],uiCompletions=[];
const element=()=>{
 const classes=new Set();
 return {hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',classList:{
  add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name),
  toggle:(name,force)=>{if(force??!classes.has(name))classes.add(name);else classes.delete(name);}
 },addEventListener(){}};
};
const query=selector=>{if(!nodes.has(selector))nodes.set(selector,element());return nodes.get(selector);};
const ui={
 window:{
  addEventListener:(name,handler)=>uiEvents.set(name,handler),
  TW_ACCOUNTS:{mountHeader:async()=>({user:{id:'signed-user'}})},
  TW_EXAM_HISTORY:{create:()=>({ready:Promise.resolve({id:'signed-user'}),draw:()=>new Promise(resolve=>{resolveDraw=resolve;}),complete:async submission=>{uiCompletions.push(JSON.parse(JSON.stringify(submission)));}})}
 },
 document:{querySelector:query,querySelectorAll:()=>previewFrames,body:element()},
 localStorage:{getItem:key=>uiStorage.get(key)||null,setItem:(key,value)=>uiStorage.set(key,value),removeItem:key=>uiStorage.delete(key)},
 TW_EDITOR:{clear(){},mount(){}},TW_RUNNER:{check:async()=>{runnerChecks++;return [{label:'Check',passed:true}];}},setInterval:handler=>{interval=handler;}
};
ui.window.scrollTo=()=>{};
vm.runInNewContext(examData,ui);vm.runInNewContext(sessionSource,ui);
const key='tw-infoid26-exam-simulation-v3:account:signed-user';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const stored=()=>JSON.parse(uiStorage.get(key));
async function reloadPage(){
 nodes.clear();ui.document.body=element();
 for(const id of ['simulation-panel','exam-workspace','exam-report','last-attempt'])query('#'+id).hidden=true;
 vm.runInNewContext(examSource,ui);await settle();
}
function landing(message){
 assert.equal(query('#simulation-intro').hidden,false,message);
 assert.equal(query('#start-simulation').hidden,false,message);
 for(const id of ['simulation-panel','exam-workspace','exam-report'])assert.equal(query('#'+id).hidden,true,message);
 assert(!ui.document.body.classList.contains('simulation-active'),message);
}
function resume(){assert.equal(query('#last-attempt').hidden,false);query('#last-attempt').onclick();}
await reloadPage();landing('A new visit stays on the presentation page');
assert.equal(query('#start-simulation').disabled,false);
assert.equal(query('#last-attempt').hidden,true,'There is nothing to resume on a first visit');
query('#start-simulation').onclick();
assert(uiStorage.has(key));
assert(!uiStorage.has('tw-infoid26-exam-simulation-v3'),'Logged-in simulation must not overwrite guest work');
const readySaved=uiStorage.get(key);
await reloadPage();landing('Even an unstarted saved attempt must not skip the presentation');
assert.equal(query('#last-attempt').textContent,'Continuă simularea');
interval();assert.equal(uiStorage.get(key),readySaved,'The landing timer cannot open or change a saved attempt');
resume();assert.equal(query('#simulation-panel').hidden,false);assert.equal(stored().phase,'ready');
const drawing=query('#draw-ticket').onclick();
query('#finish-attempt').onclick();resolveDraw('css-01');await drawing;
landing('A late draw response must not reopen a cancelled simulation');
assert(!uiStorage.has(key));
query('#start-simulation').onclick();
const nextDraw=query('#draw-ticket').onclick();resolveDraw('css-120');await nextDraw;
const preparation=uiStorage.get(key),saved=stored();
assert.equal(saved.stages[0].ticketId,'css-120','UI must use the ticket selected by the server');
assert.equal(saved.stages[0].deadline-saved.stages[0].preparedAt,300000);
await reloadPage();landing('A saved preparation waits for an explicit resume');
interval();assert.equal(uiStorage.get(key),preparation,'Waiting on the presentation neither advances nor resets preparation');
resume();assert.equal(stored().stages[0].deadline,saved.stages[0].deadline);
const ticketHTML=query('#simulation-tasks').innerHTML;
assert.deepEqual([...ticketHTML.matchAll(/class="ticket-number">(\d+\))/g)].map(match=>match[1]),['1)','2)'],'Question numbers are explicit, independent of CSS counters');
const secondQuestion=ticketHTML.indexOf('class="ticket-number">2)');
assert(ticketHTML.indexOf('class="ticket-example"')<secondQuestion,'Each example immediately follows its own requirement');
assert(!ticketHTML.includes('ticket-material')&&!ticketHTML.includes('Pagina furnizata'),'No repeated material panels');
assert.equal([...ticketHTML.matchAll(/class="ticket-source"/g)].length,1,'The welcome animation needs no redundant HTML source');
query('#begin-stage').onclick();query('#submit-stage').onclick();
assert.deepEqual([...query('#exam-workspace').innerHTML.matchAll(/class="ticket-number">(\d+\))/g)].map(match=>match[1]),['2)'],'Second question keeps its number while working');
const working=stored(),firstId=working.stages[0].ids[0];
working.stages[0].answers[firstId]={code:'h1 { color: hotpink; }',explanation:'My saved explanation'};
uiStorage.set(key,JSON.stringify(working));
await reloadPage();landing('A saved editor waits for explicit resume');
const beforeResume=uiStorage.get(key);interval();assert.equal(uiStorage.get(key),beforeResume);
resume();
assert.equal(stored().selected,working.selected,'Resume keeps the current question');
assert.equal(stored().stages[0].deadline,working.stages[0].deadline,'Resume keeps the original deadline');
assert.deepEqual(stored().stages[0].answers[firstId],working.stages[0].answers[firstId],'Resume preserves student code and explanation');
const frameWindow={},preview={dataset:{ticketPreview:'ticket-css-focus'},contentWindow:frameWindow,style:{},getBoundingClientRect:()=>({height:360})};previewFrames.push(preview);
const message=uiEvents.get('message');
message({source:{},data:{type:'tw-ticket-size',id:'ticket-css-focus',height:90}});assert.equal(preview.style.height,undefined,'Ignore sizing messages from unrelated frames');
message({source:frameWindow,data:{type:'tw-ticket-size',id:'ticket-css-focus',height:90}});assert.equal(preview.style.height,'90px','Compact examples must shrink to their content');
query('#finish-attempt').onclick();query('#start-simulation').onclick();
const drawBadge=query('#draw-ticket').onclick();resolveDraw('css-117');await drawBadge;
assert(query('#simulation-tasks').innerHTML.includes('Tort')&&query('#simulation-tasks').innerHTML.includes('::before'),'Badge statement names the product and requested result');
console.log('PASS: shipped exam UI; explicit resume from ready/preparation/working; saved code, explanation, current question and deadline; safe asynchronous draw; ticket illustrations and numbering.');

// Even a fully submitted CSS ticket stays available until every probe is sent.
query('#begin-stage').onclick();query('#submit-stage').onclick();query('#submit-stage').onclick();await settle();
assert.equal(uiCompletions.length,0,'Submitting CSS alone does not consume the ticket');
await reloadPage();landing('A submitted probe must not skip the presentation');
assert.equal(uiCompletions.length,0,'Restoring a partially submitted simulation must not consume tickets');
resume();assert.equal(stored().phase,'submitted');
query('#finish-attempt').onclick();
assert.equal(uiCompletions.length,0,'Abandoning a partial simulation leaves all pools unchanged');
query('#start-simulation').onclick();
for(const [index,id] of ['css-01','server-01','client-01',null].entries()){
 const draw=query('#draw-ticket').onclick();if(id)resolveDraw(id);await draw;
 query('#begin-stage').onclick();query('#submit-stage').onclick();if(index<3)query('#submit-stage').onclick();await settle();
 assert.equal(uiCompletions.length,index===3?1:0,'History changes only after the last probe, including the bonus');
 query('#next-stage').onclick();
}
assert.deepEqual(uiCompletions[0].ticketIds,['css-01','server-01','client-01']);
const originalId=uiCompletions[0].submissionId;
await reloadPage();landing('A finished attempt does not automatically open its report');
assert.equal(uiCompletions.at(-1).submissionId,originalId,'Reload retries use the same submission ID');
assert.equal(query('#last-attempt').textContent,'Vezi ultima simulare');
resume();assert.equal(query('#exam-report').hidden,false,'The last report opens only when requested');
query('#restart-simulation').onclick();
assert.equal(stored().phase,'ready');assert.equal(stored().index,0);assert(stored().stages.every(stage=>stage.ids.length===0),'A new simulation starts fresh');
console.log('PASS: partial submission/reload/abandonment consume nothing; complete simulation keeps one submission ID; finished reports open on request; new attempts start fresh.');

// A saved deadline keeps running while away, but no screen or grading opens
// until Continue. Resuming an expired probe must not grant extra time.
for(const phase of ['preparation','working','grading']){
 const engine=ui.window.TW_EXAM_SESSION,attempt=engine.create(0);
 engine.draw(attempt,ui.window.TW_EXAM.exercises,()=>0,0);
 if(phase!=='preparation')engine.begin(attempt,1);
 if(phase==='grading')engine.submit(attempt,2);
 const part=attempt.stages[0],id=part.ids[0];part.answers[id].code='p { color: hotpink; }';
 uiStorage.set(key,JSON.stringify(attempt));const before=uiStorage.get(key),checks=runnerChecks,completions=uiCompletions.length;
 await reloadPage();landing('An expired '+phase+' attempt stays on the presentation');
 interval();await settle();
 assert.equal(uiStorage.get(key),before,'No hidden timer mutates the saved '+phase+' attempt');
 assert.equal(runnerChecks,checks,'No grading starts on the presentation');
 resume();await settle();
 const result=stored();assert.equal(result.phase,'submitted','Expired/in-progress grading resumes with locked answers');
 assert.equal(result.stages[0].answers[id].code,part.answers[id].code);
 assert(result.stages[0].endedAt<=result.stages[0].deadline,'Resuming cannot extend an expired deadline');
 assert.equal(uiCompletions.length,completions,'One resumed probe cannot consume a whole simulation');
}
console.log('PASS: expired preparation/working and interrupted grading wait for Continue; saved answers remain locked and deadlines are never extended.');
