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

  function boot() {
    if (booted) return;
    booted = true;

    initLenis();

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    hideInitial();

    if (window.ADate && window.ADate.timeline) {
      setTimeout(function () {
        try { window.ADate.timeline.init(); } catch (e) { }
      }, 120);
    }

    if (window.ADate && window.ADate.memories) {
      try { window.ADate.memories.init(); } catch (e) { }
      try { window.ADate.memories.wire(); } catch (e) { }
    }

    try { wireButtons(); } catch (e) { }

    if (window.ADate && window.ADate.particles) {
      try { window.ADate.particles.start(); } catch (e) { }
    }

    if (window.ADate && window.ADate.opening) {
      setTimeout(function () {
        try { window.ADate.opening.start(); } catch (e) {
          var loading = document.getElementById("loading");
          if (loading) loading.classList.add("hidden");
        }
      }, 550);
    }

    setTimeout(function () {
      var loading = document.getElementById("loading");
      if (loading) loading.classList.add("hidden");
    }, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
