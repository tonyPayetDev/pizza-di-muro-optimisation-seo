/* Pizza Di Muro - Main JavaScript */

(function () {
  'use strict';

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      const expanded = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  // ===== STICKY HEADER =====
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===== BACK TO TOP =====
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== LAZY LOADING IMAGES =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }

  // ===== RECIPES TABS =====
  const tabs = document.querySelectorAll('.recipes-tab');
  const tabContents = document.querySelectorAll('.recipes-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      tabContents.forEach(content => {
        content.style.display = content.dataset.content === target ? 'grid' : 'none';
      });
    });
  });

  // ===== NEWSLETTER FORM =====
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const card = form.closest('.newsletter-form-card') || form.parentElement;
      const formWrapper = card.querySelector('.newsletter-form-wrapper');
      const success = card.querySelector('.newsletter-success');

      if (formWrapper && success) {
        formWrapper.style.display = 'none';
        success.classList.add('show');
      } else {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Merci ! Vous etes inscrit(e)';
          btn.style.background = '#22c55e';
          btn.disabled = true;
        }
      }
    });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // ===== TICKER DUPLICATE (for infinite scroll) =====
  const ticker = document.querySelector('.breaking-ticker-inner');
  if (ticker) {
    const clone = ticker.cloneNode(true);
    ticker.parentElement.appendChild(clone);
  }

  // ===== SEARCH FORM =====
  document.querySelectorAll('.search-form input, .mobile-nav-search input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `https://pizza-dimuro.fr/?s=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });

  // ===== FADE-IN ANIMATION ON SCROLL =====
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

    document.querySelectorAll('.card, .food-card, .tip-item, .news-featured').forEach(el => {
      el.classList.add('fade-in-init');
      fadeObserver.observe(el);
    });
  }

})();
