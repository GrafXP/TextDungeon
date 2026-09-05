# TextDungeon — Produkt- und Umsetzungsplan

Status: überarbeitet für ein deutschsprachiges Abenteuerspiel für Kinder von 8 bis 12 Jahren.

Prüfstand: 5. September 2026. Geschichte und Welt sowie App-Grundlage, Erkundungs-Vertikalschnitt, Inventar und Schatz aus Phase 1 bis 3 sind implementiert. Zehn verbundene Testorte, typisierte Inhaltsdaten, automatische Spieltests und der Weltvalidator sind vorhanden; Kampf und die vollständige Kampagne folgen in den weiteren Phasen.

Die erste Kampagne, ihre Figuren, Rätselketten, Gegner und 41 Schauplätze sind in der [`STORY_BIBLE.md`](./STORY_BIBLE.md) als Erzähl- und Weltbibel beschrieben.

## 1. Produktentscheidung

TextDungeon wird ein installierbares, lokal gespeichertes Text-Abenteuerspiel. Das Kind erkundet eine grosse zusammenhängende Welt, liest kurze Ortsbeschreibungen, wählt sichtbare Aktionen, sammelt Gegenstände, findet Waffen, öffnet verschlossene Wege und kämpft in verständlichen Runden gegen Monster und Bosse.

Die erste Version richtet sich an Kinder von **8 bis 12 Jahren**. Als Kernzielgruppe gilt ein neugieriges, spielerfahrenes Kind um 10 Jahre, das Abenteuer wie *The Wind Waker*, *A Link to the Past* oder *Breath of the Wild* kennt. Die Geschichte darf geheimnisvoll, überraschend und vielschichtig sein. Sie darf das Kind aber nie durch unklare Ziele, unnötig komplizierte Sätze oder eine Flut von Fantasienamen verlieren.

Grundentscheidungen:

- Die gesamte Spieloberfläche und alle Spieltexte sind auf Deutsch.
- Es wird Schweizer Standardsprache verwendet; das scharfe S wird als `ss` geschrieben.
- Die Bedienung erfolgt in Version 1 über klare Aktionskarten und Richtungsbuttons. Ein freier Texteingabe-Parser kann später als optionaler Klassikmodus folgen.
- Die Welt ist von Hand entworfen. Verbindungen, Schlüssel, Rätselgegenstände, Abkürzungen und Bossfortschritt werden automatisch auf Lösbarkeit geprüft.
- Der Grossteil der Welt ist von Anfang an zugänglich. Die Kinder dürfen gefährliche Orte früh entdecken und lernen, dass gute Vorbereitung zum Abenteuer gehört.
- Das Spiel funktioniert nach dem ersten Laden offline und speichert automatisch auf dem Gerät.
- Es gibt keine Konten, Werbung, Ranglisten, Käufe, Lootboxen oder Pflicht-Internetverbindung.

## 2. Kreative Leitplanken

### Was wir von Zelda-artigen Abenteuern übernehmen

Die genannten Spiele dienen als Inspiration für **Designprinzipien**, nicht für Figuren, Namen, Völker, Gegenstände, Melodien, Bilder oder konkrete Handlungen.

Wir übernehmen:

- eine offene, gut merkbare Welt mit deutlich unterschiedlichen Regionen;
- einen sicheren Ausgangsort und ein zentrales Geheimnis, das früh sichtbar ist;
- Werkzeuge und Gegenstände, die neue Lösungen ermöglichen;
- Tempel, Ruinen, Höhlen, Abkürzungen und optionale Geheimnisse;
- Bosse mit erkennbaren Mustern statt bloss sehr vielen Lebenspunkten;
- eine Mischung aus Staunen, Gefahr, Melancholie und freundlichem Humor;
- eine alte Legende, deren wahre Bedeutung erst beim Erkunden sichtbar wird;
- die Freude, einen gefährlichen Ort früh zu sehen und später gut vorbereitet zurückzukehren.

Wir kopieren ausdrücklich nicht:

- bekannte Zelda-Figuren, Völker, Symbole oder Ortsnamen;
- das Triforce, das Master-Schwert oder dessen konkrete Herkunft und Funktion;
- konkrete Dungeons, Rätsel, Bossdesigns, Melodien oder Bildsprache;
- bestehende Dialoge, Erzählwendungen oder Kartenlayouts.

TextDungeon erhält eine eigenständige Welt, Mythologie und visuelle Identität.

### Ton für 8 bis 12 Jahre

