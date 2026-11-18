# Adventure Quad — agencja eventowa

Strona demonstracyjna dla Adventure Quad (Świebodzin): statyczny HTML + CSS + Vanilla JS, bez frameworków i zewnętrznych fontów. Strona wizytówka — kontakt wyłącznie przez dane kontaktowe, **bez formularza** (uzgodnione z klientem).

## Struktura

```
/
├── index.html                 # strona główna: hero z animacją, eventy, proces, MRU, dla kogo, zasięg, FAQ, kontakt
├── oferta.html                # rodzaje eventów szczegółowo + Bunkry MRU + katalog atrakcji
├── polityka-prywatnosci.html
├── 404.html                   # „Zjechaliśmy z trasy” (GitHub Pages)
├── favicon.svg
├── robots.txt
├── assets/
│   ├── css/style.css          # cały wygląd; kolory w zmiennych :root + warianty [data-theme]
│   ├── js/components.js       # wspólny header/stopka + pasek dostępności (A+/A−/kontrast)
│   ├── js/topo.js             # animowana mapa poziomicowa na <canvas data-topo>
│   ├── js/main.js             # rotator, liczniki, taśmy, trasa, radar, mapa po kliknięciu
│   └── js/demo-theme.js       # DEMO: przełącznik wariantów kolorystycznych (usunąć przed PROD)
├── data.md                    # brief klienta (pola ❓ do ustalenia)
├── TODO.md
└── dane/                      # materiały źródłowe od klienta (poza repo)
```

Podgląd lokalny:

```bash
python -m http.server 8761
```

## Animacje

- **Hero** (`topo.js`): teren z szumu simplex 3D, poziomice algorytmem marching squares. Odcinki są łączone w ciągłe linie i rysowane krzywymi, więc są gładkie także na dużych ekranach; co piąta linia grubsza. „Wzgórze” podąża za kursorem (na dotyku wędruje samo), HUD w prawym górnym rogu pokazuje umowne współrzędne okolic Świebodzina. Kolor linii z `--topo-rgb`. Warianty: `data-topo="hero"`, `"soft"` (podstrony), `"static"` (jedna klatka — pasek MRU, zaślepka mapy).
- Animacja pauzuje poza ekranem i na ukrytej karcie, maks. 24 kl./s, siatka ograniczona do ~13 tys. punktów (na dużych ekranach rosną komórki), DPR ograniczony do 1,75.
- **Trasa „Jak działamy”**: ścieżka SVG budowana w JS przez kropki etapów, rysuje się podczas przewijania.
- `prefers-reduced-motion: reduce` → statyczna klatka terenu, trasa narysowana w całości, bez taśm, rotatora i liczników.

## Warianty kolorystyczne (demo)

Wszystkie kolory są w zmiennych CSS (`:root` w `style.css`). Warianty: **Nocny teren** (domyślny, limonka), **Rajd** (pomarańcz), **Las** (bursztyn), **Neon** (róż/fiolet), **Dzień** (jasny) — bloki `:root[data-theme="…"]` na końcu `style.css`.

- Przełącznik „Kolorystyka” w lewym dolnym rogu (`assets/js/demo-theme.js`), wybór zapamiętuje się w przeglądarce.
- Link do konkretnego wariantu dla klienta: `?motyw=rajd` (`teren`, `rajd`, `las`, `neon`, `dzien`) — przycisk „Kopiuj link do tego wariantu”.
- Po wyborze klienta: przepisać wybrany zestaw do `:root`, usunąć pozostałe bloki `data-theme`, plik `demo-theme.js` z jego `<script>` na każdej stronie i fragment z `?motyw` w `<head>` (oznaczony komentarzem „DEMO”).

## Deploy

Repozytorium: https://github.com/commitpanic/adventurequad · DEV: https://commitpanic.github.io/adventurequad/

Push na `main` → GitHub Actions (`.github/workflows/pages.yml`) → GitHub Pages. Publikowane są pliki strony bez `dane/`, `.claude/`, `.github/` i `*.md`. W repo Pages ma źródło „GitHub Actions” (włączone).

PROD: do ustalenia. **Domena adventurequad.pl ma pocztę — przy zmianie DNS nie ruszać rekordów MX.** Stara strona ma dużo adresów `/oferta/...` → przekierowania 301 (lista w `TODO.md`).
