'use strict';
/* =========================================================
   Kaligtasan ID: core (icons, i18n, utils, sample data)
   All names, numbers and records are SAMPLE placeholders.
   ========================================================= */
const IC={
 dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 house:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M10 21v-6h4v6"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
 package:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12M7.5 4.2l9 5.2"/>',
 gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
 shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
 file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/>',
 phone:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 flow:'<rect x="3" y="3" width="8" height="8" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
 scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 userplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
 wifi:'<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0"/>',
 wifioff:'<path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M5 12.86a10 10 0 0 1 5.17-2.69M19 12.86a10 10 0 0 0-2.01-1.53M2 8.82a15 15 0 0 1 4.18-2.65M22 8.82a15 15 0 0 0-11.29-3.76M2 2l20 20"/>',
 refresh:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
 alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
 printer:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
 upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 left:'<path d="m15 18-6-6 6-6"/>',
 right:'<path d="m9 18 6-6-6-6"/>',
 camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
 keyboard:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
 flash:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10"/>',
 monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 edit:'<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 archive:'<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
 ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
 merge:'<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
 cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
 db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
 swap:'<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
 card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
 pwd:'<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
 senior:'<circle cx="11" cy="4" r="2"/><path d="M11 7v6l-3 8M11 13l3 8M8 10l3-2 3 3 3 1M18 12v9"/>',
 pregnant:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
 infant:'<path d="M9 12h.01M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
 moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
 auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',
 enter:'<path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
 medical:'<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>'
};
function icon(n,s=18,c=''){return `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`}
/* Logo: a house whose window is a QR finder. The walls are drawn first and the roof
   last, so the roof sits on top and the wall ends tuck in behind it. The navy band
   under the orange roof leaves a clean gap between roof and walls. */
const LOGO_PATHS='<rect width="64" height="64" rx="14" fill="#12355B"/><g transform="translate(0 1.5)"><path d="M17 32 32 19l15 13v14.5a4.5 4.5 0 0 1-4.5 4.5h-21a4.5 4.5 0 0 1-4.5-4.5z" fill="#fff"/><rect x="24.5" y="34.5" width="15" height="15" rx="4" fill="#12355B"/><rect x="28.25" y="38.25" width="7.5" height="7.5" rx="2" fill="#fff"/><rect x="30.25" y="40.25" width="3.5" height="3.5" rx="1" fill="#F26A21"/><path d="M11 32.5 32 14.5l21 18" fill="none" stroke="#12355B" stroke-width="11.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 32.5 32 14.5l21 18" fill="none" stroke="#F26A21" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></g>';
const LOGO=(s=32)=>`<svg width="${s}" height="${s}" viewBox="0 0 64 64" role="img" aria-label="Kaligtasan ID logo">${LOGO_PATHS}</svg>`;

