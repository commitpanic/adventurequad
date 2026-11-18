# TODO

## Do rozmowy z klientem
- [ ] Zmiana profilu: jakie eventy są teraz główne, czego **nie** pokazywać (np. broń ostra, wrak race, obozy, wieczory kawalerskie)
- [ ] Liczby w hero: „10+ lat”, „20+ atrakcji”, „4 województwa” — potwierdzić albo podać lepsze (np. eventów rocznie, największa impreza)
- [ ] Czy podział na 3 numery telefonów (pikniki / quady-paintball / MRU) jest aktualny; ogólny adres e-mail?
- [ ] Pełna nazwa firmy, właściciel, NIP/REGON → polityka prywatności, stopka, JSON-LD
- [ ] Zdjęcia z eventów w pełnej rozdzielczości + zgody na wizerunek (stara strona ma max 600 px)
- [ ] Logo: zostaje stare (wektor?) czy odświeżamy — na demo znak tekstowy + sygnet z poziomic
- [ ] Ocena „4.9/5, 764 oceny” ze starej strony — skąd? (Google → można linkować do opinii)
- [ ] Opinie / referencje firm (logotypy klientów za zgodą) — mocny element dla B2B
- [ ] Wybór wariantu kolorystycznego (linki `?motyw=teren|rajd|las|neon|dzien`) → potem sprzątanie demo (README)
- [ ] Akceptacja tekstów (oparte na starej stronie, przepisane pod agencję eventową)
- [ ] Wycena i zakres opieki — pierwsze zlecenie zarobkowe

## Treści / funkcje do dołożenia
- [ ] Galeria / realizacje (po zdjęciach) — np. sekcja „Z naszych eventów” na głównej
- [ ] Obraz OG 1200×630 (`og:image`) + `og:url` + `canonical`
- [ ] `sitemap.xml` + wpis w `robots.txt` po ustaleniu domeny
- [ ] Ewentualnie podstrony SEO pod frazy (np. „pikniki firmowe Poznań”) — stara strona jest pozycjonowana
- [ ] Analityka bez cookies (Plausible/Umami), jeśli klient chce statystyki

## Technika
- [x] Repozytorium `commitpanic/adventurequads` + workflow GitHub Pages
- [ ] Włączyć Pages (Settings → Pages → GitHub Actions) po pierwszym pushu
- [x] Bez formularza i konfiguratora — kontakt tylko dane kontaktowe (uzgodnione z klientem)
- [ ] Przed PROD: usunąć `assets/js/demo-theme.js`, jego `<script>` i fragment `?motyw` w `<head>`
- [ ] Lighthouse na DEV (Performance / Accessibility / SEO ≥ 90)
- [ ] Test na iOS Safari (canvas, `backdrop-filter`, `100svh`)
- [ ] Przekierowania 301 przy PROD (stare adresy → nowe):
  - `/oferta/imprezy-integracyjne/` → `/oferta.html#integracje`
  - `/oferta/pikniki-firmowe/` → `/oferta.html#pikniki-firmowe`
  - `/oferta/festyny/` → `/oferta.html#festyny`
  - `/oferta/piknik-dla-dzieci/` → `/oferta.html#dla-dzieci`
  - `/oferta/team-building/` → `/oferta.html#team-building`
  - `/oferta/bunkry-mru/` → `/oferta.html#bunkry-mru`
  - `/oferta/*` (atrakcje) → `/oferta.html#atrakcje`
  - `/agencja-eventowa/` → `/`, `/kontakt/` → `/#kontakt`, `/aktualnosci/*`, `/multimedia/` → `/`
  - (GitHub Pages nie robi 301 — przy PROD rozważyć hosting z `.htaccess` albo stronę-przekierowanie)
