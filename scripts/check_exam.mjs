import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const require=createRequire(import.meta.url);
let playwright;
try{playwright=require('playwright');}
catch{playwright=require('C:/Users/Axi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
await fs.mkdir('.audit/browser-temp',{recursive:true});
process.env.TEMP=path.resolve('.audit/browser-temp');process.env.TMP=process.env.TEMP;
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await playwright.chromium.launch({...(process.platform==='win32'?{executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}:{}),headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const url of ['/examen','/examen/'])assert.equal((await page.goto(base+url)).status(),200);
 await page.waitForSelector('#start-simulation');
 assert.equal(await page.locator('#exam-bank,.exercise-card,#exam-search').count(),0);
 await page.evaluate(()=>{Math.random=()=>0;localStorage.setItem('tw-infoid26-progress-v2','{"sentinel":true}');});
 await page.locator('#start-simulation').click();
 for(let index=0;index<4;index++){
  await page.locator('#draw-ticket').click();
  await page.waitForSelector('#simulation-tasks:not([hidden])');
  assert.equal(await page.locator('.cm-editor').count(),0);
  assert(await page.locator('#draw-ticket').isHidden());
  assert.equal(await page.getByText('Rezolvare și raționament',{exact:true}).count(),0);
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('tw-infoid26-exam-simulation-v3')));
  await page.reload();await page.waitForSelector('#simulation-tasks:not([hidden])');
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('tw-infoid26-exam-simulation-v3')));
  assert.equal(after.stages[index].deadline,before.stages[index].deadline);
  await page.locator('#begin-stage').click();await page.waitForSelector('.cm-editor');
  const ids=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('tw-infoid26-exam-simulation-v3'));return s.stages[s.index].ids;});
  for(const id of ids){
   await page.waitForSelector('.cm-editor');
   await page.evaluate(id=>{
    const task=TW_EXAM.exercises.find(item=>item.id===id).task;
    const field=document.querySelector('#exam-code');field.value=task.solution;field.dispatchEvent(new Event('input',{bubbles:true}));
   },id);
   await page.locator('#exam-explanation').fill('Explain the chosen operation and check an opposite case.');
   if(id!==ids.at(-1))await page.locator('#submit-stage').click();
  }
  await page.locator('#submit-stage').click();
  await page.waitForFunction(()=>!document.querySelector('#next-stage').hidden,null,{timeout:60000});
  assert(await page.locator('#exam-workspace').isHidden());
  assert.equal(await page.getByText('Rezolvare și raționament',{exact:true}).count(),0);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('tw-infoid26-exam-simulation-v3')));
  for(const id of ids)assert(stored.stages[index].results[id].every(row=>row.passed),id);
  await page.locator('#next-stage').click();
 }
 await page.waitForSelector('#exam-report:not([hidden])');
 assert(await page.getByText('Rezolvare și raționament',{exact:true}).count()>0);
 assert.equal(await page.evaluate(()=>localStorage.getItem('tw-infoid26-progress-v2')),'{"sentinel":true}');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'.audit/exam-simulation-mobile.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: no visible bank; random tickets; read-only preparation; reload retains deadline; editors and locked submission; solutions only after finish; isolated storage and mobile layout.');
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