- Ernsthafte Gefahr ist erlaubt, aber ohne Blut, Körperhorror oder grausame Details.
- Monster dürfen gross und unheimlich sein; zwischen spannenden Abschnitten sorgen warmherzige Figuren und kleine Scherze für Luft.
- Die Geschichte spricht Kinder nicht wie Kleinkinder an. Sie vertraut darauf, dass sie Zusammenhänge erkennen können.
- Niederlagen sind Rückschläge, keine Bestrafung. Die Figur wird gerettet oder erwacht am letzten sicheren Ort.
- Regionale Bosse werden von einem dunklen Einfluss befreit statt getötet. Der Weltboss wird verbannt.
- Das Ende ist hoffnungsvoll, ohne zu behaupten, dass danach jedes Problem für immer verschwunden ist.

## 3. Lesbarkeit und Erzählstruktur

### Zwei Verständnisebenen

Die Haupthandlung bleibt jederzeit klar:

1. Finde drei Gaben und erwecke die Morgenklinge.
2. Befreie drei Wächter und erhalte ihre drei Siegel.
3. Öffne damit das letzte Tor und verbanne Raugrim.

Die tiefere Geschichte ist optional erschliessbar:

- Was ist bei der ersten Verbannung wirklich geschehen?
- Warum wurden die drei Wächter zu Bossen?
- Weshalb erzählt die bekannte Heldensage nur einen Teil der Wahrheit?
- Was hat der lebendige Kompass Kuno vergessen?
- Warum kann selbst die heilige Waffe den Weltboss nicht allein besiegen?

Ein Kind kann das Spiel abschliessen, ohne jeden alten Text zu finden. Wer aufmerksam liest, versteht jedoch eine zweite Geschichte über Zusammenarbeit, Verantwortung und falsche Heldensagen.

### Regeln für Spieltexte

- Gegenwart und direkte `Du`-Ansprache.
- Erste Ortsbeschreibung meist 70–140 Wörter; spätere Besuche 25–60 Wörter.
- Absätze mit höchstens drei bis vier kurzen Sätzen.
- Pro Szene höchstens zwei neue Eigennamen.
- Aktionsbeschriftungen beginnen mit einem klaren Verb: „Öffne“, „Gehe“, „Untersuche“, „Benutze“.
- Blockierte Aktionen nennen das sichtbare Problem und geben einen fairen Hinweis.
- Schwierige, aber wichtige Wörter erhalten eine freiwillig aufklappbare Wörterhilfe wie in LeseAbenteuer.
- Nach längeren Pausen zeigt Kuno eine kurze Zusammenfassung: „Du wolltest als Nächstes …“
- Hinweise erscheinen in drei Stufen: Beobachtung, deutlicher Tipp, konkrete Lösung. Das Kind entscheidet selbst, ob es sie öffnet.

Ortswissen und erzählte Erinnerungen erhalten eigene gespeicherte Kennungen. Regionale Erinnerungsbilder funktionieren unabhängig voneinander; die drei grossen Enthüllungen folgen der Anzahl erhaltener Gaben, nicht einer vorgeschriebenen Region. Alle sechs Gabenreihenfolgen und alle sechs Wächterreihenfolgen müssen ohne vorweggenommenes Wissen funktionieren. Gegenstände dürfen vor dem zugehörigen Gespräch gefunden werden; Aufgaben und Dialoge erkennen solche Vorleistungen.

## 4. Erkenntnisse aus LeseAbenteuer und Blitzrechnen

### Technischer Stack

Beide Referenzprojekte verwenden denselben passenden Grundaufbau:

- React 19, TypeScript 7 und Vite 8;
- Vite-PWA mit Manifest und Service Worker;
- Vitest und Testing Library für Logik- und Komponententests;
- Playwright für End-to-End-Tests auf Telefon-, Tablet- und Desktopgrössen;
- eigenes CSS und lokale SVG-/Bilddateien ohne laufzeitabhängiges UI-Framework.

Für TextDungeon wird das robustere Speichermuster aus Blitzrechnen übernommen: ein Repository über IndexedDB, versionierte Datenmigrationen und eine geordnete Speicherwarteschlange. Der Spielstand ist deutlich umfangreicher als der einfache Lesefortschritt aus LeseAbenteuer.

### Oberfläche

Von LeseAbenteuer übernehmen wir:

- die ruhige, buchartige Lesekarte;
- die breite Aufteilung zwischen Atmosphäre und Text auf grossen Bildschirmen;
- grosse Entscheidungskarten mit Symbol, Titel und kurzem Hinweis;
- eine eigene, verschiebbare Kartenansicht aus denselben Welt-Daten;
- gut lesbare Typografie, klare Fokusrahmen und einstellbare Textgrösse.

Von Blitzrechnen übernehmen wir:

- eine kompakte, jederzeit verständliche Statuszeile;
- grosse Touch-Ziele und eine wichtige Entscheidung pro Schritt;
- saubere Lade-, Offline-, Installations- und Fehlerzustände;
- reduzierte Bewegung und hohen Kontrast;
- strikte Trennung zwischen Spiellogik und React-Komponenten.

