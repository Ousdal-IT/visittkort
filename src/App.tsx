import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';

export function App() {
  return (
    <div class="page">
      <AppHeader appName="Visittkort" />
      <main>
        <section class="card" aria-labelledby="title">
          <h1 id="title">Visittkort</h1>
          <p class="intro">Lag et digitalt visittkort som lagres lokalt på enheten din.</p>
          <aside class="notice" aria-label="Prosjektstatus">
            Visittkort-funksjonene kommer i neste milepæl.
          </aside>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
