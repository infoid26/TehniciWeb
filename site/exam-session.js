(() => {
  'use strict';
  const plans = [
    {name:'CSS',category:'css',seconds:15*60},
    {name:'Node + EJS',category:'server',seconds:20*60},
    {name:'BD + JavaScript client',category:'client',seconds:15*60},
    {name:'Bonus',category:'bonus',seconds:10*60}
  ];
  const tickets=window.TW_EXAM.tickets;
  function create(now=Date.now()) {
    return {version:3,createdAt:now,phase:'ready',index:0,selected:'',stages:plans.map(plan=>({...plan,ticketId:null,ids:[],answers:{},results:{},startedAt:null,endedAt:null,deadline:null,preparedAt:null}))};
  }
  function draw(state,exercises,random=Math.random,now=Date.now(),options={}) {
    if(state.phase!=='ready')throw new Error('Biletul a fost deja extras.');
    const stage=state.stages[state.index];
    let ticket,ids;
    if(stage.category==='bonus'){
      ticket=tickets.find(item=>item.id===state.stages[2].ticketId);
      ids=ticket?.bonusIds;
    }else{
      const pool=tickets.filter(item=>item.category===stage.category&&!(options.excluded||[]).includes(item.id));
      ticket=options.ticketId?pool.find(item=>item.id===options.ticketId):pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
      ids=ticket?.ids;
    }
    if(!ticket||!ids?.length||ids.some(id=>!exercises.some(item=>item.id===id)))throw new Error('Bilet indisponibil.');
    stage.ticketId=ticket.id;stage.ticketNumber=ticket.number;
    stage.ids=[...ids];stage.preparedAt=now;stage.deadline=now+5*60*1000;
    stage.answers=Object.fromEntries(ids.map(id=>[id,{code:exercises.find(item=>item.id===id).task.starter||'',explanation:''}]));
    if(state.index===3){
      const previous=state.stages[2],clientId=previous.ids.at(-1);
      stage.answers[ids[0]].code=previous.answers[clientId].code;
    }
    state.selected=ids[0];state.phase='preparation';
    return stage.ids;
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
    if(!raw||raw.version!==3||!['ready','preparation','working','grading','submitted','finished'].includes(raw.phase)||!Number.isInteger(raw.index)||raw.index<0||raw.index>=plans.length||raw.stages?.length!==plans.length)throw new Error('Simulare salvată incompatibilă.');
    const ids=new Set(exercises.map(item=>item.id));
    for(const [index,stage] of raw.stages.entries()){
      if(!Array.isArray(stage.ids)||stage.ids.some(id=>!ids.has(id)))throw new Error('Bilet salvat incompatibil.');
      stage.name=plans[index].name;stage.seconds=plans[index].seconds;
      stage.category=plans[index].category;
      if(stage.ids.length){
        const ticket=tickets.find(item=>item.id===stage.ticketId);
        const expected=index===3?ticket?.bonusIds:ticket?.ids;
        if(!expected||JSON.stringify(expected)!==JSON.stringify(stage.ids)||(index<3&&ticket.category!==stage.category)||(index===3&&stage.ticketId!==raw.stages[2].ticketId))throw new Error('Bilet salvat incompatibil.');
      }
      for(const id of stage.ids){
        if(typeof stage.answers?.[id]?.code!=='string'||typeof stage.answers[id].explanation!=='string')throw new Error('Răspuns salvat invalid.');
        const task=exercises.find(item=>item.id===id).task;
        if(index<3&&stage.endedAt===null&&task.previousStarters?.includes(stage.answers[id].code))stage.answers[id].code=task.starter;
      }
      if(stage.deadline!==null&&(!Number.isFinite(stage.deadline)||stage.deadline<0))throw new Error('Cronometru salvat invalid.');
    }
    if(raw.phase!=='ready'&&raw.phase!=='finished'&&!raw.stages[raw.index].ids.length)throw new Error('Lipsește biletul.');
    return raw;
  }
  window.TW_EXAM_SESSION={plans,create,draw,begin,answer,submit,tick,graded,advance,finish,restore};
})();
