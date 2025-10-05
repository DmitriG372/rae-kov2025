import { memo, useMemo } from 'react'
import type { Party, Topic } from '../../lib/types'

const TOPICS: Topic[] = ['areng', 'ühistransport', 'turvalisus', 'infrastruktuur']

const TOPICS_LABELS: Record<Topic, string> = {
  areng: 'Areng',
  'ühistransport': 'Ühistransport',
  turvalisus: 'Turvalisus',
  infrastruktuur: 'Infrastruktuur',
}

interface TopicsHeatmapProps {
  parties: Party[]
  selectedTopics?: Topic[]
}

export const TopicsHeatmap = memo(function TopicsHeatmap({ parties, selectedTopics = [] }: TopicsHeatmapProps) {
  // Kui teemad on valitud, näita ainult neid; muidu kõiki
  const topicsToShow = selectedTopics.length > 0 ? selectedTopics : TOPICS

  const { scores, maxScore } = useMemo(() => {
    const scoresMap = new Map<string, number>()
    let max = 0

    parties.forEach(party => {
      topicsToShow.forEach(topic => {
        const text = party.relevance_to_priority_topics?.[topic] || ''
        const score = text === 'info puudub' ? 0 : text.length
        const key = `${party.party_name}-${topic}`
        scoresMap.set(key, score)
        if (score > max) max = score
      })
    })

    return { scores: scoresMap, maxScore: max }
  }, [parties, topicsToShow])

  const getColor = (score: number): string => {
    if (score === 0 || maxScore === 0) return '#f3f4f6' // gray-100

    const intensity = score / maxScore
    // Sinise skaala
    if (intensity < 0.2) return '#dbeafe' // blue-100
    if (intensity < 0.4) return '#bfdbfe' // blue-200
    if (intensity < 0.6) return '#93c5fd' // blue-300
    if (intensity < 0.8) return '#60a5fa' // blue-400
    return '#3b82f6' // blue-500
  }

  if (parties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Andmed puuduvad</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-700/50 shadow-xl card-hover">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">Teemafookuse rõhk</h3>
      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
        Mida pikem kirjeldus, seda tumedam ruut (ligikaudne fookuse indikaator)
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${topicsToShow.length}, minmax(80px, 100px))` }}>
            {/* Päis */}
            <div className="font-medium text-xs sm:text-sm p-1 sm:p-2"></div>
            {topicsToShow.map(topic => (
              <div key={topic} className="font-medium text-xs sm:text-sm p-1 sm:p-2 text-center text-gray-300">
                {TOPICS_LABELS[topic]}
              </div>
            ))}

            {/* Read */}
            {parties.map(party => (
              <div key={party.party_name} className="contents">
                <div className="font-medium text-xs sm:text-sm p-1 sm:p-2 truncate text-gray-300" title={party.party_name}>
                  {party.party_name}
                </div>
                {topicsToShow.map(topic => {
                  const key = `${party.party_name}-${topic}`
                  const score = scores.get(key) || 0
                  const color = getColor(score)
                  return (
                    <div
                      key={topic}
                      className="p-1 sm:p-2 border border-slate-600 flex items-center justify-center text-xs hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`${TOPICS_LABELS[topic]}: ${score} tähemärki`}
                    >
                      {score > 0 ? score : '-'}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-slate-600" style={{ backgroundColor: '#f3f4f6' }}></div>
              <span className="text-gray-400">0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-slate-600" style={{ backgroundColor: '#dbeafe' }}></div>
              <span className="text-gray-400">Vähe</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-slate-600" style={{ backgroundColor: '#93c5fd' }}></div>
              <span className="text-gray-400">Keskmine</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-slate-600" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-gray-400">Palju</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
