import type { BusinessCardData } from '../types/businessCard';
import { normalizeHttpUrl } from './url';

const CRLF = '\r\n';

export function escapeVCardText(value: string): string {
  return value
    .replace(/\r\n|\r|\n/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export function createVCard(data: BusinessCardData): string {
  const lines = ['BEGIN:VCARD', 'VERSION:4.0'];
  const addTextProperty = (property: string, value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) lines.push(`${property}:${escapeVCardText(trimmedValue)}`);
  };

  addTextProperty('FN', data.fullName);
  addTextProperty('TITLE', data.jobTitle);
  addTextProperty('ORG', data.organization);
  addTextProperty('TEL', data.phone);
  addTextProperty('EMAIL', data.email);

  const website = normalizeHttpUrl(data.website);
  if (website) lines.push(`URL:${website}`);

  const address = data.address.trim();
  if (address) lines.push(`ADR;TYPE=work:;;${escapeVCardText(address)};;;;`);

  addTextProperty('NOTE', data.tagline);
  lines.push('END:VCARD');
  return `${lines.join(CRLF)}${CRLF}`;
}

export function createVCardFilename(fullName: string): string {
  const safeName = fullName
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${safeName || 'visittkort'}.vcf`;
}
