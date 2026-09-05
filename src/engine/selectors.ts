import type { AreaDefinition, ItemDefinition, WorldDefinition } from '../domain/content'
import type { GameSave } from '../domain/game'
import { otherEnd } from './actions'

export interface QuestView {
  id: string
  title: string
  description: string
  done: boolean
  current: boolean
  hint: string
}

export function getCurrentArea(save: GameSave, world: WorldDefinition): AreaDefinition {
  const area = world.areas.find((entry) => entry.id === save.currentAreaId)
  if (!area) throw new Error(`Unbekannter aktueller Ort: ${save.currentAreaId}`)
  return area
}

export function getAreaDescription(save: GameSave, area: AreaDefinition): string {
  if (save.flags.includes('raugrim_verbannt') && area.id === 'sonnenwacht') return 'Auf dem Platz ruft jemand deinen Namen. Neben dem alten Wandbild steht eine neue Tafel: Alva, die drei Wächter und viele Helfende. Tessa wartet im warmen Morgenlicht.'
  if (save.flags.includes('raugrim_verbannt') && area.id === 'drei_wege_platz') return 'Kinder spielen zwischen den Wegweisern. Die Wege führen wieder zu Menschen mit Namen und Geschichten. Du kannst in jede Region zurückkehren.'
  const changedDescriptions: Record<string, [string, string]> = {
    dornenkrone: ['arbor_befreit', 'Die schwarzen Dornen sind verschwunden. Arbor öffnet zwischen braunem und grünem Fell neue Pfade durch eine friedliche Lichtung.'],
    perlenbecken: ['marea_befreit', 'Klares Wasser glitzert zwischen den Booten. Marea zieht ruhige Kreise, und der direkte Bootspfad zum Hafen ist offen.'],
    adlerhorst: ['voltaro_befreit', 'Der Gewitterhimmel ist aufgerissen. Voltaro gleitet ruhig über dem Horst, und am Abend sind wieder Sterne zu sehen.'],
    weltenkammer: ['raugrim_verbannt', 'Goldenes Morgenlicht fällt auf das geschlossene Bannschloss. Wo Raugrim stand, liegt Alvas letzter Kartenrand.'],
    alter_leuchtturm: ['sonnenfunke_erhalten', 'Der Alte Leuchtturm sendet wieder einen warmen Strahl über die Spiegelküste bis nach Sonnenwacht.'],
    korallengrotte: ['quelltraene_erhalten', 'Klares Quellwasser spiegelt lesbare Namen. Jeder neue Besucher darf einen weiteren hinzufügen.'],
    windorgel: ['windlied_erhalten', 'Die reparierte Windorgel spielt ihre drei hellen Töne. Von fern antwortet die Windfähre.']
  }
  const changed = changedDescriptions[area.id]
  if (changed && save.flags.includes(changed[0])) return changed[1]
  return save.deliveredDialogueIds.includes(`area_intro:${area.id}`)
    ? area.revisitDescription
    : area.firstDescription
}

export function getKnownAreaIds(save: GameSave, world: WorldDefinition): string[] {
  if (save.flags.includes('karte_vollstaendig')) return world.areas.map((area) => area.id)
  const known = new Set(save.visitedAreaIds)
  for (const passage of world.passages) {
    if (save.visitedAreaIds.includes(passage.fromAreaId)) known.add(passage.toAreaId)
    if (save.visitedAreaIds.includes(passage.toAreaId)) known.add(passage.fromAreaId)
  }
  return [...known]
}

export function getInventoryItems(save: GameSave, world: WorldDefinition): Array<{ item: ItemDefinition; quantity: number }> {
  return Object.entries(save.player.inventory)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({ item: world.items.find((entry) => entry.id === id), quantity }))
    .filter((entry): entry is { item: ItemDefinition; quantity: number } => Boolean(entry.item))
}