/* ---------- Languages (Bikol strings are a draft for native-speaker review) ---------- */
const T={
 en:{dashboard:'Dashboard',households:'Households',centers:'Evacuation Centers',inventory:'Relief Inventory',distributions:'Distributions',verify:'Verification Queue',cards:'QR Cards',reports:'Reports',devices:'Devices and Sync',users:'Users',audit:'Audit Log',config:'Settings',system:'How it works',scan:'Scan Card',search:'Search Household',walkin:'Register Walk-in',syncnow:'Sync now',openScanner:'Open scanner',logout:'Log out',online:'Online',offline:'Offline',pending:'records pending sync',allsynced:'All records synced',home:'Home',sync:'Sync',notYet:'Not yet received',already:'Already received',record:'Record received',checkin:'Check in',checkout:'Check out',scanNext:'Scan next card'},
 fil:{dashboard:'Dashboard',households:'Mga Sambahayan',centers:'Mga Evacuation Center',inventory:'Imbentaryo ng Relief',distributions:'Pamamahagi',verify:'Para sa Beripikasyon',cards:'Mga QR Card',reports:'Mga Ulat',devices:'Mga Device at Sync',users:'Mga User',audit:'Audit Log',config:'Mga Setting',system:'Paano ito gumagana',scan:'I-scan ang Card',search:'Hanapin ang Sambahayan',walkin:'Irehistro ang Walk-in',syncnow:'I-sync ngayon',openScanner:'Buksan ang scanner',logout:'Mag-log out',online:'Online',offline:'Offline',pending:'rekord na hindi pa na-sync',allsynced:'Naka-sync na lahat',home:'Home',sync:'Sync',notYet:'Hindi pa nakatanggap',already:'Nakatanggap na',record:'Itala ang pagtanggap',checkin:'I-check in',checkout:'I-check out',scanNext:'I-scan ang susunod'},
 bcl:{dashboard:'Dashboard',households:'Mga Pamilya',centers:'Mga Evacuation Center',inventory:'Imbentaryo kan Relief',distributions:'Pagtao kan Relief',verify:'Para sa Beripikasyon',cards:'Mga QR Card',reports:'Mga Report',devices:'Mga Device asin Sync',users:'Mga User',audit:'Audit Log',config:'Mga Setting',system:'Manungod sa sistema',scan:'I-scan an Card',search:'Hanapon an Pamilya',walkin:'Irehistro an Walk-in',syncnow:'I-sync ngonyan',openScanner:'Bukasan an scanner',logout:'Mag-log out',online:'Online',offline:'Offline',pending:'rekord na dai pa na-sync',allsynced:'Naka-sync na gabos',home:'Home',sync:'Sync',notYet:'Dai pa nakaresibi',already:'Nakaresibi na',record:'Itala an pagresibi',checkin:'I-check in',checkout:'I-check out',scanNext:'I-scan an sunod'}
};
const t=k=>(T[DB.settings.lang]||T.en)[k]||T.en[k]||k;

