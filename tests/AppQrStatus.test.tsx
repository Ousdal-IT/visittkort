// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { QR_CODE_DEBOUNCE_MS, QrCodeCapacityError } from '../src/lib/qrcode';

const mocks = vi.hoisted(() => ({
  createQrCodeSvg: vi.fn(),
  createQrCodeFilename: vi.fn(),
  downloadFile: vi.fn(),
  getValue: vi.fn(),
  setValue: vi.fn(),
  deleteValue: vi.fn(),
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
vi.mock('../src/lib/storage', () => ({
  getValue: mocks.getValue,
  setValue: mocks.setValue,
  deleteValue: mocks.deleteValue,
}));

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M0 0h1v1z"/></svg>';

beforeEach(() => {
  vi.useFakeTimers();
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.getValue.mockResolvedValue({ fullName: 'Ola Nordmann' });
  mocks.setValue.mockResolvedValue(undefined);
  mocks.deleteValue.mockResolvedValue(undefined);
  mocks.createQrCodeSvg.mockReturnValue(svg);
  mocks.createQrCodeFilename.mockReturnValue('ola-nordmann-qr.svg');
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('QR status integration', () => {
  it('shows the capacity message and leaves vCard export available', async () => {
    mocks.createQrCodeSvg.mockImplementation(() => {
      throw new QrCodeCapacityError();
    });
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    expect(screen.getByText(
      'Visittkortet inneholder for mye tekst til å lage en QR-kode. Kort ned adresse eller slagord.',
    )).toBeTruthy();
    expect(screen.getByRole('status').classList.contains('storage-status--error')).toBe(true);
    expect(screen.queryByRole('img', { name: /QR-kode med kontaktinformasjon/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Last ned som vCard' }));
    expect(mocks.downloadFile).toHaveBeenCalled();
  });

  it('shows the general QR generation error', async () => {
    mocks.createQrCodeSvg.mockImplementation(() => {
      throw new Error('failed');
    });
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);

    expect(screen.getByText('Kunne ikke lage QR-koden.')).toBeTruthy();
    expect(screen.getByRole('status').classList.contains('storage-status--error')).toBe(true);
  });

  it('shows download success and failure without affecting the QR image', async () => {
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());
    await vi.advanceTimersByTimeAsync(QR_CODE_DEBOUNCE_MS);
    const button = screen.getByRole('button', { name: 'Last ned QR-kode' });

    fireEvent.click(button);
    expect(screen.getByText('QR-koden er lastet ned.')).toBeTruthy();

    mocks.downloadFile.mockImplementation(() => {
      throw new Error('download failed');
    });
    fireEvent.click(button);
    expect(screen.getByText('Kunne ikke lage QR-koden.')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'QR-kode med kontaktinformasjon for Ola Nordmann' })).toBeTruthy();
  });
});
