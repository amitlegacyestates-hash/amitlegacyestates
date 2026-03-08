/* ═══ AMIT LEGACY ESTATES — EXTRAS JS ═══ */

/* ── LUCKNOW SLIDER ── */
(function(){
  const track=document.getElementById('lknTrack');
  if(!track)return;
  const dots=Array.from(document.querySelectorAll('#lknDots .lkn-dot'));
  let cur=0;
  function getPV(){return window.innerWidth>=1024?3:window.innerWidth>=768?2:1;}
  function go(i){
    const pv=getPV();
    const max=track.children.length-pv;
    cur=Math.max(0,Math.min(i,max));
    const w=100/pv;
    Array.from(track.children).forEach(s=>{s.style.minWidth=w+'%';s.style.width=w+'%';});
    track.style.transform=`translateX(-${cur*w}%)`;
    dots.forEach((d,j)=>d.classList.toggle('active',j===cur));
  }
  go(0);
  dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
  window.addEventListener('resize',()=>go(cur));
  setInterval(()=>{const pv=getPV();go(cur>=track.children.length-pv?0:cur+1);},4200);
})();

/* ── COUNTDOWN TIMER ── */
(function(){
  if(!document.getElementById('cdD'))return;
  const target=new Date(Date.now()+7*24*60*60*1000);
  function upd(){
    const diff=target-new Date();
    if(diff<=0)return;
    const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000);
    const m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
    [['cdD',d],['cdH',h],['cdM',m],['cdS',s]].forEach(([id,v])=>{
      const el=document.getElementById(id);if(el)el.textContent=String(v).padStart(2,'0');
    });
  }
  upd();setInterval(upd,1000);
})();

/* ── AMENITY ANIMATED REVEAL ── */
(function(){
  const items=document.querySelectorAll('.amenity-item');
  if(!items.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('anim-in');io.unobserve(e.target);}});
  },{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
  items.forEach(el=>io.observe(el));
})();

/* ── CALC TABS (if any) ── */
(function(){
  document.querySelectorAll('[data-panel]').forEach(btn=>{
    btn.addEventListener('click',function(){
      const wrap=this.closest('[data-tab-group]')||this.closest('.cpc');
      if(!wrap)return;
      wrap.querySelectorAll('[data-panel]').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      const pid=this.dataset.panel;
      wrap.querySelectorAll('.calc-panel').forEach(p=>p.classList.toggle('active',p.id===pid));
    });
  });
})();
