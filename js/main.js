const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=document.querySelector('#intro');
document.querySelector('#enter')?.addEventListener('click',()=>{intro?.classList.add('gone');document.body.classList.remove('lock');document.querySelector('.hero .reveal')?.classList.add('show')});

/* Cinematic couple renderer — built from layered CSS shapes, no external assets. */
const cinematicCSS=`
.stage{isolation:isolate;background:radial-gradient(circle at 50% 58%,rgba(232,169,184,.12),transparent 17%),radial-gradient(circle at 72% 22%,rgba(119,116,216,.13),transparent 24%),linear-gradient(180deg,#101328 0%,#090a19 52%,#03040b 100%)!important}
.stage:before{background:radial-gradient(circle at 50% 53%,rgba(255,220,188,.035),transparent 17%),linear-gradient(115deg,transparent 30%,rgba(255,255,255,.018) 50%,transparent 70%)!important;animation:cinemaGlow 9s ease-in-out infinite!important}
.stage:after{pointer-events:none}
.moon{background:radial-gradient(circle at 34% 28%,#fffdf5 0 8%,transparent 9%),radial-gradient(circle at 63% 68%,rgba(174,164,151,.18) 0 5%,transparent 6%),radial-gradient(circle at 45% 54%,rgba(194,185,170,.12) 0 4%,transparent 5%),#f5efe2!important;box-shadow:0 0 32px rgba(255,246,220,.32),0 0 100px rgba(240,213,161,.16),0 0 180px rgba(255,255,255,.05)!important}
.moon:after{content:"";position:absolute;inset:-28px;border-radius:50%;background:radial-gradient(circle,rgba(255,246,220,.12),transparent 66%);filter:blur(8px)}
.hill{height:250px!important;bottom:-125px!important;background:radial-gradient(ellipse at 50% 0%,#151522 0%,#080811 48%,#030309 75%)!important;box-shadow:0 -25px 80px rgba(0,0,0,.7)!important}
.person{width:220px!important;height:410px!important;bottom:30px!important;z-index:4;transform-origin:50% 100%;transition:transform 1.8s cubic-bezier(.16,.84,.24,1)!important;filter:drop-shadow(0 20px 18px rgba(0,0,0,.35))}
.person:before,.person:after{display:none!important}
.person .head{position:absolute;left:76px;top:18px;width:68px;height:80px;border-radius:48% 48% 46% 46%;z-index:7;background:linear-gradient(110deg,#6f473e 0%,#b97d69 48%,#e0aa90 100%);box-shadow:inset -8px -9px 16px rgba(70,32,31,.22),inset 5px 3px 10px rgba(255,220,199,.18)}
.person .hair{position:absolute;left:70px;top:7px;width:80px;height:76px;border-radius:52% 55% 38% 35%;z-index:9;background:radial-gradient(circle at 55% 25%,#3a2627,#17141d 68%);box-shadow:-8px 12px 0 -4px #19151c,12px 18px 0 -5px #211820}
.person .neck{position:absolute;left:93px;top:86px;width:35px;height:45px;z-index:5;background:linear-gradient(90deg,#754d44,#c38b75 55%,#8d5d50);border-radius:0 0 13px 13px}
.person .torso{position:absolute;left:40px;top:105px;width:140px;height:245px;z-index:4;border-radius:55px 55px 24px 24px;background:linear-gradient(95deg,#090b16 0%,#1b1d2d 32%,#3a3c50 62%,#121522 100%);box-shadow:inset 16px 8px 35px rgba(255,255,255,.035),inset -20px -10px 45px rgba(0,0,0,.45)}
.person .torso:after{content:"";position:absolute;left:68px;top:0;width:4px;height:210px;background:linear-gradient(#65677933,transparent);border-radius:9px}
.person .arm{position:absolute;top:126px;width:43px;height:190px;z-index:3;border-radius:25px;background:linear-gradient(100deg,#10121f,#34374a 65%,#0d0f19);transform-origin:top center;box-shadow:inset 6px 0 13px rgba(255,255,255,.035)}
.person .arm.left{left:31px;transform:rotate(7deg)}.person .arm.right{right:31px;transform:rotate(-7deg)}
.person .hand{position:absolute;width:30px;height:38px;border-radius:45%;background:linear-gradient(145deg,#b97966,#e0a58b);z-index:6;top:294px;box-shadow:inset -4px -4px 8px rgba(70,25,25,.15)}
.person .hand.left{left:36px}.person .hand.right{right:36px}
.person .legs{position:absolute;left:57px;top:322px;width:106px;height:88px;z-index:2;background:linear-gradient(90deg,#080a13 0 45%,#1a1c2a 46% 54%,#080a13 55%);border-radius:10px 10px 20px 20px;clip-path:polygon(0 0,100% 0,88% 100%,58% 100%,50% 25%,42% 100%,12% 100%)}
.person .shoe{position:absolute;bottom:0;width:67px;height:20px;border-radius:50% 45% 25% 25%;background:#06070c;z-index:1}.person .shoe.left{left:44px}.person .shoe.right{right:44px}
.p2 .head{background:linear-gradient(110deg,#805447,#c9917b 50%,#e8b39a)}
.p2 .hair{background:radial-gradient(circle at 45% 20%,#4a302b,#1a1417 68%);height:86px;border-radius:52% 50% 42% 45%}
.p2 .torso{background:linear-gradient(95deg,#171827,#454557 55%,#151622)}
.p2 .arm.left{transform:rotate(12deg)}.p2 .arm.right{transform:rotate(-11deg)}
.p2 .legs{background:linear-gradient(90deg,#0b0c15,#242637 50%,#0a0b13)}
.person .face-light{position:absolute;left:89px;top:43px;width:42px;height:20px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,224,206,.18),transparent 70%);z-index:10}
.person .hair-strand{position:absolute;left:66px;top:24px;width:27px;height:85px;border-left:8px solid #1a1418;border-radius:50%;z-index:11;transform:rotate(9deg)}
.person.breath{animation:personBreath 5s ease-in-out infinite}
.stage:not(.kiss) .p1{animation:lookOne 6s ease-in-out infinite}.stage:not(.kiss) .p2{animation:lookTwo 6s ease-in-out infinite}
.stage.kiss .p1{transform:translateX(-18%) translateY(1px) rotate(4deg)!important}.stage.kiss .p2{transform:translateX(18%) translateY(1px) rotate(-4deg)!important}
.stage.kiss .p1 .head{transform:rotate(11deg) translate(7px,7px)}.stage.kiss .p2 .head{transform:rotate(-11deg) translate(-7px,7px)}
.stage.kiss .p1 .arm.right{transform:rotate(-16deg)}.stage.kiss .p2 .arm.left{transform:rotate(16deg)}
.stage.kiss .p1 .hand.right{right:24px;top:291px}.stage.kiss .p2 .hand.left{left:24px;top:291px}
@keyframes personBreath{0%,100%{translate:0 0}50%{translate:0 -2px}}@keyframes lookOne{0%,100%{rotate:0deg}50%{rotate:-.6deg}}@keyframes lookTwo{0%,100%{rotate:0deg}50%{rotate:.6deg}}@keyframes cinemaGlow{0%,100%{opacity:.8;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
.kiss-heart{position:absolute;left:50%;top:45%;z-index:15;pointer-events:none;opacity:0;font-size:17px;color:#f2c9d1;text-shadow:0 0 25px #e9a9b7;animation:heartFloat 2.6s ease forwards}
@keyframes heartFloat{0%{opacity:0;transform:translate(-50%,15px) scale(.4)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-75px) scale(1.15)}}
@media(max-width:700px){.person{width:180px!important;height:350px!important;transform:scale(.82)!important}.person .head{left:62px}.person .hair{left:56px}.person .neck{left:78px}.person .torso{left:31px;width:118px}.person .arm.left{left:24px}.person .arm.right{right:24px}.person .hand.left{left:29px}.person .hand.right{right:29px}.person .legs{left:48px;width:84px}.person .shoe.left{left:35px}.person .shoe.right{right:35px}.stage.kiss .p1{transform:translateX(-13%) scale(.82) rotate(4deg)!important}.stage.kiss .p2{transform:translateX(13%) scale(.82) rotate(-4deg)!important}}
`;
const style=document.createElement('style');style.id='cinematic-couple-style';style.textContent=cinematicCSS;document.head.appendChild(style);

