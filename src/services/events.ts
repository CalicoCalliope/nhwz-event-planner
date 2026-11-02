/**
 * Event data access. UI code reads events only through this module, so the
 * JSON source can later be swapped for an API without touching components.
 */
import rawData from '../../data/events.json'
import type { Edition, ProgrammeEvent } from '@/types/event'
import { validateEventData } from '@/utils/validate-events'

const { data, errors, warnings } = validateEventData(rawData)

if (import.meta.env.DEV) {
  errors.forEach((e) => console.error(`[data/events.json] ${e}`))
  warnings.forEach((w) => console.warn(`[data/events.json] ${w}`))
}

const byId = new Map(data.events.map((e) => [e.id, e]))

export function getEdition(): Edition {
  return data.edition
}

export function getAllEvents(): ProgrammeEvent[] {
  return data.events
}

export function getEventById(id: string): ProgrammeEvent | undefined {
  return byId.get(id)
}