export function getQuestViews(save: GameSave): QuestView[] {
  const has = (itemId: string) => (save.player.inventory[itemId] ?? 0) > 0
  const done = (gameFlag: string) => save.flags.includes(gameFlag)

  if (done('raugrim_verbannt')) {
    const mapEdges = ['karte_mut', 'karte_arbor', 'karte_marea', 'karte_voltaro', 'karte_kompass', 'karte_rueckgabe']
      .filter((clue) => save.discoveredClueIds.includes(clue)).length
    return [{
      id: 'nachspiel', title: 'Taloras Morgen ist zurück',
      description: `${mapEdges} von 6 Kartenrändern gefunden. Alle Regionen und Geheimnisse bleiben erreichbar.`,
      done: mapEdges === 6, current: mapEdges < 6,
      hint: 'Kartenränder liegen im Garten, in der Baumschule, Bibliothek, Himmelswerft, im Wurzeltunnel und in der Weltenkammer.'
    }]
  }

  if (done('endtor_offen')) {
    return [
      { id: 'letzter_weg', title: 'Folge dem letzten Weg', description: 'Gehe über Sternentreppe und Halle der Echos zum Rastplatz am Rand der Nacht.', done: save.visitedAreaIds.includes('rand_der_nacht'), current: !save.visitedAreaIds.includes('rand_der_nacht'), hint: 'Der Weg beginnt hinter dem Tor der sechs Zeichen am Drei-Wege-Platz.' },
      { id: 'raugrim', title: 'Verbanne Raugrim', description: 'Öffne in jeder Kampfphase den Schattenriss und setze das angezeigte Siegel. Sprich danach Alvas Versprechen.', done: false, current: save.visitedAreaIds.includes('rand_der_nacht'), hint: 'Raste vor dem Kampf. Starke Aktionen werden immer vorher angekündigt.' }
    ]
  }

  if (has('morgenklinge')) {
    const guardians = [
      ['arbor', 'Arbor im Wisperwald', 'arbor_befreit', 'Dornenkrone', 'Verteidige dich, wenn Arbor scharrt; sein Geweih bleibt dann kurz stecken.'],
      ['marea', 'Marea an der Spiegelküste', 'marea_befreit', 'Perlenbecken', 'Verteidige dich, wenn das Wasser vor der Wellenrolle steigt.'],
      ['voltaro', 'Voltaro auf der Donnerhöhe', 'voltaro_befreit', 'Adlerhorst', 'Verteidige dich beim angekündigten Sturzflug; am Boden liegt eine Blitzader offen.']
    ] as const
    const results = guardians.map(([id, title, gameFlag, place, hint]) => ({
      id, title: done(gameFlag) ? `${title} ist frei` : `Befreie ${title}`,
      description: done(gameFlag) ? `Das Siegel aus ${place} gehört dir.` : `Der Wächter wartet in ${place}. Die Reihenfolge ist frei.`,
      done: done(gameFlag), current: !done(gameFlag), hint
    }))
    const allFreed = guardians.every(([, , gameFlag]) => done(gameFlag))
    return [...results, {
      id: 'endtor', title: allFreed ? 'Öffne das Tor der sechs Zeichen' : 'Sammle drei Wächtersiegel',
      description: allFreed ? 'Zeige Morgenklinge und alle drei Siegel am Tor.' : `${guardians.filter(([, , gameFlag]) => done(gameFlag)).length} von 3 Wächtern befreit.`,
      done: false, current: allFreed, hint: 'Das Tor steht direkt am Drei-Wege-Platz.'
    }]
  }

  const sunDone = has('sonnenfunke') || done('sonnenfunke_erhalten')
  const sourceDone = has('quelltraene') || done('quelltraene_erhalten')
  const windDone = has('windlied') || done('windlied_erhalten')
  const gifts = [sunDone, sourceDone, windDone].filter(Boolean).length
  return [
    {
      id: 'sonnenfunke', title: sunDone ? 'Sonnenfunke gefunden' : 'Entfache den Sonnenfunken',
      description: sunDone ? 'Der Leuchtturm strahlt wieder.' : 'Finde Sonnenspiegel und Goldbeeren, hilf Lio und repariere den Alten Leuchtturm.',
      done: sunDone, current: !sunDone,
      hint: done('archiv_geoeffnet') ? 'Bringe den Spiegel und Lios Leuchtöl zum Alten Leuchtturm.' : 'Der Archivschlüssel liegt im Garten der Namen; Goldbeeren wachsen auf der Mooslichtung.'
    },
    {
      id: 'quelltraene', title: sourceDone ? 'Quellträne gefunden' : 'Reinige die Quelle',
      description: sourceDone ? 'Der Aquädukt ist wieder offen.' : 'Berge das Schleusenrad, finde Mondmoos und repariere das Schleusenhaus.',
      done: sourceDone, current: !sourceDone,
      hint: done('schleuse_repariert') ? 'Empfange die Quellträne in der Korallengrotte.' : has('schleusenrad') && has('mondmoos') ? 'Setze im Schleusenhaus Zulauf und Quelltor auf offen, den Ablauf auf geschlossen.' : done('schleusenrad_geborgen') ? 'Mondmoos wächst in der Alten Baumschule.' : 'Nimm die Hebelstange am Alten Markt mit zum überfluteten Markt.'
    },
    {
      id: 'windlied', title: windDone ? 'Windlied gefunden' : 'Bringe die Windorgel zum Klingen',
      description: windDone ? 'Die Windfähre fährt wieder.' : 'Hole Silberpfeife und Kletterseil; erreiche damit die Sturmfeder.',
      done: windDone, current: !windDone,
      hint: has('silberpfeife') && has('sturmfeder') ? 'Stelle die Flügel der Windorgel ein und spiele Kreis–Stern–Welle.' : has('silberpfeife') ? 'Das Kletterseil liegt im Spinnenhain; nutze es am Wettermast der Wolkenbrücke.' : 'Das sichtbare Echo in der Kristallmine öffnet die Werkzeugkammer.'
    },
    {
      id: 'morgenklinge', title: gifts === 3 ? 'Erwecke die Morgenklinge' : 'Sammle die drei Gaben',
      description: `${gifts} von 3 Gaben sind bereit.`, done: false, current: gifts === 3,
      hint: 'Bringe Sonnenfunke, Quellträne und Windlied zum Tempel am Drei-Wege-Platz.'
    }
  ]
}

