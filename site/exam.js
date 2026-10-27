(() => {
  'use strict';
  const engine=window.TW_EXAM_SESSION,exercises=window.TW_EXAM.exercises;
  const byId=new Map(exercises.map(item=>[item.id,item]));
  let storageKey='tw-infoid26-exam-simulation-v3';
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const pre=value=>'<pre><code>'+esc(value)+'</code></pre>';
  const clock=seconds=>Math.floor(seconds/60).toString().padStart(2,'0')+':'+(seconds%60).toString().padStart(2,'0');
  let state=null,generation=0,cancelRun=null,grading=false,viewId='';
  const $=selector=>document.querySelector(selector);
  function warnStorage(){
    $('#exam-storage-warning').hidden=false;
    $('#exam-storage-warning').textContent='Browserul nu permite salvarea simulării. Păstrează pagina deschisă pentru a continua.';
  }
  function save(){if(state)try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{warnStorage();}}
  function table(rows,title,columns){
    if(!Array.isArray(rows)||!rows.length)return '<p>'+esc(title)+': fără rânduri.</p>';
    const keys=columns||Object.keys(rows[0]);
    return '<div class="exam-table-wrap"><table class="exam-table"><caption>'+esc(title)+'</caption><thead><tr>'+keys.map(key=>'<th scope="col">'+esc(key)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+keys.map(key=>'<td>'+esc(row[key]===null?'NULL':typeof row[key]==='object'?JSON.stringify(row[key]):row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  function instructions(task){
    const requirements=task.requirements||[];
    const format=value=>esc(value).replace(/`([^`]+)`/g,'<code>$1</code>');
    return (requirements.length?'<ul class="exercise-requirements">'+requirements.map(value=>'<li>'+format(value)+'</li>').join('')+'</ul>':'')+
      (task.note?'<p class="exam-context-note">'+format(task.note)+'</p>':'');
  }
  function context(task,skipFixture=false){
    let out='';
    if(task.fixture&&!skipFixture)out+='<details class="exam-context" open><summary>Pagina furnizată</summary><iframe class="ticket-preview" title="Fragmentul de proiect al biletului" sandbox srcdoc="'+esc(task.fixture)+'"></iframe></details>';
    if(task.fixture&&!skipFixture)out+='<details class="exam-context"><summary>Fișierul HTML furnizat · doar citire</summary>'+pre(task.fixture)+'</details>';
    for(const item of task.tables||[])out+=table(item.rows,'Tabel inițial: '+item.name,item.columns);
    if(task.mode==='sql')out+=table(task.expectedResult||task.expected,'Rezultatul cerut');
    if(task.setup)out+='<details class="exam-context"><summary>SQL de pregătire · executat automat</summary>'+pre(task.setup)+'</details>';
    if(task.data)out+='<details class="exam-context" open><summary>Datele primite de template</summary>'+pre(JSON.stringify(task.data,null,2))+'</details>';
    if(task.contextCode)out+='<details class="exam-context" open><summary>'+esc(task.contextLabel||'Context furnizat')+'</summary>'+pre(task.contextCode)+'</details>';
    for(const [name,value] of Object.entries({...task.files,...task.partials}))out+='<details class="exam-context"><summary>Fișier furnizat: '+esc(name)+'</summary>'+pre(value)+'</details>';
    if(task.storage)out+='<details class="exam-context"><summary>Stocare virtuală inițială</summary>'+pre(JSON.stringify(task.storage,null,2))+'</details>';
    if(task.database)out+='<details class="exam-context"><summary>Baza de date virtuală · pregătită automat</summary>'+pre(task.database)+'</details>';
    if(task.now)out+='<p>Timpul virtual inițial este <code>'+esc(task.now)+'</code>. Soluția trebuie să funcționeze și la alte momente.</p>';
    if(task.cases)out+=table(task.cases.map(test=>({input:test.input,result:test.expected})),'Intrări și rezultate');
    if(task.requests)out+='<details class="exam-context"><summary>Cereri folosite pentru testare</summary>'+pre(task.requests.map(request=>(request.method||'GET')+' '+request.path).join('\n'))+'</details>';
    return out;
  }
  function stage(){return state.stages[state.index];}
  function controls(){
    const phase=state.phase;
    document.body.classList.add('simulation-active');
    $('#simulation-intro').hidden=true;
    $('#start-simulation').hidden=true;
    $('#last-attempt').hidden=true;
    $('#simulation-panel').hidden=phase==='finished';
    $('#stage-title').textContent='Proba '+(state.index+1)+' · '+stage().name;
    $('#simulation-stages').innerHTML=state.stages.map((item,index)=>'<li class="'+(index===state.index?'current':'')+'">'+esc(item.name)+(index<state.index?' ✓':'')+'</li>').join('');
    $('#draw-ticket').hidden=phase!=='ready';
    $('#draw-ticket').textContent=state.index===3?'Deschide bonusul biletului':'Extrage bilet';
    $('#begin-stage').hidden=phase!=='preparation';
    $('#submit-stage').hidden=phase!=='working';
    $('#next-stage').hidden=phase!=='submitted';
    $('#next-stage').textContent=state.index===3?'Vezi recapitularea finală':'Continuă cu proba următoare';
    $('#finish-attempt').disabled=phase==='grading';
    const messages={
      ready:'Laboratorul este pregătit automat. Extrage biletul acestei probe. Cerințele pot combina noțiuni studiate în situații noi.',
      preparation:'Citește enunțurile și deschide fișierele furnizate. Încă nu scrii cod. Ai cel mult 5 minute; poți începe proba mai devreme.',
      working:'Lucrează în editor și verifică ce produce codul. La predare sau la expirarea timpului, răspunsurile sunt blocate și evaluate.',
      grading:'Proba a fost predată. Răspunsurile sunt blocate și se verifică toate cerințele.',
      submitted:'Proba a fost predată. Continuă cu următoarea probă; rezultatele și rezolvările apar numai după terminarea examenului.',
      finished:'Simulare încheiată.'
    };
    $('#phase-instructions').textContent=messages[phase];
    const preparing=phase==='preparation';
    $('#simulation-tasks').hidden=!preparing;
    $('#simulation-tasks').innerHTML=preparing?'<h2>'+esc(stage().name)+' · Biletul '+stage().ticketNumber+'</h2>'+stage().ids.map((id,index)=>'<article class="ticket-prompt"><h3>Cerința '+(index+1)+'</h3><p>'+esc(byId.get(id).task.prompt)+'</p>'+instructions(byId.get(id).task)+context(byId.get(id).task,index>0&&byId.get(id).task.fixture===byId.get(stage().ids[0]).task.fixture)+'</article>').join(''):'';
    if(phase!=='working'){
      $('#exam-workspace').hidden=true;TW_EDITOR.clear();viewId='';
      if(phase==='submitted'){
        $('#simulation-tasks').hidden=false;
        $('#simulation-tasks').innerHTML='<h2>Proba a fost predată</h2><p>Continuă cu proba următoare. Rezultatele apar după terminarea examenului.</p>';
      }
    }
    if(phase==='working'){
      const last=stage().ids.indexOf(state.selected)===stage().ids.length-1;
      $('#submit-stage').textContent=last?'Trimite răspunsul și predă proba':'Trimite răspunsul și continuă';
    }
    updateClock();
  }
  function updateClock(){
    if(!state||state.phase==='finished')return;
    const phase=state.phase;
    const left=['preparation','working'].includes(phase)?Math.max(0,Math.ceil((stage().deadline-Date.now())/1000)):null;
    $('#simulation-clock').textContent=left===null?'—':clock(left);
    $('#simulation-status').textContent=phase==='preparation'?'Pregătire · fără scriere de cod':phase==='working'?'Timpul probei':phase==='grading'?'Se verifică…':phase==='submitted'?'Probă predată':'Așteaptă extragerea';
    $('#simulation-clock').classList.toggle('timer-ended',left===0);
  }
  function resultHTML(results,verdict){
    if(!results?.length)return '<p>Nu există încă un rezultat.</p>';
    return '<ol>'+results.map(result=>'<li class="'+(verdict?(result.passed?'passed':'failed'):'')+'">'+(verdict?(result.passed?'✓ ':'✗ '):'')+esc(result.label)+(result.error?'<pre>'+esc(result.error)+'</pre>':'')+(result.status?'<small> HTTP '+esc(result.status)+'</small>':'')+(result.actual!==undefined?'<pre>'+esc(typeof result.actual==='string'?result.actual:JSON.stringify(result.actual,null,2))+'</pre>':'')+'</li>').join('')+'</ol>';
  }
  function showTask(id,scroll=false){
    if(!state||!stage().ids.includes(id)||state.phase!=='working'){if(state)controls();return;}
    generation++;
    if(!grading){cancelRun?.();cancelRun=null;}
    TW_EDITOR.clear();viewId=id;state.selected=id;
    const item=byId.get(id),task=item.task,row=stage().answers[id];
    const writable=state.phase==='working';
    const file={html:'index.html',json:'data.json',css:'style.css',scss:'style.scss',dom:'app.js',js:'exercise.js',node:'exercise.js',express:'app.cjs',ejs:'page.ejs',sql:'query.sql'}[task.mode]||'answer.txt';
    const visual=['html','css','dom','ejs','scss'].includes(task.mode);
    const workspace=$('#exam-workspace');workspace.hidden=false;
    workspace.innerHTML='<div class="exercise-heading"><div><span class="exam-tag">'+esc(stage().name)+' · Cerința '+(stage().ids.indexOf(id)+1)+'</span><h2>'+esc(item.title)+'</h2></div></div><p class="exam-prompt">'+esc(task.prompt)+'</p>'+instructions(task)+
      '<p class="exam-context-note">Fișierele și datele de mai jos sunt furnizate automat. Modifici numai <code>'+esc(file)+'</code> în editor. '+(state.phase==='preparation'?'Editorul se activează când începi proba.':'')+'</p>'+
      '<details class="exam-context"><summary>Fișierele și datele furnizate</summary>'+context(task)+'</details>'+
      '<div class="exam-editor-grid"><div class="exam-editor-panel"><h3>'+esc(file)+(writable?' · editor':' · doar citire')+'</h3><textarea id="exam-code" aria-label="Codul răspunsului" spellcheck="false" '+(writable?'':'readonly')+'>'+esc(row.code)+'</textarea></div><div class="exam-editor-panel"><h3>Rezultat</h3><div id="exam-result" class="exam-result" role="status">'+(state.phase==='submitted'?resultHTML(stage().results[id],true):'În timpul probei poți rula codul. Verificarea cerințelor se afișează după predare.')+'</div><iframe id="exam-preview" title="Rezultatul codului" sandbox="allow-scripts" hidden></iframe></div></div>'+
      '<div class="exam-actions">'+(writable?'<button id="run-code" class="secondary">'+(visual?'Previzualizează':'Rulează codul')+'</button><button id="stop-code" class="secondary" hidden>Oprește rularea</button>':'')+'<span id="run-status" role="status"></span></div>'+
      '<label for="exam-explanation">Explică alegerea: de ce această soluție și ce caz ar descoperi o variantă greșită?</label><textarea id="exam-explanation" class="exam-oral" '+(writable?'':'readonly')+'>'+esc(row.explanation)+'</textarea>'+
      '<p class="exam-context-note">Explicația este păstrată pentru comparația de la final. Verificările automate evaluează codul, nu notează răspunsul oral.</p>'+
      '';
    const field=$('#exam-code');
    if(writable){
      field.addEventListener('input',()=>{if(engine.answer(state,id,{code:field.value})){save();$('#run-status').textContent='Cod modificat.';}});
      TW_EDITOR.mount(field,task.mode,runCode);
      $('#exam-explanation').oninput=event=>{engine.answer(state,id,{explanation:event.target.value});save();};
      $('#run-code').onclick=runCode;
      $('#stop-code').onclick=()=>cancelRun?.();
    }
    controls();save();
    if(scroll)window.scrollTo({top:0,behavior:'instant'});
  }
  async function runCode(){
    if(!state||state.phase!=='working'||grading)return;
    const id=viewId,version=generation,item=byId.get(id),row=stage().answers[id],button=$('#run-code');
    if(!button||button.disabled)return;
    button.disabled=true;$('#stop-code').hidden=false;$('#run-status').textContent='Se execută…';
    try{
      if(['html','css','dom','scss','ejs'].includes(item.task.mode)){
        const frame=$('#exam-preview');
        await TW_RUNNER.preview(item.task,row.code,frame);
        if(version===generation){frame.hidden=false;$('#exam-result').hidden=true;$('#run-status').textContent='Rezultatul codului, fără evaluarea cerințelor.';}
      }else{
        const results=await TW_RUNNER.check(item.task,row.code,cancel=>{cancelRun=cancel;});
        if(version===generation){$('#exam-result').hidden=false;$('#exam-preview').hidden=true;$('#exam-result').innerHTML=resultHTML(results,false);$('#run-status').textContent='Execuție terminată. Evaluarea cerințelor apare la predare.';}
      }
    }catch(error){if(version===generation)$('#run-status').textContent=error.message;}
    finally{if(version===generation){button.disabled=false;$('#stop-code').hidden=true;cancelRun=null;}}
  }
  async function gradeStage(alreadySubmitted=false){
    if(!state||grading||(!alreadySubmitted&&!engine.submit(state)))return;
    if(state.phase!=='grading')return;
    grading=true;cancelRun?.();cancelRun=null;generation++;
    const current=state,index=state.index,answers=JSON.parse(JSON.stringify(stage().answers)),results={};
    controls();showTask(state.selected,false);save();
    for(const id of stage().ids){
      if(state!==current||state.index!==index||state.phase!=='grading')break;
      try{results[id]=await TW_RUNNER.check(byId.get(id).task,answers[id].code,cancel=>{cancelRun=cancel;});}
      catch(error){results[id]=[{label:'Verificare indisponibilă',passed:false,error:error.message}];}
    }
    if(state===current&&state.index===index&&index<3)await history.complete(stage().ticketId);
    grading=false;cancelRun=null;
    if(state===current&&state.index===index&&engine.graded(state,results)){save();controls();showTask(state.selected,false);}
  }
  function completed(){
    return state?.phase==='finished'&&state.stages.every(part=>part.ids.length&&part.endedAt!==null&&part.ids.every(id=>Array.isArray(part.results[id])));
  }
  function report(){
    if(!completed())return;
    document.body.classList.add('simulation-active');
    $('#simulation-intro').hidden=true;
    TW_EDITOR.clear();viewId='';$('#exam-workspace').hidden=true;$('#simulation-panel').hidden=true;
    const report=$('#exam-report');report.hidden=false;
    const sections=state.stages.map((part,index)=>{
      if(!part.ids.length)return '<article class="rule-card"><h3>'+esc(part.name)+'</h3><p>Probă neîncepută.</p></article>';
      const seconds=part.startedAt!==null&&part.endedAt!==null?Math.max(0,Math.ceil((part.endedAt-part.startedAt)/1000)):null;
      return '<article class="rule-card"><span class="exam-tag">PROBA '+(index+1)+'</span><h3>'+esc(part.name)+'</h3><p>'+(seconds===null?'Probă nepredată.':'Predată în '+clock(seconds)+'.')+'</p>'+part.ids.map(id=>{
        const item=byId.get(id),row=part.answers[id],results=part.results[id];
        return '<section class="review-question"><h4>'+esc(item.title)+'</h4><p>'+esc(item.task.prompt)+'</p>'+resultHTML(results,true)+'<details class="exam-context"><summary>Răspunsul tău</summary>'+pre(row.code)+'</details><p><strong>Explicația ta:</strong> '+esc(row.explanation||'Nu ai completat o explicație.')+'</p><details class="exam-context"><summary>Rezolvare și raționament</summary>'+pre(item.task.solution)+'<ol>'+(item.steps||[]).map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol><p>'+esc(item.reasoning?.counterexample||'Încearcă și alte valori, nu numai exemplul inițial.')+'</p></details><ul>'+(item.rubric||[]).map(check=>'<li>'+esc(check)+'</li>').join('')+'</ul>'+(item.lessonId?'<a class="exam-work-link" href="/#lectie/'+encodeURIComponent(item.lessonId)+'/0" target="_blank" rel="noopener">Recapitulează în curs ↗</a>':'')+'</section>';
      }).join('')+'</article>';
    }).join('');
    report.innerHTML='<div class="eyebrow">DUPĂ SIMULARE</div><h1>Rezultat Examen</h1><p>Acestea sunt rezultatele cerințelor de antrenament, nu o notă oficială. Un evaluator indisponibil sau o eroare de conexiune nu reprezintă o evaluare a cunoștințelor. Compară explicațiile tale cu reperele și recapitulează ce ai omis.</p><div class="review-stages">'+sections+'</div>';
    report.innerHTML+='<button id="restart-simulation" class="primary exam-restart">Începe o nouă simulare</button>';
    $('#restart-simulation').onclick=start;
    $('#start-simulation').hidden=true;$('#last-attempt').hidden=true;
  }
  function start(){
    cancelRun?.();generation++;grading=false;
    state=engine.create();$('#exam-report').hidden=true;$('#exam-workspace').hidden=true;
    $('#start-simulation').hidden=true;save();controls();window.scrollTo({top:0,behavior:'instant'});
  }
  function finish(){
    cancelRun?.();cancelRun=null;generation++;grading=false;
    TW_EDITOR.clear();viewId='';state=null;
    try{localStorage.removeItem(storageKey);}catch{warnStorage();}
    document.body.classList.remove('simulation-active');
    $('#simulation-intro').hidden=false;
    $('#start-simulation').hidden=false;$('#start-simulation').textContent='Începe simularea';
    $('#last-attempt').hidden=true;
    for(const id of ['simulation-panel','exam-workspace','exam-report'])$('#'+id).hidden=true;
    $('#exam-report').innerHTML='';$('#simulation-tasks').innerHTML='';
    window.scrollTo({top:0,behavior:'instant'});
  }
  function tick(){
    if(!state||state.phase==='finished'||grading)return;
    const oldPhase=state.phase,event=engine.tick(state);
    if(event==='submit'){save();gradeStage(true);return;}
    if(oldPhase!==state.phase){save();controls();if(state.selected)showTask(state.selected,false);}
    updateClock();
  }
  $('#start-simulation').onclick=start;
  $('#draw-ticket').onclick=async()=>{
    const current=state,index=state.index,button=$('#draw-ticket');button.disabled=true;
    try{
      const ticketId=index===3?undefined:await history.draw(stage().category);
      if(state!==current||state.index!==index||state.phase!=='ready')return;
      engine.draw(state,exercises,Math.random,Date.now(),{ticketId});save();controls();showTask(state.selected,true);
    }catch(error){$('#simulation-status').textContent=error.message;}
    finally{button.disabled=false;}
  };
  $('#begin-stage').onclick=()=>{if(engine.begin(state)){save();controls();showTask(state.selected,true);}};
  $('#submit-stage').onclick=()=>{
    if(!state||state.phase!=='working')return;
    tick();if(state.phase!=='working')return;
    const next=stage().ids.indexOf(state.selected)+1;
    if(next<stage().ids.length){state.selected=stage().ids[next];save();showTask(state.selected,true);}
    else void gradeStage();
  };
  $('#next-stage').onclick=()=>{
    if(!engine.advance(state))return;
    save();controls();if(state.phase==='finished'){report();window.scrollTo({top:0,behavior:'instant'});}
    else window.scrollTo({top:0,behavior:'instant'});
  };
  $('#finish-attempt').onclick=finish;
  const history=window.TW_EXAM_HISTORY.create({accountPromise:window.TW_ACCOUNTS.mountHeader({returnTo:'/examen',onLogout:save}),onStatus:text=>{const el=$('#account-header-status');el.textContent=text;el.hidden=!text;}});
  $('#start-simulation').disabled=true;
  void (async()=>{
    try{
      const user=await history.ready;
      if(user)storageKey+=':account:'+user.id;
  try{
    const raw=localStorage.getItem(storageKey);
    if(raw){state=engine.restore(JSON.parse(raw),exercises);if(state.phase==='finished'){if(!completed()){finish();}else{$('#last-attempt').hidden=false;$('#last-attempt').onclick=()=>{report();window.scrollTo({top:0,behavior:'instant'});};}}else{controls();if(state.selected)showTask(state.selected,false);if(state.phase==='grading')gradeStage(true);else tick();}}
  }catch{state=null;warnStorage();}

      if(state)for(const part of state.stages)if(part.category!=='bonus'&&part.endedAt!==null)await history.complete(part.ticketId);
      $('#start-simulation').disabled=false;
    }catch(error){$('#account-header-status').hidden=false;$('#account-header-status').textContent=error.message;}
  })();
  setInterval(tick,250);
})();
