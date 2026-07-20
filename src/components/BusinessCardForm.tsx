import type { BusinessCardData } from '../types/businessCard';

interface BusinessCardFormProps {
  data: BusinessCardData;
  onChange: (field: keyof BusinessCardData, value: string) => void;
}

const fields: Array<{
  name: keyof BusinessCardData;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'url';
  autocomplete?: string;
  multiline?: boolean;
}> = [
  { name: 'fullName', label: 'Navn', type: 'text', autocomplete: 'name' },
  { name: 'jobTitle', label: 'Stilling eller rolle', type: 'text', autocomplete: 'organization-title' },
  { name: 'organization', label: 'Virksomhet', type: 'text', autocomplete: 'organization' },
  { name: 'phone', label: 'Telefon', type: 'tel', autocomplete: 'tel' },
  { name: 'email', label: 'E-post', type: 'email', autocomplete: 'email' },
  { name: 'website', label: 'Nettsted', type: 'url', autocomplete: 'url' },
  { name: 'address', label: 'Adresse', autocomplete: 'street-address', multiline: true },
  { name: 'tagline', label: 'Kort tekst eller slagord', multiline: true },
];

export function BusinessCardForm({ data, onChange }: BusinessCardFormProps) {
  return (
    <form class="business-card-form" aria-labelledby="form-title" onSubmit={(event) => event.preventDefault()}>
      <h2 id="form-title">Kontaktinformasjon</h2>
      <div class="form-fields">
        {fields.map(({ name, label, type, autocomplete, multiline }) => {
          const id = `business-card-${name}`;
          const sharedProps = {
            id,
            name,
            value: data[name],
            autocomplete,
            onInput: (event: Event) => onChange(name, (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value),
          };

          return (
            <div class="form-field" key={name}>
              <label for={id}>{label}</label>
              {multiline
                ? <textarea {...sharedProps} rows={name === 'address' ? 3 : 2} />
                : <input {...sharedProps} type={type} />}
            </div>
          );
        })}
      </div>
    </form>
  );
}
