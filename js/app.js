(()=>{'use strict';
const K='forge-metal-v1',SK='forge-active-session-v1',$=x=>document.getElementById(x),today=()=>new Date().toISOString().slice(0,10),now=()=>Date.now();
const seed=[{id:'a',name:'A — Peito + Bíceps',desc:'Panobianco • foco em força e hipertrofia',ex:[['Supino reto',4,12],['Supino inclinado',4,12],['Chest press',3,12],['Rosca no cross',3,12]]},{id:'b',name:'B — Inferiores',desc:'Academia do condomínio • controle e técnica',ex:[['Cadeira extensora',3,15],['Mesa flexora',3,15],['Panturrilha',3,15]]},{id:'c',name:'C — Costas + Ombros + Tríceps',desc:'Panobianco • volume equilibrado',ex:[['Puxada frontal',3,12],['Remada baixa',3,12],['Elevação lateral',3,15],['Tríceps corda',3,12]]}];
let d;try{d=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}if(!d||typeof d!=='object')d={workouts:seed,history:[]};if(!Array.isArray(d.workouts))d.workouts=seed;if(!Array.isArray(d.history))d.history=[];if(!Array.isArray(d.measurements))d.measurements=[];if(!Array.isArray(d.exerciseLogs))d.exerciseLogs=[];if(!d.exerciseLibrary||typeof d.exerciseLibrary!=='object')d.exerciseLibrary={};d.workouts=d.workouts.map((w,i)=>({...w,id:w.id||'w'+i,ex:Array.isArray(w.ex)?w.ex:[]}));const save=()=>localStorage.setItem(K,JSON.stringify(d));save();

function downloadBackup(){
 const payload={app:'POWERSET',format:1,createdAt:new Date().toISOString(),data:d,activeSession:localStorage.getItem(SK)||null};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');
 a.href=url;a.download='powerset-backup-'+new Date().toISOString().slice(0,10)+'.json';
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 toast('Backup exportado. Confira o app Arquivos do iPhone.');
}
$('export-backup').onclick=downloadBackup;
$('import-backup').onclick=()=>$('backup-file').click();
$('backup-file').onchange=async e=>{
 const file=e.target.files&&e.target.files[0];if(!file)return;
 try{
  const payload=JSON.parse(await file.text());
  if(!['FORGE','POWERSET'].includes(payload.app)||!payload.data||!Array.isArray(payload.data.workouts))throw new Error('Arquivo não reconhecido como backup FORGE.');
  if(!confirm('Importar este backup e substituir os dados locais deste FORGE? Um backup dos dados atuais será baixado antes.')){e.target.value='';return}
  downloadBackup();
  localStorage.setItem(K,JSON.stringify(payload.data));
  if(payload.activeSession)localStorage.setItem(SK,payload.activeSession);else localStorage.removeItem(SK);
  alert('Backup importado. O FORGE será recarregado.');location.reload();
 }catch(err){alert('Não foi possível importar: '+err.message)}
 e.target.value='';
};

const exKey=n=>String(n||'').trim().toLocaleLowerCase('pt-BR');
const profile=n=>d.exerciseLibrary[exKey(n)]||{};
let profileTarget='';
function videoId(url){let s=String(url||'').trim();let m=s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);return m?m[1]:''}
function openExercise(n){profileTarget=n;let p=profile(n);$('info-name').textContent=n;$('info-content').innerHTML='';
const section=(title,value)=>{if(!value)return;let box=document.createElement('div');box.className='info-section';let b=document.createElement('b');b.textContent=title;let t=document.createElement('p');t.textContent=value;box.append(b,t);$('info-content').append(box)};
section('MÚSCULOS TRABALHADOS',p.muscles);section('EQUIPAMENTO',p.equipment);section('EXECUÇÃO',p.instructions);section('ERROS COMUNS',p.errors);section('MINHAS OBSERVAÇÕES',p.notes);
let id=videoId(p.video);if(id){let wrap=document.createElement('div');wrap.className='video-frame';let frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id;frame.title='Demonstração: '+n;frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;wrap.append(frame);$('info-content').append(wrap);let link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+id;link.target='_blank';link.rel='noopener';link.textContent='Abrir vídeo no YouTube ↗';link.className='video-link';$('info-content').append(link)}else{let note=document.createElement('p');note.className='muted';note.textContent='Nenhum vídeo associado. Você pode buscar uma demonstração e escolher seu link.';$('info-content').append(note)}
if(!p.muscles&&!p.equipment&&!p.instructions&&!p.errors&&!p.notes&&!id){let empty=document.createElement('p');empty.className='muted';empty.textContent='Esta ficha ainda não foi preenchida.';$('info-content').append(empty)}
$('exercise-info').showModal()}
function editExercise(n){profileTarget=n;let p=profile(n);$('form-ex-name').textContent=n;$('f-muscles').value=p.muscles||'';$('f-equipment').value=p.equipment||'';$('f-instructions').value=p.instructions||'';$('f-errors').value=p.errors||'';$('f-notes').value=p.notes||'';$('f-video').value=p.video||'';$('f-creator').value=p.creator||'';
let searches=$('video-searches');searches.innerHTML='';[['Paulo Muzy','Paulo Muzy execução '+n],['Léo Marinho','Léo Marinho execução '+n],['Renato Cariani','Renato Cariani execução '+n],['Outros profissionais','técnica execução correta '+n]].forEach(([label,q])=>{let b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(q),'_blank','noopener');searches.append(b)});$('exercise-edit').showModal()}
$('info-close').onclick=()=>$('exercise-info').close();$('info-edit').onclick=()=>{$('exercise-info').close();editExercise(profileTarget)};$('form-cancel').onclick=()=>$('exercise-edit').close();
$('exercise-form').onsubmit=e=>{e.preventDefault();let url=$('f-video').value.trim();if(url&&!videoId(url)){toast('Link do YouTube não reconhecido.');return}d.exerciseLibrary[exKey(profileTarget)]={muscles:$('f-muscles').value.trim(),equipment:$('f-equipment').value.trim(),instructions:$('f-instructions').value.trim(),errors:$('f-errors').value.trim(),notes:$('f-notes').value.trim(),video:url,creator:$('f-creator').value.trim()};save();$('exercise-edit').close();renderLibrary();toast('Ficha salva.');};
function allExerciseNames(){let names=[];d.workouts.forEach(w=>(w.ex||[]).forEach(x=>{if(x[0]&&!names.includes(x[0]))names.push(x[0])}));Object.keys(d.exerciseLibrary).forEach(k=>{if(!names.some(n=>exKey(n)===k))names.push(k)});return names}
function renderLibrary(){let root=$('library-list');if(!root)return;root.innerHTML='';let names=allExerciseNames();if(!names.length){root.textContent='Adicione exercícios aos seus treinos para montar sua biblioteca.';return}names.forEach(n=>{let p=profile(n),row=document.createElement('div');row.className='card library-row';let copy=document.createElement('div');copy.className='card-copy';let b=document.createElement('b');b.textContent=n;let sm=document.createElement('small');sm.textContent=p.video?'Vídeo associado'+(p.creator?' • '+p.creator:''):(p.instructions?'Ficha preenchida':'Ficha ainda não preenchida');copy.append(b,sm);let open=document.createElement('button');open.textContent='VER FICHA';open.onclick=()=>openExercise(n);let edit=document.createElement('button');edit.textContent='EDITAR';edit.onclick=()=>editExercise(n);row.append(copy,open,edit);root.append(row)})}

