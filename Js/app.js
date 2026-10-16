// ---------- Бургер ----------
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = btn.closest('.site-nav');
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
});

// ---------- Скользящая подсветка меню и вкладок ----------
function movePill(container, pill, target) {
  if (!target || !pill) return;
  pill.style.opacity = '1';
  pill.style.width = target.offsetWidth + 'px';
  pill.style.transform = `translateX(${target.offsetLeft}px)`;
}

const navList = document.querySelector('.nav-list');
if (navList) {
  const pill = document.createElement('span');
  pill.className = 'nav-pill';
  navList.prepend(pill);
  const active = navList.querySelector('a.is-active');
  if (active) {
    movePill(navList, pill, active);
  }
  // При наведении подсветка не нужна — только активная страница
}

document.querySelectorAll('.tabs').forEach(tabs => {
  const pill = document.createElement('span');
  pill.className = 'tabs-pill';
  tabs.prepend(pill);
  const active = tabs.querySelector('.tab.is-active');
  if (active) {
    // ставим без анимации при первой загрузке
    pill.style.transition = 'none';
    movePill(tabs, pill, active);
    requestAnimationFrame(() => { pill.style.transition = ''; });
  }
  tabs.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', e => {
      // переход по ссылке остаётся, просто двигаем подсветку
      movePill(tabs, pill, t);
    });
  });
});

// ---------- Главная: аккордеон игроков ----------
// Открытие — быстрое и резкое, закрытие — плавное (см. CSS-переходы)
document.querySelectorAll('.person-head').forEach(head => {
  head.addEventListener('click', () => {
    const card = head.closest('.person');
    const isOpen = card.classList.toggle('is-open');
    card.classList.toggle('opening', isOpen);
    card.classList.toggle('closing', !isOpen);
    head.setAttribute('aria-expanded', isOpen);
  });
});

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

// ---------- Снежинки ----------
(function () {
  const layer = document.createElement('div');
  layer.className = 'snow';
  document.body.prepend(layer);
  const count = 40;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    const size = 3 + Math.random() * 5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    s.style.animationDuration = (10 + Math.random() * 14) + 's';
    s.style.animationDelay = (-Math.random() * 20) + 's';
    s.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
    layer.appendChild(s);
  }
})();
