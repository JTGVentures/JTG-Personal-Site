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

  // --- Contact form (AJAX submit to Formspree, stays on page) ---
  var form = document.querySelector('.contact-form');
  if (form) {
    var errorEl = form.querySelector('.contact-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.contact-submit');
      var span = btn ? (btn.querySelector('span') || btn) : null;
      if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }

      // Native validation (required fields / email format)
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }

      if (btn) btn.disabled = true;
      if (span) span.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          if (btn) { btn.classList.add('sent'); btn.disabled = false; }
          if (span) span.textContent = 'Received · Thank you';
          form.reset();
          setTimeout(function () {
            if (btn) btn.classList.remove('sent');
            if (span) span.textContent = 'Send Message';
          }, 5000);
        } else {
          return res.json().then(function (data) {
            throw new Error(
              data && data.errors && data.errors.length
                ? data.errors.map(function (x) { return x.message; }).join(', ')
                : 'Something went wrong. Please try again.'
            );
          });
        }
      }).catch(function (err) {
        if (btn) btn.disabled = false;
        if (span) span.textContent = 'Send Message';
        if (errorEl) {
          errorEl.textContent = (err && err.message)
            ? err.message + ' — or email info@josephgalifi.com directly.'
            : 'Could not send. Please email info@josephgalifi.com directly.';
          errorEl.hidden = false;
        }
      });
    });
  }
})();
