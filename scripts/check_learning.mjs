import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {parse} from 'acorn';
const source=await fs.readFile('site/app.js','utf8');
const body=parse(source,{ecmaVersion:'latest'}).body[0].expression.callee.body.body;
const context=vm.createContext({window:{},codeDone:()=>false});
for(const name of ['esc','rich','codeBlock','format']) {
 const declaration=body.find(node=>node.type==='VariableDeclaration'&&node.declarations.some(d=>d.id.name===name));
 vm.runInContext(source.slice(declaration.start,declaration.end),context);
}
for(const name of ['dataTableHTML','sqlTablesHTML','taskContextHTML','taskHTML']) {
 const fn=body.find(node=>node.type==='FunctionDeclaration'&&node.id.name===name);
 vm.runInContext(source.slice(fn.start,fn.end),context);
}
vm.runInContext(await fs.readFile('site/course.js','utf8'),context);
const course=context.window.TW_COURSE;
let count=0;
for(const chapter of course.chapters)for(const lesson of chapter.lessons) {
 assert(!lesson.reading,'Original files must not be compulsory learning tasks');
 assert(!/profesoarei/i.test(lesson.task.prompt),lesson.id);
 if(/din exemplu|exemplul afișat|structura afișată/i.test(lesson.task.prompt))assert(lesson.task.contextCode||lesson.task.fixture,lesson.id);
 context.lesson=lesson;
 const html=vm.runInContext('taskHTML(lesson,{code:lesson.task.starter})',context);
 assert(html.includes('>Indiciu</button>')&&html.includes('>Rezolvare</button>'),lesson.id);
 assert(html.indexOf('class="exercise-help"')<html.indexOf('class="workspace-grid"'),lesson.id);
 assert(html.includes('id="exercise-hint" class="help-content" hidden')&&html.includes('id="exercise-solution" class="help-content" hidden'),lesson.id);
 if(lesson.task.mode==='sql'&&lesson.task.setup)assert(html.includes('Baza de date de la care pornești'),lesson.id);
 if(lesson.task.mode==='ejs')assert(html.includes('Datele primite de template'),lesson.id);
 if(lesson.task.fixture)assert(html.includes('HTML furnizat'),lesson.id);
 count++;
}
const folder=course.chapters.flatMap(c=>c.lessons).find(l=>l.id==='start-folder');
assert.equal(folder.task.mode,'html');assert(folder.task.contextCode.includes('images/'));
console.log(`PASS: ${count} independent learning tasks render with self-contained data and PA help above the editor. No original source readings are published.`);

const sqlIntro=course.chapters.flatMap(c=>c.lessons).find(l=>l.id==='sql-select');
context.sqlIntro=sqlIntro;
const sqlHTML=vm.runInContext('taskHTML(sqlIntro,{code:sqlIntro.task.starter})',context);
assert.equal((sqlHTML.match(/<table /g)||[]).length,2,'Input and expected rows must be tables');
assert(sqlHTML.includes('<th scope="col">price</th>'));
assert(sqlHTML.includes('<details class="exercise-data sql-setup">'),'Setup is collapsed, optional material');
assert(!sqlHTML.includes('<details class="exercise-data sql-setup" open'));
assert(!sqlHTML.includes('&quot;price&quot;'),'The expected SQL result must not be JSON');
const escaped=vm.runInContext('dataTableHTML([{name:"<img src=x onerror=alert(1)>"}],"<script>")',context);
assert(!escaped.includes('<img'));assert(escaped.includes('&lt;img'));assert(escaped.includes('&lt;script&gt;'));
console.log('PASS: beginner SQL input/results render as accessible tables, setup stays collapsed, and cell content is escaped.');