let active=null,chosen=null,editing=null,elapsed=null,restTick=null,remain=90,endAt=0;try{active=JSON.parse(localStorage.getItem(SK)||'null')}catch(e){}
const persist=()=>active?localStorage.setItem(SK,JSON.stringify(active)):localStorage.removeItem(SK),toast=t=>{let x=$('toast');x.textContent=t;x.style.display='block';setTimeout(()=>x.style.display='none',2200)},dateLabel=x=>x?new Date(x+'T12:00:00').toLocaleDateString('pt-BR'):'—';
function view(id){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('hidden',x.id!==id));window.scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{view(b.dataset.view);if(b.dataset.view==='analytics')renderAnalytics()});
function card(w){let x=document.createElement('div');x.className='card';x.innerHTML='<div class="letter"></div><div><b></b><small></small></div><b>›</b>';x.querySelector('.letter').textContent=(w.name.match(/[A-Z0-9]/)||['⚒'])[0];x.querySelector('b:nth-child(1)');x.children[1].querySelector('b').textContent=w.name;x.children[1].querySelector('small').textContent=w.ex.length+' exercícios'+(w.desc?' • '+w.desc:'');x.onclick=()=>detail(w.id);return x}
function render(){ $('total').textContent=d.history.length;let start=new Date();start.setDate(start.getDate()-((start.getDay()+6)%7));start.setHours(0,0,0,0);$('week').textContent=d.history.filter(h=>new Date((h.date||'')+'T12:00:00')>=start).length;$('home-list').innerHTML='';$('workout-list').innerHTML='';d.workouts.forEach(w=>{$('workout-list').append(card(w));if(d.workouts.indexOf(w)<3)$('home-list').append(card(w))});$('history').innerHTML='';[...d.history].reverse().slice(0,5).forEach(h=>{let e=document.createElement('div');e.className='card';e.innerHTML='<b></b><small></small>';e.querySelector('b').textContent=h.name;e.querySelector('small').textContent=dateLabel(h.date);$('history').append(e)});$('measure-list').innerHTML='';[...d.measurements].reverse().forEach(m=>{let e=document.createElement('div');e.className='card';e.textContent=dateLabel(m.date)+' • '+(m.weight??'—')+' kg • '+(m.fat??'—')+'% gordura';$('measure-list').append(e)});renderAnalytics()}

