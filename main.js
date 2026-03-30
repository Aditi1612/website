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

// ── Hero Particles ─────────────────────────────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const rand = (a, b) => Math.random() * (b - a) + a;

  const initParticles = () => {
    const count = Math.floor(canvas.width / 14);
    particles = Array.from({ length: count }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(1, 2.5),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      a: rand(0.1, 0.5),
    }));
  };
  initParticles();

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(41,199,197,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(41,199,197,${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();
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
