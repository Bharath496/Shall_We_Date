(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth chapter progress
  const progress = $('.progress i');
  const chapter = $('.chapter');
  const sections = $$('main > section');
  const chapterMap = new Map([
    ['home','01 / 05'],['moment','01 / 05'],['kiss','02 / 05'],['letter','03 / 05'],['question','04 / 05'],['date','05 / 05'],['ending','♡ / ♡']
  ]);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? Math.min(100, scrollY / max * 100) : 0}%`;
    let active = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .55) active = s; });
    chapter.textContent = chapterMap.get(active.id) || '01 / 05';
  };
  addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // Every CTA scrolls like a chapter in a love letter.
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    $(btn.dataset.scroll)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  // Cursor leaves tiny hearts behind on desktop.
  const cursor = $('.cursor-heart');
  let lastHeart = 0;
  addEventListener('pointermove', e => {
    if (innerWidth < 900 || reduceMotion) return;
    cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; cursor.style.opacity = '1';
    if (performance.now() - lastHeart < 180) return;
    lastHeart = performance.now();
    const heart = document.createElement('span');
    heart.textContent = Math.random() > .5 ? '·' : '♡';
    heart.style.cssText = `position:fixed;left:${e.clientX + (Math.random()*18-9)}px;top:${e.clientY + (Math.random()*18-9)}px;color:#eaa7b6;pointer-events:none;z-index:90;font-size:${8+Math.random()*7}px;transition:all 900ms ease;opacity:.8`;
    document.body.append(heart);
    requestAnimationFrame(() => { heart.style.transform = 'translateY(-28px) scale(.5)'; heart.style.opacity = '0'; });
    setTimeout(() => heart.remove(), 950);
  });
  addEventListener('pointerleave', () => cursor.style.opacity = '0');

  // Kiss scene: the two silhouettes gently close the distance.
  const kissStage = $('.kiss-stage');
  $('#kissBtn')?.addEventListener('click', () => {
    kissStage.classList.toggle('kissed');
    const btn = $('#kissBtn');
    btn.innerHTML = kissStage.classList.contains('kissed') ? 'stay here for a second <span>♥</span>' : 'let the moment breathe <span>♡</span>';
    if (kissStage.classList.contains('kissed')) burst(kissStage, 18, '✦');
  });

  // A little persuasion if they choose the shy option.
  const maybe = $('#maybeBtn');
  const micro = $('#micro');
  const nudges = ['okay… I can be patient ♡','one coffee. no pressure.','I promise good playlists.','fine, I will ask nicely again.','you are making me blush now.'];
  let nudge = 0;
  maybe?.addEventListener('click', () => {
    nudge = (nudge + 1) % nudges.length;
    micro.textContent = nudges[nudge];
    maybe.animate([{transform:'translateX(-7px)'},{transform:'translateX(7px)'},{transform:'translateX(0)'}], {duration:350});
  });

  // YES opens the second half of the experience instead of jumping abruptly.
  $('#yesBtn')?.addEventListener('click', () => {
    burst(document.body, 75, '♥');
    const question = $('#question');
    question.animate([{opacity:1},{opacity:.35},{opacity:1}], {duration:850, easing:'ease-out'});
    setTimeout(() => {
      $('#date').hidden = false;
      $('#date').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
      observeReveal();
    }, reduceMotion ? 100 : 650);
  });

  // Date choice becomes the final shared detail.
  $$('.date-card').forEach(card => card.addEventListener('click', () => {
    $$('.date-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const date = card.dataset.date;
    $('#date').animate([{transform:'scale(1)'},{transform:'scale(.99)'},{transform:'scale(1)'}], {duration:350});
    setTimeout(() => {
      $('#ending').hidden = false;
      $('#chosen').textContent = date;
      makeEndingHearts();
      $('#ending').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    }, reduceMotion ? 50 : 500);
  }));

  $('#restart')?.addEventListener('click', () => location.reload());

  function burst(parent, count, symbol) {
    if (reduceMotion) return;
    const rect = parent === document.body ? {left:0, top:0, width:innerWidth, height:innerHeight} : parent.getBoundingClientRect();
    for (let i=0;i<count;i++) {
      const el = document.createElement('i');
      el.textContent = symbol;
      el.style.cssText = `position:fixed;left:${rect.left + Math.random()*rect.width}px;top:${rect.top + Math.random()*rect.height}px;z-index:120;color:${Math.random()>.4?'#f0a7b8':'#f7d6cf'};font-style:normal;pointer-events:none;font-size:${10+Math.random()*18}px;transition:transform 1.2s cubic-bezier(.1,.7,.2,1),opacity 1.2s`;
      document.body.append(el);
      requestAnimationFrame(() => {
        const angle = Math.random()*Math.PI*2, distance = 70 + Math.random()*180;
        el.style.transform = `translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px) rotate(${Math.random()*180-90}deg) scale(.4)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1300);
    }
  }

  function makeEndingHearts() {
    const box = $('.ending-hearts');
    if (box.children.length) return;
    for (let i=0;i<22;i++) {
      const h = document.createElement('i'); h.textContent = i%3 ? '♡' : '✦';
      h.style.left = `${Math.random()*100}%`;
      h.style.bottom = `${-10 + Math.random()*30}%`;
      h.style.animationDelay = `${Math.random()*5}s`;
      h.style.animationDuration = `${5+Math.random()*5}s`;
      box.append(h);
    }
  }

  // Reveal cards as they enter the viewport.
  let observer;
  function observeReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    observer?.disconnect();
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}], {duration:900,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
      observer.unobserve(entry.target);
    }), {threshold:.12});
    $$('.memory,.letter-card,.date-card').forEach(el => observer.observe(el));
  }
  observeReveal();

  // Subtle tilt on memory cards.
  if (!reduceMotion && innerWidth > 900) {
    $$('.memory').forEach(card => card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(800px) rotateX(${y*-5}deg) rotateY(${x*6}deg) translateY(-8px)`;
    }));
    $$('.memory').forEach(card => card.addEventListener('pointerleave', () => card.style.transform = ''));
  }
})();