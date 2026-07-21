import type { BusinessCardData } from '../types/businessCard';
import { normalizeHttpUrl } from '../lib/url';

interface BusinessCardPreviewProps {
  data: BusinessCardData;
}

export function BusinessCardPreview({ data }: BusinessCardPreviewProps) {
  const card = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.trim()]),
  ) as unknown as BusinessCardData;
  const isEmpty = Object.values(card).every((value) => value === '');
  const websiteUrl = normalizeHttpUrl(card.website);

  return (
    <section class="preview-section" aria-labelledby="preview-title">
      <h2 id="preview-title">Forhåndsvisning</h2>
      <article class="business-card-preview">
        {isEmpty ? (
          <p class="empty-state">Fyll ut feltene for å lage visittkortet ditt.</p>
        ) : (
          <>
            {card.fullName && <h3>{card.fullName}</h3>}
            {(card.jobTitle || card.organization) && (
              <p class="role-line">
                {[card.jobTitle, card.organization].filter(Boolean).join(' · ')}
              </p>
            )}
            {(card.phone || card.email || card.website) && (
              <address class="contact-list">
                {card.phone && <a href={`tel:${card.phone}`}>{card.phone}</a>}
                {card.email && <a href={`mailto:${card.email}`}>{card.email}</a>}
                {card.website && (websiteUrl
                  ? <a href={websiteUrl} target="_blank" rel="noopener noreferrer">{card.website}</a>
                  : <span>{card.website}</span>)}
              </address>
            )}
            {card.address && <address class="postal-address">{card.address}</address>}
            {card.tagline && <p class="tagline">{card.tagline}</p>}
          </>
        )}
      </article>
    </section>
  );
}
