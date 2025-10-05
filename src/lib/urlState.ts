import type { Filters, PromiseStatus, Topic, SortOption } from './types'

export function getFiltersFromURL(): Partial<Filters> {
  const params = new URLSearchParams(window.location.search)

  const filters: Partial<Filters> = {}

  const q = params.get('q')
  if (q) filters.searchQuery = q

  const status = params.get('status')
  if (status) {
    filters.statuses = status.split(',').filter(s =>
      ['jah', 'ei', 'osaliselt', 'info puudub'].includes(s)
    ) as PromiseStatus[]
  }

  const topics = params.get('topics')
  if (topics) {
    filters.topics = topics.split(',').filter(t =>
      ['areng', 'ühistransport', 'turvalisus', 'infrastruktuur'].includes(t)
    ) as Topic[]
  }

  const compare = params.get('compare')
  if (compare) {
    filters.selectedParties = compare.split(',').filter(p => p.trim())
  }

  const sort = params.get('sort')
  if (sort) {
    filters.sortBy = sort as SortOption
  }

  return filters
}

export function updateURL(filters: Filters): void {
  const params = new URLSearchParams()

  if (filters.searchQuery) {
    params.set('q', filters.searchQuery)
  }

  if (filters.statuses.length > 0) {
    params.set('status', filters.statuses.join(','))
  }

  if (filters.topics.length > 0) {
    params.set('topics', filters.topics.join(','))
  }

  if (filters.selectedParties.length > 0) {
    params.set('compare', filters.selectedParties.join(','))
  }

  if (filters.sortBy !== 'alphabetical') {
    params.set('sort', filters.sortBy)
  }

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname

  window.history.replaceState({}, '', newURL)
}
