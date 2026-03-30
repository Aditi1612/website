/* =========================================================
   CellaChrom – Dynamic JS
   ========================================================= */

// ── Desktop Dropdowns (hover on desktop, click on touch) ──
const closeTimers = new WeakMap();

document.querySelectorAll('.has-dropdown').forEach(li => {
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  // Hover — desktop only
  li.addEventListener('mouseenter', () => {
    if (isTouchDevice()) return;
    clearTimeout(closeTimers.get(li));
    document.querySelectorAll('.has-dropdown').forEach(d => {
      if (d !== li) d.classList.remove('open');
    });
    li.classList.add('open');
  });

  li.addEventListener('mouseleave', () => {
    if (isTouchDevice()) return;
    closeTimers.set(li, setTimeout(() => li.classList.remove('open'), 150));
  });

  // Click — touch devices / keyboard nav
  li.querySelector('a').addEventListener('click', e => {
    if (!isTouchDevice()) {
      // On desktop let the link navigate; dropdown already shown on hover
      return;
    }
    e.preventDefault();
    const isOpen = li.classList.contains('open');
    document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    if (!isOpen) li.classList.add('open');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
  }
});

// ── Mobile Navigation ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => (s.style.cssText = ''));
    }
  });
}

document.querySelectorAll('.mobile-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const sub = btn.nextElementSibling;
    const isOpen = sub.classList.toggle('open');
    btn.querySelector('.arrow').style.transform = isOpen ? 'rotate(180deg)' : '';
  });
});

// ── Sticky header (transparent → white on scroll) ──────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
}, { passive: true });

// ── Scroll Reveal ──────────────────────────────────────────
const revealTargets = document.querySelectorAll(
  '.reveal, .product-card, .service-card, .timeline-item, ' +
  '.about-strip-item, .why-text, .why-image, .support-card, ' +
  '.rental-step, .cert-card, .stat'
);

revealTargets.forEach((el, i) => {
  el.classList.add('will-reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach(el => revealObs.observe(el));

// ── Animated Number Counters ───────────────────────────────
function animateCount(el) {
  const raw = el.dataset.count || el.textContent.replace(/\D/g, '');
  const target = parseInt(raw, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1400;
  const start = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => counterObs.observe(el));

// ── Product Tabs (index.html) ──────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    btn.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) {
      panel.style.display = 'block';
      requestAnimationFrame(() => panel.classList.add('active'));
    }
  });
});

// init first tab
if (tabPanels.length) {
  tabPanels.forEach((p, i) => {
    p.style.display = i === 0 ? 'block' : 'none';
    if (i === 0) p.classList.add('active');
  });
}

// ── FAQ Accordion ──────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;

  // wrap in details/summary style
  a.style.maxHeight = '0';
  a.style.overflow = 'hidden';
  a.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
  a.style.opacity = '0';

  let open = false;

  q.style.cursor = 'pointer';
  q.style.userSelect = 'none';

  // add toggle indicator
  const arrow = document.createElement('span');
  arrow.className = 'faq-arrow';
  arrow.innerHTML = '&#43;';
  q.appendChild(arrow);

  q.addEventListener('click', () => {
    open = !open;
    if (open) {
      a.style.maxHeight = a.scrollHeight + 'px';
      a.style.opacity = '1';
      arrow.innerHTML = '&#8722;';
      item.classList.add('faq-open');
    } else {
      a.style.maxHeight = '0';
      a.style.opacity = '0';
      arrow.innerHTML = '&#43;';
      item.classList.remove('faq-open');
    }
  });
});

