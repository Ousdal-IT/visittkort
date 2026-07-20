import { useEffect, useRef, useState } from 'preact/hooks';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { BusinessCardForm } from './components/BusinessCardForm';
import { BusinessCardPreview } from './components/BusinessCardPreview';
import { deleteValue, getValue, setValue } from './lib/storage';
import { EMPTY_BUSINESS_CARD, normalizeBusinessCard, type BusinessCardData } from './types/businessCard';

export const BUSINESS_CARD_STORAGE_KEY = 'visittkort:business-card';
export const SAVE_DEBOUNCE_MS = 500;

type StorageStatus = 'loading' | 'saving' | 'saved' | 'error' | 'reset';

const statusMessages: Record<StorageStatus, string> = {
  loading: 'Laster inn …',
  saving: 'Endringer lagres …',
  saved: 'Lagret lokalt',
  error: 'Kunne ikke lagre endringene',
  reset: 'Visittkortet er nullstilt',
};

export function App() {
  const [data, setData] = useState<BusinessCardData>({ ...EMPTY_BUSINESS_CARD });
  const [status, setStatus] = useState<StorageStatus>('loading');
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const saveVersion = useRef(0);

  useEffect(() => {
    let active = true;
    void getValue(BUSINESS_CARD_STORAGE_KEY)
      .then((storedData) => {
        if (!active) return;
        setData(normalizeBusinessCard(storedData));
        setStatus('saved');
      })
      .catch(() => {
        if (active) setStatus('error');
      })
      .finally(() => {
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
      clearTimeout(saveTimer.current);
    };
  }, []);

  const updateField = (field: keyof BusinessCardData, value: string) => {
    const nextData = { ...data, [field]: value };
    setData(nextData);
    if (!isLoaded) return;

    setStatus('saving');
    clearTimeout(saveTimer.current);
    const version = ++saveVersion.current;
    saveTimer.current = setTimeout(() => {
      pendingSave.current = setValue(BUSINESS_CARD_STORAGE_KEY, nextData)
        .then(() => {
          if (version === saveVersion.current) setStatus('saved');
        })
        .catch(() => {
          if (version === saveVersion.current) setStatus('error');
        });
    }, SAVE_DEBOUNCE_MS);
  };

  const resetCard = async () => {
    const confirmed = window.confirm(
      'Vil du nullstille visittkortet? Alle lokalt lagrede opplysninger i kortet blir slettet.',
    );
    if (!confirmed) return;

    clearTimeout(saveTimer.current);
    ++saveVersion.current;
    try {
      await pendingSave.current.catch(() => undefined);
      await deleteValue(BUSINESS_CARD_STORAGE_KEY);
      setData({ ...EMPTY_BUSINESS_CARD });
      setStatus('reset');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div class="page">
      <AppHeader appName="Visittkort" />
      <main>
        <div class="content">
          <header class="page-introduction">
            <h1>Visittkort</h1>
            <p>Lag et digitalt visittkort som lagres lokalt på enheten din.</p>
          </header>
          <p class={`storage-status storage-status--${status}`} aria-live="polite" role="status">
            {statusMessages[status]}
          </p>
          <div class="workspace">
            <div>
              <BusinessCardForm data={data} onChange={updateField} />
              <button class="reset-button" type="button" onClick={() => void resetCard()}>
                Nullstill visittkortet
              </button>
            </div>
            <BusinessCardPreview data={data} />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
