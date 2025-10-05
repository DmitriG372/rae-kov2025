# **PROMPT CLAUDE CODE’ILE**





**Roll:** Senior Frontend Engineer (React + TypeScript).

**Eesmärk:** Loo **üksikfailina deploy’itav SPA** (Vite + React + TS + Tailwind + Recharts), mis visualiseerib Rae KOV2025 erakondade andmed interaktiivse võrdluslehe kujul.





## **Sisend**





- Fail: initData.md (juurkaustas).
- Sisu: Markdown, mis sisaldab **ühte JSON-plokki** (või on puhas JSON).
- JSON struktuur (massiv objektidest):



```
type Party = {
  party_name: string
  new_proposals: string[]
  key_ideas: string[]
  previous_promises: { promise: string; fulfilled: "jah"|"ei"|"osaliselt"|"info puudub"; notes: string }[]
  relevance_to_priority_topics: { areng: string; "ühistransport": string; turvalisus: string; infrastruktuur: string }
  sources: string[]
}
```



- 
- Nõue: rakendus **loeb initData.md** käivitumisel, **ekstraheerib** esimese json … ploki; kui plokki ei leita, proovib parsida kogu faili JSON-ina; kui mõlemad ebaõnnestuvad, näita veateadet “Andmete lugemine ebaõnnestus”.







## **Tehniline virn**





- **Vite + React + TypeScript**, **TailwindCSS** (lihtne, puhas UI), **Recharts** graafikute jaoks.
- **Üks HTML** (index.html), **üks SPA** (src/main.tsx, src/App.tsx) + komponendid kaustas src/components.
- **Ei** mingeid servereid; kõik statiline.
- Keel UI-s: **eesti keel**.







## **Põhifunktsioonid**





1. **Ülevaate paneel (Dashboard)**

   

   - **Filtrid**:

     

     - Erakonna valik (multi-select, max 3 erakonda “kõrvutuse” jaoks).
     - Lubaduste staatuse filter: jah | osaliselt | ei | info puudub (checkboxid).
     - Teemafookus (checkboxid): areng, ühistransport, turvalisus, infrastruktuur.

     

   - **Sortimine**:

     

     - Vaikimisi tähestikuline.
     - Teised: “Uusi ettepanekuid (↓/↑)”, “Täidetud lubadusi (↓/↑)”, “Osaliselt (↓/↑)”, “Ei (↓/↑)”.

     

   

2. **Graafikud (Recharts)**

   

   - **Tulpdiagramm**: “Uute ettepanekute arv erakonniti”.
   - **Virnastatud tulpdiagramm**: “Eelmiste lubaduste täitmine (jah / osaliselt / ei / info puudub)”.
   - **Heatmap** (SVG/Div-grid, mitte screenshot): “Teemafookuse ‘rõhk’” – mõõda **relevance_to_priority_topics** kirjelduse tekstipikkust teema/erakond kaupa; näita värviskaalaga (legend).
   - Kõik graafikud **reageerivad filtritele**. Tooltipid, legendid, telgede sildid.

   

3. **Kõrvutusvaade (Compare)**

   

   - Kuni **3 erakonda** kõrvuti:

     

     - **Kaardid** (PartyCard): nimi, **badged** “info puudub” kui mõnes väljas puudu.

     - **Uued ettepanekud** (bulletid).

     - **Võtmeideed** (bulletid).

     - **Lubaduste tabel**: veerud *Lubadus | Staatus | Märkused*; staatus värvikoodiga:

       

       - jah=roheline, osaliselt=kollane, ei=punane, info puudub=hall.

       

     - **Teema kokkuvõtted** (areng, ühistransport, turvalisus, infrastruktuur) lühikokkuvõttena.

     - **Allikad**: linkide loetelu (kui väärtus on “info puudub”, kuva hall badge).

     

   

4. **Otsing**

   

   - Otsi üle **party_name, new_proposals, key_ideas, previous_promises.promise/notes, topics** (lihtne case-insensitive substring).

   

5. **Ekspordid**

   

   - Nupp **“Ekspordi PNG”** – teeb nähtavast paneelist PNG (html2canvas).
   - Nupp **“Jaga vaade”** – salvestab filtrid, valitud erakonnad ja sortimise **URL query params**-i.

   

6. **Kättesaadavus ja kasutatavus**

   

   - Klaviatuuriga navigeeritav, ARIA sildid, piisav kontrast.
   - Tühja tulemuse korral selge teade.
   - “Laen…” seisund andmete lugemisel.

   







## **Failistruktuur (genereeri kogu kood)**



```
/index.html
/tailwind.config.js
/postcss.config.js
/package.json
/vite.config.ts
/initData.md              (eeldame, et see on olemas)
/src/main.tsx
/src/App.tsx
/src/lib/parseInitData.ts  (md → json parser)
/src/lib/types.ts
/src/lib/urlState.ts
/src/components/Filters.tsx
/src/components/Charts/NewProposalsBar.tsx
/src/components/Charts/PromisesStacked.tsx
/src/components/Charts/TopicsHeatmap.tsx
/src/components/PartyCard.tsx
/src/components/ComparePanel.tsx
/src/components/SourcesList.tsx
/src/styles/index.css
```



## **Rakendusloogika (oluline)**





- **parseInitData.ts**

  

  - async function loadParties(): Promise<Party[]>
  - Loeb initData.md, ekstraheerib **esimese** json ploki RegExiga; kui ei leita, proovib JSON.parse kogu sisu; viskab arusaadava veateate kui mõlemad ebaõnnestuvad.

  

- **Heatmap skoor**: score = text.length (lihtne proxy). Lisa legend “Mida pikem kirjeldus, seda tumedam ruut (ligikaudne fookuse indikaator).”

- **Filtrid ja sort** hoitakse **URL query**-s (näiteks ?q=...&status=jah,osaliselt&topics=areng,ühistransport&compare=Reformierakond,Isamaa&E=proposals_desc).

- **Tühikud/diakriitikud** erakonnanimedes käsitle robustselt; hoia võtmeks party_name.







## **UI skeem**





- Ülariba: pealkiri “Rae KOV2025 – erakondade võrdlus”, **Otsing**, **Ekspordid**.
- Vasak paneel: **Filtrid & sort**.
- Parem paneel (tabs): **Ülevaade** (graafikud) | **Kõrvutus** (valitud erakonnad).
- All: **Allikad** / märkused.







## **Test/Acceptance Criteria**





- Rakendus **laeb andmed** initData.md-st ja renderdab **3 graafikut** + **PartyCard** vaated.
- Filtrid mõjutavad **graafikuid ja loendeid** kohe.
- “info puudub” väärtused on märgatava halli **badge’iga**.
- Kõrvutuses saab valida **kuni 3** erakonda; ületamisel kuvatakse hoiatustekst.
- Ekspordi PNG töötab nähtava paigutuse peal.
- Kõik tekstid eesti keeles.







## **Build & Run**





- Lisa package.json skriptid:

  

  - dev, build, preview.

  

- **Tailwind** integreeritud index.css kaudu (postcss).

- Vite vaikimisi seadistus.







## **Palun väljasta:**





1. **Täielik projektipuu**.
2. **Kõik failid täiskoodiga** (mitte katkendid).
3. Lühike **README** (kuidas käivitada).
4. Märgi eraldi, kuidas **initData.md** asendada uue andmestikuga.





------



**Märkus:** Kasuta vaikimisi teemapalette (ära määra käsitsi värve), hoia kood selge ja tüübikindel (TS). Pane rõhk jõudlusele (memo/selectorid), loetavusele ning ligipääsetavusele.