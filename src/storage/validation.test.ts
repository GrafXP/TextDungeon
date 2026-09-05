import { describe, expect, it } from 'vitest'
import { CONTENT_VERSION, createNewGame, SAVE_SCHEMA_VERSION } from '../domain/game'
import { SETTINGS_SCHEMA_VERSION } from '../domain/settings'
import {
  createSaveExport,
  DataValidationError,
  migrateAndValidateGameSave,
  parseSaveImport,
  validateSettings
} from './validation'

describe('Spielstandprüfung', () => {
  it('akzeptiert einen neuen Spielstand und einen eigenen Namen', () => {
    const save = createNewGame('  Mira  ')
    const validated = migrateAndValidateGameSave(save)

    expect(validated.playerName).toBe('Mira')
    expect(validated.currentAreaId).toBe('sonnenwacht')
    expect(validated.player.life).toBe(20)
  })

  it('migriert einen Spielstand der Version 0 ohne Fortschritt zu verlieren', () => {
    const current = createNewGame('Noah')
    const legacy = {
      ...current,
      schemaVersion: 0,
      flags: undefined,
      recentEvents: undefined
    }

    const migrated = migrateAndValidateGameSave(legacy)

    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.playerName).toBe('Noah')
    expect(migrated.flags).toEqual([])
    expect(migrated.recentEvents).toEqual([])
  })

  it('ergänzt bei Phase-1-Spielständen die Startausrüstung', () => {
    const current = createNewGame('Kim')
    const phaseOne = {
      ...current,
      schemaVersion: 1,
      contentVersion: 1,
      player: { ...current.player, equippedWeaponId: null, inventory: {} }
    }

    const migrated = migrateAndValidateGameSave(phaseOne)

    expect(migrated.contentVersion).toBe(CONTENT_VERSION)
    expect(migrated.player.equippedWeaponId).toBe('reiseschwert')
    expect(migrated.player.inventory).toMatchObject({ reiseschwert: 1, laterne: 1, apfelbrot: 3 })
  })

  it('lehnt Lebenspunkte ausserhalb des gültigen Bereichs ab', () => {
    const save = createNewGame('Lina')
    save.player.life = 21

    expect(() => migrateAndValidateGameSave(save)).toThrow(DataValidationError)
  })

  it('lehnt eine ausgerüstete Waffe ab, die nicht im Inventar liegt', () => {
    const save = createNewGame('Lina')
    save.player.inventory = { laterne: 1 }

    expect(() => migrateAndValidateGameSave(save)).toThrow('ausgerüstete Waffe fehlt')
  })

  it('exportiert und importiert ein geprüftes Dateiformat', () => {
    const save = createNewGame('Sam')
    const imported = parseSaveImport(createSaveExport(save))

    expect(imported).toEqual(save)
  })

  it('meldet unlesbares JSON verständlich', () => {
    expect(() => parseSaveImport('{kaputt')).toThrow('kein gültiges JSON')
  })

  it('entfernt die alte Vorleseeinstellung bei der Einstellungsmigration', () => {
    const migrated = validateSettings({
      schemaVersion: 1,
      textSize: 'gross',
      highContrast: false,
      reducedMotion: true,
      readAloud: true,
      soundEnabled: false
    })

    expect(migrated.schemaVersion).toBe(SETTINGS_SCHEMA_VERSION)
    expect(migrated).not.toHaveProperty('readAloud')
  })
})
