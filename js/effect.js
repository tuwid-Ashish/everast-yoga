// /* effects.js — tiny UX layer for modern feel
//    - Parallax hero
//    - Reveal-on-scroll
//    - Chip filters + search
//    - Modal quick view
//    - Hover glow ring
// */
// (function () {
//   const d = document;

//   // ===== Parallax (cheap + smooth)
//   const hero = d.querySelector('.hero');
//   const setParallax = () => {
//     if (!hero) return;
//     const y = Math.min(40, window.scrollY * 0.15);
//     hero.style.setProperty('--parallax', `${y * -1}px`);
//   };
//   setParallax();
//   window.addEventListener('scroll', setParallax, { passive: true });

//   // ===== Reveal on Scroll
//   const reveals = [...d.querySelectorAll('.reveal')];
//   const io = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('in');
//         io.unobserve(entry.target);
//       }
//     });
//   }, { threshold: 0.12 });
//   reveals.forEach((el) => io.observe(el));

//   // ===== Filters
//   const chips = [...d.querySelectorAll('.chip')];
//   const cards = [...d.querySelectorAll('.teacher')];
//   let currentFilter = 'all';

//   function applyFilter() {
//     const q = (d.getElementById('search')?.value || '').trim().toLowerCase();
//     cards.forEach((card) => {
//       const role = (card.dataset.role || '').toLowerCase();
//       const name = (card.dataset.name || '').toLowerCase();
//       const title = (card.dataset.title || '').toLowerCase();
//       const byRole = currentFilter === 'all' || role.includes(currentFilter.toLowerCase());
//       const byText = !q || name.includes(q) || title.includes(q) || role.includes(q);
//       card.parentElement.style.display = (byRole && byText) ? '' : 'none';
//     });
//   }

//   chips.forEach((chip) => {
//     chip.addEventListener('click', () => {
//       chips.forEach(c => c.classList.remove('active'));
//       chip.classList.add('active');
//       currentFilter = chip.dataset.filter || 'all';
//       applyFilter();
//     });
//   });

//   d.getElementById('search')?.addEventListener('input', applyFilter);

//   // ===== Modal Fill
//   d.querySelectorAll('[data-modal="profile"]').forEach((btn) => {
//     btn.addEventListener('click', () => {
//       const card = btn.closest('.teacher');
//       if (!card) return;
//       d.getElementById('profileName').textContent = card.dataset.name || card.querySelector('h5')?.textContent || 'Teacher';
//       d.getElementById('profileTitle').textContent = card.dataset.title || card.querySelector('.meta')?.textContent || '';
//       d.getElementById('profileBio').textContent = card.querySelector('.bio')?.textContent || '';
//       $('#profileModal').modal('show');
//     });
//   });

//   // ===== Hover ring (focus feel)
//   d.querySelectorAll('.teacher').forEach((card) => {
//     card.addEventListener('mousemove', (e) => {
//       const rect = card.getBoundingClientRect();
//       card.style.boxShadow = `0 18px 36px rgba(10,44,79,.16), 0 0 0 6px rgba(42,157,143,.18)`;
//       card.style.transform = 'translateY(-6px)';
//     });
//     card.addEventListener('mouseleave', () => {
//       card.style.boxShadow = '';
//       card.style.transform = '';
//     });
//   });

//   // Respect reduced motion
//   const media = window.matchMedia('(prefers-reduced-motion: reduce)');
//   if (media.matches) {
//     window.removeEventListener('scroll', setParallax);
//     reveals.forEach(el => el.classList.add('in'));
//   }
// })();


//   document.addEventListener('DOMContentLoaded', function () {
//   // Flip second-level submenu if it would overflow viewport to the right
//   function setSubmenuDirection(){
//     document.querySelectorAll('.dropdown-submenu').forEach(function (sub) {
//       sub.classList.remove('open-left');
//       var menu = sub.querySelector(':scope > .dropdown-menu');
//       if(!menu) return;

//       // temporarily show to measure (desktop hover case)
//       var wasHidden = getComputedStyle(menu).display === 'none';
//       if (wasHidden) { menu.style.visibility='hidden'; menu.style.display='block'; }

//       var rect = menu.getBoundingClientRect();
//       if (rect.right > window.innerWidth - 8) {
//         sub.classList.add('open-left');
//       }

//       if (wasHidden) { menu.style.display=''; menu.style.visibility=''; }
//     });
//   }

//   // Run on open events (Bootstrap)
//   $('.navbar-evy .dropdown').on('shown.bs.dropdown', setSubmenuDirection);
//   // Also run on resize for safety
//   window.addEventListener('resize', setSubmenuDirection);
//   });

//     // Add subtle shadow to navbar on scroll
//   (function () {
//     const nav = document.querySelector('.navbar-evy');
//     function onScroll() {
//       if (!nav) return;
//       if (window.scrollY > 6) nav.classList.add('nav-shadow');
//       else nav.classList.remove('nav-shadow');
//     }
//     onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
//   })();

//   // Mark active nav item by URL (basic)
//   (function () {
//     var path = location.pathname.replace(/\/$/, '');
//     document.querySelectorAll('.navbar-evy .nav-link, .dropdown-item').forEach(function (a) {
//       var href = a.getAttribute('href') || '';
//       if (!href || href === '#') return;
//       var target = href.replace(/\/$/, '');
//       if (target && path.endsWith(target)) {
//         a.classList.add('active'); a.style.color = 'var(--leaf)';
//         var li = a.closest('.nav-item.dropdown'); if (li) { li.querySelector('.nav-link').classList.add('active'); }
//       }
//     });
//   })();


