/* Teste în browser cu profil temporar separat; nu folosește profilul personal. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function checkBrowser(page) {
  const audit = path.join(root, '.audit');
  await fs.mkdir(audit, {recursive:true});
  const errors=[];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.accept());
  page.setDefaultTimeout(7000);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(new URL('../index.html', import.meta.url).href);
  await page.waitForSelector('#chapter-list');
  await page.evaluate(() => { localStorage.removeItem('tw-infoid26-progress-v1'); });
  await page.reload();
  await page.waitForSelector('#chapter-list');
  const report=await page.evaluate(async () => {
    const out=[];
    for(const c of TW_COURSE.chapters) for(const l of c.lessons) {
      const good=await TW_RUNNER.check(l.task,l.task.solution);
      const bad=await TW_RUNNER.check(l.task,l.task.mode==='js'?'function solve(input){return null;}':'');
      out.push({id:l.id,passed:good.every(t=>t.passed),negativeRejected:!bad.every(t=>t.passed),checks:good.length,failures:good.filter(t=>!t.passed)});
    }
    return out;
  });
  await fs.writeFile(path.join(audit,'browser-results.json'),JSON.stringify(report,null,2));
  assert(report.every(t=>t.passed && t.negativeRejected),JSON.stringify(report.filter(t=>!t.passed || !t.negativeRejected)));
  const timeout=await page.evaluate(() => TW_RUNNER.check({mode:'js',cases:[{input:1,expected:1}]},'function solve(input){while(true){}}'));
  assert(timeout.some(t=>t.error?.includes('depășit')));
  await page.evaluate(() => { location.hash='lectie/web/0'; });
  await page.waitForSelector('.player');
  await page.locator('#continue').click();
  await page.waitForFunction(()=>document.querySelector('.step-count')?.textContent==='2 / 5');
  await page.locator('#continue').click();
  await page.locator('[data-answer="1"]').click();
  assert(await page.locator('#continue').isDisabled());
  await page.locator('[data-answer="0"]').click();
  await page.locator('#continue').click();
  const solution=await page.evaluate(()=>TW_COURSE.chapters[0].lessons[0].task.solution);
  await page.locator('#code').fill(solution);
  await page.locator('#check').click();
  await page.waitForSelector('#task-status.good');
  await page.reload();
  await page.waitForSelector('#code');
  assert(!await page.locator('#continue').isDisabled());
  await page.locator('#code').fill(solution+' ');
  assert(await page.locator('#continue').isDisabled());
  await page.locator('#check').click();
  await page.waitForSelector('#task-status.good');
  await page.locator('#continue').click();
  await page.waitForFunction(()=>document.querySelector('.step-count')?.textContent==='5 / 5');
  await page.evaluate(()=>{location.hash='lectie/document/4';});
  await page.waitForFunction(()=>document.querySelector('.step-count')?.textContent==='3 / 5');
  await page.evaluate(()=>{location.hash='acasa';});
  await page.waitForSelector('#import',{state:'attached'});
  await page.locator('.tools').evaluate(el=>{el.open=true;});
  await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});
  await page.waitForFunction(()=>document.querySelector('#backup-status').textContent.includes('Nu am restaurat'));
  const backup=await page.evaluate(()=>localStorage.getItem('tw-infoid26-progress-v1'));
  await page.locator('#import').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await page.waitForFunction(()=>document.querySelector('#backup-status').textContent.includes('Progres restaurat'));
  const downloaded=page.waitForEvent('download');
  await page.locator('#export').click();
  assert.equal((await downloaded).suggestedFilename(),'TehniciWeb-progres.json');
  await page.locator('#search').fill('absent-fara-rezultate');
  assert.equal(await page.locator('.no-result').count(),1);
  await page.locator('#search').fill('');
  await page.locator('.tools').evaluate(el=>{el.open=false;});
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
  await page.screenshot({path:path.join(audit,'desktop.png')});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.scrollTo(0,0));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await page.screenshot({path:path.join(audit,'mobile.png')});
  assert.deepEqual(errors,[]);
  return {lessons:report.length,checks:report.reduce((n,t)=>n+t.checks,0),negativeControls:report.length,ui:'PASS',timeout:'PASS',mobile:'PASS',importExport:'PASS'};
}

// Poate fi importat de un instrument de test sau pornit direct cu Node.
if(typeof process !== 'undefined' && process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const require=createRequire(import.meta.url);
  let playwright;
  try { playwright=require('playwright'); }
  catch {
    const runtimeModule=path.resolve(path.dirname(process.execPath),'..','node_modules','playwright');
    try { playwright=require(runtimeModule); }
    catch { throw new Error('Testul opțional cere Playwright. Instalează-l ca dependență de dezvoltare sau folosește runtime-ul Codex. Aplicația nu are nevoie de el.'); }
  }
  const browser=await playwright.chromium.launch({executablePath:process.env.TW_BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try { console.log(await checkBrowser(await browser.newPage())); }
  finally { await browser.close(); }
}
