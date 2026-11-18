/**
 * demo-theme.js — przełącznik wariantów kolorystycznych (TYLKO WERSJA DEMO).
 *
 * Warianty są zdefiniowane w style.css (:root[data-theme="…"]). Wybór zapamiętuje się
 * w localStorage; link z ?motyw=rajd otwiera stronę od razu w danym wariancie
 * (przycisk „Kopiuj link” — do wysłania klientowi).
 * Przed publikacją PROD: usunąć ten plik, jego <script> i fragment z ?motyw w <head>.
 */
(function () {
  'use strict';

  const THEMES = [
    { id: 'teren', name: 'Nocny teren', note: 'grafit + limonka ze starego logo', bg: '#0c0e0a', accent: '#c4f135' },
    { id: 'rajd',  name: 'Rajd',        note: 'grafit + pomarańcz',               bg: '#0e0f11', accent: '#ff7a1a' },
    { id: 'las',   name: 'Las',         note: 'głęboka zieleń + bursztyn',        bg: '#0a120d', accent: '#f2b84b' },
    { id: 'neon',  name: 'Neon',        note: 'nocny event: fiolet + róż',        bg: '#0d0a14', accent: '#ff4fa8' },
    { id: 'dzien', name: 'Dzień',       note: 'jasna wersja: piasek + zieleń',    bg: '#f4f2ea', accent: '#3f6b00' },
  ];
  const root = document.documentElement;
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* tryb prywatny */ } },
  };
  const valid = id => THEMES.some(t => t.id === id);
  const current = () => (valid(root.dataset.theme) ? root.dataset.theme : 'teren');

  // ?motyw=… z linku zapamiętujemy (fragment w <head> już ustawił atrybut przed renderowaniem)
  const fromUrl = new URLSearchParams(location.search).get('motyw');
  if (fromUrl && valid(fromUrl)) store.set('aq-theme', fromUrl);
  if (root.dataset.theme && !valid(root.dataset.theme)) delete root.dataset.theme;

  /* ── Wygląd panelu (niezależny od motywu strony) ─────── */
  const css = `
    #theme-demo { position: fixed; left: 16px; bottom: 16px; z-index: 860; font: 500 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #f2f2f0; }
    #theme-demo button { font: inherit; color: inherit; cursor: pointer; }
    .td-toggle { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 8px; border-radius: 999px;
      background: rgba(18,18,18,.88); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 12px 30px -12px rgba(0,0,0,.6); font-weight: 700 !important; }
    .td-toggle:hover { border-color: rgba(255,255,255,.4); }
    .td-toggle small { font-weight: 500; opacity: .65; }
    .td-sw { width: 28px; height: 28px; border-radius: 50%; flex: none; border: 2px solid rgba(255,255,255,.25); }
    .td-panel { position: absolute; left: 0; bottom: calc(100% + 10px); width: 300px; max-width: calc(100vw - 32px); padding: 16px;
      border-radius: 18px; background: rgba(18,18,18,.95); border: 1px solid rgba(255,255,255,.14);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 24px 60px -20px rgba(0,0,0,.7); }
    .td-panel[hidden] { display: none; }
    .td-title { margin: 0 0 12px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; opacity: .6; font-weight: 600; }
    .td-list { display: grid; gap: 6px; }
    .td-opt { display: flex; align-items: center; gap: 12px; width: 100%; padding: 8px 10px; border-radius: 12px; text-align: left;
      background: transparent; border: 1px solid transparent; }
    .td-opt:hover { background: rgba(255,255,255,.07); }
    .td-opt[aria-pressed="true"] { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.3); }
    .td-opt strong { display: block; font-size: 14px; }
    .td-opt span span { display: block; font-size: 12px; opacity: .65; }
    .td-copy { margin-top: 12px; width: 100%; padding: 9px 12px; border-radius: 10px; background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.16); font-weight: 600 !important; }
    .td-copy:hover { background: rgba(255,255,255,.14); }
    .td-status { margin: 8px 0 0; font-size: 12px; opacity: .75; word-break: break-all; min-height: 1em; }
    #theme-demo :focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    @media (max-width: 560px) { .td-toggle small { display: none; } #theme-demo { left: 12px; bottom: 12px; } }
    @media print { #theme-demo { display: none; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const swatch = t => `background: linear-gradient(135deg, ${t.bg} 0 50%, ${t.accent} 50% 100%)`;
  const wrap = document.createElement('div');
  wrap.id = 'theme-demo';
  wrap.innerHTML = `
    <div class="td-panel" id="tdPanel" role="group" aria-label="Warianty kolorystyczne strony" hidden>
      <p class="td-title">Wersja demo · kolorystyka</p>
      <div class="td-list">
        ${THEMES.map(t => `<button type="button" class="td-opt" data-theme-id="${t.id}" aria-pressed="false">
          <span class="td-sw" style="${swatch(t)}"></span><span><strong>${t.name}</strong><span>${t.note}</span></span></button>`).join('')}
      </div>
      <button type="button" class="td-copy" id="tdCopy">Kopiuj link do tego wariantu</button>
      <p class="td-status" id="tdStatus" aria-live="polite"></p>
    </div>
    <button type="button" class="td-toggle" id="tdToggle" aria-expanded="false" aria-controls="tdPanel">
      <span class="td-sw" id="tdSw"></span>Kolorystyka <small id="tdName"></small></button>`;
  document.body.appendChild(wrap);

  const panel = document.getElementById('tdPanel');
  const toggle = document.getElementById('tdToggle');
  const status = document.getElementById('tdStatus');
  const meta = document.querySelector('meta[name="theme-color"]');

  function render() {
    const t = THEMES.find(x => x.id === current());
    document.getElementById('tdSw').setAttribute('style', swatch(t));
    document.getElementById('tdName').textContent = t.name;
    wrap.querySelectorAll('.td-opt').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeId === t.id)));
    if (meta) meta.setAttribute('content', t.bg);
  }

  function apply(id) {
    if (id === 'teren') delete root.dataset.theme; else root.dataset.theme = id;
    store.set('aq-theme', id);
    status.textContent = '';
    render();
    document.dispatchEvent(new CustomEvent('aq:theme', { detail: id }));
  }

  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  wrap.querySelectorAll('.td-opt').forEach(b => b.addEventListener('click', () => apply(b.dataset.themeId)));
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); } });

  document.getElementById('tdCopy').addEventListener('click', async () => {
    const u = new URL(location.href);
    u.searchParams.set('motyw', current());
    u.hash = '';
    try {
      await navigator.clipboard.writeText(u.href);
      status.textContent = 'Skopiowano: ' + u.href;
    } catch (e) {
      status.textContent = u.href;
    }
  });

  render();
})();
