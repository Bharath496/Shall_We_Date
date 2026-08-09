(function () {
  "use strict";

  function RM() { return !!(window.ADate && window.ADate.prefersReducedMotion) && !!window.ADate.prefersReducedMotion(); }
  var ZERO = { duration: 0, ease: "none" };

  var STATE = {
    entered: false,
    envelopeOpen: false,
    answered: false,
  };

  var CONSTELLATION_STARS = [
    { x: 22, y: 30 },
    { x: 42, y: 18 },
    { x: 60, y: 26 },
    { x: 74, y: 44 },
    { x: 58, y: 58 },
    { x: 38, y: 52 },
  ];
  var CONSTELLATION_LINES = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4],
  ];

  function buildStars() {
    var sky = document.getElementById("proposal-sky");
    if (!sky) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 90; i++) {
      var s = document.createElement("span");
      s.className = "star-point";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.width = s.style.height = (Math.random() < 0.8 ? 1.5 : 2.5) + "px";
      s.style.animationDelay = Math.random() * 4 + "s";
      frag.appendChild(s);
    }
    sky.appendChild(frag);
  }

  function drawConstellation() {
    var svg = document.getElementById("constellation");
    if (!svg) return;
    svg.innerHTML = "";
    var NS = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    var lineGroup = document.createElementNS(NS, "g");
    CONSTELLATION_LINES.forEach(function (pair) {
      var a = CONSTELLATION_STARS[pair[0]];
      var b = CONSTELLATION_STARS[pair[1]];
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x);
      line.setAttribute("y2", b.y);
      line.setAttribute("stroke", "rgba(230,201,143,0.8)");
      line.setAttribute("stroke-width", "0.25");
      line.setAttribute("class", "const-line");
      line.style.strokeDasharray = "6";
      line.style.strokeDashoffset = "6";
      lineGroup.appendChild(line);
    });
    svg.appendChild(lineGroup);

    CONSTELLATION_STARS.forEach(function (pt) {
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);
      dot.setAttribute("r", "1.2");
      dot.setAttribute("fill", "#e6c98f");
      dot.setAttribute("class", "const-star");
      svg.appendChild(dot);
    });
  }

  function animateConstellation() {
    var svg = document.getElementById("constellation");
    if (!svg) return;
    gsap.to(svg, { opacity: 1, duration: 1.4, ease: "power2.out" });
    var lines = svg.querySelectorAll(".const-line");
    lines.forEach(function (ln, i) {
      gsap.to(ln, {
        strokeDashoffset: 0,
        duration: 1.1,
        delay: 0.4 + i * 0.22,
        ease: "power2.inOut",
      });
    });
    var dots = svg.querySelectorAll(".const-star");
    dots.forEach(function (d, i) {
      gsap.fromTo(
        d,
        { r: 0.4, opacity: 0.3 },
        { r: 1.2, opacity: 1, duration: 0.6, delay: 0.5 + i * 0.12 }
      );
    });
  }

  function showLine(el) {
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 12, filter: "blur(8px)" },
      RM() ? { opacity: 1, y: 0, filter: "blur(0px)", duration: 0 } : { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
    );
  }

  function enterScene(fromId) {
    if (STATE.entered) return;
    STATE.entered = true;

    var proposal = document.getElementById("scene-proposal");
    if (!proposal) return;

    var from = fromId ? document.getElementById(fromId) : null;
    if (from) {
      gsap.to(from, RM() ? ZERO : { opacity: 0, scale: 1.04, filter: "blur(8px)", duration: 0.5, ease: "power2.inOut" });
      from.classList.remove("active");
    }

    proposal.classList.add("active");
    gsap.fromTo(
      proposal,
      { opacity: 0, scale: 0.96, filter: "blur(10px)", visibility: "visible" },
      RM() ? { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0 } : { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out", delay: 0.05 }
    );

    if (window.ADate && window.ADate.timeline) window.ADate.timeline.setMood("night");
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.setMood("night");
      if (!RM()) window.ADate.particles.start();
    }

    if (RM()) {
      showLine(document.getElementById("prop-line-1"));
      showLine(document.getElementById("prop-line-2"));
      showLine(document.getElementById("prop-line-3"));
      var wrap0 = document.getElementById("envelope-wrap");
      if (wrap0) {
        wrap0.style.visibility = "visible";
        wrap0.style.opacity = 1;
      }
      return;
    }

    buildStars();
    drawConstellation();
    animateConstellation();

    setTimeout(function () {
      showLine(document.getElementById("prop-line-1"));
    }, 900);
    setTimeout(function () {
      showLine(document.getElementById("prop-line-2"));
    }, 3200);
    setTimeout(function () {
      showLine(document.getElementById("prop-line-3"));
      setTimeout(function () {
        var wrap = document.getElementById("envelope-wrap");
        if (wrap) {
          gsap.set(wrap, { visibility: "visible" });
          gsap.fromTo(wrap, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        }
      }, 1800);
    }, 5400);

    window.scrollTo(0, 0);
  }

  function openEnvelope() {
    if (STATE.envelopeOpen) return;
    STATE.envelopeOpen = true;

    var paper = document.getElementById("env-paper");
    var top = document.querySelector(".env-top");
    var seal = document.querySelector(".env-seal");
    var choices = document.getElementById("proposal-choices");

    if (top) {
      gsap.to(top, RM() ? ZERO : { rotationX: 180, transformOrigin: "top", duration: 0.7, ease: "power2.inOut" });
    }
    if (seal) {
      gsap.to(seal, RM() ? { opacity: 0, duration: 0.01 } : { opacity: 0, scale: 1.5, duration: 0.4 });
    }
    if (paper) {
      gsap.to(paper, RM() ? { opacity: 1, top: "8%", bottom: "auto", duration: 0.01 } : {
        opacity: 1,
        y: 0,
        top: "8%",
        bottom: "auto",
        duration: 0.9,
        delay: 0.5,
        ease: "power3.out",
      });
    }

    gsap.to(choices, RM() ? ZERO : { opacity: 1, duration: 0.7, delay: 1.5 });
    setTimeout(function () {
      if (choices) choices.setAttribute("aria-hidden", "false");
    }, RM() ? 50 : 1450);
  }

  function onYes() {
    if (STATE.answered) return;
    STATE.answered = true;
    if (window.ADate && window.ADate.date) {
      window.ADate.date.startYesFlow();
    }
  }

  function onTalk() {
    var choices = document.getElementById("proposal-choices");
    var panel = document.getElementById("talk-panel");
    if (!panel) return;
    gsap.to(choices, { opacity: 0, duration: 0.4 });
    setTimeout(function () {
      if (choices) choices.setAttribute("aria-hidden", "true");
      if (panel) {
        panel.setAttribute("aria-hidden", "false");
        gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
      }
    }, 380);
  }

  function onAnswer() {
    var panel = document.getElementById("talk-panel");
    var choices = document.getElementById("proposal-choices");
    if (!panel || !choices) return;
    gsap.to(panel, { opacity: 0, duration: 0.4 });
    setTimeout(function () {
      panel.setAttribute("aria-hidden", "true");
      choices.setAttribute("aria-hidden", "false");
      gsap.fromTo(choices, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    }, 380);
  }

  window.ADate = window.ADate || {};
  window.ADate.proposal = {
    enterScene: enterScene,
    openEnvelope: openEnvelope,
    onYes: onYes,
    onTalk: onTalk,
    onAnswer: onAnswer,
  };
})();