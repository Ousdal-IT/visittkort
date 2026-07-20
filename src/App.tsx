import { useEffect, useState } from 'preact/hooks';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { downloadFile } from './lib/download';
import { getValue, setValue } from './lib/storage';

const STORAGE_KEY = 'example-text';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function App() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent>();

  useEffect(() => {
    void getValue<string>(STORAGE_KEY).then((value) => {
      if (value !== undefined) setText(value);
    });

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const save = async () => {
    await setValue(STORAGE_KEY, text);
    setMessage('Lagret lokalt.');
  };

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(undefined);
  };

  return (
    <div class="page">
      <AppHeader appName="Ousdal IT-verktøy" />
      <main>
        <section class="card" aria-labelledby="title">
          <p class="eyebrow">Enkel, trygg og lokal</p>
          <h1 id="title">Ousdal IT-verktøy</h1>
          <p class="intro">Dette er en mal.</p>
          <label for="example">Eksempeltekst</label>
          <textarea
            id="example"
            rows={6}
            value={text}
            onInput={(event) => setText(event.currentTarget.value)}
            placeholder="Skriv noe her …"
          />
          <div class="actions">
            <button type="button" onClick={save}>Lagre lokalt</button>
            <button type="button" class="secondary" onClick={() => downloadFile(text, 'eksempel.txt', 'text/plain;charset=utf-8')}>
              Last ned eksempel
            </button>
            {installPrompt && <button type="button" class="secondary" onClick={install}>Installer app</button>}
          </div>
          <p class="status" role="status">{message}</p>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
