import { renderSVG } from 'uqr';
import { createVCardFilename } from './vcard';

export const QR_CODE_DEBOUNCE_MS = 350;

export class QrCodeCapacityError extends Error {
  constructor() {
    super('QR code data exceeds the available capacity.');
    this.name = 'QrCodeCapacityError';
  }
}

export function createQrCodeSvg(content: string): string {
  try {
    return renderSVG(content, {
      ecc: 'M',
      boostEcc: false,
      border: 4,
      pixelSize: 1,
      blackColor: '#000000',
      whiteColor: '#ffffff',
    });
  } catch (error) {
    if (error instanceof Error && /data too long/i.test(error.message)) {
      throw new QrCodeCapacityError();
    }
    throw error;
  }
}

export function createQrCodeFilename(fullName: string): string {
  return createVCardFilename(fullName).replace(/\.vcf$/, '-qr.svg');
}
