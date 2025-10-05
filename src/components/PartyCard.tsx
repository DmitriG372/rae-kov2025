import { memo } from 'react'
import type { Party, Topic } from '../lib/types'
import { SourcesList } from './SourcesList'

const TOPICS_LABELS: Record<Topic, string> = {
  areng: 'Areng',
  'ühistransport': 'Ühistransport',
  turvalisus: 'Turvalisus',
  infrastruktuur: 'Infrastruktuur',
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'jah':
      return 'bg-green-100 text-green-800'
    case 'osaliselt':
      return 'bg-yellow-100 text-yellow-800'
    case 'ei':
      return 'bg-red-100 text-red-800'
    case 'info puudub':
      return 'bg-slate-700 text-gray-400'
    default:
      return 'bg-slate-700 text-gray-400'
  }
}

interface PartyCardProps {
  party: Party
}

export const PartyCard = memo(function PartyCard({ party }: PartyCardProps) {
  const hasInfoPuudub = (value: unknown): boolean => {
    if (!value) return true
    if (typeof value === 'string' && value.trim() === 'info puudub') return true
    if (Array.isArray(value) && value.length === 0) return true
    if (Array.isArray(value) && value.every(v => !v || v === 'info puudub')) return true
    return false
  }

  const showInfoPuudubBadge =
    hasInfoPuudub(party.new_proposals) ||
    hasInfoPuudub(party.key_ideas) ||
    hasInfoPuudub(party.previous_promises) ||
    hasInfoPuudub(party.sources)

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 shadow-xl card-hover">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">{party.party_name}</h3>
        {showInfoPuudubBadge && (
          <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
            info puudub
          </span>
        )}
      </div>

      {/* Uued ettepanekud */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Uued ettepanekud</h4>
        {party.new_proposals && party.new_proposals.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {party.new_proposals.map((proposal, index) => (
              <li key={index} className="text-xs sm:text-sm text-gray-400">
                {proposal}
              </li>
            ))}
          </ul>
        ) : (
          <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
            info puudub
          </span>
        )}
      </div>

      {/* Võtmeideed */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Võtmeideed</h4>
        {party.key_ideas && party.key_ideas.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {party.key_ideas.map((idea, index) => (
              <li key={index} className="text-xs sm:text-sm text-gray-400">
                {idea}
              </li>
            ))}
          </ul>
        ) : (
          <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
            info puudub
          </span>
        )}
      </div>

      {/* Eelmised lubadused */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Eelmised lubadused</h4>
        {party.previous_promises && party.previous_promises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-1.5 sm:py-2 px-1 sm:px-2 font-medium text-gray-300">Lubadus</th>
                  <th className="text-left py-1.5 sm:py-2 px-1 sm:px-2 font-medium text-gray-300">Staatus</th>
                  <th className="text-left py-1.5 sm:py-2 px-1 sm:px-2 font-medium text-gray-300">Märkused</th>
                </tr>
              </thead>
              <tbody>
                {party.previous_promises.map((promise, index) => (
                  <tr key={index} className="border-b border-slate-700/30">
                    <td className="py-1.5 sm:py-2 px-1 sm:px-2 text-gray-400">{promise.promise}</td>
                    <td className="py-1.5 sm:py-2 px-1 sm:px-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(
                          promise.fulfilled
                        )}`}
                      >
                        {promise.fulfilled}
                      </span>
                    </td>
                    <td className="py-1.5 sm:py-2 px-1 sm:px-2 text-gray-400">{promise.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
            info puudub
          </span>
        )}
      </div>

      {/* Teemad */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Teemafookus</h4>
        <div className="space-y-2">
          {(Object.entries(TOPICS_LABELS) as [Topic, string][]).map(([topic, label]) => {
            const content = party.relevance_to_priority_topics?.[topic]
            return (
              <div key={topic}>
                <span className="text-xs sm:text-sm font-medium text-gray-300">{label}:</span>{' '}
                <span className="text-xs sm:text-sm text-gray-400">
                  {content && content !== 'info puudub' ? (
                    content
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
                      info puudub
                    </span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Allikad */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold mb-2 text-gray-300">Allikad</h4>
        <SourcesList sources={party.sources} />
      </div>
    </div>
  )
})
