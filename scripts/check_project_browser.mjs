import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {createServer,closeProject} from './serve.mjs';
const require=createRequire(import.meta.url);
await fs.mkdir('.audit/browser-temp',{recursive:true});
process.env.TEMP=path.resolve('.audit/browser-temp');process.env.TMP=process.env.TEMP;
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/Axi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const executablePath=process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined;
let browser;
try{
 browser=await playwright.chromium.launch({headless:true,executablePath});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base);await page.waitForSelector('.path-node');
 assert.equal(await page.locator('a[href="#surse"]').count(),0);
 assert.equal(await page.evaluate(()=>TW_COURSE.chapters.flatMap(c=>c.lessons).length),775);
 const lesson=await page.evaluate(()=>TW_COURSE.chapters[0].lessons[0]);
 await page.evaluate(id=>{location.hash=`lectie/${id}/0`;},lesson.id);await page.waitForSelector('.player');
 assert.equal(await page.getByText('Sursa acestei lecții',{exact:true}).count(),0);
 await page.locator('#continue').click();await page.locator('#continue').click();
 await page.locator(`[data-answer="${lesson.quiz.correct}"]`).click();await page.locator('#continue').click();
 await page.waitForSelector('#check');assert.equal(await page.locator('#download-code').count(),0);assert.equal(await page.locator('.editor-help').count(),0);
 await page.getByRole('button',{name:'Indiciu',exact:true}).click();assert(await page.locator('#exercise-hint').isVisible());
 for(const route of ['/site/sources.js','/site/source-025fcb00a747722f8db9.png'])assert.equal((await page.request.get(base+route)).status(),404);

 await page.goto(base+'/project/products');await page.waitForSelector('.product-card');
 await page.locator('#dismiss-cookies').click();assert.equal(await page.locator('.product-card:visible').count(),8);
 await page.locator('#search-name').fill('Chocolate');assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.locator('#search-name').fill('cake');assert.equal(await page.locator('.product-card:visible').count(),0); // prefix, not substring
 await page.locator('#reset-filters').click();await page.waitForFunction(()=>document.querySelectorAll('.product-card:not([hidden])').length===8);
 await page.locator('input[name="calories"][value="0:350"]').check();assert.equal(await page.locator('.product-card:visible').count(),4);
 await page.locator('input[name="calories"][value="350:700"]').check();assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.locator('input[name="calories"][value="700:Infinity"]').check();assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.locator('#reset-filters').click();await page.waitForFunction(()=>document.querySelector('[name="calories"]:checked').value==='all');
 await page.locator('#min-price').fill('12');assert.equal(await page.locator('.product-card:visible').count(),3);
 await page.locator('#reset-filters').click();await page.waitForFunction(()=>document.querySelector('#min-price').value==='0');
 await page.locator('#category').selectOption('diet');assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.locator('#category').selectOption('all');await page.locator('#ingredients').fill('almond');assert.equal(await page.locator('.product-card:visible').count(),1);
 await page.locator('#reset-filters').click();await page.waitForFunction(()=>document.querySelector('#ingredients').value==='');
 await page.locator('#sort').selectOption('desc');
 const sorted=await page.locator('.product-card').evaluateAll(cards=>cards.map(c=>({price:Number(c.dataset.price),name:c.dataset.name})));
 assert(sorted.every((p,i)=>!i||sorted[i-1].price>=p.price));
 const tie=sorted.filter(p=>p.price===12);assert.deepEqual(tie.map(p=>p.name),['chocolate celebration','chocolate cake']);
 await page.keyboard.press('Alt+c');assert.equal(await page.locator('#total-notice').textContent(),'Visible total: 80.00 EUR');
 await page.waitForFunction(()=>document.querySelector('#total-notice').hidden,{},{timeout:4000});
 const cartId=await page.locator('.cart-choice').first().getAttribute('data-id');
 await page.locator('.cart-choice').first().check();assert.equal(await page.locator('#cart-count').textContent(),'1');
 await page.reload();assert.equal(await page.locator('#cart-count').textContent(),'1');assert(await page.locator(`.cart-choice[data-id="${cartId}"]`).isChecked());
 await page.locator('#accept-cookies').click();await page.reload();assert(await page.locator('#cookie-banner').isHidden());
 await page.locator('#theme-toggle').click();await page.reload();assert(await page.locator('body').evaluate(el=>el.classList.contains('light')));
 for(const [route,status] of [['/project/products?type=pastry',200],['/project/product/1',200],['/project/product/abc',400],['/project/product/999',404],['/project/products?type=bad',400],['/project/missing',404],['/project/home.ejs',400],['/project/assets',403],['/project/assets/images',403],['/project/about',200],['/project/contact',200]])assert.equal((await page.request.get(base+route)).status(),status,route);
 await page.goto(base+'/project/');for(const id of ['welcome','offers','range','gallery','announcements','hours','faq','recipes'])assert.equal(await page.locator('#'+id).count(),1,id);
 assert.equal(await page.locator('#hours tbody tr').count(),7);assert.equal(await page.locator('.gallery figure').count(),3);
 assert(await page.locator('video').evaluate(el=>el.readyState>=1||new Promise(resolve=>{el.onloadedmetadata=()=>resolve(true);el.onerror=()=>resolve(false);setTimeout(()=>resolve(false),3000);})), 'Video metadata must load');
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Home overflow at ${width}`);
  await page.goto(base+'/project/products');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Products overflow at ${width}`);
  await page.goto(base+'/project/');
 }
 await page.setViewportSize({width:390,height:844});await page.locator('#menu-toggle').click();assert(await page.locator('#main-menu').isVisible());
 await page.screenshot({path:'.audit/project-mobile-updated.png'});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'.audit/project-desktop-updated.png'});
 assert.deepEqual(errors,[]);console.log('PASS: course cleanup, PA help, catalog filters/boundaries/reset, bidirectional sorting, Alt+C, persistent cart/theme/consent, all routes, home sections, media and mobile/desktop layouts.');
}finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await closeProject();}
