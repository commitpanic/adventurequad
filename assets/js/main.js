/**
 * main.js — interakcje strony: wejścia sekcji, rotator, liczniki, taśmy,
 * trasa „Jak działamy”, radar zasięgu, mapa po kliknięciu.
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const io = (cb, opts) => ('IntersectionObserver' in window ? new IntersectionObserver(cb, opts) : null);

  /* ── Wejścia sekcji ───────────────────────────────────── */
  const revealIO = !reduce && io((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => (revealIO ? revealIO.observe(el) : el.classList.add('visible')));

  /* ── Rotator w hero ───────────────────────────────────── */
  const rot = $('.rotator');
  if (rot && !reduce) {
    const words = rot.dataset.words.split('|');
    const word = $('.rotator-word', rot);
    let i = 0, heroVisible = true;
    const heroIO = io(([e]) => { heroVisible = e.isIntersecting; });
    if (heroIO) heroIO.observe(rot);
    rot.style.transition = 'width .45s cubic-bezier(.2,.7,.2,1), background-color .3s';
    setInterval(() => {
      if (!heroVisible || document.hidden) return;
      i = (i + 1) % words.length;
      word.classList.add('is-out');
      setTimeout(() => {
        const from = rot.getBoundingClientRect().width;
        word.textContent = words[i];
        rot.style.width = 'auto';
        const to = rot.getBoundingClientRect().width;
        rot.style.width = from + 'px';
        void rot.offsetWidth;
        rot.style.width = to + 'px';
        word.classList.remove('is-out');
        word.classList.add('is-in');
        requestAnimationFrame(() => requestAnimationFrame(() => word.classList.remove('is-in')));
      }, 360);
    }, 2800);
    window.addEventListener('resize', () => { rot.style.width = ''; });
  }

  /* ── Liczniki ─────────────────────────────────────────── */
  if (!reduce) {
    $$('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400, delay = 700;
      el.textContent = '0';
      const t0 = performance.now() + delay;
      const tick = now => {
        const p = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ── Taśmy: powielenie zawartości do płynnej pętli ────── */
  $$('.tape-track').forEach(track => {
    const base = [...track.children];
    let guard = 0;
    while (track.scrollWidth < window.innerWidth * 1.2 && guard++ < 6) base.forEach(n => track.appendChild(n.cloneNode(true)));
    [...track.children].forEach(n => track.appendChild(n.cloneNode(true)));
  });

  /* ── Podświetlenie kart za kursorem ───────────────────── */
  $$('.spotlight').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ── Trasa „Jak działamy” ─────────────────────────────── */
  const route = $('[data-route]');
  if (route) {
    const svg = $('.route-svg', route);
    const base = $('.route-base', route);
    const prog = $('.route-progress', route);
    const rider = $('.route-rider', route);
    const ring = $('.route-rider-ring', route);
    const steps = $$('.route-step', route);
    const flag = $('.route-flag', route);
    let len = 0, dotLens = [], ticking = false;

    const lenAtY = y => {
      let lo = 0, hi = len;
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2;
        if (prog.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
      }
      return hi;
    };

    const build = () => {
      const rr = route.getBoundingClientRect();
      if (!rr.width) return;
      svg.setAttribute('viewBox', `0 0 ${rr.width} ${rr.height}`);
      const pts = steps.map(s => {
        const d = $('.route-dot', s).getBoundingClientRect();
        return { x: d.left + d.width / 2 - rr.left, y: d.top + d.height / 2 - rr.top };
      });
      const f = flag.getBoundingClientRect();
      const end = { x: pts[pts.length - 1].x, y: f.top - rr.top };
      const swing = rr.width > 760 ? Math.min(rr.width * 0.09, 120) : 14;
      let d = `M ${pts[0].x} ${Math.max(0, pts[0].y - 70)} L ${pts[0].x} ${pts[0].y}`;
      const all = pts.concat([end]);
      for (let i = 1; i < all.length; i++) {
        const a = all[i - 1], b = all[i], h = b.y - a.y, dir = (i % 2 ? 1 : -1) * swing;
        d += ` C ${a.x + dir} ${a.y + h * 0.35}, ${b.x + dir} ${b.y - h * 0.35}, ${b.x} ${b.y}`;
      }
      base.setAttribute('d', d);
      prog.setAttribute('d', d);
      len = prog.getTotalLength();
      prog.style.strokeDasharray = len;
      dotLens = pts.map(p => lenAtY(p.y));
      update();
    };

    const update = () => {
      ticking = false;
      if (!len) return;
      const rr = route.getBoundingClientRect();
      const y = window.innerHeight * 0.62 - rr.top;
      const L = reduce ? len : (y <= 0 ? 0 : y >= rr.height ? len : lenAtY(y));
      prog.style.strokeDashoffset = len - L;
      const p = prog.getPointAtLength(L);
      [rider, ring].forEach(c => { c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); });
      steps.forEach((s, i) => s.classList.toggle('reached', L >= dotLens[i] - 2));
      route.classList.toggle('done', L >= len - 2);
    };

    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(build)).observe(route);
    else window.addEventListener('resize', build);
    build();
    window.addEventListener('load', build);
  }

  /* ── Radar: miasta zapalają się po kolei ──────────────── */
  const radar = $('.radar');
  if (radar) {
    const cities = $$('.city', radar);
    const light = () => cities.forEach(c => {
      const d = parseInt(c.dataset.d, 10) || 0;
      if (reduce) c.classList.add('lit'); else setTimeout(() => c.classList.add('lit'), 300 + d * 260);
    });
    const rIO = io(([e], obs) => { if (e.isIntersecting) { light(); obs.disconnect(); } }, { threshold: 0.35 });
    rIO ? rIO.observe(radar) : light();
  }

  /* ── Mapa po kliknięciu ───────────────────────────────── */
  const mapBtn = $('#mapLoad');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      $('#mapBox').innerHTML = '<iframe title="Mapa dojazdu — Adventure Quad, Kupienino 14, 66-200 Świebodzin" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Kupienino+14,+66-200+%C5%9Awiebodzin&output=embed"></iframe>';
    });
  }
})();
