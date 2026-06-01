/* Shared mobile navigation — injects a hamburger toggle + slide-in menu.
   Works on every page that includes this script and has a <header class="site">
   with a <nav class="primary">. No markup changes needed per page. */
(function () {
  function init() {
    var header = document.querySelector('header.site');
    if (!header) return;
    var nav = header.querySelector('nav.primary');
    var cta = header.querySelector('.header-cta');
    if (!nav || !cta) return;

    // Build the hamburger button
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    cta.appendChild(toggle);

    // Build the slide-in panel
    var panel = document.createElement('div');
    panel.className = 'mobile-menu';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-hidden', 'true');

    var inner = document.createElement('div');
    inner.className = 'mobile-menu-inner';

    // Header row inside the panel (title + close)
    var top = document.createElement('div');
    top.className = 'mobile-menu-top';
    top.innerHTML = '<span class="mm-title">Pieroni &amp; Fiorello</span>';
    var close = document.createElement('button');
    close.className = 'nav-close';
    close.setAttribute('aria-label', 'Close menu');
    close.innerHTML = '&times;';
    top.appendChild(close);
    inner.appendChild(top);

    // Cloned nav links
    var list = document.createElement('nav');
    list.className = 'mobile-links';
    nav.querySelectorAll('a').forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      if (a.getAttribute('aria-current')) link.setAttribute('aria-current', 'page');
      list.appendChild(link);
    });
    inner.appendChild(list);

    // Footer actions: phone + book a visit
    var actions = document.createElement('div');
    actions.className = 'mobile-actions';
    actions.innerHTML =
      '<a class="btn btn-primary" href="visit.html">Book a Visit</a>' +
      '<a class="mm-phone" href="tel:+17184425319">718-442-5319</a>';
    inner.appendChild(actions);

    panel.appendChild(inner);
    document.body.appendChild(panel);

    function open() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
    }
    function shut() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    }

    toggle.addEventListener('click', open);
    close.addEventListener('click', shut);
    panel.addEventListener('click', function (e) {
      if (e.target === panel) shut(); // click backdrop
    });
    list.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
