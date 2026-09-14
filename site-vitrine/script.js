(() => {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = nav ? nav.querySelectorAll("a") : [];

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Ouvrir le menu" : "Fermer le menu");
      nav.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  document.querySelectorAll(".event-card[data-start]").forEach((card) => {
    const start = new Date(card.dataset.start + "T00:00:00");
    const end = new Date((card.dataset.end || card.dataset.start) + "T23:59:59");
    const status = card.querySelector(".event-status");
    if (!status) return;
    if (today < start) {
      status.textContent = "À venir";
      card.classList.add("is-upcoming");
    } else if (today <= end) {
      status.textContent = "En cours";
      card.classList.add("is-current");
    } else {
      status.textContent = "Terminé";
    }
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    reveals.forEach((element) => observer.observe(element));
  }
})();