Die Gestaltung soll abenteuerlich, farbig und geheimnisvoll wirken, aber nicht düster-grau oder wie ein Computerterminal. Das Zielbild ist ein lebendiges Reisetagebuch mit Pergamentflächen, Waldgrün, Wasserblau, Himmelstürkis, Sonnengold und warmen Akzentfarben.

## 5. Kernschleife

1. **Ort betreten:** Name, kurze Beschreibung, sichtbare Ausgänge, Figuren, Truhen und Gefahren erscheinen.
2. **Beobachten:** Das Kind kann Dinge untersuchen und erhält Hinweise auf Rätsel, Gegner oder versteckte Wege.
3. **Handeln:** Reisen, öffnen, nehmen, benutzen, ausrüsten, sprechen, rasten oder kämpfen.
4. **Ergebnis lesen:** Die Engine verändert den Zustand und erzeugt eine kurze erzählerische Folge.
5. **Vorbereiten:** Waffen, Heilgegenstände, Schlüssel und Werkzeuge helfen an anderen Orten.
6. **Zurückkehren:** Neue Gegenstände lösen früh entdeckte Probleme; geöffnete Abkürzungen verbinden die Welt.
7. **Boss bewältigen:** Angriffsmuster lesen, im richtigen Moment verteidigen und die besondere Waffe sinnvoll einsetzen.

```text
Ort lesen → untersuchen → Aktion wählen → Folge verstehen → Welt verändert sich
                              ↓
                         Kampf / Rätsel
                              ↓
                   Gegenstand / Abkürzung / Siegel
```

## 6. Kampagnenstruktur

Die erste Kampagne heisst vorläufig **Die Morgenklinge von Talora**.

### Erste Dreiheit: die Gaben

Die Welt ist früh offen. Durch Erkundungs- und Gegenstandsrätsel entstehen drei Gaben:

- Sonnenfunke;
- Quellträne;
- Windlied.

Alle drei werden im Tempel eingesetzt und erwecken die Morgenklinge. Keine Gabe liegt hinter einem regionalen Boss.

### Zweite Dreiheit: die Siegel

Mit der Morgenklinge können die drei verdorbenen Wächter befreit werden:

- Arbor, der Dornenhirsch — Wurzelsiegel;
- Marea, die Gezeitenschildkröte — Gezeitensiegel;
- Voltaro, der Gewitteradler — Himmelssiegel.

Die Reihenfolge ist frei. Die Siegel öffnen gemeinsam das Tor zum letzten Gebiet und werden während der finalen Verbannung aktiv eingesetzt.

### Zielgrösse der Welt

- 41 Orte in einem sicheren Zentralgebiet, drei grossen Regionen und einem Schlussgebiet;
- mindestens 80 Prozent aller 41 Orte unmittelbar nach dem kurzen Einstieg ohne gelöste Quests betretbar; der konkrete Entwurf erreicht 35 von 41 Orten;
- mehrere Rundwege in jeder Region;
- drei regionsübergreifende Abkürzungen;
- 8–10 normale Gegnertypen;
- 5–6 gewöhnliche Waffen plus Morgenklinge;
- Schlüssel-, Werkzeug-, Kombinations- und Umgebungsrätsel;
- 8–10 Schatztruhen;
- drei regionale Bosse und ein Weltboss;
- optionale Geheimnisse, die Hintergrundgeschichte und kleine Vorteile liefern.

## 7. Welt-, Schloss- und Rätselsystem

### Offene Welt

Vom zentralen Drei-Wege-Platz führen sofort Wege in den Wisperwald, zur Spiegelküste und auf die Donnerhöhe. Der Tempel der Morgenklinge und das Tor der sechs Zeichen sind ebenfalls früh sichtbar.

Die Hauptregionen werden nicht durch die heilige Waffe verriegelt. Gegenstände öffnen vor allem:

- Seitenräume mit Schätzen;
- kürzere Rückwege;
- einzelne Schritte der drei Gabenquests;
- optionale Geschichten;
- sichere Alternativen zu gefährlichen Wegen.

### Anforderungen

Eine gemeinsame Anforderungslogik gilt für Türen, Truhen, Wege und Interaktionen:

- passender Schlüssel im Inventar;
- Werkzeug wie Laterne, Seil oder Hebelstange;
- ein gesetzter Weltzustand, etwa eine reparierte Schleuse;
- ein besiegter oder befreiter Gegner;
- mehrere Bedingungen mit `alle` oder `eine davon`.

Ein wichtiger Schlüssel wird nur verbraucht, wenn dies im Text vorher eindeutig erklärt wird. Ein einmal geöffneter Durchgang bleibt im Spielstand offen.

### Inhaltsprüfung

Vor jedem Produktions-Build prüft ein Weltvalidator:

