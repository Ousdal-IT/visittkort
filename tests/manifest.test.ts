import { describe, expect, it } from 'vitest';
import manifestSource from '../public/manifest.webmanifest?raw';

describe('PWA manifest', () => {
  it('uses the new compact PNG icons', () => {
    const manifest = JSON.parse(manifestSource) as { icons: Array<{ src: string; sizes: string }> };

    expect(manifest.icons).toEqual([
      expect.objectContaining({ src: 'icons/icon-192.png', sizes: '192x192' }),
      expect.objectContaining({ src: 'icons/icon-512.png', sizes: '512x512' }),
    ]);
    expect(manifestSource).not.toContain('icon.svg');
  });
});
