import type { InteractionDefinition, Requirement } from '../../domain/content'

export const cardNotes: Record<string, string> = {
  karte_mut: 'Alva hatte vor ihrem ersten Kampf ebenfalls Angst. Mut hiess für sie, trotzdem um Hilfe zu bitten.',
  karte_arbor: 'Arbor pflanzte mit Alva neue Bäume. Der Hüter der Wurzeln war ihr Freund, kein Feind.',
  karte_marea: 'Marea sammelte Geschichten von Reisenden. Alva hörte ihr stundenlang zu.',
  karte_voltaro: 'Voltaro trug Nachrichten zwischen den Regionen, niemals Krieger.',
  karte_kompass: 'Kuno führte Alva einmal in einen Besenschrank. Auch ein Kompass darf sich irren.',
  karte_rueckgabe: 'Alva holte die Morgenklinge Jahre nach dem ersten Sieg zurück und gab sie an den Tempel. Rückkehr gehörte immer zum Versprechen.'
}
const cardRequirements: Requirement[] = Object.keys(cardNotes).map((clueId) => ({ kind: 'clue', clueId }))
export const campaignExtras: InteractionDefinition[] = [
  {
    id: 'tessa_kartenstift', areaId: 'sonnenwacht', actionType: 'COMPLETE_INTERACTION', label: 'Zeige Tessa deinen Kartenrand',
    description: 'Tessa kennt Alvas alte Kartenschrift.', resultText: 'Tessa überreicht dir Alvas Kartenstift. «Die Ränder erzählen, wer mit ihr ging.» Benutze den Stift im Inventar, um eine verborgene Kartennotiz sichtbar zu machen.',
    requirement: { kind: 'any', requirements: cardRequirements }, blockedText: 'Finde zuerst einen von Alvas sechs Kartenrändern.',
    effects: [{ kind: 'addItem', itemId: 'kartenstift', quantity: 1 }]
  },
  {
    id: 'wandbild_benennen', areaId: 'morgen_tempel', actionType: 'COMPLETE_INTERACTION', label: 'Benenne die Wächter auf dem Wandbild',
    description: 'Die drei Inschriften erzählen, wer Alva wirklich begleitete.', resultText: 'Arbor, Marea und Voltaro: Kuno nennt jeden Namen. «Sie ging nie allein.» Die Namen stehen nun unter dem alten Wandbild.',
    requirement: { kind: 'all', requirements: ['wurzelheiligtum', 'gezeitentempel', 'gewitterturm'].map((id) => ({ kind: 'flag', flag: `area_untersucht:${id}` })) }, blockedText: 'Untersuche die Inschriften im Wurzelheiligtum, Gezeitentempel und Gewitterturm.',
    effects: [{ kind: 'setFlag', flag: 'wandbild_benannt' }]
  },
  {
    id: 'kinder_nachspiel', areaId: 'drei_wege_platz', actionType: 'COMPLETE_INTERACTION', label: 'Höre den drei Kindern zu',
    description: 'Auf dem Platz drehen sich ein Windrad und kleine Segel im Morgenwind.', resultText: 'Ein Kind erzählt vom Vogel im reparierten Haus, eines vom wieder fahrenden Boot und eines vom Windrad. «Du hast unsere kleinen Dinge nicht vergessen.»',
    requirement: { kind: 'all', requirements: ['raugrim_verbannt', 'vogelhaus_repariert', 'spielzeugboot_repariert', 'windrad_repariert'].map((flag) => ({ kind: 'flag', flag })) }, blockedText: 'Repariere Vogelhaus, Spielzeugboot und Windrad. Nach der Verbannung treffen sich die Kinder hier.',
    effects: [{ kind: 'setFlag', flag: 'kinder_angehoert' }]
  },
  {
    id: 'tessa_vollstaendige_karte', areaId: 'sonnenwacht', actionType: 'COMPLETE_INTERACTION', label: 'Setze mit Tessa die Karte zusammen',
    description: 'Sechs Kartenränder ergeben Alvas ganze Reise.', resultText: 'Tessa glättet die Ränder. «Jetzt ist nicht nur der Weg vollständig. Auch die Geschichte ist es.» Auf deiner Karte sind alle Orte Taloras sichtbar.',
    requirement: { kind: 'all', requirements: [{ kind: 'flag', flag: 'raugrim_verbannt' }, ...cardRequirements] }, blockedText: 'Bringe Tessa nach der Verbannung alle sechs Kartenränder.',
    effects: [{ kind: 'setFlag', flag: 'karte_vollstaendig' }]
  }
]
