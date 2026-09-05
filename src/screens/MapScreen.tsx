import { useAppState } from '../app/AppState'
import { phase2World } from '../content/world'
import { evaluateRequirement } from '../engine/requirements'
import { getConnectedKnownAreas, getKnownAreaIds } from '../engine/selectors'

export function MapScreen() {
  const { game } = useAppState()
  if (!game) return null

  const knownIds = new Set(getKnownAreaIds(game, phase2World))
  const knownAreas = phase2World.areas.filter((area) => knownIds.has(area.id))
  const knownPassages = phase2World.passages.filter((passage) => knownIds.has(passage.fromAreaId) && knownIds.has(passage.toAreaId))

  return (
    <main id="main-content" className="screen page-screen map-screen">
      <header className="page-heading">
        <p className="eyebrow">Deine Entdeckungen</p>
        <h1>Karte von Talora</h1>
        <p>Besuchte Orte sind kräftig markiert. Helle Orte kennst du bereits von einem angrenzenden Weg.</p>
      </header>

      <section className="world-map" aria-labelledby="visual-map-title">
        <h2 id="visual-map-title" className="visually-hidden">Grafische Karte</h2>
        <svg viewBox="40 25 680 535" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">Entdeckte Orte in Sonnenmark und an der Spiegelküste</title>
          <desc id="map-description">Die gleiche Verbindungsliste wie in der Reiseansicht, grafisch dargestellt.</desc>
          <path className="region-shape region-shape--coast" d="M330 200 C520 120 730 210 720 570 L300 570 C350 440 300 320 330 200Z" />
          {knownPassages.map((passage) => {
            const from = phase2World.areas.find((area) => area.id === passage.fromAreaId)!
            const to = phase2World.areas.find((area) => area.id === passage.toAreaId)!
            const blocked = !evaluateRequirement(passage.requirement, game).met && !game.unlockedPassageIds.includes(passage.id)
            return <line key={passage.id} className={`map-edge${passage.shortcut ? ' map-edge--shortcut' : ''}${blocked ? ' map-edge--blocked' : ''}`} x1={from.mapPosition.x} y1={from.mapPosition.y} x2={to.mapPosition.x} y2={to.mapPosition.y} />
          })}
          {knownAreas.map((area) => {
            const visited = game.visitedAreaIds.includes(area.id)
            const current = game.currentAreaId === area.id
            return (
              <g key={area.id} className={`map-node${visited ? ' map-node--visited' : ' map-node--known'}${current ? ' map-node--current' : ''}`} transform={`translate(${area.mapPosition.x} ${area.mapPosition.y})`}>
                {area.safe ? <rect x="-11" y="-11" width="22" height="22" rx="4" /> : <circle r="11" />}
                {current && <circle className="current-ring" r="18" />}
                <text y="-19" textAnchor="middle">{area.name}</text>
              </g>
            )
          })}
        </svg>
        <div className="map-legend" aria-hidden="true">
          <span><i className="legend-current" /> Aktuell</span>
          <span><i className="legend-visited" /> Besucht</span>
          <span><i className="legend-known" /> Bekannt</span>
          <span><b>↯</b> Abkürzung</span>
        </div>
      </section>

      <section className="map-text-list" aria-labelledby="map-list-title">
        <h2 id="map-list-title">Entdeckte Orte und Wege</h2>
        <ul>
          {knownAreas.map((area) => {
            const connections = getConnectedKnownAreas(game, phase2World, area.id)
            return (
              <li key={area.id}>
                <div><strong>{area.name}</strong>{game.currentAreaId === area.id && <span>Aktueller Ort</span>}</div>
                <p>{game.visitedAreaIds.includes(area.id) ? 'Besucht' : 'Bekannt'} · Wege nach {connections.map((entry) => entry.name).join(', ') || 'noch unbekannt'}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
