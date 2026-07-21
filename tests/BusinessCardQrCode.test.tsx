// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessCardQrCode } from '../src/components/BusinessCardQrCode';
import { QR_CODE_DEBOUNCE_MS, QrCodeCapacityError } from '../src/lib/qrcode';
import { createVCard } from '../src/lib/vcard';
import { EMPTY_BUSINESS_CARD } from '../src/types/businessCard';

const mocks = vi.hoisted(() => ({
  createQrCodeSvg: vi.fn(),
  createQrCodeFilename: vi.fn(),
  downloadFile: vi.fn(),
}));

vi.mock('../src/lib/qrcode', async (importOriginal) => {
  const original = await importOriginal<typeof import('../src/lib/qrcode')>();
  return {
    ...original,
    createQrCodeSvg: mocks.createQrCodeSvg,
    createQrCodeFilename: mocks.createQrCodeFilename,
  };
});
vi.mock('../src/lib/download', () => ({ downloadFile: mocks.downloadFile }));

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M0 0h1v1z"/></svg>';

beforeEach(() => {
  vi.useFakeTimers();
  mocks.createQrCodeSvg.mockReset();
  mocks.createQrCodeFilename.mockReset();
  mocks.downloadFile.mockReset();
  mocks.createQrCodeSvg.mockReturnValue(svg);
  mocks.createQrCodeFilename.mockReturnValue('ola-nordmann-qr.svg');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('BusinessCardQrCode', () => {
  it('shows the empty state and disables download without a name', () => {
    render(<BusinessCardQrCode data={EMPTY_BUSINESS_CARD} onStatus={() => undefined} />);

    expect(screen.getByRole('heading', { level: 2, name: 'QR-kode' })).toBeTruthy();
    expect(screen.getByText('Fyll inn navn for å lage QR-koden.')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('button', { name: 'Last ned QR-kode' })).toHaveProperty('disabled', true);
    expect(mocks.createQrCodeSvg).not.toHaveBeenCalled();
  });

  it('generates from the exact vCard after debounce and exposes an accessible name', async () => {
    const data = { ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann', address: 'Linje 1\nLinje 2' };
    render(<BusinessCardQrCode data={data} onStatus={() => undefined} />);

    expect(mocks.createQrCodeSvg).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    const expectedVCard = createVCard(data);
    expect(mocks.createQrCodeSvg).toHaveBeenCalledWith(expectedVCard);
    expect(mocks.createQrCodeSvg.mock.calls[0][0]).toContain('\r\n');
    expect(screen.getByRole('img', { name: 'QR-kode med kontaktinformasjon for Ola Nordmann' })).toBeTruthy();
    expect(screen.getByText(/QR-koden inneholder opplysningene som vises i visittkortet/)).toBeTruthy();
  });

  it('cancels stale generation and uses the newest card data', async () => {
    const first = { ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann' };
    const second = { ...first, phone: '+47 900 00 000' };
    const view = render(<BusinessCardQrCode data={first} onStatus={() => undefined} />);
    view.rerender(<BusinessCardQrCode data={second} onStatus={() => undefined} />);

    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    expect(mocks.createQrCodeSvg).toHaveBeenCalledOnce();
    expect(mocks.createQrCodeSvg).toHaveBeenCalledWith(createVCard(second));
  });

  it('reports capacity and general generator errors without rendering a QR code', async () => {
    const onStatus = vi.fn();
    const data = { ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann' };
    mocks.createQrCodeSvg.mockImplementationOnce(() => {
      throw new QrCodeCapacityError();
    });
    const view = render(<BusinessCardQrCode data={data} onStatus={onStatus} />);
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);
    expect(onStatus).toHaveBeenLastCalledWith('qr-too-large');
    expect(screen.queryByRole('img')).toBeNull();

    mocks.createQrCodeSvg.mockImplementationOnce(() => {
      throw new Error('failed');
    });
    view.rerender(<BusinessCardQrCode data={{ ...data, tagline: 'Ny tekst' }} onStatus={onStatus} />);
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);
    expect(onStatus).toHaveBeenLastCalledWith('qr-error');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('downloads a self-contained SVG with the safe filename and MIME type', async () => {
    const onStatus = vi.fn();
    const data = { ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann' };
    render(<BusinessCardQrCode data={data} onStatus={onStatus} />);
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Last ned QR-kode' }));

    expect(mocks.downloadFile).toHaveBeenCalledWith(svg, 'ola-nordmann-qr.svg', 'image/svg+xml;charset=utf-8');
    expect(onStatus).toHaveBeenLastCalledWith('qr-downloaded');
  });

  it('reports a download error and keeps the QR code available', async () => {
    const onStatus = vi.fn();
    mocks.downloadFile.mockImplementation(() => {
      throw new Error('download failed');
    });
    render(<BusinessCardQrCode
      data={{ ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann' }}
      onStatus={onStatus}
    />);
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Last ned QR-kode' }));

    expect(onStatus).toHaveBeenLastCalledWith('qr-error');
    expect(screen.getByRole('img')).toBeTruthy();
  });
});
