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

  const galleryGrid = document.querySelector("[data-gallery-grid]");
  const galleryFeedback = document.querySelector("[data-gallery-feedback]");
  const firestoreBase = "https://firestore.googleapis.com/v1/projects/cec-sailly/databases/(default)/documents";
  const firebaseApiKey = "AIzaSyBrAjBL2Ack_c-8vK33304dOlcYknAOmF4";

  const decodeFirestoreValue = (value = {}) => {
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("timestampValue" in value) return value.timestampValue;
    if ("nullValue" in value) return null;
    if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
    if ("mapValue" in value) return decodeFirestoreFields(value.mapValue.fields || {});
    return undefined;
  };

  const decodeFirestoreFields = (fields = {}) =>
    Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]));

  const safeWebUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  };

  const loadPublicCollection = async (name) => {
    const url = new URL(`${firestoreBase}/${name}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("key", firebaseApiKey);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Firestore ${response.status}`);
    const payload = await response.json();
    return (payload.documents || []).map((document) => decodeFirestoreFields(document.fields || {}));
  };

  const emptyGalleryPhoto = (photo) => {
    photo.replaceChildren();
    photo.classList.add("is-empty");
    const label = document.createElement("span");
    label.textContent = "Album du club";
    photo.append(label);
  };

  const buildGalleryCard = (album, index) => {
    const card = document.createElement("a");
    card.className = "gallery-card";
    card.href = safeWebUrl(album.albumUrl);
    card.target = "_blank";
    card.rel = "noreferrer";
    card.setAttribute("aria-label", `Ouvrir l’album Google Photos « ${album.title || "Photos du club"} »`);
    card.style.animationDelay = `${Math.min(index * 70, 350)}ms`;

    const photo = document.createElement("div");
    photo.className = "gallery-photo";
    const imageUrl = safeWebUrl(album.imageUrl);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = album.title ? `Aperçu de l’album ${album.title}` : "Aperçu d’un album du CEC";
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => emptyGalleryPhoto(photo), { once: true });
      photo.append(image);
    } else {
      emptyGalleryPhoto(photo);
    }

    const copy = document.createElement("div");
    copy.className = "gallery-card-copy";
    const title = document.createElement("h3");
    title.textContent = album.title || "Photos du club";
    const description = document.createElement("p");
    description.textContent = album.description || "Retrouvez les photos de ce temps fort du CEC.";
    const action = document.createElement("small");
    action.textContent = "Voir sur Google Photos";
    const arrow = document.createElement("span");
    arrow.className = "gallery-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    copy.append(title, description, action, arrow);
    card.append(photo, copy);
    return card;
  };

  const showGalleryFallback = () => {
    if (!galleryGrid) return;
    const fallback = document.createElement("div");
    fallback.className = "gallery-fallback";
    const title = document.createElement("strong");
    title.textContent = "Les galeries prennent leur temps…";
    const text = document.createElement("span");
    text.textContent = "Elles restent disponibles dans l’application du club. Réessayez dans quelques instants.";
    fallback.append(title, text);
    galleryGrid.replaceChildren(fallback);
    galleryGrid.setAttribute("aria-busy", "false");
    if (galleryFeedback) galleryFeedback.textContent = "Impossible de charger les albums pour le moment.";
  };

  if (galleryGrid) {
    loadPublicCollection("gallery")
      .then((albums) => {
        const publishedAlbums = albums
          .filter((album) => album.published !== false && safeWebUrl(album.albumUrl))
          .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title || "").localeCompare(String(b.title || ""), "fr"));

        if (!publishedAlbums.length) {
          showGalleryFallback();
          return;
        }

        galleryGrid.replaceChildren(...publishedAlbums.map(buildGalleryCard));
        galleryGrid.setAttribute("aria-busy", "false");
        if (galleryFeedback) {
          galleryFeedback.textContent = `${publishedAlbums.length} album${publishedAlbums.length > 1 ? "s" : ""} — cliquez sur une photo pour ouvrir Google Photos.`;
        }
      })
      .catch(showGalleryFallback);
  }

})();