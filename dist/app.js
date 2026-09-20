(() => {
  "use strict";

  const content = window.FERNANDO_CONTENT;
  const root = document.querySelector("#main");
  const chapterCount = content.chapters.length;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let direction = "forward";
  let menuOpen = false;
  let lightboxState = null;
  let lightboxOpener = null;
  const galleryIndexes = new Map();

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const chapterFromHash = () => {
    const id = window.location.hash.replace("#", "");
    const index = content.chapters.findIndex((chapter) => chapter.id === id);
    return index >= 0 ? index : 0;
  };

  const icon = (name) => {
    const paths = {
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      arrowLeft: '<path d="m15 18-6-6 6-6"/>',
      arrowRight: '<path d="m9 18 6-6-6-6"/>',
      expand: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      minus: '<path d="M5 12h14"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
  };

  const renderPhoto = (memory) => {
    const images = memory.images || [];
    const currentPhotoIndex = Math.min(galleryIndexes.get(memory.id) || 0, Math.max(images.length - 1, 0));
    const image = images[currentPhotoIndex];
    if (!image?.src) {
      return `
        <div class="photo-placeholder" aria-label="Espacio reservado para una foto">
          <span class="placeholder-number" aria-hidden="true">${memory.index}</span>
          <span class="placeholder-label">Espacio para foto</span>
          <span class="placeholder-caption">Lista para añadir este recuerdo</span>
        </div>
      `;
    }

    return `
      <div class="photo-frame">
        <button class="photo-button" type="button" data-photo-memory="${escapeHtml(memory.id)}" data-photo-index="${currentPhotoIndex}" aria-label="Ampliar foto: ${escapeHtml(image.alt)}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" style="object-position: ${escapeHtml(image.position || "50% 50%")}"
               loading="lazy" decoding="async" data-gallery-image>
          <span class="photo-expand">${icon("expand")}<span>Ampliar</span></span>
        </button>
        ${images.length > 1 ? `
          <div class="gallery-controls" aria-label="Galería de ${escapeHtml(memory.title)}">
            <button class="gallery-button" type="button" data-gallery-previous="${escapeHtml(memory.id)}" aria-label="${escapeHtml(content.navigation.previousPhoto)} de ${escapeHtml(memory.title)}">${icon("arrowLeft")}</button>
            <span class="gallery-status" data-gallery-status aria-live="polite">${currentPhotoIndex + 1} de ${images.length}</span>
            <button class="gallery-button" type="button" data-gallery-next="${escapeHtml(memory.id)}" aria-label="${escapeHtml(content.navigation.nextPhoto)} de ${escapeHtml(memory.title)}">${icon("arrowRight")}</button>
          </div>
        ` : ""}
      </div>
    `;
  };

  const renderFeaturedPhoto = (chapter) => {
    const image = chapter.featuredImage;
    if (!image.src) {
      return `
        <div class="speech-photo-placeholder" role="img" aria-label="${escapeHtml(image.placeholder)}">
          <span class="speech-frame-corner speech-frame-corner-top" aria-hidden="true"></span>
          <span class="speech-photo-label">${escapeHtml(image.placeholder)}</span>
          <span class="speech-frame-corner speech-frame-corner-bottom" aria-hidden="true"></span>
        </div>
      `;
    }

    return `
      <button class="speech-photo-button" type="button" data-featured-photo aria-label="Ampliar foto: ${escapeHtml(image.alt)}">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" style="object-position: ${escapeHtml(image.position || "50% 50%")}"
             loading="lazy" decoding="async">
        <span class="photo-expand">${icon("expand")}<span>Ampliar</span></span>
      </button>
    `;
  };

  const renderWelcome = (chapter) => `
    <section class="chapter chapter-welcome" aria-labelledby="chapter-title">
      <span class="album-mark" aria-hidden="true">S · F</span>
      <div class="welcome-layout">
        <div class="welcome-copy">
          <p class="eyebrow">${escapeHtml(chapter.eyebrow)}</p>
          <h1 id="chapter-title">${escapeHtml(chapter.title)}</h1>
          <p class="lead">${escapeHtml(chapter.body)}</p>
        </div>
        <button class="primary-button" type="button" data-go="1">${escapeHtml(chapter.actionLabel)}</button>
      </div>
      <div class="corner-note" aria-hidden="true">Álbum · 2026</div>
    </section>
  `;

  const renderCongratulations = (chapter) => `
    <section class="chapter chapter-congratulations" aria-labelledby="chapter-title">
      <div class="congratulations-layout">
        <div class="congratulations-copy">
          <p class="eyebrow">${escapeHtml(chapter.eyebrow)}</p>
          <h1 class="chapter-title" id="chapter-title">${escapeHtml(chapter.title)}</h1>
          <p class="lead">${escapeHtml(chapter.body)}</p>
          <aside class="side-note">
            <span class="side-note-label">Nota al margen</span>
            <p>${escapeHtml(chapter.sideNote)}</p>
          </aside>
        </div>
        <div class="speech-photo-frame">${renderFeaturedPhoto(chapter)}</div>
      </div>
    </section>
  `;

  const renderMemories = (chapter) => `
    <section class="chapter chapter-memories" aria-labelledby="chapter-title">
      <header class="section-heading">
        <p class="eyebrow">${escapeHtml(chapter.eyebrow)}</p>
        <h1 class="chapter-title" id="chapter-title">${escapeHtml(chapter.title)}</h1>
        <p class="section-intro">${escapeHtml(chapter.intro)}</p>
      </header>
      <div class="memory-grid">
        ${chapter.memories.map((memory) => `
          <article class="memory-card" data-memory-id="${escapeHtml(memory.id)}">
            <div class="memory-photo">${renderPhoto(memory)}</div>
            <div class="memory-content">
              <span class="memory-index">Recuerdo ${escapeHtml(memory.index)}</span>
              <h2>${escapeHtml(memory.title)}</h2>
              <p>${escapeHtml(memory.summary)}</p>
              <button class="note-toggle" type="button" aria-expanded="false" aria-controls="note-${escapeHtml(memory.id)}" data-note="${escapeHtml(memory.id)}">
                <span>Descubrir la nota</span>
                <span class="note-toggle-icon">${icon("plus")}</span>
              </button>
              <div class="memory-note" id="note-${escapeHtml(memory.id)}" hidden>
                <p>${escapeHtml(memory.note)}</p>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;

  const renderAppreciation = (chapter) => `
    <section class="chapter chapter-appreciation" aria-labelledby="chapter-title">
      <header class="section-heading appreciation-heading">
        <p class="eyebrow">${escapeHtml(chapter.eyebrow)}</p>
        <h1 class="chapter-title" id="chapter-title">${escapeHtml(chapter.title)}</h1>
        <p class="section-intro">${escapeHtml(chapter.intro)}</p>
      </header>
      <ol class="quality-list">
        ${chapter.qualities.map((quality, index) => `
          <li>
            <span class="quality-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>${escapeHtml(quality.title)}</h2>
              <p>${escapeHtml(quality.text)}</p>
            </div>
          </li>
        `).join("")}
      </ol>
    </section>
  `;

  const renderDedicationPhoto = (chapter) => {
    const image = chapter.image;
    if (!image?.src) return "";

    return `
      <div class="dedication-photo-frame">
        <button class="dedication-photo-button" type="button" data-dedication-photo aria-label="Ampliar foto: ${escapeHtml(image.alt)}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" style="object-position: ${escapeHtml(image.position || "50% 50%")}"
               loading="lazy" decoding="async">
          <span class="photo-expand">${icon("expand")}<span>Ampliar</span></span>
        </button>
      </div>
    `;
  };

  const renderDedication = (chapter) => `
    <section class="chapter chapter-dedication" aria-labelledby="chapter-title">
      <div class="dedication-layout">
        <div class="dedication-card">
          <p class="eyebrow">${escapeHtml(chapter.eyebrow)}</p>
          <h1 class="chapter-title" id="chapter-title">${escapeHtml(chapter.title)}</h1>
          <p class="dedication-body">${escapeHtml(chapter.body)}</p>
          <div class="signature-block">
            <span>${escapeHtml(chapter.signoff)}</span>
            <strong>${escapeHtml(chapter.signature)}</strong>
          </div>
          <p class="closing-note">${escapeHtml(chapter.closing)}</p>
        </div>
        ${renderDedicationPhoto(chapter)}
        <button class="secondary-button" type="button" data-go="2">${icon("arrowLeft")} ${escapeHtml(content.navigation.backToAlbum)}</button>
      </div>
      <div class="dedication-stamp" aria-hidden="true">S · F</div>
    </section>
  `;

  const renderChapterContent = (chapter) => {
    if (chapter.id === "bienvenida") return renderWelcome(chapter);
    if (chapter.id === "felicitacion") return renderCongratulations(chapter);
    if (chapter.id === "recuerdos") return renderMemories(chapter);
    if (chapter.id === "aprecio") return renderAppreciation(chapter);
    return renderDedication(chapter);
  };

  const renderNavigation = () => {
    if (currentIndex === 0) return "";
    const current = content.chapters[currentIndex];
    return `
      <header class="album-header">
        <button class="chapter-menu-button" type="button" aria-expanded="${menuOpen}" aria-controls="chapter-menu">
          ${icon(menuOpen ? "close" : "menu")}
          <span>${escapeHtml(content.navigation.chapters)}</span>
        </button>
        <div class="chapter-status" aria-label="Capítulo ${currentIndex + 1} de ${chapterCount}">
          <span class="chapter-status-name">${escapeHtml(current.shortLabel)}</span>
          <span aria-hidden="true">${String(currentIndex + 1).padStart(2, "0")} / ${String(chapterCount).padStart(2, "0")}</span>
        </div>
      </header>
    `;
  };

  const renderMenu = () => `
    <nav class="chapter-menu ${menuOpen ? "is-open" : ""}" id="chapter-menu" aria-label="Capítulos" ${menuOpen ? "" : "hidden"}>
      <div class="chapter-menu-inner">
        <span class="menu-kicker">Recorre el regalo</span>
        <ol>
          ${content.chapters.map((chapter, index) => `
            <li>
              <button type="button" data-go="${index}" ${index === currentIndex ? 'aria-current="page"' : ""}>
                <span>${String(index + 1).padStart(2, "0")}</span>
                ${escapeHtml(chapter.shortLabel)}
              </button>
            </li>
          `).join("")}
        </ol>
        <p>Usa ← y → para avanzar cuando no estés dentro de un control.</p>
      </div>
    </nav>
  `;

  const renderFooter = () => {
    if (currentIndex === 0) return "";
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < chapterCount - 1;
    return `
      <footer class="album-footer">
        <button class="footer-button" type="button" data-go="${currentIndex - 1}" ${hasPrevious ? "" : "disabled"}>
          ${icon("arrowLeft")}<span>${escapeHtml(content.navigation.previous)}</span>
        </button>
        <div class="progress-track" aria-hidden="true">
          <span style="width: ${((currentIndex + 1) / chapterCount) * 100}%"></span>
        </div>
        <button class="footer-button footer-button-next" type="button" data-go="${currentIndex + 1}" ${hasNext ? "" : "disabled"}>
          <span>${escapeHtml(content.navigation.next)}</span>${icon("arrowRight")}
        </button>
      </footer>
    `;
  };

  const renderLightbox = () => `
    <dialog class="lightbox" id="photo-dialog" aria-labelledby="photo-dialog-title">
      <button class="lightbox-close" type="button" aria-label="${escapeHtml(content.navigation.closePhoto)}">${icon("close")}</button>
      <figure>
        <div class="lightbox-media"><img src="" alt="" id="dialog-image"></div>
        <figcaption>
          <span id="photo-dialog-title"></span>
          <span class="lightbox-status" id="lightbox-status" aria-live="polite"></span>
        </figcaption>
      </figure>
      <div class="lightbox-controls" id="lightbox-controls">
        <button class="lightbox-gallery-button" type="button" data-lightbox-previous aria-label="${escapeHtml(content.navigation.previousPhoto)}">${icon("arrowLeft")}</button>
        <button class="lightbox-gallery-button" type="button" data-lightbox-next aria-label="${escapeHtml(content.navigation.nextPhoto)}">${icon("arrowRight")}</button>
      </div>
    </dialog>
  `;

  const findMemory = (memoryId) => content.chapters[2].memories.find((memory) => memory.id === memoryId);

  const normalizedPhotoIndex = (index, length) => ((index % length) + length) % length;

  const updateCardGallery = (memoryId, requestedIndex) => {
    const memory = findMemory(memoryId);
    if (!memory?.images?.length) return;
    const nextIndex = normalizedPhotoIndex(requestedIndex, memory.images.length);
    galleryIndexes.set(memoryId, nextIndex);
    const card = root.querySelector(`[data-memory-id="${CSS.escape(memoryId)}"]`);
    const image = memory.images[nextIndex];
    const imageElement = card?.querySelector("[data-gallery-image]");
    const photoButton = card?.querySelector("[data-photo-memory]");
    if (imageElement) {
      const nextImageElement = document.createElement("img");
      nextImageElement.src = image.src;
      nextImageElement.alt = image.alt;
      nextImageElement.style.objectPosition = image.position || "50% 50%";
      nextImageElement.loading = "eager";
      nextImageElement.decoding = "async";
      nextImageElement.dataset.galleryImage = "";
      imageElement.replaceWith(nextImageElement);
    }
    if (photoButton) {
      photoButton.dataset.photoIndex = String(nextIndex);
      photoButton.setAttribute("aria-label", `Ampliar foto: ${image.alt}`);
    }
    const status = card?.querySelector("[data-gallery-status]");
    if (status) status.textContent = `${nextIndex + 1} de ${memory.images.length}`;
  };

  const updateLightbox = (requestedIndex) => {
    if (!lightboxState?.images?.length) return;
    lightboxState.index = normalizedPhotoIndex(requestedIndex, lightboxState.images.length);
    const image = lightboxState.images[lightboxState.index];
    const dialogImage = root.querySelector("#dialog-image");
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogImage.style.objectPosition = image.position || "50% 50%";
    root.querySelector("#photo-dialog-title").textContent = lightboxState.title;
    const status = root.querySelector("#lightbox-status");
    status.textContent = lightboxState.images.length > 1 ? `${lightboxState.index + 1} de ${lightboxState.images.length}` : "";
    root.querySelector("#lightbox-controls").hidden = lightboxState.images.length < 2;
  };

  const openLightbox = ({ title, images, index, opener }) => {
    const dialog = root.querySelector("#photo-dialog");
    lightboxOpener = opener;
    lightboxState = { title, images, index };
    updateLightbox(index);
    dialog.showModal();
  };

  const bindInteractions = () => {
    root.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => goToChapter(Number(button.dataset.go)));
    });

    root.querySelector(".chapter-menu-button")?.addEventListener("click", () => {
      menuOpen = !menuOpen;
      render({ focusMenu: menuOpen });
    });

    root.querySelectorAll("[data-note]").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = root.querySelector(`#note-${CSS.escape(button.dataset.note)}`);
        const isOpening = button.getAttribute("aria-expanded") === "false";
        button.setAttribute("aria-expanded", String(isOpening));
        button.querySelector("span:first-child").textContent = isOpening ? "Ocultar la nota" : "Descubrir la nota";
        button.querySelector(".note-toggle-icon").innerHTML = icon(isOpening ? "minus" : "plus");
        panel.hidden = !isOpening;
      });
    });

    const dialog = root.querySelector("#photo-dialog");
    root.querySelectorAll("[data-gallery-previous]").forEach((button) => {
      button.addEventListener("click", () => {
        const current = galleryIndexes.get(button.dataset.galleryPrevious) || 0;
        updateCardGallery(button.dataset.galleryPrevious, current - 1);
      });
    });
    root.querySelectorAll("[data-gallery-next]").forEach((button) => {
      button.addEventListener("click", () => {
        const current = galleryIndexes.get(button.dataset.galleryNext) || 0;
        updateCardGallery(button.dataset.galleryNext, current + 1);
      });
    });
    root.querySelectorAll("[data-photo-memory]").forEach((button) => {
      button.addEventListener("click", () => {
        const memory = findMemory(button.dataset.photoMemory);
        openLightbox({
          title: memory.title,
          images: memory.images,
          index: Number(button.dataset.photoIndex),
          opener: button
        });
      });
    });
    root.querySelector("[data-featured-photo]")?.addEventListener("click", (event) => {
      const chapter = content.chapters[1];
      openLightbox({ title: chapter.title, images: [chapter.featuredImage], index: 0, opener: event.currentTarget });
    });
    root.querySelector("[data-dedication-photo]")?.addEventListener("click", (event) => {
      const chapter = content.chapters.find((item) => item.id === "dedicatoria");
      openLightbox({ title: chapter.title, images: [chapter.image], index: 0, opener: event.currentTarget });
    });
    root.querySelector(".lightbox-close")?.addEventListener("click", () => dialog.close());
    root.querySelector("[data-lightbox-previous]")?.addEventListener("click", () => updateLightbox(lightboxState.index - 1));
    root.querySelector("[data-lightbox-next]")?.addEventListener("click", () => updateLightbox(lightboxState.index + 1));
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog?.addEventListener("keydown", (event) => {
      if (!lightboxState || lightboxState.images.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateLightbox(lightboxState.index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateLightbox(lightboxState.index + 1);
      }
    });
    dialog?.addEventListener("close", () => {
      const opener = lightboxOpener;
      lightboxState = null;
      lightboxOpener = null;
      opener?.focus({ preventScroll: true });
    });
  };

  const render = ({ focusMenu = false, focusTitle = false } = {}) => {
    const chapter = content.chapters[currentIndex];
    document.title = `${chapter.shortLabel} — Para Fernando`;
    root.innerHTML = `
      <div class="app-shell">
        <article class="album ${currentIndex === 0 ? "album-cover" : "album-open"}" data-chapter="${escapeHtml(chapter.id)}">
          ${renderNavigation()}
          ${renderMenu()}
          <div class="chapter-stage ${reducedMotion.matches ? "" : `enter-${direction}`}">
            ${renderChapterContent(chapter)}
          </div>
          ${renderFooter()}
        </article>
      </div>
      <p class="sr-only" aria-live="polite">Capítulo ${currentIndex + 1}: ${escapeHtml(chapter.shortLabel)}</p>
      ${renderLightbox()}
    `;
    bindInteractions();
    if (focusMenu) root.querySelector(".chapter-menu [data-go]")?.focus();
    if (focusTitle) root.querySelector("#chapter-title")?.setAttribute("tabindex", "-1");
    if (focusTitle) root.querySelector("#chapter-title")?.focus({ preventScroll: true });
  };

  function goToChapter(index, updateHistory = true) {
    if (!Number.isInteger(index) || index < 0 || index >= chapterCount || index === currentIndex) {
      menuOpen = false;
      render();
      return;
    }
    direction = index > currentIndex ? "forward" : "backward";
    currentIndex = index;
    menuOpen = false;
    const chapter = content.chapters[currentIndex];
    if (updateHistory) history.pushState({ chapter: chapter.id }, "", `#${chapter.id}`);
    render({ focusTitle: true });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      menuOpen = false;
      render();
      root.querySelector(".chapter-menu-button")?.focus();
      return;
    }
    const isInteractive = event.target.closest("button, a, input, textarea, select, dialog");
    if (isInteractive || menuOpen) return;
    if (event.key === "ArrowRight" && currentIndex < chapterCount - 1) goToChapter(currentIndex + 1);
    if (event.key === "ArrowLeft" && currentIndex > 0) goToChapter(currentIndex - 1);
  });

  window.addEventListener("popstate", () => {
    const nextIndex = chapterFromHash();
    direction = nextIndex >= currentIndex ? "forward" : "backward";
    currentIndex = nextIndex;
    menuOpen = false;
    render({ focusTitle: true });
  });

  currentIndex = chapterFromHash();
  render();
})();

