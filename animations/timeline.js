(function () {
  "use strict";

  function RM() { return !!(window.ADate && window.ADate.prefersReducedMotion) && !!window.ADate.prefersReducedMotion(); }

  var MOODS = ["dawn", "day", "rain", "night", "sunrise"];
  var MOOD_LABELS = { dawn: "a warm morning", day: "bright daylight", rain: "a quiet storm", night: "the night before I ask", sunrise: "a new beginning" };
  var current = "night";

  function setMood(mood) {
    if (MOODS.indexOf(mood) === -1) return;
    current = mood;
    document.body.setAttribute("data-mood", mood);
    var tag = document.getElementById("mood-tag");
    if (tag) {
      tag.textContent = "· " + MOOD_LABELS[mood] + " ·";
      gsap.to(tag, { opacity: 1, duration: 0.8, yoyo: true, repeat: 1, repeatDelay: 2.4 });
    }
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.setMood(mood);
    }
  }

  function buildStoryScroll() {
    var gsapLib = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (!gsapLib || !ScrollTrigger) return;

    if (RM()) {
      document.querySelectorAll(".chapter").forEach(function (ch) {
        ch.style.opacity = 1;
        ch.style.visibility = "visible";
        ch.style.transform = "scale(1)";
        ch.style.filter = "blur(0px)";
      });
      var endEl = document.getElementById("chapter-end");
      if (endEl) endEl.style.opacity = 1;
      return;
    }

    gsapLib.registerPlugin(ScrollTrigger);

    var spacer = document.getElementById("story-spacer");
    var pin = document.getElementById("story-pin");
    if (!spacer || !pin) return;

    var line = document.getElementById("timeline-line");
    var dots = document.querySelectorAll(".tl-dot");
    var chapters = document.querySelectorAll(".chapter");
    var end = document.getElementById("chapter-end");

    var tl = gsapLib.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(line, { height: "100%", ease: "none" }, 0);

    chapters.forEach(function (ch, i) {
      var art = ch.querySelector(".visual-art");
      var texts = ch.querySelectorAll(".chapter-kicker, h2, .chapter-body");
      var startAt = i / chapters.length;
      tl.fromTo(
        ch,
        { opacity: 0, scale: 0.94, filter: "blur(10px)", visibility: "visible" },
        { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.5 },
        startAt
      );
      tl.fromTo(
        ch,
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 1.06, filter: "blur(8px)", ease: "power2.in", duration: 0.5 },
        startAt + 0.4
      );
      if (art) {
        tl.fromTo(art, { scale: 0.88, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5 }, startAt);
      }
      if (texts.length) {
        tl.fromTo(
          texts,
          { opacity: 0, y: 14, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.08, duration: 0.4 },
          startAt + 0.05
        );
      }
    });

    tl.to(end, { opacity: 1, duration: 0.4 }, chapters.length / chapters.length - 0.1);

    ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: function (self) {
        var p = self.progress;
        var idx = Math.min(MOODS.length - 1, Math.floor(p * MOODS.length));
        setMood(MOODS[idx]);

        dots.forEach(function (dot, i) {
          var active = p >= (i + 0.5) / dots.length;
          gsapLib.to(dot, {
            background: active ? "var(--gold-bright)" : "var(--ink-soft)",
            boxShadow: active ? "0 0 14px rgba(201,168,106,0.7)" : "none",
            duration: 0.2,
          });
        });
      },
    });

    var field = document.getElementById("moment-field");
    if (field) {
      ScrollTrigger.create({
        trigger: spacer,
        start: "30% 70%",
        end: "60% 30%",
        scrub: 1,
        onUpdate: function (self) {
          field.style.opacity = self.progress;
        },
      });
    }
  }

  window.ADate = window.ADate || {};
  window.ADate.timeline = {
    init: buildStoryScroll,
    setMood: setMood,
  };
})();