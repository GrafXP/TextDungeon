import {
  CONTENT_VERSION,
  SAVE_SCHEMA_VERSION,
  type CombatState,
  type GameEvent,
  type GameSave,
  type PuzzleState
} from '../domain/game'
import {
  DEFAULT_SETTINGS,
  SETTINGS_SCHEMA_VERSION,
  type AppSettings,
  type TextSize
} from '../domain/settings'

export class DataValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataValidationError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) throw new DataValidationError(`${path} ist kein gültiges Objekt.`)
  return value
}

function requireString(value: unknown, path: string, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && value.trim() === '')) {
    throw new DataValidationError(`${path} muss Text enthalten.`)
  }
  return value
}

function requireFiniteNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new DataValidationError(`${path} muss eine gültige Zahl sein.`)
  }
  return value
}

function requireNonNegativeInteger(value: unknown, path: string): number {
  const number = requireFiniteNumber(value, path)
  if (!Number.isInteger(number) || number < 0) {
    throw new DataValidationError(`${path} muss eine nicht-negative ganze Zahl sein.`)
  }
  return number
}

function requireStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) throw new DataValidationError(`${path} muss eine Liste sein.`)
  return value.map((entry, index) => requireString(entry, `${path}[${index}]`))
}

function requireStringMap(value: unknown, path: string): Record<string, number> {
  const record = requireRecord(value, path)
  return Object.fromEntries(
    Object.entries(record).map(([key, count]) => [key, requireNonNegativeInteger(count, `${path}.${key}`)])
  )
}

function parsePuzzleStates(value: unknown): Record<string, PuzzleState> {
  const states = requireRecord(value, 'puzzleStates')
  return Object.fromEntries(
    Object.entries(states).map(([id, stateValue]) => {
      const state = requireRecord(stateValue, `puzzleStates.${id}`)
      const values = requireRecord(state.values, `puzzleStates.${id}.values`)
      for (const [key, entry] of Object.entries(values)) {
        if (!['string', 'number', 'boolean'].includes(typeof entry)) {
          throw new DataValidationError(`puzzleStates.${id}.values.${key} hat einen unbekannten Wert.`)
        }
      }
      return [id, { kind: requireString(state.kind, `puzzleStates.${id}.kind`), values } as PuzzleState]
    })
  )
}

function parseEvents(value: unknown): GameEvent[] {
  if (!Array.isArray(value)) throw new DataValidationError('recentEvents muss eine Liste sein.')
  return value.slice(-50).map((entry, index) => {
    const event = requireRecord(entry, `recentEvents[${index}]`)
    return {
      id: requireString(event.id, `recentEvents[${index}].id`),
      text: requireString(event.text, `recentEvents[${index}].text`),
      turn: requireNonNegativeInteger(event.turn, `recentEvents[${index}].turn`)
    }
  })
}

function parseCombat(value: unknown): CombatState | null {
  if (value === null) return null
  const combat = requireRecord(value, 'activeCombat')
  return {
    encounterId: requireString(combat.encounterId, 'activeCombat.encounterId'),
    enemyLife: requireNonNegativeInteger(combat.enemyLife, 'activeCombat.enemyLife'),
    phase: requireNonNegativeInteger(combat.phase, 'activeCombat.phase'),
    announcedMoveId: requireString(combat.announcedMoveId, 'activeCombat.announcedMoveId')
  }
}

function migrateLegacySave(value: Record<string, unknown>): Record<string, unknown> {
  const version = value.schemaVersion
  if (version === SAVE_SCHEMA_VERSION) return value
  if (version !== 0 && version !== 1) {
    throw new DataValidationError(`Spielstand-Version ${String(version)} wird nicht unterstützt.`)
  }

  const legacyPlayer = isRecord(value.player) ? value.player : {}

  return {
    ...value,
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    previousAreaId: value.previousAreaId ?? null,
    player: {
      ...legacyPlayer,
      equippedWeaponId: legacyPlayer.equippedWeaponId ?? 'reiseschwert',
      inventory: {
        reiseschwert: 1,
        laterne: 1,
        apfelbrot: 3,
        ...(isRecord(legacyPlayer.inventory) ? legacyPlayer.inventory : {})
      }
    },
    openedChestIds: value.openedChestIds ?? [],
    defeatedEncounterIds: value.defeatedEncounterIds ?? [],
    unlockedPassageIds: value.unlockedPassageIds ?? [],
    completedQuestSteps: value.completedQuestSteps ?? [],
    discoveredClueIds: value.discoveredClueIds ?? [],
    deliveredDialogueIds: value.deliveredDialogueIds ?? [],
    puzzleStates: value.puzzleStates ?? {},
    flags: value.flags ?? [],
    activeCombat: value.activeCombat ?? null,
    recentEvents: value.recentEvents ?? [],
    turn: value.turn ?? 0
  }
}

