(function () {
  "use strict";

  var played = false;
  function RM() { return !!(window.ADate && window.ADate.prefersReducedMotion) && !!window.ADate.prefersReducedMotion(); }

  function start() {
    if (played) return;
    played = true;

    var loading = document.getElementById("loading");
    if (loading) {
      setTimeout(function () {
        loading.classList.add("hidden");
      }, RM() ? 50 : 400);
    }

    var line1 = document.getElementById("opening-line1");
    var line2 = document.getElementById("opening-line2");
    var light = document.getElementById("opening-light");
    var scene = document.getElementById("scene-opening");

    if (RM()) {
      if (light) { light.style.transform = "translate(-50%, -50%) scale(1)"; }
      if (line1) gsap.set(line1, { opacity: 1, filter: "blur(0px)", y: 0 });
      if (line2) gsap.set(line2, { opacity: 1, filter: "blur(0px)", y: 0 });
      setTimeout(goToStory, 500);
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        setTimeout(goToStory, 650);
      },
    });

    tl.fromTo(light, { scale: 0 }, {
      scale: 1,
      duration: 3.2,
      ease: "power2.out",
    }, 0);

    tl.fromTo(
      line1,
      { opacity: 0, filter: "blur(10px)", y: 12 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.1, ease: "power2.out" },
      2.2
    );

    tl.to({}, { duration: 1.4 }, "+=1.3");

    tl.fromTo(
      line2,
      { opacity: 0, filter: "blur(10px)", y: 12 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.1, ease: "power2.out" },
      "+=0.3"
    );

    tl.to({}, { duration: 1.2 }, "+=1.2");

    tl.to(scene, {
      opacity: 0,
      scale: 1.06,
      filter: "blur(8px)",
      duration: 0.9,
      ease: "power2.inOut",
    });
  }

  function goToStory() {
    if (window.ADate && window.ADate.timeline) {
      window.ADate.timeline.setMood("dawn");
    }
    if (window.ADate && window.ADate.particles) {
      window.ADate.particles.start();
    }

    var opening = document.getElementById("scene-opening");
    var story = document.getElementById("scene-story");

    if (opening) {
      opening.classList.remove("active");
      gsap.set(opening, { clearProps: "all" });
    }
    if (story) {
      gsap.fromTo(
        story,
        { opacity: 0, scale: 0.96, filter: "blur(10px)", visibility: "visible" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
      );
      story.classList.add("active");
    }

    window.scrollTo(0, 0);
  }

  window.ADate = window.ADate || {};
  window.ADate.opening = {
    start: start,
    goToStory: goToStory,
  };
})();