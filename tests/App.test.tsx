// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../src/App';

afterEach(cleanup);

describe('App', () => {
  it('shows the Visittkort editor, preview and branding', () => {
    render(<App />);

    expect(screen.getByText('Visittkort', { selector: '.app-header__name' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Visittkort' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Kontaktinformasjon' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Forhåndsvisning' })).toBeTruthy();
    expect(screen.getByText('Ousdal IT – Lokal IT. Digital trygghet.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Støtt Ousdal IT på Ko-fi' })).toBeTruthy();
  });

  it('does not show controls or titles from the template demo', () => {
    render(<App />);

    expect(screen.queryByText('Ousdal IT-verktøy')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Last ned eksempel' })).toBeNull();
    expect(screen.queryByText('Visittkort-funksjonene kommer i neste milepæl.')).toBeNull();
  });
});
