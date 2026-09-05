import type { Requirement, WorldDefinition } from '../domain/content'
import { requirementItemIds } from './requirements'

export interface ValidationReport {
  valid: boolean
  errors: string[]
  reachableAreaIds: string[]
  sliceGoalReachable: boolean
}

function duplicateIds(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}

function requirementMet(requirement: Requirement | undefined, items: Set<string>, flags: Set<string>): boolean {
  if (!requirement) return true
  if (requirement.kind === 'item') return items.has(requirement.itemId)
  if (requirement.kind === 'flag') return flags.has(requirement.flag)
  if (requirement.kind === 'all') return requirement.requirements.every((entry) => requirementMet(entry, items, flags))
  return requirement.requirements.some((entry) => requirementMet(entry, items, flags))
}

function validateRequirement(requirement: Requirement | undefined, itemIds: Set<string>, owner: string, errors: string[]) {
  if (!requirement) return
  if (requirement.kind === 'item' && !itemIds.has(requirement.itemId)) {
    errors.push(`${owner} verlangt den unbekannten Gegenstand ${requirement.itemId}.`)
  }
  if (requirement.kind === 'all' || requirement.kind === 'any') {
    if (requirement.requirements.length === 0) errors.push(`${owner} enthält eine leere ${requirement.kind}-Anforderung.`)
    requirement.requirements.forEach((entry) => validateRequirement(entry, itemIds, owner, errors))
  }
}

function graphReachability(world: WorldDefinition): Set<string> {
  const reachable = new Set([world.startAreaId])
  let changed = true
  while (changed) {
    changed = false
    for (const passage of world.passages) {
      if (reachable.has(passage.fromAreaId) && !reachable.has(passage.toAreaId)) {
        reachable.add(passage.toAreaId)
        changed = true
      }
      if (reachable.has(passage.toAreaId) && !reachable.has(passage.fromAreaId)) {
        reachable.add(passage.fromAreaId)
        changed = true
      }
    }
  }
  return reachable
}

function simulateProgression(world: WorldDefinition) {
  const reachable = new Set([world.startAreaId])
  const items = new Set(['reiseschwert', 'laterne', 'apfelbrot'])
  const flags = new Set<string>()
  const completedInteractions = new Set<string>()
  let changed = true

  while (changed) {
    changed = false
    for (const areaId of [...reachable]) flags.add(`area_untersucht:${areaId}`)

    for (const interaction of world.interactions) {
      if (completedInteractions.has(interaction.id) || !reachable.has(interaction.areaId)) continue
      if (!requirementMet(interaction.requirement, items, flags)) continue
      completedInteractions.add(interaction.id)
      for (const effect of interaction.effects) {
        if (effect.kind === 'addItem' && !items.has(effect.itemId)) {
          items.add(effect.itemId)
          changed = true
        }
        if (effect.kind === 'setFlag' && !flags.has(effect.flag)) {
          flags.add(effect.flag)
          changed = true
        }
      }
    }

    for (const passage of world.passages) {
      if (!requirementMet(passage.requirement, items, flags)) continue
      if (reachable.has(passage.fromAreaId) && !reachable.has(passage.toAreaId)) {
        reachable.add(passage.toAreaId)
        changed = true
      }
      if (reachable.has(passage.toAreaId) && !reachable.has(passage.fromAreaId)) {
        reachable.add(passage.fromAreaId)
        changed = true
      }
    }
  }
  return { reachable, flags }
}

