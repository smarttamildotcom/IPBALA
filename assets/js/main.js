(function () {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = reduceMotionQuery.matches;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const articleCards = document.querySelectorAll('[data-article-grid] .article-card');
  const articleEmptyState = document.querySelector('[data-article-empty]');
  const navLinks = document.querySelectorAll('[data-nav-menu] a[href]');
  const pageName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const queryParams = new URLSearchParams(window.location.search || '');
  const debugMobile = queryParams.get('debugMobile') === '1';
  const isExperiencePage = pageName.indexOf('experience') !== -1;

  function installMobileDebugProbe() {
    if (!debugMobile || !isExperiencePage) {
      return;
    }

    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobileViewport) {
      console.info('[IPBALA mobile-debug] Skipped: viewport is wider than 767px.');
      return;
    }

    function reportLayoutState() {
      const doc = document.documentElement;
      const bodyEl = document.body;
      const container = document.querySelector('main .container');
      const timeline = document.querySelector('.timeline');
      const firstCard = document.querySelector('.timeline .timeline-item');

      const summary = {
        viewportWidth: window.innerWidth,
        documentClientWidth: doc ? doc.clientWidth : null,
        bodyScrollWidth: bodyEl ? bodyEl.scrollWidth : null,
        hasHorizontalOverflow: bodyEl ? bodyEl.scrollWidth > doc.clientWidth : null,
        bodyClasses: bodyEl ? bodyEl.className : '',
        containerWidth: container ? Math.round(container.getBoundingClientRect().width) : null,
        timelineWidth: timeline ? Math.round(timeline.getBoundingClientRect().width) : null,
        timelineVisible: timeline ? window.getComputedStyle(timeline).display !== 'none' : false,
        timelineOpacity: timeline ? window.getComputedStyle(timeline).opacity : null,
        timelineTransform: timeline ? window.getComputedStyle(timeline).transform : null,
        firstCardVisible: firstCard ? window.getComputedStyle(firstCard).display !== 'none' : false,
        firstCardOpacity: firstCard ? window.getComputedStyle(firstCard).opacity : null,
        firstCardTransform: firstCard ? window.getComputedStyle(firstCard).transform : null
      };

      console.info('[IPBALA mobile-debug] Layout summary', summary);
    }

    window.addEventListener('error', function (event) {
      const err = event.error;
      console.error('[IPBALA mobile-debug] Runtime error', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: err && err.stack ? err.stack : null
      });
    });

    window.addEventListener('unhandledrejection', function (event) {
      console.error('[IPBALA mobile-debug] Unhandled rejection', {
        reason: event.reason
      });
    });

    window.addEventListener('load', function () {
      reportLayoutState();
      window.setTimeout(reportLayoutState, 250);
      window.setTimeout(reportLayoutState, 1000);
    });

    window.addEventListener('resize', function () {
      reportLayoutState();
    });
  }

  installMobileDebugProbe();

  if (body) {
    body.classList.add('is-page-entering');
    if (pageName.indexOf('index') !== -1) {
      body.classList.add('page-home');
    }
    if (pageName.indexOf('about') !== -1) {
      body.classList.add('page-about');
    }
    if (pageName.indexOf('experience') !== -1) {
      body.classList.add('page-experience');
    }
    if (pageName.indexOf('events') !== -1) {
      body.classList.add('page-events');
    }
    if (pageName.indexOf('articles') !== -1) {
      body.classList.add('page-articles');
    }
    if (pageName.indexOf('resources') !== -1) {
      body.classList.add('page-resources');
    }
    if (pageName.indexOf('contact') !== -1) {
      body.classList.add('page-contact');
    }
  }

  function initializeLoader() {
    if (!body) {
      return;
    }

    const loader = document.createElement('div');
    loader.className = 'site-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = '<div class="site-loader-logo">IPBALA</div>';
    body.appendChild(loader);

    if (prefersReducedMotion) {
      body.classList.remove('is-page-entering');
      return;
    }

    const start = performance.now();
    requestAnimationFrame(function () {
      loader.classList.add('is-active');
      body.classList.remove('is-page-entering');
    });

    let hidden = false;

    function hideLoader() {
      if (hidden) {
        return;
      }
      hidden = true;
      const elapsed = performance.now() - start;
      const visibleFor = 320;
      const wait = Math.max(0, visibleFor - elapsed);
      window.setTimeout(function () {
        loader.classList.add('is-leaving');
        loader.classList.remove('is-active');
        window.setTimeout(function () {
          loader.remove();
        }, 240);
      }, wait);
    }

    if (document.readyState === 'complete') {
      hideLoader();
      return;
    }

    window.setTimeout(hideLoader, 700);

    window.addEventListener('load', function () {
      hideLoader();
    });
  }

  initializeLoader();

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures so page scripts continue to run.
    }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    safeStorageSet('ipbala-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  const savedTheme = safeStorageGet('ipbala-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(function (card, index) {
    if (!card.classList.contains('reveal')) {
      card.classList.add('reveal');
    }
    const delayStep = (index % 6) + 1;
    card.setAttribute('data-reveal-delay', String(Math.min(delayStep, 3)));
  });

  const timelineMilestones = document.querySelectorAll('.timeline .timeline-item');
  timelineMilestones.forEach(function (item, index) {
    if (!item.classList.contains('reveal')) {
      item.classList.add('reveal');
    }
    item.setAttribute('data-reveal-delay', String((index % 3) + 1));
  });

  const counters = document.querySelectorAll('[data-counter]');
  const quotes = document.querySelectorAll('.quote-block');

  quotes.forEach(function (quote) {
    if (!quote.classList.contains('reveal')) {
      quote.classList.add('reveal');
    }
  });

  function animateCounter(element) {
    if (prefersReducedMotion) {
      element.textContent = element.getAttribute('data-counter') || '0';
      return;
    }

    const targetValue = Number(element.getAttribute('data-counter') || '0');
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(targetValue * eased);
      element.textContent = String(currentValue) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            if (entry.target.hasAttribute('data-counter-group')) {
              const stats = entry.target.querySelectorAll('[data-counter]');
              stats.forEach(function (counter) {
                animateCounter(counter);
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });

    counters.forEach(function (counter) {
      const container = counter.closest('[data-counter-group]');
      if (container) {
        observer.observe(container);
      }
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });

    counters.forEach(function (counter) {
      animateCounter(counter);
    });
  }

  const footer = document.querySelector('.footer');
  if (footer) {
    footer.classList.add('footer-reveal');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const footerObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      footerObserver.observe(footer);
    } else {
      footer.classList.add('is-visible');
    }
  }

  if (filterButtons.length && articleCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const selectedFilter = button.getAttribute('data-filter') || 'all';
        let visibleCount = 0;

        filterButtons.forEach(function (chip) {
          chip.classList.toggle('active', chip === button);
        });

        articleCards.forEach(function (card) {
          const categories = (card.getAttribute('data-category') || '').toLowerCase();
          const isMatch = selectedFilter === 'all' || categories.indexOf(selectedFilter) !== -1;
          card.classList.toggle('is-hidden', !isMatch);
          if (isMatch) {
            visibleCount += 1;
          }
        });

        if (articleEmptyState) {
          articleEmptyState.hidden = visibleCount !== 0;
        }
      });
    });
  }

  function samePageHashLink(link) {
    const href = link.getAttribute('href') || '';
    return href.indexOf('#') === 0;
  }

  function setActiveNavByPath() {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const normalized = href.split('#')[0] || 'index.html';
      const isActive = normalized === pageName;
      link.classList.toggle('active', isActive);
    });
  }

  function smoothScrollToHash(hash) {
    const target = document.querySelector(hash);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  setActiveNavByPath();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const href = link.getAttribute('href') || '';

      if (samePageHashLink(link)) {
        event.preventDefault();
        smoothScrollToHash(href);
        return;
      }

      if (prefersReducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (link.target && link.target !== '_self') {
        return;
      }

      const resolved = new URL(href, window.location.href);
      const isInternal = resolved.origin === window.location.origin;
      const isSamePage = resolved.pathname === window.location.pathname;

      if (!isInternal || isSamePage) {
        return;
      }

      event.preventDefault();
      if (body) {
        body.classList.add('is-page-exiting');
      }

      window.setTimeout(function () {
        window.location.href = resolved.href;
      }, 220);
    });
  });

  const allInternalLinks = document.querySelectorAll('a[href]');
  allInternalLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (prefersReducedMotion || event.defaultPrevented) {
        return;
      }

      const href = link.getAttribute('href') || '';
      if (!href || href.indexOf('#') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (link.target && link.target !== '_self') {
        return;
      }

      const resolved = new URL(href, window.location.href);
      const isInternal = resolved.origin === window.location.origin;
      const isSamePage = resolved.pathname === window.location.pathname;

      if (!isInternal || isSamePage) {
        return;
      }

      event.preventDefault();
      if (body) {
        body.classList.add('is-page-exiting');
      }

      window.setTimeout(function () {
        window.location.href = resolved.href;
      }, 220);
    });
  });

  const sectionTargets = document.querySelectorAll('section[id]');
  const hashLinks = document.querySelectorAll('[data-nav-menu] a[href^="#"]');
  if (hashLinks.length && sectionTargets.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            hashLinks.forEach(function (link) {
              link.classList.toggle('active', (link.getAttribute('href') || '') === id);
            });
          }
        });
      },
      { threshold: 0.45 }
    );

    sectionTargets.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