- doppelte oder fehlende IDs;
- Ausgänge ohne Ziel;
- falsch verbundene Zwei-Wege-Pfade;
- unbekannte Gegenstände, Gegner und Anforderungen;
- unerreichbare Orte;
- Schlüssel, die hinter ihrem eigenen Schloss liegen;
- notwendige Gegenstände hinter Bossen, für die sie selbst benötigt werden;
- versehentlich mehrfach verwendete Truhen oder Begegnungen;
- mindestens einen lösbaren Weg vom Start bis zur Verbannung.

Die Passage-Tabelle in Abschnitt 16 der Erzähl- und Weltbibel ist die verbindliche Grundlage. Sie unterscheidet Ortszugang, gesperrte Interaktionen innerhalb eines Orts und freigeschaltete Abkürzungen. Die Prüfung muss zusätzlich alle sechs Gaben- und alle sechs Wächterreihenfolgen, den frühzeitigen Zugang zu jedem Bossvorraum sowie das Nachspiel nach Abgabe der Morgenklinge abdecken. Eine reine Prüfung, ob alle Ortsnamen verbunden sind, genügt dafür nicht.

Rätselzustände werden gespeichert, etwa Spiegelstellungen oder offene Schleusentore. Untersuchen, Hinweise lesen und Fehlversuche ausserhalb von Kämpfen verbrauchen weder Leben noch Pflichtgegenstände. Rätsel lassen sich kostenlos zurücksetzen; bereits fest eingebaute Teile bleiben erhalten. Die konkreten Anfangsstellungen, erlaubten Aktionen und Lösungen werden vor der Umsetzung des jeweiligen Rätsels als Inhaltsdaten festgelegt.

## 8. Spielfigur und Inventar

### Lebenspunkte

Die Figur hat aktuelle und maximale Lebenspunkte. Beide Werte werden als Zahl und Balken dargestellt. Heilung kann das Maximum nicht überschreiten.

Version 1 verwendet keine Erfahrungspunkte, Klassen, Mana, Rüstungssets oder Talentbäume. Fortschritt entsteht durch Weltwissen, bessere Waffen, nützliche Werkzeuge, offene Abkürzungen und gelöste Aufgaben.

### Inventar

- Stapelbare Heil- und Hilfsgegenstände;
- klar getrennte Schlüssel- und Questgegenstände;
- genau eine ausgerüstete Waffe;
- keine Gewichts- oder Platzbegrenzung in Version 1;
- Gegenstandsansicht mit Beschreibung und den erlaubten Aktionen `Benutzen`, `Ausrüsten` oder `Untersuchen`;
- Questgegenstände können nicht versehentlich weggeworfen oder verbraucht werden.

### Waffen

Jede gewöhnliche Waffe besitzt einen kleinen Schadensbereich und höchstens eine leicht verständliche Eigenschaft, etwa:

- zuverlässig;
- schwer, aber stark;
- gut gegen Panzer;
- schnell nach einer Verteidigung.

Die Morgenklinge ist nicht automatisch gegen jedes normale Monster am stärksten. Ihre besondere Aufgabe ist es, den Schattenpanzer der Wächter und Raugrims Schutz zu durchdringen. So bleiben gefundene Waffen auch später interessant.

## 9. Kampfsystem

Kämpfe sind rundenbasiert und verwenden wenige, klare Aktionen:

- **Angreifen:** mit der ausgerüsteten Waffe;
- **Verteidigen:** verringert den nächsten Treffer und kontert bestimmte angekündigte Angriffe;
- **Gegenstand benutzen:** heilt oder schützt, danach handelt normalerweise der Gegner;
- **Fliehen:** kehrt in den vorherigen sicheren Raum zurück und setzt die Begegnung zurück.

Vor jeder Runde wird der nächste Gegnerzug sichtbar angekündigt. Danach wählt das Kind eine Aktion, die vollständig aufgelöst wird; anschliessend handelt der Gegner genau einmal. Ein gerade besiegter Gegner greift nicht mehr an. Untersuchen, Inventar ansehen und Hinweise lesen verbrauchen keine Runde. Ungültige Aktionen verändern weder Leben noch Zufallszustand. Ausrüsten erfolgt nur ausserhalb eines laufenden Kampfes.

Schaden wird in dieser Reihenfolge berechnet; der Mindestschaden gilt nur bei einem wirksamen Treffer:

```text
Schattenpanzer und keine Morgenklinge: 0 Schaden
Vollständiger Schutz im angekündigten Gegnerzustand: 0 Schaden
Sonst: Grundschaden = max(1, Würfelwert der Waffe + Bonus - Verteidigung des Ziels)
Verteidigendes Ziel: max(1, aufgerundeter halber Grundschaden)
Andernfalls: Grundschaden
```

Gegner kündigen starke Aktionen immer im Text und zusätzlich mit einem verständlichen Symbol an. Kinder sollen gewinnen, weil sie ein Muster erkennen, nicht weil sie zufällig genug Heiltränke besitzen.