//   // Count-up stats
//     (function () {
//       const counters = [...document.querySelectorAll('[data-count]')];
//       const io = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const el = entry.target, end = +el.getAttribute('data-count');
//             let cur = 0, step = Math.max(1, Math.floor(end / 60));
//             const t = setInterval(() => { cur += step; if (cur >= end) { cur = end; clearInterval(t); } el.textContent = cur.toLocaleString('en-IN'); }, 16);
//             io.unobserve(el);
//           }
//         });
//       }, { threshold: 0.6 });
//       counters.forEach(c => io.observe(c));
//     })();

/* effects.js — page-specific UX
   - Parallax hero (rAF throttled)
   - Reveal-on-scroll (early trigger)
   - Chip filters + search
   - Modal quick view (instant, pre-stored)
   - Lightweight hover (no mousemove spam)
*/
(function () {
  const d = document;

  // ===== Parallax (cheap + smooth, rAF throttled)
  const hero = d.querySelector('.hero');
  let parallaxTicking = false;
  function setParallax() {
    if (!hero) return;
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        const y = Math.min(40, window.scrollY * 0.15);
        hero.style.setProperty('--parallax', `${y * -1}px`);
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }
  setParallax();
  window.addEventListener('scroll', setParallax, { passive: true });

  // ===== Reveal on Scroll (snappier w/ rootMargin)
  const reveals = Array.from(d.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
  reveals.forEach((el) => io.observe(el));

  // ===== Build full bios + truncate in cards
  const teacherData = {};
  function truncateText(text, wordLimit = 15) {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  d.addEventListener('DOMContentLoaded', () => {
    d.querySelectorAll('.teacher').forEach(card => {
      const bioEl = card.querySelector('.bio');
      const fullBio = (bioEl?.textContent || '').trim();
      const name = card.dataset.name || '';
      const title = card.dataset.title || '';
      const imgSrc = card.querySelector('.cover img')?.getAttribute('src') || '';

      teacherData[name] = { title, bio: fullBio, image: imgSrc };
      // display truncated in grid
      if (bioEl) bioEl.textContent = truncateText(fullBio, 24);
    });
  });

  // ===== Filters (chips) + search
  const chips = Array.from(d.querySelectorAll('.chip'));
  const cards = Array.from(d.querySelectorAll('.teacher'));
  let currentFilter = 'all';

  function applyFilter() {
    const q = (d.getElementById('search')?.value || '').trim().toLowerCase();
    cards.forEach((card) => {
      const role = (card.dataset.role || '').toLowerCase();
      const name = (card.dataset.name || '').toLowerCase();
      const title = (card.dataset.title || '').toLowerCase();
      const byRole = currentFilter === 'all' || role === currentFilter; // strict match for consistency
      const byText = !q || name.includes(q) || title.includes(q) || role.includes(q);
      card.parentElement.style.display = (byRole && byText) ? '' : 'none';
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = (chip.dataset.filter || 'all').toLowerCase();
      applyFilter();
    });
  });
  d.getElementById('search')?.addEventListener('input', applyFilter);

  // ===== Modal quick view (instant from teacherData)
  d.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal="profile"]');
    if (!btn) return;
    const card = btn.closest('.teacher');
    const name = card?.dataset.name || '';
    const data = teacherData[name];
    if (!data) return;

    d.getElementById('profileName').textContent = name;
    d.getElementById('profileTitle').textContent = data.title;
    d.getElementById('profileBio').textContent = data.bio;
    const imgEl = d.querySelector('#profileModal .profile-img');
    if (imgEl) imgEl.src = data.image;

    $('#profileModal').modal('show');
  });

  // ===== Hover elevation (enter/leave only)
  d.querySelectorAll('.teacher').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 18px 36px rgba(10,44,79,.16), 0 0 0 6px rgba(42,157,143,.18)`;
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  });

  // ===== Respect reduced motion
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) {
    window.removeEventListener('scroll', setParallax);
    reveals.forEach(el => el.classList.add('in'));
  }
})();


document.addEventListener('DOMContentLoaded', function() {
  // Handle dropdown submenu clicks on mobile
  const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');
  
  dropdownSubmenus.forEach(function(submenu) {
    const submenuToggle = submenu.querySelector('.dropdown-toggle');
    const submenuDropdown = submenu.querySelector('.dropdown-menu');
    
    submenuToggle.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle the submenu
        if (submenuDropdown.style.display === 'block') {
          submenuDropdown.style.display = 'none';
        } else {
          // Hide all other submenus
          document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(function(menu) {
            menu.style.display = 'none';
          });
          submenuDropdown.style.display = 'block';
        }
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 992) {
      const navbar = document.querySelector('.navbar-collapse');
      const isClickInsideNav = navbar.contains(e.target);
      const isNavbarToggler = e.target.closest('.navbar-toggler');
      
      if (!isClickInsideNav && !isNavbarToggler && navbar.classList.contains('show')) {
        $('.navbar-collapse').collapse('hide');
      }
    }
  });
});