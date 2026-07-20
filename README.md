# Visittkort

Visittkort er en lokal-først PWA for å lage og dele digitale visittkort.

Planlagte hovedfunksjoner:

- kontaktinformasjon
- direkte forhåndsvisning
- lokal lagring
- vCard
- QR-kode
- utskrift

Funksjonene implementeres trinnvis. Første versjon er foreløpig bare prosjektgrunnlaget, uten visittkortfunksjonalitet.

## Utvikling

Krever Node.js 20 eller nyere.

```sh
npm ci
npm run dev
```

## Tester

```sh
npm test
npm run check
```

## Bygg

```sh
npm run build
```

## GitHub Pages

Workflowen `pages.yml` bygger og publiserer automatisk fra `main`. GitHub Pages må bruke GitHub Actions som kilde. Lokal Pages-build:

```sh
npm run build:pages
```

Publiseringsadressen er <https://ousdal-it.github.io/visittkort/>.

## Lisens

Se [LICENSE](LICENSE).
