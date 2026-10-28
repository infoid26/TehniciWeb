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
for(const name of ['dataTableHTML','sqlTablesHTML','taskContextHTML','reasoningHTML','taskHTML']) {
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
console.log(`PASS: ${count} independent learning tasks render with self-contained data and help above the editor.`);

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

// Exercise the shipped lesson controls with persisted answers and asynchronous checks.
function element() {
 const classes=new Set();
 return {hidden:false,disabled:false,value:'',textContent:'',innerHTML:'',className:'',listeners:{},
  classList:{add:value=>classes.add(value),remove:value=>classes.delete(value),contains:value=>classes.has(value)},
  addEventListener(type,handler){this.listeners[type]=handler;},focus(){},
  dispatchEvent(event){this.listeners[event.type]?.(event);}};
}
const controls=new Map();
const quizButtons=Array.from({length:3},(_,index)=>Object.assign(element(),{dataset:{answer:String(index)}}));
const lesson={id:'flow',chapter:{title:'Chapter'},title:'Lesson',points:[],quiz:{question:'Question',options:['A','B','C'],correct:1,explanation:'Explanation'},task:{mode:'text',starter:'',solution:'answer'}};
const progress={code:'',quiz:null,verified:null};
let markup='';
const player={focus(){},set innerHTML(value){
 markup=value;controls.clear();
 for(const id of ['quiz-feedback','code','line-numbers','task-status','test-output','check','stop','reset-code'])controls.set('#'+id,element());
 controls.set('.exercise-help',element());controls.get('#code').value=progress.code;
 const tag=value.match(/<button id="continue"[^>]*>/)?.[0];
 if(tag)controls.set('#continue',Object.assign(element(),{hidden:tag.includes('hidden'),disabled:tag.includes('disabled')}));
 for(const button of quizButtons){button.disabled=progress.quiz===lesson.quiz.correct;button.classList.remove('wrong');button.classList.remove('right');}
}};
let checkResult=[{label:'Answer',passed:false}],persisted=0;
const flow=vm.createContext({
 window:{TW_EDITOR:{clear(){}},TW_RUNNER:{check:async()=>checkResult},scrollTo(){}},
 document:{querySelector:selector=>controls.get(selector)||null,querySelectorAll:()=>quizButtons},
 main:player,location:{hash:''},state:{},lessons:[lesson],lesson,
 record:()=>progress,quizDone:()=>progress.quiz===lesson.quiz.correct,
 codeDone:()=>progress.verified!==null&&progress.verified===progress.code,
 save:()=>persisted++,updateProgress:()=>0,startStep:()=>0,esc:String,rich:String,format:String,
 taskHTML:()=>'<textarea id="code"></textarea>',stepNames:['Intro','Example','Question','Exercise','Done'],
 learningIntroHTML:()=>'',confirm:()=>true,Event,byId:new Map([[lesson.id,lesson]])
});
vm.runInContext('let running=false;let routeGeneration=0;let cancelRun=null;',flow);
for(const name of ['updateContinue','answer','bindTask','verify','lessonPage','route']){
 const fn=body.find(node=>node.type==='FunctionDeclaration'&&node.id.name===name);
 vm.runInContext(source.slice(fn.start,fn.end),flow);
}
const run=code=>vm.runInContext(code,flow);
const next=()=>controls.get('#continue');
run('lessonPage(lesson,2)');
assert(next().hidden&&next().disabled);assert(!markup.includes('id="check"'));
quizButtons[0].listeners.click();
assert(quizButtons[0].classList.contains('wrong'));assert(quizButtons.every(button=>!button.disabled));
assert(next().hidden&&next().disabled);assert.equal(progress.quiz,null);
next().listeners.click();assert.equal(flow.location.hash,'','Incorrect answers cannot advance');
quizButtons[1].listeners.click();
assert.equal(progress.quiz,1);assert(quizButtons.every(button=>button.disabled));assert(quizButtons[1].classList.contains('right'));
assert(!next().hidden&&!next().disabled);
const saved=persisted;
run('answer(lesson,0,document.querySelectorAll(".quiz-option")[0])');
assert.equal(progress.quiz,1);assert.equal(persisted,saved,'Correct choices remain locked');
next().listeners.click();assert.equal(flow.location.hash,'lectie/flow/3');
run('lessonPage(lesson,2)');assert(!next().hidden);assert(quizButtons.every(button=>button.disabled));
run('lessonPage(lesson,3)');assert(next().hidden&&next().disabled);
await run('verify(lesson)');assert(next().hidden&&next().disabled);
checkResult=[{label:'Answer',passed:true}];
await run('verify(lesson)');assert(!next().hidden&&!next().disabled);
run('lessonPage(lesson,3)');assert(!next().hidden,'Verified answers can continue after restoration');
controls.get('#code').value='changed';controls.get('#code').dispatchEvent(new Event('input'));
assert(next().hidden&&next().disabled);assert.equal(progress.verified,null);
let resolveCheck;
flow.window.TW_RUNNER.check=()=>new Promise(resolve=>{resolveCheck=resolve;});
const pending=run('verify(lesson)');assert(next().hidden&&next().disabled);
controls.get('#code').value='changed again';controls.get('#code').dispatchEvent(new Event('input'));
resolveCheck([{label:'Answer',passed:true}]);await pending;
assert(next().hidden&&next().disabled);assert.equal(progress.verified,null,'Stale checks cannot unlock continuation');
flow.location.hash='#lectie/flow/4';await run('route()');
assert(markup.includes('id="code"'),'An unverified answer cannot open the completion page');
progress.quiz=null;flow.location.hash='#lectie/flow/3';await run('route()');
assert(markup.includes('data-answer="0"'),'An unanswered question cannot be skipped via the URL');
console.log('PASS: immediate quiz feedback, retry after mistakes, locked correct choices, restored answers and continuation gated by current verified work.');
