/* =========================================================
   WASLA — Pitch Deck Controller
   Bilingual EN/AR · keyboard · autoplay · fullscreen
   ========================================================= */

(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  if (total === 0) return;

  let idx = 0;
  let playing = false;
  let playTimer = null;
  const PLAY_MS = 6000;

  const $ = (id) => document.getElementById(id);
  const counter = $('rep-counter');
  const counterB = $('rep-counter-b');
  const prevBtn = $('rep-prev');
  const nextBtn = $('rep-next');
  const prevBtnB = $('rep-prev-b');
  const nextBtnB = $('rep-next-b');
  const playBtn = $('rep-play');
  const langBtn = $('rep-lang');
  const langBtnB = $('rep-lang-b');
  const fsBtn = $('rep-fs');
  const printBtn = $('rep-print');
  const actorsBtn = $('rep-actors');
  const toc = $('rep-toc');
  const controls = document.getElementById('rep-controls');
  const help = $('rep-help');
  const helpClose = $('rep-help-close');

  // ---------- TOC dots ----------
  if (toc) {
    slides.forEach((s, i) => {
      const dot = document.createElement('button');
      dot.className = 'toc-dot';
      dot.setAttribute('data-pn', s.dataset.pn || (i + 1));
      dot.setAttribute('data-title', s.dataset.title || ('Slide ' + (i + 1)));
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => go(i));
      toc.appendChild(dot);
    });
  }

  // ---------- Counter ----------
  function pad2(n) { return String(n).padStart(2, '0'); }

  function updateCounter() {
    const txt = pad2(idx + 1) + ' / ' + pad2(total);
    if (counter) counter.textContent = txt;
    if (counterB) counterB.textContent = txt;
    if (toc) {
      toc.querySelectorAll('.toc-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }
  }

  // ---------- Go to slide ----------
  function go(n, dir) {
    const target = Math.max(0, Math.min(total - 1, n));
    if (target === idx && dir === undefined) return;

    // Determine direction for animation
    let direction = dir;
    if (direction === undefined) direction = target > idx ? 'next' : 'prev';
    const outClass = direction === 'next' ? 'prev' : 'next';

    // Reset all classes
    slides.forEach((s) => s.classList.remove('active', 'prev', 'next-out'));
    // Outgoing
    if (slides[idx] && idx !== target) {
      slides[idx].classList.add(outClass);
      setTimeout(() => slides[idx] && slides[idx].classList.remove(outClass), 460);
    }
    // Incoming
    slides[target].classList.add('active');
    idx = target;
    updateCounter();
    setHash();
  }

  function next() { go(idx + 1, 'next'); }
  function prev() { go(idx - 1, 'prev'); }

  // ---------- Autoplay ----------
  function setPlaying(p) {
    playing = p;
    if (controls) controls.classList.toggle('playing', playing);
    if (playTimer) { clearTimeout(playTimer); playTimer = null; }
    if (playing) {
      playTimer = setTimeout(() => {
        if (idx === total - 1) go(0, 'next');
        else next();
        if (playing) setPlaying(true);
      }, PLAY_MS);
    }
  }
  function togglePlay() { setPlaying(!playing); }

  // ---------- Language toggle ----------
  function setLang(lang) {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-ar', lang === 'ar');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'EN' : 'عربي';
    if (langBtnB) langBtnB.textContent = lang === 'en' ? 'EN' : 'عربي';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
  function toggleLang() {
    setLang(document.body.classList.contains('lang-en') ? 'ar' : 'en');
  }

  // ---------- Fullscreen ----------
  function toggleFs() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen
        ? document.documentElement.requestFullscreen()
        : Promise.resolve()).catch(() => {});
    } else {
      (document.exitFullscreen ? document.exitFullscreen() : Promise.resolve());
    }
  }

  // ---------- Print / PDF ----------
  function doPrint() {
    setPlaying(false);
    setTimeout(() => window.print(), 200);
  }

  // ---------- Hash deep-link ----------
  function setHash() {
    const pn = slides[idx] && slides[idx].dataset.pn;
    if (pn) {
      const h = '#slide-' + pn;
      if (window.history && history.replaceState) history.replaceState(null, '', h);
    }
  }
  function readHash() {
    const m = (location.hash || '').match(/^#slide-(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10) - 1;
      if (n >= 0 && n < total) idx = n;
    }
  }

  // ---------- Help ----------
  function showHelp(show) {
    if (!help) return;
    if (show) help.removeAttribute('hidden');
    else help.setAttribute('hidden', '');
  }

  // ---------- Bind events ----------
  if (prevBtn) prevBtn.addEventListener('click', () => { setPlaying(false); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { setPlaying(false); next(); });
  if (prevBtnB) prevBtnB.addEventListener('click', () => { setPlaying(false); prev(); });
  if (nextBtnB) nextBtnB.addEventListener('click', () => { setPlaying(false); next(); });
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (langBtn) langBtn.addEventListener('click', toggleLang);
  if (langBtnB) langBtnB.addEventListener('click', toggleLang);
  if (fsBtn) fsBtn.addEventListener('click', toggleFs);
  if (printBtn) printBtn.addEventListener('click', doPrint);
  if (actorsBtn) actorsBtn.addEventListener('click', () => go(6, 'next'));
  if (helpClose) helpClose.addEventListener('click', () => showHelp(false));
  if (help) help.addEventListener('click', (e) => { if (e.target === help) showHelp(false); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight': setPlaying(false); next(); e.preventDefault(); break;
      case 'ArrowLeft':  setPlaying(false); prev(); e.preventDefault(); break;
      case ' ':          togglePlay(); e.preventDefault(); break;
      case 'Home':       go(0, 'prev'); e.preventDefault(); break;
      case 'End':        go(total - 1, 'next'); e.preventDefault(); break;
      case 'f': case 'F': toggleFs(); break;
      case 'l': case 'L': toggleLang(); break;
      case '?':          showHelp(help.hasAttribute('hidden')); break;
      case 'Escape':     showHelp(false); break;
      case '0':          go(9, 'next'); break;
      case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        const n = parseInt(e.key, 10) - 1;
        if (n < total) go(n, n > idx ? 'next' : 'prev');
        break;
    }
  });

  // Touch swipe
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    if (!e.touches[0]) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      setPlaying(false);
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // Image preload
  function preloadImages() {
    document.querySelectorAll('.slide img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) { const p = new Image(); p.src = src; }
    });
  }

  // Init
  readHash();
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  updateCounter();
  setHash();
  preloadImages();

  // =========================================================
  // INTERACTIVE FEATURES
  // =========================================================

  // ---------- Lightbox for phone screens ----------
  const lightbox = $('rep-lightbox');
  const lbImg = $('lb-img');
  const lbTitle = $('lb-title');
  const lbDesc = $('lb-desc');
  const lbCounter = $('lb-counter');
  const lbThumbs = $('lb-thumbs');
  const lbClose = $('lb-close');
  const lbPrev = $('lb-prev');
  const lbNext = $('lb-next');
  const screens = Array.from(document.querySelectorAll('.ph[data-screen]'));
  let lbIndex = -1;
  let isAr = false;

  function isLangAr() { return document.body.classList.contains('lang-ar'); }

  function buildThumbs() {
    if (!lbThumbs) return;
    lbThumbs.innerHTML = '';
    screens.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'lb-thumb';
      b.type = 'button';
      const img = document.createElement('img');
      img.src = s.querySelector('img').src;
      img.alt = s.dataset.screenName || '';
      b.appendChild(img);
      b.addEventListener('click', () => showLightbox(i));
      lbThumbs.appendChild(b);
    });
  }

  function showLightbox(n) {
    if (!lightbox || screens.length === 0) return;
    lbIndex = Math.max(0, Math.min(screens.length - 1, n));
    const s = screens[lbIndex];
    const img = s.querySelector('img');
    if (lbImg) { lbImg.src = img.src; lbImg.alt = img.alt || ''; }
    isAr = isLangAr();
    const name = s.dataset.screenName || '';
    const descEn = s.dataset.screenDescEn || '';
    const descAr = s.dataset.screenDescAr || '';
    if (lbTitle) {
      lbTitle.textContent = name;
      lbTitle.setAttribute('data-en', name);
      lbTitle.setAttribute('data-ar', name);
    }
    if (lbDesc) {
      lbDesc.innerHTML = isAr ? descAr : descEn;
      lbDesc.setAttribute('data-en-text', descEn);
      lbDesc.setAttribute('data-ar-text', descAr);
    }
    if (lbCounter) {
      lbCounter.textContent = (lbIndex + 1) + ' / ' + screens.length;
    }
    if (lbThumbs) {
      lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === lbIndex);
      });
    }
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lbIndex = -1;
  }

  function lbNextSlide() { if (lbIndex >= 0) showLightbox((lbIndex + 1) % screens.length); }
  function lbPrevSlide() { if (lbIndex >= 0) showLightbox((lbIndex - 1 + screens.length) % screens.length); }

  // Bind phone screen clicks
  screens.forEach((s, i) => {
    s.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(i);
    });
  });

  if (lbClose) lbClose.addEventListener('click', hideLightbox);
  if (lbPrev) lbPrev.addEventListener('click', lbPrevSlide);
  if (lbNext) lbNext.addEventListener('click', lbNextSlide);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });
  }
  buildThumbs();

  // ---------- Feature card click → jump to screen ----------
  const featCards = document.querySelectorAll('.feat-card[data-jump-slide]');
  featCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetSlide = parseInt(card.dataset.jumpSlide, 10) - 1;
      const targetScreen = card.dataset.jumpScreen;
      if (isNaN(targetSlide)) return;
      setPlaying(false);
      go(targetSlide, targetSlide > idx ? 'next' : 'prev');
      if (targetScreen) {
        setTimeout(() => highlightScreen(targetScreen), 480);
      }
    });
  });

  // ---------- Solution card click → jump to screen ----------
  const solCards = document.querySelectorAll('.sol-card[data-jump-slide]');
  solCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetSlide = parseInt(card.dataset.jumpSlide, 10) - 1;
      const targetScreen = card.dataset.jumpScreen;
      if (isNaN(targetSlide)) return;
      setPlaying(false);
      go(targetSlide, targetSlide > idx ? 'next' : 'prev');
      if (targetScreen) {
        setTimeout(() => highlightScreen(targetScreen), 480);
      }
    });
  });

  // ---------- Highlight a phone screen ----------
  function highlightScreen(name) {
    const ph = Array.from(document.querySelectorAll('.ph[data-screen]')).find(
      (p) => p.dataset.screen === name
    );
    if (!ph) return;
    ph.classList.remove('highlight');
    void ph.offsetWidth;
    ph.classList.add('highlight');
    ph.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => ph.classList.remove('highlight'), 2600);
  }

  // ---------- Update lightbox description on language change ----------
  const _origSetLang = setLang;
  // Extend setLang to also refresh lightbox if open
  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hasAttribute('hidden') && e.key === 'l') {
      // After toggle, refresh content
      setTimeout(() => {
        if (lbIndex >= 0) {
          const s = screens[lbIndex];
          isAr = isLangAr();
          const descEn = s.dataset.screenDescEn || '';
          const descAr = s.dataset.screenDescAr || '';
          if (lbDesc) lbDesc.innerHTML = isAr ? descAr : descEn;
        }
      }, 10);
    }
  });

  // Close lightbox on Escape (if open) or help
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hasAttribute('hidden')) hideLightbox();
      else if (help && !help.hasAttribute('hidden')) showHelp(false);
    }
  });
})();
