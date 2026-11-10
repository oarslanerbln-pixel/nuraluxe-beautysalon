/* ===== KONFIGURATION ===== */
const CONFIG={
  phone:"+49 30 000 000 00", whatsapp:"4930000000000", email:"info@nuraluxe.de",
  webhook:"",            // Make / n8n / Supabase-URL (nur https) → Anfragen landen dort
  turnstileSiteKey:"",   // optional: Cloudflare Turnstile (Spam-Schutz, DSGVO-freundlich)
  minFillSeconds:4,      // Bots füllen schneller aus → werden still verworfen
  cooldownSeconds:60,    // max. eine Anfrage pro Minute und Browser
  demo:true,             // Vorschau: Anfragen werden NICHT gesendet
  daysAhead:45, leadHours:2, step:30,
  hours:{0:null,1:[10,19],2:[10,19],3:[10,19],4:[10,19],5:[10,19],6:[10,17]},
  closed:[]              // ["2026-12-24", …]
};
const SERVICES=[
 {cat:"Gesicht",img:"img/svc-gesicht.webp",tag:"Bestseller",items:[["Hydrafacial",60,89],["Deep Cleansing Facial",60,69],["Anti-Aging Facial",75,99]]},
 {cat:"Lashes & Brows",img:"img/svc-lashes.webp",tag:"Natürlich",items:[["Lash Lifting",45,49],["Brow Lamination",45,45],["Lash & Brow Kombi",75,85]]},
 {cat:"Nails",img:"img/svc-nails.webp",tag:"Gepflegt",items:[["Maniküre",45,35],["Gel-Maniküre",60,45],["Pediküre",60,45]]},
 {cat:"Haarentfernung",img:"img/svc-haar.webp",tag:"Dauerhaft",items:[["Laser – Achseln",20,49],["Laser – Beine komplett",60,149],["Waxing – Gesicht",20,25]]},
 {cat:"Beratung",img:"img/about.webp",tag:"Gratis",items:[["Kostenlose Hautanalyse",20,0]]}
];
/* ========================= */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>1-Math.pow(1-t,3);
const pad=n=>String(n).padStart(2,'0'),eur=n=>n===0?'kostenlos':'ab '+n+' €';
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}};
const MON=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],MONL=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
$('#tTel').textContent=CONFIG.phone;$('#tMail').textContent=CONFIG.email;$('#yr').textContent=new Date().getFullYear();
$('#callBtn').href='tel:'+CONFIG.phone.replace(/\s/g,'');

/* Hero title letters */
[['#t1','Nura'],['#t2','Luxe']].forEach(([s,w],k)=>w.split('').forEach((c,i)=>{const b=document.createElement('b');b.textContent=c;b.style.transitionDelay=(k*.15+i*.07+.1)+'s';$(s).appendChild(b)}));

/* Preloader */
const startT=performance.now();let ready=false;
function pre(n){const p=cl((n-startT)/1300);$('#preCnt').textContent=Math.round(ease(p)*100);$('#preBar').style.setProperty('--p',ease(p));if(p<1&&!ready)requestAnimationFrame(pre);else done()}
function done(){if(ready)return;ready=true;$('#pre').classList.add('out');document.body.classList.remove('lock');setTimeout(()=>document.body.classList.add('ready'),250);setTimeout(()=>$('#pre').remove(),1400)}
RM?done():requestAnimationFrame(pre);

/* Video */
const hv=$('#hv'),saveData=navigator.connection&&navigator.connection.saveData;
if(RM||saveData){hv.remove()}else{const mob=matchMedia('(max-width:900px)').matches;
 hv.muted=true;hv.preload='auto';hv.src=mob?'media/hero-m.mp4':'media/hero.mp4';
 hv.addEventListener('playing',()=>hv.style.opacity=1,{once:true});hv.addEventListener('error',()=>hv.remove());
 const tryPlay=()=>{const p=hv.play();if(p&&p.catch)p.catch(()=>{})};hv.addEventListener('canplay',tryPlay,{once:true});
 document.addEventListener('visibilitychange',()=>{document.hidden?hv.pause():tryPlay()});
 addEventListener('touchstart',tryPlay,{once:true,passive:true})}

/* Split headings */
$$('.split').forEach(h=>{let i=0;const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(t);return}const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.append(s);f.append(w)});c.replaceWith(f)}else walk(c)});walk(h)});