Version 1 würfelt nur den Schadenswert, keine zusätzliche Trefferchance. Verwundbare Zeitfenster und vollständiger Schutz folgen sichtbaren Zuständen. Zeitlich begrenzte Effekte haben eine feste Dauer; sie dürfen weder Verteidigen noch Fliehen sperren. Reaktionsfenster nach einer gelungenen Verteidigung bleiben mindestens bis zur nächsten Spieleraktion offen. Bossphasen ändern das Muster, nicht heimlich die Zahl der Gegnerzüge.

### Zu frühe Bosskämpfe

Alle drei Bossräume können vor der Morgenklinge erreicht werden. Der Raum davor warnt deutlich. Betritt das Kind den Kampf trotzdem:

- normale Waffen verursachen am Schattenpanzer keinen Schaden;
- der Kampftext erklärt die Ursache konkret;
- die Aktion **Zieh dich zurück, solange du den Weg kennst** bleibt verfügbar;
- wer bleibt, wird wahrscheinlich besiegt und an den letzten sicheren Ort zurückgebracht;
- Gegenstände, offene Wege und bisherige Erfolge bleiben erhalten.

Mit ausgerüsteter Morgenklinge beginnt der eigentliche Bosskampf. Nach dem ersten wirksamen Treffer ist Flucht nicht mehr möglich.

Dieser Eintrittsstatus bleibt auch nach dem Neuladen bestehen. Im frühen Warnkampf funktioniert der Rückzug garantiert und ohne weiteren Gegentreffer. Wurde die Morgenklinge bereits gefunden, aber nicht ausgerüstet, bietet der Vorraum die direkte Aktion „Rüste die Morgenklinge aus“ an.

### Niederlage

Bei null Lebenspunkten wird die Figur nicht als tot beschrieben. Je nach Region wird sie von Tessa, Kuno oder einer freundlichen Figur gefunden und zur letzten Raststelle gebracht. Dort sind die Lebenspunkte wieder voll. Nur der noch laufende Kampf wird zurückgesetzt.

Benutzte Heilmittel bleiben verbraucht. Damit wiederholte Versuche nicht alle endlichen Vorräte aufbrauchen, ergänzt jede freigeschaltete Raststelle kostenlos Apfelbrot bis auf drei Stück im Inventar und entfernt Kampfeffekte. Truhen und seltene Heilmittel werden nicht zurückgesetzt. Pflichtkämpfe werden mit aktueller Pflichtausrüstung, vollem Leben und diesem Grundvorrat ausbalanciert; optionale Funde sind keine Voraussetzung.

Beim Endtor werden die Siegel geprüft und wieder mitgenommen. Im Raugrim-Kampf werden nur ihre für diesen Versuch gesetzten Lichtbilder gespeichert. Bei Niederlage verschwinden diese Lichtbilder; alle drei echten Siegel bleiben im Inventar. Erst der Sieg überträgt Morgenklinge und Siegel dauerhaft an das innere Bannschloss. Das äussere Tor bleibt offen. Danach sind sämtliche zuvor von der Morgenklinge enthüllbaren Geheimnisse ohne die Waffe zugänglich.

## 10. Benutzeroberfläche

### Ansichten

- `/` — Titel, neues Spiel und Fortsetzen;
- `/spiel` — Erkundung und Kampf;
- `/karte` — entdeckte Weltkarte;
- `/aufgaben` — klare Haupt- und Nebenaufgaben mit Kunos Hinweisstufen;
- `/einstellungen` — Textgrösse, Kontrast, Bewegung, Ton und Zurücksetzen;
- Sieg und Niederlage erscheinen als eindeutige Spielzustände innerhalb der Spielansicht.

Inventar und Gegenstandsdetails erscheinen auf breiten Bildschirmen als Seitenfläche und auf kleinen Bildschirmen als zugänglicher Dialog von unten.

### Spielansicht

```text
┌ Ort / Region ───────── Leben ─ Waffe ─ [Karte] [Aufgaben] [Inventar] ┐
├────────────────────────┬───────────────────────────────────────────────┤
│ farbige Atmosphäre    │ ORTSNAME                                      │
│ oder Gegnerbild       │ kurze, gut lesbare Beschreibung               │
│                       │ letzte Folgen und Hinweise                     │
│ Kuno / Gegnerstatus   │                                               │
│                       │ [Aktion] [Aktion] [sichtbar blockierte Aktion] │
└────────────────────────┴───────────────────────────────────────────────┘
```

Auf Telefonen wird die Atmosphäre zu einem flachen Banner. Danach folgen Lesekarte und Aktionen in einer Spalte. Lebenspunkte und Waffe bleiben in einer kompakten Kopfzeile sichtbar.

### Bedien- und Zugänglichkeitsregeln

