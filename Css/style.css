(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  // Мобильное меню
  if (header && toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Отмечаем текущую страницу
  const normalize = (p) => p.replace(/\/+$/, "") || "/";
  const current = normalize(location.pathname);

  document.querySelectorAll(".nav-list a").forEach((a) => {
    const target = normalize(new URL(a.href, location.href).pathname);
    if (target === current) {
      a.setAttribute("aria-current", "page");
    }
  });
})();
