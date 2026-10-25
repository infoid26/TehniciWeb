import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createServer,closeProject} from './serve.mjs';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/Axi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
await fs.mkdir('.audit/dulcelind',{recursive:true});
process.env.TEMP=path.resolve('.audit/dulcelind');process.env.TMP=process.env.TEMP;
const server=createServer({env:{}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
let browser;
try{
  browser=await playwright.chromium.launch({headless:true,executablePath:process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  // External fonts, icon CDN and YouTube remain original external dependencies.
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)missing.push(r.url());});
  await page.goto(base);await page.waitForSelector('.path-node');
  await page.goto(base+'/project/');await page.waitForSelector('#grid-pagina');
  assert.equal(await page.locator('html').getAttribute('lang'),'ro');
  assert.equal(await page.locator('#t').innerText(),'Cofetaria Dulcelind');
  for(const id of ['welcome','promotii','produse','orar','anunturi','index-intrebari','retete','galerie-statica'])assert.equal(await page.locator('#'+id).count(),1);
  assert.equal(await page.locator('#tab-orar tbody tr').count(),7);
  assert.equal(await page.locator('a[target="ifr-video"]').count(),3);
  await page.locator('#ok_cookies').click();
  await page.locator('#schimba_tema').click();assert(await page.locator('body').evaluate(el=>el.classList.contains('dark')));
  await page.reload();assert(await page.locator('body').evaluate(el=>el.classList.contains('dark')));assert(await page.locator('#banner').isHidden());
  await page.locator('#schimba_tema').click();
  assert(await page.locator('video').evaluate(el=>el.readyState>=1||new Promise(resolve=>{el.onloadedmetadata=()=>resolve(true);el.onerror=()=>resolve(false);setTimeout(()=>resolve(false),5000);})));
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:1000});
    await page.screenshot({path:'.audit/dulcelind/home-'+width+'.png',fullPage:true,animations:'disabled',style:'video,iframe { visibility:hidden !important; }'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'/project/produse');assert.equal(await page.locator('.produs').count(),21);
  await page.locator('#inp-nume').fill('sav');await page.locator('#filtrare').click();assert.equal(await page.locator('.produs:visible').count(),1);
  await page.locator('#resetare').click();assert.equal(await page.locator('.produs:visible').count(),21);
  await page.locator('#i_rad1').check();await page.locator('#filtrare').click();
  for(const text of await page.locator('.produs:visible .val-calorii').allTextContents())assert(Number(text)<350);
  await page.locator('#resetare').click();
  await page.locator('#inp-categorie').selectOption('dietetica');await page.locator('#filtrare').click();assert.equal(await page.locator('.produs:visible').count(),1);
  await page.locator('#inp-categorie').selectOption('toate');await page.locator('#resetare').click();
  for(const [button,sign] of [['#sortCrescNume',1],['#sortDescrescNume',-1]]){
    await page.locator(button).click();const prices=(await page.locator('.val-pret').allTextContents()).map(Number);
    assert(prices.every((p,i)=>!i||sign*(p-prices[i-1])>=0));
  }
  const total=(await page.locator('.val-pret').allTextContents()).reduce((sum,x)=>sum+Number(x),0);
  await page.keyboard.press('Alt+c');assert.equal(Number(await page.locator('#suma_preturi').innerText()),total);
  await page.waitForFunction(()=>!document.getElementById('suma_preturi'));
  const choice=page.locator('.select-cos').first();const id=await choice.inputValue();await choice.check();
  await page.reload();assert(await page.locator('.select-cos[value="'+id+'"]').isChecked());
  await page.screenshot({path:'.audit/dulcelind/products.png',fullPage:true,animations:'disabled'});
  await page.goto(base+'/project/produs/1');assert((await page.locator('#art-produs').innerText()).includes('Savarin'));
  assert.equal(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||i.naturalWidth===0).length),0);
  await page.screenshot({path:'.audit/dulcelind/product.png',fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('PASS: Dulcelind browser pages, mounted assets, video, filters, sorting, Alt+C, saved cart, saved theme, cookies, and desktop/tablet/mobile screenshots. External services excluded.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));await closeProject();}
