import { isRecord, isString } from '../lib/validation';

export interface BusinessCardData {
  fullName: string;
  jobTitle: string;
  organization: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tagline: string;
}

export const EMPTY_BUSINESS_CARD: BusinessCardData = {
  fullName: '',
  jobTitle: '',
  organization: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  tagline: '',
};

export function normalizeBusinessCard(value: unknown): BusinessCardData {
  if (!isRecord(value)) return { ...EMPTY_BUSINESS_CARD };

  return Object.fromEntries(
    Object.keys(EMPTY_BUSINESS_CARD).map((key) => [key, isString(value[key]) ? value[key] : '']),
  ) as unknown as BusinessCardData;
}
