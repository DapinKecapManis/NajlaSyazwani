/* motion.js — scroll reveal + state navigasi untuk tema scrawl.
   Tidak mengubah HTML: kelas animasi ditambahkan lewat selector. */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav: bayangan tipis saat discroll ─────────────────── */
  var nav = document.querySelector('.site-nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Nav: tandai menu sesuai section yang sedang dibaca ── */
  if ('IntersectionObserver' in window) {
    var links = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          a.classList.add('is-active');
        } else {
          a.classList.remove('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  if (reduce) return; // selebihnya hanya gerak

  /* ── Stiker: fase mengambang dibuat berbeda-beda ───────── */
  document.querySelectorAll('[data-sticker]').forEach(function (el, i) {
    el.style.setProperty('--bd', (-i * 1.1) + 's');
  });

  /* ── Scroll reveal ─────────────────────────────────────── */
  if (!('IntersectionObserver' in window)) return;

  // [selector, varian]  — varian: '' | paste | stick | pop
  var targets = [
    ['.sw-tape-strip',                     'stick'],
    ['.section-eyebrow',                   ''],
    ['.section-heading',                   ''],
    ['.section-sub',                       ''],
    ['.about-notebook',                    ''],
    ['.about-tags',                        ''],
    ['.stat-sticky',                       'paste'],
    ['.sw-sticky-lined',                   'paste'],
    ['.academic-sticky > p',               ''],
    ['.academic-receipt',                  'paste'],
    ['.receipt-step',                      ''],
    ['.academic-detail',                   ''],
    ['.interest-index',                    'paste'],
    ['.skills-grid > div > .sw-index-card','paste'],
    ['.contact-star .sw-starburst',        'pop'],
    ['.contact-title',                     ''],
    ['.contact-sub',                       ''],
    ['.social-links',                      ''],
    ['.site-footer > div',                 '']
  ];

  var io = new IntersectionObserver(function (entries, obs) {
    var batch = 0; // stagger hanya untuk elemen yang muncul bersamaan
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      obs.unobserve(el);
      el.style.transitionDelay = Math.min(batch * 0.08, 0.4) + 's';
      batch++;
      requestAnimationFrame(function () { el.classList.add('rv-in'); });
      // lepas kelas setelah selesai → hover & gaya asli kembali bebas
      setTimeout(function () {
        el.classList.remove('rv', 'rv-in', 'rv-paste', 'rv-stick', 'rv-pop');
        el.style.transitionDelay = '';
      }, 1400);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (t) {
    document.querySelectorAll(t[0]).forEach(function (el) {
      el.classList.add('rv');
      if (t[1]) el.classList.add('rv-' + t[1]);
      io.observe(el);
    });
  });
})();
