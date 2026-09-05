import { describe, expect, it } from 'vitest'
import { phase2World } from '../content/world'
import { simulateCampaignBalance } from './balanceSimulation'

describe('Kampagnenbalance', () => {
  it.each([1, 42, 999_983])('bleibt mit der erklärten Grundstrategie für Startwert %s gewinnbar', (seed) => {
    const results = simulateCampaignBalance(phase2World, seed)

    expect(results).toHaveLength(14)
    expect(results.filter((entry) => !entry.won)).toEqual([])
    expect(Math.max(...results.map((entry) => entry.turns))).toBeLessThan(80)
  })
})
