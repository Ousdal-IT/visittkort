// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadFile } from '../src/lib/download';

describe('downloadFile', () => {
  beforeEach(() => {
    Object.defineProperties(URL, {
      createObjectURL: { configurable: true, value: () => '' },
      revokeObjectURL: { configurable: true, value: () => undefined },
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates, clicks and removes a download link', () => {
    const url = 'blob:test';
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue(url);
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    downloadFile('innhold', 'eksempel.txt', 'text/plain');

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith(url);
    expect(document.querySelector('a[download="eksempel.txt"]')).toBeNull();
  });

  it('uses an existing Blob directly', () => {
    const blob = new Blob(['{}'], { type: 'application/json' });
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:json');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    downloadFile(blob, 'data.json');
    expect(createObjectURL).toHaveBeenCalledWith(blob);
  });
});
