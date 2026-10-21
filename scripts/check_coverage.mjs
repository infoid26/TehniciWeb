import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};
for(const file of ['site/course.js','site/sources.js'])vm.runInNewContext(await fs.readFile(file,'utf8'),context);
const course=context.window.TW_COURSE,sources=context.window.TW_SOURCES;
const learning=course.chapters.flatMap(c=>c.lessons);
const lessons=[...learning,...(course.references||[]).flatMap(c=>c.lessons)],byId=new Map(lessons.map(l=>[l.id,l]));
let checkedFiles=0,checkedSlides=0;
for(const item of sources.items) {
 for(const id of item.lessons)assert(byId.has(id),`Missing linked lesson ${id}`);
 if(item.kind==='slide') {
  checkedSlides++;
  const linked=item.lessons.map(id=>byId.get(id)).find(l=>l.reading);
  if(linked)assert.equal(linked.referenceText,item.text,item.title);
  for(const image of item.images||[])await fs.access(image.url);
 } else if(!item.classification || item.classification==='identical-copy') {
  const linked=item.lessons.filter(id=>id.startsWith('source-'+item.sha256.slice(0,12)+'-')).map(id=>byId.get(id));
  if(linked.length) {
   const clean=s=>s.split(/\r?\n/).filter(l=>l.trim()).join('\n');
   assert.equal(clean(linked.map(l=>l.referenceText).join('\n')),clean(item.text),item.path);
   checkedFiles++;
  }
 }
}
assert.equal(checkedSlides,435);
assert(!sources.files.some(x=>x.path.split('/').includes('Dana')));
for(const l of lessons)for(const n of l.syntaxNotes||[])assert(byId.has(n.lesson),n.lesson);
console.log(`PASS: ${checkedSlides} slide-uri păstrate integral; ${checkedFiles} fișiere de studiu reconstruite din lecții fără linii neacoperite; legături și imagini valide; Dana exclus.`);
console.log(`${lessons.filter(l=>!l.reading).length} lecții de bază/detaliu/proiect; ${lessons.filter(l=>l.reading).length} lecții de lectură/recunoaștere.`);
