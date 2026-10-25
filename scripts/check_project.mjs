import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {createServer,closeProject} from './serve.mjs';
import {inject} from './inject.mjs';
const require=createRequire(import.meta.url);
const server=createServer({production:true,env:{}});
const request=path=>inject(server.listeners('request')[0],{path,timeout:30000});
assert(!require.cache[require.resolve('../project-reference/app.js')]);
const files=['resurse/css/general.css','resurse/css/customizare_bootstrap.css','resurse/imagini/galerie/mediu/briose-frisca.webp'];
const stats=()=>Promise.all(files.map(file=>fs.stat('project-reference/'+file).then(s=>s.mtimeMs)));
const before=await stats();
try{
  assert.equal((await request('/')).status,200);
  assert(!require.cache[require.resolve('../project-reference/app.js')],'Course must not load Dulcelind');
  for(const [route,status,text] of [
    ['/project',302,null],['/project/',200,'Cofetaria <span>Dulcelind'],['/project/home',200,'Bine ati venit'],
    ['/project/despre',200,'Alta pagina'],['/project/produse',200,'Savarin'],
    ['/project/produse?tip=patiserie',200,'Cozonac'],['/project/produs/1',200,'Savarin'],
    ['/project/produs/999',404,'404 - N-am, bre!'],['/project/produs/abc',400,'Cerere gresita'],
    ['/project/produse?tip=invalid',400,'Cerere gresita'],["/project/produse?tip=cofetarie%27",400,'Cerere gresita'],
    ['/project/produse?tip=patiserie&tip=cofetarie',400,'Cerere gresita'],['/project/index.ejs',400,'Cerere gresita'],
    ['/project/resurse',403,'403 -'],['/project/resurse/imagini',403,'403 -'],['/project/missing',404,'404 -'],
    ['/project/resurse/css/general.css',200,'grid-pagina'],['/project/dist/js/bootstrap.js',200,'Bootstrap'],
    ['/project/resurse/video/Chocolate.mp4',200,null],['/site/sources.js',404,null]
  ]){
    const response=await request(route);assert.equal(response.status,status,route);
    if(text)assert(response.body.includes(text),route);
  }
  const health=JSON.parse((await request('/project/health')).body);
  assert.equal(health.database,'PGlite');assert.equal(health.products,21);
  const home=(await request('/project/')).body;
  for(const id of ['welcome','promotii','produse','orar','anunturi','index-intrebari','retete','galerie-statica'])assert(home.includes('id="'+id+'"'),id);
  assert(home.includes('/project/resurse/imagini/farfurie-flori-albastre.png'));
  assert(!/\b(?:href|src)=["']?\/(?!\/|project\/)/.test(home));
  const products=(await request('/project/produse')).body;
  assert.equal((products.match(/class="produs"/g)||[]).length,21);
  assert.equal(((await request('/project/produse?tip=patiserie')).body.match(/class="produs"/g)||[]).length,7);
  assert.equal(((await request('/project/produse?tip=gelaterie')).body.match(/class="produs"/g)||[]).length,5);
  assert(products.includes('/project/produs/1'));
  const css=(await request('/project/resurse/css/eroare.css')).body;
  assert(css.includes('/project/resurse/imagini/fursecuri.png'));
  assert.deepEqual(await stats(),before,'Runtime must not rebuild assets');
  assert(!require.cache[require.resolve('sass')]);assert(!require.cache[require.resolve('sharp')]);
  console.log('PASS: Dulcelind original pages, 21 SQL products, categories, parameter validation, errors, mounted URLs, video and lazy loading without runtime asset writes.');
}finally{server.close();await closeProject();}