function allLogs(){
 const logs=Array.isArray(d.exerciseLogs)?d.exerciseLogs.slice():[];
 if(!logs.length&&Array.isArray(d.history))d.history.forEach(h=>{if(h.exerciseLogs)logs.push({date:h.date,workoutName:h.name,exercises:h.exerciseLogs})});
 return logs;
}
function muscleGroup(name){
 const p=profile(name),raw=String(p.muscles||'').toLocaleLowerCase('pt-BR');
 if(raw){
  const groups=[['Peito',['peitoral','peito']],['Costas',['dorsal','costas','latíssimo','trapézio']],['Ombros',['deltoide','ombro']],['Bíceps',['bíceps','biceps']],['Tríceps',['tríceps','triceps']],['Quadríceps',['quadríceps','quadriceps']],['Posterior de coxa',['posterior','isquiotibiais','femoral']],['Glúteos',['glúteo','gluteo']],['Panturrilhas',['panturrilha']],['Core',['abdômen','abdomen','core','abdominal']]];
  const found=groups.filter(g=>g[1].some(k=>raw.includes(k))).map(g=>g[0]);if(found.length)return found;
 }
 const n=String(name).toLocaleLowerCase('pt-BR');
 const rules=[['Peito',['supino','chest press','crucifixo','flexão']],['Costas',['puxada','remada','pulldown']],['Ombros',['elevação lateral','desenvolvimento','face pull']],['Bíceps',['rosca']],['Tríceps',['tríceps','triceps','francês','corda']],['Quadríceps',['extensora','agachamento','leg press']],['Posterior de coxa',['flexora','stiff','levantamento terra']],['Panturrilhas',['panturrilha']],['Glúteos',['abdutora','elevação pélvica','glúteo']]];
 const found=rules.filter(g=>g[1].some(k=>n.includes(k))).map(g=>g[0]);return found.length?found:['Não classificado'];
}
function svgLineChart(points,unit){
 if(!points.length)return '<p class="empty-state">Registre avaliações para visualizar a evolução.</p>';
 const w=620,h=190,pad=28,vals=points.map(x=>x.value),min=Math.min(...vals),max=Math.max(...vals),span=max-min||1;
 const coords=points.map((x,i)=>({x:pad+(points.length===1?(w-2*pad)/2:i*(w-2*pad)/(points.length-1)),y:h-pad-((x.value-min)/span)*(h-2*pad),label:x.label,value:x.value}));
 const path=coords.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ');
 return '<div class="chart-wrap"><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Gráfico de evolução"><path d="M'+pad+','+(h-pad)+' H'+(w-pad)+'" stroke="#49434e" fill="none"/><path d="'+path+'" stroke="#e33440" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+coords.map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="#e33440"><title>'+p.label+': '+p.value+' '+unit+'</title></circle>').join('')+coords.filter((p,i)=>i===0||i===coords.length-1||points.length<=4).map(p=>'<text x="'+p.x+'" y="'+(h-7)+'" fill="#aaa" font-size="10" text-anchor="middle">'+p.label+'</text>').join('')+'</svg></div><p class="chart-latest">Último registro: <b>'+coords[coords.length-1].value.toLocaleString('pt-BR')+' '+unit+'</b></p>';
}
function renderAnalytics(){
 const logs=allLogs(),sets=logs.flatMap(l=>(l.exercises||[]).flatMap(e=>(e.sets||[]).map(s=>({...s,name:e.name,date:l.date}))));
 const completed=sets.length,volume=sets.reduce((a,s)=>a+(Number(s.load)||0)*(Number(s.reps)||0),0);
 $('an-sessions').textContent=logs.length;$('an-sets').textContent=completed;$('an-volume').textContent=Math.round(volume).toLocaleString('pt-BR')+' kg';
 const since=new Date();since.setDate(since.getDate()-6);since.setHours(0,0,0,0);const recent=logs.filter(l=>l.date&&new Date(l.date+'T12:00:00')>=since);$('an-frequency').textContent=recent.length;
 const muscle={};sets.forEach(s=>muscleGroup(s.name).forEach(g=>{muscle[g]=(muscle[g]||0)+(Number(s.load)||0)*(Number(s.reps)||0)}));
 const mroot=$('muscle-volume');mroot.innerHTML='';const sorted=Object.entries(muscle).sort((a,b)=>b[1]-a[1]);
 if(!sorted.length)mroot.innerHTML='<p class="empty-state">Finalize treinos com séries marcadas para gerar o volume muscular.</p>';
 sorted.forEach(([name,val])=>{let row=document.createElement('div');row.className='bar-row';let label=document.createElement('div');label.className='bar-label';label.innerHTML='<span></span><b></b>';label.children[0].textContent=name;label.children[1].textContent=Math.round(val).toLocaleString('pt-BR')+' kg';let track=document.createElement('div');track.className='bar-track';let fill=document.createElement('div');fill.className='bar-fill';fill.style.width=(val/(sorted[0][1]||1)*100)+'%';track.append(fill);row.append(label,track);mroot.append(row)});
 const freq={};logs.forEach(l=>{if(l.date){let dt=new Date(l.date+'T12:00:00'),key=dt.toISOString().slice(0,10);freq[key]=(freq[key]||0)+1}});
 const froot=$('weekly-frequency');froot.innerHTML='';let days=[];for(let i=6;i>=0;i--){let dt=new Date();dt.setDate(dt.getDate()-i);let key=dt.toISOString().slice(0,10);days.push({key,label:dt.toLocaleDateString('pt-BR',{weekday:'short'}),value:freq[key]||0})}
 days.forEach(x=>{let col=document.createElement('div');col.className='freq-col';let n=document.createElement('b');n.textContent=x.value;let bar=document.createElement('div');bar.className='freq-bar';bar.style.height=(x.value?Math.min(90,24+x.value*22):5)+'px';let lab=document.createElement('small');lab.textContent=x.label;col.append(n,bar,lab);froot.append(col)});
 const measures=d.measurements.slice().sort((a,b)=>a.date.localeCompare(b.date));
 $('weight-chart').innerHTML=svgLineChart(measures.filter(x=>x.weight!==null&&x.weight!==undefined).map(x=>({label:x.date.slice(5),value:Number(x.weight)})),'kg');
 $('fat-chart').innerHTML=svgLineChart(measures.filter(x=>x.fat!==null&&x.fat!==undefined).map(x=>({label:x.date.slice(5),value:Number(x.fat)})),'%');
 const best={};sets.forEach(s=>{if(s.load!==null&&s.load!==undefined&&Number.isFinite(Number(s.load))){let k=s.name;if(!best[k]||Number(s.load)>best[k].load)best[k]={load:Number(s.load),reps:s.reps,date:s.date}}});
 const proot=$('personal-records');proot.innerHTML='';Object.entries(best).sort((a,b)=>b[1].load-a[1].load).slice(0,12).forEach(([name,v])=>{let row=document.createElement('div');row.className='record-row';let n=document.createElement('span');n.textContent=name;let val=document.createElement('b');val.textContent=v.load.toLocaleString('pt-BR')+' kg';row.append(n,val);proot.append(row)});
 if(!Object.keys(best).length)proot.innerHTML='<p class="empty-state">Seus recordes aparecerão após registrar séries com carga.</p>';
}

