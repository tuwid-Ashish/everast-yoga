// Home page interactions
(function(){
  'use strict';

  // Reveal on scroll
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal], .reveal'));
  function onScrollReveal(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < vh - 80) el.classList.add('in');
    });
  }
  onScrollReveal();
  window.addEventListener('scroll', onScrollReveal, {passive:true});

  // Ensure Bootstrap carousel works if present (no-op if not)
  try{
    // nothing needed; carousel is data-API driven. Keep hook for future
  }catch(e){console.warn(e)}

})();
// Page-specific JS for Home
// Truncate long intros, tune reveal behavior, and wire program CTAs

document.addEventListener('DOMContentLoaded', function() {
  // Faster reveal on load
  function fastReveal() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el, i) {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        setTimeout(function() { el.classList.add('in'); }, i * 40);
      }
    });
  }

  fastReveal();
  window.addEventListener('scroll', function() { window.requestAnimationFrame(fastReveal); }, { passive:true });

  // Initialize CSS variable for parallax factor from data attribute on section-hero
  document.querySelectorAll('.section-hero[data-parallax]').forEach(function(sec){
    var val = parseFloat(sec.getAttribute('data-parallax')) || 0.35;
    sec.style.setProperty('--parallax-factor', val);
  });

  // Smooth scroll for primary CTAs
  document.querySelectorAll('[data-scroll-to]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('data-scroll-to'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Testimonials: lightweight auto-advance with controls
  (function(){
    var cards = Array.prototype.slice.call(document.querySelectorAll('.testimonial-card'));
    if (!cards.length) return;
    var current = 0;
    var interval = 6000; // ms
    var timer = null;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(idx){
      cards.forEach(function(c){ c.classList.remove('active'); });
      var card = cards[idx]; if (card) card.classList.add('active');
      current = idx;
    }

    function next(){ show((current+1) % cards.length); }
    function prev(){ show((current-1+cards.length) % cards.length); }

    // Init
    show(0);

    // Controls
    var btnNext = document.getElementById('testi-next');
    var btnPrev = document.getElementById('testi-prev');
    if (btnNext) btnNext.addEventListener('click', function(){ next(); resetTimer(); });
    if (btnPrev) btnPrev.addEventListener('click', function(){ prev(); resetTimer(); });

    function startTimer(){ if (prefersReduced) return; timer = setInterval(next, interval); }
    function resetTimer(){ if (timer) { clearInterval(timer); startTimer(); } }

    startTimer();
    // Pause on hover for better readability
    var container = document.querySelector('.section-testimonials');
    if (container){
      container.addEventListener('mouseenter', function(){ if (timer) clearInterval(timer); });
      container.addEventListener('mouseleave', function(){ startTimer(); });
    }
  })();
});

(function () {
  var $doc = $(document);

  // Close all dropdowns
  function closeAll() {
    $('.navbar-evy .dropdown.show').removeClass('show')
      .find('> .dropdown-menu').removeClass('show align-right');
    $('.navbar-evy .dropdown-submenu .dropdown-menu.show').removeClass('show');
  }

  // Align top-level dropdown if overflowing viewport
  function alignTopLevel($menu) {
    $menu.removeClass('align-right');
    var rect = $menu[0].getBoundingClientRect();
    if (rect.right > (window.innerWidth - 8)) {
      $menu.addClass('align-right');
    }
  }

  // Flip submenu left if overflowing
  function alignSubmenu($submenu) {
    $submenu.removeClass('open-left');
    var $subMenuPanel = $submenu.children('.dropdown-menu');
    if (!$subMenuPanel.length) return;
    // Temporarily show to measure
    var wasHidden = $subMenuPanel.css('display') === 'none';
    if (wasHidden) { $subMenuPanel.css({ visibility: 'hidden', display: 'block' }); }

    var rect = $subMenuPanel[0].getBoundingClientRect();
    if (rect.right > (window.innerWidth - 8)) {
      $submenu.addClass('open-left');
    }

    if (wasHidden) { $subMenuPanel.css({ display: '', visibility: '' }); }
  }

  // Toggle top-level dropdown on click
  $doc.on('click', '.navbar-evy .nav-item.dropdown > .nav-link.dropdown-toggle', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $parent = $(this).closest('.dropdown');
    var isOpen = $parent.hasClass('show');

    closeAll();
    if (!isOpen) {
      $parent.addClass('show');
      var $menu = $parent.children('.dropdown-menu').addClass('show');
      alignTopLevel($menu);
    }
  });

  // Toggle second-level submenu on click
  $doc.on('click', '.navbar-evy .dropdown-submenu > .dropdown-toggle', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $submenu = $(this).parent('.dropdown-submenu');
    var $panel = $submenu.children('.dropdown-menu');
    var isOpen = $panel.hasClass('show');

    // Close sibling submenus
    $submenu.siblings('.dropdown-submenu').removeClass('open-left')
            .children('.dropdown-menu').removeClass('show');

    if (isOpen) {
      $panel.removeClass('show');
      $submenu.removeClass('open-left');
    } else {
      $panel.addClass('show');
      alignSubmenu($submenu);
    }
  });

  // Click outside to close
  $doc.on('click', function () { closeAll(); });

  // ESC to close
  $doc.on('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  // Re-align on resize
  $(window).on('resize', function () {
    $('.navbar-evy .dropdown.show > .dropdown-menu').each(function () {
      alignTopLevel($(this));
    });
    $('.navbar-evy .dropdown-submenu').each(function () {
      alignSubmenu($(this));
    });
  });

})();
