/* Joseph T. Galifi — production interactivity (no React, no Babel) */
(function () {
  'use strict';

  // --- Nav: condense on scroll ---
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Reveal-on-scroll ---
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    // Hide only what's below the fold, so above-fold content paints immediately
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.85) el.classList.remove('in');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      io.observe(el);
    });
  }

  // --- Live New York clock (hero) ---
  var clock = document.getElementById('nyc-clock');
  if (clock) {
    var tick = function () {
      var t = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/New_York'
      });
      clock.textContent = 'NYC · ' + t + ' ET';
    };
    tick();
    setInterval(tick, 30000);
  }

  // --- Contact form (client-side acknowledgement) ---
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.contact-submit');
      if (!btn) return;
      var span = btn.querySelector('span') || btn;
      btn.classList.add('sent');
      span.textContent = 'Received · Thank you';
      setTimeout(function () {
        btn.classList.remove('sent');
        span.textContent = 'Send Message';
        form.reset();
      }, 4000);
    });
  }
})();
