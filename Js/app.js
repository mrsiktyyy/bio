/* Снег и фон теперь в Js/bg.js, проверка «Я не робот» — в Js/gate.js */

/* ---------- Бургер ---------- */
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});

/* ---------- Пилл меню (твой CSS: .nav-pill) ---------- */
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

/* ---------- Пилл вкладок состава (.tabs-pill) ---------- */
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

const fontsReady = document.fonts && document.fonts.ready
  ? document.fonts.ready
  : new Promise(r => window.addEventListener('load', r));

function refreshPills() {
  placeNavPill(navList.querySelector('a.is-active'), true);
  placeTabsPill(tabsEl.querySelector('.tab.is-active'), true);
}
fontsReady.then(refreshPills);
window.addEventListener('resize', refreshPills);

/* ---------- Роутер: одна страница, разделы без перезагрузки ---------- */
const ROUTES = ['home', 'news', 'roster', 'discord'];
const views = document.querySelectorAll('.view');
const page = document.querySelector('.page');
let currentView = 'home';
let routing = false;

function showView(name) {
  if (name === currentView || routing) return;
  const next = document.querySelector(`.view[data-view="${name}"]`);
  const prev = document.querySelector(`.view[data-view="${currentView}"]`);
  if (!next) return;

  routing = true;
  page.classList.add('is-leaving');

  setTimeout(() => {
    prev.hidden = true;
    next.hidden = false;
    currentView = name;
    page.classList.remove('is-leaving');
    // перезапуск drop-in анимации для нового раздела
    page.classList.remove('drop-in');
    void page.offsetWidth;
    page.classList.add('drop-in');
    window.scrollTo({ top: 0 });
    refreshPills();
    routing = false;
  }, 500);
}

function setActiveNav(name) {
  navList.querySelectorAll('a').forEach(a =>
    a.classList.toggle('is-active', a.dataset.route === name));
  placeNavPill(navList.querySelector(`a[data-route="${name}"]`));
}

function route() {
  const hash = location.hash.replace('#', '') || 'home';
  const name = ROUTES.includes(hash) ? hash : 'home';
  setActiveNav(name);
  showView(name);
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

window.addEventListener('hashchange', route);
document.querySelector('.brand').addEventListener('click', () => setActiveNav('home'));
route();

/* ---------- Аккордеон на главной ---------- */
document.querySelectorAll('.person-head').forEach(head => {
  head.addEventListener('click', () => {
    const card = head.closest('.person');
    const open = card.classList.toggle('is-open');
    head.setAttribute('aria-expanded', open);
  });
});

/* ---------- Состав: Основной / Запасные ---------- */
const rosterSub = document.getElementById('roster-sub');
const rosterTabs = tabsEl.querySelectorAll('.tab[data-roster]');
const panels = document.querySelectorAll('[data-panel]');
let rosterBusy = false;

function showRoster(key) {
  panels.forEach(p => { p.hidden = p.dataset.panel !== key; });
}

rosterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.roster;
    if (rosterBusy || tab.classList.contains('is-active')) return;
    rosterBusy = true;

    rosterTabs.forEach(t => t.classList.toggle('is-active', t === tab));
    placeTabsPill(tab);
    rosterSub.textContent = key === 'main' ? 'Основной состав' : 'Запасные игроки';

    const current = document.querySelector('[data-panel]:not([hidden])');
    current.classList.add('is-hiding');

    setTimeout(() => {
      current.classList.remove('is-hiding');
      showRoster(key);
      const next = document.querySelector(`[data-panel="${key}"]`);
      next.classList.add('is-showing');
      setTimeout(() => next.classList.remove('is-showing'), 600);
      rosterBusy = false;
    }, 500);
  });
});
showRoster('main');

/* ---------- Новости: модальное окно ---------- */
const overlay = document.getElementById('newsOverlay');
const modal = document.getElementById('newsModal');
const modalImg = document.getElementById('newsModalImg');
const modalTag = document.getElementById('newsModalTag');
const modalTitle = document.getElementById('newsModalTitle');
const modalText = document.getElementById('newsModalText');

function openNews(card) {
  modalImg.src = card.querySelector('.news-cover img').src;
  modalTag.textContent = card.querySelector('.news-tag').textContent;
  modalTitle.textContent = card.querySelector('h2').textContent;
  modalText.innerHTML = '';
  (card.dataset.full || '').split('\n').forEach(par => {
    const p = document.createElement('p');
    p.textContent = par;
    modalText.appendChild(p);
  });
  overlay.classList.add('is-open');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeNews() {
  overlay.classList.remove('is-open');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.news-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openNews(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNews(card); }
  });
});

overlay.addEventListener('click', closeNews);
modal.querySelector('.news-close').addEventListener('click', closeNews);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNews(); });
