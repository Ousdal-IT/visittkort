// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { AppFooter } from '../src/components/AppFooter';

afterEach(cleanup);

describe('AppFooter', () => {
  it('shows the Ousdal IT brand line', () => {
    render(<AppFooter />);
    expect(screen.getByText('Ousdal IT – Lokal IT. Digital trygghet.')).toBeTruthy();
  });

  it('uses a safe external Ko-fi link', () => {
    render(<AppFooter />);
    const link = screen.getByRole('link', { name: 'Støtt Ousdal IT på Ko-fi' });

    expect(link.getAttribute('href')).toBe('https://ko-fi.com/ousdalit');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
