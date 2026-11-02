import type { Campus, Category, EventLanguage, ProgrammeEvent } from '@/types/event'
import { zurichDayKey } from '@/utils/dates'

export interface Filters {
  campuses: Campus[]
  categories: Category[]
  languages: EventLanguage[]
}

export const EMPTY_FILTERS: Filters = { campuses: [], categories: [], languages: [] }

export function hasActiveFilters(filters: Filters): boolean {
  return filters.campuses.length + filters.categories.length + filters.languages.length > 0
}

/**
 * Language rule (PRD FR02): English matches English-only events; German
 * matches German-only and bilingual German/English events.
 */
export function matchesLanguage(event: ProgrammeEvent, language: EventLanguage): boolean {
  if (language === 'en') return event.languages.length === 1 && event.languages[0] === 'en'
  return event.languages.includes('de')
}

/** OR within each filter group, AND across groups. Empty groups do not restrict. */
export function matchesFilters(event: ProgrammeEvent, filters: Filters): boolean {
  if (filters.campuses.length && !filters.campuses.includes(event.campus)) return false
  if (filters.categories.length && !filters.categories.includes(event.category)) return false
  if (filters.languages.length && !filters.languages.some((l) => matchesLanguage(event, l))) return false
  return true
}

const titleOrder = new Intl.Collator('en')

/** By start time, then title (English-locale), so simultaneous starts have a stable order. */
export function sortByStart(events: ProgrammeEvent[]): ProgrammeEvent[] {
  return [...events].sort((a, b) => Date.parse(a.start) - Date.parse(b.start) || titleOrder.compare(a.title, b.title))
}

/** Events on a Zurich calendar day matching the filters, ordered by start time. */
export function filterEvents(events: ProgrammeEvent[], day: string, filters: Filters): ProgrammeEvent[] {
  return sortByStart(events.filter((e) => zurichDayKey(e.start) === day && matchesFilters(e, filters)))
}
