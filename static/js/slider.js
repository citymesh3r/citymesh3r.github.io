(function () {
  "use strict";

  const DEFAULT_RATIO = 0.5;
  let uid = 0;

  function hasPath(src) {
    return typeof src === "string" && src.trim().length > 0 && !src.includes("TODO");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  }

  function makePlaceholder(label, color, note = "Missing media path or file not loaded yet") {
    const el = document.createElement("div");
    el.className = "placeholder-media";
    el.style.setProperty("--placeholder-color", color || "#334155");
    el.innerHTML = `<div><strong>${escapeHtml(label || "Media placeholder")}</strong><span>${escapeHtml(note)}</span></div>`;
    return el;
  }

  function createVideoEl(media = {}, label, lazy = true, opts = {}) {
    if (!hasPath(media.src)) return makePlaceholder(label, media.color);
    const v = document.createElement("video");
    v.className = "cmp-video";
    v.muted = opts.muted !== false;
    v.loop = opts.loop !== false;
    v.playsInline = true;
    v.preload = lazy ? "none" : "metadata";
    v.controls = Boolean(opts.controls);
    if (hasPath(media.poster)) v.poster = media.poster;
    v.dataset.src = media.src;
    v.dataset.loaded = "0";
    v.setAttribute("aria-label", label || "comparison video");
    return v;
  }

  function createImageEl(media = {}, label) {
    if (!hasPath(media.src)) return makePlaceholder(label, media.color);
    const img = document.createElement("img");
    img.className = "cmp-image";
    img.loading = "lazy";
    img.alt = label || "comparison image";
    img.dataset.src = media.src;
    img.dataset.loaded = "0";
    img.addEventListener("error", () => {
      const repl = makePlaceholder(label || "Image unavailable", media.color, "Could not load image file");
      try { img.replaceWith(repl); } catch (_) {}
    }, { once: true });
    return img;
  }

  function loadMedia(root) {
    root.querySelectorAll("video[data-src][data-loaded='0']").forEach(v => {
      v.src = v.dataset.src;
      v.dataset.loaded = "1";
      try { v.load(); } catch (_) {}
    });
    root.querySelectorAll("img[data-src][data-loaded='0']").forEach(img => {
      img.src = img.dataset.src;
      img.dataset.loaded = "1";
    });
  }

  function unloadMedia(root) {
    root.querySelectorAll("video[data-loaded='1']").forEach(v => {
      try { v.pause(); } catch (_) {}
      v.removeAttribute("src");
      v.dataset.loaded = "0";
      try { v.load(); } catch (_) {}
    });
  }

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  function setRatio(root, ratio) {
    const r = clamp(Number(ratio), 0.02, 0.98);
    root.style.setProperty("--split", `${r * 100}%`);
    root.dataset.ratio = String(r);
    const range = root.querySelector(".cmp-range");
    if (range) range.value = String(Math.round(r * 100));
  }

  function wireDrag(root, onChange) {
    const handle = root.querySelector(".cmp-handle");
    const range = root.querySelector(".cmp-range");
    let active = false;

    const updateFromClientX = (clientX) => {
      const rect = root.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      setRatio(root, ratio);
      if (onChange) onChange(ratio, root);
    };

    const down = (e) => {
      active = true;
      root.classList.add("is-dragging");
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      if (Number.isFinite(x)) updateFromClientX(x);
    };
    const move = (e) => {
      if (!active) return;
      e.preventDefault();
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      if (Number.isFinite(x)) updateFromClientX(x);
    };
    const up = () => {
      active = false;
      root.classList.remove("is-dragging");
    };

    root.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    if (range) {
      range.addEventListener("input", () => {
        const ratio = Number(range.value) / 100;
        setRatio(root, ratio);
        if (onChange) onChange(ratio, root);
      });
    }
    if (handle) {
      handle.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const step = e.key === "ArrowRight" ? 0.03 : -0.03;
        const ratio = clamp(Number(root.dataset.ratio || DEFAULT_RATIO) + step, 0, 1);
        setRatio(root, ratio);
        if (onChange) onChange(ratio, root);
      });
    }
  }

  function createComparisonSlider(opts = {}) {
    const id = opts.id || `cmp-${++uid}`;
    const kind = opts.kind || "video";
    const mediaOpts = opts.mediaOptions || {};
    const root = document.createElement("div");
    root.className = `comparison-slider ${kind === "image" ? "is-image" : "is-video"}`;
    root.id = id;
    root.dataset.ratio = String(opts.ratio || DEFAULT_RATIO);
    setRatio(root, opts.ratio || DEFAULT_RATIO);

    const bottom = document.createElement("div");
    bottom.className = "cmp-layer cmp-bottom";
    const top = document.createElement("div");
    top.className = "cmp-layer cmp-top";

    const make = (media, label) => kind === "image" ? createImageEl(media, label) : createVideoEl(media, label, true, mediaOpts);
    bottom.appendChild(make(opts.bottom, opts.bottomLabel));
    top.appendChild(make(opts.top, opts.topLabel));

    const labels = document.createElement("div");
    labels.className = "cmp-labels";
    labels.innerHTML = `<span class="top-label">${escapeHtml(opts.topLabel || "Top")}</span><span class="bottom-label">${escapeHtml(opts.bottomLabel || "Bottom")}</span>`;

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "cmp-handle";
    handle.setAttribute("aria-label", "Drag comparison slider");
    handle.innerHTML = `<span></span>`;

    const range = document.createElement("input");
    range.className = "cmp-range";
    range.type = "range";
    range.min = "0";
    range.max = "100";
    range.value = String(Math.round((opts.ratio || DEFAULT_RATIO) * 100));
    range.setAttribute("aria-label", "Comparison slider position");

    root.append(bottom, top, labels, handle, range);
    wireDrag(root, opts.onRatioChange);

    root.loadMedia = () => loadMedia(root);
    root.unloadMedia = () => unloadMedia(root);
    root.getVideos = () => Array.from(root.querySelectorAll("video"));
    root.getImages = () => Array.from(root.querySelectorAll("img"));
    root.setRatio = (ratio) => setRatio(root, ratio);
    root.setTop = (media, label) => {
      top.innerHTML = "";
      top.appendChild(make(media, label));
      labels.querySelector(".top-label").textContent = label || "Top";
    };
    root.setBottom = (media, label) => {
      bottom.innerHTML = "";
      bottom.appendChild(make(media, label));
      labels.querySelector(".bottom-label").textContent = label || "Bottom";
    };
    return root;
  }

  function setRatioMany(sliders, ratio, source) {
    sliders.forEach(slider => {
      if (!slider || slider === source) return;
      slider.setRatio ? slider.setRatio(ratio) : setRatio(slider, ratio);
    });
  }

  function getPlayable(videos) {
    return (videos || []).filter(v => v && v.tagName === "VIDEO");
  }

  const videoBlobCache = new Map();

  function getOriginalVideoSrc(video) {
    return video?.dataset?.src || video?.dataset?.originalSrc || video?.getAttribute?.("src") || "";
  }

  function setVideoSource(video, src, loadedValue = "1") {
    if (!video || !src) return;
    try {
      video.pause();
      video.src = src;
      video.dataset.loaded = loadedValue;
      video.preload = "auto";
      video.load();
    } catch (_) {}
  }

  function fetchVideoBlobUrl(src) {
    if (!hasPath(src)) return Promise.resolve(null);
    if (videoBlobCache.has(src)) return videoBlobCache.get(src);

    const promise = fetch(src, { cache: "force-cache" })
      .then(resp => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status} while fetching ${src}`);
        return resp.blob();
      })
      .then(blob => URL.createObjectURL(blob))
      .catch(err => {
        videoBlobCache.delete(src);
        console.warn("[City-Mesh3R] Full video preload failed; falling back to streaming:", src, err);
        return null;
      });

    videoBlobCache.set(src, promise);
    return promise;
  }

  async function preloadVideoGroupFully(videos, opts = {}) {
    const playable = getPlayable(videos);
    if (!playable.length) return [];

    const sources = Array.from(new Set(playable.map(getOriginalVideoSrc).filter(hasPath)));
    const urlBySrc = new Map();

    await Promise.all(sources.map(async src => {
      const blobUrl = await fetchVideoBlobUrl(src);
      urlBySrc.set(src, blobUrl || src);
    }));

    playable.forEach(video => {
      const src = getOriginalVideoSrc(video);
      if (!hasPath(src)) return;
      if (!video.dataset.originalSrc) video.dataset.originalSrc = src;
      const localSrc = urlBySrc.get(src) || src;
      if (video.src !== localSrc) setVideoSource(video, localSrc, localSrc === src ? "1" : "blob");
    });

    return waitForVideoGroupReady(playable, opts);
  }

  function waitForVideoReady(video, opts = {}) {
    const timeoutMs = Number(opts.timeoutMs || 45000);
    const targetState = Number(opts.targetReadyState || HTMLMediaElement.HAVE_FUTURE_DATA);
    return new Promise(resolve => {
      if (!video || video.tagName !== "VIDEO") return resolve({ ok: false, reason: "not-video", video });
      if (video.readyState >= targetState && Number.isFinite(video.duration)) {
        return resolve({ ok: true, reason: "already-ready", video });
      }

      let done = false;
      const cleanup = () => {
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("canplaythrough", onReady);
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("error", onError);
        clearTimeout(timer);
      };
      const finish = (ok, reason) => {
        if (done) return;
        done = true;
        cleanup();
        resolve({ ok, reason, video });
      };
      const onReady = () => {
        if (video.readyState >= targetState || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          finish(true, "ready");
        }
      };
      const onError = () => finish(false, "error");
      const timer = setTimeout(() => {
        // Do not block the UI forever. If the browser has at least metadata/current data,
        // let the group start; Reset remains available as a manual recovery.
        finish(video.readyState >= HTMLMediaElement.HAVE_METADATA, "timeout");
      }, timeoutMs);

      video.addEventListener("canplay", onReady);
      video.addEventListener("canplaythrough", onReady);
      video.addEventListener("loadeddata", onReady);
      video.addEventListener("error", onError);
      try { if (!video.src && video.dataset?.src) video.src = video.dataset.src; } catch (_) {}
      try { video.load(); } catch (_) {}
      onReady();
    });
  }

  function waitForVideoGroupReady(videos, opts = {}) {
    const playable = getPlayable(videos);
    if (!playable.length) return Promise.resolve([]);
    return Promise.all(playable.map(v => waitForVideoReady(v, opts)));
  }

  function waitForImageReady(img, opts = {}) {
    const timeoutMs = Number(opts.timeoutMs || 30000);
    return new Promise(resolve => {
      if (!img || img.tagName !== "IMG") return resolve({ ok: false, reason: "not-image", img });
      if (img.complete && img.naturalWidth > 0) return resolve({ ok: true, reason: "already-ready", img });
      let done = false;
      const cleanup = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        clearTimeout(timer);
      };
      const finish = (ok, reason) => {
        if (done) return;
        done = true;
        cleanup();
        resolve({ ok, reason, img });
      };
      const onLoad = () => finish(true, "load");
      const onError = () => finish(false, "error");
      const timer = setTimeout(() => finish(img.complete && img.naturalWidth > 0, "timeout"), timeoutMs);
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
      if (!img.src && img.dataset?.src) img.src = img.dataset.src;
    });
  }

  function preloadImageGroup(images, opts = {}) {
    const imgs = (images || []).filter(img => img && img.tagName === "IMG");
    imgs.forEach(img => {
      if (img.dataset?.loaded === "0" && img.dataset?.src) {
        img.src = img.dataset.src;
        img.dataset.loaded = "1";
      }
    });
    if (!imgs.length) return Promise.resolve([]);
    return Promise.all(imgs.map(img => waitForImageReady(img, opts)));
  }

  function createSliderAnimation(sliders, opts = {}) {
    const list = (sliders || []).filter(Boolean);
    let raf = 0;
    let running = false;
    let lastTime = 0;
    let direction = 1;
    let ratio = Number(opts.start ?? opts.initial ?? DEFAULT_RATIO);
    const min = clamp(Number(opts.min ?? 0.2), 0.02, 0.98);
    const max = clamp(Number(opts.max ?? 0.8), 0.02, 0.98);
    const speed = Math.max(0.02, Number(opts.speed ?? 0.12)); // ratio units per second
    const onStateChange = typeof opts.onStateChange === "function" ? opts.onStateChange : null;

    const apply = (r) => list.forEach(slider => slider?.setRatio?.(r));
    const tick = (ts) => {
      if (!running) return;
      if (!lastTime) lastTime = ts;
      const dt = Math.min(0.08, Math.max(0, (ts - lastTime) / 1000));
      lastTime = ts;
      ratio += direction * speed * dt;
      if (ratio >= max) { ratio = max; direction = -1; }
      if (ratio <= min) { ratio = min; direction = 1; }
      apply(ratio);
      raf = requestAnimationFrame(tick);
    };

    const api = {
      start() {
        if (running || !list.length) return;
        running = true;
        lastTime = 0;
        onStateChange?.(true);
        raf = requestAnimationFrame(tick);
      },
      stop() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
        onStateChange?.(false);
      },
      toggle() { running ? api.stop() : api.start(); },
      isRunning() { return running; },
      setRatio(r) { ratio = clamp(Number(r), min, max); apply(ratio); }
    };
    return api;
  }

  function syncVideos(videos, controlsRoot, opts = {}) {
    const playable = getPlayable(videos);
    if (!playable.length) return { play(){}, pause(){}, restart(){}, sync(){}, destroy(){}, videos: [] };
    const master = playable[0];
    let internal = false;
    let destroyed = false;
    let looping = false;
    const groupLoop = opts.loop !== false;
    if (groupLoop) playable.forEach(v => { try { v.loop = false; } catch (_) {} });

    const safePlay = (v) => {
      if (!v || destroyed) return;
      try { v.play().catch(() => {}); } catch (_) {}
    };
    const safePause = (v) => { try { v.pause(); } catch (_) {} };

    const restartGroupLoop = () => {
      if (destroyed || looping || !groupLoop) return;
      looping = true;
      playable.forEach(v => { try { v.pause(); } catch (_) {} });
      playable.forEach(v => { try { v.currentTime = 0; } catch (_) {} });
      setTimeout(() => {
        if (!destroyed) playable.forEach(safePlay);
        looping = false;
      }, 80);
    };

    const maybeLoopNearEnd = () => {
      if (!groupLoop || destroyed || looping) return;
      const dur = master.duration;
      if (!Number.isFinite(dur) || dur <= 0 || master.paused) return;
      if (dur - master.currentTime < 0.08) restartGroupLoop();
    };

    const syncToMaster = () => {
      if (internal || destroyed) return;
      internal = true;
      playable.slice(1).forEach(v => {
        if (Math.abs((v.currentTime || 0) - (master.currentTime || 0)) > 0.12) {
          try { v.currentTime = master.currentTime || 0; } catch (_) {}
        }
        try { v.playbackRate = master.playbackRate; } catch (_) {}
        if (!master.paused && v.paused) safePlay(v);
      });
      internal = false;
    };

    const onMasterTimeUpdate = () => { maybeLoopNearEnd(); syncToMaster(); };
    const onMasterSeeked = syncToMaster;
    const onMasterPlay = () => playable.forEach(v => { if (v !== master) safePlay(v); });
    const onMasterPause = () => playable.forEach(v => { if (v !== master) safePause(v); });
    const onPeerPlay = (e) => {
      if (destroyed || internal || e.target === master) return;
      // Non-master videos should never independently drive the group.
      if (master.paused) safePause(e.target);
      else syncToMaster();
    };
    const onPeerWaiting = () => {
      if (destroyed) return;
      // If any video stalls, pause the whole group briefly instead of letting peers drift.
      playable.forEach(safePause);
    };

    master.addEventListener("timeupdate", onMasterTimeUpdate);
    master.addEventListener("ended", restartGroupLoop);
    master.addEventListener("seeked", onMasterSeeked);
    master.addEventListener("play", onMasterPlay);
    master.addEventListener("pause", onMasterPause);
    playable.slice(1).forEach(v => {
      v.addEventListener("play", onPeerPlay);
      v.addEventListener("waiting", onPeerWaiting);
      v.addEventListener("stalled", onPeerWaiting);
    });

    const api = {
      videos: playable,
      play() {
        if (destroyed) return;
        syncToMaster();
        playable.forEach(safePlay);
      },
      pause() { playable.forEach(safePause); },
      restart(playAfter = true) {
        if (destroyed) return;
        playable.forEach(v => {
          try { v.pause(); } catch (_) {}
          try { v.currentTime = 0; } catch (_) {}
        });
        syncToMaster();
        if (playAfter) setTimeout(() => { if (!destroyed) playable.forEach(safePlay); }, 60);
      },
      sync: syncToMaster,
      destroy() {
        if (destroyed) return;
        destroyed = true;
        playable.forEach(safePause);
        master.removeEventListener("timeupdate", onMasterTimeUpdate);
        master.removeEventListener("ended", restartGroupLoop);
        master.removeEventListener("seeked", onMasterSeeked);
        master.removeEventListener("play", onMasterPlay);
        master.removeEventListener("pause", onMasterPause);
        playable.slice(1).forEach(v => {
          v.removeEventListener("play", onPeerPlay);
          v.removeEventListener("waiting", onPeerWaiting);
          v.removeEventListener("stalled", onPeerWaiting);
        });
      }
    };

    if (controlsRoot) {
      controlsRoot._syncApi = api;
      if (!controlsRoot.dataset.syncWired) {
        controlsRoot.dataset.syncWired = "1";
        controlsRoot.querySelector("[data-action='play']")?.addEventListener("click", () => controlsRoot._syncApi?.play?.());
        controlsRoot.querySelector("[data-action='pause']")?.addEventListener("click", () => controlsRoot._syncApi?.pause?.());
        controlsRoot.querySelector("[data-action='restart']")?.addEventListener("click", () => {
          controlsRoot._sliderAnimation?.stop?.();
          controlsRoot._resetVisuals?.();
          controlsRoot._syncApi?.restart?.(true);
        });
      }
    }

    if (opts.autoplay) setTimeout(api.play, 120);
    return api;
  }

  function observeLazy(root, callback, opts = {}) {
    let done = false;
    const run = () => {
      if (done && opts.once !== false) return;
      done = true;
      callback();
    };
    if (!("IntersectionObserver" in window)) {
      run();
      return { refresh: run };
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        run();
        if (opts.once !== false) io.unobserve(root);
      });
    }, { rootMargin: opts.rootMargin || "300px 0px" });
    io.observe(root);
    return { refresh: run, disconnect: () => io.disconnect() };
  }

  window.CityMesh3RSlider = {
    createComparisonSlider,
    makePlaceholder,
    loadMedia,
    unloadMedia,
    syncVideos,
    waitForVideoGroupReady,
    preloadVideoGroupFully,
    preloadImageGroup,
    createSliderAnimation,
    observeLazy,
    hasPath,
    escapeHtml,
    setRatio,
    setRatioMany
  };
})();