/* Manifesto words */
const mani=$('#mani');mani.innerHTML=mani.textContent.split(/\s+/).map(w=>w.startsWith('*')?`<span class="em">${w.replace(/\*/g,'')}</span>`:`<span>${w}</span>`).join(' ');
const mw=$$('#mani span');

/* Reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
 e.target.querySelectorAll('[data-count]').forEach(b=>{const to=+b.dataset.count,t0=performance.now();const f=n=>{const p=cl((n-t0)/1500);b.textContent=Math.round(to*ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}),{threshold:.15,rootMargin:'0px 0px -50px'});
$$('.rv,.split').forEach(e=>io.observe(e));

/* Marquee */
const words=['Hydrafacial','Lash Lifting','Brow Lamination','Gel-Maniküre','Laser','Anti-Aging'];
const fill=(el,arr)=>{const h=arr.map(w=>`<span>${w}</span><span class="dot">✦</span>`).join('');el.innerHTML=h+h+h};
fill($('#mq1'),words);fill($('#mq2'),[...words].reverse());
let mx=0,vel=0,lastY=scrollY;

/* Services coverflow */
const cf=$('#cf'),dots=$('#dots');
SERVICES.forEach((s,i)=>{const a=document.createElement('div');a.className='card';a.dataset.cat=s.cat;a.tabIndex=0;
 a.innerHTML=`<div class="ci" style="background-image:url(${s.img})"></div><div class="cin"><span class="no">0${i+1}</span><span class="tag">${s.tag}</span><h3>${s.cat.replace('&','&amp;')}</h3><ul>${s.items.map(x=>`<li><span>${x[0]}</span><b>${x[2]?x[2]+' €':'gratis'}</b></li>`).join('')}</ul><div class="go"><span>Jetzt buchen</span><i>→</i></div></div>`;
 a.onclick=()=>{const c=a.getBoundingClientRect(),m=cf.getBoundingClientRect();if(Math.abs(c.left+c.width/2-(m.left+m.width/2))>40){cf.scrollBy({left:c.left+c.width/2-(m.left+m.width/2),behavior:'smooth'});return}openSheet(s.cat)};
 cf.appendChild(a);dots.appendChild(document.createElement('i'))});
const cards=$$('.card'),dl=$$('#dots i');
function cover(){const m=cf.getBoundingClientRect(),cx=m.left+m.width/2;let best=0,bd=1e9;
 cards.forEach((c,i)=>{const r=c.getBoundingClientRect(),d=(r.left+r.width/2-cx)/r.width,ad=Math.abs(d);if(ad<bd){bd=ad;best=i}
  c.style.transform=RM?'':`rotateY(${cl(d,-1.5,1.5)*-22}deg) scale(${1-cl(ad,0,1.5)*.12}) translateZ(${-ad*60}px)`;c.style.opacity=1-cl(ad-.6,0,1)*.5;
  c.querySelector('.ci').style.transform=`translateX(${d*-14}%) scale(1.08)`});
 dl.forEach((d,i)=>d.classList.toggle('on',i===best))}
cf.addEventListener('scroll',()=>requestAnimationFrame(cover),{passive:true});
const step=dir=>{cf.scrollBy({left:dir*(cards[0].offsetWidth+16),behavior:'smooth'})};
$('#cfPrev').onclick=()=>step(-1);$('#cfNext').onclick=()=>step(1);
/* desktop drag */
let dragX=null,dragS=0;cf.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dragX=e.clientX;dragS=cf.scrollLeft;cf.style.scrollSnapType='none'});
addEventListener('pointermove',e=>{if(dragX!==null)cf.scrollLeft=dragS-(e.clientX-dragX)});
addEventListener('pointerup',()=>{if(dragX===null)return;dragX=null;cf.style.scrollSnapType='';});

