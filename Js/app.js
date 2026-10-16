const DUR = 500;

/* ---------- Бургер ---------- */
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});

/* ---------- Пилл меню ---------- */
const navList = document.querySelector('.nav-list');
const navPill = document.createElement('span');
navPill.className = 'nav-pill';
navList.prepend(navPill);

function placeNavPill(link, instant = false) {
  if (!link) return;
  if (instant) navPill.style.transition = 'none';
  navPill.style.width = link.offsetWidth + 'px';
  navPill.style.transform = `translate3d(${link.offsetLeft}px, 0, 0)`;
  navPill.style.opacity = '1';
  if (instant) { void navPill.offsetWidth; navPill.style.transition = ''; }
}

/* ---------- Пилл вкладок состава ---------- */
const tabsEl = document.querySelector('.tabs');
const tabsPill = tabsEl.querySelector('.tabs-pill');

function placeTabsPill(tab, instant = false) {
  if (!tab) return;
  if (instant) tabsPill.style.transition = 'none';
  tabsPill.style.width = tab.offsetWidth + 'px';
  tabsPill.style.transform = `translate3d(${tab.offsetLeft}px, 0, 0)`;
  tabsPill.style.opacity = '1';
  if (instant) { void tabsPill.offsetWidth; tabsPill.style.transition = ''; }
}

/* Ждём шрифт, иначе ширины пунктов пересчитаются после расчёта пилла */
const afterFonts = document.fonts && document.fonts.ready ? document.fonts.ready : new Promise(r => window.addEventListener('load', r));
afterFonts.then(() => {
  placeNavPill(navList.querySelector('a.is-active'), true);
  placeTabsPill(tabsEl.querySelector('.tab.is-active'), true);
});

window.addEventListener('resize', () => {
  placeNavPill(navList.querySelector('a.is-active'), true);
  placeTabsPill(tabsEl.querySelector('.tab.is-active'), true);
});

/* ---------- Роутер (одна страница, разделы без перезагрузки) ---------- */
const views = document.querySelectorAll('.view');
let currentView = 'home';
let routing = false;

function showView(name) {
  if (routing || name === currentView) return;
  const next = document.querySelector(`.view[data-view="${name}"]`);
  if (!next) return;
  routing = true;

  const prev = document.querySelector(`.view[data-view="${currentView}"]`);
  prev.classList.add('is-leaving');

  setTimeout(() => {
    prev.hidden = true;
    prev.classList.remove('is-leaving');
    next.hidden = false;
    // перезапуск анимации появления
    next.style.animation = 'none';
    void next.offsetWidth;
    next.style.animation = '';
    currentView = name;
    routing = false;
  }, 200);
}

function setActiveNav(name) {
  const links = navList.querySelectorAll('a');
  links.forEach(a => a.classList.toggle('is-active', a.dataset.route === name));
  placeNavPill(navList.querySelector(`a[data-route="${name}"]`));
}

function route() {
  const hash = location.hash.replace('#', '') || 'home';
  const name = ['home', 'news', 'roster', 'discord'].includes(hash) ? hash : 'home';
  setActiveNav(name);
  showView(name);
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
}

navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', e => {
    // позволяем hash-навигацию, но даём сразу сдвинуть пилл
    setActiveNav(a.dataset.route);
  });
});
document.querySelector('.brand').addEventListener('click', () => setActiveNav('home'));

window.addEventListener('hashchange', route);
route();

/* ---------- Аккордеон на главной ---------- */
document.querySelectorAll('.person-head').forEach(head => {
  head.addEventListener('click', () => {
    const card = head.closest('.person');
    const open = card.classList.toggle('is-open');
    head.setAttribute('aria-expanded', open);
  });
});

/* ---------- Переключение Основной / Запасные ---------- */
const sub = document.getElementById('roster-sub');
const tabs = tabsEl.querySelectorAll('.tab[data-roster]');
let rosterBusy = false;

function showRoster(key) {
  document.querySelectorAll('[data-panel]').forEach(p => {
    p.hidden = p.dataset.panel !== key;
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.roster;
    if (rosterBusy || tab.classList.contains('is-active')) return;
    rosterBusy = true;

    tabs.forEach(t => t.classList.toggle('is-active', t === tab));
    placeTabsPill(tab);
    sub.textContent = key === 'main' ? 'Основной состав' : 'Запасные игроки';

    const visible = document.querySelector('[data-panel]:not([hidden])');
    if (visible) visible.style.animation = 'none';

    setTimeout(() => {
      showRoster(key);
      const next = document.querySelector(`[data-panel="${key}"]`);
      next.style.animation = 'none';
      void next.offsetWidth;
      next.style.animation = '';
      rosterBusy = false;
    }, 200);
  });
});
showRoster('main');

/* ---------- Новости: модальное окно ---------- */
const newsCards = document.querySelectorAll('.news-card');
const overlay = document.createElement('div');
overlay.className = 'news-overlay';
document.body.appendChild(overlay);

function openNews(card) {
  overlay.classList.add('is-open');
}
newsCards.forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNews(card); }
  });
});
overlay.addEventListener('click', () => overlay.classList.remove('is-open'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') overlay.classList.remove('is-open');
});

/* ---------- Снег ---------- */
(function () {
  const layer = document.createElement('div');
  layer.className = 'snow';
  document.body.prepend(layer);
  let seed = 20261016;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    const size = 3 + rnd() * 5;
    s.style.cssText = `width:${size}px;height:${size}px;left:${(rnd()*100).toFixed(2)}vw;opacity:${(0.3+rnd()*0.5).toFixed(2)};animation-duration:${(10+rnd()*14).toFixed(2)}s;animation-delay:${(-rnd()*20).toFixed(2)}s`;
    layer.appendChild(s);
  }
})();
