import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};
vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const course=context.window.TW_COURSE;
assert.equal(course.chapters.length,42);
assert(course.chapters.flatMap(c=>c.lessons).length>=844);
assert(!course.references);
for(const chapter of course.chapters){
 assert(!chapter.source);
 for(const lesson of chapter.lessons)assert(!lesson.reading&&!lesson.referenceText&&!lesson.referenceImages&&!lesson.source);
}
assert(!(await fs.readdir('site')).some(name=>name==='sources.js'||name.startsWith('source-')));
const app=await fs.readFile('site/app.js','utf8');
for(const text of ['Sursa acestei lecții','download-code','Ctrl + Enter:','href="#surse"','TW_SOURCES'])assert(!app.includes(text),text);
console.log(course.chapters.flatMap(c=>c.lessons).length+' lessons including independent integration examples; original reference library, source images, lesson citations and editor download UI removed.');
