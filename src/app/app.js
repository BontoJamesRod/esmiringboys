/* =========================================================
   Actions, rendering, routing, boot
   ========================================================= */
function render(){memo.clear();const root=$('#app');const main=$('#main');const keep=main&&S.prevView===S.view?main.scrollTop:0;const dr=$('.drawer-body');const keepD=dr?dr.scrollTop:0;
 if(!S.user){S.tour=null;drawTour();root.innerHTML=Login();return}
 if(S.view==='scanner'){root.innerHTML=Scanner();afterRender();return}
 root.innerHTML=Shell();const m2=$('#main');if(m2&&keep)m2.scrollTop=keep;const d2=$('.drawer-body');if(d2&&keepD)d2.scrollTop=keepD;afterRender()}
function afterRender(){maybeTour();initSig();if(S.view==='scanner'&&S.sc.screen==='scan')startCam();else stopCam()}
function refocus(id){const el=document.getElementById(id);if(el){el.focus();const v=el.value;try{el.setSelectionRange(v.length,v.length)}catch(e){}}}
function route(){const h=location.hash.slice(1)||'dashboard';S.drawer=null;S.modal=null;S.menu=false;S.nav=false;S.cmdk=null;
 if(!S.user){render();return}
 if(S.user.role==='volunteer'||h==='scanner')S.view='scanner';else S.view=can(h)?h:'dashboard';
 if(S.view==='walkin'&&(!S.wk||S.wk.mode!=='web'||S.wk.step===6))S.wk=newWalkin('web');
 render()}
function initSig(){const cv=$('#sig');if(!cv)return;const r=cv.getBoundingClientRect(),dp=window.devicePixelRatio||1;cv.width=r.width*dp;cv.height=r.height*dp;const x=cv.getContext('2d');x.scale(dp,dp);x.lineWidth=2.4;x.lineCap='round';x.lineJoin='round';x.strokeStyle=getComputedStyle(document.body).color;
 if(S.wk&&S.wk.sig){const im=new Image();im.onload=()=>x.drawImage(im,0,0,r.width,r.height);im.src=S.wk.sig}
 let down=false;const pt=e=>{const b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]};
 cv.onpointerdown=e=>{down=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}const [a,b]=pt(e);x.beginPath();x.moveTo(a,b)};
 cv.onpointermove=e=>{if(!down)return;const [a,b]=pt(e);x.lineTo(a,b);x.stroke();S.wk.signed=true};
 cv.onpointerup=cv.onpointercancel=()=>{if(down){down=false;S.wk.sig=cv.toDataURL()}}}
function copyText(text,title){const done=()=>toast('Copied. Paste into Excel, Google Sheets or a message.');try{navigator.clipboard.writeText(text).then(done).catch(()=>A.modal('copy',{text,title}))}catch(e){A.modal('copy',{text,title})}}
/* SheetJS loads only when someone imports an Excel file. 0.20.3 from the official
   SheetJS CDN: the 0.18.5 build on cdnjs/npm has known security issues (CVE-2023-30533, CVE-2024-22363). */
