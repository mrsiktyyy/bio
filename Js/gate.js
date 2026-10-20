/* ==========================================================
   Phoenix Team — проверка «Я не робот» (Js/gate.js)
   Показывается после интро. После успеха запоминается на 12 часов.
   ВАЖНО: это клиентская проверка. Она отсекает простых ботов
   и автоматизацию (navigator.webdriver, нет реального клика/движения),
   но не заменяет серверную защиту (Vercel Firewall / Turnstile).
   ========================================================== */
(function () {
  'use strict';

  var KEY = 'phx_human_v1';
  var TTL = 12 * 60 * 60 * 1000;
  var root = document.documentElement;

  function verified() {
    try {
      var t = parseInt(localStorage.getItem(KEY), 10);
      return t && Date.now() - t < TTL;
    } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }

  if (verified()) return;

  /* ---------- Стили ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.gate{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;' +
    'background:rgba(8,8,10,.82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);opacity:0;' +
    'transition:opacity 500ms var(--ease-soft,ease);pointer-events:auto}' +
    '.gate.is-in{opacity:1}.gate.is-out{opacity:0;pointer-events:none}' +
    '.gate-card{width:min(420px,100%);padding:28px;border-radius:var(--radius,12px);background:var(--panel,#16161a);' +
    'border:1px solid var(--accent,#8cb6ff);box-shadow:0 0 32px rgba(140,182,255,.16);font-family:var(--font,sans-serif);' +
    'transform:translateY(12px);transition:transform 600ms var(--ease-out,ease)}' +
    '.gate.is-in .gate-card{transform:none}' +
    '.gate-card h2{font-size:20px;font-weight:700;margin-bottom:6px;color:var(--text,#f5f5f7)}' +
    '.gate-card p{font-size:14px;color:var(--text-2,#a1a1aa);margin-bottom:20px}' +
    '.gate-row{display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;border-radius:var(--radius-sm,8px);' +
    'border:1px solid var(--line,#26262d);background:var(--panel-2,#1e1e24);color:var(--text,#f5f5f7);font:inherit;' +
    'font-size:15px;font-weight:500;text-align:left;cursor:pointer;transition:border-color 300ms ease}' +
    '.gate-row:hover{border-color:var(--accent,#8cb6ff)}' +
    '.gate-row[disabled]{cursor:default}' +
    '.gate-box{position:relative;flex-shrink:0;width:24px;height:24px;border-radius:6px;border:2px solid var(--text-3,#6b6b75);' +
    'transition:border-color 300ms ease,background 300ms ease}' +
    '.gate-row:hover .gate-box{border-color:var(--accent,#8cb6ff)}' +
    '.gate-box::after{content:"";position:absolute;left:6px;top:1px;width:6px;height:12px;border:solid #0d0d0f;' +
    'border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);transition:transform 300ms var(--ease-out,ease)}' +
    '.gate-row.is-busy .gate-box{border-color:transparent;border-top-color:var(--accent,#8cb6ff);border-radius:50%;animation:gateSpin .8s linear infinite}' +
    '.gate-row.is-ok .gate-box{background:var(--accent,#8cb6ff);border-color:var(--accent,#8cb6ff)}' +
    '.gate-row.is-ok .gate-box::after{transform:rotate(45deg) scale(1)}' +
    '@keyframes gateSpin{to{transform:rotate(360deg)}}' +
    '.gate-msg{min-height:20px;margin-top:14px;font-size:13px;color:var(--text-3,#6b6b75)}' +
    '.gate-msg.is-err{color:#ff8a8a}';
  document.head.appendChild(css);

  /* ---------- Разметка ---------- */
  var gate = document.createElement('div');
  gate.className = 'gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'gateTitle');
  gate.innerHTML =
    '<div class="gate-card">' +
    '<h2 id="gateTitle">Подтвердите, что вы человек</h2>' +
    '<p>Это занимает пару секунд. Проверка нужна, чтобы защитить сайт от автоматических запросов.</p>' +
    '<button class="gate-row" type="button" role="checkbox" aria-checked="false">' +
    '<span class="gate-box" aria-hidden="true"></span><span class="gate-label">Я не робот</span></button>' +
    '<div class="gate-msg" role="status" aria-live="polite"></div>' +
    '</div>';

  var row = gate.querySelector('.gate-row');
  var label = gate.querySelector('.gate-label');
  var msg = gate.querySelector('.gate-msg');

  /* ---------- Признаки живого пользователя ---------- */
  var moved = false;
  var shownAt = 0;
  function onMove() { moved = true; }
  ['pointermove', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
    window.addEventListener(ev, onMove, { passive: true, once: true });
  });

  function fail(text) {
    row.classList.remove('is-busy');
    row.disabled = false;
    label.textContent = 'Я не робот';
    msg.textContent = text;
    msg.className = 'gate-msg is-err';
  }

  function pass() {
    row.classList.remove('is-busy');
    row.classList.add('is-ok');
    row.setAttribute('aria-checked', 'true');
    label.textContent = 'Проверка пройдена';
    msg.className = 'gate-msg';
    msg.textContent = '';
    remember();
    setTimeout(function () {
      gate.classList.add('is-out');
      root.style.overflow = '';
      setTimeout(function () { gate.remove(); }, 550);
    }, 600);
  }

  row.addEventListener('click', function (e) {
    if (row.disabled) return;
    row.disabled = true;
    msg.className = 'gate-msg';
    msg.textContent = '';
    row.classList.add('is-busy');
    label.textContent = 'Проверяем…';

    var humanClick = e.isTrusted === true;
    var automated = navigator.webdriver === true;

    setTimeout(function () {
      if (automated || !humanClick) {
        fail('Проверка не пройдена. Обновите страницу и попробуйте ещё раз.');
      } else if (!moved && Date.now() - shownAt < 800) {
        fail('Слишком быстро. Попробуйте ещё раз.');
      } else {
        pass();
      }
    }, 900 + Math.random() * 500);
  });

  /* ---------- Показ после интро ---------- */
  var shown = false;
  function show() {
    if (shown) return;
    shown = true;
    obs.disconnect();
    document.body.appendChild(gate);
    root.style.overflow = 'hidden';
    shownAt = Date.now();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        gate.classList.add('is-in');
        row.focus({ preventScroll: true });
      });
    });
  }

  var obs = new MutationObserver(function () {
    if (!root.classList.contains('intro-active')) show();
  });
  obs.observe(root, { attributes: true, attributeFilter: ['class'] });
  if (!root.classList.contains('intro-active')) show();
})();
