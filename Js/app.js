// Мобильное меню
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (toggle && navList) {
  toggle.addEventListener('click', () => navList.classList.toggle('is-open'));
}

// Курсорный свет
const glow = document.querySelector('.cursor-glow');
if (glow) {
  window.addEventListener('pointermove', e => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive: true });
}

// Пилл-подсветка под активную вкладку
function placePill(container) {
  const active = container.querySelector('.action.is-active') || container.querySelector('.action');
  if (!active) return;
  container.style.setProperty('--pill-x', active.offsetLeft + 'px');
  container.style.setProperty('--pill-w', active.offsetWidth + 'px');
  container.style.setProperty('--pill-o', 1);
}

document.querySelectorAll('.actions').forEach(container => {
  placePill(container);

  container.querySelectorAll('.action').forEach(link => {
    link.addEventListener('mouseenter', () => {
      container.style.setProperty('--pill-x', link.offsetLeft + 'px');
      container.style.setProperty('--pill-w', link.offsetWidth + 'px');
    });
    link.addEventListener('focus', () => {
      container.style.setProperty('--pill-x', link.offsetLeft + 'px');
      container.style.setProperty('--pill-w', link.offsetWidth + 'px');
    });
  });

  container.addEventListener('mouseleave', () => placePill(container));
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.actions').forEach(placePill);
});
