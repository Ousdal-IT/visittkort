import { useEffect, useRef, useState } from 'preact/hooks';
import { downloadFile } from '../lib/download';
import {
  createQrCodeFilename,
  createQrCodeSvg,
  QR_CODE_DEBOUNCE_MS,
  QrCodeCapacityError,
} from '../lib/qrcode';
import { createVCard } from '../lib/vcard';
import type { BusinessCardData } from '../types/businessCard';

export type QrCodeStatus = 'qr-downloaded' | 'qr-error' | 'qr-too-large';

interface BusinessCardQrCodeProps {
  data: BusinessCardData;
  onStatus: (status: QrCodeStatus | undefined) => void;
}

export function BusinessCardQrCode({ data, onStatus }: BusinessCardQrCodeProps) {
  const [svg, setSvg] = useState<string>();
  const hasName = data.fullName.trim().length > 0;
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  useEffect(() => {
    setSvg(undefined);
    if (!hasName) return;

    const timer = window.setTimeout(() => {
      try {
        setSvg(createQrCodeSvg(createVCard(data)));
      } catch (error) {
        onStatusRef.current(error instanceof QrCodeCapacityError ? 'qr-too-large' : 'qr-error');
      }
    }, QR_CODE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [data, hasName]);

  const downloadQrCode = () => {
    if (!svg) return;

    try {
      downloadFile(svg, createQrCodeFilename(data.fullName), 'image/svg+xml;charset=utf-8');
      onStatus('qr-downloaded');
    } catch {
      onStatus('qr-error');
    }
  };

  return (
    <section class="qr-section" aria-labelledby="qr-title">
      <h2 id="qr-title">QR-kode</h2>
      <p>Skann koden for å legge visittkortet til som kontakt.</p>
      {!hasName && <p id="qr-help" class="qr-help">Fyll inn navn for å lage QR-koden.</p>}
      {svg && (
        <div
          class="qr-code"
          role="img"
          aria-label={`QR-kode med kontaktinformasjon for ${data.fullName.trim()}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      <button
        class="download-qr-button"
        type="button"
        disabled={!svg}
        aria-describedby={!hasName ? 'qr-help' : undefined}
        onClick={downloadQrCode}
      >
        Last ned QR-kode
      </button>
      <p class="qr-privacy">
        QR-koden inneholder opplysningene som vises i visittkortet. Del den bare med personer du ønsker å gi kontaktinformasjonen til.
      </p>
    </section>
  );
}
