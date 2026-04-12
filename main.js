const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
}

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const cta = document.querySelector('.nav-cta');
  if (!links) return;
  const open = links.style.display === 'flex';
  links.style.cssText = open
    ? ''
    : 'display:flex;flex-direction:column;position:fixed;top:62px;left:0;right:0;background:rgba(6,13,20,.97);backdrop-filter:blur(24px);padding:1.35rem 2rem;gap:1rem;box-shadow:0 8px 40px rgba(0,0,0,.5);z-index:199;border-bottom:1px solid rgba(255,255,255,.07)';
  if (cta) cta.style.display = open ? '' : 'none';
}
window.toggleMenu = toggleMenu;

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

if (document.querySelector('.hero-orb')) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 16;
    const y = (e.clientY / innerHeight - 0.5) * 16;
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
      orb.style.transform = `translate(${x * (i ? -0.65 : 1)}px,${y * (i ? -0.65 : 1)}px)`;
    });
  });
}
