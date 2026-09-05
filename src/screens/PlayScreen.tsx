import { useMemo, useRef, useState } from 'react'
import { useAppState } from '../app/AppState'
import { InventoryDialog } from '../components/InventoryDialog'
import { phase2World } from '../content/world'
import { getAvailableActions } from '../engine/actions'
import { reduceGame } from '../engine/reducer'
import {
  getAreaDescription,
  getCurrentArea,
  getInventoryItems,
  getLastEventText
} from '../engine/selectors'

export function PlayScreen() {
  const { game, updateAdventure } = useAppState()
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const inventoryButtonRef = useRef<HTMLButtonElement>(null)
  const view = useMemo(() => {
    if (!game) return null
    const area = getCurrentArea(game, phase2World)
    return {
      area,
      description: getAreaDescription(game, area),
      actions: getAvailableActions(game, phase2World),
      inventory: getInventoryItems(game, phase2World),
      lastEvent: getLastEventText(game)
    }
  }, [game])

  if (!game || !view) return null
  const completed = game.flags.includes(phase2World.sliceGoalFlag)

  return (
    <main id="main-content" className="screen play-screen">
      <section className={`atmosphere-panel atmosphere-panel--${view.area.regionId}`} aria-label={`${view.area.name} in ${view.area.regionName}`}>
        <div className="sun" aria-hidden="true" />
        <div className="hills hills--back" aria-hidden="true" />
        <div className="hills hills--front" aria-hidden="true" />
        <div className="route-lines" aria-hidden="true"><i /><i /><i /></div>
        <div className="kuno" aria-hidden="true"><span>↗</span></div>
        <div className="atmosphere-info">
          <p>{view.area.regionName}</p>
          <strong>{view.area.safe ? 'Sicherer Ort' : 'Erkundungsgebiet'}</strong>
        </div>
      </section>

      <article className="reading-card">
        <header className="location-heading">
          <div>
            <p className="eyebrow">{view.area.regionName}</p>
            <h1>{view.area.name}</h1>
          </div>
          <div className="location-tools">
            {view.area.safe && <span className="safe-badge"><span aria-hidden="true">⌂</span> Sicher</span>}
            <button ref={inventoryButtonRef} className="inventory-button" onClick={() => setInventoryOpen(true)}>
              <span aria-hidden="true">▦</span> Inventar
            </button>
          </div>
        </header>

        <p className="story-lead">{view.description}</p>

        {view.lastEvent && (
          <div className="event-result" role="status" aria-live="polite" aria-atomic="true">
            <span aria-hidden="true">✦</span>
            <p>{view.lastEvent}</p>
          </div>
        )}

        {completed && (
          <section className="phase-note phase-note--success" aria-labelledby="phase-note-title">
            <h2 id="phase-note-title">Erste Erkundung abgeschlossen</h2>
            <p>Du hast den Rundweg, die Abkürzung und beide Gegenstandsketten erkundet. Dein Fortschritt bleibt gespeichert.</p>
          </section>
        )}

        <section className="carried-items" aria-labelledby="carried-title">
          <div>
            <h2 id="carried-title">Dabei</h2>
            <span>{view.inventory.length} Arten</span>
          </div>
          <ul>
            {view.inventory.map(({ item, quantity }) => (
              <li key={item.id} title={item.description}>
                <span aria-hidden="true">{item.kind === 'key' ? '◆' : item.kind === 'tool' ? '⌁' : item.kind === 'quest' ? '✦' : '•'}</span>
                {item.name}{quantity > 1 ? ` × ${quantity}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <section className="actions-section" aria-labelledby="actions-title">
          <h2 id="actions-title">Was möchtest du tun?</h2>
          <div className="action-grid">
            {view.actions.map((action) => (
              <button
                key={action.id}
                className={`action-card action-card--${action.kind}`}
                aria-disabled={action.disabled}
                onClick={() => {
                  if (!action.disabled) updateAdventure((current) => reduceGame(current, action.gameAction, phase2World))
                }}
              >
                <span className="action-icon" aria-hidden="true">{action.icon}</span>
                <strong>{action.label}</strong>
                <small className={action.disabled ? 'blocked-reason' : undefined}>
                  {action.disabled ? action.blockedReason : action.description}
                </small>
              </button>
            ))}
          </div>
        </section>

        {game.recentEvents.length > 1 && (
          <details className="travel-log">
            <summary>Letzte Ereignisse</summary>
            <ol>
              {game.recentEvents.slice(-5).reverse().map((event) => <li key={event.id}>{event.text}</li>)}
            </ol>
          </details>
        )}
      </article>
      {inventoryOpen && (
        <InventoryDialog
          game={game}
          world={phase2World}
          returnFocusRef={inventoryButtonRef}
          onClose={() => setInventoryOpen(false)}
          onAction={(action) => updateAdventure((current) => reduceGame(current, action, phase2World))}
        />
      )}
    </main>
  )
}
