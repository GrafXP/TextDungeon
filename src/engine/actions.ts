import type { GameSave } from '../domain/game'
import type { InteractionDefinition, ItemDefinition, PassageDefinition, WorldDefinition } from '../domain/content'
import { evaluateRequirement } from './requirements'

export type GameAction =
  | { type: 'MOVE'; passageId: string; toAreaId: string }
  | { type: 'INSPECT'; areaId: string }
  | { type: 'TAKE_ITEM'; interactionId: string }
  | { type: 'OPEN_CHEST'; interactionId: string }
  | { type: 'COMPLETE_INTERACTION'; interactionId: string }
  | { type: 'USE_ITEM'; itemId: string }
  | { type: 'EQUIP_WEAPON'; itemId: string }

export interface AvailableAction {
  id: string
  kind: 'inspect' | 'interaction' | 'move'
  label: string
  description: string
  icon: string
  disabled: boolean
  blockedReason?: string
  gameAction: GameAction
}

export interface InventoryAction {
  id: string
  label: string
  disabled: boolean
  reason?: string
  gameAction: GameAction
}

export function otherEnd(passage: PassageDefinition, areaId: string): string | null {
  if (passage.fromAreaId === areaId) return passage.toAreaId
  if (passage.toAreaId === areaId) return passage.fromAreaId
  return null
}

export function isInteractionComplete(interaction: InteractionDefinition, save: GameSave): boolean {
  if (interaction.chestId) return save.openedChestIds.includes(interaction.chestId)
  return save.flags.includes(`interaktion:${interaction.id}`)
}

function interactionIcon(interaction: InteractionDefinition): string {
  if (interaction.actionType === 'OPEN_CHEST') return '▣'
  if (interaction.actionType === 'TAKE_ITEM') return '✦'
  return '◆'
}

export function getAvailableActions(save: GameSave, world: WorldDefinition): AvailableAction[] {
  const area = world.areas.find((entry) => entry.id === save.currentAreaId)
  if (!area) return []

  const inspected = save.flags.includes(`area_untersucht:${area.id}`)
  const actions: AvailableAction[] = [
    {
      id: `inspect:${area.id}`,
      kind: 'inspect',
      label: inspected ? 'Untersuche den Ort erneut' : 'Untersuche den Ort',
      description: inspected ? 'Sieh noch einmal genau hin.' : 'Suche nach Spuren und nützlichen Einzelheiten.',
      icon: '⌖',
      disabled: false,
      gameAction: { type: 'INSPECT', areaId: area.id }
    }
  ]

  for (const interaction of world.interactions.filter((entry) => entry.areaId === area.id)) {
    if (isInteractionComplete(interaction, save)) continue
    const requirement = evaluateRequirement(interaction.requirement, save)
    actions.push({
      id: `interaction:${interaction.id}`,
      kind: 'interaction',
      label: interaction.label,
      description: interaction.description,
      icon: interactionIcon(interaction),
      disabled: !requirement.met,
      blockedReason: requirement.met ? undefined : interaction.blockedText ?? 'Dafür fehlt dir noch etwas.',
      gameAction: { type: interaction.actionType, interactionId: interaction.id }
    })
  }

  for (const passage of world.passages.filter((entry) => otherEnd(entry, area.id) !== null)) {
    const destinationId = otherEnd(passage, area.id)
    if (!destinationId) continue
    const requirement = evaluateRequirement(passage.requirement, save)
    const manuallyUnlocked = save.unlockedPassageIds.includes(passage.id)
    const destination = world.areas.find((entry) => entry.id === destinationId)
    actions.push({
      id: `move:${passage.id}`,
      kind: 'move',
      label: passage.fromAreaId === area.id ? passage.labelFrom : passage.labelTo,
      description: passage.shortcut ? `Abkürzung nach ${destination?.name ?? destinationId}` : destination?.regionName ?? 'Weiterreisen',
      icon: passage.shortcut ? '↯' : '➜',
      disabled: !requirement.met && !manuallyUnlocked,
      blockedReason: requirement.met || manuallyUnlocked ? undefined : passage.blockedText ?? 'Dieser Weg ist noch versperrt.',
      gameAction: { type: 'MOVE', passageId: passage.id, toAreaId: destinationId }
    })
  }

  return actions
}

export function getInventoryActions(save: GameSave, item: ItemDefinition): InventoryAction[] {
  const owned = (save.player.inventory[item.id] ?? 0) > 0
  if (!owned) return []

  if (item.kind === 'weapon' && item.weapon) {
    const inCombat = save.activeCombat !== null
    const equipped = save.player.equippedWeaponId === item.id
    return [{
      id: `equip:${item.id}`,
      label: equipped ? 'Ausgerüstet' : 'Ausrüsten',
      disabled: inCombat || equipped,
      reason: inCombat ? 'Während eines Kampfes kannst du die Waffe nicht wechseln.' : equipped ? 'Diese Waffe ist bereits ausgerüstet.' : undefined,
      gameAction: { type: 'EQUIP_WEAPON', itemId: item.id }
    }]
  }

  if (item.kind === 'healing' && item.healing) {
    const inCombat = save.activeCombat !== null
    const fullLife = save.player.life >= save.player.maxLife
    return [{
      id: `use:${item.id}`,
      label: 'Benutzen',
      disabled: inCombat || fullLife,
      reason: inCombat ? 'Gegenstände im Kampf folgen mit Phase 4.' : fullLife ? 'Deine Lebenspunkte sind bereits voll.' : undefined,
      gameAction: { type: 'USE_ITEM', itemId: item.id }
    }]
  }

  return []
}
