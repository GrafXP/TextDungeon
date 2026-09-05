import { useAppState } from '../app/AppState'
import { getQuestViews } from '../engine/selectors'

export function QuestsScreen() {
  const { game } = useAppState()
  if (!game) return null
  const quests = getQuestViews(game)

  return (
    <main id="main-content" className="screen page-screen quests-screen">
      <header className="page-heading">
        <p className="eyebrow">Kunos Notizen</p>
        <h1>Aufgaben</h1>
        <p>Die nächste sinnvolle Spur steht oben. Hinweise sind freiwillig und kosten nichts.</p>
      </header>

      <section className="quest-overview" aria-labelledby="main-goal-title">
        <div className="quest-compass" aria-hidden="true">↗</div>
        <div>
          <p className="eyebrow">Hauptziel</p>
          <h2 id="main-goal-title">Erkunde die verblassenden Wege</h2>
          <p>Finde heraus, was im Kartenarchiv verborgen ist und warum das Wasser an der Küste steigt.</p>
        </div>
      </section>

      <ol className="quest-list">
        {quests.map((quest, index) => (
          <li key={quest.id} className={`${quest.done ? 'quest-item quest-item--done' : 'quest-item'}${quest.current ? ' quest-item--current' : ''}`}>
            <span className="quest-number" aria-hidden="true">{quest.done ? '✓' : index + 1}</span>
            <div>
              <h2>{quest.title}</h2>
              <p>{quest.description}</p>
              {!quest.done && (
                <details className="hint-details">
                  <summary>Kunos Hinweis öffnen</summary>
                  <p><strong>Kuno:</strong> «{quest.hint}»</p>
                </details>
              )}
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
