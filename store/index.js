/* store-effects.js — tiny UX layer for the Store page */
(function(){
  const d = document;

  // Parallax hero (cheap + smooth)
  const hero = d.querySelector('.store-hero');
  const setParallax = () => {
    if (!hero) return;
    const y = Math.min(40, window.scrollY * 0.15);
    hero.style.setProperty('--parallax', `${y * -1}px`);
  };
  setParallax();
  window.addEventListener('scroll', setParallax, { passive: true });

  // Reveal on scroll
  const reveals = [...d.querySelectorAll('.reveal')];
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el=>io.observe(el));

  // Smooth anchor scroll + active chip
  const chips = d.querySelectorAll('[data-scroll]');
  chips.forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      chips.forEach(c=>c.classList.remove('active'));
      link.classList.add('active');
      const id = link.getAttribute('href');
      const target = d.querySelector(id);
      if(target){
        window.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
      }
    });
  });

  // Respect reduced motion
  const m = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (m.matches) {
    window.removeEventListener('scroll', setParallax);
    reveals.forEach(el=>el.classList.add('in'));
  }
})();
