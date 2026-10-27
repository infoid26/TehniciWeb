import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile('site/exam-history.js','utf8');
const storage=new Map(),histories=new Map();let offline=false;
const bank=[{id:'css-01',category:'css'},{id:'css-02',category:'css'},{id:'server-01',category:'server'}];
function client(id='user-a',accountPromise=Promise.resolve({user:{id}})){
 const messages=[];
 const context={window:{TW_EXAM:{tickets:bank}},AbortSignal,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},fetch:async(path,options)=>{
  assert.equal(path,'/api/exam/tickets');
  if(offline)throw new Error('Offline');
  const owner=options.headers['X-TW-Account'];let completed=histories.get(owner);
  if(!completed){completed=new Set();histories.set(owner,completed);}
  let status=200,value;
  if(options.method==='GET')value={completed:[...completed]};
  else{
   const body=JSON.parse(options.body);
   if(body.action==='complete'){completed.add(body.ticketId);value={completed:[...completed]};}
   else{const ticket=bank.find(t=>t.category===body.category&&!completed.has(t.id)&&!body.exclude.includes(t.id));if(ticket)value={ticketId:ticket.id,completed:[...completed]};else{status=409;value={code:'tickets-exhausted',error:'No new tickets'};}}
  }
  return {ok:status<400,status,json:async()=>value};
 }};
 vm.runInNewContext(source,context);
 return {history:context.window.TW_EXAM_HISTORY.create({accountPromise,onStatus:text=>messages.push(text)}),messages};
}
const first=client();await first.history.ready;
assert.equal(await first.history.draw('css'),'css-01');
assert.equal(await first.history.draw('css'),'css-01','Drawing without submission must not consume a ticket');
await first.history.complete('css-01');
assert.equal(await first.history.draw('css'),'css-02');
const secondDevice=client();await secondDevice.history.ready;
assert.equal(await secondDevice.history.draw('css'),'css-02','Server history works on another device');
const other=client('user-b');await other.history.ready;
assert.equal(await other.history.draw('css'),'css-01','Accounts on the same browser are isolated');
offline=true;await first.history.complete('css-02');
assert(first.messages.some(text=>text.includes('salvat local')));
await assert.rejects(()=>first.history.draw('css'),'Failed synchronization must not silently draw a repeated ticket');
offline=false;
const reload=client();await reload.history.ready;
assert(histories.get('user-a').has('css-02'),'Pending completion survives reload and is sent to the server');
await assert.rejects(()=>reload.history.draw('css'),error=>error.code==='tickets-exhausted');
const unavailable=client('user-c',Promise.resolve({unavailable:true}));
await assert.rejects(()=>unavailable.history.ready);
await assert.rejects(()=>unavailable.history.draw('css'));
const guest=client(null,Promise.resolve({user:null}));await guest.history.ready;
const guestTicket=await guest.history.draw('css');await guest.history.complete(guestTicket);
assert.notEqual(await guest.history.draw('css'),guestTicket);
console.log('PASS: account isolation, cross-device history, submission-only completion, pending retry after reload, no silent repeats on network failure or exhaustion, independent guest history.');
// Verify the shipped UI waits for account identity and ignores a late draw
// after the user has returned to the start screen.
const examSource=await fs.readFile('site/exam.js','utf8');
const examData=await fs.readFile('site/exam-data.js','utf8');
const sessionSource=await fs.readFile('site/exam-session.js','utf8');
const nodes=new Map(),uiStorage=new Map();let resolveDraw;
const element=()=>({hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){}});
const query=selector=>{if(!nodes.has(selector))nodes.set(selector,element());return nodes.get(selector);};
const ui={
 window:{
  TW_ACCOUNTS:{mountHeader:async()=>({user:{id:'signed-user'}})},
  TW_EXAM_HISTORY:{create:()=>({ready:Promise.resolve({id:'signed-user'}),draw:()=>new Promise(resolve=>{resolveDraw=resolve;}),complete:async()=>{}})}
 },
 document:{querySelector:query,body:element()},
 localStorage:{getItem:key=>uiStorage.get(key)||null,setItem:(key,value)=>uiStorage.set(key,value),removeItem:key=>uiStorage.delete(key)},
 TW_EDITOR:{clear(){},mount(){}},setInterval(){}
};
ui.window.scrollTo=()=>{};
vm.runInNewContext(examData,ui);vm.runInNewContext(sessionSource,ui);vm.runInNewContext(examSource,ui);
await new Promise(resolve=>setImmediate(resolve));
assert.equal(query('#start-simulation').disabled,false);
query('#start-simulation').onclick();
assert(uiStorage.has('tw-infoid26-exam-simulation-v3:account:signed-user'));
assert(!uiStorage.has('tw-infoid26-exam-simulation-v3'),'Logged-in simulation must not overwrite guest work');
const drawing=query('#draw-ticket').onclick();
query('#finish-attempt').onclick();resolveDraw('css-01');await drawing;
assert.equal(query('#simulation-panel').hidden,true,'A late response must not reopen a cancelled simulation');
assert.equal(query('#start-simulation').hidden,false);
query('#start-simulation').onclick();
const nextDraw=query('#draw-ticket').onclick();resolveDraw('css-120');await nextDraw;
const saved=JSON.parse(uiStorage.get('tw-infoid26-exam-simulation-v3:account:signed-user'));
assert.equal(saved.stages[0].ticketId,'css-120','UI must use the ticket selected by the server');
assert.equal(saved.stages[0].deadline-saved.stages[0].preparedAt,300000);
console.log('PASS: shipped exam UI scopes saved attempts to the account, uses server-selected tickets, starts preparation after drawing and ignores cancelled asynchronous draws.');
