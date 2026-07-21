import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createQrCodeFilename, createQrCodeSvg, QrCodeCapacityError } from '../src/lib/qrcode';

const renderSvgMock = vi.hoisted(() => vi.fn());

vi.mock('uqr', () => ({ renderSVG: renderSvgMock }));

beforeEach(() => {
  renderSvgMock.mockReset();
  renderSvgMock.mockReturnValue('<svg xmlns="http://www.w3.org/2000/svg" />');
});

describe('createQrCodeSvg', () => {
  it('renders locally with error correction level M and a four-module border', () => {
    const content = 'BEGIN:VCARD\r\nVERSION:4.0\r\nEND:VCARD\r\n';

    expect(createQrCodeSvg(content)).toContain('<svg');
    expect(renderSvgMock).toHaveBeenCalledWith(content, {
      ecc: 'M',
      boostEcc: false,
      border: 4,
      pixelSize: 1,
      blackColor: '#000000',
      whiteColor: '#ffffff',
    });
  });

  it('classifies capacity errors without hiding other generator errors', () => {
    renderSvgMock.mockImplementationOnce(() => {
      throw new Error('Data too long');
    });
    expect(() => createQrCodeSvg('too much data')).toThrow(QrCodeCapacityError);

    renderSvgMock.mockImplementationOnce(() => {
      throw new Error('Unexpected failure');
    });
    expect(() => createQrCodeSvg('data')).toThrow('Unexpected failure');
  });
});

describe('createQrCodeFilename', () => {
  it('reuses the safe vCard filename base', () => {
    expect(createQrCodeFilename('Åse Ødegård')).toBe('ase-odegard-qr.svg');
    expect(createQrCodeFilename('***')).toBe('visittkort-qr.svg');
  });
});
