/* =========================================================
   Scanner app (phone). Works offline: every action is saved
   on the phone first and uploaded when signal returns.
   ========================================================= */
let CAM={stream:null,raf:0,cv:null,torch:false};
function scCenters(){return DB.centers.filter(c=>c.status!=='Closed'&&(S.user.brgy==='all'||c.brgy===S.user.brgy))}
function scRounds(cid){return DB.rounds.filter(r=>r.center===cid&&r.status==='Open')}
function Scanner(){
 const sc=S.sc,me=DB.me;
 if(!me.downloadedAt||!centerOf(me.center)||sc.screen==='setup')return wrapPhone(ScSetup(),false);
 const scr={home:ScHome,scan:ScScan,result:ScResult,notfound:ScNotFound,search:ScSearch,walkin:()=>WalkinForm(),sync:ScSync,lost:ScLost}[sc.screen]||ScHome;
 return wrapPhone(scr(),true)}
function wrapPhone(body,chrome){const me=DB.me,c=centerOf(me.center),r=roundOf(me.round),q=DB.queue.length,vol=S.user.role==='volunteer';
 const top=chrome?`<div class="ph-top"><div class="row1">${vol?LOGO(30):`<button class="icon-btn" aria-label="Back to dashboard" onclick="A.go('dashboard')">${icon('left',22)}</button>`}<div class="ctx"><b>${esc(c.name)}</b><span>${r?`${r.code} · ${esc(itemOf(r.item).name)}`:'Check-in only'} · ${ME}</span></div><button class="icon-btn" aria-label="Change center or round" onclick="A.sc('setup')">${icon('sliders',20)}</button>${vol?`<button class="icon-btn" aria-label="${t('logout')}" onclick="A.logout()">${icon('logout',20)}</button>`:''}</div>
  <button data-tour="conn" class="conn ${S.online?'on':'off'}" onclick="A.toggleOnline()" aria-label="Connection status. Tap to simulate ${S.online?'losing':'getting'} signal">${icon(S.online?'wifi':'wifioff',18)}<span class="grow">${S.online?t('online'):t('offline')} · ${q?`${q} ${t('pending')}`:t('allsynced')}</span><span style="font-size:12px;opacity:.85;font-weight:500">Tap to test ${S.online?'offline':'online'}</span></button></div>`:'';
 const nav=chrome?`<nav class="ph-nav">${[['home','house',t('home')],['scan','scan','Scan'],['search','search','Search'],['sync','refresh',t('sync')]].map(([k,ic,l])=>`<button class="${S.sc.screen===k||(k==='scan'&&['result','notfound'].includes(S.sc.screen))?'on':''}" onclick="A.sc('${k}')">${icon(ic,22)}${l}${k==='sync'&&q?`<span class="pip">${q}</span>`:''}</button>`).join('')}</nav>`:'';
 return `<div class="scan-stage"><div class="phone">${top}<div class="ph-body" id="ph-body"><div class="stack enter" style="gap:14px">${body}</div></div>${nav}</div></div>${S.modal?Modal():''}`}

