import { memo, useState, useRef, useEffect } from 'react'

const SEARCH_EXAMPLES = [
  'tramm',
  'lasteaed',
  'maamaks',
]

interface SearchWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
}

export const SearchWithSuggestions = memo(function SearchWithSuggestions({
  value,
  onChange,
}: SearchWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        placeholder="Otsi..."
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-white text-sm placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
        aria-label="Otsing"
      />

      {showSuggestions && !value && (
        <div className="absolute top-full left-0 mt-2 w-full bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl z-[100]">
          <div className="p-2 text-xs text-gray-400 border-b border-slate-700">
            Näidisotsingud:
          </div>
          {SEARCH_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(example)}
              className="w-full text-left px-4 py-2 hover:bg-slate-700/50 focus:outline-none focus:bg-slate-700/50 text-sm text-gray-300 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
