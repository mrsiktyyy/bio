
(() => {
  const path = p => { p = p.replace(/\/+$/,""); return p || "/"; };
  const current = path(location.pathname);
  const nav = document.querySelector(".nav-list");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", () => document.querySelector(".site-nav")?.classList.toggle("open"));

  if (nav) {
    const links = [...nav.querySelectorAll("a")];
    const active = links.find(a => path(new URL(a.href, location.href).pathname) === current);
    if (active) {
      active.classList.add("active");
      const pill = document.createElement("span");
      pill.className = "nav-pill";
      nav.appendChild(pill);
      const move = () => {
        const r = active.getBoundingClientRect(), n = nav.getBoundingClientRect();
        pill.style.width = `${r.width}px`;
        pill.style.transform = `translateX(${r.left - n.left}px)`;
      };
      requestAnimationFrame(move); addEventListener("resize", move);
    }
    links.forEach(a => a.addEventListener("click", e => {
      if (a.origin !== location.origin || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = path(new URL(a.href, location.href).pathname);
      if (target === current) return;
      e.preventDefault();
      document.body.classList.add("leave");
      setTimeout(() => location.href = a.href, 320);
    }));
  }

  requestAnimationFrame(() => document.body.classList.add("enter"));

  const glow = document.querySelector(".cursor-glow");
  if (glow && matchMedia("(pointer:fine)").matches) {
    let x=innerWidth/2,y=innerHeight/2,gx=x,gy=y;
    addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY},{passive:true});
    const tick=()=>{gx+=(x-gx)*.12;gy+=(y-gy)*.12;glow.style.left=gx+"px";glow.style.top=gy+"px";requestAnimationFrame(tick)};
    tick();
  }
})();
