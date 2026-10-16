/* ---------- Бургер ---------- */
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});

/* ---------- Роутер: разделы без перезагрузки ---------- */
const navLinks = document.querySelectorAll('.nav-list a');
const views = document.querySelectorAll('.view');

function route() {
  const name = (location.hash.replace('#', '')) || 'home';
  const target = ['home', 'news', 'roster', 'discord'].includes(name) ? name : 'home';
  views.forEach(v => v.hidden = v.dataset.view !== target);
  navLinks.forEach(a => a.classList.toggle('is-active', a.dataset.route === target));
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
  window.scrollTo({ top: 0 });
}
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

/* ---------- Состав: карточки из данных ---------- */
const ROSTERS = {
  main: [
    { img: 'Avatar1.png', nick: 'mrsiktyyy', role: 'Основатель / IGL', kd: '1.15', hs: '65%' },
    { img: 'Avatar2.png', nick: 'Novich0k42', role: 'Рифлер', kd: '1.08', hs: '61%' },
    { img: 'Avatar3.png', nick: 'myrvell', role: 'Рифлер', kd: '1.04', hs: '59%' },
    { img: 'Avatar4.png', nick: 'EgorVdadika', role: 'AWP / тренер', kd: '0.98', hs: '55%' },
    { img: 'Avatar_Zenlo.png', nick: 'Zenlo.', role: 'AWP', kd: '1.10', hs: '63%' },
  ],
  reserve: [
    { img: 'Avatar6.png', nick: 'Резервный состав', role: 'Запасной', kd: '—', hs: '—' },
    { img: 'Avatar7.png', nick: 'Запасной слот', role: 'Запасной', kd: '—', hs: '—' },
    { img: 'Avatar8.png', nick: 'Community', role: 'Запасной', kd: '—', hs: '—' },
  ],
};

const cards = document.getElementById('cards');

function renderRoster(key) {
  cards.innerHTML = ROSTERS[key].map(p => `
    <article class="card glass">
      <div class="card-media"><img src="/phx/${p.img}" alt="${p.nick}" loading="lazy" decoding="async"></div>
      <div class="card-body">
        <h3>${p.nick}</h3>
        <p>${p.role}</p>
        <div class="stats">
          <div class="stat"><small>K/D</small><b class="accent">${p.kd}</b></div>
          <div class="stat"><small>HS</small><b>${p.hs}</b></div>
        </div>
      </div>
    </article>`).join('');

  document.querySelectorAll('[data-roster]').forEach(b =>
    b.classList.toggle('is-active', b.dataset.roster === key));
}

document.querySelectorAll('[data-roster]').forEach(btn =>
  btn.addEventListener('click', () => renderRoster(btn.dataset.roster)));

renderRoster('main');

/* ---------- Снег ---------- */
(function () {
  const layer = document.createElement('div');
  layer.className = 'snow';
  document.body.prepend(layer);
  let seed = 20261016;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    const size = 3 + rnd() * 5;
    s.style.cssText =
      `width:${size}px;height:${size}px;left:${(rnd()*100).toFixed(2)}vw;` +
      `opacity:${(0.3+rnd()*0.5).toFixed(2)};` +
      `animation-duration:${(10+rnd()*14).toFixed(2)}s;` +
      `animation-delay:${(-rnd()*20).toFixed(2)}s`;
    layer.appendChild(s);
  }
})();
