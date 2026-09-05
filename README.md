# TextDungeon

Installierbare, offlinefähige React-PWA für **Die Morgenklinge von Talora**. Die Oberfläche und alle Spieltexte verwenden deutsche Schweizer Standardsprache.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Weitere Prüfungen:

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run preview
```

## Stand

Die technische und inhaltliche Umsetzung von Phase 1 bis Phase 5 des [`PRODUCT_PLAN.md`](./PRODUCT_PLAN.md) ist abgeschlossen. Die geplante Erprobung mit Kindern bleibt der nächste manuelle Validierungsschritt:

- responsive App-Hülle und Routing für Start, Spiel, Karte, Aufgaben, Merkliste, Tagebuch und Einstellungen;
- PWA-Manifest, Service Worker, Offline- und Updatezustände sowie Installationshinweis;
- getrennte, versionierte IndexedDB-Speicherung für Abenteuer und Einstellungen;
- geordnete automatische Schreibvorgänge, Laufzeitvalidierung und Migration;
- geprüfter JSON-Export/-Import, explizite Importbestätigung und sicherer Reset;
- Textgrösse, hoher Kontrast und reduzierte Bewegung;
- Starten und Fortsetzen eines lokalen Abenteuers;
- reine Reducer-Spiellogik für Reisen, Untersuchen, Truhen, Funde und Anforderungen;
- alle 41 Orte und 55 Verbindungen der Erzählbibel, davon 35 ohne Questfortschritt erreichbar;
- sechs regionale Rundwege und Abkürzungen mit sichtbaren, datengetriebenen Sperrgründen;
- Aufgabenansicht mit drei gespeicherten Hinweisstufen, gezielten Kartenhinweisen und entdeckungsbasierter SVG-Karte;
- Kartenstatus für unbesuchte, offene, blockierte und erledigte Orte sowie sichtbare Wegsperren und Merklistenziele;
- dynamische Merkliste für Zutaten, Werkzeuge, Fundorte, Verwendungszwecke und verbrauchte Questgegenstände;
- Weltvalidator für IDs, Ziele, Anforderungen, Sackgassen und Lösbarkeit;
- responsives Inventar mit Gegenstandsdetails, Fokusführung und erlaubten Aktionen;
- sechs Waffen mit unterschiedlichen Schadenswerten, Panzerungs- und Regionsboni;
- fünf Heilmittel, erneuerbarer Grundproviant und neun einmalig plünderbare Truhen;
- gespeicherte Waffenausrüstung und vor versehentlichem Verbrauch geschützte wichtige Gegenstände;
- rundenbasierte Kämpfe mit Angriff, Verteidigung, Heilmitteln, Flucht und angekündigten Gegnerzügen;
- zehn normale Gegnertypen, drei zweiphasige Wächter und Raugrim als dreiphasiger Endboss;
- gespeicherter Kampf- und Zufallszustand, reproduzierbare Züge und verlustfreie Rettung zur letzten Raststelle;
- früher, sicher rückziehbarer Bosskontakt ohne Morgenklinge sowie dauerhaft geschlossener Rückweg nach dem ersten wirksamen Boss-Treffer;
- Sonnenfunke, Quellträne und Windlied als unabhängig lösbare Gabenketten;
- Arbor, Marea und Voltaro in beliebiger Reihenfolge sowie alle drei Wächtersiegel;
- vollständige Verbannung mit drei gespeicherten Siegellichtern und Alvas Schlussversprechen;
- sechs Kartenränder, drei kleine Reparaturen, optionale Werkzeuge und dauerhaft zugängliches Nachspiel;
- regionsbezogene Kartenflächen, lokale CSS-Illustrationen und automatische Balance-Simulationen.

Der Ablauf für die ausstehende Beobachtung mit Kindern steht in [`PLAYTEST_GUIDE.md`](./PLAYTEST_GUIDE.md).

Die Ergebnisse der Geschichte- und Funktionsprüfung mit den umgesetzten Korrekturen stehen in [`REVIEW.md`](./REVIEW.md).