- Bedienziele mindestens 48 × 48 CSS-Pixel;
- vollständige Tastaturbedienung und sichtbarer Fokus;
- keine Information nur über Farbe, Ton oder Bewegung;
- Live-Text für Kampfergebnisse;
- `prefers-reduced-motion` und eigener Schalter für reduzierte Bewegung;
- hoher Kontrast und grosse Schrift;
- Wörterhilfe für ausgewählte Begriffe;
- keine flackernden Effekte, erschreckenden Tonsprünge oder Zeitdruckmechaniken.

Klangrätsel besitzen immer eine sichtbare Symbolfolge, sodass Ton zur Lösung nicht nötig ist.

### Karte

Die Karte übernimmt das SVG-Knotenprinzip des Geschichtenbaums aus LeseAbenteuer:

- grosse, verschiebbare Karte mit handgesetzten Koordinaten;
- aktueller, besuchter, bekannter, blockierter und sicherer Ort jeweils durch Form, Symbol und Text unterscheidbar;
- entfernte unbekannte Orte bleiben verborgen;
- kein Schnellreisen in Version 1;
- zusätzliche Textliste aller entdeckten Orte und Verbindungen für Screenreader;
- vollständige Weltansicht nur als Entwicklungswerkzeug.

## 11. Technische Architektur

```text
src/
  app/                 Navigation, Laden, globale Darstellung
  engine/              Reducer, Aktionen, Anforderungen, Effekte, Zufall
  domain/              Spiel-, Inhalts- und Speicher-Typen
  content/
    world/              Orte und Wege nach Regionen
    quests/             Haupt- und Nebenaufgaben
    items/              Waffen, Heilung, Schlüssel, Werkzeuge
    enemies/            normale Gegner und Bosse
    text/               deutsche Texte und Wörterhilfen
  screens/             Titel, Spiel, Karte, Aufgaben, Einstellungen
  components/          Status, Aktionskarten, Log, Dialoge, Symbole
  storage/             IndexedDB, Migrationen, Export und Zurücksetzen
  accessibility/       Fokus, Bewegung, Kontrast
  styles/              Variablen, Layout, Komponenten, Regionen
  test/                Testaufbau und Fixtures
tests/e2e/              vollständige Spielwege
public/                 PWA-Symbole und lokale Medien
```

### Engine

Die Spiellogik lebt in einem reinen Reducer. React zeigt das Ergebnis nur an.

Wichtige Aktionen:

- `MOVE`
- `INSPECT`
- `OPEN_CHEST`
- `TAKE_ITEM`
- `USE_ITEM`
- `EQUIP_WEAPON`
- `START_COMBAT`
- `ATTACK`
- `DEFEND`
- `FLEE`
- `RESPAWN`
- `COMPLETE_INTERACTION`

Jede Aktion liefert den nächsten Zustand und verständliche Ereignistexte. Erlaubte Aktionen werden aus demselben Zustand berechnet; die Oberfläche erfindet keine eigenen Regeln.

### Spielstand

Der Spielstand enthält nur veränderliche Daten:

```ts
interface GameSave {
  schemaVersion: number
  contentVersion: number
  runId: string
  playerName: string
  currentAreaId: AreaId
  previousAreaId: AreaId | null
  player: {
    life: number
    maxLife: number
    equippedWeaponId: ItemId | null
    inventory: Record<ItemId, number>
  }
  visitedAreaIds: AreaId[]
  openedChestIds: ChestId[]
  defeatedEncounterIds: EncounterId[]
  unlockedPassageIds: PassageId[]
  completedQuestSteps: QuestStepId[]
  discoveredClueIds: ClueId[]
  deliveredDialogueIds: DialogueId[]
  puzzleStates: Record<PuzzleId, PuzzleState>
  flags: GameFlag[]
  lastSanctuaryId: AreaId
  activeCombat: CombatState | null
  recentEvents: GameEvent[]
  rngState: number
  turn: number
}
```

Statische Orts- und Gegenstandsdefinitionen werden nicht in den Spielstand kopiert. IDs bleiben über Inhaltsversionen stabil. Speicherzugriffe werden geordnet, damit schnelle Klicks keinen neueren Zustand mit einem älteren überschreiben.

`PuzzleState` ist eine typisierte Variante je Rätselart. `CombatState` speichert unter anderem Gegnerleben, Phase, angekündigten Zug, Effekte samt Restdauer, den verbindlichen Boss-Eintrittsstatus und im Finale die gesetzten Siegellichter. Dauerhafte Zustände wie eingesetzte Gaben, das offene Endtor und Raugrims Verbannung werden unabhängig vom späteren Inventar abgelegt. Einstellungen werden separat vom zurücksetzbaren Abenteuer gespeichert.