function addEditorRow(n,s,r){let row=document.createElement('div');row.className='row';let name=document.createElement('span');name.textContent=n;let a=document.createElement('input');a.type='number';a.min=1;a.value=s;let b=document.createElement('input');b.value=r;let del=document.createElement('button');del.type='button';del.textContent='×';del.onclick=()=>row.remove();row.dataset.name=n;row.append(name,a,b,del);$('rows').append(row)}
function editor(id){editing=id;let w=d.workouts.find(x=>x.id===id);$('wname').value=w?.name||'';$('wdesc').value=w?.desc||'';$('rows').innerHTML='';(w?.ex||[]).forEach(x=>addEditorRow(...x));$('edit').showModal()}
$('new').onclick=()=>editor();$('close').onclick=()=>$('edit').close();$('add').onclick=()=>{let n=$('ename').value.trim();if(!n)return toast('Informe o exercício.');addEditorRow(n,$('esets').value,$('ereps').value);$('ename').value=''};
$('workout-form').onsubmit=e=>{e.preventDefault();let w={id:editing||'w'+now(),name:$('wname').value.trim(),desc:$('wdesc').value.trim(),ex:[...$('rows').children].map(r=>[r.dataset.name,Number(r.querySelectorAll('input')[0].value)||3,r.querySelectorAll('input')[1].value||12])};if(editing){let i=d.workouts.findIndex(x=>x.id===editing);if(i>=0)d.workouts[i]=w}else d.workouts.push(w);save();$('edit').close();render();toast('Treino salvo.')};
function detail(id){chosen=id;let w=d.workouts.find(x=>x.id===id);$('dname').textContent=w.name;$('ddesc').textContent=w.desc||'';$('dex').innerHTML='';w.ex.forEach(x=>{let e=document.createElement('div');e.className='card';e.textContent=x[0]+' • '+x[1]+' × '+x[2];e.onclick=()=>openExercise(x[0]);$('dex').append(e)});$('detail').showModal()}
$('dclose').onclick=()=>$('detail').close();
function lastExercise(name){for(let i=d.history.length-1;i>=0;i--){let x=(d.history[i].exerciseLogs||[]).find(y=>y.name===name);if(x)return x}return null}
$('start').onclick=()=>{let w=d.workouts.find(x=>x.id===chosen);if(active&&!confirm('Descartar a sessão anterior e iniciar outra?'))return;active={id:'s'+now(),workoutId:w.id,name:w.name,startedAt:now(),exercises:w.ex.map(x=>({name:x[0],targetSets:+x[1]||3,targetReps:String(x[2]||12),restSeconds:90,sets:Array.from({length:+x[1]||3},()=>({load:'',reps:String(x[2]||12),done:false}))}))};persist();$('detail').close();renderSession();view('session');runElapsed()};
function renderSession(){if(!active)return;$('session-name').textContent=active.name;let root=$('session-exercises');root.innerHTML='';active.exercises.forEach((ex,ei)=>{let box=document.createElement('article');box.className='exercise';let title=document.createElement('h3');title.textContent=(ei+1)+'. '+ex.name;let last=lastExercise(ex.name),sub=document.createElement('small');sub.textContent=last?'Último treino: '+last.sets.map(s=>(s.load??'—')+' kg × '+(s.reps??'—')).join(' / '):'Sem histórico deste exercício';let ficha=document.createElement('button');ficha.type='button';ficha.textContent='FICHA / VÍDEO';ficha.className='small-action';ficha.onclick=()=>openExercise(ex.name);box.append(title,sub,ficha);let head=document.createElement('div');head.className='sethead';['SÉRIE','CARGA KG','REPS','OK'].forEach(t=>{let s=document.createElement('span');s.textContent=t;head.append(s)});box.append(head);
ex.sets.forEach((s,i)=>{let row=document.createElement('div');row.className='setrow';let n=document.createElement('span');n.textContent=i+1;let load=document.createElement('input');load.type='number';load.step='.5';load.min=0;load.placeholder='kg';load.value=s.load;let reps=document.createElement('input');reps.type='number';reps.min=0;reps.placeholder='reps';reps.value=s.reps;let done=document.createElement('input');done.type='checkbox';done.checked=s.done;load.onchange=()=>{s.load=load.value;persist()};reps.onchange=()=>{s.reps=reps.value;persist()};done.onchange=()=>{s.done=done.checked;persist();if(s.done)rest(ex)};row.append(n,load,reps,done);box.append(row)});
let actions=document.createElement('div');actions.className='exercise-actions';let add=document.createElement('button');add.textContent='＋ SÉRIE';add.onclick=()=>{ex.sets.push({load:ex.sets.at(-1)?.load||'',reps:ex.targetReps,done:false});persist();renderSession()};let timer=document.createElement('button');timer.textContent='INICIAR DESCANSO';timer.onclick=()=>rest(ex);let pick=document.createElement('select');[60,90,120,150,180].forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent='Pausa '+v+'s';o.selected=(ex.restSeconds||90)===v;pick.append(o)});pick.onchange=()=>{ex.restSeconds=Number(pick.value);persist()};actions.append(add,pick,timer);box.append(actions);root.append(box)})}
function runElapsed(){clearInterval(elapsed);elapsed=setInterval(()=>{if(!active)return;let s=Math.floor((now()-active.startedAt)/1000);$('elapsed').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000)}
function rest(ex){remain=ex.restSeconds||90;endAt=now()+remain*1000;$('restname').textContent=ex.name;$('rest').showModal();updateClock();clearInterval(restTick);restTick=setInterval(()=>{remain=Math.max(0,Math.ceil((endAt-now())/1000));updateClock();if(!remain){clearInterval(restTick);if(navigator.vibrate)navigator.vibrate([180,80,180]);toast('Descanso concluído!')}},250)}
function updateClock(){$('clock').textContent=String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0')}
$('less').onclick=()=>{remain=Math.max(0,remain-15);endAt=now()+remain*1000;updateClock()};$('more').onclick=()=>{remain+=15;endAt=now()+remain*1000;updateClock()};$('skip').onclick=()=>{clearInterval(restTick);$('rest').close()};
$('leave').onclick=()=>view('workouts');
$('finish').onclick=()=>{if(!active)return;let count=active.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0);if(!count&&!confirm('Nenhuma série marcada. Finalizar mesmo assim?'))return;let logs=active.exercises.map(e=>({name:e.name,sets:e.sets.filter(s=>s.done).map(s=>({load:s.load===''?null:Number(s.load),reps:s.reps===''?null:Number(s.reps)}))}));let duration=Math.round((now()-active.startedAt)/1000);d.history.push({id:active.id,name:active.name,count:active.exercises.length,date:today(),durationSeconds:duration,completedSets:count,exerciseLogs:logs});d.exerciseLogs.push({sessionId:active.id,date:today(),workoutName:active.name,exercises:logs});save();active=null;persist();clearInterval(elapsed);clearInterval(restTick);$('rest').close();render();view('home');toast('Treino finalizado e salvo!')};
$('mdate').value=today();$('measure').onsubmit=e=>{e.preventDefault();let w=$('weight').value===''?null:+$('weight').value,f=$('fat').value===''?null:+$('fat').value;if(w===null&&f===null)return toast('Informe peso ou gordura corporal.');d.measurements.push({date:$('mdate').value,weight:w,fat:f});save();$('weight').value='';$('fat').value='';render();toast('Avaliação salva.')};
render();renderLibrary();if(active){renderSession();view('session');runElapsed()}
})();