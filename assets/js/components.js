/**
 * components.js — wspólny header i stopka + pasek dostępności
 * Użycie: <div id="header-placeholder"></div> / <div id="footer-placeholder"></div>
 * i <script src="assets/js/components.js"></script> na końcu <body>.
 * <body data-page="…"> zaznacza aktywny link (podstrony); na stronie głównej
 * aktywny link wynika z przewijanej sekcji.
 */

(function () {
  const PHONE_HREF = 'tel:+48603805651';
  const PHONE_TEXT = '603 805 651';
  const EMAIL      = 'norbert@adventurequad.pl';
  const FACEBOOK   = 'https://www.facebook.com/imprezyintegracyjne/';
  const page = document.body.dataset.page || '';
  const onHome = page === 'home';
  const home = onHome ? '' : 'index.html';

  const logoSVG = `
    <svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="38" height="38" rx="11" style="fill:var(--surface);stroke:color-mix(in srgb, var(--lime) 35%, transparent)"/>
      <path d="M20 6.5c8.4 0 13.6 5.6 13.4 13-.2 8-6.6 13.6-14.2 13.4C11.4 32.7 6.4 27 6.6 19.8 6.8 12 12.2 6.5 20 6.5Z" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.6"/>
      <path d="M21 11.2c5.2 0 8.4 3.8 8.2 8.6-.2 5.2-4.4 8.6-9.4 8.4-5-.2-8-3.8-7.9-8.4.1-4.9 3.9-8.6 9.1-8.6Z" fill="none" stroke="currentColor" stroke-opacity=".75" stroke-width="1.8"/>
      <path d="M21.2 15.6c2.6 0 4.1 2 3.9 4.3-.2 2.6-2.4 4.2-4.8 4-2.5-.2-3.9-2.1-3.7-4.3.2-2.4 2-4 4.6-4Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="20.8" cy="19.8" r="1.5" fill="currentColor"/>
    </svg>`;

  const wordmark = `<span class="wordmark">ADVENTURE<span class="tag">QUAD</span></span>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`;

  /* ── Header ───────────────────────────────────────────── */
  const headerHTML = `
  <a href="#main" class="skip-link">Przejdź do treści</a>
  <nav id="navbar" aria-label="Menu główne">
    <div class="container">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo" aria-label="Adventure Quad — strona główna">${logoSVG}${wordmark}</a>
        <ul class="nav-links" id="navLinks">
          <li><a href="oferta.html" data-page="oferta">Oferta</a></li>
          <li><a href="${home}#jak-dzialamy" data-section="jak-dzialamy">Jak działamy</a></li>
          <li><a href="${home}#zasieg" data-section="zasieg">Zasięg</a></li>
          <li><a href="${home}#faq" data-section="faq">FAQ</a></li>
          <li><a href="${home}#kontakt" data-section="kontakt">Kontakt</a></li>
          <li><a href="${PHONE_HREF}" class="nav-cta">${phoneIcon}${PHONE_TEXT}</a></li>
        </ul>
        <button class="hamburger" id="hamburger" type="button" aria-label="Otwórz menu" aria-expanded="false" aria-controls="navLinks">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>`;

  /* ── Stopka ───────────────────────────────────────────── */
  const footerHTML = `
  <footer id="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="nav-logo" aria-label="Adventure Quad — strona główna">${logoSVG}${wordmark}</a>
          <p>Agencja eventowa ze Świebodzina. Imprezy integracyjne, pikniki firmowe, festyny i imprezy scenariuszowe w lubuskim, wielkopolskim, dolnośląskim i zachodniopomorskim.</p>
        </div>
        <div class="footer-col">
          <h4>Eventy</h4>
          <ul>
            <li><a href="oferta.html#integracje">Imprezy integracyjne</a></li>
            <li><a href="oferta.html#pikniki-firmowe">Pikniki firmowe</a></li>
            <li><a href="oferta.html#festyny">Festyny i dni miast</a></li>
            <li><a href="oferta.html#wyjazdy">Wyjazdy integracyjne</a></li>
            <li><a href="oferta.html#team-building">Team building</a></li>
            <li><a href="oferta.html#bunkry-mru">Bunkry MRU</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Informacje</h4>
          <ul>
            <li><a href="${home}#jak-dzialamy">Jak działamy</a></li>
            <li><a href="${home}#zasieg">Zasięg i dojazd</a></li>
            <li><a href="${home}#kontakt">Kontakt</a></li>
            <li><a href="oferta.html#atrakcje">Katalog atrakcji</a></li>
            <li><a href="${home}#faq">Najczęstsze pytania</a></li>
            <li><a href="polityka-prywatnosci.html">Polityka prywatności</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Kontakt</h4>
          <ul>
            <li><a href="${PHONE_HREF}">${PHONE_TEXT}</a><span class="small">pikniki firmowe, duże eventy</span></li>
            <li><a href="tel:+48515602802">515 602 802</a><span class="small">quady, paintball</span></li>
            <li><a href="tel:+48513221622">513 221 622</a><span class="small">imprezy scenariuszowe, MRU</span></li>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><a href="${FACEBOOK}" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>
      <svg class="footer-giant" viewBox="0 0 1200 150" aria-hidden="true" focusable="false"><text x="2" y="134" textLength="1196" lengthAdjust="spacingAndGlyphs">ADVENTURE QUAD</text></svg>
      <div class="footer-bottom">
        <p>© <span id="footerYear"></span> Adventure Quad. Wszelkie prawa zastrzeżone.</p>
        <p>Created by <a href="https://kubabuba.pl" target="_blank" rel="noopener noreferrer">kubabuba.pl</a></p>
      </div>
    </div>
  </footer>`;

  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (headerEl) headerEl.outerHTML = headerHTML;
  if (footerEl) footerEl.outerHTML = footerHTML;

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Aktywny link ─────────────────────────────────────── */
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const setActive = el => navAnchors.forEach(a => {
    const on = a === el;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', onHome ? 'location' : 'page'); else a.removeAttribute('aria-current');
  });
  const pageLink = navAnchors.find(a => a.dataset.page && a.dataset.page === page);
  if (pageLink) setActive(pageLink);

  if (onHome && 'IntersectionObserver' in window) {
    const sectionLinks = navAnchors.filter(a => a.dataset.section);
    const targets = sectionLinks.map(a => document.getElementById(a.dataset.section)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        setActive(sectionLinks.find(a => a.dataset.section === e.target.id) || null);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => io.observe(t));
    // sekcje bez linku w menu gaszą podświetlenie
    document.querySelectorAll('main > section:not([id]), main > section[data-nav-clear]').forEach(s => io.observe(s));
  }

  /* ── Pasek nawigacji przy przewijaniu ─────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Menu mobilne ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    const setOpen = open => {
      navLinks.classList.toggle('open', open);
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.classList.toggle('nav-open', open);
    };
    hamburger.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { setOpen(false); hamburger.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  /* ── Pasek dostępności (desktop) ──────────────────────── */
  const a11yCSS = `
    #a11y-bar { position: fixed; top: 50%; right: 0; transform: translateY(-50%); z-index: 800;
      display: flex; flex-direction: column; gap: 2px; padding: 6px 4px;
      background: rgba(23,27,18,.92); border: 1px solid rgba(230,240,205,.14); border-right: 0;
      border-radius: 10px 0 0 10px; backdrop-filter: blur(8px); }
    #a11y-bar button { width: 38px; height: 38px; border: 0; border-radius: 7px; background: transparent;
      color: #eef1e6; font: 700 .78rem/1 system-ui, sans-serif; cursor: pointer; padding: 0; }
    #a11y-bar button:hover { background: rgba(255,255,255,.1); }
    #a11y-bar button.a11y-active { background: #ffe066; color: #000; }
    #a11y-bar .a11y-sep { height: 1px; background: rgba(255,255,255,.14); margin: 2px 4px; }
    @media (max-width: 960px) { #a11y-bar { display: none !important; } }

    body.hc-mode { --bg:#000; --bg-2:#000; --surface:#0a0a0a; --surface-2:#111; --line:#777; --line-strong:#aaa;
      --text:#fff; --text-muted:#e5e5e5; --text-soft:#fff; --lime:#ffe066; --accent-ink:#000;
      --lime-soft:rgba(255,224,102,.18); --lime-glow:rgba(255,224,102,.4);
      --sand:#000; --sand-2:#111; --sand-card:#0a0a0a; --ink:#000; --ink-muted:#e5e5e5; --accent-deep:#ffe066;
      --hero-glow:#000; --footer-bg:#000; color-scheme: dark; background:#000; }
    body.hc-mode .hero::before, body.hc-mode .page-hero::before { background: rgba(0,0,0,.88) !important; }
    body.hc-mode .on-sand, body.hc-mode .on-sand h2, body.hc-mode .on-sand h3 { color: #fff; }
    body.hc-mode .feature, body.hc-mode .aud-card, body.hc-mode .faq details, body.hc-mode .att { background: #0a0a0a; border-color: #777; color: #fff; }
    body.hc-mode .faq summary, body.hc-mode .att h4 { color: #fff; }
    body.hc-mode .cta-band { background: #ffe066; }
    body.hc-mode .cta-band, body.hc-mode .cta-band h2, body.hc-mode .cta-band p { color: #000; }
    body.hc-mode .cta-band .btn-dark { background: #000; color: #fff; }
    body.hc-mode .footer-giant text { stroke: #666; }
    body.hc-mode a:not(.btn):not(.nav-cta):not(.phone-card) { color: #ffe066; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = a11yCSS;
  document.head.appendChild(styleEl);

  const a11yBar = document.createElement('div');
  a11yBar.id = 'a11y-bar';
  a11yBar.setAttribute('role', 'toolbar');
  a11yBar.setAttribute('aria-label', 'Narzędzia dostępności');
  a11yBar.innerHTML = `
    <button type="button" id="a11y-increase" title="Powiększ tekst" aria-label="Powiększ tekst">A+</button>
    <button type="button" id="a11y-decrease" title="Pomniejsz tekst" aria-label="Pomniejsz tekst">A−</button>
    <button type="button" id="a11y-reset" title="Resetuj rozmiar tekstu" aria-label="Resetuj rozmiar tekstu" style="font-size:.65rem">A↺</button>
    <div class="a11y-sep"></div>
    <button type="button" id="a11y-contrast" title="Wysoki kontrast" aria-label="Wysoki kontrast" aria-pressed="false" style="font-size:.7rem">WK</button>`;
  document.body.appendChild(a11yBar);

  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* tryb prywatny */ } },
  };
  let size = parseInt(store.get('aq-a11y-size') || '0', 10) || 0;
  const contrastBtn = document.getElementById('a11y-contrast');
  const applySize = () => {
    document.documentElement.style.fontSize = size ? (100 + size * 10) + '%' : '';
    store.set('aq-a11y-size', size);
  };
  const applyHC = on => {
    document.body.classList.toggle('hc-mode', on);
    contrastBtn.classList.toggle('a11y-active', on);
    contrastBtn.setAttribute('aria-pressed', String(on));
    document.dispatchEvent(new CustomEvent('aq:contrast', { detail: on }));
  };
  if (size) applySize();
  if (store.get('aq-a11y-hc') === '1') applyHC(true);

  document.getElementById('a11y-increase').addEventListener('click', () => { if (size < 3) { size++; applySize(); } });
  document.getElementById('a11y-decrease').addEventListener('click', () => { if (size > -1) { size--; applySize(); } });
  document.getElementById('a11y-reset').addEventListener('click', () => { size = 0; applySize(); });
  contrastBtn.addEventListener('click', () => {
    const on = !document.body.classList.contains('hc-mode');
    applyHC(on);
    store.set('aq-a11y-hc', on ? '1' : '0');
  });
})();
