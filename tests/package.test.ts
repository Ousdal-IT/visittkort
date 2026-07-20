import { describe, expect, it } from 'vitest';
import packageSource from '../package.json?raw';

describe('package metadata', () => {
  it('uses the Visittkort package name', () => {
    const packageMetadata = JSON.parse(packageSource) as { name: string };

    expect(packageMetadata.name).toBe('visittkort');
  });
});
