/* ---------- Store, state and data helpers ---------- */
let DB,S,HHM=null;
const ME='SCN-03';
const STORE='kaligtasan-id-v2';
/* Storage: IndexedDB (large quota, structured clone, no JSON on the main thread).
   Writes are batched: many actions in a row cause one write. Falls back to
   localStorage if IndexedDB is blocked (some private windows). */
let saveT=0,idbOk=true;
function save(){DB.clock=Date.now();memo.clear();clearTimeout(saveT);saveT=setTimeout(flush,250)}
function flush(){clearTimeout(saveT);saveT=0;if(!DB)return;
 if(idbOk)idbSet(STORE,DB).catch(()=>{idbOk=false;flush()});
 else try{localStorage.setItem(STORE,JSON.stringify(DB))}catch(e){}}
window.addEventListener('pagehide',()=>{if(saveT)flush()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&saveT)flush()});
async function wipeStore(){try{await idbDel(STORE)}catch(e){}try{localStorage.removeItem(STORE)}catch(e){}}
function shiftT(o,d){if(Array.isArray(o)){o.forEach(x=>shiftT(x,d));return}if(o&&typeof o==='object'){for(const k in o){const v=o[k];if(typeof v==='number'&&(k==='at'||/At$/.test(k)))o[k]=v+d;else if(v&&typeof v==='object')shiftT(v,d)}}}
async function load(){let d=null;
 try{d=await idbGet(STORE)}catch(e){idbOk=false}
 if(!d){try{d=JSON.parse(localStorage.getItem(STORE)||'null');if(d&&idbOk)localStorage.removeItem(STORE)}catch(e){}} // one-time move from the old localStorage copy
 if(d&&d.v===2){shiftT(d,Date.now()-d.clock);d.clock=Date.now();return d}return seed()}
/* Per-render cache for derived lookups (cleared on every save and render). */
const memo=new Map();
const memoize=(k,fn)=>{if(memo.has(k))return memo.get(k);const v=fn();memo.set(k,v);return v};
const vis=r=>r.synced!==false||(S&&S.view==='scanner'&&r.device===ME);
function hh(id){if(!HHM)HHM=new Map(DB.households.map(h=>[h.id,h]));return HHM.get(id)}
const hhByCode=c=>DB.households.find(h=>h.code.toLowerCase()===String(c).trim().toLowerCase());
const headOf=h=>h.members.find(m=>m.head)||h.members[0];
const brgyOf=id=>DB.brgys.find(b=>b.id===id)||{name:'All barangays',code:'0000'};
const centerOf=id=>DB.centers.find(c=>c.id===id);
const itemOf=id=>DB.items.find(i=>i.id===id);
const roundOf=id=>DB.rounds.find(r=>r.id===id);
const userById=id=>DB.users.find(u=>u.id===id);
const deviceOf=id=>DB.devices.find(d=>d.id===id);
const cardOf=h=>DB.cards.find(c=>c.id===h.card);
const brgyOk=b=>S.brgy==='all'||b===S.brgy;
const liveHH=h=>!['archived','merged'].includes(h.status)&&vis(h);
const activeCheckin=hid=>DB.checkins.find(c=>c.hh===hid&&!c.outAt&&vis(c));
const activeAt=cid=>memoize('at:'+cid,()=>DB.checkins.filter(c=>c.center===cid&&!c.outAt&&vis(c)));
const occ=cid=>activeAt(cid).reduce((s,c)=>s+(hh(c.hh)?.members.length||0),0);
const roundDists=rid=>DB.dists.filter(d=>d.round===rid&&d.state!=='conflict'&&vis(d));
const receivedRec=(rid,hid)=>DB.dists.find(d=>d.round===rid&&d.hh===hid&&vis(d));
function roundTarget(r){const ids=new Set(activeAt(r.center).map(c=>c.hh));roundDists(r.id).forEach(d=>ids.add(d.hh));return ids}
function needCounts(ms){const c={PWD:0,SENIOR:0,PREGNANT:0,INFANT:0,MEDICAL:0};ms.forEach(m=>m.needs.forEach(n=>{if(n in c)c[n]++}));return c}
const NEEDS={PWD:['PWD','pwd'],SENIOR:['Senior','senior'],PREGNANT:['Pregnant','pregnant'],INFANT:['Infant','infant'],MEDICAL:['Medical','medical']};
const tag=(n,c)=>`<span class="tag t-${n}">${icon(NEEDS[n][1],13)}${NEEDS[n][0]}${c>1?' ×'+c:''}</span>`;
function hhTags(h){const c=needCounts(h.members);const k=Object.keys(c).filter(x=>c[x]);return k.length?`<span class="tags">${k.map(x=>tag(x,c[x])).join('')}</span>`:'<span class="faint">None</span>'}
const STATUS={imported:['Imported','b-imported'],pending:['Walk-in (pending)','b-pending'],verified:['Verified','b-verified'],inactive:['Inactive','b-inactive'],archived:['Archived','b-inactive'],merged:['Merged','b-inactive']};
const badge=s=>`<span class="badge ${STATUS[s][1]}">${STATUS[s][0]}</span>`;
const CARDST={Active:'b-ok',Lost:'b-bad',Deactivated:'b-dark'};
function cardBadge(h){const c=cardOf(h);if(!c)return '<span class="badge b-dark">No card</span>';return `<span class="badge ${CARDST[c.status]}">${c.status}${c.status==='Active'&&!c.printed?(c.digital?' · digital only':' · to print'):''}</span>`}
const lowItems=()=>DB.items.filter(i=>i.stock<i.reorder);
const pendingOf=dev=>DB.checkins.filter(x=>x.synced===false&&x.device===dev).length+DB.dists.filter(x=>x.synced===false&&x.device===dev).length+DB.households.filter(x=>x.synced===false&&x.device===dev).length;
function audit(action,record,dev){DB.audit.unshift({id:nid('a'),user:S.user?S.user.name:'System',action,record,device:dev||(S.view==='scanner'?ME:'Web'),at:Date.now()})}
const ROLE={
 admin:{label:'Admin · Municipal DRRM',short:'Admin',views:['dashboard','households','import','walkin','verify','cards','centers','inventory','distributions','reports','devices','users','audit','config','system']},
 encoder:{label:'Barangay Encoder',short:'Encoder',views:['dashboard','households','import','walkin','verify','cards','centers','system']},
 officer:{label:'Barangay Officer',short:'Officer',views:['dashboard','households','centers','inventory','distributions','reports','system']},
 volunteer:{label:'Scanner / Volunteer',short:'Volunteer',views:[]}};
