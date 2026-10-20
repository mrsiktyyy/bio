/* ==========================================================
   Phoenix Team — фон (Js/bg.js)
   Мягкое сияние (CSS, только transform) + снег на canvas.
   Без filter: blur, пауза во вкладке в фоне, учёт reduced-motion.
   ========================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Стили слоя ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.bg-layer{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:0;animation:bgIn 1200ms ease 100ms forwards}' +
    '@keyframes bgIn{to{opacity:1}}' +
    '.bg-blob{position:absolute;width:70vmax;height:70vmax;border-radius:50%;will-change:transform}' +
    '.bg-blob.b1{left:-20vmax;top:-25vmax;background:radial-gradient(circle,rgba(140,182,255,.20),rgba(140,182,255,0) 65%);animation:bgA 38s ease-in-out infinite alternate}' +
    '.bg-blob.b2{right:-25vmax;top:10vmax;background:radial-gradient(circle,rgba(124,92,255,.17),rgba(124,92,255,0) 65%);animation:bgB 46s ease-in-out infinite alternate}' +
    '.bg-blob.b3{left:10vmax;bottom:-35vmax;background:radial-gradient(circle,rgba(140,159,255,.14),rgba(140,159,255,0) 65%);animation:bgC 52s ease-in-out infinite alternate}' +
    '@keyframes bgA{to{transform:translate3d(18vmax,12vmax,0) scale(1.15)}}' +
    '@keyframes bgB{to{transform:translate3d(-16vmax,10vmax,0) scale(.9)}}' +
    '@keyframes bgC{to{transform:translate3d(14vmax,-12vmax,0) scale(1.12)}}' +
    '.bg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(13,13,15,0) 40%,rgba(13,13,15,.55) 100%)}' +
    '.bg-snow{position:absolute;inset:0;width:100%;height:100%}';
  document.head.appendChild(css);

  /* ---------- Слой ---------- */
  var layer = document.createElement('div');
  layer.className = 'bg-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="bg-blob b1"></div><div class="bg-blob b2"></div><div class="bg-blob b3"></div><div class="bg-vignette"></div>';
  document.body.prepend(layer);

  if (reduce) return; // без анимации снега

  /* ---------- Снег ---------- */
  var canvas = document.createElement('canvas');
  canvas.className = 'bg-snow';
  layer.insertBefore(canvas, layer.querySelector('.bg-vignette'));
  var ctx = canvas.getContext('2d');

  // готовый мягкий спрайт снежинки — рисуется быстрее, чем blur на каждый кадр
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  var sctx = sprite.getContext('2d');
  var g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, 32, 32);

  var w = 0, h = 0, dpr = 1, flakes = [];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function make(initial) {
    var depth = Math.random();                 // 0 — далеко, 1 — близко
    return {
      x: rnd(0, w),
      y: initial ? rnd(0, h) : rnd(-40, -5),
      r: 3 + depth * 7,                        // радиус спрайта
      vy: 14 + depth * 36,                     // px/сек
      sway: rnd(8, 26),
      speed: rnd(0.3, 0.9),
      phase: rnd(0, Math.PI * 2),
      a: 0.25 + depth * 0.5
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.max(24, Math.min(80, Math.round(w * h / 24000)));
    while (flakes.length < count) flakes.push(make(true));
    flakes.length = count;
  }

  var last = 0, raf = 0, t = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min((now - last) / 1000, 0.05); // защита от скачков после паузы
    last = now;
    t += dt;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt;
      var x = f.x + Math.sin(t * f.speed + f.phase) * f.sway;
      if (f.y - f.r > h) { flakes[i] = f = make(false); x = f.x; }
      ctx.globalAlpha = f.a;
      ctx.drawImage(sprite, x - f.r, f.y - f.r, f.r * 2, f.r * 2);
    }
    ctx.globalAlpha = 1;
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  resize();
  start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
