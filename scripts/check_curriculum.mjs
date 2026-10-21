import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};
for(const file of ['course','sources'])vm.runInNewContext(await fs.readFile(`site/${file}.js`,'utf8'),context);
const course=context.window.TW_COURSE,sources=context.window.TW_SOURCES;
const learning=course.chapters.flatMap(c=>c.lessons);
const code=l=>[l.example,l.task.solution,l.task.fixture||'',l.task.contextCode||'',...Object.values(l.task.files||{}),...Object.values(l.task.partials||{})].join('\n');
// These matches are prose placeholders, deliberate validation errors, or
// schematic method names, rather than HTML elements / library operations.
const placeholders=new Set(['sction','v1','sir1','sir2','inaltime','latime','latura-i','latura','vect','elem','matr','sir','SSS','metoda_1','metoda_2','metoda_3','metoda_n',
 // URL suffixes mistaken for methods; prose headings mistaken for declarations;
 // path.sep is a property (the slide lists it alongside functions).
 'com','html','js','url','tip','liniar','radial','column','dense','numere','culori','liste','div','sep']);
const tokens=new Map();
function record(kind,token,item){
 if(placeholders.has(token)||token.startsWith('--'))return;
 const key=kind+':'+token;
 if(!tokens.has(key))tokens.set(key,{kind,token,sources:[],lessons:[]});
 const entry=tokens.get(key);if(!entry.sources.includes(item.title))entry.sources.push(item.title);
}
for(const item of sources.items){
 if(['generated-output','identical-copy'].includes(item.classification)||/bootstrap/i.test(item.path))continue;
 for(const match of item.text.matchAll(/<\s*([a-z][a-z0-9-]*)\b/g))record('element',match[1],item);
 for(const match of item.text.matchAll(/\.([a-zA-Z_$][\w$]*)\s*\(/g))record('method',match[1],item);
 if(/\.(s?css)$/.test(item.path)||(item.path==='MathML si CSS.pptx'&&item.slide>=29)||item.path==='SASS.pptx'){
  for(const match of item.text.matchAll(/(?:^|[;{])\s*([a-z-]+)\s*:(?!:)/gm))record('property',match[1],item);
 }
}
const missing=[];
for(const entry of tokens.values()){
 const token=entry.token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(entry.kind==='element'?`<\\s*${token}\\b`:entry.kind==='method'?`\\.${token}\\s*\\(`:`(?<![\\w-])${token}\\s*:`);
 entry.lessons=learning.filter(l=>pattern.test(code(l))).map(l=>l.id);
 if(!entry.lessons.length)missing.push(entry);
}
await fs.writeFile('.audit/curriculum-syntax.json',JSON.stringify({lessonCount:learning.length,syntax:[...tokens.values()],missing},null,2));
assert.equal(missing.length,0,'Syntax without an active example/exercise: '+missing.map(x=>x.kind+' '+x.token).join(', '));
const byId=new Map(learning.map(l=>[l.id,l]));
const lines=['# Sintaxa materialelor și lecțiile active','',`${tokens.size} de construcții extrase din materialele didactice; ${learning.length} de lecții active.`,
 '', 'Această verificare caută elemente HTML/MathML, apeluri de metode și declarații CSS în exemplele, soluțiile și fișierele furnizate de lecțiile active. Materialele originale opționale nu pot satisface verificarea.',
 '', 'Este o verificare a prezenței sintaxei, nu o dovadă automată a calității explicațiilor sau a funcționării în fiecare browser. Inventarul complet al surselor este în [COVERAGE.md](COVERAGE.md), iar programa în [CURRICULUM.md](CURRICULUM.md).',
 '', 'Sunt excluse ieșirile generate ale bibliotecilor, copiile identice, numele de variabile folosite ca substituenți, greșelile intenționate din exemplele de validare și potrivirile care sunt adrese web sau text explicativ. Construcțiile istorice apar în lecții care explică și alternativa modernă.',
 '', '| Tip | Construcție | Lecții active |','| --- | --- | --- |'];
for(const entry of [...tokens.values()].sort((a,b)=>a.kind.localeCompare(b.kind)||a.token.localeCompare(b.token))){
 const links=entry.lessons.slice(0,5).map(id=>`[${byId.get(id).title.replaceAll('|','\\|')}](https://tw.infoid26.ro/#lectie/${id}/0)`);
 lines.push(`| ${entry.kind} | \`${entry.token}\` | ${links.join(', ')} |`);
}
await fs.writeFile('SYNTAX.md',lines.join('\n')+'\n');
console.log(`PASS: ${tokens.size} syntax constructs from teaching sources occur in active lesson examples/solutions. This checks syntax presence, not teaching quality or browser rendering.`);
