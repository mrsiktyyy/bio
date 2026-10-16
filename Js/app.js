(() => {
  "use strict";

  const normalize = (p) => (p.replace(/\/+$/, "") || "/");
  const current = normalize(location.pathname);

  const nav = document.querySelector(".nav-list");
  const navRoot = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");

  /* ---- Мобильное меню с aria-expanded ---- */
  if (toggle && navRoot) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () => {
      const open = navRoot.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Навигация: активный пункт, пилюля, плавный переход ---- */
  if (nav) {
    const links = [...nav.querySelectorAll("a")];

    const active = links.find(
      (a) => normalize(new URL(a.href, location.href).pathname) === current
    );

    if (active) {
      active.classList.add("active");
      active.setAttribute("aria-current", "page");

      const pill = document.createElement("span");
      pill.className = "nav-pill";
      pill.setAttribute("aria-hidden", "true");
      nav.appendChild(pill);

      const movePill = () => {
        const r = active.getBoundingClientRect();
        const n = nav.getBoundingClientRect();
        pill.style.width = `${r.width}px`;
        pill.style.transform = `translateX(${r.left - n.left}px)`;
      };

      requestAnimationFrame(movePill);
      window.addEventListener("resize", movePill, { passive: true });
    }

    links.forEach((a) =>
      a.addEventListener("click", (e) => {
        // Внешние ссылки и модифицированные клики — без вмешательства
        if (a.origin !== location.origin) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const target = normalize(new URL(a.href, location.href).pathname);
        if (target === current) return;

        e.preventDefault();
        document.body.classList.add("leave");
        setTimeout(() => {
          location.href = a.href;
        }, 200);
      })
    );
  }

  /* ---- Вход страницы ---- */
  requestAnimationFrame(() => document.body.classList.add("enter"));

  /* ---- Глоу курсора: только для мыши, с lerp ---- */
  const glow = document.querySelector(".cursor-glow");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (glow && hasFinePointer && !reduceMotion) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let gx = x;
    let gy = y;

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
      },
      { passive: true }
    );

    const tick = () => {
      gx += (x - gx) * 0.12;
      gy += (y - gy) * 0.12;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      requestAnimationFrame(tick);
    };
    tick();
  } else if (glow) {
    glow.style.display = "none";
  }
})();
