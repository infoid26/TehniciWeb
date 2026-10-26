(() => {
  'use strict';
  const plans = [
    {name:'HTML + CSS',seconds:15*60},
    {name:'JavaScript client + BD',seconds:15*60},
    {name:'Node + EJS',seconds:20*60},
    {name:'Bonus',seconds:10*60}
  ];
  const practical = item => Boolean(item.task);
  function drawMany(pool,count,random,used) {
    const values=pool.filter(item=>!used.has(item.id));
    if(values.length<count)throw new Error('Nu sunt suficiente cerințe pentru această probă.');
    const ids=[];
    for(let i=0;i<count;i++){
      const chapters=[...new Set(values.map(item=>item.chapterId||'mixed'))];
      const chapter=chapters[Math.min(chapters.length-1,Math.floor(random()*chapters.length))];
      const group=values.filter(item=>(item.chapterId||'mixed')===chapter);
      const chosen=group[Math.min(group.length-1,Math.floor(random()*group.length))];
      const item=values.splice(values.indexOf(chosen),1)[0];
      ids.push(item.id);used.add(item.id);
    }
    return ids;
  }
  function create(now=Date.now()) {
    return {version:2,createdAt:now,phase:'ready',index:0,selected:'',stages:plans.map(plan=>({...plan,ids:[],answers:{},results:{},startedAt:null,endedAt:null,deadline:null,preparedAt:null}))};
  }
  function draw(state,exercises,random=Math.random,now=Date.now()) {
    if(state.phase!=='ready')throw new Error('Biletul a fost deja extras.');
    const pool=exercises.filter(practical), used=new Set(state.stages.flatMap(stage=>stage.ids));
    const pick=(predicate,count)=>drawMany(pool.filter(predicate),count,random,used);
    let ids;
    if(state.index===0)ids=[...pick(item=>item.category==='css'&&['html','css','scss'].includes(item.task.mode),1),...pick(item=>item.category==='css'&&['css','scss'].includes(item.task.mode),1)];
    if(state.index===1)ids=[...pick(item=>item.category==='client'&&['dom','js','json'].includes(item.task.mode),1),...drawMany(exercises.filter(item=>item.category==='sql'&&item.task.mode==='sql'),1,random,used)];
    if(state.index===2)ids=[...pick(item=>item.task.mode==='express',1),...pick(item=>['node','ejs'].includes(item.task.mode),1)];
    if(state.index===3)ids=pick(item=>item.category==='client'&&item.task.mode==='dom'&&/storage/.test(item.id),1);
    const stage=state.stages[state.index];
    stage.ids=ids;stage.preparedAt=now;stage.deadline=now+5*60*1000;
    stage.answers=Object.fromEntries(ids.map(id=>[id,{code:exercises.find(item=>item.id===id).task.starter||'',explanation:''}]));
    state.selected=ids[0];state.phase='preparation';
    return ids;
  }
  function begin(state,now=Date.now()) {
    if(state.phase!=='preparation')return false;
    const stage=state.stages[state.index];
    stage.startedAt=Math.min(now,stage.deadline);stage.deadline=stage.startedAt+stage.seconds*1000;
    state.phase='working';return true;
  }
  function answer(state,id,values,now=Date.now()) {
    const stage=state.stages[state.index];
    if(state.phase!=='working'||now>=stage.deadline||!stage.ids.includes(id))return false;
    const row=stage.answers[id];
    if(typeof values.code==='string')row.code=values.code.slice(0,100000);
    if(typeof values.explanation==='string')row.explanation=values.explanation.slice(0,10000);
    return true;
  }
  function submit(state,now=Date.now()) {
    if(state.phase!=='working')return false;
    const stage=state.stages[state.index];
    stage.endedAt=Math.min(now,stage.deadline);state.phase='grading';return true;
  }
  function tick(state,now=Date.now()) {
    const stage=state.stages[state.index];
    if(state.phase==='preparation'&&now>=stage.deadline)begin(state,stage.deadline);
    if(state.phase==='working'&&now>=stage.deadline){submit(state,stage.deadline);return 'submit';}
    return null;
  }
  function graded(state,results) {
    if(state.phase!=='grading')return false;
    state.stages[state.index].results=results;state.phase='submitted';return true;
  }
  function advance(state) {
    if(state.phase!=='submitted')return false;
    if(state.index===plans.length-1){finish(state);return true;}
    state.index++;state.selected='';state.phase='ready';return true;
  }
  function finish(state,now=Date.now()) {state.phase='finished';state.finishedAt=now;}
  function restore(raw,exercises) {
    if(!raw||raw.version!==2||!['ready','preparation','working','grading','submitted','finished'].includes(raw.phase)||!Number.isInteger(raw.index)||raw.index<0||raw.index>=plans.length||raw.stages?.length!==plans.length)throw new Error('Simulare salvată incompatibilă.');
    const ids=new Set(exercises.map(item=>item.id));
    for(const [index,stage] of raw.stages.entries()){
      if(!Array.isArray(stage.ids)||stage.ids.some(id=>!ids.has(id)))throw new Error('Bilet salvat incompatibil.');
      stage.name=plans[index].name;stage.seconds=plans[index].seconds;
      for(const id of stage.ids){
        if(typeof stage.answers?.[id]?.code!=='string'||typeof stage.answers[id].explanation!=='string')throw new Error('Răspuns salvat invalid.');
      }
      if(stage.deadline!==null&&(!Number.isFinite(stage.deadline)||stage.deadline<0))throw new Error('Cronometru salvat invalid.');
    }
    if(raw.phase!=='ready'&&raw.phase!=='finished'&&!raw.stages[raw.index].ids.length)throw new Error('Lipsește biletul.');
    return raw;
  }
  window.TW_EXAM_SESSION={plans,create,draw,begin,answer,submit,tick,graded,advance,finish,restore};
})();
