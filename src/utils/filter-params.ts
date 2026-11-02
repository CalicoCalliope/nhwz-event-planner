import { CAMPUSES, CATEGORIES, EVENT_LANGUAGES } from '@/types/event'
import type { Filters } from '@/utils/filter-events'

/**
 * Applied filters live in the URL (?campus=…&category=…&language=…) so that
 * Back from event details and page reloads restore them.
 */
const KEYS = { campuses: 'campus', categories: 'category', languages: 'language' } as const

function readList<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const values = params.getAll(key)
  // Keep the canonical option order and drop unknown or duplicate values.
  return allowed.filter((option) => values.includes(option))
}

export function readFilters(params: URLSearchParams): Filters {
  return {
    campuses: readList(params, KEYS.campuses, CAMPUSES),
    categories: readList(params, KEYS.categories, CATEGORIES),
    languages: readList(params, KEYS.languages, EVENT_LANGUAGES),
  }
}

/** Returns a copy of params with the filter keys replaced; other keys (e.g. day) are kept. */
export function writeFilters(params: URLSearchParams, filters: Filters): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const group of Object.keys(KEYS) as (keyof Filters)[]) {
    next.delete(KEYS[group])
    filters[group].forEach((value) => next.append(KEYS[group], value))
  }
  return next
}
