const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
}

const mobileMenuButton = document.querySelector('.hamburger');
const primaryNav = document.getElementById('primary-nav') || document.querySelector('.nav-links');

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

function setRepresentativeBackground(selector, image, strength) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.add('bg-photo-section', strength);
  el.style.setProperty('--section-bg-image', `url('${image}')`);
}

function proofFigure({ src, alt, width, height, caption, extraClass = '' }) {
  const figure = document.createElement('figure');
  figure.className = `proof-image ${extraClass}`.trim();

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.width = width;
  img.height = height;
  img.loading = 'lazy';
  img.decoding = 'async';

  const figcaption = document.createElement('figcaption');
  figcaption.className = 'proof-caption';
  figcaption.textContent = caption;

  figure.append(img, figcaption);
  return figure;
}

function replaceCaseVisuals(title, visuals) {
  const cases = [...document.querySelectorAll('.case-study')];
  const target = cases.find((item) => item.textContent.includes(title));
  const visualWrap = target?.querySelector('.cs-visuals');
  if (!visualWrap || visualWrap.dataset.representativeVisuals === 'true') return;
  visualWrap.dataset.representativeVisuals = 'true';
  visualWrap.classList.add('cs-visuals-balanced');
  visualWrap.replaceChildren(
    ...visuals.map((visual) => proofFigure({ ...visual, extraClass: 'cs-visual-slot' }))
  );
}

function appendRoleProof(name, visual) {
  const cards = [...document.querySelectorAll('.tm-card')];
  const target = cards.find((card) => card.textContent.includes(name));
  const body = target?.querySelector('.tm-card-body');
  if (!body || body.querySelector('.role-proof')) return;
  body.appendChild(proofFigure({ ...visual, extraClass: 'role-proof' }));
}

function enhanceRepresentativeVisuals() {
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith('/services.html')) {
    setRepresentativeBackground('.page-hero', '/Images/bg_services_circuit.webp', 'bg-photo-soft');
  }

  if (path.endsWith('/about.html')) {
    setRepresentativeBackground('section.section', '/Images/bg_about_engineering.webp', 'bg-photo-soft');
  }

  if (path.endsWith('/contact.html')) {
    setRepresentativeBackground('#cta', '/Images/bg_contact_deployment.webp', 'bg-photo-strong');
  }

  if (path.endsWith('/work.html')) {
    replaceCaseVisuals('Air Quality Intelligence Network', [
      {
        src: '/Images/case_air_quality_monitor.webp',
        alt: 'Air quality monitoring device showing pollutant readings',
        width: 680,
        height: 454,
        caption: 'Representative sensor and monitoring context',
      },
      {
        src: '/Images/case_air_quality_secondary.webp',
        alt: 'Air quality monitor displaying indoor environmental readings',
        width: 640,
        height: 427,
        caption: 'Representative sensor and monitoring context',
      },
    ]);

    replaceCaseVisuals('Equipment Health Monitoring System', [
      {
        src: '/Images/case_equipment_monitoring.webp',
        alt: 'Industrial machinery with gauges and filters representing equipment monitoring',
        width: 680,
        height: 453,
        caption: 'Representative industrial monitoring environment',
      },
    ]);

    replaceCaseVisuals('Cold Chain Integrity Tracker', [
      {
        src: '/Images/case_cold_chain_trucks.webp',
        alt: 'Refrigerated trucks representing cold-chain logistics',
        width: 680,
        height: 453,
        caption: 'Representative logistics environment',
      },
      {
        src: '/Images/case_cold_chain_warehouse.webp',
        alt: 'Truck at warehouse loading area representing logistics operations',
        width: 500,
        height: 750,
        caption: 'Representative logistics environment',
      },
    ]);
  }

  if (path.endsWith('/team.html')) {
    appendRoleProof('Abiola Opeyemi', {
      src: '/Images/role_solar_energy.webp',
      alt: 'Person working on a solar panel representing energy systems engineering',
      width: 440,
      height: 293,
      caption: 'Representative deployment environment',
    });

    appendRoleProof('Ibrahim AbdulHakeem', {
      src: '/Images/role_hvac_building_systems.webp',
      alt: 'Air conditioning units mounted on a building representing HVAC systems',
      width: 440,
      height: 293,
      caption: 'Representative deployment environment',
    });
  }
}

enhanceRepresentativeVisuals();
