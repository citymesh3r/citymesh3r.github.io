(function () {
  "use strict";

  const D = window.CITYMESH3R_DATA;
  const S = window.CityMesh3RSlider;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function text(node, value) {
    if (node) node.textContent = value ?? "";
  }

  function get(path, obj = D) {
    return String(path).split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function iconHtml(icon) {
    return icon ? `<span class="icon"><i class="${S.escapeHtml(icon)}"></i></span>` : "";
  }

  function applyTheme(mode, remember = false) {
    const value = mode === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = value;
    const btn = $("#theme-toggle");
    if (btn) {
      btn.querySelector("i").className = value === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
      text(btn.querySelector(".theme-toggle-label"), value === "dark" ? "Dark" : "Light");
      btn.setAttribute("aria-label", `Switch to ${value === "dark" ? "light" : "dark"} theme`);
    }
    if (remember && D.theme?.rememberChoice) localStorage.setItem("citymesh3r-theme", value);
  }

  function initTheme() {
    const saved = D.theme?.rememberChoice ? localStorage.getItem("citymesh3r-theme") : null;
    applyTheme(saved || D.theme?.default || "dark");
    $("#theme-toggle")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  function initNavbar() {
    $$('[data-text]').forEach(node => text(node, get(node.dataset.text)));
    $$(".navbar-burger").forEach(burger => {
      burger.addEventListener("click", () => {
        const target = document.getElementById(burger.dataset.target);
        burger.classList.toggle("is-active");
        burger.setAttribute("aria-expanded", burger.classList.contains("is-active") ? "true" : "false");
        target?.classList.toggle("is-active");
      });
    });
    $$(".navbar-item[href]").forEach(item => item.addEventListener("click", () => {
      $(".navbar-burger")?.classList.remove("is-active");
      $(".navbar-menu")?.classList.remove("is-active");
    }));
  }

  function renderHeading(container, cfg) {
    if (!container || !cfg) return;
    container.innerHTML = "";
    if (cfg.title) container.appendChild(el("h2", "", S.escapeHtml(cfg.title)));
    if (cfg.text) container.appendChild(el("p", "", cfg.text));
  }

  function renderHeadings() {
    $$('[data-heading]').forEach(node => renderHeading(node, D.headings?.[node.dataset.heading]));
  }

  function renderHero() {
    const p = D.paper;
    text($("#hero-eyebrow"), p.eyebrow || "");
    if (!p.eyebrow) $("#hero-eyebrow")?.remove();
    $("#hero-title").innerHTML = p.titleHtml || S.escapeHtml(p.shortTitle || "");

    const authors = $("#authors");
    authors.innerHTML = D.authors.map((a, i) => {
      const body = a.href ? `<a href="${S.escapeHtml(a.href)}" target="_blank" rel="noopener">${S.escapeHtml(a.name)}</a>` : S.escapeHtml(a.name);
      return `<span class="author-block">${body}</span>${i < D.authors.length - 1 ? '<span class="author-sep">·</span>' : ''}`;
    }).join(" ");

    const aff = $("#affiliations");
    aff.innerHTML = (p.affiliations || []).map(x => `<span>${S.escapeHtml(x)}</span>`).join("<br>");

    const venue = $("#venue-line");
    if (p.venue?.text) {
      venue.innerHTML = p.venue.href
        ? `<a href="${S.escapeHtml(p.venue.href)}" target="_blank" rel="noopener"><i class="fa-solid fa-award"></i>${S.escapeHtml(p.venue.text)}</a>`
        : `<span><i class="fa-solid fa-award"></i>${S.escapeHtml(p.venue.text)}</span>`;
    } else {
      venue.remove();
    }

    const links = $("#paper-links");
    links.innerHTML = (p.links || []).map(link => {
      const disabled = !link.href || link.href === "#";
      const href = disabled ? "#" : link.href;
      return `<a class="button is-rounded project-button ${disabled ? "is-disabled" : ""}" href="${S.escapeHtml(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${iconHtml(link.icon)}<span>${S.escapeHtml(link.label)}</span></a>`;
    }).join("");
    text($("#tagline"), p.tagline || "");
  }

  function mediaInto(container, media, opts = {}) {
    if (!container) return;
    container.innerHTML = "";
    if (media?.kind === "image" && S.hasPath(media.src)) {
      container.classList.add("is-media-loading");
      const img = el("img");
      img.loading = opts.eager ? "eager" : "lazy";
      img.alt = media.alt || "";
      const overlay = makeLoadingOverlay("Loading image…", "image-loading-overlay");
      const done = () => { container.classList.remove("is-media-loading"); overlay.hidden = true; };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", () => {
        container.innerHTML = "";
        container.appendChild(S.makePlaceholder(media?.placeholderLabel || media?.alt || "Image unavailable", media?.color, "Could not load image file"));
      }, { once: true });
      container.append(img, overlay);
      img.src = media.src;
    } else if (media?.kind === "video" && S.hasPath(media.src)) {
      const v = el("video", "simple-video");
      v.src = media.src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.controls = Boolean(media.controls);
      v.preload = "metadata";
      container.appendChild(v);
    } else {
      container.appendChild(S.makePlaceholder(media?.placeholderLabel || media?.alt || "Media placeholder", media?.color));
    }
  }

  function renderStaticMedia() {
    mediaInto($("#teaser-media"), D.assets?.teaser, { eager: true });
    text($("#teaser-caption"), D.assets?.teaser?.caption || "");
    mediaInto($("#pipeline-media"), D.assets?.pipeline);
    text($("#pipeline-caption"), D.assets?.pipeline?.caption || "");
  }

  function renderAbstract() {
    const wrap = $("#abstract-text");
    const paragraphs = D.abstract || [];
    const ui = D.abstractUi || {};
    const previewCount = Math.max(0, Number(ui.previewParagraphs ?? 1));
    const readMoreLabel = ui.readMoreLabel || "Read full abstract";
    const showLessLabel = ui.showLessLabel || "Show less";
    const tldr = D.abstractTldr || D.tldr ||
      "City-Mesh3R reconstructs explicit, watertight, simulation-ready city-scale meshes from unordered multi-view images. It scales through distributed sparse-to-dense reconstruction, geometry-aware partitioning, and curvature-aware adaptive remeshing.";
    const preview = paragraphs.slice(0, previewCount).map(p => `<p class="abstract-preview">${S.escapeHtml(p)}</p>`).join("");
    // Only reveal the paragraphs that are not already visible in the preview.
    const full = paragraphs.slice(previewCount).map(p => `<p>${S.escapeHtml(p)}</p>`).join("");
    wrap.innerHTML = `
      <div class="abstract-tldr"><h3>TL;DR</h3><p>${S.escapeHtml(tldr)}</p></div>
      ${preview}
      ${full ? `<button class="button is-small is-rounded abstract-toggle" type="button" aria-expanded="false">
        <span>${S.escapeHtml(readMoreLabel)}</span><span class="icon"><i class="fa-solid fa-chevron-down"></i></span>
      </button>
      <div class="abstract-full" hidden>${full}</div>` : ""}`;
    const btn = wrap.querySelector(".abstract-toggle");
    const fullBox = wrap.querySelector(".abstract-full");
    btn?.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      fullBox.hidden = expanded;
      btn.querySelector("span:first-child").textContent = expanded ? readMoreLabel : showLessLabel;
      btn.querySelector("i").className = expanded ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
    });
  }

  function renderCards(target, items) {
    const root = $(target);
    if (!root) return;
    root.innerHTML = (items || []).map(item => `
      <article class="info-card">
        <div class="info-card-head">
          <div class="card-icon"><i class="${S.escapeHtml(item.icon || "fa-solid fa-circle")}"></i></div>
          <h3>${S.escapeHtml(item.title)}</h3>
        </div>
        <p>${S.escapeHtml(item.text)}</p>
      </article>`).join("");
  }

  function metadataChips(metadata) {
    const entries = Object.entries(metadata || {}).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
    if (!entries.length) return "";
    return `<div class="meta-chips">${entries.map(([k, v]) => `<span><b>${S.escapeHtml(k)}</b>${S.escapeHtml(v)}</span>`).join("")}</div>`;
  }

  function optionValue(v) { return v.key || v.id || String(v); }

  function makeSelect(label, values, selected, getLabel = x => x.label || x.title || x.id || x.key || x) {
    const wrap = el("label", "control-label choice-control");
    wrap.appendChild(el("span", "choice-label", S.escapeHtml(label)));
    const select = el("select", "select-input choice-select");
    const buttons = el("div", "choice-buttons");
    wrap.append(select, buttons);

    const syncButtons = () => {
      buttons.querySelectorAll("button").forEach(btn => btn.classList.toggle("is-active", btn.dataset.value === select.value));
    };
    const fill = (items, selectedValue) => {
      select.innerHTML = "";
      buttons.innerHTML = "";
      items.forEach(v => {
        const value = optionValue(v);
        const labelText = getLabel(v);
        const opt = el("option");
        opt.value = value;
        opt.textContent = labelText;
        if (value === selectedValue) opt.selected = true;
        select.appendChild(opt);
        const btn = el("button", "button is-small is-rounded choice-button", S.escapeHtml(labelText));
        btn.type = "button";
        btn.dataset.value = value;
        btn.addEventListener("click", () => {
          if (select.value === value) return;
          select.value = value;
          syncButtons();
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        buttons.appendChild(btn);
      });
      if (selectedValue && !items.some(v => optionValue(v) === selectedValue)) select.value = optionValue(items[0] || "");
      syncButtons();
    };
    fill(values, selected);
    select.addEventListener("change", syncButtons);
    return { wrap, select, buttons, setOptions: fill };
  }


  function setupResponsiveControlMode(controls) {
    if (!controls || controls.dataset.responsiveControlWired) return;
    controls.dataset.responsiveControlWired = "1";
    const breakpoint = D.mediaDefaults?.wideBreakpointPx || 880;
    const update = () => {
      // If called before the controls are attached to the DOM, wait; otherwise
      // clientWidth is 0 and desktop button rows get incorrectly forced into dropdown mode.
      if (!controls.isConnected || controls.clientWidth < 10) {
        requestAnimationFrame(update);
        return;
      }
      if (window.innerWidth <= breakpoint) {
        controls.classList.remove("force-dropdown-controls");
        return;
      }
      controls.classList.remove("force-dropdown-controls");
      const visibleChoices = $$(".choice-control", controls).filter(node => getComputedStyle(node).display !== "none");
      const playback = $(".playback-buttons", controls);
      const choiceWidth = visibleChoices.reduce((sum, node) => sum + (node.querySelector(".choice-buttons")?.scrollWidth || node.scrollWidth || 0), 0);
      const playbackWidth = playback && getComputedStyle(playback).display !== "none" ? playback.scrollWidth : 0;
      const gaps = Math.max(0, visibleChoices.length) * 12;
      if (choiceWidth + playbackWidth + gaps > Math.max(controls.clientWidth - 8, 1)) controls.classList.add("force-dropdown-controls");
    };
    controls._responsiveControlUpdate = update;
    requestAnimationFrame(update);
    window.addEventListener("resize", update, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(controls);
  }

  function playbackButtons(showControls, opts = {}) {
    const resetOnly = Boolean(opts.resetOnly);
    const wrap = el("div", `playback-buttons ${showControls || resetOnly ? "" : "is-hidden"}`);
    wrap.innerHTML = resetOnly ? `
      <button class="button is-small is-rounded" type="button" data-action="restart"><span class="icon"><i class="fa-solid fa-rotate-left"></i></span><span>Reset</span></button>
      <button class="button is-small is-rounded" type="button" data-action="animate-slider"><span class="icon"><i class="fa-solid fa-arrows-left-right"></i></span><span>Animate Slider</span></button>` : `
      <button class="button is-small is-rounded" type="button" data-action="play"><span class="icon"><i class="fa-solid fa-play"></i></span><span>Play</span></button>
      <button class="button is-small is-rounded" type="button" data-action="pause"><span class="icon"><i class="fa-solid fa-pause"></i></span><span>Pause</span></button>
      <button class="button is-small is-rounded" type="button" data-action="restart"><span class="icon"><i class="fa-solid fa-rotate-left"></i></span><span>Restart</span></button>`;
    return wrap;
  }

  function makeWidgetShell(title, subtitle, metadata, note) {
    const card = el("article", "widget-card");
    const head = el("div", "widget-head");
    const titleBox = el("div");
    titleBox.innerHTML = `<h4>${S.escapeHtml(title || "Comparison")}</h4>${subtitle ? `<p>${S.escapeHtml(subtitle)}</p>` : ""}${note ? `<p class="note">${S.escapeHtml(note)}</p>` : ""}`;
    head.appendChild(titleBox);
    const chips = metadataChips(metadata);
    if (chips) head.insertAdjacentHTML("beforeend", chips);
    card.appendChild(head);
    return card;
  }

  function makeLoadingOverlay(message, className = "video-loading-overlay") {
    const overlay = el("div", className);
    overlay.innerHTML = `<div class="video-loading-box"><span class="video-spinner" aria-hidden="true"></span><span class="video-loading-text">${S.escapeHtml(message)}</span></div>`;
    return overlay;
  }

  function collectVideos(sliders) {
    return sliders.flatMap(slider => slider?.getVideos ? slider.getVideos() : []);
  }

  function collectImages(sliders) {
    return sliders.flatMap(slider => slider?.getImages ? slider.getImages() : []);
  }

  function setGroupLoading(root, controls, isLoading, message = "Loading synced videos…") {
    if (!root) return;
    root.classList.toggle("is-video-loading", Boolean(isLoading));
    let overlay = root.querySelector(":scope > .video-loading-overlay");
    if (!overlay) {
      overlay = makeLoadingOverlay(message, "video-loading-overlay");
      root.appendChild(overlay);
    }
    text(overlay.querySelector(".video-loading-text"), message);
    overlay.hidden = !isLoading;
    controls?.querySelectorAll("button[data-action]").forEach(btn => { btn.disabled = Boolean(isLoading); });
  }

  function wireSliderAnimationButton(controls) {
    if (!controls || controls.dataset.animateWired) return;
    controls.dataset.animateWired = "1";
    const btn = controls.querySelector("[data-action='animate-slider']");
    btn?.addEventListener("click", () => controls._sliderAnimation?.toggle?.());
  }

  function setAnimateButtonState(controls, isRunning) {
    const btn = controls?.querySelector("[data-action='animate-slider']");
    if (!btn) return;
    const label = btn.querySelector("span:last-child");
    if (label) label.textContent = isRunning ? "Stop Animation" : "Animate Slider";
    btn.classList.toggle("is-active", Boolean(isRunning));
  }

  function hydrateSliders(card, sliders, controls, opts, loadingRoot) {
    controls?._sliderAnimation?.stop?.();
    controls?._syncApi?.destroy?.();
    const resetRatio = Number(opts?.initialSlider ?? D.mediaDefaults?.initialSlider ?? 0.5);
    if (controls) {
      controls._resetVisuals = () => sliders.forEach(slider => slider?.setRatio?.(resetRatio));
    }

    const api = S.syncVideos(collectVideos(sliders), controls, { autoplay: false, loop: opts?.loop !== false });
    const token = String((Number(card.dataset.hydrateToken || 0) + 1));
    card.dataset.hydrateToken = token;

    wireSliderAnimationButton(controls);
    controls._sliderAnimation = S.createSliderAnimation(sliders, {
      min: opts?.sliderAnimation?.min ?? D.mediaDefaults?.sliderAnimation?.min ?? 0.2,
      max: opts?.sliderAnimation?.max ?? D.mediaDefaults?.sliderAnimation?.max ?? 0.8,
      speed: opts?.sliderAnimation?.speed ?? D.mediaDefaults?.sliderAnimation?.speed ?? 0.12,
      initial: resetRatio,
      onStateChange: (running) => setAnimateButtonState(controls, running)
    });
    setAnimateButtonState(controls, false);

    const videos = api.videos || [];
    if (!videos.length) return api;

    setGroupLoading(loadingRoot || card, controls, true, "Downloading synced videos…");
    const readyOpts = { timeoutMs: opts?.readyTimeoutMs || D.mediaDefaults?.readyTimeoutMs || 90000 };
    S.preloadVideoGroupFully(videos, readyOpts).then(results => {
      if (card.dataset.hydrateToken !== token) { api.destroy?.(); return; }
      setGroupLoading(loadingRoot || card, controls, false);
      controls?._resetVisuals?.();
      api.restart(Boolean(opts?.autoplayOnVisible));
      if (opts?.sliderAnimation?.enabledByDefault) controls?._sliderAnimation?.start?.();
      const failed = (results || []).some(r => !r.ok);
      if (failed) console.warn("[City-Mesh3R] One or more synced videos did not become ready cleanly.", results);
    }).catch(err => {
      if (card.dataset.hydrateToken !== token) { api.destroy?.(); return; }
      setGroupLoading(loadingRoot || card, controls, false, "Video loading failed. Try Reset.");
      console.warn("[City-Mesh3R] Synced video preload failed", err);
      controls?._resetVisuals?.();
      // Last-resort fallback: stream normally, but still start as a group.
      sliders.forEach(s => s?.loadMedia?.());
      S.waitForVideoGroupReady(videos, readyOpts).finally(() => api.restart(Boolean(opts?.autoplayOnVisible)));
    });
    return api;
  }

  function hydrateImageSliders(card, sliders, controls, opts = {}, loadingRoot) {
    controls?._sliderAnimation?.stop?.();
    const resetRatio = Number(opts?.initialSlider ?? D.mediaDefaults?.initialSlider ?? 0.5);
    if (controls) controls._resetVisuals = () => sliders.forEach(slider => slider?.setRatio?.(resetRatio));
    wireSliderAnimationButton(controls);
    controls._sliderAnimation = S.createSliderAnimation(sliders, {
      min: opts?.sliderAnimation?.min ?? D.mediaDefaults?.sliderAnimation?.min ?? 0.2,
      max: opts?.sliderAnimation?.max ?? D.mediaDefaults?.sliderAnimation?.max ?? 0.8,
      speed: opts?.sliderAnimation?.speed ?? D.mediaDefaults?.sliderAnimation?.speed ?? 0.12,
      initial: resetRatio,
      onStateChange: (running) => setAnimateButtonState(controls, running)
    });
    setAnimateButtonState(controls, false);
    if (controls && !controls.dataset.imageResetWired) {
      controls.dataset.imageResetWired = "1";
      controls.querySelector("[data-action='restart']")?.addEventListener("click", () => {
        controls._sliderAnimation?.stop?.();
        controls._resetVisuals?.();
      });
    }
    setGroupLoading(loadingRoot || card, controls, true, "Loading comparison images…");
    S.preloadImageGroup(collectImages(sliders), { timeoutMs: opts?.imageReadyTimeoutMs || 30000 }).finally(() => {
      setGroupLoading(loadingRoot || card, controls, false);
      controls?._resetVisuals?.();
      if (opts?.sliderAnimation?.enabledByDefault) controls?._sliderAnimation?.start?.();
    });
  }

  function getVideoBlockType(key, cfg) {
    if (!cfg || typeof cfg !== "object") return "unknown";
    if (cfg.type) return cfg.type;
    if (cfg.video) return "standalone";
    if (key === "garden" || (cfg.ours && cfg.baselines)) return "dualSyncComparison";
    if (cfg.scenes) return "comparisonGroup";
    return "unknown";
  }

  function createStandaloneVideoCard(cfg) {
    const defaults = D.mediaDefaults || {};
    const controlsCfg = {
      ...defaults,
      showControls: true,
      autoplayOnVisible: false,
      muted: false,
      loop: false,
      ...(cfg.controls || {})
    };
    const card = makeWidgetShell(cfg.title, cfg.subtitle, cfg.metadata, cfg.note);
    const frame = el("div", "single-video-frame standalone-video-frame");
    const media = cfg.video || {};

    if (S.hasPath(media.src)) {
      const v = el("video", "simple-video standalone-video");
      v.controls = controlsCfg.showControls !== false;
      v.muted = controlsCfg.muted !== false;
      v.loop = controlsCfg.loop !== false;
      v.playsInline = true;
      v.preload = "none";
      if (S.hasPath(media.poster)) v.poster = media.poster;
      v.dataset.src = media.src;
      v.dataset.loaded = "0";
      v.setAttribute("aria-label", media.label || cfg.title || "standalone video");
      frame.appendChild(v);
    } else {
      frame.appendChild(S.makePlaceholder(media.label || cfg.title || "Standalone video", media.color));
    }

    card.appendChild(frame);
    S.observeLazy(card, () => {
      S.loadMedia(frame);
      const video = frame.querySelector("video");
      if (video && controlsCfg.autoplayOnVisible) {
        try { video.currentTime = 0; } catch (_) {}
        video.play().catch(() => {});
      }
    });
    return card;
  }

  function renderStandaloneVideoBlocks() {
    Object.entries(D.videos || {}).forEach(([key, cfg]) => {
      if (getVideoBlockType(key, cfg) !== "standalone") return;
      const mountId = cfg.mount || cfg.id || (key === "areaPartitioning" ? "area-visualizer" : "");
      if (!mountId) return;
      const root = document.getElementById(mountId);
      if (!root) return;
      root.innerHTML = "";
      if (cfg.enabled === false) return;
      root.appendChild(createStandaloneVideoCard(cfg));
    });
  }

  function createResponsiveVideoComparison(cfg, baselines, options = {}) {
    const defaults = D.mediaDefaults || {};
    const controlsCfg = {
      ...defaults,
      ...(cfg.controls || {}),
      ...(options.controls || {}),
      sliderAnimation: {
        ...(defaults.sliderAnimation || {}),
        ...(cfg.sliderAnimation || {}),
        ...(options.sliderAnimation || {})
      }
    };
    const card = makeWidgetShell("", "", null);
    const sceneCtl = makeSelect("Scene", cfg.scenes, cfg.scenes[0]?.id, x => x.title);
    const baselineCtl = makeSelect("Compare against", baselines, baselines[0]?.key, x => x.label);
    baselineCtl.wrap.classList.add("mobile-only-control");

    const controls = el("div", "widget-controls wrap-controls");
    controls.append(sceneCtl.wrap, baselineCtl.wrap, playbackButtons(Boolean(controlsCfg.showControls), { resetOnly: true }));
    setupResponsiveControlMode(controls);
    card.appendChild(controls);

    const content = el("div", "responsive-comparison-content");
    card.appendChild(content);

    let lazyReady = false;
    let activeApi = null;
    let currentRatio = controlsCfg.initialSlider || 0.5;

    const sceneById = id => cfg.scenes.find(x => x.id === id) || cfg.scenes[0];
    const baselineByKey = key => baselines.find(x => x.key === key) || baselines[0];

    function updateTitle(scene) {
      const head = $(".widget-head", card);
      head.innerHTML = "";
      const titleBox = el("div");
      titleBox.innerHTML = `<h4>${S.escapeHtml(scene.title)}</h4>${scene.subtitle ? `<p>${S.escapeHtml(scene.subtitle)}</p>` : ""}`;
      head.appendChild(titleBox);
      const chips = metadataChips(scene.metadata);
      if (chips) head.insertAdjacentHTML("beforeend", chips);
    }

    function makeSlider(scene, baseline, extraId) {
      return S.createComparisonSlider({
        id: `${cfg.id}-${scene.id}-${baseline.key}-${extraId}`,
        kind: "video",
        ratio: currentRatio,
        top: scene.methods.ours,
        topLabel: scene.methods.ours.label || defaults.topLabel,
        bottom: scene.methods[baseline.key],
        bottomLabel: baseline.label,
        mediaOptions: { controls: Boolean(controlsCfg.showControls), muted: controlsCfg.muted !== false, loop: controlsCfg.loop !== false },
        onRatioChange: (ratio, source) => {
          controls._sliderAnimation?.stop?.();
          currentRatio = ratio;
          S.setRatioMany($$(".comparison-slider", content), ratio, source);
        }
      });
    }

    function render() {
      activeApi?.destroy?.();
      activeApi = null;
      controls._sliderAnimation?.stop?.();
      const scene = sceneById(sceneCtl.select.value);
      const selectedBaseline = baselineByKey(baselineCtl.select.value);
      currentRatio = controlsCfg.resetSliderOnChange === false ? currentRatio : (controlsCfg.initialSlider || 0.5);
      updateTitle(scene);
      content.innerHTML = "";

      const wide = el("div", "wide-baseline-grid");
      const wideSliders = baselines.map(b => {
        const block = el("div", "baseline-column");
        block.appendChild(el("h5", "comparison-subtitle", `Ours vs ${S.escapeHtml(b.label)}`));
        const slider = makeSlider(scene, b, "wide");
        block.appendChild(slider);
        wide.appendChild(block);
        return slider;
      });

      const narrow = el("div", "narrow-baseline-stack");
      const narrowSlider = makeSlider(scene, selectedBaseline, "narrow");
      narrow.appendChild(el("h5", "comparison-subtitle", `Ours vs ${S.escapeHtml(selectedBaseline.label)}`));
      narrow.appendChild(narrowSlider);

      content.append(wide, narrow);
      const isNarrow = window.matchMedia(`(max-width: ${D.mediaDefaults?.wideBreakpointPx || 880}px)`).matches;
      const activeSliders = isNarrow ? [narrowSlider] : wideSliders;
      if (lazyReady) {
        activeApi = hydrateSliders(card, activeSliders, controls, controlsCfg, content);
      }
    }

    sceneCtl.select.addEventListener("change", render);
    baselineCtl.select.addEventListener("change", render);
    render();
    S.observeLazy(card, () => { lazyReady = true; render(); });
    return card;
  }

  function createPaperQualitativeWidget(cfg) {
    const card = makeWidgetShell("Interactive Qualitative Mesh and Normal Render Comparisons", "", null);
    const sceneCtl = makeSelect("Scene", cfg.scenes, cfg.scenes[0]?.id, x => x.title);
    const firstScene = cfg.scenes[0];
    const viewCtl = makeSelect("View", firstScene.views, firstScene.views[0]?.id, x => x.label);
    const baselineCtl = makeSelect("Compare against", cfg.baselines, cfg.baselines[0]?.key, x => x.label);
    baselineCtl.wrap.classList.add("mobile-only-control");
    const controls = el("div", "widget-controls wrap-controls");
    controls.append(sceneCtl.wrap, viewCtl.wrap, baselineCtl.wrap, playbackButtons(false, { resetOnly: true }));
    setupResponsiveControlMode(controls);
    const content = el("div", "paper-qual-content");
    card.append(controls, content);

    let lazyReady = false;
    let currentRatio = D.mediaDefaults?.initialSlider || 0.5;
    const sceneById = id => cfg.scenes.find(x => x.id === id) || cfg.scenes[0];
    const baselineByKey = key => cfg.baselines.find(x => x.key === key) || cfg.baselines[0];

    function updateViewOptions(scene) {
      const old = viewCtl.select.value;
      viewCtl.setOptions(scene.views, scene.views.some(v => v.id === old) ? old : scene.views[0]?.id);
      requestAnimationFrame(() => controls._responsiveControlUpdate?.());
    }

    function render() {
      controls._sliderAnimation?.stop?.();
      const scene = sceneById(sceneCtl.select.value);
      updateViewOptions(scene);
      const view = scene.views.find(v => v.id === viewCtl.select.value) || scene.views[0];
      const selectedBaseline = baselineByKey(baselineCtl.select.value);
      currentRatio = cfg.resetSliderOnChange === false ? currentRatio : (cfg.initialSlider ?? D.mediaDefaults?.initialSlider ?? 0.5);
      content.innerHTML = "";
      const chips = metadataChips(scene.metadata);
      if (chips) content.insertAdjacentHTML("beforeend", chips);

      const wide = el("div", "paper-wide-grid");
      const allSliders = [];
      ["mesh", "normal"].forEach(renderType => {
        const rowLabel = el("div", "render-row-label", renderType === "mesh" ? "Mesh render" : "Normal render");
        wide.appendChild(rowLabel);
        cfg.baselines.forEach(b => {
          const slider = S.createComparisonSlider({
            kind: "image",
            ratio: currentRatio,
            top: view.renders[renderType].ours,
            topLabel: "City-Mesh3R",
            bottom: view.renders[renderType][b.key],
            bottomLabel: b.label,
            onRatioChange: (ratio, source) => {
              currentRatio = ratio;
              S.setRatioMany(allSliders, ratio, source);
            }
          });
          const block = el("div", "paper-cell");
          block.appendChild(el("h5", "comparison-subtitle", `Ours vs ${S.escapeHtml(b.label)}`));
          block.appendChild(slider);
          wide.appendChild(block);
          allSliders.push(slider);
        });
      });

      const narrow = el("div", "paper-narrow-stack");
      ["mesh", "normal"].forEach(renderType => {
        const slider = S.createComparisonSlider({
          kind: "image",
          ratio: currentRatio,
          top: view.renders[renderType].ours,
          topLabel: "City-Mesh3R",
          bottom: view.renders[renderType][selectedBaseline.key],
          bottomLabel: selectedBaseline.label,
          onRatioChange: (ratio, source) => {
            currentRatio = ratio;
            S.setRatioMany(allSliders, ratio, source);
          }
        });
        const block = el("div", "paper-narrow-block");
        block.appendChild(el("h5", "comparison-subtitle", `${renderType === "mesh" ? "Mesh" : "Normal"}: Ours vs ${S.escapeHtml(selectedBaseline.label)}`));
        block.appendChild(slider);
        narrow.appendChild(block);
        allSliders.push(slider);
      });

      content.append(wide, narrow);
      const isNarrow = window.matchMedia(`(max-width: ${D.mediaDefaults?.wideBreakpointPx || 880}px)`).matches;
      const activeSliders = isNarrow ? Array.from(narrow.querySelectorAll(".comparison-slider")) : Array.from(wide.querySelectorAll(".comparison-slider"));
      requestAnimationFrame(() => controls._responsiveControlUpdate?.());
      if (lazyReady) hydrateImageSliders(card, activeSliders, controls, {
        initialSlider: cfg.initialSlider ?? D.mediaDefaults?.initialSlider,
        sliderAnimation: { ...(D.mediaDefaults?.sliderAnimation || {}), ...(cfg.sliderAnimation || {}) }
      }, content);
    }

    sceneCtl.select.addEventListener("change", render);
    viewCtl.select.addEventListener("change", render);
    baselineCtl.select.addEventListener("change", render);
    render();
    S.observeLazy(card, () => { lazyReady = true; render(); });
    return card;
  }

  function createGardenWidget(cfg) {
    const card = makeWidgetShell(cfg.title, cfg.subtitle, cfg.metadata);
    const baselineCtl = makeSelect("Compare against", cfg.baselines, cfg.baselines[0]?.key, x => x.label);
    const controls = el("div", "widget-controls wrap-controls");
    controls.append(baselineCtl.wrap, playbackButtons(Boolean(cfg.controls?.showControls), { resetOnly: true }));
    setupResponsiveControlMode(controls);
    const content = el("div", "garden-comparison-grid");
    card.append(controls, content);

    let lazyReady = false;
    let activeApi = null;
    let currentRatio = D.mediaDefaults?.initialSlider || 0.5;
    const baselineByKey = key => cfg.baselines.find(x => x.key === key) || cfg.baselines[0];

    function render() {
      activeApi?.destroy?.();
      activeApi = null;
      controls._sliderAnimation?.stop?.();
      const b = baselineByKey(baselineCtl.select.value);
      currentRatio = D.mediaDefaults?.initialSlider || 0.5;
      content.innerHTML = "";
      const sliders = [
        { key: "mesh", title: "Mesh render", top: cfg.ours.mesh, bottom: b.mesh },
        { key: "normal", title: "Normal render", top: cfg.ours.normal, bottom: b.normal }
      ].map(spec => {
        const slider = S.createComparisonSlider({
          kind: "video",
          ratio: currentRatio,
          top: spec.top,
          topLabel: cfg.ours.label,
          bottom: spec.bottom,
          bottomLabel: b.label,
          mediaOptions: { controls: Boolean(cfg.controls?.showControls), muted: true, loop: true },
          onRatioChange: (ratio, source) => {
            controls._sliderAnimation?.stop?.();
            currentRatio = ratio;
            S.setRatioMany($$(".comparison-slider", content), ratio, source);
          }
        });
        const block = el("div", "garden-panel");
        block.appendChild(el("h5", "comparison-subtitle", spec.title));
        block.appendChild(slider);
        content.appendChild(block);
        return slider;
      });
      if (lazyReady) {
        const gardenOpts = {
          ...(cfg.controls || {}),
          initialSlider: cfg.initialSlider ?? D.mediaDefaults?.initialSlider,
          sliderAnimation: { ...(D.mediaDefaults?.sliderAnimation || {}), ...(cfg.sliderAnimation || {}) }
        };
        activeApi = hydrateSliders(card, sliders, controls, gardenOpts, content);
      }
    }

    baselineCtl.select.addEventListener("change", render);
    render();
    S.observeLazy(card, () => { lazyReady = true; render(); });
    return card;
  }

  function renderVideos() {
    renderStandaloneVideoBlocks();
    $("#large-scale-camera-walkthrough").appendChild(
      createResponsiveVideoComparison(D.videos.cameraWalkthrough, D.videos.baselinesLargeScale)
    );
    $("#light-stress-comparison").appendChild(
      createResponsiveVideoComparison(D.videos.lightStress, D.videos.baselinesLargeScale)
    );
    $("#paper-qualitative-comparison").appendChild(createPaperQualitativeWidget(D.paperQualitative));
    $("#garden-dual-sync").appendChild(createGardenWidget(D.videos.garden));
  }

  function renderTables() {
    const root = $("#tables");
    root.innerHTML = "";
    (D.tables || []).forEach(table => {
      const card = el("article", "table-card");
      card.innerHTML = `<h3>${S.escapeHtml(table.title)}</h3>${table.note ? `<p>${S.escapeHtml(table.note)}</p>` : ""}`;
      const scroll = el("div", "table-scroll");
      const tbl = el("table", "table is-fullwidth result-table");
      tbl.innerHTML = `
        <thead><tr>${table.columns.map(c => `<th>${S.escapeHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>${table.rows.map(row => `<tr>${row.map(cell => {
          const c = typeof cell === "object" ? cell : { text: cell };
          const classes = [c.className || "", c.rank === "best" ? "rank-best" : "", c.rank === "second" ? "rank-second" : ""].filter(Boolean).join(" ");
          return `<td class="${classes}">${S.escapeHtml(c.text)}</td>`;
        }).join("")}</tr>`).join("")}</tbody>`;
      scroll.appendChild(tbl);
      card.appendChild(scroll);
      root.appendChild(card);
    });
  }

  function renderBibtex() {
    text($("#bibtex-code"), D.bibtex || "");
    text($("#footer-text"), D.footer || "");
    const btn = $("#copy-bibtex");
    btn?.addEventListener("click", async () => {
      const value = $("#bibtex-code")?.innerText || "";
      const label = btn.querySelector("span:last-child");
      const oldLabel = label?.textContent || "Copy";
      try {
        await navigator.clipboard.writeText(value);
        if (label) label.textContent = "Copied";
      } catch (_) {
        const range = document.createRange();
        const code = $("#bibtex-code");
        if (code) {
          range.selectNodeContents(code);
          const sel = window.getSelection();
          sel.removeAllRanges(); sel.addRange(range);
          try { document.execCommand("copy"); if (label) label.textContent = "Copied"; } catch (_) {}
          sel.removeAllRanges();
        }
      }
      setTimeout(() => { if (label) label.textContent = oldLabel; }, 1400);
    }, { once: false });
  }

  function main() {
    initTheme();
    initNavbar();
    renderHeadings();
    renderHero();
    renderStaticMedia();
    renderAbstract();
    renderCards("#contribution-grid", D.contributions);
    renderVideos();
    renderTables();
    renderCards("#applications-grid", D.applications);
    renderBibtex();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
