const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
}

const mobileMenuButton = document.querySelector('.hamburger');
const primaryNav = document.getElementById('primary-nav');

function closeMenu() {
  if (!mobileMenuButton || !primaryNav) return;
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('menu-open');
}

function openMenu() {
  if (!mobileMenuButton || !primaryNav) return;
  mobileMenuButton.setAttribute('aria-expanded', 'true');
  mobileMenuButton.setAttribute('aria-label', 'Close navigation menu');
  document.body.classList.add('menu-open');
}

function toggleMenu(forceOpen) {
  if (!mobileMenuButton || !primaryNav) return;
  const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !expanded;
  if (shouldOpen) openMenu();
  else closeMenu();
}
window.toggleMenu = toggleMenu;

if (mobileMenuButton && primaryNav) {
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const desktopQuery = window.matchMedia('(min-width: 769px)');
  const handleDesktopSwitch = (event) => {
    if (event.matches) closeMenu();
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', handleDesktopSwitch);
  } else {
    desktopQuery.addListener(handleDesktopSwitch);
  }
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.09, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroOrbs = document.querySelectorAll('.hero-orb');

if (heroOrbs.length) {
  const handleOrbMousemove = (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 16;
    const y = (e.clientY / innerHeight - 0.5) * 16;
    heroOrbs.forEach((orb, i) => {
      orb.style.transform = `translate(${x * (i ? -0.65 : 1)}px,${y * (i ? -0.65 : 1)}px)`;
    });
  };

  const toggleOrbMotion = () => {
    if (reducedMotionQuery.matches) {
      document.removeEventListener('mousemove', handleOrbMousemove);
      heroOrbs.forEach((orb) => {
        orb.style.transform = '';
      });
      return;
    }

    document.addEventListener('mousemove', handleOrbMousemove);
  };

  toggleOrbMotion();
  reducedMotionQuery.addEventListener('change', toggleOrbMotion);
}