/* Scroll engine */
const hero=$('#home'),hm=$('#hmedia'),hi=$('#himg'),hs=$('#hshade'),t1=$('#t1'),t2=$('#t2'),hc=$('#hcopy'),hdr=$('#hdr'),hint=$('#hint'),hsl=$('#hsl'),hsr=$('#hsr');
const am=$('#amedia'),ai=$('#ai'),sc=$$('.scard'),tab=$('#tabbar');
const isD=()=>innerWidth>900;
function frame(){
 const vh=innerHeight,y=scrollY;
 /* hero */
 const hr=hero.getBoundingClientRect(),p=cl(-hr.top/(hr.height-vh)),a=ease(cl(p/.6));
 const st=isD()?[24,38,20]:[24,16,20];
 hm.style.clipPath=`inset(${lerp(st[0],0,a)}% ${lerp(st[1],0,a)}% ${lerp(st[2],0,a)}% ${lerp(st[1],0,a)}% round ${lerp(999,0,a)}px ${lerp(999,0,a)}px ${lerp(4,0,a)}px ${lerp(4,0,a)}px)`;
 hi.style.transform=`scale(${lerp(1.3,1.04,a)})`;hs.style.opacity=a;
 t1.style.transform=`translateY(${-a*vh*.42}px)`;t2.style.transform=`translateY(${a*vh*.42}px)`;t1.style.opacity=t2.style.opacity=1-a*1.3;
 hsl.style.opacity=hsr.style.opacity=hint.style.opacity=1-a*2;
 const c=ease(cl((p-.5)/.3));hc.style.opacity=c;hc.style.transform=`translateY(${(1-c)*40}px)`;hc.classList.toggle('on',c>.5);
 const inHero=hr.bottom>70;hdr.classList.toggle('light',inHero&&a>.55);hdr.classList.toggle('solid',!inHero);
 tab.classList.toggle('show',p>.55||!inHero);
 /* marquee */
 vel=lerp(vel,(y-lastY),.12);lastY=y;mx-=(.6+Math.abs(vel)*.25)*(RM?0:1);const w=$('#mq1').scrollWidth/3;if(mx<-w)mx+=w;
 $('#mq1').style.transform=`translateX(${mx}px) skewX(${cl(-vel*.15,-8,8)}deg)`;$('#mq2').style.transform=`translateX(${-w-mx}px) skewX(${cl(vel*.15,-8,8)}deg)`;
 /* manifesto */
 mw.forEach(s=>{const t=s.getBoundingClientRect().top;s.style.opacity=lerp(.14,1,cl((vh*.82-t)/(vh*.3)))});
 /* about */
 const ar=am.getBoundingClientRect(),ap=ease(cl((vh-ar.top)/(vh*.8)));
 am.style.clipPath=`inset(${lerp(18,0,ap)}% ${lerp(10,0,ap)}% ${lerp(18,0,ap)}% ${lerp(10,0,ap)}% round 999px 999px 0 0)`;
 ai.style.transform=`translateY(${(ar.top+ar.height/2-vh/2)*-.12}px) scale(${lerp(1.25,1,ap)})`;
 /* stack */
 sc.forEach((c,i)=>{const n=sc[i+1];if(!n){c.style.transform='';return}const r=c.getBoundingClientRect(),d=n.getBoundingClientRect().top-r.top,t=cl(1-d/r.height);
  c.style.transform=`scale(${1-t*.07})`;c.style.filter=`brightness(${1-t*.3})`});
 /* tabbar active */
 let cur='home';['leistungen','about','kontakt'].forEach(id=>{const r=document.getElementById(id).getBoundingClientRect();if(r.top<vh*.5)cur=id});
 $$('.tabbar [data-t]').forEach(x=>x.classList.toggle('on',x.dataset.t===cur));
 requestAnimationFrame(frame)}
requestAnimationFrame(()=>{cover();frame()});
addEventListener('resize',cover);

/* ===== BOOKING ===== */
const B={cat:SERVICES[0].cat,t:null,date:null,time:null,s:0,c:null};
const sheet=$('#sheet'),sbg=$('#sbg');
function openSheet(cat){if(typeof cat==='string'&&cat){B.cat=cat;const s=SERVICES.find(x=>x.cat===cat);if(s&&s.items.length===1)pick(s,0)}
 renderChips();if(!B.opened)B.opened=Date.now();sheet.classList.add('on');sbg.classList.add('on');document.body.classList.add('lock');go(B.s>3?0:B.s,true);buzz()}
function closeSheet(){sheet.classList.remove('on');sbg.classList.add('x');sbg.classList.remove('on');document.body.classList.remove('lock');sheet.style.transform=''}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o){e.preventDefault();openSheet(o.dataset.open)}});
$('#shX').onclick=closeSheet;sbg.onclick=closeSheet;addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
/* swipe down */
let sy=null,dy=0;const hd=$('#shHead');
hd.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;sheet.style.transition='none'},{passive:true});
hd.addEventListener('touchmove',e=>{if(sy===null)return;dy=Math.max(0,e.touches[0].clientY-sy);sheet.style.transform=`translate(-50%,${dy}px)`},{passive:true});
hd.addEventListener('touchend',()=>{sheet.style.transition='';if(dy>110)closeSheet();else sheet.style.transform='';sy=null;dy=0});

