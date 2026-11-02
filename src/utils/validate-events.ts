import {
  CAMPUSES,
  CATEGORIES,
  EVENT_LANGUAGES,
  type Edition,
  type EventData,
  type ProgrammeEvent,
} from '@/types/event'
import { isIsoWithOffset, zurichDayKey } from '@/utils/dates'
import { isHttpUrl } from '@/utils/links'

export interface ValidationResult {
  data: EventData
  /** Problems that caused a record to be excluded. */
  errors: string[]
  /** Non-blocking issues the team should review. */
  warnings: string[]
}

type Rec = Record<string, unknown>

const isObject = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v)
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''
const isNullableString = (v: unknown) => v === null || typeof v === 'string'
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/

function validateEdition(raw: unknown): { edition: Edition | null; errors: string[] } {
  const errors: string[] = []
  if (!isObject(raw)) return { edition: null, errors: ['edition: missing or not an object'] }
  if (!isNonEmptyString(raw.name)) errors.push('edition.name: required')
  if (!Array.isArray(raw.days) || raw.days.length === 0 || !raw.days.every((d) => typeof d === 'string' && DAY_KEY.test(d)))
    errors.push('edition.days: must be a non-empty list of YYYY-MM-DD dates')
  if (raw.timeZone !== 'Europe/Zurich') errors.push('edition.timeZone: must be "Europe/Zurich"')
  if (!isNullableString(raw.notice ?? null)) errors.push('edition.notice: must be text or null')
  return { edition: errors.length ? null : (raw as unknown as Edition), errors }
}

/** Returns the problems with one event record; an empty list means it is valid. */
export function validateEvent(raw: unknown): string[] {
  if (!isObject(raw)) return ['record is not an object']
  const errors: string[] = []
  const req = (field: string) => {
    if (!isNonEmptyString(raw[field])) errors.push(`${field}: required text`)
  }
  ;['id', 'title', 'venue'].forEach(req)
  if (raw.description !== null && !isNonEmptyString(raw.description)) errors.push('description: must be text or null')

  for (const field of ['start', 'end']) {
    if (typeof raw[field] !== 'string' || !isIsoWithOffset(raw[field]))
      errors.push(`${field}: must be an ISO timestamp with timezone offset, e.g. 2026-04-13T12:15:00+02:00`)
  }
  if (!errors.some((e) => e.startsWith('start') || e.startsWith('end')) && Date.parse(raw.end as string) <= Date.parse(raw.start as string))
    errors.push('end: must be after start')

  if (!CAMPUSES.includes(raw.campus as never)) errors.push(`campus: must be one of ${CAMPUSES.join(', ')}`)
  if (!CATEGORIES.includes(raw.category as never)) errors.push(`category: must be one of ${CATEGORIES.join(', ')}`)
  if (
    !Array.isArray(raw.languages) ||
    raw.languages.length === 0 ||
    new Set(raw.languages).size !== raw.languages.length ||
    !raw.languages.every((l) => EVENT_LANGUAGES.includes(l))
  )
    errors.push('languages: must list "en" and/or "de"')

  if (!isNullableString(raw.address)) errors.push('address: must be text or null')
  if (typeof raw.locationConfirmed !== 'boolean') errors.push('locationConfirmed: must be true or false')
  if (raw.mapUrl !== null && !isHttpUrl(raw.mapUrl)) errors.push('mapUrl: must be an absolute http(s) URL or null')

  const reg = raw.registration
  if (!isObject(reg) || typeof reg.required !== 'boolean' || !isNullableString(reg.url))
    errors.push('registration: must be { "required": true|false, "url": text or null }')

  if (raw.status !== 'scheduled' && raw.status !== 'cancelled') errors.push('status: must be "scheduled" or "cancelled"')
  return errors
}

/** Validates raw event data. Invalid events are excluded and reported, never shown. */
export function validateEventData(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const root = isObject(raw) ? raw : {}
  const { edition, errors: editionErrors } = validateEdition(root.edition)
  errors.push(...editionErrors)

  const rawEvents = Array.isArray(root.events) ? root.events : []
  if (!Array.isArray(root.events)) errors.push('events: missing or not a list')

  const seen = new Set<string>()
  const events: ProgrammeEvent[] = []
  rawEvents.forEach((rawEvent, index) => {
    const label = isObject(rawEvent) && isNonEmptyString(rawEvent.id) ? `event "${rawEvent.id}"` : `event #${index + 1}`
    const problems = validateEvent(rawEvent)
    const event = rawEvent as ProgrammeEvent
    if (!problems.length && seen.has(event.id)) problems.push('id: duplicate')
    if (problems.length) {
      errors.push(...problems.map((p) => `${label}: ${p}`))
      return
    }
    seen.add(event.id)
    if (event.registration.required && event.registration.url !== null && !isHttpUrl(event.registration.url))
      warnings.push(`${label}: registration.url is not a valid http(s) URL; "Contact the organiser" is shown`)
    if (edition && !edition.days.includes(zurichDayKey(event.start)))
      warnings.push(`${label}: starts outside the configured edition days, so it is not shown in the programme`)
    events.push(event)
  })

  return {
    data: {
      edition: edition ?? { name: 'Sustainability Week Zurich', days: [], timeZone: 'Europe/Zurich', notice: null },
      events,
    },
    errors,
    warnings,
  }
}
