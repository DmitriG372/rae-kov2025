import { memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Party } from '../../lib/types'
import { CustomTooltip } from './CustomTooltip'

interface PromisesStackedProps {
  parties: Party[]
}

export const PromisesStacked = memo(function PromisesStacked({ parties }: PromisesStackedProps) {
  const data = parties.map(party => {
    const promises = party.previous_promises || []

    const counts = {
      jah: 0,
      osaliselt: 0,
      ei: 0,
      'info puudub': 0,
    }

    promises.forEach(promise => {
      const status = promise.fulfilled
      if (status in counts) {
        counts[status]++
      }
    })

    return {
      name: party.party_name,
      jah: counts.jah,
      osaliselt: counts.osaliselt,
      ei: counts.ei,
      infoPuudub: counts['info puudub'],
    }
  })

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Andmed puuduvad</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-700/50 shadow-xl card-hover">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Eelmiste lubaduste täitmine</h3>
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
          <Bar dataKey="jah" stackId="a" fill="#22c55e" name="Jah" />
          <Bar dataKey="osaliselt" stackId="a" fill="#eab308" name="Osaliselt" />
          <Bar dataKey="ei" stackId="a" fill="#ef4444" name="Ei" />
          <Bar dataKey="infoPuudub" stackId="a" fill="#9ca3af" name="Info puudub" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
