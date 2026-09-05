import type { AreaId, ChestId, ClueId, GameFlag, ItemId, PassageId } from './game'

export type RegionId = 'sonnenmark' | 'spiegelkueste'

export interface MapPosition {
  x: number
  y: number
}

export interface AreaDefinition {
  id: AreaId
  name: string
  regionId: RegionId
  regionName: string
  safe: boolean
  mapPosition: MapPosition
  firstDescription: string
  revisitDescription: string
  inspectText: string
}

export interface PassageDefinition {
  id: PassageId
  fromAreaId: AreaId
  toAreaId: AreaId
  labelFrom: string
  labelTo: string
  requirement?: Requirement
  blockedText?: string
  shortcut?: boolean
}

export type ItemKind = 'weapon' | 'healing' | 'key' | 'tool' | 'quest'

export interface ItemDefinition {
  id: ItemId
  name: string
  description: string
  kind: ItemKind
  weapon?: {
    minDamage: number
    maxDamage: number
    trait: string
  }
  healing?: {
    lifeRestored: number
    extraEffect?: string
  }
}

export type Requirement =
  | { kind: 'item'; itemId: ItemId; quantity?: number }
  | { kind: 'flag'; flag: GameFlag }
  | { kind: 'all'; requirements: Requirement[] }
  | { kind: 'any'; requirements: Requirement[] }

export type InteractionActionType = 'TAKE_ITEM' | 'OPEN_CHEST' | 'COMPLETE_INTERACTION'

export type InteractionEffect =
  | { kind: 'addItem'; itemId: ItemId; quantity: number }
  | { kind: 'setFlag'; flag: GameFlag }
  | { kind: 'discoverClue'; clueId: ClueId }
  | { kind: 'unlockPassage'; passageId: PassageId }

export interface InteractionDefinition {
  id: string
  areaId: AreaId
  actionType: InteractionActionType
  label: string
  description: string
  resultText: string
  requirement?: Requirement
  blockedText?: string
  effects: InteractionEffect[]
  chestId?: ChestId
}

export interface WorldDefinition {
  areas: AreaDefinition[]
  passages: PassageDefinition[]
  items: ItemDefinition[]
  interactions: InteractionDefinition[]
  startAreaId: AreaId
  sliceGoalFlag: GameFlag
}
