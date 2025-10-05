import type { Party } from './types'

export async function loadParties(): Promise<Party[]> {
  try {
    const base = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${base}initData.md`)
    if (!response.ok) {
      throw new Error(`HTTP viga: ${response.status}`)
    }

    const text = await response.text()

    let parties: Party[]

    // Proovi esmalt parsida kogu sisu JSON-ina
    try {
      parties = JSON.parse(text)
    } catch {
      // Kui ebaõnnestus, proovi ekstraheerida JSON plokki markdownist
      const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/
      const match = text.match(jsonBlockRegex)

      if (match) {
        // Leiti JSON plokk
        const jsonContent = match[1]
        parties = JSON.parse(jsonContent)
      } else {
        throw new Error('JSON plokki ei leitud markdownist ega saanud parsida puhast JSON-i')
      }
    }

    // Valideeri, et tulemus on massiiv
    if (!Array.isArray(parties)) {
      throw new Error('Andmed peavad olema massiiv')
    }

    // Põhiline valideerimine
    parties.forEach((party, index) => {
      if (!party.party_name || typeof party.party_name !== 'string') {
        throw new Error(`Erakond indeksil ${index} ei oma kehtivat nime`)
      }
    })

    return parties
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Andmete lugemine ebaõnnestus: ${error.message}`)
    }
    throw new Error('Andmete lugemine ebaõnnestus')
  }
}
