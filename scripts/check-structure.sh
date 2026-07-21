#!/usr/bin/env bash
set -euo pipefail

required=(
  AGENTS.md
  .github/workflows/ci.yml
  .github/workflows/pages.yml
  .github/workflows/release.yml
  public/manifest.webmanifest
  public/sw.js
  public/brand/ousdal-it-logo.png
  public/brand/ousdal-it-mark.png
  public/favicon.png
  public/icons/icon-192.png
  public/icons/icon-512.png
  scripts/check-structure.sh
  src/App.tsx
  src/components/AppFooter.tsx
  src/components/AppHeader.tsx
  src/components/BusinessCardForm.tsx
  src/components/BusinessCardPreview.tsx
  src/components/BusinessCardQrCode.tsx
  src/lib/download.ts
  src/lib/qrcode.ts
  src/lib/storage.ts
  src/lib/url.ts
  src/lib/validation.ts
  src/lib/vcard.ts
  src/types/businessCard.ts
  tests/download.test.ts
  tests/App.test.tsx
  tests/AppFooter.test.tsx
  tests/AppHeader.test.tsx
  tests/AppExport.test.tsx
  tests/AppQrStatus.test.tsx
  tests/AppStorage.test.tsx
  tests/BusinessCardForm.test.tsx
  tests/BusinessCardPreview.test.tsx
  tests/BusinessCardQrCode.test.tsx
  tests/businessCard.test.ts
  tests/manifest.test.ts
  tests/package.test.ts
  tests/qrcode.test.ts
  tests/storage.test.ts
  tests/url.test.ts
  tests/validation.test.ts
  tests/vcard.test.ts
  README.md
  CHANGELOG.md
  LICENSE
  package.json
  vite.config.ts
  index.html
)

for path in "${required[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "Mangler obligatorisk fil: $path" >&2
    exit 1
  fi
done

for path in docs ROADMAP.md DEPLOYMENT.md CONTRIBUTING.md vite.config.js vite.config.d.ts public/icon.svg public/brand/ousdal-it-logo.svg; do
  if [[ -e "$path" ]]; then
    echo "Uønsket fil eller mappe finnes: $path" >&2
    exit 1
  fi
done

if find . -type f -name '*.tsbuildinfo' -not -path './node_modules/*' -print -quit | grep -q .; then
  echo 'Uønsket *.tsbuildinfo-fil finnes.' >&2
  exit 1
fi

echo 'Strukturkontroll OK.'
