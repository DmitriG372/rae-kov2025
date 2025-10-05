import { useState, useEffect, useMemo, useCallback } from 'react'
import html2canvas from 'html2canvas'
import type { Party, Filters } from './lib/types'
import { loadParties } from './lib/parseInitData'
import { getFiltersFromURL, updateURL } from './lib/urlState'
import { FiltersComponent } from './components/Filters'
import { ComparePanel } from './components/ComparePanel'
import { NewProposalsBar } from './components/Charts/NewProposalsBar'
import { PromisesStacked } from './components/Charts/PromisesStacked'
import { TopicsHeatmap } from './components/Charts/TopicsHeatmap'
import { Tutorial } from './components/Tutorial'
import { SearchWithSuggestions } from './components/SearchWithSuggestions'
import { MobileMenu } from './components/MobileMenu'

type Tab = 'overview' | 'compare' | 'program'

const TUTORIAL_SEEN_KEY = 'rae-kov2025-tutorial-seen'

function App() {
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showTutorial, setShowTutorial] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProgramParty, setSelectedProgramParty] = useState<string>('')

  const [filters, setFilters] = useState<Filters>({
    selectedParties: [],
    statuses: [],
    topics: [],
    sortBy: 'alphabetical',
    searchQuery: '',
  })

  // Lae andmed
  useEffect(() => {
    loadParties()
      .then(data => {
        setParties(data)
        setLoading(false)

        // Rakenda URL-i filtrid
        const urlFilters = getFiltersFromURL()
        setFilters(prev => ({ ...prev, ...urlFilters }))

        // Kontrolli, kas tutorial on juba nähtud
        const tutorialSeen = localStorage.getItem(TUTORIAL_SEEN_KEY)
        if (!tutorialSeen) {
          setShowTutorial(true)
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Andmete lugemine ebaõnnestus')
        setLoading(false)
      })
  }, [])

  // Uuenda URL-i kui filtrid muutuvad
  useEffect(() => {
    if (!loading) {
      updateURL(filters)
    }
  }, [filters, loading])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }, [])

  // Filtreeri ja sorteeri erakonnad
  const filteredAndSortedParties = useMemo(() => {
    let result = [...parties]

    // Otsing
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(party => {
        const searchIn = [
          party.party_name,
          ...(party.new_proposals || []),
          ...(party.key_ideas || []),
          ...(party.previous_promises?.map(p => `${p.promise} ${p.notes}`) || []),
          ...Object.values(party.relevance_to_priority_topics || {}),
        ].join(' ').toLowerCase()

        return searchIn.includes(query)
      })
    }

    // Filter: lubaduste staatus
    if (filters.statuses.length > 0) {
      result = result.filter(party => {
        const promises = party.previous_promises || []
        return promises.some(p => filters.statuses.includes(p.fulfilled))
      })
    }

    // Filter: teemad
    if (filters.topics.length > 0) {
      result = result.filter(party => {
        return filters.topics.some(topic => {
          const text = party.relevance_to_priority_topics?.[topic] || ''
          return text && text !== 'info puudub'
        })
      })
    }

    // Sortimine
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphabetical':
          return a.party_name.localeCompare(b.party_name, 'et')

        case 'proposals_desc':
          return (b.new_proposals?.length || 0) - (a.new_proposals?.length || 0)
        case 'proposals_asc':
          return (a.new_proposals?.length || 0) - (b.new_proposals?.length || 0)

        case 'fulfilled_desc':
        case 'fulfilled_asc': {
          const countA = (a.previous_promises || []).filter(p => p.fulfilled === 'jah').length
          const countB = (b.previous_promises || []).filter(p => p.fulfilled === 'jah').length
          return filters.sortBy === 'fulfilled_desc' ? countB - countA : countA - countB
        }

        case 'partial_desc':
        case 'partial_asc': {
          const countA = (a.previous_promises || []).filter(p => p.fulfilled === 'osaliselt').length
          const countB = (b.previous_promises || []).filter(p => p.fulfilled === 'osaliselt').length
          return filters.sortBy === 'partial_desc' ? countB - countA : countA - countB
        }

        case 'unfulfilled_desc':
        case 'unfulfilled_asc': {
          const countA = (a.previous_promises || []).filter(p => p.fulfilled === 'ei').length
          const countB = (b.previous_promises || []).filter(p => p.fulfilled === 'ei').length
          return filters.sortBy === 'unfulfilled_desc' ? countB - countA : countA - countB
        }

        default:
          return 0
      }
    })

    return result
  }, [parties, filters])

  // Valitud erakonnad võrdluseks
  const selectedPartiesForCompare = useMemo(() => {
    return parties.filter(p => filters.selectedParties.includes(p.party_name))
  }, [parties, filters.selectedParties])

  // Graafikutele andmed - alati kasuta filtreerimist (teemad, staatused, otsing)
  // Kui erakonnad valitud, lisa ka see filter
  const chartParties = useMemo(() => {
    let result = filteredAndSortedParties

    // Kui konkreetsed erakonnad on valitud, näita ainult neid
    if (filters.selectedParties.length > 0) {
      result = result.filter(p => filters.selectedParties.includes(p.party_name))
    }

    return result
  }, [filteredAndSortedParties, filters.selectedParties])

  const handleExportPNG = useCallback(async () => {
    const element = document.getElementById('export-area')
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      })

      const link = document.createElement('a')
      link.download = `rae-kov2025-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      alert('Ekspordi viga: ' + (err instanceof Error ? err.message : 'Tundmatu viga'))
    }
  }, [])

  const handleShareView = useCallback(() => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('Link kopeeritud lõikelauale!')
    }).catch(() => {
      alert(`Link: ${url}`)
    })
  }, [])

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem(TUTORIAL_SEEN_KEY, 'true')
  }, [])

  const handleOpenTutorial = useCallback(() => {
    setShowTutorial(true)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Laen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Tutorial */}
      <Tutorial isOpen={showTutorial} onClose={handleCloseTutorial} />

      {/* Mobile menu button */}
      <MobileMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Vasak paneel: Filtrid - responsive */}
      <div
        id="filters-panel"
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <FiltersComponent
          filters={filters}
          parties={parties}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Peamine sisu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Ülariba */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between shadow-xl relative z-30">
          <h1 className="text-base lg:text-2xl font-bold text-white ml-14 lg:ml-0">Rae KOV2025 – erakondade võrdlus</h1>

          <div id="header-actions" className="flex items-center gap-4">
            {/* Otsing */}
            <SearchWithSuggestions
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />

            {/* Ekspordid */}
            <button
              onClick={handleExportPNG}
              className="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Ekspordi PNG"
            >
              Ekspordi PNG
            </button>

            <button
              onClick={handleShareView}
              className="hidden sm:block px-3 lg:px-4 py-1.5 lg:py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Jaga vaade"
            >
              Jaga vaade
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div id="tabs-section" className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 px-4 lg:px-6">
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400 font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Ülevaade"
            >
              Ülevaade
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 sm:px-4 py-2 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'compare'
                  ? 'border-indigo-500 text-indigo-400 font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Kõrvutus"
            >
              Kõrvutus
            </button>
            <button
              onClick={() => setActiveTab('program')}
              className={`px-3 sm:px-4 py-2 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'program'
                  ? 'border-indigo-500 text-indigo-400 font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Programm"
            >
              Programm
            </button>
          </div>
        </div>

        {/* Sisu */}
        <main id="export-area" className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div id="charts-area" className="space-y-6">
              {chartParties.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>Tulemused puuduvad. Proovige muuta filtreid.</p>
                </div>
              ) : (
                <>
                  <NewProposalsBar parties={chartParties} />
                  <PromisesStacked parties={chartParties} />
                  <TopicsHeatmap parties={chartParties} selectedTopics={filters.topics} />
                </>
              )}
            </div>
          )}

          {activeTab === 'compare' && (
            <ComparePanel parties={selectedPartiesForCompare} />
          )}

          {activeTab === 'program' && (
            <div className="space-y-4">
              {/* Party selector */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <label htmlFor="party-select" className="block text-sm font-medium text-gray-300 mb-3">
                  Vali erakond
                </label>
                <select
                  id="party-select"
                  value={selectedProgramParty}
                  onChange={(e) => setSelectedProgramParty(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Vali erakond --</option>
                  {parties.map(party => (
                    <option key={party.party_name} value={party.party_name}>
                      {party.party_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Party program details */}
              {selectedProgramParty && (() => {
                const party = parties.find(p => p.party_name === selectedProgramParty)
                if (!party) return null

                return (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{party.party_name}</h2>

                    {/* Uued ettepanekud */}
                    <section className="mb-8">
                      <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3">Uued ettepanekud</h3>
                      {party.new_proposals && party.new_proposals.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2">
                          {party.new_proposals.map((proposal, index) => (
                            <li key={index} className="text-sm sm:text-base text-gray-300">
                              {proposal}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Info puudub</p>
                      )}
                    </section>

                    {/* Võtmeideed */}
                    <section className="mb-8">
                      <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3">Võtmeideed</h3>
                      {party.key_ideas && party.key_ideas.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2">
                          {party.key_ideas.map((idea, index) => (
                            <li key={index} className="text-sm sm:text-base text-gray-300">
                              {idea}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Info puudub</p>
                      )}
                    </section>

                    {/* Eelmised lubadused */}
                    <section className="mb-8">
                      <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3">Eelmised lubadused</h3>
                      {party.previous_promises && party.previous_promises.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm sm:text-base">
                            <thead>
                              <tr className="border-b border-slate-600">
                                <th className="text-left py-3 px-3 font-medium text-gray-300">Lubadus</th>
                                <th className="text-left py-3 px-3 font-medium text-gray-300">Staatus</th>
                                <th className="text-left py-3 px-3 font-medium text-gray-300">Märkused</th>
                              </tr>
                            </thead>
                            <tbody>
                              {party.previous_promises.map((promise, index) => (
                                <tr key={index} className="border-b border-slate-700/30">
                                  <td className="py-3 px-3 text-gray-300">{promise.promise}</td>
                                  <td className="py-3 px-3">
                                    <span className={`inline-block px-3 py-1 text-xs rounded ${
                                      promise.fulfilled === 'jah' ? 'bg-green-100 text-green-800' :
                                      promise.fulfilled === 'osaliselt' ? 'bg-yellow-100 text-yellow-800' :
                                      promise.fulfilled === 'ei' ? 'bg-red-100 text-red-800' :
                                      'bg-slate-700 text-gray-400'
                                    }`}>
                                      {promise.fulfilled}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-gray-400">{promise.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Info puudub</p>
                      )}
                    </section>

                    {/* Teemafookus */}
                    <section className="mb-8">
                      <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3">Teemafookus</h3>
                      <div className="space-y-4">
                        {Object.entries(party.relevance_to_priority_topics || {}).map(([topic, content]) => (
                          <div key={topic}>
                            <h4 className="text-sm sm:text-base font-medium text-gray-200 mb-1 capitalize">{topic}</h4>
                            <p className="text-sm sm:text-base text-gray-400">
                              {content && content !== 'info puudub' ? content : <span className="italic">Info puudub</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Allikad */}
                    <section>
                      <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-3">Allikad</h3>
                      {party.sources && party.sources.length > 0 ? (
                        <ul className="space-y-2">
                          {party.sources.map((source, index) => (
                            <li key={index}>
                              <a
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm sm:text-base text-indigo-300 hover:text-indigo-400 underline break-all"
                              >
                                {source}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Info puudub</p>
                      )}
                    </section>
                  </div>
                )
              })()}
            </div>
          )}
        </main>
      </div>

      {/* Tutorial nupp paremas all nurgas */}
      {!showTutorial && (
        <button
          onClick={handleOpenTutorial}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center text-2xl font-bold z-40"
          aria-label="Ava tutorial"
          title="Vaata tutoriali uuesti"
        >
          ?
        </button>
      )}
    </div>
  )
}

export default App
