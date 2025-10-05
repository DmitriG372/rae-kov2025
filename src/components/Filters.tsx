import { memo } from 'react'
import type { Filters, Party, PromiseStatus, Topic, SortOption } from '../lib/types'

const STATUSES: { value: PromiseStatus; label: string }[] = [
  { value: 'jah', label: 'Jah' },
  { value: 'osaliselt', label: 'Osaliselt' },
  { value: 'ei', label: 'Ei' },
  { value: 'info puudub', label: 'Info puudub' },
]

const TOPICS_LABELS: Record<Topic, string> = {
  areng: 'Areng',
  'ühistransport': 'Ühistransport',
  turvalisus: 'Turvalisus',
  infrastruktuur: 'Infrastruktuur',
}

const SORT_OPTIONS: { value: SortOption; label: string; shortLabel: string }[] = [
  { value: 'alphabetical', label: 'Tähestikuline', shortLabel: 'A-Z' },
  { value: 'proposals_desc', label: 'Uusi ettepanekuid ↓', shortLabel: 'Uued ↓' },
  { value: 'proposals_asc', label: 'Uusi ettepanekuid ↑', shortLabel: 'Uued ↑' },
  { value: 'fulfilled_desc', label: 'Täidetud lubadusi ↓', shortLabel: 'Täidetud ↓' },
  { value: 'fulfilled_asc', label: 'Täidetud lubadusi ↑', shortLabel: 'Täidetud ↑' },
  { value: 'partial_desc', label: 'Osaliselt ↓', shortLabel: 'Osaliselt ↓' },
  { value: 'partial_asc', label: 'Osaliselt ↑', shortLabel: 'Osaliselt ↑' },
  { value: 'unfulfilled_desc', label: 'Ei ↓', shortLabel: 'Ei ↓' },
  { value: 'unfulfilled_asc', label: 'Ei ↑', shortLabel: 'Ei ↑' },
]

interface FiltersProps {
  filters: Filters
  parties: Party[]
  onFiltersChange: (filters: Filters) => void
}

export const FiltersComponent = memo(function FiltersComponent({
  filters,
  parties,
  onFiltersChange,
}: FiltersProps) {
  const handlePartyToggle = (partyName: string) => {
    const newSelected = filters.selectedParties.includes(partyName)
      ? filters.selectedParties.filter(p => p !== partyName)
      : [...filters.selectedParties, partyName]

    onFiltersChange({ ...filters, selectedParties: newSelected })
  }

  const handleStatusToggle = (status: PromiseStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status]

    onFiltersChange({ ...filters, statuses: newStatuses })
  }

  const handleTopicToggle = (topic: Topic) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic]

    onFiltersChange({ ...filters, topics: newTopics })
  }

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy })
  }

  return (
    <div className="w-80 lg:w-96 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 p-4 sm:p-6 overflow-y-auto shadow-2xl h-full">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Filtrid</h2>

      {/* Erakonnad */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-200">Erakonnad võrdluseks (max 3)</h3>
        {filters.selectedParties.length >= 3 && (
          <p className="text-xs text-amber-400 mb-2" role="alert">
            Maksimaalselt 3 erakonda võrdluseks
          </p>
        )}
        <div className="space-y-2">
          {parties.map(party => (
            <label
              key={party.party_name}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.selectedParties.includes(party.party_name)}
                onChange={() => handlePartyToggle(party.party_name)}
                disabled={
                  filters.selectedParties.length >= 3 &&
                  !filters.selectedParties.includes(party.party_name)
                }
                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Vali ${party.party_name}`}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{party.party_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lubaduste staatus */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-200">Lubaduste staatus</h3>
        <div className="space-y-2">
          {STATUSES.map(status => (
            <label
              key={status.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.statuses.includes(status.value)}
                onChange={() => handleStatusToggle(status.value)}
                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Filter: ${status.label}`}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Teemad */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-200">Teemafookus</h3>
        <div className="space-y-2">
          {(Object.entries(TOPICS_LABELS) as [Topic, string][]).map(([topic, label]) => (
            <label
              key={topic}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.topics.includes(topic)}
                onChange={() => handleTopicToggle(topic)}
                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Filter: ${label}`}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sortimine */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-gray-200">Sortimine</h3>
        <div className="grid grid-cols-2 gap-2">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-2 py-2 rounded-md text-xs text-center transition-all ${
                filters.sortBy === option.value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
              aria-label={option.label}
              title={option.label}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})
