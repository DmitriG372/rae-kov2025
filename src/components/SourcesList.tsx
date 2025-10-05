import { memo } from 'react'

interface SourcesListProps {
  sources: string[]
}

export const SourcesList = memo(function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) {
    return (
      <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
        info puudub
      </span>
    )
  }

  return (
    <ul className="space-y-1">
      {sources.map((source, index) => {
        if (source === 'info puudub' || !source.trim()) {
          return (
            <li key={index}>
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                info puudub
              </span>
            </li>
          )
        }

        // Kontrolli, kas on URL
        const isURL = source.startsWith('http://') || source.startsWith('https://')

        return (
          <li key={index} className="text-sm">
            {isURL ? (
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {source}
              </a>
            ) : (
              <span className="text-gray-700">{source}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
})