export function getMainGoal(save: GameSave): { title: string; description: string } {
  if (save.flags.includes('raugrim_verbannt')) return { title: 'Erkunde Talora im neuen Morgen', description: 'Alle Wege bleiben offen. Finde Geheimnisse oder kehre zu deinen Freunden zurück.' }
  if (save.flags.includes('endtor_offen')) return { title: 'Verbanne Raugrim', description: 'Folge dem letzten Weg, setze im Kampf alle drei Siegel und sprich Alvas Versprechen.' }
  if ((save.player.inventory.morgenklinge ?? 0) > 0) return { title: 'Befreie die drei Wächter', description: 'Arbor, Marea und Voltaro können in beliebiger Reihenfolge befreit werden.' }
  return { title: 'Erwecke die Morgenklinge', description: 'Finde Sonnenfunke, Quellträne und Windlied in beliebiger Reihenfolge.' }
}

export function getLastEventText(save: GameSave): string | null {
  return save.recentEvents.at(-1)?.text ?? null
}

export function getConnectedKnownAreas(save: GameSave, world: WorldDefinition, areaId: string) {
  const known = new Set(getKnownAreaIds(save, world))
  return world.passages
    .filter((passage) => otherEnd(passage, areaId) !== null)
    .map((passage) => world.areas.find((area) => area.id === otherEnd(passage, areaId)))
    .filter((area): area is AreaDefinition => Boolean(area && known.has(area.id)))
}
