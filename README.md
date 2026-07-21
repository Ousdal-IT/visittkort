# Visittkort

Visittkort er en lokal-først PWA for å lage digitale visittkort.

Appen støtter:

- ett visittkort
- direkte forhåndsvisning
- automatisk lokal lagring
- trygg nullstilling
- eksport som vCard 4.0
- QR-kode fra de samme vCard-dataene
- lokal nedlasting av QR-koden som SVG

Planlagte funksjoner:

- utskrift
- deling

Opplysningene lagres bare lokalt i nettleseren. Funksjonene implementeres trinnvis.

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
