// ---------- Бургер ----------
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = btn.closest('.site-nav');
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
});

// ---------- Снег выключен до перезагрузки страницы ----------
// Флаг хранится в sessionStorage: переход по меню не возвращает снег.
const SNOW_KEY = 'phx-snow-off';
if (sessionStorage.getItem(SNOW_KEY) === '1') {
  document.body.classList.add('snow-off');
}

// ---------- Переход между страницами по меню ----------
const NAV_KEY = 'phx-drop-in';
if (sessionStorage.getItem(NAV_KEY) === '1') {
  sessionStorage.removeItem(NAV_KEY);
  document.querySelector('.page')?.classList.add('drop-in');
}

document.querySelectorAll('.nav-list a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || link.classList.contains('is-active')) return;
    e.preventDefault();

    sessionStorage.setItem(NAV_KEY, '1');
    document.querySelector('.page').classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 500);
  });
});

// ---------- Вкладки Основной / Запасные ----------
// 1) снег гаснет за 300 мс  2) страница падает  3) обновление страницы
(function () {
  const tabs = document.querySelectorAll('.tabs .tab[data-roster]');
  if (!tabs.length) return;

  const panels = document.querySelectorAll('[data-panel]');
  let busy = false;

  const initial = document.querySelector('.tabs .tab.is-active');
  const initKey = initial ? initial.dataset.roster : 'main';
  panels.forEach(p => { p.hidden = p.dataset.panel !== initKey; });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const current = document.querySelector('.tabs .tab.is-active');
      if (busy || tab === current) return;
      busy = true;

      // Сохраняем выбранную вкладку, чтобы после обновления открыть её же
      sessionStorage.setItem('phx-roster-tab', tab.dataset.roster);
      sessionStorage.setItem(SNOW_KEY, '1');

      // 1) снег гаснет
      document.body.classList.add('snow-off');

      // 2) через 300 мс страница падает
      setTimeout(() => {
        document.querySelector('.page').classList.add('is-leaving');
      }, 300);

      // 3) после падения — обновление страницы
      setTimeout(() => {
        window.location.reload();
      }, 300 + 500);
    });
  });
})();

// ---------- Новости: раскрытие в большое окно ----------
(function () {
  const cards = document.querySelectorAll('.news-card');
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'news-overlay';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.className = 'news-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <button class="news-close" type="button" aria-label="Закрыть">✕</button>
    <div class="news-modal-cover"><img alt=""></div>
    <div class="news-modal-body">
      <span class="news-tag"></span>
      <h2></h2>
      <div class="news-modal-text"></div>
    </div>`;
  document.body.appendChild(modal);

  const img = modal.querySelector('img');
  const tag = modal.querySelector('.news-tag');
  const title = modal.querySelector('h2');
  const text = modal.querySelector('.news-modal-text');

  function open(card) {
    img.src = card.querySelector('.news-cover img').src;
    tag.textContent = card.querySelector('.news-tag').textContent;
    title.textContent = card.querySelector('h2').textContent;
    text.innerHTML = '';
    const full = card.dataset.full || card.querySelector('p').textContent;
    full.split('\n').forEach(par => {
      const p = document.createElement('p');
      p.textContent = par;
      text.appendChild(p);
    });
    overlay.classList.add('is-open');
    modal.classList.add('is-open');
  }

  function close() {
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');
  }

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card);
      }
    });
  });

  overlay.addEventListener('click', close);
  modal.querySelector('.news-close').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

// ---------- Снег: фиксированная раскладка (одинаковая на всех страницах) ----------
(function () {
  const layer = document.createElement('div');
  layer.className = 'snow';
  document.body.prepend(layer);

  let seed = 20261016;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    const size = 3 + rnd() * 5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = (rnd() * 100).toFixed(2) + 'vw';
    s.style.setProperty('--drift', (rnd() * 80 - 40).toFixed(1) + 'px');
    s.style.animationDuration = (10 + rnd() * 14).toFixed(2) + 's';
    s.style.animationDelay = (-rnd() * 20).toFixed(2) + 's';
    s.style.opacity = (0.3 + rnd() * 0.5).toFixed(2);
    layer.appendChild(s);
  }
})();
