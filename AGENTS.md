# AGENTS.md

## Formål

Dette repositoryet er Visittkort-appen.

Appens scope er:

- digitalt visittkort
- lokal lagring
- vCard
- QR-kode
- utskrift
- enkel deling

Ikke utvid scope til:

- CRM
- kontaktregister
- skybasert synkronisering
- brukerkontoer
- backend
- markedsføringsplattform
- analyse eller sporing

Endringer skal bevare appen som enkel, lokal-først og tilgjengelig, uten backend, innlogging eller unødvendige avhengigheter.

## Teknologistack

Bruk eksisterende stack:

- Preact
- TypeScript
- Vite
- Vitest
- IndexedDB
- vanlig CSS
- GitHub Actions
- GitHub Pages

Ikke innfør uten eksplisitt beskjed: React, Next.js, Tailwind, Redux, Dexie, Workbox, Storybook, Playwright, Cypress, backend, skybasert lagring eller analyse- og sporingsverktøy.

## Scope

Hold funksjonaliteten innenfor Visittkort-scope. Ikke legg til tilgrensende produktfunksjoner uten eksplisitt beskjed.

## Enkelhet

Foretrekk:

- få filer og små moduler
- tydelige navn og direkte kode
- eksisterende hjelpefunksjoner
- standard nettleser-API-er

Unngå abstraksjoner for hypotetiske behov, store komponenthierarkier, plassholdermapper, duplisert funksjonalitet, premature optimaliseringer og unødvendige avhengigheter.

Velg den enkleste løsningen som er robust og lett å forstå.

## Dokumentasjon

Repositoryet skal normalt bare ha README.md, CHANGELOG.md, LICENSE og AGENTS.md.

Opprett ikke uten eksplisitt beskjed: `docs/`, ROADMAP.md, CONTRIBUTING.md, DEPLOYMENT.md, ARCHITECTURE.md eller egne design- og spesifikasjonsdokumenter.

Legg kort nødvendig informasjon i README. Oppdater CHANGELOG ved brukerrettede eller merkbare tekniske endringer.

## Merkevare

Bevar den faste Ousdal IT-profilen og disse ressursene:

- `public/brand/ousdal-it-logo.png`
- `public/brand/ousdal-it-mark.png`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/favicon.png`

Ikke tegn logoen på nytt, bruk en generisk erstatning, endre proporsjoner eller legg på filtre og effekter. Ikke bruk full logo når ordmerke og slagord blir uleselige.

Bruk kompakt symbol i header og PWA-ikoner.

Footer skal som standard vise «Ousdal IT – Lokal IT. Digital trygghet.» og den diskrete lenken «Støtt utviklingen» til `https://ko-fi.com/ousdalit`.

Ko-fi-lenken skal bruke `target="_blank"` og `rel="noopener noreferrer"`. Ikke legg inn popup, banner, iframe, tredjepartsskript eller sporing.

## Design og tilgjengelighet

Bevar omtrent 18 px grunntekst, store klikkflater, minst omtrent 52 px høyde på viktige kontroller, én tydelig hovedkolonne, god luft, høy kontrast, tydelig `focus-visible`, tastaturtilgjengelighet, responsiv layout og norsk standardgrensesnitt.

Ikke bruk små ikonknapper uten forståelig tekst. Ikke bruk farge alene for å kommunisere betydning.

Bruk korrekte etiketter, alt-tekster og aria-attributter når det er nødvendig.

## Lagring

Bruk eksisterende IndexedDB-hjelper for lokal lagring. Ikke innfør nye lagringsbiblioteker uten behov.

Lagring skal være lokal-først, håndtere feil eksplisitt, ikke kreve konto og ikke sende brukerdata til eksterne tjenester.

## PWA

Bevar støtte for installasjon, offline-bruk, GitHub Pages-underområder, dynamisk base path og opprydding av gamle cacher.

Service worker skal ikke cache ikke-GET-forespørsler, eksterne origins eller feilresponser, og skal ikke hardkode et konkret repository-navn.

## Tester

Bruk Vitest og eksisterende testoppsett. Legg til eller oppdater tester når funksjonalitet endres.

Foretrekk små tester for generell logikk, lagring, validering, komponentkontrakter, manifest og statiske ressursreferanser.

Ikke innfør tung ende-til-ende-testing uten eksplisitt behov.

## Avhengigheter

Ikke legg til en avhengighet dersom oppgaven kan løses enkelt og robust med eksisterende kode eller nettleser-API-er.

Ved ny avhengighet:

- begrunn behovet
- velg en liten og vedlikeholdt pakke
- oppdater package-lock.json
- kontroller lisens og bundle-konsekvens
- rapporter avhengigheten i leveransen

## Repository-hygiene

Ikke commit `node_modules/`, `dist/`, `coverage/`, `*.tsbuildinfo`, `vite.config.js`, `vite.config.d.ts`, lokale miljøfiler eller editor- og OS-filer.

Ikke opprett tomme mapper eller unødvendige `.gitkeep`-filer. Bevar package-lock.json.

## Verifisering

Før en leveranse skal minst følgende kjøres når miljøet tillater det:

```sh
npm ci
npm test
npm run build
npm run build:pages
npm run check
git diff --check
```

Dersom en kontroll ikke kan kjøres, rapporter nøyaktig hvorfor. Ikke hev at en kontroll er bestått dersom den ikke faktisk er kjørt.

## Leveranse

Sluttrapporten skal kort oppsummere:

1. Endrede filer
2. Funksjonelle endringer
3. Tester og resultater
4. Build- og kontrollresultater
5. Nye avhengigheter
6. Kjente begrensninger

Ikke stopp for spørsmål når oppgaven er tydelig og kan løses trygt. Ikke utvid scope uten grunn.
