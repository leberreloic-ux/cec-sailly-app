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

  const galleryRoot = document.querySelector("[data-gallery-root]");
  const galleryFeature = document.querySelector("[data-gallery-feature]");
  const galleryList = document.querySelector("[data-gallery-list]");
  const galleryCount = document.querySelector("[data-gallery-count]");
  const galleryMore = document.querySelector("[data-gallery-more]");
  const galleryFeedback = document.querySelector("[data-gallery-feedback]");
  const firestoreBase = "https://firestore.googleapis.com/v1/projects/cec-sailly/databases/(default)/documents";
  const firebaseApiKey = "AIzaSyBrAjBL2Ack_c-8vK33304dOlcYknAOmF4";
  const galleryFallbackImage = "./images/galerie-csau.webp";
  const visibleGalleryCount = 5;
  let clubAlbums = [];
  let galleriesExpanded = false;

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

  const safeImageUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) return "";
    const imageUrl = value.trim();
    if (/^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(imageUrl)) return imageUrl;
    return safeWebUrl(imageUrl);
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
  };

  const renderFeaturedGallery = (album) => {
    if (!galleryFeature) return;
    const link = document.createElement("a");
    link.className = "gallery-feature-link";
    link.href = safeWebUrl(album.albumUrl);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `Ouvrir la galerie « ${album.title || "Photos du club"} »`);

    const photo = document.createElement("div");
    photo.className = "gallery-feature-photo";
    const imageUrl = safeWebUrl(album.imageUrl) || galleryFallbackImage;
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = album.title ? `Aperçu de la galerie ${album.title}` : "Aperçu d’une galerie du CEC";
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => emptyGalleryPhoto(photo), { once: true });
      photo.append(image);
    } else {
      emptyGalleryPhoto(photo);
    }

    const copy = document.createElement("span");
    copy.className = "gallery-feature-copy";
    const label = document.createElement("small");
    label.textContent = "Galerie à la une";
    const title = document.createElement("strong");
    title.textContent = "Galerie";
    const action = document.createElement("span");
    action.className = "gallery-feature-action";
    action.textContent = "Voir la galerie ";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    action.append(arrow);
    copy.append(label, title, action);
    link.append(photo, copy);
    galleryFeature.replaceChildren(link);
  };

  const buildGalleryRow = (album, index) => {
    const link = document.createElement("a");
    link.className = "gallery-row";
    link.href = safeWebUrl(album.albumUrl);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.style.animationDelay = `${Math.min(index * 45, 225)}ms`;
    link.setAttribute("aria-label", `Voir la galerie « ${album.title || "Photos du club"} »`);

    const number = document.createElement("span");
    number.className = "gallery-row-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("span");
    copy.className = "gallery-row-copy";
    const title = document.createElement("strong");
    title.textContent = album.title || "Photos du club";
    const description = document.createElement("small");
    description.textContent = album.description || "Album photo du CEC";
    copy.append(title, description);

    const action = document.createElement("span");
    action.className = "gallery-row-action";
    action.textContent = "Voir la galerie ";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    action.append(arrow);

    link.append(number, copy, action);
    return link;
  };

  const renderGalleryRows = () => {
    if (!galleryList) return;
    const visibleAlbums = galleriesExpanded ? clubAlbums : clubAlbums.slice(0, visibleGalleryCount);
    galleryList.replaceChildren(...visibleAlbums.map(buildGalleryRow));

    if (galleryMore) {
      const remaining = Math.max(clubAlbums.length - visibleGalleryCount, 0);
      galleryMore.hidden = remaining === 0;
      galleryMore.setAttribute("aria-expanded", String(galleriesExpanded));
      galleryMore.textContent = galleriesExpanded
        ? "Réduire la liste"
        : `Afficher les ${remaining} autre${remaining > 1 ? "s" : ""} galerie${remaining > 1 ? "s" : ""}`;
    }
  };

  if (galleryMore) {
    galleryMore.addEventListener("click", () => {
      galleriesExpanded = !galleriesExpanded;
      renderGalleryRows();
    });
  }

  const showGalleryFallback = () => {
    if (galleryFeature) {
      const empty = document.createElement("div");
      empty.className = "gallery-feature-photo is-empty";
      galleryFeature.replaceChildren(empty);
    }
    if (galleryList) {
      const fallback = document.createElement("div");
      fallback.className = "gallery-fallback";
      const title = document.createElement("strong");
      title.textContent = "Les galeries prennent leur temps…";
      const text = document.createElement("span");
      text.textContent = "Réessayez dans quelques instants ou consultez-les dans l’application du club.";
      fallback.append(title, text);
      galleryList.replaceChildren(fallback);
    }
    if (galleryRoot) galleryRoot.setAttribute("aria-busy", "false");
    if (galleryCount) galleryCount.textContent = "0";
    if (galleryFeedback) galleryFeedback.textContent = "Impossible de charger les galeries pour le moment.";
  };

  if (galleryRoot) {
    loadPublicCollection("gallery")
      .then((albums) => {
        clubAlbums = albums
          .filter((album) => album.published !== false && safeWebUrl(album.albumUrl))
          .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title || "").localeCompare(String(b.title || ""), "fr"));

        if (!clubAlbums.length) {
          showGalleryFallback();
          return;
        }

        const featuredAlbum = clubAlbums.find((album) => safeWebUrl(album.imageUrl)) || clubAlbums[0];
        renderFeaturedGallery(featuredAlbum);
        renderGalleryRows();
        galleryRoot.setAttribute("aria-busy", "false");
        if (galleryCount) galleryCount.textContent = String(clubAlbums.length);
        if (galleryFeedback) {
          galleryFeedback.textContent = `${clubAlbums.length} galerie${clubAlbums.length > 1 ? "s" : ""} disponible${clubAlbums.length > 1 ? "s" : ""}.`;
        }
      })
      .catch(showGalleryFallback);
  }

  const normalizePartnerName = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const partnerCards = [...document.querySelectorAll("[data-partner-key]")];
  const partnerNameMatches = (partnerName, key) => {
    const partnerWords = new Set(partnerName.split(" ").filter(Boolean));
    const keyWords = normalizePartnerName(key).split(" ").filter(Boolean);
    return keyWords.length > 0 && keyWords.every((word) => partnerWords.has(word));
  };
  document.querySelectorAll("[data-partner-logo]").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("is-broken"));
    image.addEventListener("load", () => image.classList.remove("is-broken"));
  });

  if (partnerCards.length) {
    loadPublicCollection("partners")
      .then((partners) => {
        partners
          .filter((partner) => partner.published !== false && safeImageUrl(partner.logoUrl))
          .forEach((partner) => {
            const partnerName = normalizePartnerName(partner.name);
            if (!partnerName) return;
            const card = partnerCards.find((item) =>
              String(item.dataset.partnerKey || "")
                .split("|")
                .some((key) => partnerNameMatches(partnerName, key))
            );
            const image = card && card.querySelector("[data-partner-logo]");
            if (image) image.src = safeImageUrl(partner.logoUrl);
          });
      })
      .catch(() => {});
  }


})();