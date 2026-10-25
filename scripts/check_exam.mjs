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
process.env.TEMP=path.resolve('.audit/browser-temp');
process.env.TMP=process.env.TEMP;
const server=createServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await playwright.chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const url of ['/examen','/examen/']){
  const response=await page.goto(base+url);
  assert.equal(response.status(),200,url);
  await page.waitForSelector('.exercise-card');
 }
 const bank=await page.evaluate(()=>TW_EXAM.exercises);
 assert(bank.length>=110);
 assert(bank.filter(item=>item.category==='oral').length>=20);
 const baseline=JSON.parse(await fs.readFile('scripts/course-lesson-ids.json','utf8'));
 await page.goto(base);
 await page.waitForSelector('.path-node');
 assert.equal(await page.getByRole('link',{name:'Proiect Website'}).count(),1);
 assert.equal(await page.getByRole('link',{name:'Pregătire Examen'}).count(),1);
 const current=await page.evaluate(()=>TW_COURSE.chapters.flatMap(chapter=>chapter.lessons.map(lesson=>lesson.id)));
 assert(baseline.every(id=>current.includes(id)),'Old lesson IDs must survive');
 await page.goto(base+'/examen');
 await page.waitForSelector('.exercise-card');
 // Native course progress is not touched by the exam bank or sandbox storage.
 await page.evaluate(()=>localStorage.setItem('tw-infoid26-progress-v2','{"sentinel":"untouched"}'));
 await page.locator('#exam-category').selectOption('oral');
 assert.equal(await page.locator('.exercise-card').count(),bank.filter(item=>item.category==='oral').length);
 await page.locator('#exam-category').selectOption('all');
 await page.locator('#exam-search').fill('no-matching-exercise-xyz');
 assert.equal(await page.locator('.exercise-card').count(),0);
 await page.locator('#exam-search').fill('');
 // Execute every bank solution and an empty-answer negative control in the shipped
 // browser runner, including actual HTTP evaluation of Node/Express exercises.
 const report=[];
 for(const item of bank.filter(item=>item.task)){
  const result=await page.evaluate(async id=>{
   const item=TW_EXAM.exercises.find(value=>value.id===id);
   const good=await TW_RUNNER.check(item.task,item.task.solution);
   const bad=await TW_RUNNER.check(item.task,'');
   return {id,mode:item.task.mode,passed:good.length>0&&good.every(row=>row.passed),negativeRejected:bad.length>0&&bad.some(row=>!row.passed),failures:good.filter(row=>!row.passed)};
  },item.id);
  report.push(result);
  if(report.length%10===0)console.log('Exam solutions checked:',report.length);
 }
 await fs.writeFile('.audit/exam-results.json',JSON.stringify(report,null,2));
 const failures=report.filter(item=>!item.passed||!item.negativeRejected);
 console.log(JSON.stringify({exercises:bank.length,automatic:report.length,failures},null,2));
 assert.equal(await page.evaluate(()=>localStorage.getItem('tw-infoid26-progress-v2')),'{"sentinel":"untouched"}');
 // UI, code editing and progress invalidation.
 await page.goto(base+'/examen#exercitiu/exam-client-description');
 await page.waitForSelector('.cm-editor');
 const item=bank.find(value=>value.id==='exam-client-description');
 await page.evaluate(code=>{const field=document.querySelector('#exam-code');field.value=code;field.dispatchEvent(new Event('input',{bubbles:true}));},item.task.solution);
 await page.locator('#exam-check').click();
 await page.waitForFunction(()=>document.querySelector('#exam-status').textContent.startsWith('Verificările au trecut'),{timeout:20000});
 await page.reload();await page.waitForSelector('.cm-editor');
 assert.equal(await page.locator('#exam-code').inputValue(),item.task.solution);
 await page.evaluate(()=>{const field=document.querySelector('#exam-code');field.value+='\n';field.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tw-infoid26-exam-v1'))['exam-client-description'].done),false);
 await page.locator('#timer-start').click();
 await page.waitForTimeout(1100);
 assert.notEqual(await page.locator('#exercise-clock').textContent(),'15:00');
 await page.locator('#timer-pause').click();
 const paused=await page.locator('#exercise-clock').textContent();
 await page.waitForTimeout(1100);
 assert.equal(await page.locator('#exercise-clock').textContent(),paused);
 await page.locator('#timer-reset').click();assert.equal(await page.locator('#exercise-clock').textContent(),'15:00');
 // Oral practice is self-assessed and has a working model answer.
 await page.goto(base+'/examen#exercitiu/exam-oral-callback-return');
 await page.waitForSelector('#exam-notes');
 await page.locator('#exam-notes').fill('Callback-ul returnează separat.');
 await page.locator('#oral-done').click();
 assert(await page.locator('#oral-done').textContent()==='Autoevaluare înregistrată');
 // Simulation preparation is read-only; a phase transition enables its editor.
 await page.locator('#start-simulation').click();
 assert(await page.locator('#exam-code').isDisabled());
 assert.equal(await page.locator('.cm-editor').count(),0);
 await page.locator('#simulation-next').click();
 await page.waitForSelector('.cm-editor');
 assert((await page.locator('#simulation-status').textContent()).startsWith('CSS'));
 await page.locator('#simulation-end').click();
 // Verify actual hover behaviour, beyond the text-oriented checks.
 await page.goto(base+'/examen#exercitiu/exam-css-timetable');await page.waitForSelector('.cm-editor');
 await page.evaluate(async()=>{
  const item=TW_EXAM.exercises.find(value=>value.id==='exam-css-timetable');
  await TW_RUNNER.preview(item.task,item.task.solution,document.querySelector('#exam-preview'));
  document.querySelector('#exam-preview').hidden=false;
 });
 const frame=page.frameLocator('#exam-preview');
 await frame.locator('tbody tr:nth-child(2) th').hover();
 assert.equal(await frame.locator('tbody tr:nth-child(2) td:nth-child(2)').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)');
 assert.equal(await frame.locator('tbody tr:nth-child(2) td:nth-child(3)').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
 await frame.locator('tbody tr:nth-child(4) th').hover();
 assert.notEqual(await frame.locator('tbody tr:nth-child(4) td:nth-child(2)').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)');
 await frame.locator('tbody tr:nth-child(2) td:nth-child(2)').hover();
 assert.notEqual(await frame.locator('tbody tr:nth-child(2) td:nth-child(2)').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 255)');
 await page.goto(base+'/examen');
 await page.waitForSelector('.exercise-card');
 await page.screenshot({path:'.audit/exam-desktop.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile page overflows');
 await page.screenshot({path:'.audit/exam-mobile.png',fullPage:false});
 await page.goto(base+'/examen#exercitiu/exam-client-slider-storage');
 await page.waitForSelector('.cm-editor');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile exercise overflows');
 assert.deepEqual(errors,[]);
 assert.equal(failures.length,0,'See .audit/exam-results.json');
 console.log('PASS: all exam solutions/negative controls, existing lesson IDs, routes, filters, editor, isolated progress, timer, oral practice, simulation, hover, desktop/mobile.');
}finally{
 await browser.close();
 server.closeAllConnections();
 await new Promise(resolve=>server.close(resolve));
}
