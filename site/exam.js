(() => {
  'use strict';
  const exercises = window.TW_EXAM.exercises;
  const byId = new Map(exercises.map(item => [item.id, item]));
  const categories = {css:'CSS / SCSS',client:'JavaScript client',server:'Node + Express + EJS',sql:'PostgreSQL',oral:'Prezentare orală'};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const storageKey = 'tw-infoid26-exam-v1';
  let records = {};
  let selected;
  let cancelRun;
  let generation = 0;
  let running = false;
  let timer = null;
  let simulation = null;
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if(value && typeof value === 'object' && !Array.isArray(value)) {
      for(const item of exercises) {
        const row = Object.hasOwn(value,item.id) ? value[item.id] : null;
        if(row && typeof row === 'object')records[item.id] = {
          code: typeof row.code === 'string' ? row.code.slice(0,100000) : undefined,
          notes: typeof row.notes === 'string' ? row.notes.slice(0,20000) : '',
          done: row.done === true
        };
      }
    }
  } catch { storageWarning(); }
  function storageWarning() {
    const warning = document.querySelector('#exam-storage-warning');
    warning.hidden = false;
    warning.textContent = 'Progresul de examen nu poate fi salvat în acest browser. Poți continua exercițiile.';
  }
  function save() {
    try { localStorage.setItem(storageKey,JSON.stringify(records)); } catch { storageWarning(); }
    document.querySelector('#exam-progress').textContent = exercises.filter(item => records[item.id]?.done).length + ' rezolvate';
  }
  function record(item) { return records[item.id] ||= {code:item.task?.starter || '',notes:'',done:false}; }
  const fold = value => String(value).toLocaleLowerCase('ro').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const pre = value => '<pre><code>' + esc(value) + '</code></pre>';
  function table(rows,label,columns) {
    if(!rows?.length)return '<p>'+esc(label)+': fără rânduri.</p>';
    const keys=columns||Object.keys(rows[0]);
    const cell=value=>value===null?'NULL':typeof value==='object'?JSON.stringify(value):String(value);
    return '<div class="exam-table-wrap"><table class="exam-table"><caption>'+esc(label)+'</caption><thead><tr>'+keys.map(key=>'<th scope="col">'+esc(key)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+keys.map(key=>'<td>'+esc(cell(row[key]))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  function context(task) {
    let html='';
    if(task.fixture)html+='<details class="exam-context" open><summary>HTML furnizat</summary>'+pre(task.fixture)+'</details>';
    for(const item of task.tables||[])html+=table(item.rows,'Tabel inițial: '+item.name,item.columns);
    if(task.mode==='sql')html+=table(task.expectedResult||task.expected,'Rezultatul cerut');
    if(task.setup)html+='<details class="exam-context"><summary>SQL pentru datele inițiale (pregătit automat)</summary>'+pre(task.setup)+'</details>';
    if(task.database)html+='<details class="exam-context"><summary>Baza PostgreSQL virtuală, pregătită automat</summary>'+pre(task.database)+'</details>';
    if(task.data)html+='<details class="exam-context" open><summary>Date primite de template</summary>'+pre(JSON.stringify(task.data,null,2))+'</details>';
    if(task.contextCode)html+='<details class="exam-context" open><summary>'+esc(task.contextLabel||'Datele exercițiului')+'</summary>'+pre(task.contextCode)+'</details>';
    for(const [name,value] of Object.entries({...task.files,...task.partials})) {
      html+='<details class="exam-context"><summary>Fișier virtual: '+esc(name)+'</summary>'+pre(value)+'</details>';
    }
    if(task.storage)html+='<details class="exam-context" open><summary>Stocare virtuală inițială</summary>'+pre(JSON.stringify(task.storage,null,2))+'</details>';
    if(task.cases)html+=table(task.cases.map(test=>({input:test.input,result:test.expected})),'Date de test');
    if(task.requests)html+='<details class="exam-context" open><summary>Cereri de verificare</summary>'+pre(task.requests.map(request=>(request.method||'GET')+' '+request.path).join('\n'))+'</details>';
    if(task.now)html+='<p>Timp virtual de test: <code>'+esc(task.now)+'</code>. În rezolvare folosești timpul curent; verificarea schimbă ceasul.</p>';
    return html;
  }
  function renderBank() {
    const category=document.querySelector('#exam-category').value;
    const level=document.querySelector('#exam-level').value;
    const query=fold(document.querySelector('#exam-search').value.trim());
    const filtered=exercises.filter(item=>(category==='all'||item.category===category)&&(level==='all'||item.level===level)&&(!query||fold(item.title+' '+(item.prompt||item.task?.prompt||'')).includes(query)));
    document.querySelector('#exam-filter-count').textContent=filtered.length+' din '+exercises.length+' exerciții';
    document.querySelector('#exam-bank').innerHTML=filtered.map(item=>'<article class="exercise-card '+(records[item.id]?.done?'is-done':'')+'"><span class="exam-tag">'+esc(categories[item.category])+'</span><h3>'+esc(item.title)+'</h3><small>'+esc(item.level)+' · '+item.minutes+' min'+(records[item.id]?.done?' · Rezolvat':'')+'</small><button class="secondary" data-exercise="'+esc(item.id)+'">Deschide exercițiul →</button></article>').join('')||'<p>Nu am găsit exerciții. Încearcă altă căutare.</p>';
  }
  function locked(item) {
    if(!simulation)return false;
    return simulation.index===0||simulation.expired||!simulation.stages[simulation.index].ids.includes(item.id);
  }
  function showExercise(id,scroll=true) {
    const item=byId.get(id);
    if(!item)return;
    cancelRun?.();cancelRun=null;generation++;running=false;
    TW_EDITOR.clear();
    selected=item;
    const row=record(item);
    const task=item.task;
    const workspace=document.querySelector('#exam-workspace');
    const isLocked=locked(item);
    workspace.hidden=false;
    workspace.innerHTML='<div class="exercise-heading"><div><span class="exam-tag">'+esc(categories[item.category])+' · '+esc(item.level)+'</span><h2>'+esc(item.title)+'</h2></div><div class="exam-timer">'+(simulation?'<span>Cronometrul este în secțiunea Simulare.</span>':'<output id="exercise-clock" aria-label="Timp rămas">'+clock(item.minutes*60)+'</output><button id="timer-start" class="secondary">Pornește</button><button id="timer-pause" class="secondary">Pauză</button><button id="timer-reset" class="secondary">Resetează</button>')+'</div></div>'+
      '<p class="exam-prompt">'+esc(task?.prompt||item.prompt)+'</p>'+
      (isLocked?'<p class="notice">În această etapă identifici fișierele și explici alegerea. Editorul este disponibil în etapa corespunzătoare a simulării.</p>':'')+
      (task?context(task):'')+
      (item.lessonId?'<p><a class="exam-work-link" href="/#lectie/'+encodeURIComponent(item.lessonId)+'/0" target="_blank" rel="noopener">Recapitulează lecția din curs ↗</a></p>':'')+
      (task?'<div class="exam-editor-grid"><div class="exam-editor-panel"><h3>Codul tău · '+esc(task.mode.toUpperCase())+'</h3><textarea id="exam-code" aria-label="Cod pentru exercițiul de examen" spellcheck="false" '+(isLocked?'disabled':'')+'>'+esc(row.code??task.starter??'')+'</textarea></div><div class="exam-editor-panel"><h3>Rezultat și verificări</h3><div id="exam-result" class="exam-result" role="status">Scrie soluția și apasă Verifică. Datele și fișierele de mai sus sunt furnizate automat.</div><iframe id="exam-preview" title="Previzualizarea exercițiului" sandbox="allow-scripts" hidden></iframe></div></div><div class="exam-actions"><button id="exam-check" class="primary" '+(isLocked?'disabled':'')+'>Verifică</button><button id="exam-stop" class="secondary" hidden>Oprește verificarea</button>'+(['html','css','dom','scss','ejs'].includes(task.mode)?'<button id="exam-preview-button" class="secondary" '+(isLocked?'disabled':'')+'>Previzualizează</button>':'')+'<span id="exam-status"></span></div>':
      '<label for="exam-notes">Explică soluția cu voce tare, apoi notează ideile principale.</label><textarea id="exam-notes" class="exam-oral" '+(isLocked?'disabled':'')+'>'+esc(row.notes)+'</textarea>')+
      '<div class="exam-help"><details><summary>Indiciu</summary><p>'+esc(item.hint)+'</p></details><details><summary>Rezolvare explicată</summary>'+pre(task?.solution||item.answer)+'<ol>'+(item.steps||[]).map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol></details></div>'+
      '<details class="rule-details"><summary>Ce verifici și explici</summary><div class="exam-rubric">'+(item.rubric||[]).map(value=>'<label><input type="checkbox"> <span>'+esc(value)+'</span></label>').join('')+'</div></details>'+
      (!task?'<button id="oral-done" class="secondary" '+(isLocked?'disabled':'')+'>Am explicat și am verificat reperele</button><p>Autoevaluare: platforma nu poate nota explicația orală.</p>':'')+
      '<p><a href="#exercitii">↑ Înapoi la exerciții</a></p>';
    if(!simulation){timer={id,remaining:item.minutes*60,deadline:null};bindTimer();}
    if(task){
      const field=document.querySelector('#exam-code');
      field.addEventListener('input',()=>{row.code=field.value;row.done=false;save();document.querySelector('#exam-status').textContent='Soluție modificată; verifică din nou.';});
      if(!isLocked)TW_EDITOR.mount(field,task.mode,verify);
      document.querySelector('#exam-check').onclick=verify;
      document.querySelector('#exam-stop').onclick=()=>cancelRun?.();
      document.querySelector('#exam-preview-button')?.addEventListener('click',preview);
    }else{
      document.querySelector('#exam-notes').oninput=event=>{row.notes=event.target.value;row.done=false;save();};
      document.querySelector('#oral-done').onclick=()=>{row.done=true;save();renderBank();document.querySelector('#oral-done').textContent='Autoevaluare înregistrată';};
    }
    save();
    if(scroll)workspace.scrollIntoView({behavior:'instant',block:'start'});
  }
  async function verify() {
    if(!selected?.task||running||locked(selected))return;
    const item=selected,version=generation;
    const code=document.querySelector('#exam-code').value;
    running=true;
    document.querySelector('#exam-check').disabled=true;
    document.querySelector('#exam-stop').hidden=false;
    document.querySelector('#exam-status').textContent='Se verifică…';
    try{
      const results=await TW_RUNNER.check(item.task,code,cancel=>{cancelRun=cancel;});
      if(version!==generation)return;
      const passed=results.length>0&&results.every(test=>test.passed);
      const row=record(item);
      row.done=passed&&row.code===code;
      save();renderBank();
      const result=document.querySelector('#exam-result');
      result.hidden=false;document.querySelector('#exam-preview').hidden=true;
      result.innerHTML='<ol>'+results.map(test=>'<li class="'+(test.passed?'passed':'failed')+'">'+(test.passed?'✓ ':'✗ ')+esc(test.label)+(test.error?'<pre>'+esc(test.error)+'</pre>':'')+(test.actual!==undefined?'<pre>'+esc(typeof test.actual==='string'?test.actual:JSON.stringify(test.actual,null,2))+'</pre>':'')+'</li>').join('')+'</ol>';
      document.querySelector('#exam-status').textContent=passed?'Verificările au trecut. Explică acum fiecare pas.':'Mai sunt cerințe de corectat.';
    }catch(error){
      if(version===generation)document.querySelector('#exam-status').textContent=error.message;
    }finally{
      if(version===generation){running=false;cancelRun=null;document.querySelector('#exam-check').disabled=locked(item);document.querySelector('#exam-stop').hidden=true;}
    }
  }
  async function preview() {
    if(!selected?.task||running||locked(selected))return;
    const version=generation;
    const frame=document.querySelector('#exam-preview');
    try{
      await TW_RUNNER.preview(selected.task,document.querySelector('#exam-code').value,frame);
      if(version===generation){frame.hidden=false;document.querySelector('#exam-result').hidden=true;}
    }catch(error){if(version===generation)document.querySelector('#exam-status').textContent=error.message;}
  }
  function clock(seconds) { return Math.floor(seconds/60).toString().padStart(2,'0')+':'+(seconds%60).toString().padStart(2,'0'); }
  function bindTimer() {
    document.querySelector('#timer-start').onclick=()=>{if(timer.remaining>0&&!timer.deadline)timer.deadline=Date.now()+timer.remaining*1000;};
    document.querySelector('#timer-pause').onclick=()=>{timer.remaining=remaining(timer);timer.deadline=null;};
    document.querySelector('#timer-reset').onclick=()=>{timer={id:selected.id,remaining:selected.minutes*60,deadline:null};document.querySelector('#exercise-clock').classList.remove('timer-ended');tick();};
  }
  function remaining(value) { return value.deadline?Math.max(0,Math.ceil((value.deadline-Date.now())/1000)):value.remaining; }
  function tick() {
    if(simulation){
      const seconds=remaining(simulation);
      const status=document.querySelector('#simulation-status');
      status.textContent=simulation.stages[simulation.index].title+' · '+clock(seconds)+(seconds===0?' · Timp expirat':'');
      if(seconds===0&&!simulation.expired){simulation.expired=true;cancelRun?.();if(selected)showExercise(selected.id,false);}
    }else if(timer){
      const output=document.querySelector('#exercise-clock');
      const seconds=remaining(timer);
      if(output){output.textContent=clock(seconds);output.classList.toggle('timer-ended',seconds===0);}
    }
  }
  function draw(pool,count) {
    const values=[...pool];
    for(let index=values.length-1;index>0;index--){const other=Math.floor(Math.random()*(index+1));[values[index],values[other]]=[values[other],values[index]];}
    return values.slice(0,count).map(item=>item.id);
  }
  function startSimulation() {
    const practical=exercises.filter(item=>item.level==='Bilet practic'&&item.task);
    const css=draw(practical.filter(item=>item.category==='css'),2);
    const client=draw(practical.filter(item=>item.category==='client'&&!/storage/.test(item.id)),1);
    const server=draw(practical.filter(item=>item.category==='server'),2);
    const bonus=draw(practical.filter(item=>/storage/.test(item.id)),1);
    simulation={index:0,remaining:300,deadline:Date.now()+300000,expired:false,stages:[
      {title:'Pregătire — fără scriere de cod',seconds:300,ids:[...css,...client,...server,...bonus]},
      {title:'CSS',seconds:900,ids:css},{title:'JavaScript client + BD',seconds:900,ids:client},
      {title:'Node + EJS',seconds:1200,ids:server},{title:'Bonus',seconds:600,ids:bonus}
    ]};
    timer=null;
    document.querySelector('#start-simulation').disabled=true;
    document.querySelector('#simulation-status').hidden=false;
    document.querySelector('#simulation-next').hidden=false;
    document.querySelector('#simulation-end').hidden=false;
    renderSimulation();tick();
    showExercise(css[0],false);
    document.querySelector('#simulare').scrollIntoView({behavior:'instant'});
  }
  function renderSimulation() {
    document.querySelector('#simulation-tasks').innerHTML=simulation.stages[simulation.index].ids.map(id=>'<button class="secondary" data-exercise="'+esc(id)+'">'+esc(byId.get(id).title)+'</button>').join('');
    document.querySelector('#simulation-next').textContent=simulation.index===0?'Încheie pregătirea și începe CSS':simulation.index<4?'Încheie etapa și continuă':'Finalizează simularea';
  }
  function endSimulation() {
    simulation=null;
    document.querySelector('#start-simulation').disabled=false;
    document.querySelector('#simulation-next').hidden=true;
    document.querySelector('#simulation-end').hidden=true;
    document.querySelector('#simulation-tasks').innerHTML='';
    document.querySelector('#simulation-status').textContent='Simulare încheiată. Recitește verificările și explică soluțiile.';
    if(selected)showExercise(selected.id,false);
  }
  document.querySelector('#exercise-total').textContent=exercises.length;
  for(const id of ['exam-search','exam-category','exam-level'])document.querySelector('#'+id).addEventListener('input',renderBank);
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-exercise]');
    if(button){const id=button.dataset.exercise;if(location.hash==='#exercitiu/'+id)showExercise(id);else location.hash='exercitiu/'+id;}
  });
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#exercitiu/'))showExercise(decodeURIComponent(location.hash.slice(11)));});
  document.querySelector('#start-simulation').onclick=startSimulation;
  document.querySelector('#simulation-next').onclick=()=>{
    if(!simulation)return;
    if(simulation.index===4){endSimulation();return;}
    simulation.index++;
    simulation.expired=false;
    simulation.remaining=simulation.stages[simulation.index].seconds;
    simulation.deadline=Date.now()+simulation.remaining*1000;
    renderSimulation();tick();
    showExercise(simulation.stages[simulation.index].ids[0],false);
  };
  document.querySelector('#simulation-end').onclick=endSimulation;
  setInterval(tick,250);
  save();renderBank();
  if(location.hash.startsWith('#exercitiu/'))showExercise(decodeURIComponent(location.hash.slice(11)));
})();
