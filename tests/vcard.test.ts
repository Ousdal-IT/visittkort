import { describe, expect, it } from 'vitest';
import { EMPTY_BUSINESS_CARD } from '../src/types/businessCard';
import { createVCard, createVCardFilename, escapeVCardText } from '../src/lib/vcard';

describe('escapeVCardText', () => {
  it('escapes backslashes, commas and semicolons', () => {
    expect(escapeVCardText('A\\B, C; D')).toBe('A\\\\B\\, C\\; D');
  });

  it.each([
    ['linje 1\nlinje 2', 'linje 1\\nlinje 2'],
    ['linje 1\r\nlinje 2', 'linje 1\\nlinje 2'],
    ['linje 1\rlinje 2', 'linje 1\\nlinje 2'],
  ])('normalizes line endings in %j', (value, expected) => {
    expect(escapeVCardText(value)).toBe(expected);
  });
});

describe('createVCard', () => {
  it('creates a complete vCard 4.0 with every mapped field', () => {
    const card = {
      fullName: 'Per Gustav Ousdal',
      jobTitle: 'Daglig leder',
      organization: 'Ousdal IT',
      phone: '+47 900 00 000',
      email: 'per@example.no',
      website: 'example.no',
      address: 'Testveien 1\n1234 Teststed',
      tagline: 'Lokal IT, digital trygghet',
    };

    expect(createVCard(card)).toBe([
      'BEGIN:VCARD',
      'VERSION:4.0',
      'FN:Per Gustav Ousdal',
      'TITLE:Daglig leder',
      'ORG:Ousdal IT',
      'TEL:+47 900 00 000',
      'EMAIL:per@example.no',
      'URL:https://example.no/',
      'ADR;TYPE=work:;;Testveien 1\\n1234 Teststed;;;;',
      'NOTE:Lokal IT\\, digital trygghet',
      'END:VCARD',
      '',
    ].join('\r\n'));
  });

  it('uses only CRLF line endings and ends with CRLF', () => {
    const vcard = createVCard({ ...EMPTY_BUSINESS_CARD, fullName: 'Ola Nordmann' });
    const withoutCrLf = vcard.replace(/\r\n/g, '');

    expect(vcard.startsWith('BEGIN:VCARD\r\nVERSION:4.0\r\n')).toBe(true);
    expect(vcard.endsWith('END:VCARD\r\n')).toBe(true);
    expect(withoutCrLf).not.toMatch(/[\r\n]/);
  });

  it('omits empty fields and unsafe websites', () => {
    const vcard = createVCard({
      ...EMPTY_BUSINESS_CARD,
      fullName: 'Ola Nordmann',
      website: 'javascript:alert(1)',
    });

    expect(vcard).toContain('FN:Ola Nordmann\r\n');
    expect(vcard).not.toContain('TITLE:');
    expect(vcard).not.toContain('ORG:');
    expect(vcard).not.toContain('TEL:');
    expect(vcard).not.toContain('EMAIL:');
    expect(vcard).not.toContain('URL:');
    expect(vcard).not.toContain('ADR;');
    expect(vcard).not.toContain('NOTE:');
  });

  it('escapes values once and does not mutate its input', () => {
    const card = { ...EMPTY_BUSINESS_CARD, fullName: 'Ola \\ Nordmann, jr.;' };
    const original = { ...card };
    const vcard = createVCard(card);

    expect(vcard).toContain('FN:Ola \\\\ Nordmann\\, jr.\\;\r\n');
    expect(card).toEqual(original);
  });

  it.each([
    ['https://example.no', 'URL:https://example.no/'],
    ['http://example.no', 'URL:http://example.no/'],
    ['example.no', 'URL:https://example.no/'],
  ])('exports a safe website: %s', (website, expected) => {
    expect(createVCard({ ...EMPTY_BUSINESS_CARD, fullName: 'Navn', website })).toContain(expected);
  });

  it.each(['javascript:alert(1)', 'data:text/plain,test', 'invalid website'])(
    'omits an unsafe or invalid website: %s',
    (website) => expect(createVCard({ ...EMPTY_BUSINESS_CARD, fullName: 'Navn', website })).not.toContain('URL:'),
  );
});

describe('createVCardFilename', () => {
  it.each([
    ['Per Gustav Ousdal', 'per-gustav-ousdal.vcf'],
    ['  Ola   Nordmann  ', 'ola-nordmann.vcf'],
    ['Åse Ødegård', 'ase-odegard.vcf'],
    ['Anne / Test:*? Person', 'anne-test-person.vcf'],
    ['Navn---med -- streker', 'navn-med-streker.vcf'],
    ['', 'visittkort.vcf'],
    ['***', 'visittkort.vcf'],
  ])('creates a safe filename from %j', (name, expected) => {
    expect(createVCardFilename(name)).toBe(expected);
  });
});