Vor der Übernahme fremder oder älterer Spielstände prüft das Repository die Daten und wandelt unterstützte Versionen um. Fehlerhafte Daten werden nicht still durch ein neues Spiel überschrieben. Die App zeigt Speicherfehler sichtbar an und bietet erneutes Speichern sowie einen JSON-Export des aktuellen Zustands; ein Import wird erst nach Prüfung und Bestätigung übernommen. Laden, Reset und Sieg dürfen keine noch ausstehenden älteren Schreibvorgänge nachträglich wirksam werden lassen.

## 12. Umsetzungsschritte

### Phase 0 — Geschichte und Welt

- Zielgruppe, Ton und Sprachregeln festlegen.
- Erzähl- und Weltbibel mit 41 Orten, beiden Dreiheiten, Figuren, Bossen und Schluss erstellen.
- Abhängigkeitsdiagramm und offene Welt auf Papier prüfen.

Ergebnis: deutsche Erzähl- und Weltbibel und überarbeiteter Produktplan.

### Phase 1 — App-Grundlage

- React-/TypeScript-/Vite-/PWA-Projekt aufsetzen.
- Responsive Grundoberfläche, Gestaltungssystem, Routing und Einstellungen erstellen.
- IndexedDB-Repository, Migration, automatische Speicherung und Fehlerzustände implementieren.
- Datenprüfung, Export/Import und Trennung von Einstellungen und Abenteuer ergänzen.

Ergebnis: installierbare Offline-Hülle mit Starten, Fortsetzen und Zurücksetzen.

### Phase 2 — Erkundungs-Vertikalschnitt

- Engine-Reducer, Ortsauflösung, Reise, Untersuchung und Anforderungen implementieren.
- 8–10 verbundene Testorte mit Rundweg und Abkürzung erstellen.
- Einen Schlüssel, ein Werkzeug, eine Truhe und eine blockierte Passage einbauen.
- Passage-Tabelle und erste lösbare Gegenstandskette als prüfbare Daten erfassen; den Weltvalidator ab hier mitführen.
- Spielansicht, Aufgabenliste und entdeckte Karte erstellen.

Ergebnis: Erkunden, Verlassen, Neuladen und korrektes Fortsetzen funktionieren.

### Phase 3 — Inventar und Schatz

- Inventar, Gegenstandsdetails, Benutzen und Ausrüsten implementieren.
- Zwei Waffen, zwei Heilgegenstände und zwei Truhen integrieren.
- Gegenstands- und Truhenaktionen atomar und wiederholungssicher machen.

Ergebnis: vollständige Gegenstands-, Werkzeug- und Schlosskette ohne Kampf.

### Phase 4 — Kampf und erster Boss

- Angriff, Verteidigung, Gegenstand, Flucht, Sieg und Rettung implementieren.
- Laufende Kämpfe und Zufallszustand speichern.
- Zwei normale Gegner und einen Boss mit zwei Phasen integrieren.
- Vorwarnung und Rückzug ohne Morgenklinge testen.
- Einen verkürzten, vollständig spielbaren Gabenablauf bis zur Morgenklinge einbauen, damit der Boss nicht nur über einen Entwicklungsbefehl erreichbar ist.
- Den Abschnitt mit Kindern erproben: Ziel nach einer Pause, Werkzeugrätsel, Rückzug und Bossmuster. Diese Rückmeldungen vor der Produktion aller 41 Orte einarbeiten.

Ergebnis: kompletter Ablauf von Erkundung über Vorbereitung bis Bossbefreiung.

### Phase 5 — Kampagnenproduktion

- Alle 41 Orte, Quests, Gegenstände, Gegner und Abkürzungen einbauen.
- Vollständige deutsche Erst- und Wiederbesuchstexte schreiben.
- Regionsmotive, Karte und lokale Illustrationen ergänzen.
- Werte durch Simulation und Testspielen abstimmen.

Ergebnis: inhaltlich vollständige erste Kampagne.

### Phase 6 — Testen mit Kindern und Veröffentlichung

- Mit Kindern zwischen 8 und 12 Jahren testen, besonders um Alter 10.
- Beobachten, ob Ziel, Karte, Schloss-Hinweise und Bossmuster verstanden werden.
- Unklare Wörter, Sackgassen, Schwierigkeitsspitzen und Layoutprobleme korrigieren.
- Offline-, Installations-, Update- und beschädigte-Spielstand-Fälle prüfen.

Ergebnis: veröffentlichungsfähige PWA.

## 13. Teststrategie

### Logiktests