const can=v=>!!S.user&&ROLE[S.user.role].views.includes(v);
const canEditHH=()=>['admin','encoder'].includes(S.user.role);
const canStock=()=>['admin','officer'].includes(S.user.role);
const seesMedical=()=>['admin','officer'].includes(S.user.role);

/* QR helpers */
const QRC=new Map();
const qrText=c=>`KID1:${c.token}`;
function qrSvg(text){if(!text)return '';if(QRC.has(text))return QRC.get(text);
 const q=qrcode(0,'M');q.addData(text);q.make();const out=q.createSvgTag({cellSize:4,margin:0,scalable:true});
 QRC.set(text,out);return out}
function cardFront(h,c){const b=brgyOf(h.brgy);return `<div class="idcard front"><div class="cf-left"><div class="cf-brand">${LOGO(22)}<div>Kaligtasan<span>ID</span></div></div><div><div class="cf-lbl">Household ID</div><div class="cf-code">${esc(h.code)}</div></div><div><div class="cf-lbl">Barangay</div><div class="cf-brgy">${esc(b.name)}<br><span style="font-weight:500;color:#5F6B7A">${esc(DB.settings.municipality)}, ${esc(DB.settings.province)}</span></div></div></div><div class="cf-qr"><div class="qr">${c?qrSvg(qrText(c)):''}</div></div><div class="stripe"></div></div>`}
function cardBack(h,c){const b=brgyOf(h.brgy);return `<div class="idcard back"><b class="big">Bring this card to the evacuation center.</b><div>Do not share. If found, return to the Barangay Hall.</div><div><b>Barangay ${esc(b.name)} Hall</b><br>${esc(b.hall)}</div><div class="bk-foot"><span>Issued ${c?fmtDate(c.issuedAt):''}</span><span>No personal data on this card</span></div></div>`}

/* Toasts */
function toast(msg,kind='ok'){let w=$('#toasts');if(!w){w=document.createElement('div');w.id='toasts';w.className='toasts';w.setAttribute('role','status');document.body.appendChild(w)}
 while(w.children.length>=2)w.firstChild.remove();const el=document.createElement('div');el.className='toast '+kind;el.innerHTML=icon(kind==='ok'?'check':kind==='warn'?'alert':kind==='bad'?'ban':'info',18)+'<span></span>';
 el.lastChild.textContent=msg; // messages can include names typed by users: never parse them as HTML
 w.appendChild(el);setTimeout(()=>{el.style.transition='opacity .3s';el.style.opacity='0';setTimeout(()=>el.remove(),300)},3600)}