function loadXLSX(){return new Promise((res,rej)=>{if(window.XLSX)return res();const s=document.createElement('script');s.src='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
function applyTheme(){const th=S.theme;if(th==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=th;
 const dark=th==='dark'||(th==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=dark?'#1A1A18':'#12355B'}
/* Re-render without losing what the user typed in other fields of the current page. */
function renderKeepForm(){const vals=[...document.querySelectorAll('#main [id]')].filter(e=>/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)&&e.type!=='file').map(e=>[e.id,e.type==='checkbox'?e.checked:e.value]);
 render();vals.forEach(([id,v])=>{const e=document.getElementById(id);if(!e)return;if(e.type==='checkbox')e.checked=v;else e.value=v})}
let hhQT=0;
function autoNeeds(m){const a=ageOf(m.birth);m.needs=m.needs.filter(n=>n!=='SENIOR'&&n!=='INFANT');if(a!=null&&a>=60)m.needs.push('SENIOR');if(a!=null&&a<2)m.needs.push('INFANT')}
function nextCode(b){let mx=0;const re=new RegExp(`^ALB-${b.code}-(\\d{6})$`);DB.households.forEach(h=>{const m=h.code.match(re);if(m)mx=Math.max(mx,+m[1])});return mx+1}
function afterScan(msg){save();toast(`${msg}. ${S.online?'Uploaded.':'Saved on this phone.'}`,S.online?'ok':'warn');render()}

const A={
 /* session */
 login(e){e.preventDefault();const v=$('#lg-user').value.trim().toLowerCase();const u=DB.users.find(x=>x.status==='Active'&&(x.email.toLowerCase()===v||x.email.split('@')[0].toLowerCase()===v));
  if(!u||!$('#lg-pass').value){$('#lg-err').textContent='No active account matches that email. Use one of the demo accounts below.';return}A.enter(u)},
 demo(id){A.enter(userById(id))},
 enter(u){S.user=u;S.brgy=u.brgy==='all'?'all':u.brgy;S.sel=new Set();try{sessionStorage.setItem('kid-user',u.id)}catch(e){}u.lastAt=Date.now();audit('logged in',u.role==='volunteer'?'Scanner app':'Web dashboard',u.role==='volunteer'?ME:'Web');save();
  const h=location.hash.slice(1);if(u.role==='volunteer'){if(h!=='scanner')location.hash='scanner';else route()}else{const v=can(h)||h==='scanner'?h:'dashboard';if(h!==v)location.hash=v;else route()}},
 logout(){stopCam();S.tour=null;S.user=null;S.menu=false;S.drawer=null;S.modal=null;S.cmdk=null;S.wk=null;S.imp=null;S.sel=new Set();S.tabs={};try{sessionStorage.removeItem('kid-user')}catch(e){}flush();if(location.hash)location.hash='';render()},
 go(v){S.menu=false;S.cmdk=null;if(location.hash.slice(1)===v)route();else location.hash=v},
 nav(o){if(S.nav!==o){S.nav=o;render()}},
 /* guided tour */
 tour(name){if(name==='phone'&&S.view!=='scanner')return;S.menu=false;S.tour=null;render();startTour(name||tourHere()||(S.view==='scanner'?'phone':'web'))},
 tourGo(d){const T=S.tour;if(!T)return;const i=T.i+d;if(i>=T.steps.length){A.tourEnd();return}T.i=Math.max(0,i);drawTour()},
 tourEnd(){if(S.tour){markTour(S.tour.name);S.tour=null;drawTour()}},
 menu(which){S.menu=which&&S.menu!==which?which:false;render()},
 size(k){S.size=k;try{k==='m'?localStorage.removeItem('kid-size'):localStorage.setItem('kid-size',k)}catch(e){}applySize();render()},
 theme(v){S.theme=v;try{v==='system'?localStorage.removeItem('kid-theme'):localStorage.setItem('kid-theme',v)}catch(e){}applyTheme();render()},
 /* tabs: local tabs only toggle visibility (forms keep every field); others re-render */
 tab(group,key,local){S.tabs[group]=key;
  if(!local){const dr=$('.drawer-body');render();const d2=$('.drawer-body');if(d2&&dr)d2.scrollTop=0;return}
  document.querySelectorAll(`[data-tabs="${group}"] button`).forEach(b=>{const on=b.dataset.k===key;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  document.querySelectorAll(`[data-panel^="${group}:"]`).forEach(p=>{p.hidden=p.dataset.panel!==`${group}:${key}`})},
 /* command palette */
 cmdk(open){S.menu=false;S.cmdk=open?{q:'',i:0}:null;render();if(open)refocus('cmdk-q')},
 cmdkQ(v){S.cmdk.q=v;S.cmdk.i=0;const el=$('#cmdk-list');if(el)el.innerHTML=cmdkList()},
 cmdkHover(i){if(S.cmdk.i===i)return;S.cmdk.i=i;const el=$('#cmdk-list');if(el)el.innerHTML=cmdkList()},
 cmdkKey(e){const n=cmdkResults().length;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!n)return;S.cmdk.i=(S.cmdk.i+(e.key==='ArrowDown'?1:-1)+n)%n;const el=$('#cmdk-list');el.innerHTML=cmdkList();const on=el.querySelector('.on');if(on)on.scrollIntoView({block:'nearest'})}
  else if(e.key==='Enter'){e.preventDefault();A.cmdkRun(S.cmdk.i)}},
 cmdkRun(i){const x=cmdkResults()[i];if(!x)return;S.cmdk=null;x.run();if(!S.cmdk&&$(".cmdk"))render()},
 brgy(v){S.brgy=v;S.hf.page=0;S.sel=new Set();render()},
 lang(v){DB.settings.lang=v;save();render()},
 range(v){S.range=v;render()},
 open(kind,id){A.drawer(kind,id)},
 drawer(kind,id){S.drawer={kind,id};delete S.tabs[kind];S.centerQ='';render()},
 close(){S.drawer=null;render()},
 centerQ(v){S.centerQ=v;render();refocus('ctr-q')},
 modal(kind,data){S.modal={kind,data:data||{}};render();setTimeout(()=>{const f=document.querySelector('.modal input:not([type=checkbox]):not([type=radio]),.modal textarea,.modal select');if(f)f.focus()},30)},
 closeModal(){S.modal=null;render()},
 /* households */
 openHH(id){const h=hh(id);if(!h)return;S.modal=null;S.cmdk=null;S.drawer={kind:'hh',id};delete S.tabs.hh;audit('viewed',h.code);save();render()},
 hhQ(v){S.hf.q=v;S.hf.page=0;clearTimeout(hhQT);hhQT=setTimeout(()=>{const el=$('#hh-results');if(el)el.innerHTML=hhResults()},120)},
 hhClear(){S.hf={q:'',status:'all',need:'all',purok:'all',page:0};render()},
 hhF(k,v){S.hf[k]=v;S.hf.page=0;render()},
 hhPage(p){S.hf.page=p;$('#hh-results').innerHTML=hhResults();$('#main').scrollTop=0},
 sel(id,on){on?S.sel.add(id):S.sel.delete(id);$('#hh-results').innerHTML=hhResults()},
 selPage(on){const list=hhList(),rows=list.slice(S.hf.page*25,(S.hf.page+1)*25);rows.forEach(h=>on?S.sel.add(h.id):S.sel.delete(h.id));$('#hh-results').innerHTML=hhResults()},
 clearSel(){S.sel=new Set();$('#hh-results').innerHTML=hhResults()},
 saveHH(id){const h=hh(id);h.location=$('#e-loc').value.trim()||h.location;h.phone=$('#e-ph').value.trim();const p=$('#e-p').value;h.purok=p?Number(p):h.purok;
  h.members.forEach((m,i)=>{m.name=$('#e-n'+i).value.trim()||m.name;m.birth=$('#e-b'+i).value||m.birth;m.sex=$('#e-s'+i).value;if(!m.head)m.rel=$('#e-r'+i).value.trim()||m.rel;m.needs=Object.keys(NEEDS).filter(n=>$(`#e-${n}-${i}`).checked)});
  const nn=$('#e-new').value.trim();if(nn){const m={id:nid('m'),name:nn,birth:$('#e-newb').value||null,sex:'',rel:'Member',head:false,needs:[],note:''};autoNeeds(m);h.members.push(m)}
  SEARCH.delete(h);audit('edited',h.code);save();S.modal=null;toast('Household updated.');render()},
 reissue(id){const h=hh(id),old=cardOf(h),now=Date.now(),why=$('#ri-r').value;if(old){old.status=why;old.deactivatedAt=now}
  const c={id:nid('k'),hh:h.id,token:randHex(20),status:'Active',issuedAt:now,printed:false,digital:false,deactivatedAt:null};DB.cards.push(c);h.card=c.id;audit('reissued card',`${h.code} (old card ${why.toLowerCase()})`);save();S.modal=null;toast('New card issued and added to the print queue. The old QR is now rejected.');render()},
 deactivate(id){const h=hh(id),c=cardOf(h);if(c){c.status='Deactivated';c.deactivatedAt=Date.now()}h.card=null;audit('deactivated card',h.code);save();S.modal=null;toast('Card deactivated.');render()},
 archive(id){const h=hh(id),c=cardOf(h);h.status='archived';if(c){c.status='Deactivated';c.deactivatedAt=Date.now()}const ci=activeCheckin(h.id);if(ci)ci.outAt=Date.now();audit('archived',h.code);save();S.modal=null;S.drawer=null;toast(`${h.code} archived.`);render()},
 verify(id){const h=hh(id);h.status='verified';h.infoRequested='';if(!h.consentAt){h.consentAt=Date.now();h.consentBy=S.user.name}audit('verified',h.code);save();toast(`${h.code} verified.`);render()},
 requestInfo(id){const h=hh(id);h.infoRequested=$('#ri-note').value.trim()||'More details needed';audit('requested info',h.code);save();S.modal=null;toast('Request saved. The household stays in the queue.');render()},
 reject(id){const r=$('#rj-r').value.trim();if(!r){$('#rj-err').textContent='Write a reason. It is kept in the audit log.';return}const h=hh(id),c=cardOf(h);h.status='inactive';h.rejectReason=r;if(c){c.status='Deactivated';c.deactivatedAt=Date.now()}audit('rejected',`${h.code}: ${r}`);save();S.modal=null;toast(`${h.code} rejected.`,'warn');render()},
 mergeQ(v){S.modal.data.q=v;S.modal.data.target=null;render();refocus('mg-q')},
 merge(id){const tid=S.modal.data.target;if(!tid){toast('Choose the household to merge into.','warn');return}const w=hh(id),tg=hh(tid);const keys=new Set(tg.members.map(m=>norm(m.name)+'|'+m.birth));
  w.members.forEach(m=>{if(!keys.has(norm(m.name)+'|'+m.birth))tg.members.push({...m,head:false,rel:m.head?'Relative':m.rel})});
  DB.checkins.forEach(c=>{if(c.hh===w.id)c.hh=tg.id});DB.dists.forEach(d=>{if(d.hh===w.id)d.hh=tg.id});
  const c=cardOf(w);if(c){c.status='Deactivated';c.deactivatedAt=Date.now()}w.status='merged';w.mergedInto=tg.id;SEARCH.delete(tg);audit('merged',`${w.code} into ${tg.code}`);save();S.modal=null;toast(`Merged into ${tg.code}.`);render()},
 /* import */
 impFile(f){if(!f)return;const I=S.imp;I.brgy=$('#imp-brgy')?$('#imp-brgy').value:I.brgy;I.err='';
  if(/\.xlsx?$/i.test(f.name)){f.arrayBuffer().then(buf=>loadXLSX().then(()=>{const wb=XLSX.read(buf,{type:'array',cellDates:true});const ws=wb.Sheets[wb.SheetNames[0]];const rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:''}).map(r=>r.map(v=>v instanceof Date?new Date(v.getTime()-v.getTimezoneOffset()*6e4).toISOString().slice(0,10):String(v)));A.impLoad(rows,f.name)})).catch(()=>{I.err='Could not read the Excel file here. Save it as CSV and upload again.';render()})}
  else f.text().then(tx=>A.impLoad(parseCSV(tx),f.name))},
 impSample(){S.imp.brgy=$('#imp-brgy')?$('#imp-brgy').value:'b1';A.impLoad(parseCSV(sampleCSV()),'sample-barangay-records.csv')},
 impLoad(rows,name){const I=S.imp;if(!rows||rows.length<2){I.err='The file needs a header row and at least one record.';render();return}
  const headers=rows[0].map(x=>String(x).trim()),used=new Set(),map={};IFIELDS.forEach(([k,,,re])=>{const i=headers.findIndex((h,j)=>!used.has(j)&&re.test(h)&&!(k==='name'&&/house|hh/i.test(h)));map[k]=i>=0?i:'';if(i>=0)used.add(i)});
  Object.assign(I,{step:2,file:name,headers,rows:rows.slice(1),map,brgy:I.brgy||'b1'});render()},
 impMap(k,v){S.imp.map[k]=v===''?'':Number(v)},
 impPreview(){const I=S.imp;const miss=IFIELDS.filter(([k,,req])=>req&&I.map[k]==='').map(f=>f[1]);if(miss.length){$('#map-err').textContent=`Match these required fields: ${miss.join(', ')}.`;return}importAnalyze();I.step=3;render()},
 impStep(n){S.imp.step=n;render()},
 impReset(){S.imp={step:1,brgy:S.imp.brgy};render()},
 impConfirm(){const I=S.imp,p=importPlan(),b=brgyOf(I.brgy);let num=nextCode(b),members=0;const now=Date.now();
  p.create.forEach(g=>{const head=g.find(o=>/head/i.test(o.rel));const ordered=[head,...g.filter(o=>o!==head)];const purok=Number(head.purok)||null;
   const h={id:nid('h'),code:`ALB-${b.code}-${pad(num++,6)}`,brgy:b.id,purok,location:head.address||(purok?`Purok ${purok}, Brgy. ${b.name}`:`Brgy. ${b.name}`),phone:head.phone,status:'imported',source:'import',createdAt:now,createdBy:S.user.name,device:'Web',consentAt:null,consentBy:null,note:'',infoRequested:'',
    members:ordered.map(o=>{const m={id:nid('m'),name:o.name,birth:o.birth,sex:o.sex==='F'||o.sex==='M'?o.sex:'',rel:o===head?'Head':o.rel,head:o===head,needs:o.needs.slice(),note:''};const a=ageOf(m.birth);if(a>=60&&!m.needs.includes('SENIOR'))m.needs.push('SENIOR');if(a<2&&!m.needs.includes('INFANT'))m.needs.push('INFANT');return m})};
   const c={id:nid('k'),hh:h.id,token:randHex(20),status:'Active',issuedAt:now,printed:false,digital:false,deactivatedAt:null};DB.cards.push(c);h.card=c.id;DB.households.push(h);members+=h.members.length});
  HHM=null;I.result={created:p.create.length,members,linked:p.link.length,linkedCodes:p.link.map(h=>h.code),errors:p.skip};audit('imported',`${p.create.length} households into ${b.name} from ${I.file}`);save();I.step=5;render()},
 /* walk-in */
 startWalkin(mode){S.wk=newWalkin(mode);if(mode==='mobile'){S.sc.screen='walkin';render()}else A.go('walkin')},
 wkCancel(){const mob=S.wk&&S.wk.mode==='mobile';S.wk=null;if(mob)A.sc('home');else A.go('households')},
 wkM(i,k,v){const m=S.wk.m[i];m[k]=v;if(k==='birth')autoNeeds(m)},
 wkAdd(){S.wk.m.push({name:'',birth:'',sex:'',rel:'Son',needs:[],note:''});render();refocus('wm-n'+(S.wk.m.length-1))},
 wkDel(i){S.wk.m.splice(i,1);render()},
 wkNeed(i,n){const m=S.wk.m[i];m.needs=m.needs.includes(n)?m.needs.filter(x=>x!==n):[...m.needs,n];render()},
 sigClear(){S.wk.sig=null;S.wk.signed=false;render()},
 wkStep(d){const W=S.wk;W.err='';if(d>0){
   if(W.step===1){if(!W.m[0].name.trim())W.err='Enter the head of family\'s full name.';else if(!W.m[0].birth)W.err='Enter the head of family\'s birthdate. It is used to check for an existing record.';else{const bad=W.m.findIndex((m,i)=>i>0&&!m.name.trim());if(bad>0)W.err=`Add a name for member ${bad+1} or remove that row.`}}
   if(W.step===3&&!W.location.trim())W.err='Write where the family is staying now. A landmark is enough.';
   if(W.step===4&&!W.consent)W.err='Consent is needed before saving. Read the text to the head of family.';}
  if(!W.err)W.step=Math.max(1,Math.min(5,W.step+d));render();const b=$('#ph-body');if(b)b.scrollTop=0;else{const m=$('#main');if(m)m.scrollTop=0}},
 wkSave(force){const W=S.wk;if(!force){const idx=memberIndex();for(const m of W.m){if(!m.birth||!m.name.trim())continue;const x=idx.get(norm(m.name)+'|'+m.birth);if(x){A.modal('dup',{match:x.id,name:m.name,birth:fmtDate(new Date(m.birth+'T00:00:00'))});return}}}
  const b=brgyOf(W.brgy),mob=W.mode==='mobile',now=Date.now();const n=DB.wseq[b.id]=(DB.wseq[b.id]||1);DB.wseq[b.id]=n+1;const code=`ALB-${b.code}-W${pad(n,5)}`;
  const h={id:nid('h'),code,brgy:b.id,purok:W.purok?Number(W.purok):null,location:W.location.trim(),phone:W.phone.trim(),status:'pending',source:'walkin',createdAt:now,createdBy:S.user.name,device:mob?ME:'Web',consentAt:now,consentBy:S.user.name+(W.signed?' (signed)':''),note:'',infoRequested:'',synced:mob?false:undefined,
   members:W.m.map((m,i)=>({id:nid('m'),name:m.name.trim(),birth:m.birth||null,sex:m.sex,rel:i===0?'Head':m.rel,head:i===0,needs:[...m.needs],note:m.note||''}))};
  if(!mob)delete h.synced;
  const c={id:nid('k'),hh:h.id,token:randHex(20),status:'Active',issuedAt:now,printed:false,digital:mob,deactivatedAt:null};DB.cards.push(c);h.card=c.id;DB.households.push(h);HHM=null;
  audit('created',`Walk-in ${code}`,mob?ME:'Web');S.modal=null;W.step=6;W.doneId=h.id;
  if(mob){queue('walkin',`Walk-in ${code} (${h.members.length} people)`,{kind:'households',id:h.id});const cid=DB.me.center;if(cid){const ci={id:nid('ci'),hh:h.id,center:cid,inAt:now,outAt:null,device:ME,synced:false};DB.checkins.push(ci);queue('checkin',`Checked in ${code} to ${centerOf(cid).name}`,{kind:'checkins',id:ci.id})}}
  save();toast(`Card ${code} issued.`);render()},
 wkLink(id){const mob=S.wk&&S.wk.mode==='mobile';S.modal=null;S.wk=null;audit('linked duplicate',hh(id).code);save();toast('Linked to the existing household. No new card issued.');if(mob)A.scOpen(id);else{location.hash='households';setTimeout(()=>A.openHH(id),0)}},
 /* cards */
 cardScope(v){if(!v)return;S.cardScope=v;render()},
 reprint(code){const h=hhByCode(code);if(!h){toast('No household has that ID. Check the code and try again.','warn');return}S.sel.add(h.id);S.cardScope='selected';render()},
 printCards(ids){const list=(ids?ids.map(hh):cardScopeList()).filter(Boolean).slice(0,200);if(!list.length)return;const sheet=$('#print-sheet');
  sheet.innerHTML=list.map(h=>cardFront(h,cardOf(h))).join('')+list.map(h=>cardBack(h,cardOf(h))).join('');document.body.classList.add('printing-cards');audit('printed',`${plural(list.length,'card')}`);save();
  try{window.print()}catch(e){}setTimeout(()=>document.body.classList.remove('printing-cards'),800);toast('Print started. If no dialog opened, open the app file in Chrome or Edge to print.','info')},
 markPrinted(){const l=cardScopeList();l.forEach(h=>{const c=cardOf(h);if(c){c.printed=true;c.digital=false}});audit('printed',`Marked ${plural(l.length,'card')} as printed`);save();toast(`${plural(l.length,'card')} marked as printed.`);render()},
 /* centers */
 addCenter(){const n=$('#c-n').value.trim(),cap=+$('#c-cap').value;if(!n||!(cap>0)){$('#c-err').textContent='Enter a name and a capacity above 0.';return}
  DB.centers.push({id:nid('c'),brgy:$('#c-b').value,name:n,location:$('#c-l').value.trim(),capacity:cap,status:'Open',contact:$('#c-ct').value.trim()||'—'});audit('created',`Center ${n}`);save();S.modal=null;toast('Center added.');render()},
 centerStatus(id){const c=centerOf(id);c.status=c.status==='Closed'?'Open':'Closed';audit('edited',`${c.name} set to ${c.status}`);save();render()},
 webCheckout(ciId){const ci=DB.checkins.find(c=>c.id===ciId);ci.outAt=Date.now();audit('checked out',hh(ci.hh).code);save();toast('Checked out.');render()},
 /* inventory */
 addItem(){const n=$('#it-n').value.trim(),u=$('#it-u').value.trim();if(!n||!u){$('#it-err').textContent='Enter the item name and unit.';return}
  const it={id:nid('i'),name:n,category:$('#it-c').value,unit:u,stock:Math.max(0,+$('#it-s').value||0),reorder:Math.max(0,+$('#it-r').value||0),updatedAt:Date.now()};DB.items.push(it);if(it.stock)DB.moves.push({id:nid('mv'),item:it.id,type:'IN',qty:it.stock,source:'Starting stock',at:Date.now(),user:S.user.name});audit('created',`Relief item ${n}`);save();S.modal=null;toast('Item added.');render()},
 stock(type){const it=itemOf($('#sk-i').value),q=Math.floor(+$('#sk-q').value),src=$('#sk-s').value.trim();if(!(q>0)){$('#sk-err').textContent='Enter a quantity above 0.';return}if(!src){$('#sk-err').textContent=type==='IN'?'Enter the source of the stock.':'Enter the reason for the adjustment.';return}
  if(type==='OUT'&&q>it.stock){$('#sk-err').textContent=`Only ${fmtN(it.stock)} on hand.`;return}const d=$('#sk-d').value;const at=d&&d!==today()?new Date(d+'T12:00:00').getTime():Date.now();
  it.stock+=type==='IN'?q:-q;it.updatedAt=Date.now();DB.moves.push({id:nid('mv'),item:it.id,type,qty:q,source:type==='OUT'?'Adjustment: '+src:src,at,user:S.user.name});audit('edited',`${it.name} stock ${type==='IN'?'+':'−'}${q}`);save();S.modal=null;toast(`${it.name}: ${fmtN(it.stock)} on hand.`);render()},
 /* rounds */
 roundHint(){const it=itemOf($('#rd-i').value),cid=$('#rd-c').value,q=+$('#rd-q').value||1;if(!cid){$('#rd-hint').innerHTML='';return}const n=activeAt(cid).length,need=n*q;
  $('#rd-hint').innerHTML=`<div class="alert ${need>it.stock?'warn':'info'}">${icon(need>it.stock?'alert':'info',16)}<span>${plural(n,'household')} checked in now · needs about ${fmtN(need)} ${it.unit}s · ${fmtN(it.stock)} in stock${need>it.stock?'. Not enough stock for everyone.':'.'}</span></div>`},
 addRound(){const cid=$('#rd-c').value;if(!cid){toast('Open a center first.','warn');return}const d=$('#rd-d').value;const r={id:nid('rd'),code:`R-${pad(DB.nextRound++,4)}`,center:cid,item:$('#rd-i').value,qty:Math.max(1,+$('#rd-q').value||1),dateAt:d===today()?Date.now():new Date(d+'T06:00:00').getTime(),status:'Open'};
  DB.rounds.push(r);audit('created',`Distribution round ${r.code} (${itemOf(r.item).name})`);save();S.modal=null;S.drawer={kind:'round',id:r.id};toast(`${r.code} created. Scanners at this center can select it now.`);render()},
 closeRound(id){const r=roundOf(id);r.status='Closed';if(DB.me.round===id)DB.me.round=null;audit('edited',`Closed round ${r.code}`);save();render()},
 copyRoundList(id){const r=roundOf(id),served=new Set(roundDists(id).map(d=>d.hh));const ns=[...roundTarget(r)].filter(x=>!served.has(x)).map(hh);copyText(csvOf(['Household ID','Head of family','Members'],ns.map(h=>[h.code,headOf(h).name,h.members.length])),`${r.code} not yet served`);audit('exported',`${r.code} not-served list`)},
 /* reports */
 rep(k){S.rep=k;render()},
 copyReport(){const [title,fn]=REPORTS[S.rep];const r=fn();copyText(csvOf(r.cols,r.rows),title);audit('exported',`${title} (CSV, ${r.rows.length} rows)`);save()},
 printReport(){const [title]=REPORTS[S.rep];audit('exported',`${title} (print/PDF)`);save();try{window.print()}catch(e){}toast('Print started. Choose Save as PDF for a file. If no dialog opened, open the app file in your browser.','info')},
 /* devices */
 forceSync(id){if(id===ME){syncNow();render();return}const d=deviceOf(id);if(d.status==='Offline'){toast(`Sync request sent. ${id} will upload when it gets signal.`,'info');return}
  let n=0,conf=0;['checkins','dists','households'].forEach(k=>DB[k].forEach(r=>{if(r.synced===false&&r.device===id){conf+=accept(r,k,id);n++}}));d.lastSyncAt=Date.now();DB.syncErrors.forEach(e=>{if(e.device===id&&e.kind==='timeout')e.resolved=true});audit('synced',`${id}: ${plural(n,'record')}`,id);save();
  toast(conf?`${id} uploaded ${plural(n,'record')}. ${plural(conf,'possible double claim')} flagged.`:`${id} uploaded ${plural(n,'record')}.`,conf?'warn':'ok');render()},
 revoke(id){const d=deviceOf(id);d.status='Revoked';d.note='Revoked '+fmtDate(Date.now());audit('revoked device',`${id} ${d.name}`);save();S.modal=null;toast(`${id} revoked.`,'warn');render()},
 resolveErr(id){const e=DB.syncErrors.find(x=>x.id===id);e.resolved=true;audit('reviewed',e.msg.slice(0,60));save();render()},
 retryErr(id){A.forceSync(DB.syncErrors.find(x=>x.id===id).device)},
 /* users */
 saveUser(id){const n=$('#us-n').value.trim(),e=$('#us-e').value.trim(),r=$('#us-r').value;let b=$('#us-b').value;if(!n||!/.+@.+\..+/.test(e)){$('#us-err').textContent='Enter a name and a valid email.';return}if(r!=='admin'&&b==='all'){$('#us-err').textContent='Only admins can cover all barangays. Choose a barangay.';return}
  if(id){Object.assign(userById(id),{name:n,email:e,role:r,brgy:b});audit('edited',`User ${n}`)}else{DB.users.push({id:nid('u'),name:n,email:e,role:r,brgy:b,status:'Active',lastAt:null});audit('created',`User ${n} (${ROLE[r].short})`)}save();S.modal=null;toast('User saved.');render()},
 toggleUser(id){const u=userById(id);u.status=u.status==='Active'?'Disabled':'Active';audit(u.status==='Active'?'enabled user':'disabled user',u.name);save();render()},
 resetPw(id){const pw=randHex(4).toUpperCase()+'-'+randHex(4).toUpperCase();audit('reset password',userById(id).name);save();A.modal('pw',{id,pw})},
 /* audit */
 au(k,v){S.au[k]=v;S.au.page=0;render()},
 auPage(p){S.au.page=p;render();$('#main').scrollTop=0},
 /* settings */
 saveSettings(){const s=DB.settings;s.municipality=$('#st-mun').value.trim()||s.municipality;s.province=$('#st-prov').value.trim()||s.province;s.retention=$('#st-ret').value;s.consent=$('#st-consent').value.trim()||s.consent;s.lang=$('#st-lang').value;s.alertName=$('#st-an').value.trim()||s.alertName;s.alert=$('#st-al').value;
  DB.brgys.forEach(b=>{b.name=$('#st-bn-'+b.id).value.trim()||b.name;b.hall=$('#st-bh-'+b.id).value.trim()||b.hall});audit('edited','Settings');save();toast('Settings saved.');render()},
 addCat(){const v=$('#st-cat').value.trim();if(!v)return;if(DB.settings.categories.some(c=>c.toLowerCase()===v.toLowerCase())){toast('That category already exists.','warn');return}DB.settings.categories.push(v);audit('edited',`Added category ${v}`);save();renderKeepForm();$('#st-cat').value='';refocus('st-cat')},
 delCat(i){const c=DB.settings.categories[i];if(c==null)return;if(DB.items.some(it=>it.category===c)){toast(`${c} is used by relief items. Change those items first.`,'warn');return}DB.settings.categories.splice(i,1);audit('edited',`Removed category ${c}`);save();renderKeepForm()},
 copyBackup(){copyText(JSON.stringify(DB),'Backup (JSON)');audit('exported','Full backup (JSON)');save()},
 downloadBackup(){const blob=new Blob([JSON.stringify(DB,null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kaligtasan-id-backup-${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);audit('exported','Full backup (JSON file)');save();toast('Backup file saved. It contains personal data: store it safely.','info')},
 resetData(){wipeStore();DB=seed();HHM=null;QRC.clear();const u=userById(S.user.id)||userById('u1');S.user=u;S.online=true;S.sel=new Set();S.imp=null;S.wk=null;S.sc={screen:'home',q:'',manual:false};save();S.modal=null;toast('Demo data reset.');route()},
 /* scanner */
 sc(s){if(s==='walkin'&&!S.wk)S.wk=newWalkin('mobile');if(s!=='walkin'&&S.wk&&S.wk.mode==='mobile'&&S.wk.step===6)S.wk=null;if(s==='search'||s==='lost')S.sc.q='';if(s==='lost')S.sc.lost={};if(s==='scan')S.sc.recorded=false;S.sc.screen=s;render();const b=$('#ph-body');if(b)b.scrollTop=0;if(s==='search')refocus('sc-q')},
 scSetCenter(v){DB.me.center=v;const rs=scRounds(v);DB.me.round=rs[0]?rs[0].id:null;save();render()},
 scSetRound(v){DB.me.round=v||null;save();render()},
 scDownload(){const cs=$('#su-c').value,rd=$('#su-r').value;DB.me.center=cs;DB.me.round=rd||null;const total=DB.households.filter(h=>liveHH(h)).length;const bar=$('#dl-bar'),lab=$('#dl-label'),btn=$('#dl-btn');btn.disabled=true;let i=0;const steps=24;
  const tick=()=>{i++;const n=Math.round(total*i/steps);if(bar)bar.style.width=(i/steps*100)+'%';if(lab)lab.textContent=`Downloading household records... ${fmtN(n)}`;if(i<steps)setTimeout(tick,45);else{DB.me.downloadedAt=Date.now();audit('downloaded registry',`${fmtN(total)} households to ${ME}`,ME);save();S.sc.screen='home';toast(`${fmtN(total)} households saved on this phone. Ready to scan.`);render()}};tick()},
 toggleOnline(){S.online=!S.online;DB.me.online=S.online;deviceOf(ME).status=S.online?'Online':'Offline';save();
  if(S.online&&DB.queue.length){toast('Signal is back. Uploading…','info');render();setTimeout(()=>{syncNow();render()},900)}else{toast(S.online?'Online.':'Offline. Scanning still works; records are saved on this phone.',S.online?'ok':'warn');render()}},
 scSync(){syncNow();render()},
 scManual(){S.sc.manual=!S.sc.manual;render();if(S.sc.manual)refocus('sc-id')},
 scFlash(){const tr=CAM.stream&&CAM.stream.getVideoTracks()[0];if(!tr){toast('Flashlight needs the live camera. Use Photo of card in bright light instead.','warn');return}CAM.torch=!CAM.torch;tr.applyConstraints({advanced:[{torch:CAM.torch}]}).catch(()=>{CAM.torch=false;toast('This phone does not allow flashlight control here.','warn')});render()},
 scPhoto(f){if(!f)return;const img=new Image();img.onload=()=>{const s=Math.min(1,1200/Math.max(img.width,img.height));const cv=document.createElement('canvas');cv.width=Math.round(img.width*s);cv.height=Math.round(img.height*s);const cx=cv.getContext('2d');cx.drawImage(img,0,0,cv.width,cv.height);const r=jsQR(cx.getImageData(0,0,cv.width,cv.height).data,cv.width,cv.height);URL.revokeObjectURL(img.src);if(r&&r.data)A.scText(r.data);else toast('No QR code found in that photo. Hold the card flat, closer, in good light, or type the ID.','warn')};img.onerror=()=>toast('Could not open that image.','warn');img.src=URL.createObjectURL(f)},
 scText(raw){const s=String(raw||'').trim();if(!s){toast('Type a household ID first.','warn');return}
  if(/^KID1:/i.test(s)){const tok=s.slice(5).trim().toLowerCase();const c=DB.cards.find(x=>x.token===tok);if(!c)return A.scNF('unknown');if(c.status!=='Active')return A.scNF('deactivated',{status:c.status,at:c.deactivatedAt});const h=hh(c.hh);if(!h||!liveHH(h)||h.status==='inactive')return A.scNF('inactive');return A.scOpen(h.id)}
  const h=hhByCode(s);if(h&&vis(h)){if(!liveHH(h)||h.status==='inactive')return A.scNF('inactive');return A.scOpen(h.id)}return A.scNF('unknown',{text:s})},
 scSample(k){const d=DB.demo;const tok=code=>{const h=hhByCode(code);const c=h&&cardOf(h);return c?'KID1:'+c.token:code};
  A.scText(k==='lost'?'KID1:'+d.lostToken:k==='unknown'?'KID1:'+randHex(20):tok(d[k]))},
 scNF(reason,extra){S.sc.screen='notfound';S.sc.nf={reason,...(extra||{})};audit('scanned','Card not recognized',ME);save();render()},
 scOpen(id){const h=hh(id);S.sc.screen='result';S.sc.hh=id;S.sc.recorded=false;audit('viewed',h.code,ME);save();render();const b=$('#ph-body');if(b)b.scrollTop=0},
 scQ(v,fn){S.sc.q=v;const el=$('#sc-res');if(el)el.innerHTML=scResHTML(fn)},
 scCheckin(){const h=hh(S.sc.hh),cid=DB.me.center,now=Date.now();const old=activeCheckin(h.id);if(old){old.outAt=now;queue('checkout',`Moved ${h.code} out of ${centerOf(old.center).name}`,{kind:'checkins',id:old.id})}
  const ci={id:nid('ci'),hh:h.id,center:cid,inAt:now,outAt:null,device:ME,synced:false};DB.checkins.push(ci);queue('checkin',`Checked in ${h.code} to ${centerOf(cid).name}`,{kind:'checkins',id:ci.id});audit('checked in',h.code,ME);S.sc.recorded=false;afterScan(`Checked in to ${centerOf(cid).name}`)},
 scCheckout(){const h=hh(S.sc.hh),ci=activeCheckin(h.id);if(!ci)return;ci.outAt=Date.now();queue('checkout',`Checked out ${h.code}`,{kind:'checkins',id:ci.id});audit('checked out',h.code,ME);S.sc.recorded=false;afterScan('Checked out')},
 scRecord(){const h=hh(S.sc.hh),r=roundOf(DB.me.round);if(!r||receivedRec(r.id,h.id))return;const it=itemOf(r.item);if(it.stock<r.qty)return;const now=Date.now();
  const d={id:nid('d'),round:r.id,hh:h.id,device:ME,at:now,uuid:uuid(),synced:false,state:'ok'};DB.dists.push(d);it.stock-=r.qty;it.updatedAt=now;
  const mv=DB.moves.find(m=>m.type==='OUT'&&m.source===`Round ${r.code}`);if(mv){mv.qty+=r.qty;mv.at=now}else DB.moves.push({id:nid('mv'),item:it.id,type:'OUT',qty:r.qty,source:`Round ${r.code}`,at:now,user:'Scanner devices'});
  audit('recorded relief',`${h.code} · ${r.code}`,ME);const conf=queue('relief',`${r.qty} × ${it.name} to ${h.code}`,{kind:'dists',id:d.id});S.sc.recorded=!conf;save();if(!conf)toast(`${it.name} recorded. ${S.online?'Uploaded.':'Saved on this phone.'}`,S.online?'ok':'warn');render()},
 scLostStart(){S.sc.q='';S.sc.lost={};S.sc.screen='lost';render();refocus('sc-q')},
 scLostPick(id){S.sc.lost={hh:id};render()},
 scLost(){const h=hh(S.sc.lost.hh),old=cardOf(h),now=Date.now();if(old){old.status='Lost';old.deactivatedAt=now}const c={id:nid('k'),hh:h.id,token:randHex(20),status:'Active',issuedAt:now,printed:false,digital:true,deactivatedAt:null};DB.cards.push(c);h.card=c.id;
  queue('lost',`Lost card replaced for ${h.code}`,{kind:'cards',id:c.id});audit('reissued card',`${h.code} (reported lost at center)`,ME);S.sc.lost={hh:h.id,done:true};save();toast('Old card deactivated. New QR issued.');render()}
};

/* ---------- Boot ---------- */
VIEWS.import=((f)=>function(){if(!S.imp)S.imp={step:1,brgy:S.user.brgy==='all'?'b1':S.user.brgy};return f()})(VIEWS.import);
const typing=el=>el&&(el.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
document.addEventListener('keydown',e=>{if(!S)return;
 if(S.tour){if(e.key==='Escape'){e.preventDefault();A.tourEnd()}else if(e.key==='ArrowRight'){e.preventDefault();A.tourGo(1)}else if(e.key==='ArrowLeft'){e.preventDefault();A.tourGo(-1)}else if(e.key==='Tab'){const f=[...document.querySelectorAll('#tour button')];const k=f.indexOf(document.activeElement);e.preventDefault();(f[(k+(e.shiftKey?-1:1)+f.length)%f.length]||f[0]).focus()}return}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&S.user&&S.view!=='scanner'){e.preventDefault();A.cmdk(!S.cmdk);return}
 if(e.key==='/'&&!typing(e.target)&&S.user&&!S.modal&&!S.cmdk){const q=$('#hh-q');if(q){e.preventDefault();q.focus()}else if(S.view!=='scanner'){e.preventDefault();A.cmdk(true)}return}
 if(e.key==='Escape'){if(S.cmdk)A.cmdk(false);else if(S.modal)A.closeModal();else if(S.drawer)A.close();else if(S.menu){S.menu=false;render()}else if(S.nav)A.nav(false)}});
document.addEventListener('click',e=>{if(S&&S.menu&&!e.target.closest('.rel')){S.menu=false;render()}});
let sizeT='m';try{sizeT=localStorage.getItem('kid-size')||'m'}catch(e){}
let themeT='system';try{themeT=localStorage.getItem('kid-theme')||'system'}catch(e){}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(S&&S.theme==='system')applyTheme()});

/* Storage is async (IndexedDB), so the app starts once the registry has loaded. */
(async function boot(){
 try{DB=await load()}catch(e){console.error('Could not load saved data, starting from sample data.',e);DB=seed()}
 S={user:null,view:'dashboard',prevView:null,brgy:'all',hf:{q:'',status:'all',need:'all',purok:'all',page:0},sel:new Set(),drawer:null,modal:null,menu:false,nav:false,cmdk:null,tour:null,tabs:{},theme:themeT,size:sizeT,movesN:25,centerQ:'',range:'24h',imp:null,wk:null,rep:'evacuees',au:{user:'all',action:'all',range:'all',page:0},cardScope:'queue',sc:{screen:'home',q:'',manual:false},online:DB.me.online!==false};
 try{const id=sessionStorage.getItem('kid-user');const u=id&&userById(id);if(u&&u.status==='Active'){S.user=u;S.brgy=u.brgy==='all'?'all':u.brgy}}catch(e){}
 applyTheme();applySize();
 window.addEventListener('hashchange',route);
 save();route();
})();
