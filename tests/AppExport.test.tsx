// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';

const mocks = vi.hoisted(() => ({
  downloadFile: vi.fn(),
  getValue: vi.fn(),
  setValue: vi.fn(),
  deleteValue: vi.fn(),
}));

vi.mock('../src/lib/download', () => ({ downloadFile: mocks.downloadFile }));
vi.mock('../src/lib/storage', () => ({
  getValue: mocks.getValue,
  setValue: mocks.setValue,
  deleteValue: mocks.deleteValue,
}));

beforeEach(() => {
  mocks.downloadFile.mockReset();
  mocks.getValue.mockReset();
  mocks.setValue.mockReset();
  mocks.deleteValue.mockReset();
  mocks.getValue.mockResolvedValue(undefined);
  mocks.setValue.mockResolvedValue(undefined);
  mocks.deleteValue.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('vCard export', () => {
  it('disables export and explains why when the name is empty', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());

    const button = screen.getByRole('button', { name: 'Last ned som vCard' });
    expect(button).toHaveProperty('disabled', true);
    expect(screen.getByText('Fyll inn navn før du laster ned vCard-filen.')).toBeTruthy();
  });

  it('enables export when the name has content', async () => {
    mocks.getValue.mockResolvedValue({ fullName: 'Ola Nordmann' });
    render(<App />);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Last ned som vCard' })).toHaveProperty('disabled', false));
    expect(screen.queryByText('Fyll inn navn før du laster ned vCard-filen.')).toBeNull();
  });

  it('downloads a UTF-8 vCard with the expected filename and success status', async () => {
    mocks.getValue.mockResolvedValue({
      fullName: 'Åse Ødegård',
      phone: '+47 900 00 000',
      organization: 'Ousdal IT',
    });
    render(<App />);
    const button = await screen.findByRole('button', { name: 'Last ned som vCard' });
    await waitFor(() => expect(button).toHaveProperty('disabled', false));

    fireEvent.click(button);

    expect(mocks.downloadFile).toHaveBeenCalledOnce();
    const [content, filename, mimeType] = mocks.downloadFile.mock.calls[0];
    expect(content).toContain('BEGIN:VCARD\r\nVERSION:4.0\r\n');
    expect(content).toContain('FN:Åse Ødegård\r\n');
    expect(content).toContain('ORG:Ousdal IT\r\n');
    expect(content).toContain('TEL:+47 900 00 000\r\n');
    expect(content).toMatch(/END:VCARD\r\n$/);
    expect(filename).toBe('ase-odegard.vcf');
    expect(mimeType).toBe('text/vcard;charset=utf-8');
    expect(screen.getByText('vCard-filen er lastet ned.')).toBeTruthy();
  });

  it('shows an export error when downloading fails', async () => {
    mocks.getValue.mockResolvedValue({ fullName: 'Ola Nordmann' });
    mocks.downloadFile.mockImplementation(() => {
      throw new Error('download failed');
    });
    render(<App />);
    const button = await screen.findByRole('button', { name: 'Last ned som vCard' });
    await waitFor(() => expect(button).toHaveProperty('disabled', false));

    fireEvent.click(button);

    expect(screen.getByText('Kunne ikke lage vCard-filen.')).toBeTruthy();
    expect(screen.getByRole('status').classList.contains('storage-status--error')).toBe(true);
  });

  it('does not hide an active storage error after export', async () => {
    mocks.getValue.mockResolvedValue({ fullName: 'Ola Nordmann' });
    mocks.setValue.mockRejectedValue(new Error('storage failed'));
    render(<App />);
    await waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());
    fireEvent.input(screen.getByLabelText('Stilling eller rolle'), { target: { value: 'Utvikler' } });
    await waitFor(() => expect(screen.getByText('Kunne ikke lagre endringene')).toBeTruthy(), { timeout: 2000 });

    fireEvent.click(screen.getByRole('button', { name: 'Last ned som vCard' }));

    expect(mocks.downloadFile).toHaveBeenCalledOnce();
    expect(screen.getByText('Kunne ikke lagre endringene')).toBeTruthy();
  });
});
