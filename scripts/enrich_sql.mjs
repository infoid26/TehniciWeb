// Build visible SQL tables from the same setup that the learner actually queries.
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {PGlite} from '@electric-sql/pglite';
const context={window:{}};
vm.runInNewContext(await fs.readFile('site/course.js','utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.TW_COURSE));
const db=new PGlite();await db.waitReady;
const previews=new Map();
const quote=value=>'"'+value.replaceAll('"','""')+'"';
try {
 for(const chapter of course.chapters)for(const lesson of chapter.lessons){
  const task=lesson.task;if(task.mode!=='sql')continue;
  if(!previews.has(task.setup)){
   await db.exec('BEGIN');
   try {
    if(task.setup)await db.exec(task.setup);
    const tables=await db.query("SELECT table_schema,table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema,table_name");
    const data=[];
    for(const table of tables.rows){
     const columns=(await db.query('SELECT column_name,data_type FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position',[table.table_schema,table.table_name])).rows;
     const reference=quote(table.table_schema)+'.'+quote(table.table_name);
     const order=columns.some(c=>c.column_name==='id')?' ORDER BY id':'';
     const rows=(await db.query('SELECT * FROM '+reference+order+' LIMIT 20')).rows;
     for(const row of rows)for(const c of columns)if(c.data_type.includes('timestamp')&&row[c.column_name]!==null)row[c.column_name]='generated at start';
     const count=Number((await db.query('SELECT count(*) AS count FROM '+reference)).rows[0].count);
     data.push({name:table.table_schema==='public'?table.table_name:table.table_schema+'.'+table.table_name,columns:columns.map(c=>c.column_name),rows,totalRows:count});
    }
    previews.set(task.setup,data);
   } finally {await db.exec('ROLLBACK');}
  }
  task.tables=structuredClone(previews.get(task.setup));
  if(task.mode==='sql'&&/^SELECT\s/i.test(lesson.example.trim())&&task.setup){
   await db.exec('BEGIN');
   try {await db.exec(task.setup);lesson.exampleResult=(await db.exec(lesson.example)).at(-1)?.rows;} finally {await db.exec('ROLLBACK');}
  }

  const usedTables=[...task.solution.matchAll(/\b(?:FROM|JOIN|INTO|UPDATE|REFERENCES)\s+([\w.]+)/gi)].map(m=>m[1].toLowerCase());
  const relevant=task.tables.filter(t=>usedTables.includes(t.name.toLowerCase())||usedTables.includes(t.name.split('.').at(-1).toLowerCase()));
  if(relevant.length)task.tables=relevant;
  if(lesson.id==='sql-group')task.visibleColumns=['name','category'];
 }
} finally {await db.close();}
await fs.writeFile('site/course.js','window.TW_COURSE = '+JSON.stringify(course,null,2)+';\n');
console.log('SQL table previews generated from '+previews.size+' real database setups.');
