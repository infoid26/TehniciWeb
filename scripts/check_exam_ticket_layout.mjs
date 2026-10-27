import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/Axi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=process.cwd();await fs.mkdir('.audit/browser-temp',{recursive:true});
const browser=await playwright.chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,env:{...process.env,TEMP:path.resolve('.audit/browser-temp'),TMP:path.resolve('.audit/browser-temp')}});
try{
 const page=await browser.newPage({viewport:{width:1280,height:1100}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://tw-exam.test/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname==='/api/account'){await route.fulfill({json:{enabled:false,user:null}});return;}
  const file=path.join(root,url.pathname==='/examen'?'site/exam.html':url.pathname.slice(1));
  try{const body=await fs.readFile(file);await route.fulfill({body,contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});}catch{await route.fulfill({status:404,body:'Not found'});}
 });
 await page.goto('https://tw-exam.test/examen');
 await page.locator('#start-simulation:not([disabled])').waitFor();
 await page.locator('#start-simulation').click();
 await page.evaluate(()=>{Math.random=()=>116.5/120;});await page.locator('#draw-ticket').click();
 await page.locator('.ticket-number').first().waitFor();
 assert.deepEqual(await page.locator('.ticket-number').allTextContents(),['1)','2)']);
 assert.equal(await page.locator('.ticket-material,.ticket-materials').count(),0);
 assert((await page.locator('.ticket-question').first().textContent()).includes('„Tort”'));
 await page.waitForFunction(()=>{const frame=document.querySelector('[data-ticket-preview="ticket-css-animation"]');return frame&&frame.getBoundingClientRect().height<150;});
 const badge=page.frames().find(frame=>frame.url()==='about:srcdoc');
 assert(badge,'Example frame exists');
 assert.equal(await badge.locator('.product').first().evaluate(el=>getComputedStyle(el,'::before').content),'"Nou"');
 assert.equal(await badge.locator('.product').nth(1).evaluate(el=>getComputedStyle(el,'::before').content),'none');
 assert.equal(await page.locator('.ticket-source').count(),1,'Only the product structure is useful here');
 assert.equal(await page.locator('.ticket-sheet').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
 await page.screenshot({path:'.audit/ticket-117.png',fullPage:true});
 await page.locator('#begin-stage').click();await page.locator('.cm-editor').waitFor();
 await page.locator('#submit-stage').click();
 assert.deepEqual(await page.locator('#exam-workspace .ticket-number').allTextContents(),['2)']);
 await page.locator('#finish-attempt').click();await page.locator('#start-simulation').click();
 await page.evaluate(()=>{const list=TW_EXAM.tickets.filter(t=>t.category==='css'),index=list.findIndex(t=>t.ids.includes('ticket-css-focus')&&t.ids.includes('ticket-css-fixed'));Math.random=()=>(index+.5)/list.length;});
 await page.locator('#draw-ticket').click();
 await page.waitForFunction(()=>{const frame=document.querySelector('[data-ticket-preview="ticket-css-focus"]');return frame&&frame.getBoundingClientRect().height<150;});
 assert.equal(await page.locator('.ticket-source').count(),0,'Menu IDs already explained: no redundant HTML source');
 await page.screenshot({path:'.audit/ticket-menu.png',fullPage:true});
 await page.setViewportSize({width:430,height:1000});
 await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
 await page.screenshot({path:'.audit/ticket-menu-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: real headless Edge rendering; 1)/2) in preparation and working; expected badge illustration; examples resize to content; no nested material panels; HTML only for relevant structure; compact menu; mobile without horizontal overflow.');
}finally{await browser.close();}
