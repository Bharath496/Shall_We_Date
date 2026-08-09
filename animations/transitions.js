(function () {
  "use strict";

  var fadeGroup = function (el, show, dur) {
    if (!el) return;
    el.setAttribute("aria-hidden", show ? "false" : "true");
  };

  function linearCurtain(options) {
    return new Promise(function (resolve) {
      var flash = document.getElementById("flash");
      var curtain = document.getElementById("curtain");
      var o = options || {};

      if (o.flashFirst && flash) {
        gsap.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.in", onComplete: function () {
          gsap.to(flash, { opacity: 0, duration: 0.4, delay: 0.12 });
        } });
      }

      if (o.out && curtain) {
        gsap.fromTo(curtain, { opacity: 0, scale: 1 }, {
          opacity: 1,
          duration: o.dur || 0.55,
          ease: "power2.inOut",
          onComplete: function () {
            gsap.to(curtain, { opacity: 0, duration: o.dur || 0.55, ease: "power2.inOut" });
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }

  window.swapScene = function (fromId, toId, options) {
    var from = document.getElementById(fromId);
    var to = document.getElementById(toId);
    var opts = options || {};
    var tl = gsap.timeline({
      onComplete: function () {
        gsap.set(from, { clearProps: "transform,filter,visibility" });
        from.classList.remove("active");
        gsap.set(to, { clearProps: "transform,filter" });
        to.classList.add("active");
      },
    });

    if (from) {
      tl.to(from, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(8px)",
        duration: opts.dur || 0.5,
        ease: "power2.inOut",
      });
    }

    tl.add(function () {
      if (to) {
        gsap.fromTo(
          to,
          { opacity: 0, scale: 0.96, filter: "blur(10px)", visibility: "visible" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out", delay: 0.08 }
        );
      }
    }, "+=0.05");

    return tl;
  };

  window.flashWhite = function (keepHidden) {
    return new Promise(function (resolve) {
      var flash = document.getElementById("flash");
      var tl = gsap.timeline({
        onComplete: function () {
          if (keepHidden) gsap.set(flash, { opacity: 0 });
          resolve();
        },
      });
      tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.in" });
      tl.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out", delay: 0.15 });
    });
  };

  window.ADate = window.ADate || {};
  window.ADate.transitions = {
    curtain: linearCurtain,
    swapScene: swapScene,
    flashWhite: flashWhite,
    fadeGroup: fadeGroup,
  };
})();