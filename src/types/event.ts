export const CAMPUSES = ['UZH Irchel', 'ETH Zentrum', 'PHZH', 'ZHdK', 'ZHAW', 'Other'] as const
export type Campus = (typeof CAMPUSES)[number]

export const CATEGORIES = [
  'Workshop',
  'Panel',
  'Exhibition',
  'Info event',
  'Food',
  'Game',
  'Tour',
  'Music & Film',
] as const
export type Category = (typeof CATEGORIES)[number]

/** Languages an event is held in. A bilingual event lists both. */
export const EVENT_LANGUAGES = ['en', 'de'] as const
export type EventLanguage = (typeof EVENT_LANGUAGES)[number]

export type EventStatus = 'scheduled' | 'cancelled'

/**
 * Flags for information the source programme does not provide, and for
 * records changed only to demonstrate an app state. Shown in the UI so
 * demonstration content is never mistaken for confirmed information.
 */
export interface DataFlags {
  /** Description is demonstration copy, not approved event text. */
  demoDescription?: boolean
  /** Explains a test-only change, e.g. an artificial cancellation. */
  testVariant?: string
  /** Fields the source did not provide and the team must confirm. */
  missing?: string[]
  /** Where sources disagree, e.g. the programme image and the design. */
  note?: string
}

export interface Registration {
  required: boolean
  /** External registration page; null when unknown. */
  url: string | null
}

export interface ProgrammeEvent {
  /** Stable unique ID; also used for saved events, so never reuse or change it. */
  id: string
  title: string
  /** Null until the organisers supply one; the programme image has no descriptions. */
  description: string | null
  /** ISO 8601 timestamp with explicit offset, e.g. 2026-04-13T12:15:00+02:00 */
  start: string
  end: string
  campus: Campus
  venue: string
  address: string | null
  /** False when the location is missing or disputed: no directions are offered. */
  locationConfirmed: boolean
  mapUrl: string | null
  category: Category
  languages: EventLanguage[]
  registration: Registration
  status: EventStatus
  dataFlags?: DataFlags
}

export interface Edition {
  name: string
  /** Consecutive programme days, as YYYY-MM-DD in the edition time zone. */
  days: string[]
  timeZone: string
  /** Shown site-wide, e.g. to mark historical demonstration data. */
  notice: string | null
}

export interface EventData {
  edition: Edition
  events: ProgrammeEvent[]
}
