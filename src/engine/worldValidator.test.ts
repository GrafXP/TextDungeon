import { describe, expect, it } from 'vitest'
import { phase2World } from '../content/world'
import type { WorldDefinition } from '../domain/content'
import { validateWorld } from './worldValidator'

describe('Weltvalidator', () => {
  it('bestätigt zehn verbundene und lösbare Testorte', () => {
    const report = validateWorld(phase2World)

    expect(phase2World.areas).toHaveLength(10)
    expect(report.valid).toBe(true)
    expect(report.reachableAreaIds).toHaveLength(10)
    expect(report.sliceGoalReachable).toBe(true)
  })

  it('findet Ausgänge ohne Ziel', () => {
    const broken: WorldDefinition = {
      ...phase2World,
      passages: [...phase2World.passages, {
        id: 'kaputt',
        fromAreaId: 'sonnenwacht',
        toAreaId: 'nirgendwo',
        labelFrom: 'Gehe ins Nichts',
        labelTo: 'Kehre zurück'
      }]
    }

    expect(validateWorld(broken).errors).toContain('kaputt endet an einem unbekannten Ort: nirgendwo.')
  })

  it('findet einen Gegenstand hinter seinem eigenen Schloss', () => {
    const broken: WorldDefinition = {
      ...phase2World,
      interactions: [...phase2World.interactions, {
        id: 'selbst_sperre',
        areaId: 'sonnenwacht',
        actionType: 'TAKE_ITEM',
        label: 'Nimm den Schlüssel',
        description: 'Unmöglich.',
        resultText: 'Unmöglich.',
        requirement: { kind: 'item', itemId: 'archivschluessel' },
        effects: [{ kind: 'addItem', itemId: 'archivschluessel', quantity: 1 }]
      }]
    }

    expect(validateWorld(broken).errors).toContain('selbst_sperre sperrt archivschluessel hinter demselben Gegenstand ein.')
  })
})
