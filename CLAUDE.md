# Adventure Quad — kontekst projektu

Wspólny standard KubaBuba: `D:\DEV\KUBABUBA_WORK\CLAUDE.md`. Tu tylko to, co specyficzne dla klienta.

## Klient
- **Adventure Quad** — Świebodzin (biuro handlowe: Kupienino 14, 66-200 Świebodzin), NIP 9271461746. Kontakt: Norbert Bałenkowski, norbert@adventurequad.pl.
- Trzy numery wg tematu: 603 805 651 (pikniki firmowe, duże eventy — główny na stronie), 515 602 802 (quady, paintball), 513 221 622 (imprezy scenariuszowe, Bunkry MRU).
- Stara strona: https://www.adventurequad.pl/ (CMS Avangardo, dużo podstron SEO `/oferta/...`).
- **Zmiana profilu:** z wypożyczania/organizacji atrakcji → **agencja eventowa** (integracje, pikniki firmowe, festyny, wyjazdy, team building). Atrakcje pokazujemy jako „klocki” programu.
- Zawód nieregulowany — można pisać sprzedażowo, ale tylko fakty ze starej strony albo potwierdzone przez klienta (liczby w hero oznaczone w `data.md` jako ❓).
- To pierwszy klient zarobkowy KubaBuba — na razie **strona demonstracyjna do wyceny**.
- Repozytorium: **commitpanic/adventurequad** (publiczne, `main`); deploy przez Actions bez `*.md` i `dane/`.

## Decyzje
- **Strona wizytówka: bez formularza i bez konfiguratora** (uzgodnione z klientem) — sekcja Kontakt to tylko telefony, e-mail, adres, mapa po kliknięciu.
- Kolory wyłącznie przez zmienne CSS. Domyślnie „Nocny teren” (ciemny + limonka #c4f135 ze starego logo), sekcje „piaskowe” dla rytmu. Na demo 5 wariantów `:root[data-theme]` (teren, rajd, las, neon, dzien) + przełącznik `assets/js/demo-theme.js` i linki `?motyw=` — po wyborze klienta zostawić jeden zestaw w `:root` i usunąć demo. Fonty systemowe.
- Hero: canvas z animowaną mapą poziomicową (`assets/js/topo.js`, szum simplex + marching squares, odcinki łączone w linie i rysowane krzywymi — gładko na dużych ekranach), „wzgórze” podąża za kursorem; na dotyku wędruje samo. `prefers-reduced-motion` → jedna statyczna klatka; pauza poza ekranem.
- Proces „Jak działamy” jako trasa rysowana podczas przewijania (SVG generowany w JS przez punkty kontrolne).
- Zasięg: schematyczna mapa „radar” z miastami w realnych proporcjach odległości od Świebodzina (rzut z lat/lon).
- Brak zdjęć na demo (stara strona ma max 600 px) — do decyzji, czy pobierać; docelowo oryginały od klienta.
- Logo: znak tekstowy ADVENTURE + plakietka QUAD + sygnet z poziomic (`favicon.svg`).

## Otwarte kwestie
Patrz `TODO.md` i pola ❓ w `data.md`.
