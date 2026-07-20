// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { AppHeader } from '../src/components/AppHeader';

afterEach(cleanup);

describe('AppHeader', () => {
  it('uses the compact Ousdal IT mark without the retired SVG', () => {
    render(<AppHeader appName="Eksempelverktøy" />);
    const logo = screen.getByRole('img', { name: 'Ousdal IT' });

    expect(logo.getAttribute('src')).toMatch(/brand\/ousdal-it-mark\.png$/);
    expect(logo.getAttribute('src')).not.toContain('ousdal-it-logo.svg');
    expect(screen.getByText('Eksempelverktøy')).toBeTruthy();
    expect(screen.getByText('Et verktøy fra Ousdal IT')).toBeTruthy();
  });
});
