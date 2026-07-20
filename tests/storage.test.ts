import { beforeEach, describe, expect, it } from 'vitest';
import { clearStorage, deleteValue, getValue, setValue } from '../src/lib/storage';

describe('IndexedDB storage', () => {
  beforeEach(() => clearStorage());

  it('stores and retrieves values', async () => {
    await setValue('settings', { theme: 'green' });
    await expect(getValue('settings')).resolves.toEqual({ theme: 'green' });
  });

  it('deletes a value', async () => {
    await setValue('temporary', 'value');
    await deleteValue('temporary');
    await expect(getValue('temporary')).resolves.toBeUndefined();
  });

  it('clears all values', async () => {
    await setValue('one', 1);
    await setValue('two', 2);
    await clearStorage();
    await expect(getValue('one')).resolves.toBeUndefined();
    await expect(getValue('two')).resolves.toBeUndefined();
  });
});
