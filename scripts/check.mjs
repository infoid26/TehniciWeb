import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context = {window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'site/course.js'),'utf8'),context);
const course = JSON.parse(JSON.stringify(context.window.TW_COURSE));
const ids = new Set();
let cases = 0;
for (const chapter of course.chapters) {
  for (const lesson of chapter.lessons) {
    assert(!ids.has(lesson.id),`ID duplicat: ${lesson.id}`);
    ids.add(lesson.id);
    assert(lesson.intro && Array.isArray(lesson.points) && lesson.hint && lesson.task.solution,lesson.id);
    assert(lesson.quiz.correct >= 0 && lesson.quiz.correct < lesson.quiz.options.length);
    assert(new Set(lesson.quiz.options).size === lesson.quiz.options.length);
    const task = lesson.task;
    if (task.mode === 'js') {
      for (const test of task.cases) {
        const source = `${task.solution}\nJSON.stringify(solve(${JSON.stringify(test.input)}))`;
        const result = vm.runInNewContext(source,{}, {timeout:1000});
        assert.deepEqual(JSON.parse(result),test.expected,lesson.id);
        cases++;
      }
    }
    if (task.mode === 'json') assert.deepEqual(JSON.parse(task.solution),task.expected);
    if (['html','css'].includes(task.mode)) assert(task.tests.length > 0);
  }
}
for (const file of ['site/app.js','site/runner.js','site/course.js']) new vm.Script(await fs.readFile(path.join(root,file),'utf8'),{filename:file});
console.log(`${course.chapters.length} capitole, ${ids.size} lecții; ${cases} cazuri JavaScript verificate în Node. Structura și sintaxa sunt valide.`);
