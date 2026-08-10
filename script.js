(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stars: generated once so the scene feels alive without a dependency.
  const stars = $('#stars');
  if (stars) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 75; i++) {
      const star = document.createElement('i');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--d', `${2 + Math.random() * 4}s`);
      star.style.animationDelay = `${Math.random() * 4}s`;
      frag.appendChild(star);
    }
    stars.appendChild(frag);
  }

  const kissStars = $('.kiss-stars');
  if (kissStars) {
    for (let i = 0; i < 32; i++) {
      const s = document.createElement('i');
      s.className = 'star';
      s.style.left = `${10 + Math.random() * 80}%`;
      s.style.top = `${8 + Math.random() * 78}%`;
      s.style.setProperty('--d', `${2 + Math.random() * 5}s`);
      s.style.animationDelay = `${Math.random() * 3}s`;
      kissStars.appendChild(s);
    }
  }

  // Gentle pointer parallax for the hero couple.
  const hero = $('.hero');
  const couple = $('#couple');
  if (hero && couple && !reduced) {
    hero.addEventListener('pointermove', (event) => {
      const x = event.clientX / innerWidth - .5;
      const y = event.clientY / innerHeight - .5;
      couple.style.transform = `translate(${x * 14}px, ${30 + y * 12}px) rotateY(${x * 5}deg)`;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      couple.style.transform = '';
    });
  }

  // Tiny hearts follow meaningful pointer movement on desktop.
  const heartCursor = $('.cursor-heart');
  let lastHeart = 0;
  if (heartCursor && !reduced && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', (e) => {
      heartCursor.style.left = `${e.clientX}px`;
      heartCursor.style.top = `${e.clientY}px`;
      heartCursor.style.opacity = '0.7';
      if (performance.now() - lastHeart > 260 && Math.random() > .7) {
        lastHeart = performance.now();
        const h = document.createElement('span');
        h.textContent = '♥';
        h.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:80;pointer-events:none;color:#f27b8e;font-size:${8 + Math.random()*8}px;animation:floatHeart .9s ease-out forwards;`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 950);
      }
    }, { passive: true });
  }

  // Falling petals only begin after the user has entered the story.
  let petalTimer;
  const petals = $('#petals');
  const dropPetal = () => {
    if (!petals || reduced || document.hidden) return;
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--x', `${-100 + Math.random() * 200}px`);
    p.style.setProperty('--fall', `${5 + Math.random() * 5}s`);
    p.style.transform = `scale(${.55 + Math.random() * .8})`;
    petals.appendChild(p);
    setTimeout(() => p.remove(), 11000);
  };
  const startPetals = () => {
    if (petalTimer || reduced) return;
    petalTimer = setInterval(dropPetal, 850);
  };
  const storyObserver = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) startPetals();
  }, { threshold: .15 });
  if ($('#story')) storyObserver.observe($('#story'));

  // Scroll reveal: uses IntersectionObserver instead of a heavy animation framework.
  const revealTargets = $$('.memory, .section-intro, .kiss-copy, .kiss-stage, .letter-card, .question > *:not(.question-bg), .date-section > *');
  if (!reduced) {
    revealTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity .9s cubic-bezier(.2,.7,.2,1) ${Math.min(i * 60, 260)}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${Math.min(i * 60, 260)}ms`;
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }

  // Sound button: browser-safe ambient interaction using Web Audio, no audio file required.
  const soundToggle = $('#soundToggle');
  let audio;
  let hum;
  if (soundToggle) soundToggle.addEventListener('click', () => {
    if (!audio) {
      audio = new (window.AudioContext || window.webkitAudioContext)();
      const master = audio.createGain();
      master.gain.value = .018;
      master.connect(audio.destination);
      const osc = audio.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 174;
      osc.connect(master);
      osc.start();
      hum = { master, osc };
    }
    if (audio.state === 'suspended') audio.resume();
    const on = soundToggle.getAttribute('aria-pressed') === 'true';
    soundToggle.setAttribute('aria-pressed', String(!on));
    if (hum) hum.master.gain.setTargetAtTime(on ? 0 : .018, audio.currentTime, .25);
  });

  // Proposal interaction.
  const yes = $('#yesBtn');
  const maybe = $('#maybeBtn');
  const micro = $('#microCopy');
  const dateSection = $('#dateSection');
  const messages = [
    'okay… I am smiling way too hard right now.',
    'I had a feeling you would say that. ♡',
    'then let’s make a memory worth keeping.',
  ];
  let maybeCount = 0;

  const celebrate = () => {
    if (!yes || !dateSection) return;
    const rect = yes.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < (reduced ? 12 : 46); i++) {
      const p = document.createElement('i');
      p.className = 'confetti-piece';
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      const angle = (Math.PI * 2 * i) / 46;
      const distance = 80 + Math.random() * 230;
      p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      p.style.setProperty('--r', `${Math.random() * 360}deg`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
    yes.disabled = true;
    yes.textContent = 'yes. ♡';
    micro.textContent = messages[maybeCount % messages.length];
    setTimeout(() => {
      dateSection.classList.add('show');
      dateSection.setAttribute('aria-hidden', 'false');
      dateSection.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }, reduced ? 0 : 900);
  };
  if (yes) yes.addEventListener('click', celebrate);

  if (maybe) maybe.addEventListener('click', () => {
    maybeCount++;
    const phrases = [
      'I like your smile. A lot.',
      'I will share my fries. That is serious.',
      'I will remember the little things.',
      'And yes… forehead kisses are included.',
      'Still here? Then I really like you. ♡',
    ];
    micro.textContent = phrases[Math.min(maybeCount - 1, phrases.length - 1)];
    maybe.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' },
    ], { duration: 330 });
    if (maybeCount >= 4) maybe.textContent = 'okay, your turn ♡';
  });

  // Date choice becomes the final personal message.
  $$('.date-option').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.date-option').forEach(b => b.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      const chosen = $('#chosen');
      const chosenText = $('#chosenText');
      chosenText.textContent = button.dataset.date;
      chosen.classList.add('show');
      button.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.035) rotate(-1deg)' },
        { transform: 'scale(1)' },
      ], { duration: 500 });
      if (!reduced) burstRose();
    });
  });

  function burstRose() {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i');
      p.className = 'confetti-piece';
      p.style.left = '50%';
      p.style.top = '72%';
      const a = Math.random() * Math.PI * 2;
      const d = 50 + Math.random() * 130;
      p.style.setProperty('--x', `${Math.cos(a) * d}px`);
      p.style.setProperty('--y', `${Math.sin(a) * d}px`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  $('#restart')?.addEventListener('click', () => {
    location.hash = 'home';
    location.reload();
  });

  // Inject the small cursor-heart animation without polluting the stylesheet.
  const style = document.createElement('style');
  style.textContent = '@keyframes floatHeart{to{transform:translateY(-24px) scale(.5);opacity:0}}';
  document.head.appendChild(style);
})();