function renderChips(){const ch=$('#chips');ch.innerHTML='';SERVICES.forEach(s=>{const b=document.createElement('button');b.textContent=s.cat;b.classList.toggle('on',s.cat===B.cat);b.onclick=()=>{B.cat=s.cat;buzz();renderChips()};ch.appendChild(b)});
 const s=SERVICES.find(x=>x.cat===B.cat),tl=$('#tlist');tl.innerHTML='';
 s.items.forEach(([n,d,p],i)=>{const b=document.createElement('button');b.className='treat'+(B.t&&B.t.n===n?' on':'');b.style.animationDelay=i*70+'ms';
  b.innerHTML=`<span class="th" style="background-image:url(${s.img})"></span><span><span class="nm">${n}</span><br><span class="mt">${d} Min · ${s.cat}</span></span><span style="text-align:right"><span class="pr">${eur(p)}</span><span class="rad"></span></span>`;
  b.onclick=()=>{pick(s,i);buzz();renderChips();setTimeout(()=>go(1),280)};tl.appendChild(b)})}
function pick(s,i){const[n,d,p]=s.items[i];B.t={n,d,p,cat:s.cat};B.time=null;upd()}

const today=new Date();today.setHours(0,0,0,0);
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmt=d=>`${WD[d.getDay()]}, ${d.getDate()}. ${MONL[d.getMonth()]}`;
function slotsFor(d,dur){const h=CONFIG.hours[d.getDay()];if(!h||CONFIG.closed.includes(iso(d)))return[];const out=[],min=Date.now()+CONFIG.leadHours*36e5;
 for(let m=h[0]*60;m+dur<=h[1]*60;m+=CONFIG.step){const t=new Date(d);t.setHours(0,m,0,0);if(+t>=min)out.push(m)}return out}
const hhmm=m=>pad(Math.floor(m/60))+':'+pad(m%60);
function renderDates(){const ds=$('#dstrip');ds.innerHTML='';let first=null;
 for(let i=0;i<=CONFIG.daysAhead;i++){const d=new Date(today);d.setDate(d.getDate()+i);const ok=slotsFor(d,B.t.d).length>0;if(ok&&!first)first=d;
  const b=document.createElement('button');b.className='dbtn';b.disabled=!ok;b.innerHTML=`<small>${i===0?'Heute':i===1?'Morgen':WD[d.getDay()]}</small><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small>`;
  if(B.date&&+B.date===+d)b.classList.add('on');b.onclick=()=>{B.date=d;B.time=null;buzz();renderDates();renderSlots();upd()};ds.appendChild(b)}
 if(!B.date&&first){B.date=first;return renderDates()}
 $('#mLabel').textContent=B.date?MONL[B.date.getMonth()]+' '+B.date.getFullYear():'';
 const on=ds.querySelector('.on');if(on)ds.scrollTo({left:on.offsetLeft-ds.offsetWidth/2+32,behavior:'smooth'})}
function renderSlots(){const w=$('#slotWrap');w.innerHTML='';if(!B.date)return;const sl=slotsFor(B.date,B.t.d);
 if(!sl.length){w.innerHTML='<p class="empty">An diesem Tag ist nichts frei.</p>';return}
 [['Vormittag',0,720],['Nachmittag',720,1020],['Abend',1020,1440]].forEach(([l,a,b])=>{const g=sl.filter(m=>m>=a&&m<b);if(!g.length)return;
  const box=document.createElement('div');box.className='sgroup';box.innerHTML=`<div class="mlabel">${l}</div>`;const gr=document.createElement('div');gr.className='slots';
  g.forEach((m,i)=>{const b=document.createElement('button');b.textContent=hhmm(m);b.style.animationDelay=i*22+'ms';if(B.time===hhmm(m))b.classList.add('on');
   b.onclick=()=>{B.time=hhmm(m);buzz();$$('.slots button').forEach(x=>x.classList.toggle('on',x===b));upd()};gr.appendChild(b)});
  box.appendChild(gr);w.appendChild(box)})}

