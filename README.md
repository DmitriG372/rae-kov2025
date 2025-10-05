# Rae KOV2025 – erakondade võrdlus

Interaktiivne Single Page Application (SPA) Rae kohalike omavalitsuste valimiste 2025 erakondade andmete visualiseerimiseks ja võrdlemiseks.

🌐 **Live demo:** [https://dmitrig372.github.io/rae-kov2025/](https://dmitrig372.github.io/rae-kov2025/)

## Tehnoloogiad

- **Vite** - kiire build tööriist
- **React 18** - UI raamistik
- **TypeScript** - tüübikindel JavaScript
- **Tailwind CSS** - utility-first CSS framework
- **Recharts** - React graafikute teek
- **html2canvas** - PNG ekspordi funktsioon

## Funktsionaalsus

### Põhifunktsioonid

- **3 vaheleht**:
  - **Ülevaade**: Interaktiivsed graafikud ja statistika
  - **Kõrvutus**: Kuni 3 erakonda kõrvuti detailvaates
  - **Programm**: Ühe erakonna täieliku programmi lugemine

- **Filtreerimine**: Erakonnad (max 3 võrdluseks), lubaduste staatus, teemafookus
- **Sortimine**: Kompaktne 2-tulbaline grid (tähestikuline, ettepanekute arv, lubaduste täitmine)
- **Otsing**: Üle kõigi erakondade andmete koos näidisotsingutega
- **Graafikud**:
  - Uute ettepanekute arv erakonniti (tulpdiagramm)
  - Eelmiste lubaduste täitmine (virnastatud tulpdiagramm)
  - Teemafookuse rõhk (heatmap)
- **Eksport**: PNG pildina ja URL jagamine filtritega
- **Tutorial mode**: Interaktiivne juhend esimesel külastusel

### Disain

- **Dark theme**: Kaasaegne tume sinine/lilla gradient taust
- **Glassmorphism**: Läbipaistvad kaardid backdrop-blur efektiga
- **Hover efektid**: Kaardid liiguvad ja saavad varju
- **Custom tooltipid**: Ümarnurkadega varjuefektiga tooltipid graafikutel
- **Mobile-responsive**: Täielikult kohandatud mobiilseadmetele
  - Hamburger menüü filtrite paneelile
  - Responsive teksti suurused ja padding
  - Keskele paigutatud tutorial mobiilis
  - 2-tulbaline sortimise grid

### Kättesaadavus

- Klaviatuuriga navigeeritav
- ARIA sildid
- Piisav värvide kontrast
- Focus indikaatorid
- Mobile-friendly

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

## Deployment

Projekt on seadistatud automaatseks deploymentiks GitHub Pages'ile:

1. Iga push `master` branch'ile käivitab GitHub Actions workflow'i
2. Workflow buildib projekti (`npm run build`)
3. Deployib `dist/` kausta GitHub Pages'ile
4. Veebileht on kättesaadav: https://dmitrig372.github.io/rae-kov2025/

### Manuaalne deployment

```bash
npm run build
# dist/ kaust sisaldab valmis static failid
```

## Andmete sisestamine

### initData.md fail

Rakendus loeb andmed `public/initData.md` failist (kopeeritakse automaatselt `dist/` kausta build ajal).

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

1. Asenda `public/initData.md` fail
2. Veendu, et andmed järgivad ülaltoodud struktuuri
3. Värskenda lehte (kui rakendus juba töötab)
4. Produktsioonis: push muudatused GitHubisse automaatseks deploymentiks

## Projekti struktuur

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions deployment
├── public/
│   └── initData.md                     # Andmefail
├── src/
│   ├── main.tsx                        # Rakenduse sisendpunkt
│   ├── App.tsx                         # Peamine komponent
│   ├── vite-env.d.ts                   # Vite tüübi definitsioonid
│   ├── lib/
│   │   ├── types.ts                    # TypeScript tüübid
│   │   ├── parseInitData.ts            # Andmete laadimine ja parseerimine
│   │   └── urlState.ts                 # URL parameetrite haldus
│   ├── components/
│   │   ├── Filters.tsx                 # Filtrite paneel
│   │   ├── PartyCard.tsx               # Ühe erakonna kaart
│   │   ├── ComparePanel.tsx            # Võrdluspaneel
│   │   ├── SourcesList.tsx             # Allikate loend
│   │   ├── Tutorial.tsx                # Interaktiivne tutorial
│   │   ├── SearchWithSuggestions.tsx   # Otsing koos näidistega
│   │   ├── MobileMenu.tsx              # Hamburger menüü
│   │   └── Charts/
│   │       ├── NewProposalsBar.tsx     # Ettepanekute tulpdiagramm
│   │       ├── PromisesStacked.tsx     # Lubaduste virnastatud diagramm
│   │       ├── TopicsHeatmap.tsx       # Teemade heatmap
│   │       └── CustomTooltip.tsx       # Custom tooltipid graafikutele
│   └── styles/
│       └── index.css                   # Globaalsed stiilid + dark theme
├── index.html                          # HTML template
├── package.json                        # Sõltuvused ja skriptid
├── vite.config.ts                      # Vite konfiguratsioon (base: '/rae-kov2025/')
├── tailwind.config.js                  # Tailwind konfiguratsioon
├── postcss.config.js                   # PostCSS konfiguratsioon
├── tsconfig.json                       # TypeScript konfiguratsioon
└── README.md                           # See fail
```

## Kasutamine

1. **Tutorial**: Esimesel külastusel näidatakse automaatselt tutoriali (saad alati uuesti vaadata "?" nupust)
2. **Filtreerimine**:
   - Mobiil: Ava hamburger menüü (☰) üleval vasakul
   - Desktop: Vali vasak paneelilt erakonnad, staatused ja teemad
3. **Vahelehti**:
   - **Ülevaade**: Vaata graafikuid ja statistikat
   - **Kõrvutus**: Vali kuni 3 erakonda detailseks võrdluseks
   - **Programm**: Vali üks erakond ja loe tema täielikku programmi
4. **Otsing**: Kasuta ülaribas otsinguvälja (klõpsa näidisotsingute nägemiseks)
5. **Eksport PNG**: Salvesta praegune vaade PNG pildina
6. **Jaga vaade**: Kopeeri URL koos filtritega

## Märkused

- Rakendus on täielikult staatiline (ei vaja serverit)
- Kõik andmed laetakse kliendipoolselt `public/initData.md` failist
- URL parameetrid säilitavad filtrid ja valitud erakonnad (jagamiseks)
- "info puudub" väärtused kuvatakse halli badge'iga
- Graafikud on täielikult interaktiivsed (hover tooltipid, legendid)
- Tutorial näidatakse esimesel külastusel (localStorage tracking)
- Mobile-first disain - töötab sujuvalt kõikidel seadmetel

## Tehnilised detailid

- **Base path**: `/rae-kov2025/` (GitHub Pages)
- **Build tool**: Vite 6.x
- **React**: 18.x
- **TypeScript**: Strict mode
- **Deployment**: Automaatne GitHub Actions
- **Hosting**: GitHub Pages

## Litsents

See projekt on loodud Rae KOV2025 valimiste tarbeks.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