function buildPeople(){document.querySelectorAll('.person').forEach(person=>{if(person.dataset.built)return;person.dataset.built='1';person.classList.add('breath');const parts=['head','hair','neck','torso','arm left','arm right','hand left','hand right','legs','shoe left','shoe right','face-light','hair-strand'];parts.forEach(name=>{const el=document.createElement('span');el.className=name;person.appendChild(el)});});}
buildPeople();

const canvas=document.querySelector('#space'),ctx=canvas?.getContext('2d');let stars=[],w=0,h=0,mx=.5,my=.5;
function resize(){if(!canvas)return;const d=devicePixelRatio||1;w=innerWidth;h=innerHeight;canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:w<700?130:280},()=>({x:Math.random()*w,y:Math.random()*h,r:.15+Math.random()*1.15,z:Math.random(),p:Math.random()*6.28}))}resize();addEventListener('resize',resize);addEventListener('pointermove',e=>{mx=e.clientX/w-.5;my=e.clientY/h-.5});
function render(t){if(!ctx)return;ctx.clearRect(0,0,w,h);for(const s of stars){const depth=.35+s.z*1.8,tw=.5+Math.sin(t*.0012+s.p)*.25;ctx.globalAlpha=tw*(.35+s.z*.65);ctx.fillStyle=s.z>.9?'#fff3d2':'#d8d8ec';ctx.beginPath();ctx.arc(s.x+mx*18*depth,s.y+my*12*depth,s.r*(.7+s.z),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;if(!reduce)requestAnimationFrame(render)}requestAnimationFrame(render);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.18});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const stage=document.querySelector('#stage');stage?.addEventListener('click',()=>{stage.classList.toggle('kiss');if(stage.classList.contains('kiss')){const heart=document.createElement('span');heart.className='kiss-heart';heart.textContent='♥';stage.appendChild(heart);setTimeout(()=>heart.remove(),2700)}});
const yes=document.querySelector('#yes'),later=document.querySelector('#later'),answer=document.querySelector('#answer');yes?.addEventListener('click',()=>{answer.innerHTML='<h4>Then it\'s a date. ❤️</h4><p>Maybe this is where our next chapter begins.</p>';document.querySelector('#date')?.scrollIntoView({behavior:reduce?'auto':'smooth'})});later?.addEventListener('click',()=>answer.innerHTML='<p>No pressure. Take your time. I\'ll still be glad you read this.</p>');
document.querySelectorAll('.date').forEach(card=>card.addEventListener('click',()=>{document.querySelectorAll('.date').forEach(x=>x.classList.remove('active'));card.classList.add('active');const out=document.querySelector('#dateAnswer');if(out)out.innerHTML='<h4>It\'s a plan. ✨</h4><p>'+card.textContent.trim()+' sounds perfect.</p>'}));