export function migrateAndValidateGameSave(value: unknown): GameSave {
  const source = migrateLegacySave(requireRecord(value, 'Spielstand'))
  const player = requireRecord(source.player, 'player')
  const life = requireNonNegativeInteger(player.life, 'player.life')
  const maxLife = requireNonNegativeInteger(player.maxLife, 'player.maxLife')
  if (maxLife < 1 || life > maxLife) {
    throw new DataValidationError('Die Lebenspunkte im Spielstand sind ungültig.')
  }
  const equipped = player.equippedWeaponId
  if (equipped !== null && typeof equipped !== 'string') {
    throw new DataValidationError('player.equippedWeaponId ist ungültig.')
  }
  const inventory = requireStringMap(player.inventory, 'player.inventory')
  if (equipped !== null && (inventory[equipped] ?? 0) < 1) {
    throw new DataValidationError('Die ausgerüstete Waffe fehlt im Inventar.')
  }
  const previous = source.previousAreaId
  if (previous !== null && typeof previous !== 'string') {
    throw new DataValidationError('previousAreaId ist ungültig.')
  }

  const save: GameSave = {
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: requireNonNegativeInteger(source.contentVersion, 'contentVersion'),
    runId: requireString(source.runId, 'runId'),
    playerName: requireString(source.playerName, 'playerName'),
    currentAreaId: requireString(source.currentAreaId, 'currentAreaId'),
    previousAreaId: previous,
    player: {
      life,
      maxLife,
      equippedWeaponId: equipped,
      inventory
    },
    visitedAreaIds: requireStringArray(source.visitedAreaIds, 'visitedAreaIds'),
    openedChestIds: requireStringArray(source.openedChestIds, 'openedChestIds'),
    defeatedEncounterIds: requireStringArray(source.defeatedEncounterIds, 'defeatedEncounterIds'),
    unlockedPassageIds: requireStringArray(source.unlockedPassageIds, 'unlockedPassageIds'),
    completedQuestSteps: requireStringArray(source.completedQuestSteps, 'completedQuestSteps'),
    discoveredClueIds: requireStringArray(source.discoveredClueIds, 'discoveredClueIds'),
    deliveredDialogueIds: requireStringArray(source.deliveredDialogueIds, 'deliveredDialogueIds'),
    puzzleStates: parsePuzzleStates(source.puzzleStates),
    flags: requireStringArray(source.flags, 'flags'),
    lastSanctuaryId: requireString(source.lastSanctuaryId, 'lastSanctuaryId'),
    activeCombat: parseCombat(source.activeCombat),
    recentEvents: parseEvents(source.recentEvents),
    rngState: requireNonNegativeInteger(source.rngState, 'rngState'),
    turn: requireNonNegativeInteger(source.turn, 'turn')
  }

  if (!save.visitedAreaIds.includes(save.currentAreaId)) {
    throw new DataValidationError('Der aktuelle Ort fehlt in den besuchten Orten.')
  }
  if (save.contentVersion > CONTENT_VERSION) {
    throw new DataValidationError(`Inhaltsversion ${save.contentVersion} ist neuer als diese App.`)
  }
  return save
}

export function validateSettings(value: unknown): AppSettings {
  const settings = requireRecord(value, 'Einstellungen')
  if (settings.schemaVersion !== 1 && settings.schemaVersion !== SETTINGS_SCHEMA_VERSION) {
    throw new DataValidationError('Die Einstellungs-Version wird nicht unterstützt.')
  }
  const textSizes: TextSize[] = ['normal', 'gross', 'sehr-gross']
  if (!textSizes.includes(settings.textSize as TextSize)) {
    throw new DataValidationError('Die Textgrösse ist ungültig.')
  }
  for (const key of ['highContrast', 'reducedMotion', 'soundEnabled'] as const) {
    if (typeof settings[key] !== 'boolean') throw new DataValidationError(`${key} ist ungültig.`)
  }
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    textSize: settings.textSize as TextSize,
    highContrast: settings.highContrast as boolean,
    reducedMotion: settings.reducedMotion as boolean,
    soundEnabled: settings.soundEnabled as boolean
  }
}

export function settingsOrDefaults(value: unknown): AppSettings {
  if (value === undefined) return DEFAULT_SETTINGS
  return validateSettings(value)
}

export function parseSaveImport(json: string): GameSave {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new DataValidationError('Die Datei enthält kein gültiges JSON.')
  }
  if (isRecord(parsed) && parsed.format === 'textdungeon-save') {
    return migrateAndValidateGameSave(parsed.adventure)
  }
  return migrateAndValidateGameSave(parsed)
}

export function createSaveExport(save: GameSave): string {
  return JSON.stringify(
    {
      format: 'textdungeon-save',
      formatVersion: 1,
      exportedAt: new Date().toISOString(),
      adventure: migrateAndValidateGameSave(save)
    },
    null,
    2
  )
}
