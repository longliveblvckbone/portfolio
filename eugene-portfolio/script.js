/* ===== Eugene Atirene — Portfolio interactions ===== */
(function () {
  'use strict';

  /* --- Sticky navbar shadow on scroll --- */
  var navbar = document.getElementById('navbar');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav toggle --- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* --- Scroll reveal via IntersectionObserver --- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Animated stat counters --- */
  var stats = document.querySelectorAll('.stat strong[data-count]');
  var counted = false;
  function runCounters() {
    if (counted) return;
    var about = document.getElementById('about');
    if (!about) return;
    var rect = about.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      counted = true;
      stats.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var cur = 0;
        var step = Math.max(1, Math.ceil(target / 40));
        var t = setInterval(function () {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur + '+';
        }, 30);
      });
    }
  }
  window.addEventListener('scroll', runCounters, { passive: true });
  runCounters();

  /* --- Contact form validation (client-side only) --- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name, email = form.email, message = form.message;
      var ok = true;
      [name, email, message].forEach(function (f) {
        var bad = !f.value.trim() || (f === email && !emailRe.test(email.value.trim()));
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.textContent = 'Please fill in all fields with a valid email.';
        note.className = 'form-note err';
        return;
      }
      note.textContent = 'Thanks, ' + name.value.trim() + '! Your message is ready — connect a form service (e.g. Formspree) to send it.';
      note.className = 'form-note ok';
      form.reset();
    });
  }

  /* --- Footer year --- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* --- Video lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var lbFrame = document.getElementById('lightboxFrame');
  var lbTitle = document.getElementById('lightboxTitle');
  var lbClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  function buildPlayer(src, title) {
    // YouTube / Vimeo embeds use an iframe; local/remote files use <video>.
    var isEmbed = /youtube\.com\/embed|player\.vimeo\.com/.test(src);
    if (isEmbed) {
      var join = src.indexOf('?') > -1 ? '&' : '?';
      var iframe = document.createElement('iframe');
      iframe.src = src + join + 'autoplay=1&rel=0';
      iframe.title = title || 'Project video';
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      return iframe;
    }
    var video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    return video;
  }

  function openLightbox(src, title) {
    if (!src) return;
    lastFocused = document.activeElement;
    lbTitle.textContent = title || '';
    lbFrame.innerHTML = '';
    lbFrame.appendChild(buildPlayer(src, title));
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbFrame.innerHTML = ''; // stops playback by removing the player
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card.getAttribute('data-video'), card.getAttribute('data-title'));
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }
})();