// ── Hero Background (soft scientific motion) ──────────────
const hero = document.querySelector('.hero');
const canvas = document.getElementById('hero-canvas');
if (hero && canvas) {
  document.body.classList.add('home-reference-theme');

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rand = (a, b) => Math.random() * (b - a) + a;

  let width = 0;
  let height = 0;
  let blobs = [];
  let rings = [];
  let dust = [];
  let rafId = 0;

  const setCanvasSize = () => {
    width = hero.offsetWidth;
    height = hero.offsetHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const buildScene = () => {
    const compact = width < 768;
    const area = width * height;
    const orbCount = compact ? 6 : 9;
    const ringCount = compact ? 5 : 8;
    const dustCount = Math.max(compact ? 22 : 40, Math.floor(area / 36000));

    blobs = Array.from({ length: orbCount }, (_, index) => {
      const largeOrb = index < 3;
      return {
        x: rand(width * 0.08, width * 0.92),
        y: rand(height * 0.06, height * 0.9),
        radius: rand(largeOrb ? 120 : 70, largeOrb ? 220 : 130),
        offsetX: rand(18, 42),
        offsetY: rand(14, 34),
        speed: rand(0.18, 0.48),
        phase: rand(0, Math.PI * 2),
        hue: index % 2 === 0 ? [84, 191, 230] : [255, 255, 255],
        alpha: largeOrb ? rand(0.18, 0.28) : rand(0.12, 0.2),
      };
    });

    rings = Array.from({ length: ringCount }, (_, index) => ({
      x: rand(width * 0.04, width * 0.96),
      y: rand(height * 0.08, height * 0.95),
      radius: rand(compact ? 44 : 56, compact ? 110 : 160),
      stretchX: rand(0.72, 1.22),
      stretchY: rand(0.72, 1.22),
      lineWidth: rand(0.9, 1.8),
      alpha: rand(0.08, 0.2),
      speed: rand(0.12, 0.28),
      phase: rand(0, Math.PI * 2),
      tint: index % 3 === 0 ? '84, 191, 230' : '255, 255, 255',
    }));

    dust = Array.from({ length: dustCount }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      radius: rand(1, 2.6),
      alpha: rand(0.18, 0.45),
      speedX: rand(-0.05, 0.05),
      speedY: rand(-0.04, 0.04),
    }));
  };

  const drawBlob = (blob, time) => {
    const x = blob.x + Math.cos(time * blob.speed + blob.phase) * blob.offsetX;
    const y = blob.y + Math.sin(time * (blob.speed * 0.9) + blob.phase) * blob.offsetY;
    const gradient = ctx.createRadialGradient(
      x - blob.radius * 0.32,
      y - blob.radius * 0.3,
      blob.radius * 0.12,
      x,
      y,
      blob.radius
    );

    gradient.addColorStop(0, `rgba(${blob.hue.join(',')}, ${blob.alpha})`);
    gradient.addColorStop(0.58, `rgba(${blob.hue.join(',')}, ${blob.alpha * 0.42})`);
    gradient.addColorStop(1, `rgba(${blob.hue.join(',')}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, blob.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRing = (ring, time) => {
    const x = ring.x + Math.sin(time * ring.speed + ring.phase) * 10;
    const y = ring.y + Math.cos(time * ring.speed + ring.phase) * 8;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * ring.speed + ring.phase) * 0.22);
    ctx.scale(ring.stretchX, ring.stretchY);
    ctx.strokeStyle = `rgba(${ring.tint}, ${ring.alpha})`;
    ctx.lineWidth = ring.lineWidth;
    ctx.setLineDash([ring.radius * 0.18, ring.radius * 0.11]);
    ctx.beginPath();
    ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawDust = () => {
    dust.forEach(point => {
      point.x += point.speedX;
      point.y += point.speedY;

      if (point.x < -8) point.x = width + 8;
      if (point.x > width + 8) point.x = -8;
      if (point.y < -8) point.y = height + 8;
      if (point.y > height + 8) point.y = -8;

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(104, 141, 166, ${point.alpha})`;
      ctx.fill();
    });
  };

  const paint = now => {
    const time = now * 0.00035;
    ctx.clearRect(0, 0, width, height);

    blobs.forEach(blob => drawBlob(blob, time));
    rings.forEach(ring => drawRing(ring, time));
    drawDust();

    if (!reducedMotion.matches) {
      rafId = requestAnimationFrame(paint);
    }
  };

  const renderScene = () => {
    cancelAnimationFrame(rafId);
    setCanvasSize();
    buildScene();

    if (reducedMotion.matches) {
      paint(0);
      return;
    }

    rafId = requestAnimationFrame(paint);
  };

  renderScene();
  window.addEventListener('resize', renderScene, { passive: true });
  reducedMotion.addEventListener('change', renderScene);
}

// ── Typing effect for hero subtitle ───────────────────────
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const phrases = [
    'Advanced Chiral HPLC Columns',
    'Polysaccharide-Based CSP Technology',
    'Exclusive Crown Acid Stationary Phases',
    'High-Performance Separation Science',
  ];
  let pi = 0, ci = 0, deleting = false;

  const type = () => {
    const current = phrases[pi];
    typingEl.textContent = deleting
      ? current.slice(0, ci--)
      : current.slice(0, ci++);

    if (!deleting && ci === current.length + 1) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
    setTimeout(type, deleting ? 40 : 75);
  };
  setTimeout(type, 600);
}

// ── Smooth active nav link ─────────────────────────────────
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
});

// ── Notification toast on contact form submit ──────────────
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! We\'ll be in touch within 1 business day.');
    contactForm.reset();
  });
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-show'));
  setTimeout(() => {
    t.classList.remove('toast-show');
    setTimeout(() => t.remove(), 400);
  }, 4000);
}
