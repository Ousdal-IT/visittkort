import { describe, expect, it } from 'vitest';
import { isFiniteNumber, isNonEmptyString, isRecord, isString } from '../src/lib/validation';

describe('validation helpers', () => {
  it('recognizes strings', () => {
    expect(isString('tekst')).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it('requires visible string content', () => {
    expect(isNonEmptyString(' verdi ')).toBe(true);
    expect(isNonEmptyString('   ')).toBe(false);
  });

  it('recognizes records but not arrays or null', () => {
    expect(isRecord({ key: 'value' })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
  });

  it('recognizes only finite numbers', () => {
    expect(isFiniteNumber(12.5)).toBe(true);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber('12.5')).toBe(false);
  });
});
