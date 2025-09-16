// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  (function() {
    const root = document.documentElement;
    const btn = document.querySelector('.theme-switch') || document.querySelector('.theme-toggle');
    if (!btn) return;

    // Sync pressed state with current theme
    const sync = () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      const label = btn.querySelector('.theme-label');
      if (label) label.textContent = isDark ? 'Light' : 'Dark';
      btn.title = isDark ? 'Light Mode umschalten' : 'Dark Mode umschalten';
    };

    const setTheme = (theme) => {
      // Add transitioning class to synchronize all theme changes
      document.body.classList.add('theme-transitioning');
      
      root.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch (e) {}
      sync();
      
      // Remove transitioning class after transition completes
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    };

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
      // Clear focus to prevent lingering orange outline on touch devices
      btn.blur();
    });

    // Update on system change if user has not set preference
    try {
      const stored = localStorage.getItem('theme');
      if (!stored && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', (e) => setTheme(e.matches ? 'dark' : 'light'));
      }
    } catch (e) {}

    sync();
  })();
  
  // Year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const nowExpanded = !wasExpanded;
      toggle.setAttribute('aria-expanded', String(nowExpanded));
      menu.classList.toggle('open');
      // When closing via the X, blur to clear any sticky focus/hover on touch devices
      if (!nowExpanded) toggle.blur();
    });

    // Close mobile menu when a nav link is clicked
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      // Clear focus to avoid lingering active styles on mobile
      toggle.blur();
    };
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  // Fix for mobile: Brand link loses orange after tap
  const brand = document.querySelector('.brand');
  if (brand) {
    brand.addEventListener('touchend', function() {
      setTimeout(() => {
        this.blur();
      }, 300);
    });
  }

  // Typing animation for hero guarantee text
  const typedTextSpan = document.querySelector('.typed-text');
  const cursorSpan = document.querySelector('.cursor');
  const heroGuarantee = document.querySelector('.hero-guarantee');
  
  if (typedTextSpan && cursorSpan && heroGuarantee) {
    const textToType = 'Keine Abos. Keine Kostenfallen.';
    let isTyping = false;
    let typingTimeout = null;
    
    function startTyping() {
      if (isTyping) return; // Prevent multiple animations at once
      
      isTyping = true;
      let charIndex = 0;
      typedTextSpan.innerHTML = ''; // Clear existing text
      cursorSpan.classList.remove('hide'); // Show cursor again
      
      function type() {
        if (charIndex < textToType.length) {
          let nextChar = textToType.charAt(charIndex);
          
          // Check if it's a dot and wrap it in orange span
          if (nextChar === '.') {
            typedTextSpan.innerHTML += '<span class="orange-dot">.</span>';
          } else {
            typedTextSpan.innerHTML += nextChar;
          }
          
          charIndex++;
          typingTimeout = setTimeout(type, 80); // Typing speed (80ms per character)
        } else {
          // Hide cursor after typing is complete
          setTimeout(() => {
            cursorSpan.classList.add('hide');
            isTyping = false;
          }, 500);
        }
      }
      
      // Start typing after small delay
      setTimeout(type, 500);
    }
    
    // Create Intersection Observer to detect when element is in/out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is in view - start typing
          startTyping();
        } else {
          // Element is out of view - reset for next time
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          isTyping = false;
          typedTextSpan.innerHTML = '';
          cursorSpan.classList.remove('hide');
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of element is visible
    });
    
    // Start observing the hero guarantee element
    observer.observe(heroGuarantee);
  }

  // Header shadow on scroll
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
