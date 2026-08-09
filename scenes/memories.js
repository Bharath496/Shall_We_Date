(function () {
  "use strict";

  var MOMENTS = [
    {
      icon: "🌙",
      title: "The late night",
      kicker: "moment one",
      x: "12%",
      y: "34vh",
      delay: 0,
      body: "We talked until the moon gave up and the sun came to check on us. Neither of us wanted to say goodnight first.",
    },
    {
      icon: "✨",
      title: "The quiet spark",
      kicker: "moment two",
      x: "82%",
      y: "48vh",
      delay: 0.3,
      body: "One small laugh. One split second of eye contact that said more than any conversation we ever had.",
    },
    {
      icon: "📷",
      title: "The photo",
      kicker: "moment three",
      x: "16%",
      y: "60vh",
      delay: 0.6,
      body: "Neither of us looks ready. But whenever I scroll back to it, I remember exactly how warm that day felt.",
    },
    {
      icon: "🎵",
      title: "The song",
      kicker: "moment four",
      x: "78%",
      y: "72vh",
      delay: 0.9,
      body: "Every time that song plays somewhere, the whole world recedes for a second. I never skip it.",
    },
    {
      icon: "💌",
      title: "The one I never sent",
      kicker: "moment five",
      x: "45%",
      y: "86vh",
      delay: 1.2,
      body: "I wrote it twice. Deleted it twice. Some words are too big for a message screen — so I built this instead.",
    },
  ];

  var built = false;
  var currentIndex = -1;
  var lastFocused = null;
  function RM() { return !!(window.ADate && window.ADate.prefersReducedMotion) && !!window.ADate.prefersReducedMotion(); }

  function onKey(e) {
    if (e.key === "Escape") closeMoment();
    if (e.key === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    var modal = document.getElementById("moment-modal");
    if (!modal || !modal.classList.contains("open")) return;
    var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function build() {
    if (built) return;
    built = true;

    document.addEventListener("keydown", onKey);

    var field = document.getElementById("moment-field");
    if (!field) return;

    MOMENTS.forEach(function (m, i) {
      var el = document.createElement("button");
      el.className = "floating";
      el.setAttribute("aria-label", m.title);
      el.setAttribute("aria-haspopup", "dialog");
      el.textContent = m.icon;
      el.style.left = m.x;
      el.style.top = m.y;
      el.style.animationDelay = m.delay + "s";
      el.setAttribute("data-moment", String(i));
      el.addEventListener("click", function () {
        openMoment(i);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMoment(i);
        }
      });
      field.appendChild(el);

      gsap.fromTo(
        el,
        { scale: 0, opacity: 0 },
        RM() ? { scale: 1, opacity: 1, duration: 0.01 } : {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: field,
            start: "top 78%",
            once: true,
          },
        }
      );

      if (!RM()) {
        gsap.to(el, {
          y: "+=12",
          duration: 2.6 + m.delay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
  }

  function openMoment(idx) {
    currentIndex = idx;
    var modal = document.getElementById("moment-modal");
    if (!modal) return;

    var m = MOMENTS[idx];
    document.getElementById("m-modal-kicker").textContent = m.kicker;
    document.getElementById("m-modal-title").textContent = m.title;
    document.getElementById("m-modal-body").textContent = m.body;

    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (RM()) {
      gsap.set(modal.querySelector(".modal-card"), { scale: 1, opacity: 1 });
    } else {
      gsap.fromTo(modal.querySelector(".modal-card"), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" });
    }
    var replayBtn = document.getElementById("m-replay");
    if (replayBtn) replayBtn.focus();
    if (window.ADate && window.ADate.particles && !RM()) {
      window.ADate.particles.celebrate(window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  function closeMoment() {
    var modal = document.getElementById("moment-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    currentIndex = -1;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function replay() {
    if (currentIndex < 0) return;
    var m = MOMENTS[currentIndex];
    var modal = document.getElementById("moment-modal");
    var card = modal ? modal.querySelector(".modal-card") : null;
    if (card) {
      document.getElementById("m-modal-kicker").textContent = m.kicker;
      document.getElementById("m-modal-title").textContent = m.title;
      document.getElementById("m-modal-body").textContent = m.body;
      gsap.fromTo(
        card,
        { scale: 0.94, opacity: 0.4, filter: "blur(6px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
      );
    }
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.celebrate(undefined, undefined);
    }
  }

  window.ADate = window.ADate || {};
  window.ADate.memories = {
    init: build,
    openMoment: openMoment,
    closeMoment: closeMoment,
    replay: replay,
  };

  function wire() {
    var mClose = document.getElementById("m-close");
    var mReplay = document.getElementById("m-replay");
    if (mClose) mClose.addEventListener("click", closeMoment);
    if (mReplay) mReplay.addEventListener("click", replay);
  }
  window.ADate.memories.wire = wire;
})();