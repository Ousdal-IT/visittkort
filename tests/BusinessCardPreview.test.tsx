// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { BusinessCardPreview } from '../src/components/BusinessCardPreview';
import { EMPTY_BUSINESS_CARD } from '../src/types/businessCard';

afterEach(cleanup);

describe('BusinessCardPreview', () => {
  it('shows a calm empty state when every field is empty', () => {
    render(<BusinessCardPreview data={EMPTY_BUSINESS_CARD} />);
    expect(screen.getByText('Fyll ut feltene for å lage visittkortet ditt.')).toBeTruthy();
  });

  it('shows populated values and hides empty fields', () => {
    render(<BusinessCardPreview data={{ ...EMPTY_BUSINESS_CARD, fullName: 'Kari Nordmann' }} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Kari Nordmann' })).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Fyll ut feltene for å lage visittkortet ditt.')).toBeNull();
  });

  it('creates telephone, email and safe website links', () => {
    render(<BusinessCardPreview data={{
      ...EMPTY_BUSINESS_CARD,
      phone: '+47 123 45 678',
      email: 'kari@example.no',
      website: 'example.no',
    }} />);

    expect(screen.getByRole('link', { name: '+47 123 45 678' }).getAttribute('href')).toBe('tel:+47 123 45 678');
    expect(screen.getByRole('link', { name: 'kari@example.no' }).getAttribute('href')).toBe('mailto:kari@example.no');
    expect(screen.getByRole('link', { name: 'example.no' }).getAttribute('href')).toBe('https://example.no/');
  });

  it.each(['javascript:alert(1)', 'data:text/plain,test', 'file:///tmp/test', 'not a website'])(
    'does not link an unsafe or invalid website: %s',
    (website) => {
    render(<BusinessCardPreview data={{ ...EMPTY_BUSINESS_CARD, website }} />);

    expect(screen.getByText(website).tagName).toBe('SPAN');
    expect(screen.queryByRole('link', { name: website })).toBeNull();
    },
  );
});
