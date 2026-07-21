(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('ipbala-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  const savedTheme = localStorage.getItem('ipbala-theme');
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

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      const compiledMessage = [
        'Subject: ' + (subject ? subject.value.trim() || 'Website Contact' : 'Website Contact'),
        '',
        'Name: ' + (name ? name.value.trim() : ''),
        'Email: ' + (email ? email.value.trim() : ''),
        '',
        'Message:',
        message ? message.value.trim() : ''
      ].join('\n');

      if (!formStatus) {
        return;
      }

      try {
        await navigator.clipboard.writeText(compiledMessage);
        formStatus.textContent = 'Message copied to clipboard.';
      } catch (error) {
        formStatus.textContent = 'Clipboard access was blocked. Copy the message manually from your browser.';
      }
    });
  }
})();
