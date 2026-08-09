(function () {
  "use strict";

  var lenis = null;
  var booted = false;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  window.ADate = window.ADate || {};
  window.ADate.prefersReducedMotion = prefersReducedMotion;

  var ZERO = { duration: 0, ease: "none" };

  function initLenis() {
    if (typeof Lenis === "undefined") return;
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ smoothWheel: true, duration: 1.15 });
    lenis.on("scroll", function () {
      if (window.ScrollTrigger) ScrollTrigger.update();
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function wireButtons() {
    var btnProposal = document.getElementById("btn-proposal");
    if (btnProposal) {
      btnProposal.addEventListener("click", function () {
        if (window.ADate && window.ADate.proposal) {
          window.ADate.proposal.enterScene("scene-story");
        }
      });
    }

    var btnEnv = document.getElementById("btn-envelope");
    if (btnEnv) {
      btnEnv.addEventListener("click", function () {
        if (window.ADate && window.ADate.proposal) {
          window.ADate.proposal.openEnvelope();
        }
      });
    }

    var btnYes = document.getElementById("btn-yes-big");
    if (btnYes) {
      btnYes.addEventListener("click", function () {
        if (window.ADate && window.ADate.proposal) {
          window.ADate.proposal.onYes();
        }
      });
    }

    var btnTalk = document.getElementById("btn-talk");
    if (btnTalk) {
      btnTalk.addEventListener("click", function () {
        if (window.ADate && window.ADate.proposal) {
          window.ADate.proposal.onTalk();
        }
      });
    }

    var btnAnswer = document.getElementById("btn-answer");
    if (btnAnswer) {
      btnAnswer.addEventListener("click", function () {
        if (window.ADate && window.ADate.proposal) {
          window.ADate.proposal.onAnswer();
        }
      });
    }

    var btnDates = document.getElementById("btn-to-dates");
    if (btnDates) {
      btnDates.addEventListener("click", function () {
        if (window.ADate && window.ADate.date) {
          window.ADate.date.openGenerator();
        }
      });
    }

    var btnPick = document.getElementById("btn-pick");
    if (btnPick) {
      btnPick.addEventListener("click", function () {
        if (window.ADate && window.ADate.date) {
          window.ADate.date.pickThree();
        }
      });
    }

    var btnBegin = document.getElementById("btn-begin");
    if (btnBegin) {
      btnBegin.addEventListener("click", function () {
        if (window.ADate && window.ADate.date) {
          window.ADate.date.beginPlan();
        }
      });
    }
  }

  function hideInitial() {
    if (typeof gsap === "undefined") return;
    gsap.set(".opening-line", { opacity: 0, filter: "blur(10px)", y: 12 });
    gsap.set(".chapter", { opacity: 0, scale: 0.96, filter: "blur(10px)" });
    gsap.set(".chapter-end", { opacity: 0 });
    gsap.set(".mood-tag", { opacity: 0 });
    gsap.set("#moment-field", { opacity: 0 });
    gsap.set(".prop-line", { opacity: 0, filter: "blur(8px)", y: 10 });
    gsap.set("#envelope-wrap", { opacity: 0, visibility: "hidden" });
    gsap.set(".env-paper", { opacity: 0 });
    gsap.set("#constellation", { opacity: 0 });
    gsap.set("#final-constellation", { opacity: 0 });
    gsap.set("#final-line-1, #final-line-2", { opacity: 0, filter: "blur(8px)" });
    gsap.set("#btn-begin", { opacity: 0 });
  }

  function setStatus(msg) {
    var el = document.getElementById("adate-status");
    if (el) el.textContent = msg;
  }

  function forceGoToStory() {
    setStatus("force→story");
    try {
      if (window.ADate && window.ADate.opening && window.ADate.opening.goToStory) {
        window.ADate.opening.goToStory();
      } else {
        var opening = document.getElementById("scene-opening");
        var story = document.getElementById("scene-story");
        if (opening) { opening.classList.remove("active"); gsap.set(opening, { clearProps: "all" }); }
        if (story) { story.classList.add("active"); gsap.set(story, { opacity: 1, visibility: "visible" }); }
        window.scrollTo(0, 0);
      }
    } catch (e) { console.error("[ADate] forceGoToStory failed:", e); }
  }

  function boot() {
    if (booted) return;
    booted = true;
    setStatus("booting…");

    initLenis();

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    hideInitial();

    if (window.ADate && window.ADate.timeline) {
      setTimeout(function () {
        try { window.ADate.timeline.init(); } catch (e) { console.error("[ADate] timeline.init failed:", e); }
      }, 120);
    }

    if (window.ADate && window.ADate.memories) {
      try { window.ADate.memories.init(); } catch (e) { console.error("[ADate] memories.init failed:", e); }
      try { window.ADate.memories.wire(); } catch (e) { console.error("[ADate] memories.wire failed:", e); }
    }

    try { wireButtons(); } catch (e) { console.error("[ADate] wireButtons failed:", e); }

    if (window.ADate && window.ADate.particles) {
      try { window.ADate.particles.start(); } catch (e) { console.error("[ADate] particles.start failed:", e); }
    }

    if (window.ADate && window.ADate.opening) {
      setStatus("opening…");
      setTimeout(function () {
        try { window.ADate.opening.start(); } catch (e) {
          console.error("[ADate] opening.start failed:", e);
          setStatus("opening FAILED — fallback");
          var loading = document.getElementById("loading");
          if (loading) loading.classList.add("hidden");
          setTimeout(forceGoToStory, 300);
        }
      }, 550);
    } else {
      console.error("[ADate] window.ADate.opening is undefined — script may have failed to load");
      setStatus("opening MISSING — fallback");
      var loading = document.getElementById("loading");
      if (loading) loading.classList.add("hidden");
      setTimeout(forceGoToStory, 300);
    }

    setTimeout(function () {
      var loading = document.getElementById("loading");
      if (loading) loading.classList.add("hidden");
    }, 4000);

    setTimeout(function () {
      var story = document.getElementById("scene-story");
      if (story && !story.classList.contains("active")) {
        console.error("[ADate] Safety fallback: story not active after 12s, forcing transition");
        forceGoToStory();
      }
    }, 12000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
