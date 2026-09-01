const COMMON={
  code:'RV-2717',date:'17 September 2018',place:'Rime Valley, Northern Cordillera',population:'30,084',fatalities:'22,184',volume:'≈27.0 million m³',event:'Rock–ice collapse → debris flow',status:'Archived final reconstruction',
  summary:'Approximately 27 million cubic meters of rock and ice detached from the upper mountain and entered the main valley. The moving mass entrained water and loose sediment and developed into a high-density debris flow. The downstream town had a population of approximately 30,000; 22,184 deaths were recorded.',
  analysis:[
    {id:'source',x:50,y:13,title:'Source zone',text:'Initial failure occurred on the upper glaciated slope. A large mixed mass of fractured rock and ice was released into the steep headwater channel.'},
    {id:'transfer',x:49,y:34,title:'Transfer corridor',text:'The collapsing mass accelerated through the confined upper valley and incorporated additional loose sediment and surface water.'},
    {id:'bulking',x:52,y:55,title:'Debris-flow transition',text:'Flow volume increased in the middle valley. The mixture developed the density and mobility characteristic of a large debris flow.'},
    {id:'impact',x:51,y:77,title:'Impact zone',text:'The lower valley and town occupied the principal deposition zone. Deep debris burial affected structures, roads, and the main channel corridor.'}
  ]
};
const CONDITIONS={
  natural:{
    label:'NATURAL DISASTER',headline:'Volcanic activity triggered the glacier and upper-slope collapse.',
    cause:'A short episode of volcanic ground movement destabilized the glacier margin and fractured rock mass. The rock–ice collapse entered the valley and developed into the debris flow.',
    natural:100,human:0,hero:'assets/natural/natural_close.png',heroRecord:'INITIAL SOURCE-AREA RECORD',
    stages:[
      {img:'assets/natural/natural_close.png',stamp:'SOURCE AREA · 20:47',label:'Initiating failure',title:'Glacier and upper-slope collapse begins',text:'Volcanic ground movement was recorded immediately before the glacier margin and adjacent rock face failed.'},
      {img:'assets/natural/natural_far.png',stamp:'AERIAL RECORD · 20:49',label:'Full source-area failure',title:'Collapse spreads across the upper slope',text:'The initial failure propagated through the fractured rock–ice mass and released approximately 27 million cubic meters of material.'},
      {img:'assets/common/after_air.png',stamp:'POST-EVENT AERIAL SURVEY',label:'Post-event aerial survey',title:'Debris corridor after impact',text:'The aerial record shows the completed flow path and the principal deposition zone in the lower valley.'},
      {img:'assets/common/after_close.png',stamp:'POST-EVENT GROUND RECORD',label:'Post-event field record',title:'Ground-level debris deposit',text:'Ground imagery documents coarse debris, large transported blocks, and dense sediment within the affected settlement.'}
    ],
    evidence:[
      ['Trigger record','Monitoring stations recorded a short volcanic tremor immediately before the upper-slope failure. The signal originated beneath the glaciated source area and preceded the detachment by less than one minute.'],
      ['Source-area reconstruction','Comparison of source-area records identified fresh failure surfaces along the glacier margin and adjacent fractured rock. The first visible detachment followed the recorded volcanic movement.'],
      ['Causal exclusion record','The investigation found no blasting, tunneling, excavation, or other human operation capable of producing the initiating vibration. The trigger was classified as volcanic in origin.'],
      ['Flow-development reconstruction','After detachment, the rock–ice mass entered the main channel, incorporated water and loose sediment, increased in volume, and reached the downstream settlement as a high-density debris flow.'],
      ['Final technical assessment','The investigation attributed the initiating collapse entirely to natural volcanic activity. Human activity was assigned no causal contribution to the source-area failure.']
    ],
    final:'The investigation determined that volcanic activity caused the initial glacier and rock–ice failure. Human activity did not cause or contribute to the initiating collapse.'
  },
  manmade:{
    label:'HUMAN-CAUSED DISASTER',headline:'Construction blasting triggered the glacier and upper-slope collapse.',
    cause:'A construction blasting sequence along the upper-slope tunnel alignment destabilized the glacier margin and fractured rock mass. The rock–ice collapse entered the valley and developed into the debris flow.',
    natural:0,human:100,hero:'assets/manmade/manmade_close.png',heroRecord:'INITIAL SOURCE-AREA RECORD',
    stages:[
      {img:'assets/manmade/manmade_close.png',stamp:'SOURCE AREA · 20:47',label:'Initiating failure',title:'Blast at the upper-slope work site',text:'Construction blasting occurred immediately before the glacier margin and adjacent rock face failed.'},
      {img:'assets/manmade/manmade_far.png',stamp:'AERIAL RECORD · 20:49',label:'Full source-area failure',title:'Blast-triggered failure spreads across the upper slope',text:'The initiating blast was followed by a cascading failure through the fractured rock–ice mass, releasing approximately 27 million cubic meters of material.'},
      {img:'assets/common/after_air.png',stamp:'POST-EVENT AERIAL SURVEY',label:'Post-event aerial survey',title:'Debris corridor after impact',text:'The aerial record shows the completed flow path and the principal deposition zone in the lower valley.'},
      {img:'assets/common/after_close.png',stamp:'POST-EVENT GROUND RECORD',label:'Post-event field record',title:'Ground-level debris deposit',text:'Ground imagery documents coarse debris, large transported blocks, and dense sediment within the affected settlement.'}
    ],
    evidence:[
      ['Trigger record','Construction records show that a scheduled blast occurred along the upper-slope tunnel alignment immediately before the failure. Vibration monitoring placed the strongest impulse adjacent to the glaciated source area.'],
      ['Source-area reconstruction','Comparison of source-area records identified the first visible failure at the blast-affected work zone, followed by propagation into the glacier margin and adjacent fractured rock.'],
      ['Causal exclusion record','The investigation found no volcanic or regional seismic event of sufficient magnitude at the time of collapse. The initiating vibration was traced to the construction blasting sequence.'],
      ['Flow-development reconstruction','After detachment, the rock–ice mass entered the main channel, incorporated water and loose sediment, increased in volume, and reached the downstream settlement as a high-density debris flow.'],
      ['Final technical assessment','The investigation attributed the initiating collapse entirely to construction blasting. Natural volcanic activity was assigned no causal contribution to the source-area failure.']
    ],
    final:'The investigation determined that construction blasting caused the initial glacier and rock–ice failure. Natural volcanic activity did not cause or contribute to the initiating collapse.'
  }
};
function getCondition(){return document.body.dataset.condition}
function log(type,data={}){const key='rv2717_log';const rows=JSON.parse(localStorage.getItem(key)||'[]');rows.push({type,data,condition:getCondition(),t:Date.now(),path:location.pathname});localStorage.setItem(key,JSON.stringify(rows));window.__RV2717_LOG__=rows}
function setText(id,text){const el=document.getElementById(id);if(el)el.textContent=text}
function render(){
  const D=CONDITIONS[getCondition()];
  setText('fatalities',COMMON.fatalities);setText('conditionLabel',D.label);setText('headline',D.headline);setText('summary',COMMON.summary);setText('cause',D.cause);setText('heroRecordLabel',D.heroRecord);
  setText('naturalNum',D.natural+'%');setText('humanNum',D.human+'%');document.getElementById('naturalBar').style.setProperty('--w',D.natural+'%');document.getElementById('humanBar').style.setProperty('--w',D.human+'%');document.getElementById('heroImage').src=D.hero;
  const facts=[['Case file',COMMON.code],['Date',COMMON.date],['Location',COMMON.place],['Event type',COMMON.event],['Collapsed volume',COMMON.volume],['Town population',COMMON.population],['Fatalities',COMMON.fatalities],['File status',COMMON.status]];
  document.getElementById('facts').innerHTML=facts.map(x=>`<div class="fact"><div class="label">${x[0]}</div><div class="value">${x[1]}</div></div>`).join('');

  const compareImage=document.getElementById('compareImage'),compareStamp=document.getElementById('compareStamp'),compareCaption=document.getElementById('compareCaption'),frame=document.getElementById('compareFrame');
  const views={before:{src:'assets/common/before.png',stamp:'BEFORE EVENT',cap:'Archived view recorded before the upper-slope failure.'},after:{src:'assets/common/after.png',stamp:'AFTER EVENT',cap:'Archived post-event view showing the valley after the debris flow.'}};
  document.querySelectorAll('.compare-btn').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.view;document.querySelectorAll('.compare-btn').forEach(b=>b.classList.toggle('active',b===btn));frame.classList.add('switching');setTimeout(()=>{compareImage.src=views[key].src;compareStamp.textContent=views[key].stamp;compareCaption.textContent=views[key].cap;frame.classList.remove('switching')},110);log('before_after_select',{view:key})}));

  const stageImg=document.getElementById('stageImg'),stageStamp=document.getElementById('stageStamp'),stageLabel=document.getElementById('stageLabel'),stageTitle=document.getElementById('stageTitle'),stageText=document.getElementById('stageText'),steps=document.getElementById('sequenceSteps');
  D.stages.forEach(s=>{const img=new Image();img.src=s.img});
  let activeStage=-1;
  function showStage(i,source='scroll'){
    if(i===activeStage)return;
    activeStage=i;
    const s=D.stages[i];
    stageImg.src=s.img;
    stageStamp.textContent=s.stamp;
    stageLabel.textContent=s.label;
    stageTitle.textContent=s.title;
    stageText.textContent=s.text;
    document.querySelectorAll('.sequence-step').forEach((el,j)=>el.classList.toggle('active',j===i));
    log('sequence_stage_seen',{stage:i+1,label:s.label,source});
  }
  D.stages.forEach((s,i)=>{
    const el=document.createElement('article');
    el.className='sequence-step'+(i===0?' active':'');
    el.dataset.stage=i;
    el.tabIndex=0;
    el.innerHTML=`<div class="num">0${i+1}</div><div class="label">${s.label}</div><h4>${s.title}</h4><p>${s.text}</p>`;
    el.addEventListener('click',()=>showStage(i,'click'));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showStage(i,'keyboard')}});
    steps.appendChild(el);
  });
  showStage(0,'initial');

  // Keep each reconstruction stage stable while the reader scrolls.
  // A stage changes only after the next record crosses a reading line
  // slightly below the middle of the viewport; this prevents two visible
  // cards from firing at the same time and making stage 01 flash briefly.
  const stageEls=[...document.querySelectorAll('.sequence-step')];
  let stageTick=false;
  function updateStageFromScroll(){
    stageTick=false;
    const readingLine=window.innerHeight*.60;
    let candidate=0;
    stageEls.forEach((el,i)=>{const r=el.getBoundingClientRect();if((r.top+r.height/2)<=readingLine)candidate=i});
    showStage(candidate,'scroll');
  }
  window.addEventListener('scroll',()=>{if(!stageTick){stageTick=true;requestAnimationFrame(updateStageFromScroll)}},{passive:true});
  window.addEventListener('resize',()=>{if(!stageTick){stageTick=true;requestAnimationFrame(updateStageFromScroll)}});
  stageImg.addEventListener('click',()=>openModal(stageImg.src,stageTitle.textContent));

  const pins=document.getElementById('pins'),analysisTitle=document.getElementById('analysisTitle'),analysisText=document.getElementById('analysisText');COMMON.analysis.forEach((a,i)=>{const p=document.createElement('button');p.className='pin';p.style.left=a.x+'%';p.style.top=a.y+'%';p.setAttribute('aria-label',a.title);p.addEventListener('click',()=>{analysisTitle.textContent=a.title;analysisText.textContent=a.text;log('analysis_pin',{id:a.id})});pins.appendChild(p);if(i===0){analysisTitle.textContent=a.title;analysisText.textContent=a.text}});

  const acc=document.getElementById('accordion');D.evidence.forEach((e,i)=>{const item=document.createElement('div');item.className='acc-item';item.innerHTML=`<button class="acc-btn"><div class="acc-index">0${i+1}</div><div class="acc-title">${e[0]}</div><div class="acc-mark">+</div></button><div class="acc-panel"><div><div class="acc-panel-inner"><p>${e[1]}</p><div class="evidence-meta"><span class="tag">Technical reconstruction</span><span class="tag">Archived evidence</span></div></div></div></div>`;const btn=item.querySelector('.acc-btn'),panel=item.querySelector('.acc-panel'),mark=item.querySelector('.acc-mark');btn.addEventListener('click',()=>{const open=panel.classList.toggle('open');mark.textContent=open?'−':'+';log('evidence_toggle',{index:i+1,open,title:e[0]})});acc.appendChild(item)});

  setText('finalTitle',D.label);setText('finalText',D.final);setText('finalNat',D.natural+'%');setText('finalHum',D.human+'%');setText('finalFatalities',COMMON.fatalities);setText('finalVolume',COMMON.volume);
  document.querySelectorAll('.photo-open').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.image,b.dataset.title)));

  const sections=[...document.querySelectorAll('.dossier-section')],progressText=document.getElementById('progressText');
  const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.32){const step=+e.target.dataset.step;progressText.textContent=`0${step} / 05`;document.querySelectorAll('[data-progress]').forEach((p,i)=>p.classList.toggle('active',i<step));log('section_seen',{id:e.target.id,step})}})},{threshold:[.32]});sections.forEach(s=>sectionObserver.observe(s));
  document.querySelectorAll('.continue-link').forEach(a=>a.addEventListener('click',()=>log('continue_link',{target:a.getAttribute('href')})));
  let start=Date.now();document.addEventListener('visibilitychange',()=>log('visibility',{state:document.visibilityState,elapsed:Date.now()-start}));window.addEventListener('beforeunload',()=>log('session_end',{elapsed:Date.now()-start}));log('load');
}
function openModal(src,title){const m=document.getElementById('modal');m.classList.add('open');document.getElementById('modalImg').src=src;document.getElementById('modalTitle').textContent=title;log('image_zoom',{title})}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.addEventListener('DOMContentLoaded',()=>{render();document.getElementById('modalClose').addEventListener('click',closeModal);document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()})});