/* =========================================================
   First-time tutorial (guided tour)
   A spotlight walks through the screen one step at a time.
   Shown once per tour on this browser; Skip ends it, and the
   "?" button (or account menu) plays it again.
   ========================================================= */
const TOUR_STORE='kid-tour';
function toursDone(){try{return JSON.parse(localStorage.getItem(TOUR_STORE)||'[]')}catch(e){return []}}
function markTour(name){try{const d=toursDone();if(!d.includes(name)){d.push(name);localStorage.setItem(TOUR_STORE,JSON.stringify(d))}}catch(e){}}

/* Each step: [selectors (first visible one wins, null = centred card), title, text, roles?] */
const TOURS={
 web:()=>[
  [null,`Welcome, ${esc(firstName(S.user.name))}`,'This one-minute tour shows where everything is. You can skip it now and replay it any time with the <b>?</b> button at the top.'],
  [['.side .nav','.menu-btn'],'Pages','All pages are listed here (on a phone, tap the menu button). <b>Households</b> is the list of registered families. <b>Evacuation Centers</b> shows who is inside each center right now.'],
  [['.attn','.page-head + .alert'],'What needs attention','Low relief stock, full centers and phones that have not uploaded appear here. Press <b>Review</b> to see the list.'],
  [['.stats'],'Today at a glance','These numbers update as volunteers scan cards. Click a box to open the full list behind it.'],
  [['[data-tour=search]','.kbar-btn'],'Find a family fast','Type a name, household ID or phone number. Shortcut: <b>Ctrl K</b>.'],
  [['[data-tour=bell]'],'Alerts','The number on the bell shows how many things need attention.'],
  [['a[href="#walkin"]','.side a[href="#households"]'],'Register a family','Families without a record are never turned away. Open <b>Households</b>, then <b>Register walk-in</b>.',['encoder']],
  [['.side a[href="#verify"]'],'Check walk-ins','Walk-ins waiting for you are counted here. Open one, check the details, then approve.',['officer','admin']],
  [['[data-tour=scanner]'],'Scanner','Opens the phone scanner that volunteers use at the evacuation center.'],
  [['[data-tour=account]'],'Language and display','Open your account menu to change the <b>text size</b>, switch to <b>Filipino</b> or <b>Bikol</b>, use dark mode, or log out.'],
  [['[data-tour=help]'],'Help is always here','Press <b>?</b> to replay this tour. The <b>How it works</b> page explains the whole system in plain words.'],
 ],
 setup:()=>[
  [null,'Welcome, volunteer','This app checks in families and records relief at the evacuation center. It keeps working even with <b>no signal</b>.'],
  [['#su-c'],'1. Choose your center','Pick the evacuation center where you are assigned today.'],
  [['#su-r'],'2. Choose what you give out','For example food packs. Choose <b>No round</b> if you are only checking families in.'],
  [['#dl-btn'],'3. Download while you have signal','This copies the family list to this phone. After that, scanning works offline.'],
 ],
 phone:()=>[
  [['[data-tour=conn]'],'Signal','Green means records upload right away. Yellow means no signal: scans are saved on the phone and upload later by themselves.'],
  [['[data-tour=scan]'],'Scan a card','Point the camera at the family’s QR card. You will see their name, members and whether they already received relief.'],
  [['[data-tour=find]'],'No card with them?','Search by name, household ID or phone number instead.'],
  [['[data-tour=walkin]'],'Not in the list?','Register them here. No one is turned away. An officer checks the details later.'],
  [['.ph-body [data-tour=size]'],'Text too small or too big?','Change the text size here, the same way you do in your phone’s settings.'],
  [['[data-tour=sync]'],'Upload now','Records upload by themselves, but you can press this when you get signal.'],
 ],
};
const firstName=n=>n.replace(/^((Engr|Hon|Dr|Kap|Atty|Mr|Ms|Mrs|Brgy)\.?\s+)+/i,'').split(' ')[0];

