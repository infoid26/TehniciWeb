from pathlib import Path
p=Path('site/app.js');s=p.read_text(encoding='utf8')
s=s.replace("  const byId = new Map(lessons.map(l => [l.id,l]));", "  const referenceLessons = (course.references || []).flatMap(c => c.lessons.map(l => ({...l,chapter:c})));\n  const byId = new Map([...lessons,...referenceLessons].map(l => [l.id,l]));")
s=s.replace("records[lesson.id] = { code, quiz:item.quiz", "if ((item.revision || 1) !== (lesson.task.revision || 1)) continue;\n      records[lesson.id] = { revision:lesson.task.revision || 1, code, quiz:item.quiz")
s=s.replace("{ code:lesson.task.starter, quiz:null, verified:null }", "{ revision:lesson.task.revision || 1, code:lesson.task.starter, quiz:null, verified:null }")
start=s.index('  function taskHTML(l,r) {')
end=s.index('  function bindTask(l) {',start)
s=s[:start]+'''  function taskContextHTML(t) {
    let out='';
    if(t.contextCode) out += `<div class="exercise-data"><h3>${esc(t.contextLabel || 'Datele exercițiului')}</h3>${codeBlock(t.contextCode,t.mode==='sql'?'sql':'text')}</div>`;
    if(t.fixture) out += `<details class="exercise-data" open><summary>HTML furnizat</summary>${codeBlock(t.fixture,'html')}</details>`;
    if(t.inputData) out += `<div class="exercise-data"><h3>Datele primite de template</h3>${codeBlock(format(t.inputData),'json')}</div>`;
    if(t.expectedResult !== undefined) out += `<div class="exercise-data"><h3>Rezultatul cerut</h3>${codeBlock(format(t.expectedResult),'json')}</div>`;
    if(t.files && Object.keys(t.files).length) out += `<details class="exercise-data" open><summary>Fișierele virtuale furnizate</summary>${Object.entries(t.files).map(([name,content])=>`<p><code class="required-text">${esc(name)}</code></p>${codeBlock(content,'text')}`).join('')}</details>`;
    if(t.partials && Object.keys(t.partials).length) out += `<details class="exercise-data" open><summary>Fragmentele EJS disponibile</summary>${Object.entries(t.partials).map(([name,content])=>`<p><code class="required-text">${esc(name)}</code></p>${codeBlock(content,'ejs')}`).join('')}</details>`;
    if(t.actions?.length) out += `<p class="exercise-data">După executarea codului, verificarea simulează: ${t.actions.map(a=>`${esc({click:'clic pe',fill:'introducerea valorii în',check:'schimbarea bifei pentru',key:'apăsarea tastei'}[a.type] || a.type)} <code class="required-text">${esc(a.selector || a.key || 'document')}</code>${a.value!==undefined?` cu valoarea <code class="required-text">${esc(a.value)}</code>`:''}`).join('; ')}.</p>`;
    if(t.cases?.length) out += `<div class="exercise-data"><h3>Exemplu de intrare și rezultat</h3><div class="example-data-grid"><div><small>Intrare</small>${codeBlock(format(t.cases[0].input),'json')}</div><div><small>Rezultat așteptat</small>${codeBlock(format(t.cases[0].expected),'json')}</div></div></div>`;
    if(t.requests?.length) out += `<div class="exercise-data"><h3>Cereri și răspunsuri așteptate</h3><ul>${t.requests.map(req=>`<li><code class="required-text">${esc(req.method || 'GET')} ${esc(req.path)}</code> → status <code>${req.status || 200}</code>${req.json!==undefined?` și JSON ${rich('`'+JSON.stringify(req.json)+'`')}`:req.bodyExpected!==undefined?` și textul ${rich('`'+req.bodyExpected+'`')}`:''}${req.body?` (corp trimis: ${rich('`'+req.body+'`')})`:''}</li>`).join('')}</ul></div>`;
    return out;
  }
  function taskHTML(l,r) {
    const t=l.task;
    const visual=['html','css','dom','scss','ejs'].includes(t.mode);
    const file={html:'index.html',css:'style.css',dom:'app.js',js:'exercise.js',json:'data.json',text:'Răspuns',scss:'style.scss',ejs:'page.ejs',sql:'query.sql',node:'app.js',express:'app.js'}[t.mode];
    return `<div class="eyebrow">CERINȚĂ</div><h2>Scrie. Vezi. Verifică.</h2><p>${rich(t.prompt)}</p>${t.note?`<p class="notice">${rich(t.note)}</p>`:''}${t.requirements?.length?`<ul class="exercise-requirements">${t.requirements.map(item=>`<li>${rich(item)}</li>`).join('')}</ul>`:''}${taskContextHTML(t)}
      <div class="exercise-help"><div class="help-buttons"><button type="button" data-help="exercise-hint" aria-controls="exercise-hint" aria-expanded="false">Indiciu</button><button type="button" data-help="exercise-solution" aria-controls="exercise-solution" aria-expanded="false">Rezolvare</button></div><div id="exercise-hint" class="help-content" hidden><p>${rich(l.hint)}</p></div><div id="exercise-solution" class="help-content" hidden>${codeBlock(t.solution,t.mode)}<p>${rich(l.explain)}</p><p>Închide soluția, rescrie-o singur și explică fiecare pas.</p></div></div>
      <div class="workspace-grid"><div class="editor-card"><div class="editor-header"><label for="code">${file}</label><span>${t.mode==='text'?'Răspunsul tău':'Codul tău'}</span></div><div class="editor-wrap"><pre id="line-numbers" class="line-numbers" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="${esc(file)} - editor">${esc(r.code)}</textarea></div><div class="editor-actions"><button id="check" class="primary">Verifică</button>${visual?'<button id="preview-button" class="secondary">Previzualizează</button>':''}<button id="stop" class="secondary" hidden>Oprește</button><button id="download-code" class="secondary">Descarcă</button></div><p class="editor-help">Ctrl + Enter: verifică · Tab: două spații · salvare automată</p></div>
      <div class="preview-card"><div class="preview-header"><span>${visual?'Rezultatul în browser':'Rezultatele verificării'}</span>${visual?'<label>Lățime <select id="preview-width" aria-label="Lățimea previzualizării"><option value="100%">Auto</option><option value="480px">480px</option><option value="900px">900px</option></select></label>':''}</div>${visual?'<div class="preview-viewport"><iframe id="preview" sandbox="allow-scripts" title="Previzualizarea codului tău"></iframe></div>':''}<div id="test-output" class="test-output" aria-live="polite">${t.mode==='js'||t.mode==='node'?'Funcția solve(input) primește automat datele testelor și trebuie să returneze rezultatul.':visual?'Apasă Verifică pentru a testa cerințele.':'Scrie răspunsul și apasă Verifică.'}</div></div></div>
      <p id="task-status" class="feedback ${codeDone(l)?'good':''}" role="status">${codeDone(l)?'Exercițiu verificat. Poți continua.':''}</p><button id="reset-code" class="secondary">Reia codul de început</button>`;
  }
'''+s[end:]
s=s.replace("    const field = document.querySelector('#code');", "    document.querySelector('.exercise-help').addEventListener('click',event=>{const button=event.target.closest('[data-help]');if(!button)return;const panel=document.getElementById(button.dataset.help);panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});\n    const field = document.querySelector('#code');",1)
# Original material is an optional reference screen, never a file-memory lesson.
needle='  function sourceLibrary() {'
pos=s.index(needle)
s=s[:pos]+'''  function referencePage(l) {
    main.innerHTML=`<a class="text-link" href="#surse">← Materiale de referință</a><section class="reference-page"><p class="eyebrow">REFERINȚĂ OPȚIONALĂ</p><h1>${esc(l.title)}</h1><p>Poți consulta materialul original pentru comparație. Cursul și exercițiile se parcurg fără aceste fișiere.</p><pre class="source-original">${esc(l.referenceText || l.example)}</pre>${sourceImages(l.referenceImages)}${l.syntaxNotes?.length?`<h2>Explicații pentru construcțiile întâlnite</h2>${l.syntaxNotes.map(n=>`<details class="help-details"><summary><code>${esc(n.token)}</code></summary><p>${rich(n.explanation)}</p><a href="#lectie/${n.lesson}/0">Deschide lecția</a></details>`).join('')}`:''}<p class="source">${esc(l.source)}</p></section>`;
    document.title=l.title+' · Referință';window.scrollTo(0,0);
  }
'''+s[pos:]
s=s.replace("      const l = byId.get(id);\n      let step", "      const l = byId.get(id);\n      if(l.reading){referencePage(l);return;}\n      let step")
s=s.replace('site-ul de cofetărie din materialele profesoarei','propriul site de prezentare și produse')
s=s.replace('Materiale și inventarul sintaxei','Materiale de referință (opțional)')
s=s.replace('Conținut original de studiu, organizat după cele șase prezentări locale și exemplul de cofetărie al profesoarei.', 'Cursul explică tehnicile necesare pentru propriul site și include toate datele de lucru. Nu ai nevoie de proiectul profesoarei; materialele originale sunt doar referințe opționale.')
p.write_text(s,encoding='utf8')
