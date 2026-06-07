/* =========================================================
   WASLA — Documentation page controller
   Active sidebar link, back to top, etc.
   ========================================================= */
(function () {
  'use strict';

  // Active sidebar link on scroll
  const tocLinks = Array.from(document.querySelectorAll('.docs-sidebar a[href^="#"]'));
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            tocLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );
    sections.forEach((s) => tocObserver.observe(s));
  }

  // Back to top button
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Copy code
  document.querySelectorAll('.code-wrap').forEach((wrap) => {
    const btn = wrap.querySelector('.code-head .actions button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const code = wrap.querySelector('pre code') || wrap.querySelector('pre');
      if (!code) return;
      navigator.clipboard?.writeText(code.textContent.trim()).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-outlined" style="font-size:14px;">check</span> Copied';
        setTimeout(() => { btn.innerHTML = orig; }, 1600);
      }).catch(() => {});
    });
  });

  // Number headings
  document.querySelectorAll('.docs-content h2').forEach((h, i) => {
    if (!h.id) return;
    h.innerHTML = '<span style="color:var(--wasla-primary); font-weight:900; margin-right:10px;">' + String(i + 1).padStart(2, '0') + '</span>' + h.innerHTML;
  });
})();
