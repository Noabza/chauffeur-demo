document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const translationCache = {};

  const applyTranslations = (messages) => {
    if (!messages) return;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (!key) return;
      const value = messages[key];
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });
  };

  const loadAndApplyLanguage = (lang) => {
    const normalized = lang === 'de' ? 'de' : 'en';
    if (translationCache[normalized]) {
      applyTranslations(translationCache[normalized]);
      return;
    }

    fetch(`i18n/${normalized}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${normalized}`);
        }
        return response.json();
      })
      .then((data) => {
        translationCache[normalized] = data;
        applyTranslations(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      navToggle.blur();
    };

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !expanded;
      navToggle.setAttribute('aria-expanded', String(nextState));
      navMenu.classList.toggle('open', nextState);
      if (!nextState) {
        navToggle.blur();
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    });
  }

  const langSwitch = document.querySelector('.lang-switch');
  if (langSwitch) {
    const readStoredLanguage = () => {
      try {
        return localStorage.getItem('site-language');
      } catch (error) {
        return null;
      }
    };

    const writeStoredLanguage = (lang) => {
      try {
        localStorage.setItem('site-language', lang);
      } catch (error) {
        /* ignore persistence issues */
      }
    };

    const getCurrent = () => langSwitch.dataset.lang === 'de' ? 'de' : 'en';

    const updateUi = () => {
      const current = getCurrent();
      const next = current === 'en' ? 'de' : 'en';
      langSwitch.textContent = next === 'en' ? 'EN' : 'GER';
      langSwitch.setAttribute('aria-label', next === 'en' ? 'Switch to English' : 'Switch to German');
      html.lang = current;
      loadAndApplyLanguage(current);
    };

    const storedLanguage = readStoredLanguage();
    if (storedLanguage === 'de' || storedLanguage === 'en') {
      langSwitch.dataset.lang = storedLanguage;
    } else {
      langSwitch.dataset.lang = html.lang === 'de' ? 'de' : 'en';
    }

    updateUi();

    langSwitch.addEventListener('click', () => {
      const current = getCurrent();
      const next = current === 'en' ? 'de' : 'en';
      langSwitch.dataset.lang = next;
      writeStoredLanguage(next);
      updateUi();
    });
  } else {
    loadAndApplyLanguage(html.lang === 'de' ? 'de' : 'en');
  }

  const brand = document.querySelector('.brand');
  if (brand) {
    brand.addEventListener('touchend', function () {
      const anchor = this;
      setTimeout(() => {
        anchor.blur();
      }, 300);
    });
  }

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const fab = document.querySelector('.fab');
  if (fab) {
    const fabToggle = fab.querySelector('.fab-toggle');
    const fabOptions = fab.querySelector('.fab-options');

    const setFabState = (open) => {
      fab.classList.toggle('open', open);
      if (fabToggle) {
        fabToggle.setAttribute('aria-expanded', String(open));
        fabToggle.setAttribute('aria-label', open ? 'Close chauffeur actions' : 'Open chauffeur actions');
      }
      if (fabOptions) {
        fabOptions.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
    };

    if (fabToggle) {
      fabToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const next = !fab.classList.contains('open');
        setFabState(next);
      });
    }

    fab.querySelectorAll('.fab-link').forEach((link) => {
      link.addEventListener('click', () => {
        setFabState(false);
      });
    });

    document.addEventListener('click', (event) => {
      if (!fab.contains(event.target)) {
        setFabState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setFabState(false);
        if (fabToggle) {
          fabToggle.focus();
        }
      }
    });

    setFabState(false);
  }
});