- Wege öffnen oder nennen den richtigen Blockierungsgrund;
- Schlüssel werden nur nach klarer Regel verbraucht;
- Truhen können nicht doppelt geplündert werden;
- Inventar, Heilung und Waffenausrüstung stimmen;
- Schaden bleibt in den vorgesehenen Grenzen;
- Verteidigung, Rückzug, Bossphasen und Rettung sind reproduzierbar;
- laufende Kämpfe überstehen ein Neuladen ohne neuen Würfelwurf;
- Welt- und Lösbarkeitsvalidator finden absichtlich eingebaute Fehler;
- Migrationen behalten einen begonnenen Spielstand.
- alle Gaben- und Wächterreihenfolgen liefern verständliche Dialoge und erfüllbare Ziele;
- Niederlagen im Finale geben die Siegel frei, ohne Fortschritt zu duplizieren;
- alle optionalen Entdeckungen bleiben nach dem Sieg erreichbar;
- ein erschöpfter Heilmittelvorrat verhindert keinen neuen Bossversuch;
- unterbrochene Rätsel, Speicherfehler und beschädigte Importe verlieren keinen gültigen Spielstand.

### Komponententests

- Beschreibung und Aktionen passen zum Weltzustand;
- Lebenspunkte und Waffe aktualisieren korrekt;
- gesperrte Aktionen erklären ihre Voraussetzung;
- Inventar- und Hinweisdialoge halten und restaurieren den Fokus;
- Karte und Kampf bleiben ohne Farbe und Ton verständlich;
- Wörterhilfe ist korrekt beschriftet.

### End-to-End-Wege

1. Neues Spiel → Ort untersuchen → Waffe finden → ausrüsten → Gegner besiegen → Truhe öffnen.
2. Schlüssel finden → gesperrten Weg sehen → öffnen → neuladen → Weg bleibt offen.
3. Einen Gabenquest über zwei Regionen lösen → Gabe im Tempel einsetzen.
4. Boss früh betreten → wirkungslosen Angriff verstehen → sicher zurückziehen.
5. Morgenklinge erwecken → Wächter befreien → Siegel erhalten.
6. Drei Siegel einsetzen → Raugrim verbannen → Schluss sehen.
7. Nach erstem Laden offline einen mehrteiligen Spielabschnitt abschliessen.
8. Hauptweg auf Telefon, Tablet und Desktop vollständig spielen.

## 14. Abnahmekriterien für den ersten spielbaren Abschnitt

- Mindestens acht Orte bilden einen Rundweg, einen gesperrten Seitenpfad und eine Abkürzung.
- Alle Texte sind auf Deutsch und folgen den Lesbarkeitsregeln.
- Ortstext und Aktionen funktionieren ab 320 Pixel Breite.
- Gegenstände können gesammelt, untersucht, benutzt und ausgerüstet werden.
- Zwei Waffen spielen sich erkennbar verschieden.
- Zwei normale Begegnungen, zwei Truhen und ein Boss funktionieren.
- Ein Schlüssel oder Werkzeug ist für einen wichtigen Fortschritt nötig.
- Früher Bosskontakt erklärt verständlich, warum Vorbereitung fehlt.
- Lebenspunkte, Rettung, Beute und Weltzustand bleiben korrekt gespeichert.
- Die Karte entsteht aus denselben Verbindungen wie die Bewegung.
- Typprüfung, Build, Logik-, Komponenten-, E2E-, Offline- und Graphprüfungen bestehen.

## 15. Abnahmekriterien für die vollständige Kampagne

- 41 spielbare Orte ohne unbeabsichtigt unerreichbaren Knoten;
- mindestens 80 Prozent aller Orte nach dem Einstieg ohne Questfortschritt betretbar; alle drei Bossräume sind dabei erreichbar;
- mindestens drei Arten von Gegenstands- oder Weltzustands-Sperren;
- Sonnenfunke, Quellträne und Windlied in beliebiger Reihenfolge lösbar;
- Arbor, Marea und Voltaro nach der Morgenklinge in beliebiger Reihenfolge bezwingbar;
- alle drei Siegel werden in der finalen Verbannung verwendet;
- optionale Geheimnisse belohnen Neugier ohne notwendiges Sammeltraining;
- kein Gegenstand kann dupliziert und kein Spielstand dauerhaft blockiert werden;
- ein zehnjähriges Testkind kann das aktuelle Hauptziel nach einer Pause wiederfinden;
- alle starken Bossaktionen sind textlich erkennbar angekündigt;
- die gesamte Kampagne funktioniert nach dem ersten Laden offline.

## 16. Bewusst verschoben

- freie Spracheingabe und natürliche Sprachverarbeitung;
- zufällig erzeugte Welten oder zufällige Platzierung wichtiger Gegenstände;
- Konten, Cloud-Spielstände, Mehrspieler, Bestenlisten oder Analysen;
- Klassen, Stufen, Handwerk, Händlerwirtschaft und komplexe Statuseffekte;
- mehrere Kampagnen und mehrere Speicherplätze;
- Schnellreisen und zufällig wiederkehrende Gegner.

Diese Punkte werden erst neu bewertet, wenn Erkundung, Lesen, Rätsel, Kampf und Geschichte der ersten Kampagne zusammen gut funktionieren.
