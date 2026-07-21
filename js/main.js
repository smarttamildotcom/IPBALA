/**
 * BALAJI LOGANATHAN — IPBALA PERSONAL WEBSITE
 * main.js — Interactive behaviour
 */

'use strict';

/* ───────────────────────────────────────────────
   1. THEME MANAGEMENT (dark / light)
─────────────────────────────────────────────── */
(function initTheme() {
  const STORAGE_KEY = 'ipbala-theme';
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Keep in sync with OS preference changes (when no manual override exists)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (_) {}
    });
  });
}());


/* ───────────────────────────────────────────────
   2. DOM-READY MAIN
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ─── 2a. Footer year ─── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── 2b. Sticky nav (add shadow on scroll) ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', throttle(function () {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, 100), { passive: true });
  }

  /* ─── 2c. Mobile menu ─── */
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ─── 2d. Active nav link on scroll ─── */
  const sections  = Array.from(document.querySelectorAll('section[id], header[id]'));
  const navLinkEls = Array.from(document.querySelectorAll('.nav__link[data-section]'));

  if (sections.length && navLinkEls.length) {
    const NAV_H = parseInt(getComputedStyle(document.documentElement)
                  .getPropertyValue('--nav-h')) || 70;

    window.addEventListener('scroll', throttle(function () {
      let current = '';
      sections.forEach(function (sec) {
        if (window.scrollY + NAV_H + 80 >= sec.offsetTop) {
          current = sec.getAttribute('id');
        }
      });
      navLinkEls.forEach(function (link) {
        link.classList.toggle('active', link.dataset.section === current);
      });
    }, 100), { passive: true });
  }

  /* ─── 2e. Scroll-reveal with IntersectionObserver ─── */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ─── 2f. Back to top button ─── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', throttle(function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, 150), { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 2g. Contact form client-side validation ─── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const isValid = validateContactForm();
      if (!isValid) {
        e.preventDefault();
      }
    });

    // Live validation on blur
    ['contactName', 'contactEmail', 'contactMessage'].forEach(function (id) {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('blur', function () {
          validateField(field);
        });
        field.addEventListener('input', function () {
          if (field.classList.contains('has-error')) {
            validateField(field);
          }
        });
      }
    });
  }

  /* ─── 2h. Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const NAV_H = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}); // end DOMContentLoaded


/* ───────────────────────────────────────────────
   3. FORM VALIDATION HELPERS
─────────────────────────────────────────────── */
function validateContactForm() {
  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const message = document.getElementById('contactMessage');
  let valid = true;

  if (name    && !validateField(name))    valid = false;
  if (email   && !validateField(email))   valid = false;
  if (message && !validateField(message)) valid = false;

  return valid;
}

function validateField(field) {
  const errorEl = document.getElementById(field.id.replace('contact', '').toLowerCase() + 'Error')
                || document.getElementById(field.id + 'Error');
  let errorMsg = '';

  if (field.required && !field.value.trim()) {
    errorMsg = 'This field is required.';
  } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value.trim())) {
    errorMsg = 'Please enter a valid email address.';
  }

  if (errorEl) errorEl.textContent = errorMsg;
  field.classList.toggle('has-error', !!errorMsg);
  return !errorMsg;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


/* ───────────────────────────────────────────────
   4. UTILITIES
─────────────────────────────────────────────── */
function throttle(fn, delay) {
  let lastCall = 0;
  return function () {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, arguments);
    }
  };
}
