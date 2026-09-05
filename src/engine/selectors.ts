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
  return save.deliveredDialogueIds.includes(`area_intro:${area.id}`)
    ? area.revisitDescription
    : area.firstDescription
}

export function getKnownAreaIds(save: GameSave, world: WorldDefinition): string[] {
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
  const hasKey = (save.player.inventory.archivschluessel ?? 0) > 0
  const archiveOpen = save.flags.includes('archiv_geoeffnet')
  const hasLever = (save.player.inventory.hebelstange ?? 0) > 0
  const wheelFound = save.flags.includes('schleusenrad_geborgen')
  const finished = save.flags.includes('phase2_abgeschlossen')

  return [
    {
      id: 'archiv',
      title: archiveOpen ? 'Das Kartenarchiv ist offen' : hasKey ? 'Öffne das Kartenarchiv' : 'Finde den Archivschlüssel',
      description: archiveOpen ? 'Du hast den Sonnenspiegel gefunden.' : hasKey ? 'Der Schlüssel passt zur grünen Tür in der Versunkenen Bibliothek.' : 'Die Symbolsteine im Garten der Namen verbergen einen Hinweis.',
      done: archiveOpen,
      current: !archiveOpen,
      hint: hasKey ? 'Reise über den Küstenpfad zum Muschelhafen und zur Bibliothek.' : 'Untersuche die vier Symbolsteine genau.'
    },
    {
      id: 'schleusenrad',
      title: wheelFound ? 'Das Schleusenrad ist geborgen' : hasLever ? 'Berge das Schleusenrad' : 'Finde einen stabilen Hebel',
      description: wheelFound ? 'Das Rad kann später im Schleusenhaus eingesetzt werden.' : hasLever ? 'Am überfluteten Markt liegt etwas unter einem schweren Stand.' : 'Im Alten Markt wurde eine lange eiserne Stange zurückgelassen.',
      done: wheelFound,
      current: archiveOpen && !wheelFound,
      hint: hasLever ? 'Unter der Kante des umgestürzten Stands ist Platz für die Hebelstange.' : 'Sieh dich zwischen den Kisten am Alten Markt um.'
    },
    {
      id: 'tempel',
      title: finished ? 'Die erste Erkundung ist geschafft' : 'Markiere den Gezeitentempel',
      description: finished ? 'Taloras nächste Wege können nun vorbereitet werden.' : 'Erkunde beide Hinweise und finde danach den gefährlichen Tempel hinter der Bibliothek.',
      done: finished,
      current: archiveOpen && wheelFound && !finished,
      hint: 'Von der Versunkenen Bibliothek führt ein Weg weiter zum Gezeitentempel.'
    }
  ]
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
