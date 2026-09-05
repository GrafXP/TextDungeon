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

Phase 1 bis Phase 3 des [`PRODUCT_PLAN.md`](./PRODUCT_PLAN.md) sind umgesetzt:

- responsive App-Hülle und Routing für Start, Spiel, Karte, Aufgaben und Einstellungen;
- PWA-Manifest, Service Worker, Offline- und Updatezustände sowie Installationshinweis;
- getrennte, versionierte IndexedDB-Speicherung für Abenteuer und Einstellungen;
- geordnete automatische Schreibvorgänge, Laufzeitvalidierung und Migration;
- geprüfter JSON-Export/-Import, explizite Importbestätigung und sicherer Reset;
- Textgrösse, hoher Kontrast, reduzierte Bewegung und Toneinstellung;
- Starten und Fortsetzen eines lokalen Abenteuers;
- reine Reducer-Spiellogik für Reisen, Untersuchen, Truhen, Funde und Anforderungen;
- zehn verbundene Orte mit Rundwegen und zwei datengetriebenen Abkürzungen;
- Archivschlüssel-, Hebelstangen- und Schatztruhenkette mit sichtbaren Sperrgründen;
- Aufgabenansicht mit freiwilligen Hinweisen und entdeckungsbasierte SVG-Karte;
- Weltvalidator für IDs, Ziele, Anforderungen, Sackgassen und Lösbarkeit;
- responsives Inventar mit Gegenstandsdetails, Fokusführung und erlaubten Aktionen;
- Reiseschwert und Hafenspeer mit unterschiedlichen Schadenswerten und Eigenschaften;
- Apfelbrot und Waldsalbe mit atomarer Heilung sowie zwei einmalig plünderbare Truhen;
- gespeicherte Waffenausrüstung und vor versehentlichem Verbrauch geschützte wichtige Gegenstände.

Kämpfe, Gegnerzüge und Rettung beginnen gemäss Plan mit Phase 4.
