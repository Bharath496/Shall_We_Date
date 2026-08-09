(function () {
  "use strict";

  var canvas = document.getElementById("particles");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var modes = {
    night: { amount: 110, type: "stars" },
    dawn: { amount: 30, type: "sparks" },
    day: { amount: 50, type: "dust" },
    rain: { amount: 90, type: "rain" },
    sunrise: { amount: 40, type: "confetti-slow" },
  };

  var mood = "night";
  var parts = [];
  var confetti = [];
  var raf = null;
  var running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnStar(p) {
    var s = rand(0.3, 1.7);
    p.x = rand(0, canvas.width);
    p.y = rand(0, canvas.height);
    p.r = s;
    p.tw = rand(0, Math.PI * 2);
    p.ts = rand(0.01, 0.06);
    p.alpha = rand(0.2, 0.9);
    p.color = Math.random() < 0.75 ? "240,239,228" : "201,168,106";
  }

  function spawnSpark(p) {
    p.x = rand(0, canvas.width);
    p.y = canvas.height + rand(0, 200);
    p.vy = rand(0.15, 0.55);
    p.vx = rand(-0.2, 0.2);
    p.life = 0;
    p.max = rand(500, 900);
    p.r = rand(0.5, 2);
    p.color = Math.random() < 0.6 ? "201,168,106" : "242,211,161";
  }

  function spawnDust(p) {
    p.x = rand(0, canvas.width);
    p.y = rand(0, canvas.height);
    p.vy = rand(-0.15, -0.35);
    p.vx = rand(-0.1, 0.1);
    p.r = rand(0.4, 1.6);
    p.alpha = rand(0.08, 0.35);
    p.sw = rand(0, Math.PI * 2);
    p.ss = rand(0.005, 0.015);
    p.color = "168,200,232";
  }

  function spawnRain(p) {
    p.x = rand(-20, canvas.width);
    p.y = rand(-canvas.height, 0);
    p.vy = rand(5, 9);
    p.len = rand(8, 18);
    p.alpha = rand(0.2, 0.5);
  }

  function spawnConfettiSlow(p) {
    p.x = rand(0, canvas.width);
    p.y = rand(-canvas.height, 0);
    p.vy = rand(0.8, 2);
    p.vx = rand(-0.2, 0.2);
    p.r = rand(1.5, 3.5);
    p.color = Math.random() < 0.5 ? "230,201,143" : "212,150,150";
    p.spin = rand(0.01, 0.05);
    p.rot = rand(0, Math.PI * 2);
  }

  function buildFor(m) {
    parts = [];
    var cfg = modes[m] || modes.night;
    for (var i = 0; i < cfg.amount; i++) {
      var p = {};
      if (cfg.type === "stars") spawnStar(p);
      else if (cfg.type === "sparks") spawnSpark(p);
      else if (cfg.type === "dust") spawnDust(p);
      else if (cfg.type === "rain") spawnRain(p);
      else if (cfg.type === "confetti-slow") spawnConfettiSlow(p);
      parts.push(p);
    }
  }

  function draw() {
    var cfg = modes[mood] || modes.night;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (cfg.type === "stars") {
        p.tw += p.ts;
        var a = p.alpha * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = "rgba(" + p.color + ",1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (cfg.type === "sparks") {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.13;
        p.life++;
        if (p.life > p.max || p.y < -20) spawnSpark(p);
        var fade = Math.min(1, (p.max - p.life) / 120);
        ctx.globalAlpha = fade;
        ctx.fillStyle = "rgba(" + p.color + ",1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (cfg.type === "dust") {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.sw) * 0.05;
        p.sw += p.ss;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = rand(0, canvas.width); }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(" + p.color + ",1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (cfg.type === "rain") {
        p.y += p.vy;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = rand(-20, canvas.width); }
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = "#9aa8c8";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.5, p.y - p.len);
        ctx.stroke();
      } else if (cfg.type === "confetti-slow") {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.rot) * 0.24;
        p.rot += p.spin;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = rand(0, canvas.width); }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = "rgba(" + p.color + ",1)";
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.4);
        ctx.restore();
      }
    }

    for (var c = 0; c < confetti.length; c++) {
      var cp = confetti[c];
      cp.vy += 0.08;
      cp.y += cp.vy;
      cp.x += cp.vx + Math.sin(cp.rot) * 0.4;
      cp.rot += cp.spin;
      cp.life++;
      if (cp.life > cp.max || cp.y > canvas.height + 20) {
        confetti.splice(c, 1);
        c--;
        continue;
      }
      ctx.save();
      ctx.translate(cp.x, cp.y);
      ctx.rotate(cp.rot);
      ctx.globalAlpha = Math.min(1, 1 - cp.life / cp.max);
      ctx.fillStyle = cp.color;
      ctx.fillRect(-cp.r, -cp.r / 2, cp.r * 2, cp.r);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setMood(m) {
    mood = m || "night";
    buildFor(mood);
  }

  function celebrate(x, y) {
    var cx = typeof x === "number" ? x : canvas.width / 2;
    var cy = typeof y === "number" ? y : canvas.height * 0.4;
    var colors = ["rgba(230,201,143,1)", "rgba(240,239,228,1)", "rgba(212,182,150,1)", "rgba(201,168,106,1)"];
    for (var i = 0; i < 120; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = rand(2, 9);
      confetti.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 3,
        r: rand(2, 5),
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.12, 0.12),
        life: 0,
        max: rand(90, 160),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  resize();
  buildFor("night");

  window.ADate = window.ADate || {};
  window.ADate.particles = {
    start: start,
    stop: stop,
    setMood: setMood,
    celebrate: celebrate,
  };
})();