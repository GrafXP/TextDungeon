import type { InteractionEffect, WorldDefinition } from '../domain/content'
import type { GameEvent, GameSave } from '../domain/game'
import { evaluateRequirement } from './requirements'
import { isInteractionComplete, otherEnd, type GameAction } from './actions'

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

function withEvent(save: GameSave, text: string, actionKey: string): GameSave {
  const turn = save.turn + 1
  const event: GameEvent = { id: `${save.runId}:${turn}:${actionKey}`, text, turn }
  return { ...save, turn, recentEvents: [...save.recentEvents, event].slice(-8) }
}

function applyEffect(save: GameSave, effect: InteractionEffect): GameSave {
  switch (effect.kind) {
    case 'addItem':
      return {
        ...save,
        player: {
          ...save.player,
          inventory: {
            ...save.player.inventory,
            [effect.itemId]: (save.player.inventory[effect.itemId] ?? 0) + effect.quantity
          }
        }
      }
    case 'setFlag':
      return { ...save, flags: unique([...save.flags, effect.flag]) }
    case 'discoverClue':
      return { ...save, discoveredClueIds: unique([...save.discoveredClueIds, effect.clueId]) }
    case 'unlockPassage':
      return { ...save, unlockedPassageIds: unique([...save.unlockedPassageIds, effect.passageId]) }
  }
}

export function reduceGame(save: GameSave, action: GameAction, world: WorldDefinition): GameSave {
  if (action.type === 'MOVE') {
    const passage = world.passages.find((entry) => entry.id === action.passageId)
    if (!passage || otherEnd(passage, save.currentAreaId) !== action.toAreaId) return save
    const requirement = evaluateRequirement(passage.requirement, save)
    if (!requirement.met && !save.unlockedPassageIds.includes(passage.id)) return save
    const destination = world.areas.find((entry) => entry.id === action.toAreaId)
    if (!destination) return save

    const moved: GameSave = {
      ...save,
      currentAreaId: destination.id,
      previousAreaId: save.currentAreaId,
      visitedAreaIds: unique([...save.visitedAreaIds, destination.id]),
      deliveredDialogueIds: unique([...save.deliveredDialogueIds, `area_intro:${save.currentAreaId}`]),
      lastSanctuaryId: destination.safe ? destination.id : save.lastSanctuaryId
    }
    return withEvent(moved, `Du erreichst ${destination.name}.`, `move:${passage.id}`)
  }

  if (action.type === 'INSPECT') {
    if (action.areaId !== save.currentAreaId) return save
    const area = world.areas.find((entry) => entry.id === action.areaId)
    if (!area) return save
    const inspected: GameSave = {
      ...save,
      flags: unique([...save.flags, `area_untersucht:${area.id}`]),
      discoveredClueIds: unique([...save.discoveredClueIds, `ort:${area.id}`])
    }
    return withEvent(inspected, area.inspectText, `inspect:${area.id}`)
  }

  if (action.type === 'USE_ITEM') {
    const item = world.items.find((entry) => entry.id === action.itemId)
    const quantity = save.player.inventory[action.itemId] ?? 0
    if (!item?.healing || item.kind !== 'healing' || quantity < 1 || save.activeCombat || save.player.life >= save.player.maxLife) return save

    const restored = Math.min(item.healing.lifeRestored, save.player.maxLife - save.player.life)
    const inventory = { ...save.player.inventory }
    if (quantity === 1) delete inventory[action.itemId]
    else inventory[action.itemId] = quantity - 1
    const healed: GameSave = {
      ...save,
      player: { ...save.player, life: save.player.life + restored, inventory }
    }
    return withEvent(healed, `Du benutzt ${item.name} und erhältst ${restored} Lebenspunkte zurück.`, `use:${item.id}`)
  }

  if (action.type === 'EQUIP_WEAPON') {
    const item = world.items.find((entry) => entry.id === action.itemId)
    if (!item?.weapon || item.kind !== 'weapon' || (save.player.inventory[action.itemId] ?? 0) < 1 || save.activeCombat || save.player.equippedWeaponId === item.id) return save
    const equipped: GameSave = {
      ...save,
      player: { ...save.player, equippedWeaponId: item.id }
    }
    return withEvent(equipped, `Du rüstest ${item.name} aus.`, `equip:${item.id}`)
  }

  const interaction = world.interactions.find((entry) => entry.id === action.interactionId)
  if (!interaction || interaction.areaId !== save.currentAreaId) return save
  if (interaction.actionType !== action.type || isInteractionComplete(interaction, save)) return save
  if (!evaluateRequirement(interaction.requirement, save).met) return save

  let next = save
  for (const effect of interaction.effects) next = applyEffect(next, effect)
  if (interaction.chestId) {
    next = { ...next, openedChestIds: unique([...next.openedChestIds, interaction.chestId]) }
  } else {
    next = { ...next, flags: unique([...next.flags, `interaktion:${interaction.id}`]) }
  }
  return withEvent(next, interaction.resultText, `interaction:${interaction.id}`)
}
