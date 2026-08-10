(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const glow = document.querySelector('.cursor-glow');
  if (glow && finePointer && !reduceMotion) {
    let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
    const move=()=>{gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(move)};move();
  }
  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduceMotion){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -45px'});revealItems.forEach(el=>observer.observe(el))}else revealItems.forEach(el=>el.classList.add('visible'));
  const toast=document.getElementById('toast');let toastTimer;
  function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
  const scene=document.querySelector('.hero-scene');
  if(scene&&finePointer&&!reduceMotion){scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;scene.style.transform=`perspective(1100px) rotateY(${x*5}deg) rotateX(${y*-4}deg)`});scene.addEventListener('pointerleave',()=>scene.style.transform='')}
  const yesBtn=document.getElementById('yesBtn'),maybeBtn=document.getElementById('maybeBtn'),answerMessage=document.getElementById('answerMessage');
  function burstHearts(source){if(reduceMotion)return;const r=source.getBoundingClientRect();for(let i=0;i<18;i++){const h=document.createElement('span');h.textContent=i%3?'♡':'♥';h.style.cssText=`position:fixed;z-index:2000;pointer-events:none;left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;color:#e98f91;font-size:${12+Math.random()*15}px;animation:burstHeart 1.3s ease-out forwards;--x:${(Math.random()-.5)*260}px;--y:${-80-Math.random()*220}px`;document.body.appendChild(h);setTimeout(()=>h.remove(),1400)}}
  yesBtn?.addEventListener('click',()=>{answerMessage.textContent='Okay. That was the answer I was hoping for. ♥';yesBtn.innerHTML='YES — IT IS A DATE ✓';yesBtn.disabled=true;yesBtn.style.opacity='.72';showToast('It is officially a date. ♥');burstHearts(yesBtn);setTimeout(()=>document.getElementById('date')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'}),700)});
  maybeBtn?.addEventListener('click',()=>{answerMessage.textContent='No pressure. We can talk first — I still like the idea. ♡';showToast('Take your time.')});
  const dateOptions=[...document.querySelectorAll('.date-option')],selectedName=document.getElementById('selectedDateName'),resetDate=document.getElementById('resetDate');
  dateOptions.forEach(card=>card.addEventListener('click',()=>{dateOptions.forEach(x=>x.classList.remove('selected'));card.classList.add('selected');selectedName.textContent=card.dataset.date;showToast(`${card.dataset.date} — excellent choice. ♥`);burstHearts(card)}));
  resetDate?.addEventListener('click',()=>{dateOptions.forEach(x=>x.classList.remove('selected'));selectedName.textContent='Choose one above'});
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.getAttribute('href'));if(!target)return;event.preventDefault();target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'})}));
  if(finePointer&&!reduceMotion){document.querySelectorAll('.button,.nav-cta,.soft-link').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.12}px,${y*.12}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}
})();