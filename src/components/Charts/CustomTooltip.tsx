import { memo } from 'react'

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl p-4 min-w-[200px]">
      {label && (
        <p className="font-semibold text-white mb-2 pb-2 border-b border-slate-600/50">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-300">{entry.name}:</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
