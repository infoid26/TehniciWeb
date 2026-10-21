import {PGlite} from '@electric-sql/pglite';

const stable=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
self.onmessage=async ({data:{task,code}})=>{
 let db;
 try {
  db=new PGlite();
  await db.waitReady;
  if(task.setup)await db.exec(task.setup);
  await db.exec("SET statement_timeout='4s'");
  const result=await db.exec(code);
  const rows=task.checkQuery?(await db.exec(task.checkQuery)).at(-1)?.rows:result.at(-1)?.rows;
  self.postMessage([{label:'Rezultatul SQL',expected:task.expected,actual:rows,passed:stable(rows)===stable(task.expected)}]);
 } catch(error) { self.postMessage([{label:'Execuție SQL',passed:false,error:error.message}]); }
 finally {await db?.close();}
};
