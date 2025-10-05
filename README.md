# Rae KOV2025 – erakondade võrdlus

Interaktiivne Single Page Application (SPA) Rae kohalike omavalitsuste valimiste 2025 erakondade andmete visualiseerimiseks ja võrdlemiseks.

## Tehnoloogiad

- **Vite** - kiire build tööriist
- **React 18** - UI raamistik
- **TypeScript** - tüübikindel JavaScript
- **Tailwind CSS** - utility-first CSS framework
- **Recharts** - React graafikute teek
- **html2canvas** - PNG ekspordi funktsioon

## Funktsionaalsus

### Põhifunktsioonid

- **Filtreerimine**: Erakonnad (max 3 võrdluseks), lubaduste staatus, teemafookus
- **Sortimine**: Tähestikuline, ettepanekute arv, lubaduste täitmine
- **Otsing**: Üle kõigi erakondade andmete
- **Graafikud**:
  - Uute ettepanekute arv erakonniti (tulpdiagramm)
  - Eelmiste lubaduste täitmine (virnastatud tulpdiagramm)
  - Teemafookuse rõhk (heatmap)
- **Võrdlusvaade**: Kuni 3 erakonda kõrvuti detailvaates
- **Eksport**: PNG pildina ja URL jagamine

### Kättesaadavus

- Klaviatuuriga navigeeritav
- ARIA sildid
- Piisav värvide kontrast
- Focus indikaatorid

## Installeerimine ja käivitamine

### 1. Sõltuvuste installeerimine

```bash
npm install
```

### 2. Arendusrežiim

```bash
npm run dev
```

Rakendus avaneb aadressil `http://localhost:5173`

### 3. Produktsiooni build

```bash
npm run build
```

Build failde leitakse `dist/` kaustast.

### 4. Build'i eelvaade

```bash
npm run preview
```

## Andmete sisestamine

### initData.md fail

Rakendus loeb andmed `initData.md` failist projekti juurkaustas.

Fail võib olla:
1. **Markdown koos JSON plokiga**:
   ````markdown
   # Erakondade andmed

   ```json
   [
     {
       "party_name": "Reformierakond",
       "new_proposals": ["Ettepanek 1", "Ettepanek 2"],
       ...
     }
   ]
   ```
   ````

2. **Puhas JSON fail**:
   ```json
   [
     {
       "party_name": "Reformierakond",
       ...
     }
   ]
   ```

### Andmestruktuur

```typescript
type Party = {
  party_name: string
  new_proposals: string[]
  key_ideas: string[]
  previous_promises: {
    promise: string
    fulfilled: "jah" | "ei" | "osaliselt" | "info puudub"
    notes: string
  }[]
  relevance_to_priority_topics: {
    areng: string
    "ühistransport": string
    turvalisus: string
    infrastruktuur: string
  }
  sources: string[]
}
```

### initData.md asendamine

1. Asenda `initData.md` fail projekti juurkaustas
2. Veendu, et andmed järgivad ülaltoodud struktuuri
3. Värskenda lehte (kui rakendus juba töötab)

## Projekti struktuur

```
/
├── index.html                          # HTML template
├── package.json                        # Sõltuvused ja skriptid
├── vite.config.ts                      # Vite konfiguratsioon
├── tailwind.config.js                  # Tailwind konfiguratsioon
├── postcss.config.js                   # PostCSS konfiguratsioon
├── tsconfig.json                       # TypeScript konfiguratsioon
├── initData.md                         # Andmefail (loo see!)
├── src/
│   ├── main.tsx                        # Rakenduse sisendpunkt
│   ├── App.tsx                         # Peamine komponent
│   ├── lib/
│   │   ├── types.ts                    # TypeScript tüübid
│   │   ├── parseInitData.ts            # Andmete laadimine ja parseerimine
│   │   └── urlState.ts                 # URL parameetrite haldus
│   ├── components/
│   │   ├── Filters.tsx                 # Filtrite paneel
│   │   ├── PartyCard.tsx               # Ühe erakonna kaart
│   │   ├── ComparePanel.tsx            # Võrdluspaneel
│   │   ├── SourcesList.tsx             # Allikate loend
│   │   └── Charts/
│   │       ├── NewProposalsBar.tsx     # Ettepanekute tulpdiagramm
│   │       ├── PromisesStacked.tsx     # Lubaduste virnastatud diagramm
│   │       └── TopicsHeatmap.tsx       # Teemade heatmap
│   └── styles/
│       └── index.css                   # Globaalsed stiilid
└── README.md                           # See fail
```

## Kasutamine

1. **Filtreerimine**: Vali vasak paneelilt erakonnad, staatused ja teemad
2. **Ülevaade**: Vaata graafikuid ja statistikat
3. **Kõrvutus**: Vali kuni 3 erakonda detailseks võrdluseks
4. **Otsing**: Kasuta ülaribas otsinguvälja
5. **Eksport PNG**: Salvesta praegune vaade PNG pildina
6. **Jaga vaade**: Kopeeri URL koos filtritega

## Märkused

- Rakendus on täielikult staatiline (ei vaja serverit)
- Kõik andmed laetakse kliendipoolselt
- URL parameetrid säilitavad filtrid ja valitud erakonnad
- "info puudub" väärtused kuvatakse halli badge'iga
- Graafikud on täielikult interaktiivsed (hover tooltipid, legendid)

## Litsents

See projekt on loodud Rae KOV2025 valimiste tarbeks.
