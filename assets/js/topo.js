/**
 * topo.js — animowana mapa poziomicowa na <canvas data-topo="hero|soft|static">
 *
 * Teren = szum simplex 3D (x, y, czas) + „wzgórze” pod kursorem.
 * Poziomice: marching squares → odcinki łączone w ciągłe linie (po wspólnych krawędziach
 * komórek) → rysowane krzywymi przez środki odcinków, więc są gładkie także przy dużych
 * komórkach siatki na wielkich ekranach. Co piąta linia grubsza (jak na mapie).
 * - kolor z CSS: --topo-rgb (zmienia się z motywem; zdarzenie „aq:theme”),
 * - prefers-reduced-motion / data-topo="static" → jedna klatka, bez animacji,
 * - animacja pauzuje poza ekranem i na ukrytej karcie,
 * - na dotyku wzgórze wędruje samo.
 */
(function () {
  'use strict';

  /* ── Szum simplex 3D (S. Gustavson, domena publiczna) ── */
  function makeNoise(seed) {
    const grad3 = new Float32Array([1,1,0, -1,1,0, 1,-1,0, -1,-1,0, 1,0,1, -1,0,1, 1,0,-1, -1,0,-1, 0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1]);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = (seed >>> 0) || 1;
    const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
    const perm = new Uint8Array(512), pm12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm12[i] = perm[i] % 12; }
    const F3 = 1 / 3, G3 = 1 / 6;

    return function noise(xin, yin, zin) {
      let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
      const sk = (xin + yin + zin) * F3;
      const i = Math.floor(xin + sk), j = Math.floor(yin + sk), k = Math.floor(zin + sk);
      const t = (i + j + k) * G3;
      const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0)      { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else               { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0)       { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0)  { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else               { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
      const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
      const ii = i & 255, jj = j & 255, kk = k & 255;
      let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 > 0) { const g = pm12[ii + perm[jj + perm[kk]]] * 3; t0 *= t0; n0 = t0 * t0 * (grad3[g] * x0 + grad3[g + 1] * y0 + grad3[g + 2] * z0); }
      let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 > 0) { const g = pm12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3; t1 *= t1; n1 = t1 * t1 * (grad3[g] * x1 + grad3[g + 1] * y1 + grad3[g + 2] * z1); }
      let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 > 0) { const g = pm12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3; t2 *= t2; n2 = t2 * t2 * (grad3[g] * x2 + grad3[g + 1] * y2 + grad3[g + 2] * z2); }
      let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 > 0) { const g = pm12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3; t3 *= t3; n3 = t3 * t3 * (grad3[g] * x3 + grad3[g + 1] * y3 + grad3[g + 2] * z3); }
      return 32 * (n0 + n1 + n2 + n3);
    };
  }

  const PRESETS = {
    hero:   { cell: 9,  step: 0.115, scale: 0.0016, alpha: 1,    hill: 1.0, fps: 24, speed: 0.05, animate: true,  interactive: true,  seed: 7,  hillX: 0.68, hillY: 0.42 },
    soft:   { cell: 10, step: 0.13,  scale: 0.0020, alpha: 0.7,  hill: 0.8, fps: 24, speed: 0.04, animate: true,  interactive: true,  seed: 23, hillX: 0.78, hillY: 0.5 },
    static: { cell: 9,  step: 0.12,  scale: 0.0024, alpha: 0.75, hill: 0.9, fps: 0,  speed: 0,    animate: false, interactive: false, seed: 41, hillX: 0.8,  hillY: 0.5 },
  };
  const GRID_BUDGET = 13000;   // maks. liczba punktów siatki (koszt stały niezależnie od rozmiaru ekranu)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = [];
  let color = '196,241,53';
  const readColor = () => {
    if (document.body.classList.contains('hc-mode')) return '255,224,102';
    const v = getComputedStyle(document.documentElement).getPropertyValue('--topo-rgb').trim();
    return v ? v.replace(/\s+/g, '') : '196,241,53';
  };

  function Topo(canvas, preset) {
    const o = Object.assign({}, PRESETS[preset] || PRESETS.hero);
    const ctx = canvas.getContext('2d', { alpha: true });
    const noise = makeNoise(o.seed);
    const host = canvas.parentElement;
    const hud = host.querySelector('[data-hud]');
    let w = 1, h = 1, dpr = 1, cols = 2, rows = 2, cw = 1, ch = 1;
    let field = new Float32Array(4);
    let t = 11.7 + o.seed, raf = 0, last = 0, onScreen = true, lastHud = 0;
    const hill = { x: 0, y: 0, tx: 0, ty: 0, follow: false, k: o.hill };

    // bufory łączenia odcinków (przeliczane przy zmianie rozmiaru)
    let eGen, eA, eB, eX, eY, segE1, segE2, segUsed, cellK0, cellK1, bucket = new Int32Array(1 << 15);
    let gen = 0;
    const chain = [], back = [];

    const animated = () => o.animate && !reduceMotion.matches;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const cell = Math.max(w < 700 ? o.cell * 1.3 : o.cell, Math.sqrt((w * h) / GRID_BUDGET));
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      cw = w / (cols - 1);
      ch = h / (rows - 1);
      field = new Float32Array(cols * rows);
      const nEdges = 2 * cols * rows, nCells = (cols - 1) * (rows - 1);
      eGen = new Uint32Array(nEdges); eA = new Int32Array(nEdges); eB = new Int32Array(nEdges);
      eX = new Float32Array(nEdges); eY = new Float32Array(nEdges);
      segE1 = new Int32Array(2 * nCells); segE2 = new Int32Array(2 * nCells); segUsed = new Uint8Array(2 * nCells);
      cellK0 = new Int32Array(nCells); cellK1 = new Int32Array(nCells);
      gen = 0;
      if (!hill.follow) { hill.x = hill.tx = w * o.hillX; hill.y = hill.ty = h * o.hillY; }
      draw();
    }

    function sample(x, y, s, r2) {
      let v = noise(x * s, y * s, t) * 0.8 + noise(x * s * 2.1 + 31.7, y * s * 2.1 - 12.1, t * 1.3) * 0.2;
      if (hill.k) { const dx = x - hill.x, dy = y - hill.y; v += hill.k * Math.exp(-(dx * dx + dy * dy) / r2); }
      return v;
    }

    function compute() {
      const s = o.scale * (w < 700 ? 1.5 : 1);
      const r2 = Math.pow(Math.min(Math.max(w, h) * 0.17, 280), 2);
      let idx = 0;
      for (let j = 0; j < rows; j++) {
        const y = j * ch;
        for (let i = 0; i < cols; i++) field[idx++] = sample(i * cw, y, s, r2);
      }
      return { s, r2 };
    }

    /* ── Poziomice ─────────────────────────────────────────
       Krawędzie siatki: pozioma (i,j)→(i+1,j) = 2·(j·cols+i), pionowa (i,j)→(i,j+1) = 2·(j·cols+i)+1.
       Każdą krawędź przecinają najwyżej 2 odcinki danego poziomu (z 2 sąsiednich komórek),
       więc łączenie w linie to proste chodzenie po krawędziach. */
    function setEdge(e, x, y) { if (eGen[e] !== gen) { eGen[e] = gen; eX[e] = x; eY[e] = y; eA[e] = -1; eB[e] = -1; } }
    function link(e, sIdx) { if (eA[e] < 0) eA[e] = sIdx; else eB[e] = sIdx; }

    function emit(p, n, closed) {
      if (n < 2) return;
      if (n === 2) { p.moveTo(eX[chain[0]], eY[chain[0]]); p.lineTo(eX[chain[1]], eY[chain[1]]); return; }
      if (closed) {
        const a0 = chain[n - 1], b0 = chain[0];
        p.moveTo((eX[a0] + eX[b0]) / 2, (eY[a0] + eY[b0]) / 2);
        for (let i = 0; i < n; i++) {
          const a = chain[i], b = chain[(i + 1) % n];
          p.quadraticCurveTo(eX[a], eY[a], (eX[a] + eX[b]) / 2, (eY[a] + eY[b]) / 2);
        }
        p.closePath();
      } else {
        p.moveTo(eX[chain[0]], eY[chain[0]]);
        for (let i = 1; i < n - 1; i++) {
          const a = chain[i], b = chain[i + 1];
          p.quadraticCurveTo(eX[a], eY[a], (eX[a] + eX[b]) / 2, (eY[a] + eY[b]) / 2);
        }
        p.lineTo(eX[chain[n - 1]], eY[chain[n - 1]]);
      }
    }

    function contours() {
      const step = o.step, cx = cols - 1, cy = rows - 1, nCells = cx * cy;
      const minor = new Path2D(), major = new Path2D();

      // 1) zakres poziomów w każdej komórce
      let kLo = 1e9, kHi = -1e9, total = 0;
      for (let j = 0, c = 0; j < cy; j++) {
        const r0 = j * cols, r1 = r0 + cols;
        for (let i = 0; i < cx; i++, c++) {
          const a = field[r0 + i], b = field[r0 + i + 1], cc = field[r1 + i + 1], d = field[r1 + i];
          const k0 = Math.ceil(Math.min(a, b, cc, d) / step), k1 = Math.floor(Math.max(a, b, cc, d) / step);
          cellK0[c] = k0; cellK1[c] = k1;
          if (k0 <= k1) { total += k1 - k0 + 1; if (k0 < kLo) kLo = k0; if (k1 > kHi) kHi = k1; }
        }
      }
      if (!total) return { minor, major };

      // 2) kubełki komórek na poziom (sortowanie przez zliczanie)
      const nLv = kHi - kLo + 1;
      const start = new Int32Array(nLv + 1);
      for (let c = 0; c < nCells; c++) for (let k = cellK0[c]; k <= cellK1[c]; k++) start[k - kLo + 1]++;
      for (let l = 0; l < nLv; l++) start[l + 1] += start[l];
      if (bucket.length < total) bucket = new Int32Array(total * 1.5 | 0);
      const fill = start.slice(0, nLv);
      for (let c = 0; c < nCells; c++) for (let k = cellK0[c]; k <= cellK1[c]; k++) bucket[fill[k - kLo]++] = c;

      // 3) każdy poziom: odcinki → linie → krzywe
      for (let l = 0; l < nLv; l++) {
        const k = l + kLo, L = k * step;
        const p = (k % 5 === 0) ? major : minor;
        if (++gen > 4e9) { eGen.fill(0); gen = 1; }
        let nSeg = 0;

        for (let q = start[l]; q < start[l + 1]; q++) {
          const c = bucket[q], i = c % cx, j = (c / cx) | 0;
          const r0 = j * cols, r1 = r0 + cols;
          const a = field[r0 + i], b = field[r0 + i + 1], cc = field[r1 + i + 1], d = field[r1 + i];
          const code = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (cc > L ? 2 : 0) | (d > L ? 1 : 0);
          if (code === 0 || code === 15) continue;
          const x0 = i * cw, y0 = j * ch, x1 = x0 + cw, y1 = y0 + ch;
          const eT = 2 * (r0 + i), eBt = 2 * (r1 + i), eL = eT + 1, eR = 2 * (r0 + i + 1) + 1;
          const top = () => setEdge(eT, x0 + (L - a) / (b - a) * cw, y0);
          const right = () => setEdge(eR, x1, y0 + (L - b) / (cc - b) * ch);
          const bottom = () => setEdge(eBt, x0 + (L - d) / (cc - d) * cw, y1);
          const left = () => setEdge(eL, x0, y0 + (L - a) / (d - a) * ch);
          const seg = (e1, e2) => { segE1[nSeg] = e1; segE2[nSeg] = e2; segUsed[nSeg] = 0; link(e1, nSeg); link(e2, nSeg); nSeg++; };
          switch (code) {
            case 1: case 14: left(); bottom(); seg(eL, eBt); break;
            case 2: case 13: bottom(); right(); seg(eBt, eR); break;
            case 3: case 12: left(); right(); seg(eL, eR); break;
            case 4: case 11: top(); right(); seg(eT, eR); break;
            case 6: case 9:  top(); bottom(); seg(eT, eBt); break;
            case 7: case 8:  left(); top(); seg(eL, eT); break;
            case 5:  left(); top(); bottom(); right(); seg(eL, eT); seg(eBt, eR); break;
            case 10: top(); right(); left(); bottom(); seg(eT, eR); seg(eL, eBt); break;
          }
        }

        for (let s0 = 0; s0 < nSeg; s0++) {
          if (segUsed[s0]) continue;
          segUsed[s0] = 1;
          chain.length = 0;
          chain.push(segE1[s0], segE2[s0]);
          let e = segE2[s0], s = s0, closed = false;
          for (;;) {                                   // do przodu
            const nx = eA[e] === s ? eB[e] : eA[e];
            if (nx < 0) break;
            if (segUsed[nx]) { closed = nx === s0; break; }
            segUsed[nx] = 1;
            e = segE1[nx] === e ? segE2[nx] : segE1[nx];
            chain.push(e); s = nx;
          }
          if (closed) {
            chain.pop();                               // ostatni punkt = pierwszy
          } else {                                     // do tyłu od początku
            back.length = 0; e = segE1[s0]; s = s0;
            for (;;) {
              const nx = eA[e] === s ? eB[e] : eA[e];
              if (nx < 0 || segUsed[nx]) break;
              segUsed[nx] = 1;
              e = segE1[nx] === e ? segE2[nx] : segE1[nx];
              back.push(e); s = nx;
            }
            if (back.length) chain.unshift(...back.reverse());
          }
          emit(p, chain.length, closed);
        }
      }
      return { minor, major };
    }

    function draw() {
      const { s, r2 } = compute();
      const { minor, major } = contours();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.max(w, h) * 0.65;
      const g = ctx.createRadialGradient(hill.x, hill.y, 0, hill.x, hill.y, R);
      g.addColorStop(0,    `rgba(${color},${0.75 * o.alpha})`);
      g.addColorStop(0.28, `rgba(${color},${0.30 * o.alpha})`);
      g.addColorStop(1,    `rgba(${color},${0.11 * o.alpha})`);
      ctx.strokeStyle = g;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      ctx.stroke(minor);
      ctx.lineWidth = 1.7;
      ctx.globalAlpha = 1;
      ctx.stroke(major);
      if (hud) updateHud(s, r2);
    }

    /* HUD: współrzędne „pod kursorem” wokół Świebodzina + wysokość z pola */
    const hudLat = hud && hud.querySelector('[data-hud-lat]');
    const hudLon = hud && hud.querySelector('[data-hud-lon]');
    const hudAlt = hud && hud.querySelector('[data-hud-alt]');
    function updateHud(s, r2) {
      const now = performance.now();
      if (now - lastHud < 90) return;
      lastHud = now;
      const lat = 52.330 - (hill.y / h) * 0.17;
      const lon = 15.370 + (hill.x / w) * 0.33;
      const alt = Math.round(118 + sample(hill.x, hill.y, s, r2) * 42);
      if (hudLat) hudLat.textContent = lat.toFixed(4) + '° N';
      if (hudLon) hudLon.textContent = lon.toFixed(4) + '° E';
      if (hudAlt) hudAlt.textContent = alt + ' m n.p.m.';
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / o.fps - 1) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt * o.speed;
      if (!hill.follow) {
        const tt = now / 1000;
        hill.tx = w * (o.hillX + 0.14 * Math.sin(tt * 0.21));
        hill.ty = h * (o.hillY + 0.16 * Math.sin(tt * 0.29 + 1.3));
      }
      const ease = hill.follow ? 0.14 : 0.04;
      hill.x += (hill.tx - hill.x) * ease;
      hill.y += (hill.ty - hill.y) * ease;
      draw();
    }

    function start() {
      if (raf || !animated() || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    // Kursor = wzgórze (tylko mysz; dotyk przewija stronę)
    if (o.interactive) {
      host.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || !animated()) return;
        const r = canvas.getBoundingClientRect();
        hill.tx = e.clientX - r.left;
        hill.ty = e.clientY - r.top;
        hill.follow = true;
      }, { passive: true });
      host.addEventListener('pointerleave', () => { hill.follow = false; });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }).observe(canvas);
    }
    if ('ResizeObserver' in window) {
      let pending = 0;
      new ResizeObserver(() => { cancelAnimationFrame(pending); pending = requestAnimationFrame(resize); }).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();
    start();

    return { start, stop, redraw: draw, motionChanged() { stop(); draw(); start(); } };
  }

  color = readColor();
  document.querySelectorAll('canvas[data-topo]').forEach(c => instances.push(Topo(c, c.dataset.topo)));

  document.addEventListener('visibilitychange', () => instances.forEach(i => (document.hidden ? i.stop() : i.start())));
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', () => instances.forEach(i => i.motionChanged()));
  const recolor = () => { color = readColor(); instances.forEach(i => i.redraw()); };
  document.addEventListener('aq:contrast', recolor);
  document.addEventListener('aq:theme', recolor);

  window.AQTopo = { instances };
})();
