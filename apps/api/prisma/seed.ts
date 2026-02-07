import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================================
  // 26 KANTONE
  // ============================================================
  const cantons = [
    { code: 'ZH', name: 'Zürich', nameOfficial: 'Kanton Zürich', language: 'DE' as const, sortOrder: 1 },
    { code: 'BE', name: 'Bern', nameOfficial: 'Kanton Bern', language: 'DE' as const, sortOrder: 2 },
    { code: 'LU', name: 'Luzern', nameOfficial: 'Kanton Luzern', language: 'DE' as const, sortOrder: 3 },
    { code: 'UR', name: 'Uri', nameOfficial: 'Kanton Uri', language: 'DE' as const, sortOrder: 4 },
    { code: 'SZ', name: 'Schwyz', nameOfficial: 'Kanton Schwyz', language: 'DE' as const, sortOrder: 5 },
    { code: 'OW', name: 'Obwalden', nameOfficial: 'Kanton Obwalden', language: 'DE' as const, sortOrder: 6 },
    { code: 'NW', name: 'Nidwalden', nameOfficial: 'Kanton Nidwalden', language: 'DE' as const, sortOrder: 7 },
    { code: 'GL', name: 'Glarus', nameOfficial: 'Kanton Glarus', language: 'DE' as const, sortOrder: 8 },
    { code: 'ZG', name: 'Zug', nameOfficial: 'Kanton Zug', language: 'DE' as const, sortOrder: 9 },
    { code: 'FR', name: 'Freiburg', nameOfficial: 'Kanton Freiburg', language: 'FR' as const, sortOrder: 10 },
    { code: 'SO', name: 'Solothurn', nameOfficial: 'Kanton Solothurn', language: 'DE' as const, sortOrder: 11 },
    { code: 'BS', name: 'Basel-Stadt', nameOfficial: 'Kanton Basel-Stadt', language: 'DE' as const, sortOrder: 12 },
    { code: 'BL', name: 'Basel-Landschaft', nameOfficial: 'Kanton Basel-Landschaft', language: 'DE' as const, sortOrder: 13 },
    { code: 'SH', name: 'Schaffhausen', nameOfficial: 'Kanton Schaffhausen', language: 'DE' as const, sortOrder: 14 },
    { code: 'AR', name: 'Appenzell Ausserrhoden', nameOfficial: 'Kanton Appenzell Ausserrhoden', language: 'DE' as const, sortOrder: 15 },
    { code: 'AI', name: 'Appenzell Innerrhoden', nameOfficial: 'Kanton Appenzell Innerrhoden', language: 'DE' as const, sortOrder: 16 },
    { code: 'SG', name: 'St. Gallen', nameOfficial: 'Kanton St. Gallen', language: 'DE' as const, sortOrder: 17 },
    { code: 'GR', name: 'Graubünden', nameOfficial: 'Kanton Graubünden', language: 'DE' as const, sortOrder: 18 },
    { code: 'AG', name: 'Aargau', nameOfficial: 'Kanton Aargau', language: 'DE' as const, sortOrder: 19 },
    { code: 'TG', name: 'Thurgau', nameOfficial: 'Kanton Thurgau', language: 'DE' as const, sortOrder: 20 },
    { code: 'TI', name: 'Tessin', nameOfficial: 'Kanton Tessin', language: 'IT' as const, sortOrder: 21 },
    { code: 'VD', name: 'Waadt', nameOfficial: 'Kanton Waadt', language: 'FR' as const, sortOrder: 22 },
    { code: 'VS', name: 'Wallis', nameOfficial: 'Kanton Wallis', language: 'DE' as const, sortOrder: 23 },
    { code: 'NE', name: 'Neuenburg', nameOfficial: 'Kanton Neuenburg', language: 'FR' as const, sortOrder: 24 },
    { code: 'GE', name: 'Genf', nameOfficial: 'Kanton Genf', language: 'FR' as const, sortOrder: 25 },
    { code: 'JU', name: 'Jura', nameOfficial: 'Kanton Jura', language: 'FR' as const, sortOrder: 26 },
  ];

  for (const canton of cantons) {
    await prisma.canton.upsert({
      where: { code: canton.code },
      update: canton,
      create: canton,
    });
  }
  console.log(`${cantons.length} Kantone erstellt.`);

  // ============================================================
  // VORSCHRIFT-KATEGORIEN
  // ============================================================
  const regulationCategories = [
    { slug: 'fire-safety', name: 'Brandschutz', description: 'Brandschutzvorschriften und -massnahmen', icon: 'flame', sortOrder: 1 },
    { slug: 'emergency-exits', name: 'Notausgänge', description: 'Anforderungen an Notausgänge und Fluchtwege', icon: 'log-out', sortOrder: 2 },
    { slug: 'electrical-safety', name: 'Elektrotechnik', description: 'Elektrische Sicherheitsvorschriften', icon: 'zap', sortOrder: 3 },
    { slug: 'capacity', name: 'Kapazität', description: 'Personenkapazität und Belegungsgrenzen', icon: 'users', sortOrder: 4 },
    { slug: 'evacuation', name: 'Evakuation', description: 'Evakuierungsplanung und -wege', icon: 'arrow-right-circle', sortOrder: 5 },
    { slug: 'structural-safety', name: 'Bausicherheit', description: 'Statik, Aufbauten und temporäre Konstruktionen', icon: 'hard-hat', sortOrder: 6 },
    { slug: 'noise-protection', name: 'Lärmschutz', description: 'Lärmschutzvorgaben und Schallpegelbegrenzungen', icon: 'volume-2', sortOrder: 7 },
    { slug: 'accessibility', name: 'Barrierefreiheit', description: 'Zugänglichkeit für Menschen mit Behinderungen', icon: 'accessibility', sortOrder: 8 },
  ];

  for (const cat of regulationCategories) {
    await prisma.regulationCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`${regulationCategories.length} Vorschrift-Kategorien erstellt.`);

  // ============================================================
  // BERECHNUNGSTYPEN
  // ============================================================
  const calculationTypes = [
    {
      slug: 'emergency-exits',
      name: 'Notausgänge berechnen',
      description: 'Berechnet die erforderliche Anzahl und Breite der Notausgänge basierend auf Personenzahl und Fläche.',
      formula: 'VKF Brandschutzrichtlinie 16-15: Ausgangsbreite = Personenzahl / 100 × 0.6m. Mindestens 2 Ausgänge.',
      icon: 'log-out',
      sortOrder: 1,
    },
    {
      slug: 'fire-extinguishers',
      name: 'Feuerlöscher berechnen',
      description: 'Berechnet die erforderliche Anzahl an Feuerlöschern nach Fläche und Risikokategorie.',
      formula: 'VKF BSV 2015: Löschmitteleinheiten basierend auf Fläche und Gefährdungskategorie.',
      icon: 'shield',
      sortOrder: 2,
    },
    {
      slug: 'capacity',
      name: 'Kapazität berechnen',
      description: 'Berechnet die maximale Personenkapazität basierend auf Fläche, Veranstaltungsart und Ausgängen.',
      formula: 'Stehend: 1 Person/m². Sitzend: 1 Person/2m². Gemischt: 1 Person/1.5m². Limitiert durch Ausgänge.',
      icon: 'users',
      sortOrder: 3,
    },
    {
      slug: 'evacuation-routes',
      name: 'Fluchtwege berechnen',
      description: 'Berechnet erforderliche Fluchtwegbreiten und prüft Evakuierungszeiten.',
      formula: 'VKF: Max. Fluchtweg 35m. Fluchtwegbreite mind. 1.2m. Beleuchtete Rettungszeichen alle 15m.',
      icon: 'arrow-right-circle',
      sortOrder: 4,
    },
  ];

  for (const ct of calculationTypes) {
    await prisma.calculationType.upsert({
      where: { slug: ct.slug },
      update: ct,
      create: ct,
    });
  }
  console.log(`${calculationTypes.length} Berechnungstypen erstellt.`);

  // ============================================================
  // BERECHNUNGSPARAMETER (Bundesebene / Standard)
  // ============================================================
  const emergencyExitType = await prisma.calculationType.findUnique({ where: { slug: 'emergency-exits' } });
  const fireExtType = await prisma.calculationType.findUnique({ where: { slug: 'fire-extinguishers' } });
  const capacityType = await prisma.calculationType.findUnique({ where: { slug: 'capacity' } });
  const evacType = await prisma.calculationType.findUnique({ where: { slug: 'evacuation-routes' } });

  if (emergencyExitType && fireExtType && capacityType && evacType) {
    const params = [
      // Emergency Exits
      { calculationTypeId: emergencyExitType.id, cantonId: null, parameterKey: 'sqm_per_person', parameterValue: '1', valueType: 'FLOAT' as const, unit: 'm²/Person', description: 'Fläche pro Person (stehend)' },
      { calculationTypeId: emergencyExitType.id, cantonId: null, parameterKey: 'exit_width_per_100_persons', parameterValue: '0.6', valueType: 'FLOAT' as const, unit: 'm', description: 'Ausgangsbreite pro 100 Personen' },
      { calculationTypeId: emergencyExitType.id, cantonId: null, parameterKey: 'min_exit_width', parameterValue: '0.9', valueType: 'FLOAT' as const, unit: 'm', description: 'Mindestbreite eines Ausgangs' },
      { calculationTypeId: emergencyExitType.id, cantonId: null, parameterKey: 'min_exits', parameterValue: '2', valueType: 'INT' as const, unit: 'Stück', description: 'Mindestanzahl Ausgänge' },

      // Fire Extinguishers
      { calculationTypeId: fireExtType.id, cantonId: null, parameterKey: 'coverage_per_unit_low', parameterValue: '300', valueType: 'FLOAT' as const, unit: 'm²', description: 'Abdeckung pro Löscher (geringe Gefährdung)' },
      { calculationTypeId: fireExtType.id, cantonId: null, parameterKey: 'coverage_per_unit_medium', parameterValue: '200', valueType: 'FLOAT' as const, unit: 'm²', description: 'Abdeckung pro Löscher (mittlere Gefährdung)' },
      { calculationTypeId: fireExtType.id, cantonId: null, parameterKey: 'coverage_per_unit_high', parameterValue: '100', valueType: 'FLOAT' as const, unit: 'm²', description: 'Abdeckung pro Löscher (hohe Gefährdung)' },

      // Capacity
      { calculationTypeId: capacityType.id, cantonId: null, parameterKey: 'sqm_per_person_standing', parameterValue: '1', valueType: 'FLOAT' as const, unit: 'm²/Person', description: 'Fläche pro Person (stehend)' },
      { calculationTypeId: capacityType.id, cantonId: null, parameterKey: 'sqm_per_person_seated', parameterValue: '2', valueType: 'FLOAT' as const, unit: 'm²/Person', description: 'Fläche pro Person (sitzend)' },
      { calculationTypeId: capacityType.id, cantonId: null, parameterKey: 'sqm_per_person_mixed', parameterValue: '1.5', valueType: 'FLOAT' as const, unit: 'm²/Person', description: 'Fläche pro Person (gemischt)' },
      { calculationTypeId: capacityType.id, cantonId: null, parameterKey: 'persons_per_m_exit_width', parameterValue: '166', valueType: 'FLOAT' as const, unit: 'Personen/m', description: 'Personen pro Meter Ausgangsbreite' },

      // Evacuation Routes
      { calculationTypeId: evacType.id, cantonId: null, parameterKey: 'max_distance_to_exit', parameterValue: '35', valueType: 'FLOAT' as const, unit: 'm', description: 'Maximaler Fluchtweg zum nächsten Ausgang' },
      { calculationTypeId: evacType.id, cantonId: null, parameterKey: 'min_route_width', parameterValue: '1.2', valueType: 'FLOAT' as const, unit: 'm', description: 'Mindestbreite Fluchtweg' },
      { calculationTypeId: evacType.id, cantonId: null, parameterKey: 'route_width_per_100_persons', parameterValue: '0.6', valueType: 'FLOAT' as const, unit: 'm', description: 'Fluchtwegbreite pro 100 Personen' },
      { calculationTypeId: evacType.id, cantonId: null, parameterKey: 'max_evacuation_time_sec', parameterValue: '180', valueType: 'FLOAT' as const, unit: 'Sekunden', description: 'Maximale Evakuierungszeit' },
    ];

    for (const param of params) {
      await prisma.calculationParameter.upsert({
        where: {
          calculationTypeId_cantonId_parameterKey: {
            calculationTypeId: param.calculationTypeId,
            cantonId: param.cantonId as unknown as number,
            parameterKey: param.parameterKey,
          },
        },
        update: param,
        create: param,
      });
    }
    console.log(`${params.length} Berechnungsparameter erstellt.`);
  }

  // ============================================================
  // BEISPIEL-KATEGORIEN
  // ============================================================
  const exampleCategories = [
    { slug: 'concert', name: 'Konzert', icon: 'music', sortOrder: 1 },
    { slug: 'fair', name: 'Messe', icon: 'shopping-bag', sortOrder: 2 },
    { slug: 'theater', name: 'Theater', icon: 'film', sortOrder: 3 },
    { slug: 'open-air', name: 'Open-Air', icon: 'sun', sortOrder: 4 },
    { slug: 'corporate', name: 'Firmenevent', icon: 'briefcase', sortOrder: 5 },
    { slug: 'sports', name: 'Sportveranstaltung', icon: 'activity', sortOrder: 6 },
  ];

  for (const cat of exampleCategories) {
    await prisma.exampleCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`${exampleCategories.length} Beispiel-Kategorien erstellt.`);

  // ============================================================
  // KONTAKTARTEN
  // ============================================================
  const contactTypes = [
    { slug: 'fire-police', name: 'Feuerpolizei', sortOrder: 1 },
    { slug: 'building-inspection', name: 'Bauinspektorat', sortOrder: 2 },
    { slug: 'building-insurance', name: 'Gebäudeversicherung', sortOrder: 3 },
    { slug: 'labor-inspection', name: 'Arbeitsinspektorat', sortOrder: 4 },
    { slug: 'event-authority', name: 'Veranstaltungsbehörde', sortOrder: 5 },
    { slug: 'environmental-office', name: 'Umweltamt', sortOrder: 6 },
    { slug: 'federal-authority', name: 'Bundesbehörde', sortOrder: 7 },
  ];

  for (const ct of contactTypes) {
    await prisma.contactType.upsert({
      where: { slug: ct.slug },
      update: ct,
      create: ct,
    });
  }
  console.log(`${contactTypes.length} Kontaktarten erstellt.`);

  // ============================================================
  // DATA VERSIONS
  // ============================================================
  const tables = [
    'cantons', 'regulations', 'regulation_categories',
    'calculation_types', 'calculation_parameters',
    'examples', 'example_categories',
    'contacts', 'contact_types',
  ];

  for (const tableName of tables) {
    await prisma.dataVersion.upsert({
      where: { tableName },
      update: { version: 1 },
      create: { tableName, version: 1 },
    });
  }
  console.log(`${tables.length} Datenversionen erstellt.`);

  // ============================================================
  // BEISPIEL-VORSCHRIFTEN (Pilotdaten für ZH, BE, LU)
  // ============================================================
  const zhCanton = await prisma.canton.findUnique({ where: { code: 'ZH' } });
  const fireSafetyCat = await prisma.regulationCategory.findUnique({ where: { slug: 'fire-safety' } });
  const emergencyExitsCat = await prisma.regulationCategory.findUnique({ where: { slug: 'emergency-exits' } });
  const capacityCat = await prisma.regulationCategory.findUnique({ where: { slug: 'capacity' } });

  if (zhCanton && fireSafetyCat && emergencyExitsCat && capacityCat) {
    const sampleRegulations = [
      {
        cantonId: zhCanton.id,
        categoryId: fireSafetyCat.id,
        title: 'Brandschutzvorschriften für Versammlungsräume',
        summary: 'Grundlegende Brandschutzanforderungen für Veranstaltungsräume im Kanton Zürich.',
        content: `# Brandschutz in Versammlungsräumen

## Grundlagen
Die Brandschutzvorschriften für Versammlungsräume im Kanton Zürich basieren auf den VKF-Brandschutzvorschriften (BSV 2015) sowie den kantonalen Ergänzungen.

## Anforderungen

### Brandmeldeanlagen
- Ab 300 Personen: Automatische Brandmeldeanlage erforderlich
- Ab 1000 Personen: Sprinkleranlage empfohlen

### Feuerlöscher
- Mindestens 1 Feuerlöscher pro 200m² Grundfläche
- Maximaler Abstand zwischen Feuerlöschern: 40m
- Typ: ABC-Pulver oder Schaumlöscher, mindestens 6kg

### Brandabschnitte
- Maximal 2400m² pro Brandabschnitt
- Brandschutztüren EI30 zwischen Abschnitten

## Rechtsgrundlage
- VKF BSV 2015, Brandschutzrichtlinie
- Kantonale Feuerpolizeiverordnung ZH`,
        legalReference: 'VKF BSV 2015, Kantonale Feuerpolizeiverordnung ZH',
        isActive: true,
        version: 1,
        sortOrder: 1,
      },
      {
        cantonId: zhCanton.id,
        categoryId: emergencyExitsCat.id,
        title: 'Notausgänge und Fluchtwege',
        summary: 'Anforderungen an Notausgänge und Fluchtwege für Veranstaltungen im Kanton Zürich.',
        content: `# Notausgänge und Fluchtwege

## Grundsätze
Jeder Versammlungsraum muss über mindestens 2 voneinander unabhängige Fluchtwege verfügen.

## Bemessung

### Anzahl Ausgänge
| Personenzahl | Mindestanzahl Ausgänge |
|---|---|
| bis 200 | 2 |
| 201-500 | 3 |
| 501-1000 | 4 |
| über 1000 | 5+ |

### Breite
- Mindestbreite pro Ausgang: 0.9m (1 Flügel)
- Empfohlen ab 100 Personen: 1.2m
- Berechnung: 0.6m pro 100 Personen Gesamtbreite

### Maximale Fluchtweglänge
- Maximal 35m bis zum nächsten Ausgang
- Maximal 50m bei Sprinkleranlage

## Kennzeichnung
- Beleuchtete Rettungszeichen (grün/weiss) über jedem Notausgang
- Nachleuchtende Bodenmarkierungen bei Veranstaltungen ab 500 Personen
- Rettungszeichen alle 15m entlang des Fluchtwegs

## Rechtsgrundlage
- VKF Brandschutzrichtlinie 16-15
- SIA 402`,
        legalReference: 'VKF Brandschutzrichtlinie 16-15, SIA 402',
        isActive: true,
        version: 1,
        sortOrder: 1,
      },
      {
        cantonId: zhCanton.id,
        categoryId: capacityCat.id,
        title: 'Personenkapazität für Veranstaltungsräume',
        summary: 'Berechnung und Grenzen der Personenkapazität für verschiedene Veranstaltungsarten.',
        content: `# Personenkapazität

## Berechnung der maximalen Belegung

### Nach Veranstaltungsart
| Art | Fläche pro Person |
|---|---|
| Stehend (Konzert, Party) | 1.0 m² |
| Sitzend (Bestuhlung) | 2.0 m² |
| Gemischt | 1.5 m² |
| Bankett (Tische + Stühle) | 2.5 m² |

### Beispielberechnung
Ein Raum mit 500m² Nettofläche:
- Stehend: max. 500 Personen
- Sitzend: max. 250 Personen
- Gemischt: max. 333 Personen

## Limitierende Faktoren
Die tatsächliche Kapazität wird durch den **kleinsten Wert** folgender Berechnungen bestimmt:
1. Fläche / Fläche pro Person
2. Gesamte Ausgangsbreite × 166 Personen/m
3. Kapazität der Fluchtwege

## Hinweis
Die Nettofläche schliesst Bühne, Technik, Bars und andere nicht begehbare Bereiche aus.`,
        legalReference: 'VKF BSV 2015, Kantonale Bauverordnung ZH',
        isActive: true,
        version: 1,
        sortOrder: 1,
      },
    ];

    for (const reg of sampleRegulations) {
      await prisma.regulation.create({ data: reg });
    }
    console.log(`${sampleRegulations.length} Beispiel-Vorschriften für Zürich erstellt.`);
  }

  // ============================================================
  // BEISPIEL-KONTAKTE (Zürich)
  // ============================================================
  const firePoliceType = await prisma.contactType.findUnique({ where: { slug: 'fire-police' } });
  const buildingInsuranceType = await prisma.contactType.findUnique({ where: { slug: 'building-insurance' } });
  const federalType = await prisma.contactType.findUnique({ where: { slug: 'federal-authority' } });

  if (zhCanton && firePoliceType && buildingInsuranceType && federalType) {
    const contacts = [
      {
        cantonId: zhCanton.id,
        contactTypeId: firePoliceType.id,
        name: 'Feuerpolizei Kanton Zürich',
        department: 'Amt für Militär und Zivilschutz',
        street: 'Steinackerstrasse 1',
        postalCode: '8090',
        city: 'Zürich',
        phone: '+41 43 259 51 11',
        website: 'https://www.zh.ch/feuerpolizei',
        isActive: true,
        sortOrder: 1,
      },
      {
        cantonId: zhCanton.id,
        contactTypeId: buildingInsuranceType.id,
        name: 'Gebäudeversicherung Kanton Zürich (GVZ)',
        street: 'Thurgauerstrasse 56',
        postalCode: '8050',
        city: 'Zürich',
        phone: '+41 44 308 21 11',
        website: 'https://www.gvz.ch',
        isActive: true,
        sortOrder: 2,
      },
      {
        cantonId: null,
        contactTypeId: federalType.id,
        name: 'Vereinigung Kantonaler Feuerversicherungen (VKF)',
        street: 'Bundesgasse 20',
        postalCode: '3001',
        city: 'Bern',
        phone: '+41 31 320 22 22',
        website: 'https://www.vkf.ch',
        description: 'Nationale Koordination der Brandschutzvorschriften',
        isActive: true,
        sortOrder: 1,
      },
    ];

    for (const contact of contacts) {
      await prisma.contact.create({ data: contact });
    }
    console.log(`${contacts.length} Beispiel-Kontakte erstellt.`);
  }

  // ============================================================
  // BEISPIELE
  // ============================================================
  const concertCat = await prisma.exampleCategory.findUnique({ where: { slug: 'concert' } });
  if (concertCat && zhCanton) {
    await prisma.example.create({
      data: {
        categoryId: concertCat.id,
        cantonId: zhCanton.id,
        title: 'Konzert in der Halle (500 Personen)',
        description: 'Beispiel einer Konzertveranstaltung in einer geschlossenen Halle mit 500 Personen Kapazität.',
        content: `# Konzert in geschlossener Halle

## Rahmendaten
- **Kapazität**: 500 Personen (stehend)
- **Nettofläche**: 500 m²
- **Veranstaltungsart**: Konzert (stehend)
- **Kanton**: Zürich

## Erforderliche Sicherheitsmassnahmen

### Notausgänge
- Mindestens **3 Notausgänge** (501+ Personen erfordern 3+)
- Gesamte Ausgangsbreite: 500 / 100 × 0.6m = **3.0m**
- Empfehlung: 3 Ausgänge à 1.2m

### Feuerlöscher
- Mittlere Gefährdung: 500m² / 200m² = **3 Feuerlöscher** (ABC 6kg)
- Maximaler Abstand: 40m

### Fluchtweg
- Max. 35m zum nächsten Ausgang
- Beleuchtete Rettungszeichen über jedem Ausgang
- Nachleuchtende Bodenmarkierung empfohlen

### Personal
- Mindestens 5 Sicherheitspersonen (1 pro 100 Personen)
- 2 Ersthelfer
- 1 Brandschutzbeauftragter

## Checkliste
- [ ] Brandschutzkonzept erstellt
- [ ] Flucht- und Rettungsplan ausgehängt
- [ ] Feuerlöscher geprüft und zugänglich
- [ ] Notausgänge frei und gekennzeichnet
- [ ] Sicherheitspersonal eingewiesen
- [ ] Genehmigung der Feuerpolizei eingeholt`,
        eventType: 'Konzert',
        capacity: 500,
        isActive: true,
        sortOrder: 1,
      },
    });
    console.log('1 Beispiel erstellt.');
  }

  console.log('Seeding abgeschlossen!');
}

main()
  .catch((e) => {
    console.error('Seeding-Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