function tourSteps(name){const role=S.user.role;return TOURS[name]().filter(s=>!s[3]||s[3].includes(role))}
function startTour(name){S.tour={name,i:0,steps:tourSteps(name)};S.menu=false;drawTour()}
/* Which tour belongs to the screen on display, if any. */
function tourHere(){if(!S.user||S.modal||S.drawer||S.cmdk)return null;
 if(S.view==='scanner'){if(!DB.me.downloadedAt||!centerOf(DB.me.center)||S.sc.screen==='setup')return 'setup';return S.sc.screen==='home'?'phone':null}
 return S.view==='dashboard'?'web':null}
function maybeTour(){if(S.tour){drawTour();return}const n=tourHere();if(n&&!toursDone().includes(n))startTour(n)}

function tourTarget(st){if(!st[0])return null;
 for(const sel of st[0])for(const el of document.querySelectorAll(sel)){const r=el.getBoundingClientRect();if(r.width>0&&r.height>0&&r.right>4&&r.left<innerWidth-4&&getComputedStyle(el).visibility!=='hidden')return el}return null}

function drawTour(){let box=document.getElementById('tour');const T=S&&S.tour;
 if(!T){if(box)box.remove();document.documentElement.classList.remove('touring');return}
 if(!box){box=document.createElement('div');box.id='tour';document.body.appendChild(box)}
 document.documentElement.classList.add('touring');
 const st=T.steps[T.i],n=T.steps.length,last=T.i===n-1,el=tourTarget(st);
 if(el)el.scrollIntoView({block:'nearest',inline:'nearest'});
 const r=el&&el.getBoundingClientRect(),pad=6;
 box.innerHTML=`${r?`<div class="tour-spot" style="top:${r.top-pad}px;left:${r.left-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px"></div>`:'<div class="tour-veil"></div>'}
 <div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-t" aria-describedby="tour-b">
  <div class="tour-meta"><span>Step ${T.i+1} of ${n}</span><button class="tour-x" onclick="A.tourEnd()" aria-label="Close tour">${icon('x',16)}</button></div>
  <h2 id="tour-t">${st[1]}</h2><p id="tour-b">${st[2]}</p>
  <div class="tour-dots" aria-hidden="true">${T.steps.map((_,k)=>`<i class="${k===T.i?'on':''}"></i>`).join('')}</div>
  <div class="tour-foot">${last?'':`<button class="btn btn-ghost btn-sm" onclick="A.tourEnd()">Skip tour</button>`}<span class="grow"></span>${T.i?`<button class="btn btn-sm" onclick="A.tourGo(-1)">Back</button>`:''}<button class="btn btn-primary btn-sm" id="tour-next" onclick="A.tourGo(1)">${last?'Done':T.i?'Next':'Start tour'}</button></div>
 </div>`;
 placeTourCard(box.querySelector('.tour-card'),r);
 const nx=document.getElementById('tour-next');if(nx&&!box.contains(document.activeElement))nx.focus({preventScroll:true})}

/* Put the card next to the highlighted element, on whichever side has room. */
function placeTourCard(card,r){const vw=innerWidth,vh=innerHeight,m=12,cw=card.offsetWidth,ch=card.offsetHeight;let x,y;
 if(!r){x=(vw-cw)/2;y=(vh-ch)/2}
 else if(vw<640){x=(vw-cw)/2;y=r.top+r.height/2>vh/2?Math.max(m,r.top-ch-16):Math.min(vh-ch-m,r.bottom+16)}
 else{const opts=[[r.right+16,r.top],[r.left,r.bottom+16],[r.left,r.top-ch-16],[r.left-cw-16,r.top]];
  const fits=([a,b])=>a>=m&&b>=m&&a+cw<=vw-m&&b+ch<=vh-m;
  const clamp=([a,b])=>[Math.min(Math.max(m,a),vw-cw-m),Math.min(Math.max(m,b),vh-ch-m)];
  [x,y]=clamp(opts.find(fits)||opts.map(clamp).find(fits)||[r.left,r.bottom+16])}
 card.style.left=Math.round(x)+'px';card.style.top=Math.round(y)+'px'}

window.addEventListener('resize',()=>{if(S&&S.tour)drawTour()});
