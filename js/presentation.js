/* =========================================================
   WASLA — Presentation deck controller
   17 slides, keyboard nav, autoplay optional, fullscreen,
   bilingual EN ↔ AR live toggle.
   ========================================================= */
(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;
  const counter = document.querySelector('.deck-controls .counter');
  const progressBar = document.querySelector('.deck-progress .bar');
  const toc = document.querySelector('.slide-toc');
  let autoplay = false;
  let timer = null;
  let currentLang = (localStorage.getItem('wasla-deck-lang') || 'en');

  // Build TOC
  if (toc) {
    slides.forEach((s, i) => {
      const b = document.createElement('button');
      b.dataset.idx = i;
      b.dataset.title = s.dataset.title || ('Slide ' + (i + 1));
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => go(i));
      toc.appendChild(b);
    });
  }

  function go(i) {
    if (i < 0) i = 0;
    if (i >= total) i = total - 1;
    slides[current].classList.remove('active');
    slides[current].classList.add(i > current ? 'prev' : 'next-out');
    setTimeout(() => {
      slides.forEach((s, idx) => {
        s.classList.remove('active', 'prev', 'next-out');
        if (idx === i) s.classList.add('active');
        else if (idx < i) s.classList.add('prev');
        else s.classList.add('next-out');
      });
    }, 30);
    current = i;
    if (counter) counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    if (progressBar) progressBar.style.width = ((i + 1) / total * 100) + '%';
    if (toc) {
      Array.from(toc.querySelectorAll('button')).forEach((b, idx) => {
        b.classList.toggle('active', idx === i);
      });
    }
    const active = slides[i];
    active.querySelectorAll('.slide-inner > *').forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  // Initial state
  slides.forEach((s, i) => {
    s.classList.remove('active', 'prev', 'next-out');
    if (i === 0) s.classList.add('active');
    else if (i < 0) s.classList.add('prev');
    else s.classList.add('next-out');
  });
  if (counter) counter.textContent = '01 / ' + String(total).padStart(2, '0');
  if (progressBar) progressBar.style.width = (1 / total * 100) + '%';
  if (toc && toc.children[0]) toc.children[0].classList.add('active');

  // Bind controls
  document.querySelectorAll('[data-deck-next]').forEach((b) => b.addEventListener('click', next));
  document.querySelectorAll('[data-deck-prev]').forEach((b) => b.addEventListener('click', prev));
  document.querySelectorAll('[data-deck-play]').forEach((b) => {
    b.addEventListener('click', () => {
      autoplay = !autoplay;
      b.classList.toggle('active', autoplay);
      if (autoplay) startAuto();
      else stopAuto();
    });
  });
  document.querySelectorAll('[data-deck-actors]').forEach((b) => {
    b.addEventListener('click', () => go(6));
  });

  // ============ LANGUAGE TOGGLE ============
  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('wasla-deck-lang', lang);
    document.body.classList.toggle('lang-ar', lang === 'ar');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    // Update every element with data-en / data-ar
    document.querySelectorAll('[data-en], [data-ar]').forEach((el) => {
      const txt = el.getAttribute('data-' + lang);
      if (txt == null) return;
      if (txt.indexOf('<') !== -1) el.innerHTML = txt;       // contains HTML (e.g. <span class="hl">)
      else el.textContent = txt;
    });
    // Update lang label
    const lbl = document.querySelector('[data-deck-lang-label]');
    if (lbl) lbl.textContent = lang === 'ar' ? 'عربي' : 'EN';
    // Re-trigger animations on active slide
    const active = slides[current];
    active.querySelectorAll('.slide-inner > *').forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }
  document.querySelectorAll('[data-deck-lang]').forEach((b) => {
    b.addEventListener('click', () => setLang(currentLang === 'en' ? 'ar' : 'en'));
  });
  setLang(currentLang);
  // ============ END LANGUAGE TOGGLE ============

  function startAuto() { stopAuto(); timer = setInterval(() => { if (current === total - 1) go(0); else next(); }, 6000); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(total - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'l':
      case 'L':
        e.preventDefault();
        setLang(currentLang === 'en' ? 'ar' : 'en');
        break;
      case 'Escape':
        if (document.fullscreenElement) document.exitFullscreen();
        break;
    }
    if (e.key >= '1' && e.key <= '9') {
      const n = parseInt(e.key, 10) - 1;
      if (n < total) go(n);
    }
    if (e.key === '0') go(6);
  });

  function applyHash() {
    const h = (location.hash || '').replace('#', '').replace(/^slide[-_]?/i, '');
    const n = parseInt(h, 10);
    if (!isNaN(n) && n >= 1 && n <= total) go(n - 1);
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();

  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }
  const fsBtn = document.querySelector('.fs-btn');
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  slides.forEach((s) => {
    s.querySelectorAll('img').forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  });
})();
