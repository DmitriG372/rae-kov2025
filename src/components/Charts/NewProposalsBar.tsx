import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Party } from '../../lib/types'
import { CustomTooltip } from './CustomTooltip'

interface NewProposalsBarProps {
  parties: Party[]
}

export const NewProposalsBar = memo(function NewProposalsBar({ parties }: NewProposalsBarProps) {
  const data = parties.map(party => ({
    name: party.party_name,
    ettepanekuid: party.new_proposals?.length || 0,
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Andmed puuduvad</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-700/50 shadow-xl card-hover">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Uute ettepanekute arv erakonniti</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="name"
            angle={-15}
            textAnchor="end"
            height={100}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Arv', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
          <Legend />
          <Bar dataKey="ettepanekuid" fill="#3b82f6" name="Uued ettepanekud" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
