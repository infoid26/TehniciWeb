import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import sharp from 'sharp';
import * as sass from 'sass';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../project-reference');
const scss=path.join(root,'resurse/scss');
for(const file of await fs.readdir(scss)){
  if(!file.endsWith('.scss'))continue;
  // Keep the teacher's distributed Bootstrap CSS byte-for-byte unless explicitly rebuilding it.
  if(file==='customizare_bootstrap.scss'&&!process.argv.includes('--styles'))continue;
  const input=(await fs.readFile(path.join(scss,file),'utf8')).replaceAll('../../node_modules/','');
  const result=sass.compileString(input,{url:pathToFileURL(path.join(scss,file)),loadPaths:[path.resolve(root,'../node_modules')],silenceDeprecations:['import','global-builtin','color-functions','if-function']});
  await fs.writeFile(path.join(root,'resurse/css',path.parse(file).name+'.css'),result.css);
}
const gallery=JSON.parse(await fs.readFile(path.join(root,'resurse/json/galerie.json'),'utf8'));
const folder=path.join(root,gallery.cale_galerie);
await fs.mkdir(path.join(folder,'mediu'),{recursive:true});
await Promise.all(gallery.imagini.map(image=>sharp(path.join(folder,image.fisier)).resize(300).toFile(path.join(folder,'mediu',path.parse(image.fisier).name+'.webp'))));
console.log('Dulcelind: SCSS and gallery images prepared; no work required at server startup.');
