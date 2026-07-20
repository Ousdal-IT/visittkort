// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App, BUSINESS_CARD_STORAGE_KEY, SAVE_DEBOUNCE_MS } from '../src/App';
import { EMPTY_BUSINESS_CARD } from '../src/types/businessCard';

const storageMocks = vi.hoisted(() => ({
  getValue: vi.fn(),
  setValue: vi.fn(),
  deleteValue: vi.fn(),
}));

vi.mock('../src/lib/storage', () => storageMocks);

beforeEach(() => {
  storageMocks.getValue.mockResolvedValue(undefined);
  storageMocks.setValue.mockResolvedValue(undefined);
  storageMocks.deleteValue.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('App storage', () => {
  it('restores valid stored data at startup', async () => {
    storageMocks.getValue.mockResolvedValue({ fullName: 'Lagret Navn', extra: 'ignored' });
    render(<App />);

    expect(screen.getByText('Laster inn …')).toBeTruthy();
    await waitFor(() => expect(screen.getByLabelText('Navn')).toHaveProperty('value', 'Lagret Navn'));
    expect(screen.getByText('Lagret lokalt')).toBeTruthy();
  });

  it('handles missing stored data', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());
    expect(screen.getByLabelText('Navn')).toHaveProperty('value', '');
  });

  it('updates immediately and saves only the latest rapid change after debounce', async () => {
    vi.useFakeTimers();
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());

    const nameInput = screen.getByLabelText('Navn');
    fireEvent.input(nameInput, { target: { value: 'K' } });
    fireEvent.input(nameInput, { target: { value: 'Ka' } });
    fireEvent.input(nameInput, { target: { value: 'Kari' } });

    expect(screen.getByRole('heading', { level: 3, name: 'Kari' })).toBeTruthy();
    expect(screen.getByText('Endringer lagres …')).toBeTruthy();
    expect(storageMocks.setValue).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    await vi.waitFor(() => expect(storageMocks.setValue).toHaveBeenCalledTimes(1));
    expect(storageMocks.setValue).toHaveBeenCalledWith(
      BUSINESS_CARD_STORAGE_KEY,
      { ...EMPTY_BUSINESS_CARD, fullName: 'Kari' },
    );
  });

  it('shows a textual error when automatic saving fails', async () => {
    vi.useFakeTimers();
    storageMocks.setValue.mockRejectedValue(new Error('storage failed'));
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());

    fireEvent.input(screen.getByLabelText('Navn'), { target: { value: 'Kari' } });
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    await vi.waitFor(() => expect(screen.getByText('Kunne ikke lagre endringene')).toBeTruthy());
    expect(screen.getByRole('status').classList.contains('storage-status--error')).toBe(true);
  });

  it('keeps data when reset confirmation is cancelled', async () => {
    storageMocks.getValue.mockResolvedValue({ fullName: 'Behold meg' });
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText('Navn')).toHaveProperty('value', 'Behold meg'));

    fireEvent.click(screen.getByRole('button', { name: 'Nullstill visittkortet' }));

    expect(screen.getByLabelText('Navn')).toHaveProperty('value', 'Behold meg');
    expect(storageMocks.deleteValue).not.toHaveBeenCalled();
  });

  it('deletes stored data and clears the card after confirmed reset', async () => {
    storageMocks.getValue.mockResolvedValue({ fullName: 'Slett meg' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText('Navn')).toHaveProperty('value', 'Slett meg'));

    fireEvent.click(screen.getByRole('button', { name: 'Nullstill visittkortet' }));

    await waitFor(() => expect(storageMocks.deleteValue).toHaveBeenCalledWith(BUSINESS_CARD_STORAGE_KEY));
    expect(screen.getByLabelText('Navn')).toHaveProperty('value', '');
    expect(screen.getByText('Fyll ut feltene for å lage visittkortet ditt.')).toBeTruthy();
    expect(screen.getByText('Visittkortet er nullstilt')).toBeTruthy();
  });

  it('waits for an in-flight save before deleting during reset', async () => {
    vi.useFakeTimers();
    let finishSave: () => void = () => undefined;
    storageMocks.setValue.mockImplementation(() => new Promise<void>((resolve) => {
      finishSave = resolve;
    }));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    await vi.waitFor(() => expect(screen.getByText('Lagret lokalt')).toBeTruthy());

    fireEvent.input(screen.getByLabelText('Navn'), { target: { value: 'Pågående lagring' } });
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    fireEvent.click(screen.getByRole('button', { name: 'Nullstill visittkortet' }));

    expect(storageMocks.deleteValue).not.toHaveBeenCalled();
    finishSave();
    await vi.waitFor(() => expect(storageMocks.deleteValue).toHaveBeenCalledWith(BUSINESS_CARD_STORAGE_KEY));
    expect(screen.getByText('Visittkortet er nullstilt')).toBeTruthy();
  });
});
