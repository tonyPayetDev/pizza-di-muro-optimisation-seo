/* =============================================
   Pizza Di Muro - Scripts principaux
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initLazyLoad();
  initScrollAnimations();
  initScrollTop();
  initNewsletter();
  initTrendingScroll();
  initSectionNav();
});

/* ---- Header sticky ---- */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && nav.classList.contains('open')) {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

const header = document.getElementById('header');

/* ---- Lazy Loading images ---- */
function initLazyLoad() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    images.forEach(img => observer.observe(img));
  } else {
    images.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  }
}

/* ---- Scroll animations (Intersection Observer) ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- Scroll to top button ---- */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Newsletter forms ---- */
function initNewsletter() {
  const forms = document.querySelectorAll('.nl-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value?.trim();

      if (!email || !isValidEmail(email)) {
        showToast('⚠️', 'Veuillez saisir une adresse email valide.');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      setTimeout(() => {
        input.value = '';
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('🎉', 'Merci ! Vous êtes inscrit(e) à notre newsletter.');
      }, 800);
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---- Toast notification ---- */
function showToast(icon, message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon"></span><p></p>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('.toast-icon').textContent = icon;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---- Trending scroll duplicate content ---- */
function initTrendingScroll() {
  const scroll = document.querySelector('.trending-scroll');
  if (!scroll) return;
  scroll.innerHTML += scroll.innerHTML;
}

/* ---- Section nav active state ---- */
function initSectionNav() {
  const navLinks = document.querySelectorAll('.section-nav a[data-section]');
  if (!navLinks.length) return;

  const sections = [];
  navLinks.forEach(link => {
    const section = document.getElementById(link.dataset.section);
    if (section) sections.push({ link, section });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = [...navLinks].find(l => l.dataset.section === entry.target.id);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(({ section }) => observer.observe(section));
}

/* ---- Smooth anchor scroll with header offset ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
