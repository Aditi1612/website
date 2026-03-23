// ===== Mobile Navigation =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileNav.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Mobile submenus
document.querySelectorAll('.mobile-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const submenu = btn.nextElementSibling;
    submenu.classList.toggle('open');
    const arrow = btn.querySelector('.arrow');
    arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
  });
});

// ===== Sticky header opacity =====
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.style.background = 'rgba(14, 26, 26, 0.98)';
  } else {
    header.style.background = 'rgba(14, 26, 26, 0.92)';
  }
});

// ===== Scroll reveal (lightweight) =====
const revealElements = document.querySelectorAll(
  '.product-card, .service-card, .timeline-item, .about-strip-item, .why-text, .why-image'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(28px)', '');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  revealObserver.observe(el);
});
