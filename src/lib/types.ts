export type PromiseStatus = "jah" | "ei" | "osaliselt" | "info puudub"

export type PreviousPromise = {
  promise: string
  fulfilled: PromiseStatus
  notes: string
}

export type RelevanceToTopics = {
  areng: string
  "ühistransport": string
  turvalisus: string
  infrastruktuur: string
}

export type Party = {
  party_name: string
  new_proposals: string[]
  key_ideas: string[]
  previous_promises: PreviousPromise[]
  relevance_to_priority_topics: RelevanceToTopics
  sources: string[]
}

export type Topic = keyof RelevanceToTopics

export const TOPICS: Topic[] = ["areng", "ühistransport", "turvalisus", "infrastruktuur"]

export type SortOption =
  | "alphabetical"
  | "proposals_desc"
  | "proposals_asc"
  | "fulfilled_desc"
  | "fulfilled_asc"
  | "partial_desc"
  | "partial_asc"
  | "unfulfilled_desc"
  | "unfulfilled_asc"

export type Filters = {
  selectedParties: string[]
  statuses: PromiseStatus[]
  topics: Topic[]
  sortBy: SortOption
  searchQuery: string
}