const LBL=['Weiter','Weiter','Zur Übersicht','Termin anfragen'];
function upd(){const n=$('#next');n.disabled=(B.s===0&&!B.t)||(B.s===1&&!B.time);n.innerHTML=LBL[B.s]+' <span class="ar">→</span>';
 const s=$('#sum');if(!B.t){s.innerHTML='<b>Behandlung wählen</b><span>Schritt für Schritt zum Termin</span>';return}
 s.innerHTML=`<b>${B.t.n}</b><span>${B.date&&B.time?fmt(B.date)+' · '+B.time:B.t.d+' Min'} · ${eur(B.t.p)}</span>`}
function go(n,silent){const back=n<B.s;B.s=n;$$('.pane').forEach(p=>{const on=+p.dataset.p===n;p.classList.toggle('on',on);p.classList.toggle('back',on&&back)});
 $('#prog').style.transform=`scaleX(${Math.min(n+1,4)/4})`;$('#stepL').textContent=n<4?`Schritt ${n+1} von 4`:'Fertig';
 $('#shFoot').style.display=n===4?'none':'';$('#back').style.visibility=n===0?'hidden':'visible';$('#shBody').scrollTop=0;
 if(n===1){renderDates();renderSlots()}if(n===3){recap('#recap');captcha()}upd()}
