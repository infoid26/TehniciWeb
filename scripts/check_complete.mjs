import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from './serve.mjs';
const require=createRequire(import.meta.url);
await fs.mkdir('.audit/browser-temp',{recursive:true});
process.env.TEMP=path.resolve('.audit/browser-temp');
process.env.TMP=process.env.TEMP;
let playwright;
try { playwright=require('playwright'); }
catch { playwright=require('C:/Users/Axi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const server=createServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await playwright.chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.path-node');
 const report=await page.evaluate(async()=>{
   await window.TW_LOAD_EDITOR();
   const results=[];
   for(const chapter of TW_COURSE.chapters)for(const lesson of chapter.lessons) {
    const good=await TW_RUNNER.check(lesson.task,lesson.task.solution);
    const wrong=lesson.task.mode==='js'?'function solve(input){return null;}':'';
    const bad=await TW_RUNNER.check(lesson.task,wrong);
    results.push({id:lesson.id,mode:lesson.task.mode,checks:good.length,passed:good.length>0&&good.every(t=>t.passed),negativeRejected:bad.length>0&&!bad.every(t=>t.passed),failures:good.filter(t=>!t.passed)});
   }
   return results;
 });
 await fs.writeFile('.audit/complete-results.json',JSON.stringify(report,null,2));
 const failed=report.filter(t=>!t.passed||!t.negativeRejected);
 console.log(JSON.stringify({lessons:report.length,checks:report.reduce((s,t)=>s+t.checks,0),failures:failed},null,2));
 // Navigation, CodeMirror, progress invalidation, source library and mobile layout.
 const lesson=await page.evaluate(()=>TW_COURSE.chapters[0].lessons[0]);
 await page.evaluate(id=>{location.hash='lectie/'+id+'/0';},lesson.id);
 await page.waitForSelector('.player');
 await page.locator('#continue').click();await page.locator('#continue').click();
 await page.locator(`[data-answer="${lesson.quiz.correct}"]`).click();
 await page.locator('#continue').click();
 await page.waitForSelector('.cm-editor');
 await page.evaluate(code=>{const input=document.querySelector('#code');input.value=code;input.dispatchEvent(new Event('input',{bubbles:true}));},lesson.task.solution);
 await page.locator('#check').click();await page.waitForSelector('#task-status.good');
 await page.reload();await page.waitForSelector('.cm-editor');assert(!await page.locator('#continue').isDisabled());
 await page.evaluate(()=>{const input=document.querySelector('#code');input.value+=' ';input.dispatchEvent(new Event('input',{bubbles:true}));});assert(await page.locator('#continue').isDisabled());
 assert.equal(await page.locator('a[href="#surse"]').count(),0);
 await page.evaluate(()=>{location.hash='acasa';});await page.waitForSelector('.path-node');
 await page.locator('#search').fill('no-such-lesson-xyz');assert.equal(await page.locator('.no-result').count(),1);
 await page.locator('#search').fill('');await page.screenshot({path:'.audit/desktop-v2.png'});
 assert.equal(await page.locator('.node-bubble').first().evaluate(el=>Math.round(el.getBoundingClientRect().width)),84);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.audit/mobile-v2.png'});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.equal(await page.locator('.node-bubble').first().evaluate(el=>Math.round(el.getBoundingClientRect().width)),70);
 // Reference project: route/data/template chain and browser interactions.
 await page.goto(url+'/project/products');await page.waitForSelector('.product-card');
 assert.equal(await page.locator('.product-card').count(),8);
 await page.locator('#dismiss-cookies').click();
 await page.locator('#search-name').fill('Chocolate');assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.locator('.product-card:visible .cart-choice').first().check();assert.equal(await page.locator('#cart-count').textContent(),'1');
 await page.reload();assert.equal(await page.locator('#cart-count').textContent(),'1');
 await page.locator('#dismiss-cookies').click();
 await page.locator('#theme-toggle').click();assert(await page.locator('body').evaluate(el=>el.classList.contains('light')));
 await page.reload();assert(await page.locator('body').evaluate(el=>el.classList.contains('light')));
 assert.equal((await page.request.get(url+'/project/product/1')).status(),200);
 assert.equal((await page.request.get(url+'/project/product/999')).status(),404);
 assert.equal((await page.request.get(url+'/project/product/abc')).status(),400);
 assert.equal((await page.request.get(url+'/project/missing')).status(),404);
 await page.goto(url+'/project/');await page.waitForSelector('.gallery figure');
 assert.equal(await page.locator('.gallery figure').count(),3);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'.audit/project-mobile.png'});
 assert.deepEqual(errors,[]);
 assert.equal(failed.length,0,'Reference solutions or negative controls failed: see .audit/complete-results.json');
 console.log('PASS: all solutions, negative controls, navigation, CodeMirror, progress, removed references, desktop/mobile, project routes and interactions.');
} finally { await browser.close(); server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
