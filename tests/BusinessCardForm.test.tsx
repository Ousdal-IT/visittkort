// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BusinessCardForm } from '../src/components/BusinessCardForm';
import { EMPTY_BUSINESS_CARD } from '../src/types/businessCard';

afterEach(cleanup);

describe('BusinessCardForm', () => {
  it('shows eight correctly labelled controls with suitable types', () => {
    render(<BusinessCardForm data={EMPTY_BUSINESS_CARD} onChange={() => undefined} />);

    const expectedControls = [
      ['Navn', 'text'],
      ['Stilling eller rolle', 'text'],
      ['Virksomhet', 'text'],
      ['Telefon', 'tel'],
      ['E-post', 'email'],
      ['Nettsted', 'url'],
      ['Adresse', null],
      ['Kort tekst eller slagord', null],
    ] as const;

    for (const [label, type] of expectedControls) {
      const control = screen.getByLabelText(label);
      expect(control).toBeTruthy();
      if (type) expect(control.getAttribute('type')).toBe(type);
      else expect(control.tagName).toBe('TEXTAREA');
    }
  });

  it('reports field changes', () => {
    const onChange = vi.fn();
    render(<BusinessCardForm data={EMPTY_BUSINESS_CARD} onChange={onChange} />);

    fireEvent.input(screen.getByLabelText('Navn'), { target: { value: 'Kari Nordmann' } });

    expect(onChange).toHaveBeenCalledWith('fullName', 'Kari Nordmann');
  });
});