/* ---------- Utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const H=36e5,D=864e5;
const fmtN=n=>Number(n||0).toLocaleString('en-US');
const pad=(n,l)=>String(n).padStart(l,'0');
/* Local calendar date as YYYY-MM-DD. toISOString() is UTC, which gives yesterday's date before 8 AM in the Philippines. */
function today(ts=Date.now()){const d=new Date(ts);return `${d.getFullYear()}-${pad(d.getMonth()+1,2)}-${pad(d.getDate(),2)}`}
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtTime(ts){const d=new Date(ts);let h=d.getHours(),m=d.getMinutes();const ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${pad(m,2)} ${ap}`}
function fmtDate(ts){const d=new Date(ts);return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`}
function fmtDT(ts){const d=new Date(ts),n=new Date();const same=d.toDateString()===n.toDateString();const y=new Date(n-D).toDateString()===d.toDateString();return `${same?'Today':y?'Yesterday':fmtDate(ts)}, ${fmtTime(ts)}`}
function ago(ts){if(!ts)return 'never';const s=(Date.now()-ts)/1000;if(s<60)return 'just now';if(s<3600)return `${Math.round(s/60)} min ago`;if(s<86400)return `${Math.round(s/3600)} h ago`;return `${Math.round(s/86400)} d ago`}
function ageOf(b,now=Date.now()){if(!b)return null;return (now-new Date(b+'T00:00:00').getTime())/(365.25*D)}
function ageGroup(b){const a=ageOf(b);if(a==null)return 'Unknown';if(a<2)return 'Infant';if(a<13)return 'Child';if(a<18)return 'Teen';if(a<60)return 'Adult';return 'Senior'}
function ageLabel(b){const a=ageOf(b);if(a==null)return '';if(a<1)return `${Math.max(1,Math.round(a*12))} mo`;return `${Math.floor(a)} yrs`}
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
function randHex(n){const a=new Uint8Array(Math.ceil(n/2));(window.crypto||{getRandomValues:x=>{for(let i=0;i<x.length;i++)x[i]=Math.random()*256|0;return x}}).getRandomValues(a);return [...a].map(b=>pad(b.toString(16),2)).join('').slice(0,n)}
function uuid(){const h=randHex(32);return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20)}`}
const initials=n=>String(n).split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const plural=(n,w,p)=>`${fmtN(n)} ${n===1?w:(p||w+'s')}`;
function nid(p){return p+(++DB.seq)}

/* ---------- Sample data generator (deterministic) ---------- */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const FF=['Maria','Ana','Rosa','Liza','Carmen','Josefina','Teresa','Gloria','Elena','Luz','Marites','Jocelyn','Rowena','Cristina','Nenita','Divina','Analyn','Jenny','Mylene','Rosalie','Lorna','Evelyn','Imelda','Marilou'];
const FM=['Jose','Juan','Pedro','Ramon','Antonio','Roberto','Eduardo','Ricardo','Danilo','Rogelio','Ernesto','Mario','Arnel','Noel','Rodel','Joel','Romeo','Efren','Ronaldo','Alfredo','Renato','Dante','Benjie','Nestor'];
const KF=['Kyla','Princess','Jasmine','Bea','Andrea','Mika','Angel','Trisha','Joy','Shaira','Alyssa','Nicole'];
const KM=['Angelo','John Paul','Mark','Paolo','Jhon','Carlo','Kenneth','Miguel','Justin','Renz','Lance','Gab'];
const SUR=['Santos','Reyes','Cruz','Bautista','Ocampo','Garcia','Mendoza','Torres','Ariola','Nacion','Lorenzo','Ludovice','Bañares','Morales','Cabrera','Lomibao','Rañola','Ibo','Paje','Llaguno','Nolasco','Barcelona','Oñate','Sayson','Detera','Bitarra','Malaque','Peñaflor','Bonifacio','Nuñez','Lagdameo','Marbella','Sabularse','Atun'];
const MED=['Hypertension, daily medicine','Diabetes, needs insulin','Asthma, uses inhaler','Dialysis twice a week','Heart condition','Recovering from surgery','Epilepsy, daily medicine'];
const SIZES=[1,2,2,3,3,3,4,4,4,4,5,5,5,6,6,7];

function seed(){
 const R=rng(20261123),pick=a=>a[Math.floor(R()*a.length)],now=Date.now();let id=0;
 const hex=n=>{let s='';for(let i=0;i<n;i++)s+=Math.floor(R()*16).toString(16);return s};
 const bd=(age,jit=true)=>new Date(now-age*365.25*D-(jit?Math.floor(R()*330)*D:0)).toISOString().slice(0,10);
 const db={v:2,clock:now,seq:100000,wseq:{b1:32,b2:7,b3:5},
  settings:{lang:'en',municipality:'Daraga',province:'Albay',retention:'3 years',alert:'3',alertName:'Mayon Volcano',categories:['Food','Water','Hygiene','Shelter','Medical'],
   consent:'I agree that the Barangay may collect and keep my household\'s information to plan evacuation, check us in at evacuation centers, and record the relief we receive. Health and disability details are used only to give priority care. The data is protected under the Data Privacy Act of 2012 (RA 10173), is kept for the period set by the Barangay, and I may ask to see, correct, or delete it at the Barangay Hall.'},
  brgys:[{id:'b1',name:'San Roque',code:'0123',puroks:7,hall:'(052) 000 0123',captain:'Hon. Rodel Ariola (sample)'},{id:'b2',name:'Bañag',code:'0124',puroks:6,hall:'(052) 000 0124',captain:'Hon. Lorna Nacion (sample)'},{id:'b3',name:'Busay',code:'0125',puroks:5,hall:'(052) 000 0125',captain:'Hon. Dante Lomibao (sample)'}],
  households:[],cards:[],centers:[],checkins:[],items:[],moves:[],rounds:[],dists:[],users:[],devices:[],audit:[],queue:[],syncErrors:[],
  me:{online:true,center:null,round:null,downloadedAt:null}};
 db.users=[
  {id:'u1',name:'Engr. Ramon Ocampo',email:'ramon.ocampo@sample.lgu.ph',role:'admin',brgy:'all',status:'Active',lastAt:now-12*60e3},
  {id:'u2',name:'Rowena Bañares',email:'rowena.banares@sample.lgu.ph',role:'encoder',brgy:'b1',status:'Active',lastAt:now-2*H},
  {id:'u3',name:'Danilo Morales',email:'danilo.morales@sample.lgu.ph',role:'officer',brgy:'b1',status:'Active',lastAt:now-40*60e3},
  {id:'u4',name:'Jenny Lorenzo',email:'jenny.lorenzo@sample.lgu.ph',role:'volunteer',brgy:'b1',status:'Active',lastAt:now-6*60e3},
  {id:'u5',name:'Mark Rañola',email:'mark.ranola@sample.lgu.ph',role:'volunteer',brgy:'b1',status:'Active',lastAt:now-3*60e3},
  {id:'u6',name:'Carlo Detera',email:'carlo.detera@sample.lgu.ph',role:'volunteer',brgy:'b1',status:'Active',lastAt:now-9*60e3},
  {id:'u7',name:'Mylene Paje',email:'mylene.paje@sample.lgu.ph',role:'volunteer',brgy:'b1',status:'Active',lastAt:now-75*60e3},
  {id:'u8',name:'Joel Nolasco',email:'joel.nolasco@sample.lgu.ph',role:'volunteer',brgy:'b3',status:'Active',lastAt:now-5*H},
  {id:'u9',name:'Analyn Sayson',email:'analyn.sayson@sample.lgu.ph',role:'encoder',brgy:'b2',status:'Active',lastAt:now-26*H},
  {id:'u10',name:'Efren Lomibao',email:'efren.lomibao@sample.lgu.ph',role:'officer',brgy:'b2',status:'Active',lastAt:now-4*H},
  {id:'u11',name:'Teresa Llaguno',email:'teresa.llaguno@sample.lgu.ph',role:'volunteer',brgy:'b2',status:'Active',lastAt:now-20*60e3},
  {id:'u12',name:'Noel Malaque',email:'noel.malaque@sample.lgu.ph',role:'volunteer',brgy:'b1',status:'Disabled',lastAt:now-9*D}];
 db.devices=[
  {id:'SCN-01',name:'Gym station 1',user:'u5',version:'1.2.0',status:'Online',lastSyncAt:now-2*60e3},
  {id:'SCN-02',name:'Gym station 2',user:'u6',version:'1.2.0',status:'Online',lastSyncAt:now-5*60e3},
  {id:'SCN-03',name:'Volunteer phone 3 (this phone)',user:'u4',version:'1.2.0',status:'Online',lastSyncAt:now-8*60e3},
  {id:'SCN-04',name:'School station',user:'u7',version:'1.1.3',status:'Online',lastSyncAt:now-80*60e3},
  {id:'SCN-05',name:'Busay chapel phone',user:'u8',version:'1.2.0',status:'Offline',lastSyncAt:now-5*H},
  {id:'SCN-06',name:'Spare phone',user:'u12',version:'1.1.3',status:'Revoked',lastSyncAt:now-9*D,note:'Reported lost on '+fmtDate(now-5*D)},
  {id:'SCN-07',name:'Bañag court phone',user:'u11',version:'1.2.0',status:'Online',lastSyncAt:now-3*60e3}];
 const enc={b1:'Rowena Bañares',b2:'Analyn Sayson',b3:'Rowena Bañares'};
 function mem(name,birth,sex,rel,head=false){const a=ageOf(birth,now);const n=[];if(a>=60)n.push('SENIOR');if(a<2)n.push('INFANT');if(R()<(a>=60?.12:.025))n.push('PWD');if(sex==='F'&&a>=18&&a<=42&&R()<.05)n.push('PREGNANT');let note='';if(R()<(a>=60?.15:.02)){n.push('MEDICAL');note=pick(MED)}return {id:'m'+(++id),name,birth,sex,rel,head,needs:n,note}}
 function addCard(h,status,issuedAt,printed){const c={id:'k'+(++id),hh:h.id,token:hex(20),status,issuedAt,printed,digital:false,deactivatedAt:status==='Active'?null:issuedAt+60*D};db.cards.push(c);if(status==='Active')h.card=c.id;return c}
 function mkHH(b,code,o={}){
  const sur=o.sur||pick(SUR);let ms=o.members;
  if(!ms){ms=[];const size=pick(SIZES);const hs=R()<.55?'F':'M';const ha=22+Math.floor(R()*48);
   ms.push(mem(`${pick(hs==='F'?FF:FM)} ${sur}`,bd(ha),hs,'Head',true));
   if(size>=2){const ss=hs==='F'?'M':'F';ms.push(mem(`${pick(ss==='F'?FF:FM)} ${sur}`,bd(Math.max(18,ha+Math.floor(R()*9)-4)),ss,'Spouse'))}
   for(let k=2;k<size;k++){
    if(k===size-1&&size>=4&&R()<.3){const s=R()<.6?'F':'M';ms.push(mem(`${pick(s==='F'?FF:FM)} ${sur}`,bd(Math.min(90,ha+22+Math.floor(R()*8))),s,s==='F'?'Mother':'Father'))}
    else{const s=R()<.5?'F':'M';const ca=Math.floor(R()*Math.min(18,ha-17));ms.push(mem(`${pick(s==='F'?KF:KM)} ${sur}`,ca<2?bd(R()*1.8,false):bd(ca),s,s==='F'?'Daughter':'Son'))}}}
  const st=o.status||(R()<.64?'verified':(R()<.955?'imported':'inactive'));
  const purok=o.purok===undefined?1+Math.floor(R()*b.puroks):o.purok;
  const h={id:'h'+(++id),code,brgy:b.id,purok,location:o.location||`Purok ${purok}, Brgy. ${b.name}`,phone:o.phone!==undefined?o.phone:(R()<.7?'09'+pad(Math.floor(R()*1e9),9):''),
   status:st,source:o.source||'import',createdAt:o.createdAt||now-(150+R()*60)*D,createdBy:o.createdBy||enc[b.id],device:o.device||'Web',
   consentAt:st==='verified'||o.source==='walkin'?(o.createdAt||now-(10+R()*120)*D):null,consentBy:st==='verified'||o.source==='walkin'?(o.createdBy||enc[b.id]):null,members:ms,note:'',infoRequested:''};
  db.households.push(h);
  addCard(h,st==='inactive'?'Deactivated':'Active',h.createdAt+(o.source==='walkin'?0:20*D),o.source==='walkin'?false:(st==='verified'||R()<.35));
  if(o.source==='walkin'){db.cards[db.cards.length-1].digital=true}
  return h}
 const [b1,b2,b3]=db.brgys;
 // San Roque 004001–004512 (Maria Santos is 004512), Bañag 000201–000630, Busay 000101–000397
 for(let n=4001;n<4512;n++)mkHH(b1,`ALB-0123-${pad(n,6)}`);
 const mS=(name,birth,sex,rel,head,needs,note='')=>({id:'m'+(++id),name,birth,sex,rel,head,needs,note});
 const maria=mkHH(b1,'ALB-0123-004512',{sur:'Santos',status:'verified',purok:3,phone:'0917 555 0123',members:[
  mS('Maria Santos',bd(38),'F','Head',true,[]),mS('Jose Santos',bd(67),'M','Father',false,['SENIOR','PWD']),
  mS('Ana Santos',bd(9),'F','Daughter',false,[]),mS('Baby Santos',bd(.5,false),'M','Son',false,['INFANT'])]});
 for(let n=201;n<=630;n++)mkHH(b2,`ALB-0124-${pad(n,6)}`);
 for(let n=101;n<=397;n++)mkHH(b3,`ALB-0125-${pad(n,6)}`);
 // Lost-card example: old card reported lost, new card active
 const lostH=db.households.find(h=>h.code==='ALB-0123-004100');lostH.status='verified';
 const oldC=addCard(lostH,'Lost',now-200*D,true);oldC.deactivatedAt=now-12*D;
 const curC=db.cards.find(c=>c.hh===lostH.id&&c.status==='Active');curC.issuedAt=now-12*D;
 // Walk-ins pending verification (9)
 const W=[['Pedro Reyes','M',44,'Near the bridge, Purok 4',4,b1,31,'SCN-01'],['Liza Ibo','F',29,'Living under the bridge at Purok 4',3,b1,30,'SCN-02'],['Ernesto Atun','M',61,'Staying with relatives, Purok 2',2,b1,29,'SCN-01'],['Gloria Marbella','F',52,'Roadside near the chapel, Purok 6',5,b1,28,'SCN-04'],['Arnel Sabularse','M',35,'House damaged by lahar, Purok 7',6,b1,27,'SCN-02'],['Nenita Lagdameo','F',70,'Boarding house near the market',1,b1,26,'Web'],['Rodel Peñaflor','M',27,'Tent beside the river, Purok 5',3,b1,25,'SCN-01'],['Divina Oñate','F',33,'Staying at the church, Bañag',4,b2,6,'SCN-07'],['Benjie Atun','M',48,'Relocated from Busay upper slope',3,b3,4,'SCN-05']];
 W.forEach(([nm,sx,ag,loc,sz,b,num,dev],i)=>{const sur=nm.split(' ').slice(-1)[0];const ms=[mem(nm,bd(ag),sx,'Head',true)];
  for(let k=1;k<sz;k++){const s=R()<.5?'F':'M';ms.push(k===1&&ag<60?mem(`${pick(s==='F'?FF:FM)} ${sur}`,bd(ag-2),s,'Spouse'):mem(`${pick(s==='F'?KF:KM)} ${sur}`,k===sz-1&&i%3===0?bd(.4,false):bd(2+Math.floor(R()*12)),s,s==='F'?'Daughter':'Son'))}
  if(i===1)ms[0].needs.push('PREGNANT');
  mkHH(b,`ALB-${b.code}-W${pad(num,5)}`,{sur,status:'pending',source:'walkin',purok:null,location:loc,phone:i%2?'':'0998 000 '+pad(100+i,4),members:ms,createdAt:now-(2+i*7)*H,createdBy:dev==='Web'?enc[b.id]:({'SCN-01':'Mark Rañola','SCN-02':'Carlo Detera','SCN-04':'Mylene Paje','SCN-05':'Joel Nolasco','SCN-07':'Teresa Llaguno'})[dev],device:dev});
 });
 // Evacuation centers
 db.centers=[
  {id:'c1',brgy:'b1',name:'Barangay Gymnasium',location:'Purok 1, San Roque',capacity:250,status:'Open',contact:'Kgd. Liza Nacion (sample)'},
  {id:'c2',brgy:'b1',name:'San Roque Elementary School',location:'Purok 2, San Roque',capacity:180,status:'Open',contact:'Mr. Nestor Cabrera (sample)'},
  {id:'c3',brgy:'b2',name:'Bañag Covered Court',location:'Purok 3, Bañag',capacity:150,status:'Open',contact:'Kgd. Efren Lomibao (sample)'},
  {id:'c4',brgy:'b3',name:'Busay Chapel Hall',location:'Purok 1, Busay',capacity:50,status:'Open',contact:'Kgd. Imelda Ludovice (sample)'},
  {id:'c5',brgy:'b2',name:'Daraga North Central School',location:'Bañag',capacity:300,status:'Closed',contact:'Ms. Evelyn Garcia (sample)'}];
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const pool=b=>shuffle(db.households.filter(h=>h.brgy===b&&h.status!=='inactive'&&h.code!=='ALB-0123-004512'&&h.source!=='walkin'));
 const devFor={c1:['SCN-01','SCN-02'],c2:['SCN-04'],c3:['SCN-07'],c4:['SCN-05']};
 const used=new Set();
 function fill(c,target,list,extra=[]){let p=0;const out=[];for(const h of extra){out.push(h);p+=h.members.length;used.add(h.id)}
  for(const h of list){if(p>=target)break;if(used.has(h.id)||p+h.members.length>target+2)continue;used.add(h.id);out.push(h);p+=h.members.length}
  out.forEach(h=>db.checkins.push({id:'ci'+(++id),hh:h.id,center:c,inAt:now-(0.3+R()*R()*27)*H,outAt:null,device:pick(devFor[c]),synced:true}));return out}
 const wk=db.households.filter(h=>h.source==='walkin');
 const p1=pool('b1');
 const g1=fill('c1',180,p1,[wk[0],wk[1],wk[4]]);
 fill('c2',52,p1,[wk[2],wk[3]]);
 fill('c3',40,pool('b2'),[wk[7]]);
 fill('c4',54,pool('b3'),[wk[8]]);
 // Unsynced check-ins held on phones that have not uploaded yet
 db.checkins.filter(c=>c.center==='c2').slice(-3).forEach(c=>{c.synced=false;c.device='SCN-04'});
 db.checkins.filter(c=>c.center==='c4').slice(-3).forEach(c=>{c.synced=false;c.device='SCN-05'});
 // Historical check-ins (already went home)
 const all=shuffle(db.households.filter(h=>!used.has(h.id)&&h.status!=='inactive'&&h.source!=='walkin')).slice(0,90);
 all.forEach(h=>{const inAt=now-(1.3+R()*5.6)*D;db.checkins.push({id:'ci'+(++id),hh:h.id,center:h.brgy==='b1'?(R()<.6?'c1':'c2'):h.brgy==='b2'?'c3':'c4',inAt,outAt:inAt+(8+R()*30)*H,device:'SCN-01',synced:true})});
 // Relief items
 db.items=[
  {id:'i1',name:'Food pack',category:'Food',unit:'pack',stock:420,reorder:150,updatedAt:now-35*60e3},
  {id:'i2',name:'Drinking water',category:'Water',unit:'liter',stock:1200,reorder:500,updatedAt:now-2*H},
  {id:'i3',name:'Hygiene kit',category:'Hygiene',unit:'kit',stock:85,reorder:100,updatedAt:now-5*H},
  {id:'i4',name:'Blanket',category:'Shelter',unit:'piece',stock:300,reorder:80,updatedAt:now-30*H},
  {id:'i5',name:'Infant formula',category:'Food',unit:'can',stock:24,reorder:30,updatedAt:now-7*H},
  {id:'i6',name:'Medicine kit',category:'Medical',unit:'kit',stock:40,reorder:20,updatedAt:now-2*D},
  {id:'i7',name:'Sleeping mat',category:'Shelter',unit:'piece',stock:140,reorder:60,updatedAt:now-2*D}];
 const mv=(item,type,qty,source,at,user='Engr. Ramon Ocampo')=>db.moves.push({id:'mv'+(++id),item,type,qty,source,at,user});
 mv('i1','IN',600,'DSWD Region V (sample)',now-3*D);mv('i2','IN',1500,'Provincial DRRM Office (sample)',now-3*D);mv('i3','IN',200,'MSWDO Daraga (sample)',now-3*D);
 mv('i4','IN',500,'Private donor (sample)',now-4*D);mv('i5','IN',60,'Municipal Health Office (sample)',now-2*D);mv('i6','IN',50,'Municipal Health Office (sample)',now-2*D);mv('i7','IN',200,'DSWD Region V (sample)',now-4*D);
 mv('i3','OUT',3,'Adjustment: water-damaged kits',now-20*H,'Danilo Morales');
 // Distribution rounds
 const sod=new Date();sod.setHours(6,0,0,0);let r2t=sod.getTime();if(r2t>now-H)r2t=now-2*H;
 db.rounds=[
  {id:'rd5',code:'R-0005',center:'c1',item:'i4',qty:2,dateAt:now-30*H,status:'Closed'},
  {id:'rd6',code:'R-0006',center:'c3',item:'i1',qty:1,dateAt:now-25*H,status:'Closed'},
  {id:'rd7',code:'R-0007',center:'c1',item:'i1',qty:1,dateAt:r2t,status:'Open'},
  {id:'rd8',code:'R-0008',center:'c1',item:'i2',qty:6,dateAt:now-3*H,status:'Open'},
  {id:'rd9',code:'R-0009',center:'c4',item:'i3',qty:1,dateAt:now-5*H,status:'Open'}];
 db.nextRound=10;
 const inC=c=>db.checkins.filter(x=>x.center===c&&!x.outAt);
 function serve(r,share,devs){const list=shuffle(inC(r.center));const n=Math.round(list.length*share);list.slice(0,n).forEach(ci=>{const start=Math.max(r.dateAt,ci.inAt);db.dists.push({id:'d'+(++id),round:r.id,hh:ci.hh,device:pick(devs),at:start+R()*(Math.max(60e3,now-start)),uuid:hex(32),synced:true,state:'ok'})});}
 serve(db.rounds[0],.95,['SCN-01','SCN-02']);serve(db.rounds[1],.9,['SCN-07']);serve(db.rounds[2],.72,['SCN-01','SCN-02']);serve(db.rounds[3],.4,['SCN-02']);serve(db.rounds[4],.3,['SCN-05']);
 db.dists.filter(d=>d.round==='rd9').slice(-1).forEach(d=>{d.synced=false});
 const outFor=(r,src)=>{const n=db.dists.filter(d=>d.round===r.id).length*r.qty;if(n)mv(r.item,'OUT',n,src,r.dateAt+H,'Scanner devices')};
 db.rounds.forEach(r=>outFor(r,`Round ${r.code}`));
 // Conflict example: SCN-04 (offline earlier) served one gym household for R-0007 but has not uploaded it
 const servedR7=new Set(db.dists.filter(d=>d.round==='rd7').map(d=>d.hh));
 const notServed=g1.filter(h=>!servedR7.has(h.id)&&h.source!=='walkin');
 const confH=notServed[0];db.dists.push({id:'d'+(++id),round:'rd7',hh:confH.id,device:'SCN-04',at:now-52*60e3,uuid:hex(32),synced:false,state:'ok'});
 const recvH=db.households.find(h=>h.id===db.dists.find(d=>d.round==='rd7'&&d.synced).hh);
 db.demo={found:maria.code,received:recvH.code,conflict:confH.code,lostToken:oldC.token,walkin:'ALB-0123-W00031'};
 db.syncErrors=[{id:'se1',device:'SCN-04',at:now-45*60e3,kind:'timeout',msg:'Upload timed out on weak signal. 4 records will retry automatically.',resolved:false}];
 // Audit log
 const A=(u,action,record,dev,at)=>db.audit.push({id:'a'+(++id),user:u,action,record,device:dev,at});
 A('Engr. Ramon Ocampo','imported','512 households from San Roque RBI file (sample)','Web',now-180*D);
 A('Analyn Sayson','imported','430 households from Bañag RBI file (sample)','Web',now-176*D);
 A('Rowena Bañares','imported','297 households from Busay RBI file (sample)','Web',now-170*D);
 A('Rowena Bañares','printed','Card batch: Purok 1–3, San Roque','Web',now-150*D);
 A('Rowena Bañares','reissued card','ALB-0123-004100 (lost card)','Web',now-12*D);
 A('Engr. Ramon Ocampo','revoked device','SCN-06 Spare phone (reported lost)','Web',now-5*D);
 A('Danilo Morales','exported','Evacuee list, Barangay Gymnasium (PDF)','Web',now-20*H);
 A('Danilo Morales','edited','Hygiene kit stock adjustment (−3)','Web',now-20*H);
 db.households.filter(h=>h.source==='walkin').forEach(h=>A(h.createdBy,'created',`Walk-in ${h.code}`,h.device,h.createdAt));
 A('Engr. Ramon Ocampo','created','Distribution round R-0007 (Food pack)','Web',r2t-20*60e3);
 A('Engr. Ramon Ocampo','created','Distribution round R-0008 (Drinking water)','Web',now-3*H-10*60e3);
 A('Rowena Bañares','viewed','ALB-0123-004512','Web',now-3*H);
 A('Mark Rañola','synced','38 records','SCN-01',now-2*60e3);
 A('Carlo Detera','synced','21 records','SCN-02',now-5*60e3);
 A('Engr. Ramon Ocampo','logged in','Web dashboard','Web',now-15*60e3);
 db.audit.sort((a,b)=>b.at-a.at);
 return db;
}
