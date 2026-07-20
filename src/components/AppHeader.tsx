interface AppHeaderProps {
  appName: string;
}

export function AppHeader({ appName }: AppHeaderProps) {
  return (
    <header class="app-header">
      <div class="app-header__inner">
        <img
          class="app-header__logo"
          src={`${import.meta.env.BASE_URL}brand/ousdal-it-mark.png`}
          alt="Ousdal IT"
          width="48"
          height="48"
        />
        <div>
          <span class="app-header__name">{appName}</span>
          <span class="app-header__byline">Et verktøy fra Ousdal IT</span>
        </div>
      </div>
    </header>
  );
}
