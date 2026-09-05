import { NavLink, Outlet } from 'react-router-dom'
import { useAppState } from '../app/AppState'
import { phase2World } from '../content/world'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link nav-link--active' : 'nav-link'
}

export function AppLayout() {
  const { adventureStatus, game, saveStatus } = useAppState()
  const hasAdventure = adventureStatus === 'ready' && game
  const weaponName = game?.player.equippedWeaponId
    ? phase2World.items.find((item) => item.id === game.player.equippedWeaponId)?.name ?? 'Unbekannt'
    : 'Keine Waffe'

  return (
    <>
      <div className="app-chrome">
        <header className="app-header">
          <NavLink to="/" className="brand" aria-label="TextDungeon – Startseite">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <span>TextDungeon</span>
          </NavLink>
          {hasAdventure && (
            <div className="quick-status" aria-label="Abenteuerstatus">
              <span
                className={`life-status${game.player.life <= game.player.maxLife / 4 ? ' life-status--low' : ''}`}
                title="Lebenspunkte"
                aria-label={`${game.player.life} von ${game.player.maxLife} Lebenspunkten`}
              >
                <span aria-hidden="true">♥</span> {game.player.life}/{game.player.maxLife}
              </span>
              <span className="weapon-status"><span aria-hidden="true">⚔</span> {weaponName}</span>
              <span className={`save-state save-state--${saveStatus}`} aria-live="polite">
                {saveStatus === 'saving' ? 'Speichert …' : saveStatus === 'error' ? 'Nicht gespeichert' : 'Gespeichert'}
              </span>
            </div>
          )}
        </header>

        <nav className="main-nav" aria-label="Hauptnavigation">
          {hasAdventure && <NavLink to="/spiel" className={navClass}>Abenteuer</NavLink>}
          {hasAdventure && <NavLink to="/karte" className={navClass}>Karte</NavLink>}
          {hasAdventure && <NavLink to="/aufgaben" className={navClass}>Aufgaben</NavLink>}
          {hasAdventure && <NavLink to="/tagebuch" className={navClass}>Tagebuch</NavLink>}
          <NavLink to="/einstellungen" className={navClass}>Einstellungen</NavLink>
        </nav>
      </div>
      <Outlet />
    </>
  )
}
