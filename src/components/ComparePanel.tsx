import { memo } from 'react'
import type { Party } from '../lib/types'
import { PartyCard } from './PartyCard'

interface ComparePanelProps {
  parties: Party[]
}

export const ComparePanel = memo(function ComparePanel({ parties }: ComparePanelProps) {
  if (parties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Palun valige vähemalt üks erakond võrdluseks</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {parties.map(party => (
        <PartyCard key={party.party_name} party={party} />
      ))}
    </div>
  )
})