$('#back').onclick=()=>{buzz();go(B.s-1)};
$('#next').onclick=()=>{buzz();if(B.s===0||B.s===1)return go(B.s+1);if(B.s===2)return validate();if(B.s===3)send()};
const clean=(v,max)=>String(v||'').replace(/[\u0000-\u001F\u007F<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
function validate(){const name=clean($('#fName').value,80),tel=clean($('#fTel').value,30),mail=clean($('#fMail').value,120);let e='';$$('.field').forEach(f=>f.classList.remove('bad'));
 if(name.length<2){e='Bitte geben Sie Ihren Namen an.';$('#fName').parentNode.classList.add('bad')}
 else if(!/^[+\d][\d\s/()-]{5,}$/.test(tel)){e='Bitte geben Sie eine gültige Telefonnummer an.';$('#fTel').parentNode.classList.add('bad')}
 else if(mail&&!/^\S+@\S+\.\S+$/.test(mail)){e='Bitte prüfen Sie Ihre E-Mail-Adresse.';$('#fMail').parentNode.classList.add('bad')}
 else if(!$('#fOk').checked)e='Bitte bestätigen Sie die Einwilligung.';
 $('#err').textContent=e;if(!e){B.c={name,tel,mail,msg:clean($('#fMsg').value,500),neu:$('#fNew').checked};go(3)}}
function recap(sel){const r=$(sel);r.innerHTML='';const rows=[['Behandlung',B.t.n],['Termin',fmt(B.date)+', '+B.time+' Uhr'],['Dauer',B.t.d+' Minuten'],['Preis',eur(B.t.p)+(B.c.neu&&B.t.p?' · −15 %':'')],['Name',B.c.name],['Telefon',B.c.tel]];
 if(B.c.mail)rows.push(['E-Mail',B.c.mail]);if(B.c.msg)rows.push(['Hinweis',B.c.msg]);rows.forEach(([k,v])=>{const a=document.createElement('span');a.textContent=k;const b=document.createElement('span');b.textContent=v;r.append(a,b)})}
let tsLoaded=false,tsToken='';
function captcha(){const k=CONFIG.turnstileSiteKey;if(!k||tsLoaded)return;tsLoaded=true;window.nlTs=()=>window.turnstile.render('#captcha',{sitekey:k,theme:'light',language:'de',callback:t=>tsToken=t});
 const sc=document.createElement('script');sc.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=nlTs&render=explicit';sc.async=true;document.head.appendChild(sc)}
const lsGet=k=>{try{return +localStorage.getItem(k)||0}catch(e){return 0}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
async function send(){const n=$('#next');
 const bot=$('#fWeb').value!==''||(Date.now()-(B.opened||0))<CONFIG.minFillSeconds*1000;
 const wait=CONFIG.cooldownSeconds*1000-(Date.now()-lsGet('nl_last'));
 if(!bot&&wait>0){$('#err3').textContent=`Bitte warten Sie noch ${Math.ceil(wait/1000)} Sekunden, bevor Sie eine weitere Anfrage senden.`;return}
 if(!bot&&CONFIG.turnstileSiteKey&&!tsToken){$('#err3').textContent='Bitte bestätigen Sie kurz, dass Sie kein Roboter sind.';return}
 $('#err3').textContent='';n.disabled=true;
 if(CONFIG.demo){recap('#recap2');$('#doneH').textContent='Demo-Anfrage.';$('#doneP').textContent='Dies ist eine Vorschau. In der fertigen Website wird Ihre Anfrage direkt an NuraLuxe gesendet.';$('#waBtn').style.display='none';$('#gcBtn').style.display='none';n.disabled=false;go(4);return}const[hh,mm]=B.time.split(':').map(Number);const st=new Date(B.date);st.setHours(hh,mm,0,0);const en=new Date(+st+B.t.d*6e4);
 const payload={service:B.t.n,category:B.t.cat,duration:B.t.d,price:B.t.p,date:iso(B.date),time:B.time,start:st.toISOString(),...B.c,source:'website',created:new Date().toISOString()};
 payload.captcha=tsToken;let ok=false;
 if(!bot&&/^https:\/\//.test(CONFIG.webhook)){const ac=new AbortController();const to=setTimeout(()=>ac.abort(),8000);
  try{ok=(await fetch(CONFIG.webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit',referrerPolicy:'no-referrer',signal:ac.signal})).ok}catch(e){}clearTimeout(to)}
 if(!bot)lsSet('nl_last',Date.now());
 const msg=`Hallo NuraLuxe, ich möchte einen Termin anfragen:\n• ${B.t.n} (${B.t.d} Min)\n• ${fmt(B.date)}, ${B.time} Uhr\n• Name: ${B.c.name}\n• Tel.: ${B.c.tel}${B.c.neu?'\n• Neukundin (−15 % online)':''}${B.c.msg?'\n• Hinweis: '+B.c.msg:''}`;
 $('#waBtn').href=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
 const g=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
 $('#gcBtn').href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('NuraLuxe – '+B.t.n)}&dates=${g(st)}/${g(en)}&location=${encodeURIComponent('Beusselstraße 46, 10553 Berlin')}`;
 $('#doneH').innerHTML=ok?'Anfrage <em>erhalten.</em>':'Fast <em>geschafft.</em>';
 $('#doneP').textContent=ok?'Wir bestätigen Ihren Termin zeitnah per Telefon oder WhatsApp.':'Senden Sie Ihre Anfrage jetzt per WhatsApp – so erreicht sie uns sofort. Telefon: '+CONFIG.phone;
 $('#waBtn').firstChild.textContent=ok?'WhatsApp schreiben ':'Per WhatsApp senden ';
 recap('#recap2');n.disabled=false;go(4);try{navigator.vibrate&&navigator.vibrate([10,40,10])}catch(e){}}


/* Google Maps: 2-Klick-Lösung (DSGVO) */
$('#mapLoad').addEventListener('click',e=>{const m=$('#map');if(/claude/i.test(location.hostname)||location.protocol==='file:'||m.classList.contains('live'))return;
 e.preventDefault();const f=document.createElement('iframe');f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.title='Google Maps – NuraLuxe';f.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
 f.src='https://maps.google.com/maps?q=Beusselstra%C3%9Fe%2046%2C%2010553%20Berlin&z=16&output=embed';m.appendChild(f);f.onload=()=>m.classList.add('live');
 $('#mapLoad').lastChild.textContent='In Google Maps öffnen'});
/* next free slot + opening */
(function(){for(let i=0;i<14;i++){const d=new Date(today);d.setDate(d.getDate()+i);const s=slotsFor(d,45);if(s.length){$('#nextSlot').innerHTML=`Nächster freier Termin: <b>${i===0?'Heute':i===1?'Morgen':fmt(d)}, ${hhmm(s[0])} Uhr</b>`;break}}
 const n=new Date(),h=CONFIG.hours[n.getDay()],m=n.getHours()+n.getMinutes()/60,open=h&&m>=h[0]&&m<h[1];
 const o=$('#openN');o.textContent=open?'Jetzt geöffnet · bis '+h[1]+':00':'Aktuell geschlossen';o.style.setProperty('--c',open?'#6fae7b':'#c98a74');
 $$('#hours [data-d]').forEach(s=>{const d=+s.dataset.d;if((d===1&&n.getDay()>=1&&n.getDay()<=5)||d===n.getDay())s.classList.add('now')})})();
})();