function ScSetup(){const cs=scCenters();if(!cs.length)return `<div class="row" style="gap:12px">${LOGO(44)}<div><div class="wordmark">Kaligtasan<span>ID</span></div><div class="sm muted">Scanner · ${ME}</div></div></div><div class="alert warn">${icon('alert',18)}<span>No open evacuation center in your barangay. Ask an admin to open one, then come back.</span></div>${S.user.role==='volunteer'?`<button class="btn btn-block" onclick="A.logout()">${t('logout')}</button>`:`<button class="btn btn-block" onclick="A.go('dashboard')">Back to dashboard</button>`}`;const me=DB.me;const cid=centerOf(me.center)&&cs.some(c=>c.id===me.center)?me.center:(cs[0]&&cs[0].id);const rs=scRounds(cid);const selR=rs.some(r=>r.id===me.round)?me.round:(me.downloadedAt&&me.round===null?'':(rs[0]?rs[0].id:''));const total=DB.households.filter(h=>liveHH(h)).length;
 return `<div class="row" style="gap:12px">${LOGO(44)}<div><div class="wordmark">Kaligtasan<span>ID</span></div><div class="sm muted">Scanner · ${ME}</div></div></div>
 <div><h1 class="h1">Set up this phone</h1><p class="lede">Choose where you are working. The registry is copied to this phone so scanning works with no signal.</p></div>
 <label class="field" for="su-c"><span>Evacuation center</span><select id="su-c" onchange="A.scSetCenter(this.value)">${cs.map(c=>`<option value="${c.id}" ${c.id===cid?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
 <label class="field" for="su-r"><span>Distribution round</span><select id="su-r">${rs.map(r=>`<option value="${r.id}" ${selR===r.id?'selected':''}>${r.code} · ${esc(itemOf(r.item).name)} (${r.qty} per household)</option>`).join('')}<option value="" ${selR===''?'selected':''}>No round (check-in only)</option></select></label>
 <div class="ph-card stack" style="gap:10px"><div class="split sm"><b id="dl-label">${me.downloadedAt?`Registry on this phone: ${fmtN(total)} households`:'Registry not downloaded yet'}</b><span class="muted">${me.downloadedAt?ago(me.downloadedAt):''}</span></div><div class="progress"><i id="dl-bar" style="width:${me.downloadedAt?100:0}%"></i></div><div class="sm muted">${icon('lock',13)} Stored encrypted. Only household IDs, names, members and needs. If this phone is lost, the admin revokes it.</div></div>
 <div class="stack" style="gap:6px"><span class="sm muted" style="font-weight:600">Text size</span>${sizeRow()}</div>
 <button class="btn btn-accent btn-lg btn-block" id="dl-btn" onclick="A.scDownload()">${me.downloadedAt?'Update records and start':'Download records and start'}</button>
 ${me.downloadedAt&&centerOf(me.center)?`<button class="btn btn-block" onclick="A.sc('home')">Keep current setup</button>`:''}`}

function ScHome(){const me=DB.me,c=centerOf(me.center),r=roundOf(me.round),q=DB.queue.length;const here=activeAt(c.id),ppl=here.reduce((s,x)=>s+hh(x.hh).members.length,0);const tg=r?roundTarget(r).size:0,sv=r?roundDists(r.id).length:0;
 return `<div class="ph-card" style="${S.online?'':'border-color:var(--warn);background:var(--warn-soft)'}"><div class="row" style="flex-wrap:nowrap">${icon(S.online?'wifi':'wifioff',22)}<div><b>${S.online?t('online'):t('offline')}</b> · ${q?`${q} ${t('pending')}`:t('allsynced')}<div class="sm muted">${S.online?`Last sync ${ago(deviceOf(ME).lastSyncAt)}`:'Saved on this phone. Will upload automatically when signal returns.'}</div></div></div></div>
 <button class="bigbtn primary" data-tour="scan" onclick="A.sc('scan')"><span class="bi">${icon('scan',28)}</span><span>${t('scan')}<small>Check in a family or record relief</small></span></button>
 <button class="bigbtn" data-tour="find" onclick="A.sc('search')"><span class="bi">${icon('search',26)}</span><span>${t('search')}<small>By name, household ID or phone</small></span></button>
 <button class="bigbtn" data-tour="walkin" onclick="A.startWalkin('mobile')"><span class="bi" style="background:var(--accent-soft);color:var(--accent-ink)">${icon('userplus',26)}</span><span>${t('walkin')}<small>No card or no record. No one is turned away.</small></span></button>
 <div class="ph-card stack" style="gap:12px"><label class="field" for="hm-r"><span>Distribution round</span><select id="hm-r" onchange="A.scSetRound(this.value)">${scRounds(c.id).map(x=>`<option value="${x.id}" ${me.round===x.id?'selected':''}>${x.code} · ${esc(itemOf(x.item).name)} (${x.qty} each)</option>`).join('')}<option value="" ${!me.round?'selected':''}>No round (check-in only)</option></select></label>
 <button class="btn btn-block" data-tour="sync" onclick="A.scSync()" ${S.online?'':'disabled'}>${icon('refresh',18)}${t('syncnow')}</button></div>
 <div class="grid2" style="gap:10px;grid-template-columns:1fr 1fr"><div class="ph-card"><div class="stat-label">Checked in here</div><div class="stat-num" style="font-size:26px">${ppl}<small>/ ${c.capacity}</small></div><div class="sm muted">${plural(here.length,'household')}</div></div><div class="ph-card"><div class="stat-label">Served this round</div><div class="stat-num" style="font-size:26px">${r?sv:'—'}${r?`<small>/ ${tg}</small>`:''}</div><div class="sm muted">${r?esc(itemOf(r.item).name):'No round selected'}</div></div></div>
 <div class="ph-card stack" style="gap:8px"><div class="split"><b>Text size</b><span class="sm muted">${(TEXT_SIZES.find(x=>x[0]===S.size)||TEXT_SIZES[1])[1]}</span></div>${sizeRow()}</div>
 <button class="linkbtn" onclick="A.tour('phone')">${icon('help',17)}How to use this app</button>`}

function ScScan(){const d=DB.demo,mk=(k,l,s)=>`<button class="sample" onclick="A.scSample('${k}')"><span style="color:var(--text);font-weight:600">${l}</span><span>${s}</span></button>`;
 return `<div class="camera"><video id="cam" muted playsinline aria-label="Camera preview"></video><div class="frame"><i></i><i></i><i></i><i></i><div class="line"></div></div><div class="cam-tools"><button class="${CAM.torch?'on':''}" aria-label="Flashlight" onclick="A.scFlash()">${icon('flash',20)}</button></div><div class="cam-msg" id="cam-msg">Starting camera…</div></div>
 <div class="grid2" style="grid-template-columns:1fr 1fr;gap:10px"><label class="btn btn-primary" for="sc-photo" style="min-height:52px">${icon('camera',18)}Photo of card</label><input type="file" id="sc-photo" accept="image/*" capture="environment" class="hide" onchange="A.scPhoto(this.files[0])"><button class="btn" onclick="A.scManual()">${icon('keyboard',18)}Type ID</button></div>
 ${S.sc.manual?`<form class="row" style="flex-wrap:nowrap" onsubmit="event.preventDefault();A.scText(document.getElementById('sc-id').value)"><input id="sc-id" placeholder="ALB-0123-004512" autocapitalize="characters" autocomplete="off" aria-label="Household ID"><button class="btn btn-primary" type="submit">Find</button></form>`:''}
 <div class="stack" style="gap:8px"><div class="eyebrow">Try a sample card</div><div class="samples">
 ${mk('found','Maria Santos',d.found+' · not yet received')}${mk('received','Already received',d.received)}${mk('conflict','Served on another offline phone',d.conflict)}${mk('walkin','Walk-in, pending',d.walkin)}${mk('lost','Lost card (old QR)','deactivated card')}${mk('unknown','Unknown card','not in registry')}</div></div>`}

function prioList(nc){const p=[];if(nc.PREGNANT)p.push('Pregnant member');if(nc.INFANT)p.push(nc.INFANT>1?`${nc.INFANT} infants`:'Infant');if(nc.PWD)p.push(nc.PWD>1?`${nc.PWD} PWD members`:'PWD member');if(nc.SENIOR)p.push(nc.SENIOR>1?`${nc.SENIOR} seniors`:'Senior');if(nc.MEDICAL)p.push('Medical need');return p}
function ScResult(){const h=hh(S.sc.hh);if(!h)return ScHome();const me=DB.me,c=centerOf(me.center),r=roundOf(me.round),ci=activeCheckin(h.id),nc=needCounts(h.members),card=cardOf(h),pr=prioList(nc);
 const rec=r?receivedRec(r.id,h.id):null,it=r?itemOf(r.item):null;
 let relief;
 if(!r)relief=`<div class="relief none"><div class="state">${icon('gift',22)}No round selected</div><div class="sm muted">Pick a distribution round on Home to record relief.</div></div>`;
 else if(rec&&rec.state==='conflict')relief=`<div class="relief bad"><div class="state">${icon('alert',24)}Flagged: possible double claim</div><div class="sm">Recorded ${fmtDT(rec.at)} on ${rec.device}, but another phone served this household first. The officer will review it.</div><button class="btn btn-block" disabled>${t('record')}</button></div>`;
 else if(rec)relief=`<div class="relief bad"><div class="state">${icon('ban',24)}${t('already')}</div><div style="font-size:15px">${esc(it.name)} received on <b>${fmtDT(rec.at)}</b> at <b>${rec.device}</b>${rec.synced===false?' (on this phone, not uploaded yet)':''}.</div><button class="btn btn-block" disabled>${t('record')}</button></div>`;
 else relief=`<div class="relief ok"><div class="state">${icon('check',24)}${t('notYet')}</div><div style="font-size:15px">${r.code} · <b>${r.qty} × ${esc(it.name)}</b> · ${fmtN(it.stock)} left</div>${it.stock<r.qty?`<div class="alert bad">${icon('alert',16)}Not enough stock to give this item.</div>`:''}<button class="btn btn-ok btn-lg btn-block" onclick="A.scRecord()" ${it.stock<r.qty?'disabled':''}>${icon('check',20)}${t('record')}</button></div>`;
 const chk=ci&&ci.center===c.id?`<div class="split"><span>${icon('check',18)} <b>Checked in here</b> <span class="muted sm">since ${fmtTime(ci.inAt)}</span></span><button class="btn btn-sm" onclick="A.scCheckout()">${t('checkout')}</button></div>`
  :ci?`<div class="stack" style="gap:8px"><span class="sm">Checked in at <b>${esc(centerOf(ci.center).name)}</b> since ${fmtTime(ci.inAt)}</span><button class="btn btn-primary btn-block" onclick="A.scCheckin()">${icon('swap',18)}Move to ${esc(c.name)}</button></div>`
  :`<button class="btn btn-primary btn-lg btn-block" onclick="A.scCheckin()">${icon('building',20)}${t('checkin')} to ${esc(c.name)}</button>`;
 return `${S.sc.recorded?`<div class="stack" style="align-items:center;gap:6px"><span class="done-mark">${icon('check',34)}</span><b>${S.online?'Recorded and uploaded':'Recorded. Saved on this phone.'}</b></div>`:''}
 <div class="res-head"><div class="row" style="justify-content:space-between"><span class="mono muted">${h.code}</span>${badge(h.status)}</div><div class="res-name">${esc(headOf(h).name)}</div><div class="muted">${plural(h.members.length,'member')} · ${h.purok?'Purok '+h.purok+', ':''}${esc(brgyOf(h.brgy).name)}</div></div>
 ${Object.values(nc).some(Boolean)?`<div class="needcount">${Object.keys(nc).filter(k=>nc[k]).map(k=>tag(k,nc[k])).join('')}</div>`:''}
 ${pr.length?`<div class="prio">${icon('alert',20)}<span>Priority: ${pr.join(', ')}. Offer seating, the priority line, and space near the health desk.</span></div>`:''}
 ${h.status==='pending'?`<div class="alert warn">${icon('info',16)}Walk-in, pending verification. Temporary access to relief is allowed.</div>`:''}
 ${card&&card.digital&&!card.printed?`<div class="alert info">${icon('card',16)}Digital card only. Printed card pending at the Barangay Hall.</div>`:''}
 ${relief}
 <div class="ph-card">${chk}</div>
 <details class="ph-card"><summary>Members (${h.members.length})</summary><div class="list" style="margin-top:8px">${h.members.map(m=>`<div class="list-item sm"><div class="grow"><b>${esc(m.name)}</b><span class="sub">${esc(m.rel)} · ${ageGroup(m.birth)} ${ageLabel(m.birth)?'· '+ageLabel(m.birth):''}</span></div><span class="tags">${m.needs.map(n=>tag(n)).join('')}</span></div>`).join('')}</div></details>
 <button class="bigbtn primary" style="min-height:72px;font-size:18px" onclick="A.sc('scan')"><span class="bi">${icon('scan',24)}</span>${t('scanNext')}</button>`}

function ScNotFound(){const n=S.sc.nf||{};const de=n.reason==='deactivated',ina=n.reason==='inactive';
 return `<div class="stack" style="align-items:center;text-align:center;padding-top:12px"><span class="done-mark" style="background:var(--bad)">${icon(de?'ban':'alert',32)}</span><div class="res-name">${de?'This card was deactivated':ina?'Household is not active':'Card not recognized'}</div>
 <p class="muted" style="margin:0;max-width:34ch">${de?`This card was marked ${n.status.toLowerCase()} on ${fmtDate(n.at)}. Ask the family for their new card, or search for the household.`:ina?'This household was archived or rejected. Search by name or register the family as a walk-in.':`${n.text?`No household matches “${esc(n.text)}”. `:''}The card may be from another town, damaged, or not issued by Kaligtasan ID.`}</p></div>
 <button class="bigbtn" onclick="A.sc('search')"><span class="bi">${icon('search',24)}</span><span>Search by name or phone</span></button>
 <button class="bigbtn" onclick="A.startWalkin('mobile')"><span class="bi" style="background:var(--accent-soft);color:var(--accent-ink)">${icon('userplus',24)}</span><span>Register as walk-in</span></button>
 <button class="bigbtn" onclick="A.scLostStart()"><span class="bi">${icon('card',24)}</span><span>Report lost card<small>Deactivate the old card and issue a new one</small></span></button>
 <button class="btn btn-block" onclick="A.sc('scan')">Scan again</button>`}

function scSearchList(q){q=norm(q);if(q.length<2)return [];const d=q.replace(/\D/g,'');return DB.households.filter(h=>liveHH(h)&&(norm(h.code).includes(q)||h.members.some(m=>norm(m.name).includes(q))||(d.length>=4&&(h.phone||'').replace(/\D/g,'').includes(d)))).slice(0,30)}
function scResHTML(fn){const list=scSearchList(S.sc.q);if(norm(S.sc.q).length<2)return '<div class="muted sm">Type at least 2 letters of a name, or part of the household ID.</div>';
 return list.map(h=>`<button class="sample" onclick="${fn}('${h.id}')"><span style="color:var(--text)"><b>${esc(headOf(h).name)}</b><br><span class="mono" style="font-size:12.5px">${h.code}</span></span><span style="text-align:right">${plural(h.members.length,'member')}<br>${h.status==='pending'?'Walk-in':h.purok?'Purok '+h.purok:''}</span></button>`).join('')||'<div class="empty">No household found. Register the family as a walk-in.</div>'}
function ScSearch(){return `<h1 class="h1">${t('search')}</h1><div class="search">${icon('search',18)}<input type="search" id="sc-q" value="${esc(S.sc.q)}" placeholder="Name, household ID or phone" oninput="A.scQ(this.value,'A.scOpen')" aria-label="Search households" autocomplete="off"></div><div class="samples" id="sc-res">${scResHTML('A.scOpen')}</div>`}
function ScLost(){const L=S.sc.lost||{};
 if(L.done){const h=hh(L.hh),c=cardOf(h);return `<div class="stack" style="align-items:center;text-align:center"><span class="done-mark">${icon('check',32)}</span><div class="res-name">New card issued</div><p class="muted" style="margin:0">The old card is deactivated. Scanning it now shows “card deactivated”. Show this temporary QR to the family.</p>${cardFront(h,c)}</div><button class="btn btn-primary btn-block" onclick="A.scOpen('${h.id}')">Open household</button>`}
 if(L.hh){const h=hh(L.hh),c=cardOf(h);return `<h1 class="h1">Report lost card</h1><div class="ph-card"><b>${esc(headOf(h).name)}</b><div class="mono sm muted">${h.code}</div><div class="sm" style="margin-top:6px">${h.members.map(m=>esc(m.name)).join(', ')}</div></div><p style="margin:0">Confirm the family's identity by asking the head's birthdate and members' names. Then deactivate card ending <b class="mono">…${c?c.token.slice(-4):'none'}</b> and issue a new one.</p><button class="btn btn-danger btn-lg btn-block" onclick="A.scLost()">Deactivate old card and issue new</button><button class="btn btn-block" onclick="S.sc.lost={};render()">Choose another household</button>`}
 return `<h1 class="h1">Report lost card</h1><p class="muted" style="margin:0">Find the household first.</p><div class="search">${icon('search',18)}<input type="search" id="sc-q" value="${esc(S.sc.q)}" placeholder="Name, household ID or phone" oninput="A.scQ(this.value,'A.scLostPick')" aria-label="Search households" autocomplete="off"></div><div class="samples" id="sc-res">${scResHTML('A.scLostPick')}</div>`}
function ScSync(){const q=DB.queue,me=deviceOf(ME),errs=DB.syncErrors.filter(e=>e.device===ME&&!e.resolved);const ic={checkin:'building',checkout:'building',relief:'gift',walkin:'userplus',lost:'card'};
 return `<h1 class="h1">${t('sync')}</h1>
 <div class="ph-card" style="${S.online?'':'border-color:var(--warn);background:var(--warn-soft)'}"><div class="row" style="flex-wrap:nowrap">${icon(S.online?'wifi':'wifioff',22)}<div><b>${S.online?t('online'):t('offline')}</b><div class="sm muted">${q.length?'Saved on this phone. Will upload automatically when signal returns.':'Everything on this phone is uploaded.'}</div></div></div></div>
 <button class="btn btn-primary btn-lg btn-block" onclick="A.scSync()" ${S.online?'':'disabled'}>${icon('refresh',20)}${t('syncnow')}${q.length?` (${q.length})`:''}</button>
 <div class="split sm"><span class="muted">Last successful sync</span><b>${fmtDT(me.lastSyncAt)}</b></div>
 ${errs.length?`<div class="stack" style="gap:8px"><div class="eyebrow">Needs attention</div>${errs.map(e=>`<div class="alert bad" style="align-items:flex-start">${icon('alert',18)}<span>${esc(e.msg)}</span></div>`).join('')}</div>`:''}
 <div class="stack" style="gap:8px"><div class="eyebrow">Pending records (${q.length})</div>${q.slice().reverse().map(x=>`<div class="list-item" style="padding:10px 12px;background:var(--surface);border:1px solid var(--line);border-radius:12px">${icon(ic[x.type]||'file',18)}<div class="grow sm"><b>${esc(x.label)}</b><span class="sub">${fmtTime(x.at)} · record ${x.uuid.slice(0,8)}</span></div><span class="dot warn"></span></div>`).join('')||'<div class="empty">No pending records.</div>'}</div>
 <p class="sm muted" style="margin:0">Each record has its own ID, so uploading twice never creates duplicates.</p>`}

/* Camera */
function camMsg(m){const el=$('#cam-msg');if(el)el.textContent=m}
function startCam(){const v=$('#cam');if(!v)return;if(CAM.stream){v.srcObject=CAM.stream;v.play().catch(()=>{});camMsg('Point the camera at the QR code');loop();return}
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){camMsg('Camera preview is not available here. Use Photo of card, Type ID, or a sample card.');return}
 navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false}).then(st=>{CAM.stream=st;const v2=$('#cam');if(!v2||S.sc.screen!=='scan'){stopCam();return}v2.srcObject=st;v2.play().catch(()=>{});camMsg('Point the camera at the QR code');loop()}).catch(()=>camMsg('Camera preview is blocked in this window. Use Photo of card, Type ID, or a sample card.'))}
