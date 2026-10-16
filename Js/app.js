const DUR = 500;

// ---------- Бургер ----------
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = btn.closest('.site-nav');
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
});

// ---------- Пилл: привязан к ширине и позиции текста ----------
// Берём реальные offsetLeft/offsetWidth кнопки, поэтому фон
// всегда точно обтягивает текст вкладки.
function placePill(pill, target) {
  if (!pill || !target) return;
  pill.style.opacity = '1';
  pill.style.width = target.offsetWidth + 'px';
  pill.style.transform = `translate3d(${target.offsetLeft}px, 0, 0)`;
}

function makePill(container, className) {
  const pill = document.createElement('span');
  pill.className = className;
  container.prepend(pill);
  const active = container.querySelector('.is-active');
  pill.style.transition = 'none';
  placePill(pill, active);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pill.style.transition = '';
  }));
  return pill;
}

// Пилл навигации сайта
const navList = document.querySelector('.nav-list');
let navPill = null;
if (navList) navPill = makePill(navList, 'nav-pill');

// Пилл вкладок состава
const tabsEl = document.querySelector('.tabs');
let tabsPill = null;
if (tabsEl) tabsPill = makePill(tabsEl, 'tabs-pill');

window.addEventListener('resize', () => {
  if (navPill) placePill(navPill, navList.querySelector('a.is-active'));
  if (tabsPill) placePill(tabsPill, tabsEl.querySelector('.tab.is-active'));
});

// ---------- Переход между страницами по меню ----------
if (navList) {
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || link.classList.contains('is-active')) return;
      e.preventDefault();

      placePill(navPill, link);
      navList.querySelectorAll('a').forEach(a => a.classList.toggle('is-active', a === link));

      const page = document.querySelector('.page');
      page.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, DUR);
    });
  });
}

// ---------- Вкладки состава (Основной / Запасные) ----------
// Работает на одной странице: панели переключаются через data-panel.
(function () {
  const tabs = document.querySelectorAll('.tabs .tab[data-roster]');
  if (!tabs.length) return;

  const sub = document.getElementById('roster-sub');
  const panels = document.querySelectorAll('[data-panel]');
  const snow = document.querySelector('.snow');
  let busy = false;

  function showPanel(key) {
    panels.forEach(p => { p.hidden = p.dataset.panel !== key; });
  }

  // Старт: показываем панель активной вкладки
  const initial = document.querySelector('.tabs .tab.is-active');
  showPanel(initial ? initial.dataset.roster : 'main');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.roster;
      const current = document.querySelector('.tabs .tab.is-active');
      if (busy || tab === current) return;
      busy = true;

      // Пилл и подсветка текста — сразу
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      placePill(tabsPill, tab);
      if (sub) sub.textContent = key === 'main' ? 'Основной состав' : 'Резервный состав';

      // Снег гаснет за 500 мс (как и остальные анимации)
      if (snow) snow.classList.add('is-fading');

      // Текущая панель уезжает вверх и гаснет
      const visible = document.querySelector(`[data-panel]:not([hidden])`);
      if (visible) visible.classList.add('is-leaving');

      setTimeout(() => {
        // Переключаем панели
        showPanel(key);
        const next = document.querySelector(`[data-panel="${key}"]`);
        if (visible) visible.classList.remove('is-leaving');
        if (next) {
          next.classList.remove('is-entering');
          void next.offsetWidth; // перезапуск анимации
          next.classList.add('is-entering');
        }
        busy = false;
      }, DUR);
    });
  });
})();

// ---------- Аккордеон на главной ----------
document.querySelectorAll('.person-head').forEach(head => {
  head.addEventListener('click', () => {
    const card = head.closest('.person');
    const open = card.classList.toggle('is-open');
    head.setAttribute('aria-expanded', open);
  });
});

// ---------- Новости: раскрытие в окно ----------
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

// ---------- Снег: фиксированная раскладка ----------
(function () {
  const layer = document.createElement('div');
  layer.className = 'snow';
  document.body.prepend(layer);

  let seed = 20261016;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const count = 40;
  for (let i = 0; i < count; i++) {
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