/* Tabs: tabs('hh',[['overview','Overview'],['members','Members',4]]) -> current key.
   The chosen tab per group lives in S.tabs so it survives re-renders. */
function tabKey(group,items){const k=S.tabs[group];return items.some(i=>i[0]===k)?k:items[0][0]}
function tabs(group,items,label,local){const cur=tabKey(group,items);
 return `<div class="tabs" role="tablist" aria-label="${esc(label||group)}" data-tabs="${group}">${items.map(([k,l,n])=>`<button role="tab" aria-selected="${k===cur}" class="${k===cur?'on':''}" data-k="${k}" onclick="A.tab('${group}','${k}',${local?1:0})">${l}${n!=null?`<span class="n">${fmtN(n)}</span>`:''}</button>`).join('')}</div>`}
/* Local tab panels stay in the DOM (so a form keeps every field) and are only shown or hidden. */
const tabPanel=(group,key,cur,html)=>`<div class="tab-panel" data-panel="${group}:${key}" ${key===cur?'':'hidden'}>${html}</div>`;

/* Small render helpers */
function pager(total,page,size,fn){const pages=Math.max(1,Math.ceil(total/size));if(total<=size)return `<div class="pager"><span>${plural(total,'result')}</span></div>`;
 return `<div class="pager"><span>Showing ${fmtN(page*size+1)}–${fmtN(Math.min(total,(page+1)*size))} of ${fmtN(total)}</span><div class="row"><button class="btn btn-sm" ${page<=0?'disabled':''} onclick="${fn}(${page-1})">${icon('left',15)}Previous</button><span>Page ${page+1} of ${pages}</span><button class="btn btn-sm" ${page>=pages-1?'disabled':''} onclick="${fn}(${page+1})">Next${icon('right',15)}</button></div></div>`}
function occBar(o,cap){const p=cap?o/cap:0;const cls=p>=1?'bad':p>=.85?'warn':'';return `<div class="bar" role="img" aria-label="${o} of ${cap}"><i class="${cls}" style="width:${Math.min(100,p*100).toFixed(1)}%"></i></div>`}
function barChart(vals,labels,every,unit){const W=640,Hh=150,L=30,B=22,max0=Math.max(1,...vals);const step=max0<=5?1:max0<=10?2:max0<=25?5:max0<=50?10:Math.ceil(max0/50)*10;const max=Math.ceil(max0/step)*step;const bw=(W-L)/vals.length;
 let g='';for(let v=0;v<=max;v+=step){const y=Hh-(v/max)*(Hh-10);g+=`<line class="grid" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${y+4}" text-anchor="end">${v}</text>`}
 const bars=vals.map((v,i)=>{const h=(v/max)*(Hh-10);const x=L+i*bw+bw*.18;return `<rect class="${i===vals.length-1?'bl':'bv'}" x="${x.toFixed(1)}" y="${(Hh-h).toFixed(1)}" width="${(bw*.64).toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" rx="2"><title>${labels[i]}: ${v} ${unit}</title></rect>${i%every===0||i===vals.length-1?`<text x="${(x+bw*.32).toFixed(1)}" y="${Hh+16}" text-anchor="middle">${labels[i]}</text>`:''}`}).join('');
 return `<svg class="chart" viewBox="0 0 ${W} ${Hh+B}" role="img" aria-label="Bar chart">${g}${bars}</svg>`}
function csvOf(cols,rows){const q=v=>{v=String(v??'');return /[",\n]/.test(v)?`"${v.replace(/"/g,'""')}"`:v};return [cols.map(q).join(','),...rows.map(r=>r.map(q).join(','))].join('\n')}

/* Text size: one setting scales the whole interface. */
const TEXT_SIZES=[['s','Small',.9,12],['m','Default',1,14],['l','Large',1.1,16],['xl','Larger',1.2,18]];
function applySize(){const z=(TEXT_SIZES.find(x=>x[0]===S.size)||TEXT_SIZES[1])[2];document.documentElement.style.setProperty('--ui-zoom',z);document.documentElement.dataset.size=S.size}
function sizeRow(){return `<div class="theme-row size-row" role="group" aria-label="Text size" data-tour="size">${TEXT_SIZES.map(([k,l,,px])=>`<button class="${S.size===k?'on':''}" aria-pressed="${S.size===k}" aria-label="Text size: ${l}" title="${l}" onclick="A.size('${k}')"><span class="a" style="font-size:${px}px">A</span></button>`).join('')}</div>`}
