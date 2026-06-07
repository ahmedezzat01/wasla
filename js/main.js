/* =========================================================
   WASLA — Shared JavaScript
   Includes: nav scroll, scroll reveal, particle canvas,
   carousel, counters, magnetic buttons, hero parallax.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Nav scroll shadow ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        const target = parseFloat(el.dataset.target || '0');
        const duration = parseInt(el.dataset.duration || '2200', 10);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const start = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const v = target * easeOut(t);
          el.textContent = prefix + v.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target.toFixed(decimals) + suffix;
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('[data-target]').forEach((el) => counterObserver.observe(el));

  /* ---------- Particle canvas for hero ---------- */
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.colors = ['#502c96', '#56369c', '#420691', '#0C3571', '#dadbf1'];
      this.init();
    }
    init() {
      this.resize();
      const count = window.innerWidth < 720 ? 50 : 100;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.4 + 0.6,
          c: this.colors[Math.floor(Math.random() * this.colors.length)],
          a: Math.random() * 0.5 + 0.2,
        });
      }
      this.animate();
    }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.w = r.width;
      this.h = r.height;
      this.canvas.width = this.w * this.dpr;
      this.canvas.height = this.h * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
    }
    onMouse(e) {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    }
    onLeave() { this.mouse.x = -1000; this.mouse.y = -1000; }
    animate() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      // Trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(0, 0, this.w, this.h);

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;

        // Mouse repel
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x += (dx / (dist || 1)) * force * 1.6;
          p.y += (dy / (dist || 1)) * force * 1.6;
        }

        // Draw
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.c);
        grad.addColorStop(1, 'rgba(80, 44, 150, 0)');
        ctx.globalAlpha = p.a;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connections
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i], p2 = this.particles[j];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.globalAlpha = 0.18 * (1 - d / 130);
            ctx.strokeStyle = '#502c96';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.animate());
    }
  }

  /* ---------- Hero canvas init ---------- */
  const heroCanvas = document.querySelector('.hero-canvas');
  if (heroCanvas) {
    const sys = new ParticleSystem(heroCanvas);
    heroCanvas.addEventListener('mousemove', (e) => sys.onMouse(e));
    heroCanvas.addEventListener('mouseleave', () => sys.onLeave());
    window.addEventListener('resize', () => sys.resize());
  }

  /* ---------- Subtle hero parallax on mouse move ---------- */
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid && window.matchMedia('(pointer: fine)').matches) {
    const layers = heroGrid.querySelectorAll('[data-parallax]');
    let raf = null;
    heroGrid.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = heroGrid.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => {
          const s = parseFloat(l.dataset.parallax || '0.05');
          l.style.transform = `translate3d(${x * s * 30}px, ${y * s * 30}px, 0)`;
        });
        raf = null;
      });
    });
    heroGrid.addEventListener('mouseleave', () => {
      layers.forEach((l) => { l.style.transform = ''; });
    });
  }

  /* ---------- 3D Carousel (Screens Showcase) ---------- */
  class Carousel3D {
    constructor(root) {
      this.root = root;
      this.stage = root.querySelector('.carousel-stage');
      this.items = Array.from(root.querySelectorAll('.carousel-item'));
      this.dots = Array.from(root.querySelectorAll('.carousel-dots .dot'));
      this.idx = 0;
      this.timer = null;
      this.autoplay = root.dataset.autoplay === 'true';
      this.delay = parseInt(root.dataset.delay || '4500', 10);
      this.bind();
      this.render();
      if (this.autoplay) this.play();
    }
    bind() {
      this.root.querySelectorAll('[data-carousel-prev]').forEach((b) => b.addEventListener('click', () => this.prev()));
      this.root.querySelectorAll('[data-carousel-next]').forEach((b) => b.addEventListener('click', () => this.next()));
      this.dots.forEach((d, i) => d.addEventListener('click', () => this.go(i)));
      this.items.forEach((it, i) => it.addEventListener('click', () => this.go(i)));
      this.root.addEventListener('mouseenter', () => this.stop());
      this.root.addEventListener('mouseleave', () => { if (this.autoplay) this.play(); });
    }
    go(i) { this.idx = (i + this.items.length) % this.items.length; this.render(); }
    next() { this.go(this.idx + 1); }
    prev() { this.go(this.idx - 1); }
    play() { this.stop(); this.timer = setInterval(() => this.next(), this.delay); }
    stop() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
    render() {
      const n = this.items.length;
      this.items.forEach((it, i) => {
        it.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2', 'hidden-l', 'hidden-r');
        const d = i - this.idx;
        if (d === 0) it.classList.add('active');
        else if (d === -1) it.classList.add('prev-1');
        else if (d === 1)  it.classList.add('next-1');
        else if (d === -2) it.classList.add('prev-2');
        else if (d === 2)  it.classList.add('next-2');
        else if (d < 0)    it.classList.add('hidden-l');
        else               it.classList.add('hidden-r');
      });
      this.dots.forEach((d, i) => d.classList.toggle('active', i === this.idx));
    }
  }
  document.querySelectorAll('.carousel-3d').forEach((c) => new Carousel3D(c));

  /* ---------- Language switcher (visual only — keeps current page) ---------- */
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.lang-switch button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      const dir = b.dataset.dir;
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    });
  });

  /* ---------- Active nav link highlight ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === path || a.getAttribute('href') === './' + path) {
      a.classList.add('active');
    }
  });
})();
