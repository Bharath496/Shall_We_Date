(function () {
  "use strict";

  var PICK_COUNT = 3;
  var chosen = null;
  function RM() { return !!(window.ADate && window.ADate.prefersReducedMotion) && !!window.ADate.prefersReducedMotion(); }

  function hideGroup(el) {
    if (!el) return;
    el.setAttribute("aria-hidden", "true");
    gsap.to(el, RM() ? { opacity: 0, duration: 0.01 } : { opacity: 0, duration: 0.4 });
  }

  function showGroup(el, dur) {
    if (!el) return;
    el.setAttribute("aria-hidden", "false");
    gsap.to(el, RM() ? { opacity: 1, duration: 0.01 } : { opacity: 1, duration: dur || 0.7, ease: "power2.out" });
  }

  function startYesFlow() {
    var yesScene = document.getElementById("scene-yes");
    var proposal = document.getElementById("scene-proposal");
    if (!yesScene) return;

    if (window.shutter && !RM()) window.shutter();
    if (window.ADate && window.ADate.transitions && !RM()) {
      window.ADate.transitions.flashWhite();
    }

    if (proposal) {
      proposal.classList.remove("active");
    }
    yesScene.classList.add("active");

    gsap.set(yesScene, { opacity: 0, visibility: "visible" });
    gsap.fromTo(
      yesScene,
      { opacity: 0, scale: 0.98, filter: "blur(8px)" },
      RM() ? { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.01 } : { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
    );

    if (window.ADate && window.ADate.timeline) window.ADate.timeline.setMood("night");
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.celebrate(window.innerWidth / 2, window.innerHeight * 0.4);
    }

    var count = document.getElementById("count-01");
    if (count) {
      gsap.fromTo(count, RM() ? { opacity: 1 } : { opacity: 0, scale: 1.3 }, RM() ? { opacity: 1, duration: 0.01 } : { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" });
    }
    var line = document.getElementById("yes-first-line");
    if (line) {
      gsap.fromTo(line, RM() ? { opacity: 1 } : { opacity: 0, y: 12 }, RM() ? { opacity: 1, duration: 0.01 } : { opacity: 1, y: 0, duration: 0.8, delay: 0.8 });
    }
    var btn = document.getElementById("btn-to-dates");
    if (btn) {
      gsap.fromTo(btn, RM() ? { opacity: 1 } : { opacity: 0 }, RM() ? { opacity: 1, duration: 0.01 } : { opacity: 1, duration: 0.6, delay: 1.6 });
    }

    window.scrollTo(0, 0);
  }

  function openGenerator() {
    var white = document.getElementById("white-flash-01");
    var gen = document.getElementById("scene-generator");
    if (!gen) return;

    if (window.shutter && !RM()) window.shutter();
    if (window.ADate && window.ADate.transitions && !RM()) {
      window.ADate.transitions.flashWhite();
    }

    if (white) hideGroup(white);
    if (gen) {
      showGroup(gen, RM() ? 0.01 : 0.9);
      setTimeout(function () {
        var cards = gen.querySelectorAll(".date-card");
        cards.forEach(function (c, i) {
          gsap.fromTo(
            c,
            { opacity: 0, x: 40 },
            RM() ? { opacity: 1, x: 0, duration: 0.01 } : { opacity: 1, x: 0, duration: 0.55, delay: i * 0.06, ease: "power2.out" }
          );
        });
      }, 350);
    }
  }

  function pickThree() {
    var gen = document.getElementById("scene-generator");
    var choose = document.getElementById("scene-choose");
    var container = document.getElementById("choose-cards");
    if (!gen || !choose || !container) return;

    var cards = Array.prototype.slice.call(document.querySelectorAll(".date-card"));
    var pool = cards.slice().sort(function () { return Math.random() - 0.5; }).slice(0, PICK_COUNT);
    chosen = pool;

    hideGroup(gen);
    choose.setAttribute("aria-hidden", "false");
    container.innerHTML = "";

    pool.forEach(function (card, i) {
      var activity = card.getAttribute("data-activity");
      var emojiEl = card.querySelector(".emoji");
      var emoji = emojiEl ? emojiEl.textContent : "?";
      var el = document.createElement("button");
      el.className = "pick-card";
      el.setAttribute("data-activity", activity);
      el.setAttribute("tabindex", "0");
      el.innerHTML = '<span class="emoji">' + emoji + '</span><span class="q-mask">?</span><h3>' + activity + "</h3>";
      el.addEventListener("click", function () {
        chooseDate(activity, el);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          chooseDate(activity, el);
        }
      });
      container.appendChild(el);

      gsap.fromTo(
        el,
        { opacity: 0, y: 26, scale: 0.9 },
        RM() ? { opacity: 1, y: 0, scale: 1, duration: 0.01 } : { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.12, ease: "back.out(1.5)" }
      );
    });

    setTimeout(function () {
      showGroup(choose, RM() ? 0.01 : 0.8);
    }, RM() ? 50 : 400);
  }

  function explodeCard(cardEl) {
    var rect = cardEl.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    if (window.ADate && window.ADate.particles && !RM()) {
      window.ADate.particles.celebrate(cx, cy);
    }
    gsap.to(cardEl, RM() ? { opacity: 0, duration: 0.01 } : {
      opacity: 0,
      scale: 1.15,
      filter: "blur(6px)",
      duration: 0.4,
      ease: "power2.in",
    });
  }

  function chooseDate(activity, cardEl) {
    var choose = document.getElementById("scene-choose");
    var final = document.getElementById("scene-final");
    if (!choose || !final) return;

    explodeCard(cardEl);

    setTimeout(function () {
      choose.setAttribute("aria-hidden", "true");
      final.setAttribute("aria-hidden", "false");

      var planTitle = document.getElementById("plan-title");
      if (planTitle) planTitle.textContent = activity;

      var chooseCards = choose.querySelectorAll(".pick-card");
      chooseCards.forEach(function (c) {
        gsap.to(c, RM() ? { opacity: 0, duration: 0.01 } : { opacity: 0, y: 20, duration: 0.35 });
      });

      setTimeout(function () {
        showGroup(final, RM() ? 0.01 : 0.9);
        finalScene(activity);
      }, RM() ? 50 : 450);
    }, RM() ? 50 : 420);
  }

  function finalScene(activity) {
    if (window.ADate && window.ADate.timeline) window.ADate.timeline.setMood("sunrise");
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.setMood("sunrise");
      if (!RM()) window.ADate.particles.celebrate(window.innerWidth / 2, window.innerHeight * 0.35);
    }

    var c1 = document.getElementById("final-line-1");
    var c2 = document.getElementById("final-line-2");
    var btn = document.getElementById("btn-begin");
    var plan = document.getElementById("date-plan");

    if (RM()) {
      if (c1) gsap.set(c1, { opacity: 1, y: 0, filter: "blur(0px)" });
      if (c2) gsap.set(c2, { opacity: 1, y: 0, filter: "blur(0px)" });
      if (btn) gsap.set(btn, { opacity: 1 });
      var fconstR = document.getElementById("final-constellation");
      if (fconstR) gsap.set(fconstR, { opacity: 1 });
      if (plan) {
        plan.setAttribute("aria-hidden", "false");
        gsap.set(plan, { opacity: 1, y: 0 });
      }
      return;
    }

    if (c1) gsap.fromTo(c1, { opacity: 0, y: 12, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.3 });
    if (c2) gsap.fromTo(c2, { opacity: 0, y: 12, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 1.1 });
    if (btn) gsap.fromTo(btn, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 2 });

    var fconst = document.getElementById("final-constellation");
    if (fconst) {
      gsap.to(fconst, { opacity: 1, duration: 1.6, delay: 0.2 });
    }

    if (plan) {
      plan.setAttribute("aria-hidden", "false");
      gsap.fromTo(plan, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: 2.9, ease: "power2.out" });
    }
    window.scrollTo(0, 0);
  }

  function beginPlan() {
    var btn = document.getElementById("btn-begin");
    var plan = document.getElementById("date-plan");
    if (btn) {
      gsap.to(btn, { opacity: 0, y: 10, duration: 0.35 });
      setTimeout(function () {
        btn.style.display = "none";
      }, 350);
    }
    if (plan) {
      plan.setAttribute("aria-hidden", "false");
      gsap.fromTo(plan, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
    }
  }

  window.ADate = window.ADate || {};
  window.ADate.date = {
    startYesFlow: startYesFlow,
    openGenerator: openGenerator,
    pickThree: pickThree,
    chooseDate: chooseDate,
    beginPlan: beginPlan,
  };
})();