(() => {
  'use strict';
  const course = window.TW_COURSE;
  const lessons = course.chapters.flatMap(c => c.lessons.map(l => ({ ...l, chapter:c })));
  const byId = new Map(lessons.map(l => [l.id,l]));
  const storageKey = 'tw-infoid26-progress-v2';
  const main = document.querySelector('#content');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rich = value => esc(value).replace(/`([^`]+)`/g,'<code class="required-text">$1</code>');
  const codeBlock=(value,mode)=>`<pre class="code"><code>${window.TW_EDITOR?TW_EDITOR.highlight(value,mode):esc(value)}</code></pre>`;
  const format = value => value === undefined ? '—' : JSON.stringify(value,null,2);
  let state = { version:2, records:{}, resume:'' };
  let cancelRun = null;
  let routeGeneration = 0;
  let running = false;
  let editorPromise;
  let account;
  let viewReady=false;
  function loadEditor(){
    if(window.TW_EDITOR)return Promise.resolve();
    return editorPromise??=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='site/editor.js';
      script.onload=()=>window.TW_EDITOR?resolve():reject(new Error('Editor unavailable'));
      script.onerror=()=>{script.remove();editorPromise=undefined;reject(new Error('Editor unavailable'));};
      document.head.append(script);
    });
  }
  window.TW_LOAD_EDITOR=loadEditor;
  function normalize(value) {
    if (!value || value.version !== 2 || !value.records || typeof value.records !== 'object' || Array.isArray(value.records)) throw new Error('Fișierul nu este un export compatibil cu noul traseu Tehnici Web.');
    const records = {};
    for (const lesson of lessons) {
      const item = Object.hasOwn(value.records,lesson.id) ? value.records[lesson.id] : null;
      if (!item || typeof item !== 'object') continue;
      const code = typeof item.code === 'string' ? item.code.slice(0,100000) : lesson.task.starter;
      if ((item.revision || 1) !== (lesson.task.revision || 1)) continue;
      records[lesson.id] = { revision:lesson.task.revision || 1, code, quiz:item.quiz === lesson.quiz.correct ? item.quiz : null, verified:typeof item.verified === 'string' && item.verified === code ? code : null };
    }
    return { version:2, records, resume:lessons.some(l=>l.id===value.resume) ? value.resume : '' };
  }
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) state = normalize(JSON.parse(saved));
  } catch { storageWarning('Nu am putut încărca progresul local. Poți continua; folosește exportul pentru o copie de siguranță.'); }
  function storageWarning(message) {
    const el = document.querySelector('#storage-warning');
    el.textContent = message;
    el.hidden = false;
  }
  function save() {
    if(account){account.save();return;}
    try { localStorage.setItem(storageKey,JSON.stringify(state)); }
    catch { storageWarning('Browserul nu permite salvarea progresului sau spațiul este plin. Reconectează-te pentru a sincroniza progresul.'); }
  }
  function record(lesson) {
    return state.records[lesson.id] ||= { revision:lesson.task.revision || 1, code:lesson.task.starter, quiz:null, verified:null };
  }
  const quizDone = lesson => state.records[lesson.id]?.quiz === lesson.quiz.correct;
  const codeDone = lesson => {
    const r = state.records[lesson.id];
    return !!r && r.verified !== null && r.verified === r.code;
  };
  const done = lesson => quizDone(lesson) && codeDone(lesson);
  function updateProgress() {
    const completed = lessons.reduce((n,l) => n + Number(quizDone(l)) + Number(codeDone(l)),0);
    const percent = Math.floor(completed / (lessons.length * 2) * 100);
    document.querySelector('#percent').textContent = percent + '%';
    document.querySelector('#total-progress').value = percent;
    return percent;
  }
  function resumeLesson() { return lessons.find(l=>l.id===state.resume) || lessons.find(l => !done(l)) || lessons[0]; }
  function startStep(l) { return !quizDone(l) ? 0 : !codeDone(l) ? 3 : 4; }
  function home() {
    const resume = resumeLesson();
    main.innerHTML = `<section class="hero"><div><div class="eyebrow">TEHNICI WEB · INFO ID 26</div><h1>Din prima linie,<br>până la un site complet.</h1><p class="lead">Înveți conceptele prin exemple și exerciții în browser. Explicațiile sunt în română, iar codul este în engleză. Pentru exerciții nu ai nevoie de fișierele unui proiect extern.</p><a class="button" href="#lectie/${resume.id}/${startStep(resume)}">${state.resume ? 'Continuă lecția' : 'Începe cu prima lecție'} <span aria-hidden="true">→</span></a></div><div class="hero-visual" aria-hidden="true"><small>DIN COD ÎN PAGINĂ</small><div class="mini-window"><div class="window-dots">● ● ●</div><pre>&lt;h1&gt;Hello, web!&lt;/h1&gt;\n\nh1 {\n  color: #6952ce;\n}</pre></div><div class="mini-result"><span>REZULTAT</span><strong>Hello, web!</strong></div></div></section>
      <div class="chapter-heading"><h2>Traseul tău de învățare</h2><span>${course.chapters.length} capitole · ${lessons.length} lecții · ${lessons.length} exerciții</span></div>
      <div class="course-shortcuts"><a class="secondary" href="/project/" target="_blank" rel="noopener">Proiect Website ↗</a><a class="secondary" href="/examen">Simulare Examen →</a></div><div class="toolbar"><label for="search">Găsește o lecție<input id="search" type="search" placeholder="De exemplu: grid, JSON, funcții" autocomplete="off"></label></div>
      <div id="chapter-list" class="chapter-list" style="margin-top:20px"></div>
      <details class="tools"><summary>Progres și alte opțiuni</summary><p>Procentul numără întrebările corecte și exercițiile verificate. Modificarea unei soluții cere o nouă verificare. Lecțiile sunt accesibile pentru recapitulare, în ordinea recomandată din traseu.</p><p>Cursul explică tehnici generale prin exemple independente. Exercițiile din browser includ datele de lucru; pașii de terminal descriu fișierele pe care le creezi singur. Exercițiile și întrebările sunt create pentru platformă, nu sunt subiecte oficiale de examen.</p><p>HTML/CSS rulează în previzualizare; JavaScript în teste izolate cu limită de timp. SQL, SCSS și EJS rulează în browser. Node și Express folosesc evaluatorul platformei. Fișierele din exercițiile fs sunt virtuale; nu modifică fișierele tale personale. Exemplele de integrare arată cum combini tehnologiile. Aplicația de la /project/ rămâne o demonstrație separată. Traseul nu confirmă un barem de examen.</p><p>Verificările urmăresc cerința exercițiului, nu sunt un validator HTML complet și nu demonstrează corectitudinea pentru orice intrare. Pentru o pagină proprie folosește și <a href="https://validator.w3.org/nu/" target="_blank" rel="noopener noreferrer">validatorul HTML</a> și <a href="https://jigsaw.w3.org/css-validator/" target="_blank" rel="noopener noreferrer">validatorul CSS</a>.</p></details>`;
    renderChapters('');
    document.querySelector('#search').addEventListener('input',e => renderChapters(e.target.value));
  }
  function renderChapters(query) {
    const fold = value => value.toLocaleLowerCase('ro').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const q = fold(query.trim());
    const firstPending = lessons.find(l => !done(l));
    document.querySelector('#chapter-list').innerHTML = course.chapters.map((c,index) => {
      const visible = c.lessons.filter(l => fold(`${c.title} ${l.title} ${l.intro}`).includes(q));
      if (!visible.length) return '';
      const next = c.lessons.find(l => !done(l)) || c.lessons[0];
      const count = c.lessons.filter(done).length;
      const currentChapter = c.lessons.some(l => l.id === firstPending?.id);
      return `<article class="chapter path-chapter ${currentChapter ? 'current-chapter' : ''}"><header class="chapter-banner"><div class="chapter-number">${String(index+1).padStart(2,'0')}</div><div><div class="eyebrow">CAPITOLUL ${index+1}</div><h3>${esc(c.title)}</h3><p>${esc(c.subtitle)}</p>${c.id.startsWith('source-')||c.id.startsWith('slides-')?'<p class="chapter-kind">Lectură și recunoașterea sintaxei · cu lecții practice asociate</p>':''}<small>${count} / ${c.lessons.length} lecții finalizate</small><progress aria-label="Progres ${esc(c.title)}" max="${c.lessons.length}" value="${count}"></progress></div><a class="button" href="#lectie/${next.id}/${startStep(next)}">${count === c.lessons.length ? 'Recapitulează' : 'Continuă'} →</a></header><details ${q || currentChapter ? 'open' : ''}><summary>Traseul capitolului <span>${c.lessons.length} lecții</span></summary><div class="unit-path">${visible.map((l,i) => `${i%5===0 ? `<div class="unit-divider"><span>UNITATEA ${Math.floor(c.lessons.indexOf(l)/5)+1}</span><strong>${esc(l.title)}</strong></div>` : ''}<a class="path-node ${done(l)?'path-done':l.id===next.id?'path-current':'path-future'}" href="#lectie/${l.id}/${startStep(l)}" ${l.id===next.id?'aria-current="step"':''}><span class="node-bubble" aria-hidden="true">${done(l)?'✓':c.lessons.indexOf(l)+1}</span><span class="node-label">${esc(l.title)}<small>${esc(l.duration||'3–6 min')} · explicație + exercițiu</small></span>${l.id===next.id&&!done(l)?'<span class="start-tag">CONTINUĂ AICI</span>':''}</a>`).join('')}</div></details></article>`;
    }).join('') || '<p class="no-result">Nu am găsit lecții. Încearcă un alt cuvânt.</p>';
  }
  const stepNames = ['Înțelege','Urmărește exemplul','Răspunde','Scrie și verifică','Lecție finalizată'];
  function lessonPage(l,step) {
    const r = record(l);
    state.resume = l.id;
    save();
    const nextLesson = lessons[lessons.findIndex(x => x.id === l.id)+1];
    const canContinue = step === 2 ? quizDone(l) : step === 3 ? codeDone(l) : true;
    let body;
    if (step === 0) body = `${learningIntroHTML(l)}<p>${rich(l.intro)}</p><ul class="concept-points">${l.points.map(p => `<li>${rich(p)}</li>`).join('')}</ul>`;
    if (step === 1) body = `<h2>${l.example?'Ce face acest cod?':'Urmărește exemplul'}</h2>${l.task.mode==='sql'?sqlTablesHTML(l.task):''}${l.exampleTables?l.exampleTables.map(t=>dataTableHTML(t.rows,'Tabelul '+t.name,t.columns)).join(''):''}${l.example?codeBlock(l.example,l.task.mode):''}${l.exampleResult?dataTableHTML(l.exampleResult,'Rezultatul exemplului'):''}<p>${rich(l.explain)}</p>${notationHTML(l)}${l.walkthrough?.length?`<ol class="code-walkthrough">${l.walkthrough.map(item=>`<li>${rich(item)}</li>`).join('')}</ol>`:''}`;
    if (step === 2) body = `<h2>${rich(l.quiz.question)}</h2><div class="quiz-options">${l.quiz.options.map((o,i) => `<button class="quiz-option ${quizDone(l) && i === l.quiz.correct ? 'right' : ''}" data-answer="${i}" ${quizDone(l) ? 'disabled' : ''}><span class="letter">${String.fromCharCode(65+i)}</span><span>${rich(o)}</span></button>`).join('')}</div><p id="quiz-feedback" class="feedback ${quizDone(l) ? 'good' : ''}" role="status">${quizDone(l) ? `Corect. ${esc(l.quiz.explanation)}` : ''}</p>`;
    if (step === 3) body = taskHTML(l,r);
    if (step === 4) body = `<div class="success-badge" aria-hidden="true">✓</div><div class="eyebrow">AI SCRIS. AI VERIFICAT.</div><h2>${esc(l.title)}</h2><p>Întrebarea și exercițiul sunt finalizate. Poți reveni oricând pentru recapitulare.</p><div class="finish-total">${updateProgress()}%</div><p class="source">din întrebările și exercițiile întregului traseu</p>`;
    if (step === 0 && l.syntaxNotes?.length) body += `<h3>Construcțiile din acest fragment</h3><div class="syntax-notes">${l.syntaxNotes.map(note=>`<details class="help-details"><summary><code>${esc(note.token)}</code></summary><p>${rich(note.explanation)}</p><a class="text-link" href="#lectie/${note.lesson}/0">Explicație și exercițiu →</a></details>`).join('')}</div>`;
    if (l.relatedLessons?.length && step < 2) body += `<h3>Explicații și exerciții practice</h3><div class="source-lesson-links">${l.relatedLessons.map(id=>byId.has(id)?`<a class="secondary" href="#lectie/${id}/0">${esc(byId.get(id).title)}</a>`:'').join('')}</div>`;
    window.TW_EDITOR?.clear();
    main.innerHTML = `<a class="text-link" href="#acasa">← Înapoi la traseu</a><section class="player"><header class="player-head"><div><div class="eyebrow">${esc(l.chapter.title.split(' · ')[0])} · ${esc(stepNames[step])}</div><h1>${esc(l.title)}</h1></div><span class="step-count">${step+1} / 5</span></header><div class="step-nav" aria-label="Pașii lecției">${stepNames.map((name,i) => i <= step ? `<a href="#lectie/${l.id}/${i}" class="${i===step?'active':'complete'}" aria-label="${esc(name)}" ${i===step?'aria-current="step"':''}></a>` : '<span></span>').join('')}</div><article class="screen ${step===3?'wide':''}">${body}</article><div class="player-controls"><a class="secondary" href="${step>0 ? `#lectie/${l.id}/${step-1}` : '#acasa'}">← ${step>0?'Înapoi':'Traseu'}</a>${step===4 ? `<a class="button" href="${nextLesson ? `#lectie/${nextLesson.id}/${startStep(nextLesson)}` : '#acasa'}">${nextLesson?'Lecția următoare':'Înapoi la traseu'} →</a>` : `<button id="continue" class="primary" ${canContinue?'':'disabled'}>${step===3?'Finalizează lecția':'Continuă'} →</button>`}</div></section>`;
    document.querySelector('#continue')?.addEventListener('click',() => { location.hash = `lectie/${l.id}/${step+1}`; });
    if (step === 2) document.querySelectorAll('[data-answer]').forEach(b => b.addEventListener('click',() => answer(l,Number(b.dataset.answer),b)));
    if (step === 3) bindTask(l);
    document.title = `${l.title} · Tehnici Web`;
  }
  function answer(l,index,button) {
    const feedback = document.querySelector('#quiz-feedback');
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('wrong'));
    if (index !== l.quiz.correct) {
      button.classList.add('wrong');
      feedback.className = 'feedback bad';
      feedback.textContent = `Mai încearcă. ${l.quiz.explanation}`;
      return;
    }
    record(l).quiz = index;
    save();
    updateProgress();
    button.classList.add('right');
    document.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });
    feedback.className = 'feedback good';
    feedback.textContent = `Corect. ${l.quiz.explanation}`;
    document.querySelector('#continue').disabled = false;
  }
  function dataTableHTML(rows,caption,columns) {
    if(!Array.isArray(rows))return '';
    columns ||= [...new Set(rows.flatMap(row=>Object.keys(row||{})))];
    if(!columns.length)return `<p class="table-empty">${esc(caption)}: niciun rând.</p>`;
    const cell=value=>value===null?'<span class="table-null">NULL</span>':esc(Array.isArray(value)?JSON.stringify(value):value);
    return `<div class="data-table-wrap" role="region" aria-label="${esc(caption)}" tabindex="0"><table class="data-table"><caption>${esc(caption)}</caption><thead><tr>${columns.map(name=>`<th scope="col">${esc(name)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${columns.map(name=>`<td>${cell(row[name])}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">Niciun rând.</td></tr>`}</tbody></table></div>`;
  }
  function sqlTablesHTML(t) {
    return (t.tables||[]).map(table=>dataTableHTML(table.rows,'Tabelul '+table.name,t.visibleColumns||table.columns)+(table.totalRows>table.rows.length?`<p class="table-note">Sunt afișate ${table.rows.length} din ${table.totalRows} de rânduri.</p>`:'')).join('');
  }
  function notationHTML(l) {
    return l.notation?.length?`<details class="notation-help"><summary>Explică simbolurile și operațiile din exemplu</summary><ul>${l.notation.map(item=>`<li>${rich(item)}</li>`).join('')}</ul></details>`:'';
  }
  function learningIntroHTML(l) {
    const learning=l.chapter?.learning;
    if(!learning)return '';
    if(l.chapter.lessons[0].id!==l.id){const previous=byId.get(l.prerequisites?.[0]);return previous?`<p class="lesson-prerequisite">Pasul anterior: <a href="#lectie/${previous.id}/0">${esc(previous.title)}</a></p>`:'';}
    const links=learning.prerequisites.filter(id=>byId.has(id)).map(id=>`<a href="#lectie/${id}/0">${esc(byId.get(id).title)}</a>`);
    return `<aside class="learning-start"><p>${rich(learning.goal)}</p>${links.length?`<p>Înainte de acest capitol: ${links.join(' · ')}</p>`:'<p>Poți începe aici de la zero.</p>'}</aside>`;
  }
  function taskContextHTML(t) {
    let out='';
    if(t.tables?.length)out+=`<div class="exercise-data"><h3>Baza de date de la care pornești</h3>${sqlTablesHTML(t)}</div>`;
    if(t.mode==='sql'){
      if(!t.tables?.length)out+='<p class="exercise-data">Baza de antrenament este goală. Creezi doar structura cerută în exercițiu.</p>';
      if(t.contextCode)out+=`<details class="exercise-data sql-setup"><summary>SQL-ul de pregătire (opțional)</summary><p>Acest cod este executat automat. Nu trebuie să îl scrii sau să îl înțelegi înaintea exercițiului curent.</p>${codeBlock(t.contextCode,'sql')}</details>`;
    }
    if(t.contextCode&&t.mode!=='sql') out += `<div class="exercise-data"><h3>${esc(t.contextLabel || 'Datele exercițiului')}</h3>${codeBlock(t.contextCode,t.mode==='sql'?'sql':'text')}</div>`;
    if(t.fixture) out += `<details class="exercise-data" open><summary>HTML furnizat</summary>${codeBlock(t.fixture,'html')}</details>`;
    if(t.inputData) out += `<div class="exercise-data"><h3>Datele primite de template</h3>${codeBlock(format(t.inputData),'json')}</div>`;
    if(t.expectedResult !== undefined) out += `<div class="exercise-data"><h3>Rezultatul cerut</h3>${t.mode==='sql'?dataTableHTML(t.expectedResult,'Rezultatul cerut'):codeBlock(format(t.expectedResult),'json')}</div>`;
    if(t.files && Object.keys(t.files).length) out += `<details class="exercise-data" open><summary>Fișierele virtuale furnizate</summary>${Object.entries(t.files).map(([name,content])=>`<p><code class="required-text">${esc(name)}</code></p>${codeBlock(content,'text')}`).join('')}</details>`;
    if(t.partials && Object.keys(t.partials).length) out += `<details class="exercise-data" open><summary>Fragmentele EJS disponibile</summary>${Object.entries(t.partials).map(([name,content])=>`<p><code class="required-text">${esc(name)}</code></p>${codeBlock(content,'ejs')}`).join('')}</details>`;
    if(t.actions?.length) out += `<p class="exercise-data">După executarea codului, verificarea simulează: ${t.actions.map(a=>`${esc({click:'clic pe',fill:'introducerea valorii în',check:'schimbarea bifei pentru',key:'apăsarea tastei'}[a.type] || a.type)} <code class="required-text">${esc(a.selector || a.key || 'document')}</code>${a.value!==undefined?` cu valoarea <code class="required-text">${esc(a.value)}</code>`:''}`).join('; ')}.</p>`;
    if(t.cases?.length) out += `<div class="exercise-data"><h3>Exemplu de intrare și rezultat</h3><div class="example-data-grid"><div><small>Intrare</small>${codeBlock(format(t.cases[0].input),'json')}</div><div><small>Rezultat așteptat</small>${codeBlock(format(t.cases[0].expected),'json')}</div></div></div>`;
    if(t.requests?.length) out += `<div class="exercise-data"><h3>Cereri și răspunsuri așteptate</h3><ul>${t.requests.map(req=>`<li><code class="required-text">${esc(req.method || 'GET')} ${esc(req.path)}</code> → status <code>${req.status || 200}</code>${req.json!==undefined?` și JSON ${rich('`'+JSON.stringify(req.json)+'`')}`:req.bodyExpected!==undefined?` și textul ${rich('`'+req.bodyExpected+'`')}`:''}${req.body?` (corp trimis: ${rich('`'+req.body+'`')})`:''}</li>`).join('')}</ul></div>`;
    return out;
  }
  function reasoningHTML(l,solution=false) {
    if(!l.reasoning)return '';
    const r=l.reasoning;
    if(solution)return '<div class="reasoning-solution"><h3>De ce funcționează alegerea</h3><p>'+rich(r.explanation)+'</p><h3>Un caz care ar descoperi o alegere greșită</h3><p>'+rich(r.counterexample)+'</p></div>';
    return '<section class="reasoning-prompt"><div class="eyebrow">PROVOCARE · APLICĂ ȘI JUSTIFICĂ</div><h3>Gândește înainte să scrii</h3><ol>'+r.questions.map(question=>'<li>'+rich(question)+'</li>').join('')+'</ol><p>Explică alegerea cu voce tare sau pe o foaie. Verificarea automată urmărește codul; nu îți notează explicația.</p></section>';
  }
  function taskHTML(l,r) {
    const t=l.task;
    const visual=['html','css','dom','scss','ejs'].includes(t.mode);
    const file={html:'index.html',css:'style.css',dom:'app.js',js:'exercise.js',json:'data.json',text:'Răspuns',scss:'style.scss',ejs:'page.ejs',sql:'query.sql',node:'app.js',express:'app.js'}[t.mode];
    return `${reasoningHTML(l)}<h2>Cerință</h2><p>${rich(t.prompt)}</p>${t.note?`<p class="notice">${rich(t.note)}</p>`:''}${t.requirements?.length?`<ul class="exercise-requirements">${t.requirements.map(item=>`<li>${rich(item)}</li>`).join('')}</ul>`:''}${taskContextHTML(t)}
      <div class="exercise-help"><div class="help-buttons"><button type="button" data-help="exercise-hint" aria-controls="exercise-hint" aria-expanded="false">Indiciu</button><button type="button" data-help="exercise-solution" aria-controls="exercise-solution" aria-expanded="false">Rezolvare</button></div><div id="exercise-hint" class="help-content" hidden><p>${rich(l.hint)}</p></div><div id="exercise-solution" class="help-content" hidden>${codeBlock(t.solution,t.mode)}<p>${rich(l.explain)}</p>${reasoningHTML(l,true)}<p>Închide soluția, rescrie-o singur și explică fiecare pas.</p></div></div>
      <div class="workspace-grid"><div class="editor-card"><div class="editor-header"><label for="code">${file}</label><span>${t.mode==='text'?'Răspunsul tău':'Codul tău'}</span></div><div class="editor-wrap"><pre id="line-numbers" class="line-numbers" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="${esc(file)} - editor">${esc(r.code)}</textarea></div><div class="editor-actions"><button id="check" class="primary">Verifică</button>${visual?'<button id="preview-button" class="secondary">Previzualizează</button>':''}<button id="stop" class="secondary" hidden>Oprește</button></div></div>
      <div class="preview-card"><div class="preview-header"><span>${visual?'Rezultatul în browser':'Rezultatele verificării'}</span>${visual?'<label>Lățime <select id="preview-width" aria-label="Lățimea previzualizării"><option value="100%">Auto</option><option value="480px">480px</option><option value="900px">900px</option></select></label>':''}</div>${visual?'<div class="preview-viewport"><iframe id="preview" sandbox="allow-scripts" title="Previzualizarea codului tău"></iframe></div>':''}<div id="test-output" class="test-output" aria-live="polite">${t.mode==='js'||t.mode==='node'?'Funcția solve(input) primește automat datele testelor și trebuie să returneze rezultatul.':visual?'Apasă Verifică pentru a testa cerințele.':'Scrie răspunsul și apasă Verifică.'}</div></div></div>
      <p id="task-status" class="feedback ${codeDone(l)?'good':''}" role="status">${codeDone(l)?'Exercițiu verificat. Poți continua.':''}</p><button id="reset-code" class="secondary">Reia codul de început</button>`;
  }
  function bindTask(l) {
    document.querySelector('.exercise-help').addEventListener('click',event=>{const button=event.target.closest('[data-help]');if(!button)return;const panel=document.getElementById(button.dataset.help);panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});
    const field = document.querySelector('#code');
    const lines = document.querySelector('#line-numbers');
    const updateLines = () => { lines.textContent = Array.from({length:field.value.split('\n').length},(_,i) => i+1).join('\n'); lines.scrollTop = field.scrollTop; };
    const preview = async () => {
      const frame=document.querySelector('#preview');
      if(!frame || !['html','css','dom','scss','ejs'].includes(l.task.mode))return;
      try { await window.TW_RUNNER.preview(l.task,field.value,frame); }
      catch(e) { const status=document.querySelector('#task-status'); if(status)status.textContent=e.message; }
    };
    updateLines();
    if(l.task.mode !== 'text') { window.TW_EDITOR?.mount(field,l.task.mode,()=>{if(!running)verify(l);}); lines.hidden=true; }
    preview();
    field.addEventListener('scroll',() => { lines.scrollTop = field.scrollTop; });
    field.addEventListener('input',() => {
      const r = record(l);
      r.code = field.value;
      r.verified = null;
      cancelRun?.();
      save();
      updateLines();
      updateProgress();
      document.querySelector('#continue').disabled = true;
      const status = document.querySelector('#task-status');
      status.className = 'feedback';
      status.textContent = 'Cod modificat. Apasă Verifică pentru noua versiune.';
      document.querySelector('#test-output').textContent = 'Rezultatele anterioare nu se aplică versiunii modificate.';
    });
    field.addEventListener('keydown',e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (!running) verify(l); }
      if (e.key === 'Tab') {
        e.preventDefault();
        field.setRangeText('  ',field.selectionStart,field.selectionEnd,'end');
        field.dispatchEvent(new Event('input',{bubbles:true}));
      }
    });
    document.querySelector('#check').addEventListener('click',() => verify(l));
    document.querySelector('#stop').addEventListener('click',() => cancelRun?.());
    document.querySelector('#preview-button')?.addEventListener('click',preview);
    document.querySelector('#preview-width')?.addEventListener('change',e => { document.querySelector('#preview').style.width = e.target.value; });
    document.querySelector('#reset-code').addEventListener('click',() => {
      if (!confirm('Înlocuiești codul acestei lecții cu varianta de început?')) return;
      field.value = l.task.starter;
      field.dispatchEvent(new Event('input',{bubbles:true}));
      preview();
      field.focus();
    });
  }
  async function verify(l) {
    if (running) return;
    const generation = routeGeneration;
    const code = document.querySelector('#code').value;
    const button = document.querySelector('#check');
    const stop = document.querySelector('#stop');
    const status = document.querySelector('#task-status');
    const output = document.querySelector('#test-output');
    const r = record(l);
    r.code = code;
    r.verified = null;
    save();
    updateProgress();
    document.querySelector('#continue').disabled = true;
    running = true;
    button.disabled = true;
    stop.hidden = false;
    status.className = 'feedback';
    status.textContent = 'Se verifică…';
    if (document.querySelector('#preview') && ['html','css','dom'].includes(l.task.mode)) { try {window.TW_RUNNER.preview(l.task,code,document.querySelector('#preview'));} catch {} }
    let results;
    try { results = await window.TW_RUNNER.check(l.task,code,cancel => { cancelRun = cancel; }); }
    catch (e) { results = [{label:'Verificare',passed:false,error:e.message}]; }
    finally { if (generation === routeGeneration) { running = false; cancelRun = null; button.disabled = false; stop.hidden = true; } }
    if (generation !== routeGeneration || record(l).code !== code) return;
    const passed = results.length > 0 && results.every(t => t.passed === true);
    output.innerHTML = `<ul>${results.map(t => `<li class="${t.passed?'pass':'fail'}"><strong>${t.passed?'✓':'✕'} ${esc(t.label)}</strong>${t.error?`<p>${esc(t.error)}</p>`:''}${Object.hasOwn(t,'input')?`<pre>Intrare: ${esc(format(t.input))}</pre>`:''}${Object.hasOwn(t,'expected')?(l.task.mode==='sql'?dataTableHTML(t.expected,'Rezultat așteptat')+dataTableHTML(t.actual,'Rezultat obținut'):`<pre>Așteptat: ${esc(format(t.expected))}\nObținut: ${esc(format(t.actual))}</pre>`):''}</li>`).join('')}</ul>`;
    status.className = `feedback ${passed?'good':'bad'}`;
    status.textContent = passed ? 'Toate verificările au trecut. Poți continua.' : 'Mai ai ceva de ajustat. Verifică cerințele marcate și folosește indiciul dacă ai nevoie.';
    r.verified = passed ? code : null;
    save();
    updateProgress();
    document.querySelector('#continue').disabled = !passed;
  }
  function download(filename,content,type) {
    const url = URL.createObjectURL(new Blob([content],{type}));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  async function route() {

    cancelRun?.();
    window.TW_EDITOR?.clear();
    cancelRun = null;
    running = false;
    routeGeneration++;
    const generation=routeGeneration;
    const [page,id,requested] = location.hash.slice(1).split('/');
    if (page === 'lectie' && byId.has(id)) {
      if(!window.TW_EDITOR){
        main.textContent='Se încarcă lecția…';
        try{await loadEditor();}
        catch{if(generation===routeGeneration)main.textContent='Editorul nu s-a putut încărca. Reîncarcă pagina pentru a încerca din nou.';return;}
        if(generation!==routeGeneration)return;
      }
      const l = byId.get(id);
      let step = /^\d$/.test(requested || '') ? Math.min(4,Number(requested)) : startStep(l);
      if (step >= 3 && !quizDone(l)) step = 2;
      if (step === 4 && !codeDone(l)) step = 3;
      lessonPage(l,step);
    } else {
      home();
      document.title = 'Tehnici Web · INFO ID 26';
    }
    updateProgress();
    window.scrollTo(0,0);
    main.focus({preventScroll:true});
  }
  window.addEventListener('hashchange',()=>{if(viewReady)void route();});
  account=window.TW_ACCOUNTS.create({getState:()=>state,setState:value=>{state=normalize(value);},normalize,storageKey,
    refresh:()=>{if(viewReady)void route();},download});
  // Show the course immediately; editing starts after the account has been identified.
  home();
  updateProgress();
  account.start().finally(()=>{viewReady=true;void route();});
})();
