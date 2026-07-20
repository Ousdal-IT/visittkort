# Ousdal IT-verktøy

Minimal standardmal for små Ousdal IT-verktøy, bygget med Preact, TypeScript og Vite. Malen inkluderer PWA-støtte, GitHub Pages, tester og små hjelpere for IndexedDB, validering og filnedlasting.

Arbeidsregler for Codex og andre kodeagenter finnes i `AGENTS.md`.

## Profilering

Alle apper basert på malen bruker som standard Ousdal IT-farger, den kompakte fjell-/elvemerkevarianten, merkevarelinjen «Ousdal IT – Lokal IT. Digital trygghet.» og en diskret Ko-fi-lenke i footeren. `AppHeader` og `AppFooter` kan gjenbrukes direkte; appnavnet sendes til headeren som en prop. Den komplette logoen ligger i `public/brand/` for flater der ordmerke og slagord kan vises lesbart.

## Utvikling

Krev Node.js 20 eller nyere.

```sh
npm ci
npm run dev
```

Bygg med `npm run build`, kjør tester med `npm test`, og kontroller repositorystrukturen med `npm run check`.

## GitHub Pages

Workflowen `pages.yml` bygger og publiserer automatisk fra `main`. Aktiver **GitHub Actions** som Pages-kilde under repositoryets innstillinger. `npm run build:pages` lager lokalt samme relative build som workflowen bruker.

## Bruk som Template Repository

Aktiver **Template repository** under repositoryets innstillinger. Velg deretter **Use this template** for å opprette et nytt verktøy. Oppdater appnavn, versjon, tekster, manifest og cache-navnet i `public/sw.js` før publisering, men behold standardprofileringen.