function loop(){cancelAnimationFrame(CAM.raf);const v=$('#cam');if(!v||!CAM.stream)return;
 if(v.readyState>=2&&jsQR&&v.videoWidth){const cv=CAM.cv||(CAM.cv=document.createElement('canvas'));const w=360,h=Math.round(w*v.videoHeight/v.videoWidth);cv.width=w;cv.height=h;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(v,0,0,w,h);const r=jsQR(cx.getImageData(0,0,w,h).data,w,h,{inversionAttempts:'dontInvert'});if(r&&r.data){if(navigator.vibrate)try{navigator.vibrate(60)}catch(e){}stopCam();A.scText(r.data);return}}
 CAM.raf=requestAnimationFrame(loop)}
function stopCam(){cancelAnimationFrame(CAM.raf);if(CAM.stream){CAM.stream.getTracks().forEach(t=>t.stop());CAM.stream=null}CAM.torch=false}

/* Sync engine */
function accept(rec,kind,dev){rec.synced=true;let conf=0;
 if(kind==='dists'){const other=DB.dists.find(x=>x.round===rec.round&&x.hh===rec.hh&&x.id!==rec.id&&x.state!=='conflict');
  if(other){other.synced=true;const first=other.at<=rec.at?other:rec,second=first===other?rec:other;second.state='conflict';conf=1;
   DB.syncErrors.unshift({id:nid('se'),device:second.device,at:Date.now(),kind:'conflict',msg:`Possible double claim: ${hh(rec.hh).code} in ${roundOf(rec.round).code} was served by ${first.device} at ${fmtTime(first.at)} and again by ${second.device} at ${fmtTime(second.at)}. Kept the first record.`,resolved:false})}}
 return conf}
function syncNow(silent){if(!S.online){if(!silent)toast('No signal. Records stay on this phone and upload when signal returns.','warn');return}
 const q=DB.queue,me=deviceOf(ME);let conf=0;
 q.forEach(it=>{const rec=(DB[it.ref.kind]||[]).find(x=>x.id===it.ref.id);if(rec)conf+=accept(rec,it.ref.kind,ME)});
 const n=q.length;DB.queue=[];me.lastSyncAt=Date.now();if(n)audit('synced',plural(n,'record'),ME);save();
 if(conf)toast(`Uploaded ${plural(n,'record')}. ${plural(conf,'possible double claim')} flagged for review.`,'warn');
 else if(!silent)toast(n?`Uploaded ${plural(n,'record')}.`:'Nothing to upload. All records are synced.');
 return conf}
function queue(type,label,ref){DB.queue.push({uuid:uuid(),type,label,at:Date.now(),ref});if(S.online)return syncNow(true);return 0}
