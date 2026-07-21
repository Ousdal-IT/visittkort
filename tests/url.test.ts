import { describe, expect, it } from 'vitest';
import { normalizeHttpUrl } from '../src/lib/url';

describe('normalizeHttpUrl', () => {
  it('keeps HTTP and HTTPS URLs', () => {
    expect(normalizeHttpUrl('https://example.no/kontakt')).toBe('https://example.no/kontakt');
    expect(normalizeHttpUrl('http://example.no')).toBe('http://example.no/');
  });

  it('adds HTTPS to a domain without a protocol', () => {
    expect(normalizeHttpUrl(' example.no ')).toBe('https://example.no/');
  });

  it.each(['javascript:alert(1)', 'data:text/plain,test', 'file:///tmp/test', 'not a website'])(
    'rejects an unsafe or invalid URL: %s',
    (value) => expect(normalizeHttpUrl(value)).toBeUndefined(),
  );
});