export function validateWorld(world: WorldDefinition): ValidationReport {
  const errors: string[] = []
  const areaIds = new Set(world.areas.map((entry) => entry.id))
  const itemIds = new Set(world.items.map((entry) => entry.id))
  const passageIds = new Set(world.passages.map((entry) => entry.id))

  for (const [kind, ids] of [
    ['Orts', world.areas.map((entry) => entry.id)],
    ['Passagen', world.passages.map((entry) => entry.id)],
    ['Gegenstands', world.items.map((entry) => entry.id)],
    ['Interaktions', world.interactions.map((entry) => entry.id)]
  ] as const) {
    for (const duplicate of duplicateIds(ids)) errors.push(`Doppelte ${kind}-ID: ${duplicate}.`)
  }

  if (!areaIds.has(world.startAreaId)) errors.push(`Startort ${world.startAreaId} fehlt.`)
  for (const passage of world.passages) {
    if (!areaIds.has(passage.fromAreaId)) errors.push(`${passage.id} beginnt an einem unbekannten Ort: ${passage.fromAreaId}.`)
    if (!areaIds.has(passage.toAreaId)) errors.push(`${passage.id} endet an einem unbekannten Ort: ${passage.toAreaId}.`)
    if (passage.fromAreaId === passage.toAreaId) errors.push(`${passage.id} verbindet einen Ort mit sich selbst.`)
    validateRequirement(passage.requirement, itemIds, `Passage ${passage.id}`, errors)
  }

  const chestIds = world.interactions.flatMap((entry) => entry.chestId ? [entry.chestId] : [])
  for (const duplicate of duplicateIds(chestIds)) errors.push(`Doppelte Truhen-ID: ${duplicate}.`)

  for (const interaction of world.interactions) {
    if (!areaIds.has(interaction.areaId)) errors.push(`${interaction.id} liegt an einem unbekannten Ort: ${interaction.areaId}.`)
    if (interaction.actionType === 'OPEN_CHEST' && !interaction.chestId) errors.push(`${interaction.id} ist eine Truhe ohne Truhen-ID.`)
    validateRequirement(interaction.requirement, itemIds, `Interaktion ${interaction.id}`, errors)
    const requiredItems = new Set(requirementItemIds(interaction.requirement))
    for (const effect of interaction.effects) {
      if (effect.kind === 'addItem' && !itemIds.has(effect.itemId)) errors.push(`${interaction.id} vergibt den unbekannten Gegenstand ${effect.itemId}.`)
      if (effect.kind === 'unlockPassage' && !passageIds.has(effect.passageId)) errors.push(`${interaction.id} öffnet die unbekannte Passage ${effect.passageId}.`)
      if (effect.kind === 'addItem' && requiredItems.has(effect.itemId)) errors.push(`${interaction.id} sperrt ${effect.itemId} hinter demselben Gegenstand ein.`)
    }
  }

  for (const item of world.items) {
    if (item.kind === 'weapon') {
      if (!item.weapon) {
        errors.push(`Waffe ${item.id} hat keine Schadenswerte.`)
      } else if (!Number.isInteger(item.weapon.minDamage) || !Number.isInteger(item.weapon.maxDamage) || item.weapon.minDamage < 1 || item.weapon.maxDamage < item.weapon.minDamage) {
        errors.push(`Waffe ${item.id} hat einen ungültigen Schadensbereich.`)
      }
    }
    if (item.kind === 'healing') {
      if (!item.healing || !Number.isInteger(item.healing.lifeRestored) || item.healing.lifeRestored < 1) {
        errors.push(`Heilgegenstand ${item.id} hat keine gültige Heilwirkung.`)
      }
    }
  }

  const connected = graphReachability(world)
  for (const area of world.areas) {
    if (!connected.has(area.id)) errors.push(`Ort ${area.id} ist nicht mit dem Startgraphen verbunden.`)
  }

  const simulated = simulateProgression(world)
  const sliceGoalReachable = simulated.flags.has(world.sliceGoalFlag)
  if (!sliceGoalReachable) errors.push(`Das Ziel ${world.sliceGoalFlag} ist mit den Inhaltsdaten nicht lösbar.`)

  return {
    valid: errors.length === 0,
    errors,
    reachableAreaIds: [...simulated.reachable],
    sliceGoalReachable
  }
}

export function assertWorldValid(world: WorldDefinition): void {
  const report = validateWorld(world)
  if (!report.valid) throw new Error(`Ungültige Weltdaten:\n${report.errors.join('\n')}`)
}
