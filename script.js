(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glow = document.querySelector('.cursor-glow');

  if (glow && !reduceMotion) {
    window.addEventListener('pointermove', e => {
      glow.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:700,fill:'forwards',easing:'ease-out'});
    }, {passive:true});
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12,rootMargin:'0px 0px -40px'});
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  const yesBtn = document.getElementById('yesBtn');
  const maybeBtn = document.getElementById('maybeBtn');
  const answerMessage = document.getElementById('answerMessage');

  yesBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'Okay. That was the answer I was hoping for. ♥';
    yesBtn.textContent = 'YES — IT IS A DATE ✓';
    yesBtn.disabled = true;
    yesBtn.style.opacity = '.7';
    showToast('It is officially a date. ♥');
    setTimeout(() => document.getElementById('date')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'}), 650);
  });

  maybeBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'No pressure. We can talk first — I still like the idea. ♡';
    showToast('Take your time.');
  });

  const dateOptions = [...document.querySelectorAll('.date-option')];
  const selectedName = document.getElementById('selectedDateName');
  const resetDate = document.getElementById('resetDate');

  dateOptions.forEach(card => {
    card.addEventListener('click', () => {
      dateOptions.forEach(item => item.classList.remove('selected'));
      card.classList.add('selected');
      selectedName.textContent = card.dataset.date;
      showToast(`${card.dataset.date} — excellent choice.`);
    });
  });

  resetDate?.addEventListener('click', () => {
    dateOptions.forEach(item => item.classList.remove('selected'));
    selectedName.textContent = 'Choose a card above';
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth',block:'start'});
    });
  });

  // Subtle card tilt on desktop; disabled for touch and reduced-motion users.
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.moment-card,.date-option,.question-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();