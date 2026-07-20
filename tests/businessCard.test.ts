import { describe, expect, it } from 'vitest';
import { EMPTY_BUSINESS_CARD, normalizeBusinessCard } from '../src/types/businessCard';

describe('BusinessCardData', () => {
  it('has all eight fields with empty string defaults', () => {
    expect(EMPTY_BUSINESS_CARD).toEqual({
      fullName: '',
      jobTitle: '',
      organization: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      tagline: '',
    });
    expect(Object.values(EMPTY_BUSINESS_CARD).every((value) => value === '')).toBe(true);
  });

  it('normalizes missing, invalid and unknown stored fields', () => {
    expect(normalizeBusinessCard({ fullName: 'Ola Nordmann', phone: 123, unknown: 'ignored' })).toEqual({
      ...EMPTY_BUSINESS_CARD,
      fullName: 'Ola Nordmann',
    });
    expect(normalizeBusinessCard('corrupt')).toEqual(EMPTY_BUSINESS_CARD);
  });
});
