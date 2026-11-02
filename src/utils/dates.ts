/** All displayed dates and times use the event's local time zone. */
export const TIME_ZONE = 'Europe/Zurich'

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const fullDateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Day keys are calendar dates, so format them at UTC noon to avoid any shift.
const dayKeyToDate = (dayKey: string) => new Date(`${dayKey}T12:00:00Z`)

const weekdayShortFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short' })
const weekdayLongFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long' })
const dayMonthFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' })
const dayMonthLongFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long' })
const dayKeyMediumFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })
const dayKeyLongFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** ISO timestamp with an explicit offset (Z or ±HH:MM). */
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/

export function isIsoWithOffset(value: string): boolean {
  return ISO_WITH_OFFSET.test(value) && !Number.isNaN(Date.parse(value))
}

/** Zurich calendar date of a timestamp, as YYYY-MM-DD. */
export function zurichDayKey(iso: string): string {
  return dayKeyFormat.format(new Date(iso))
}

/** e.g. "09:30" */
export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso))
}

/** e.g. "09:30–11:00" */
export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)}–${formatTime(end)}`
}

/** e.g. "Monday, 13 April 2026" */
export function formatFullDate(iso: string): string {
  return fullDateFormat.format(new Date(iso))
}

const eventDateFormat = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: 'numeric', month: 'long', year: 'numeric' })

/** e.g. "13 April 2026", as on the event details design. */
export function formatEventDate(iso: string): string {
  return eventDateFormat.format(new Date(iso))
}

/** e.g. "13–17 April 2026" for days within one month, otherwise "30 March – 3 April 2026". */
export function formatDayRange(firstDay: string, lastDay: string): string {
  const [first, last] = [dayKeyToDate(firstDay), dayKeyToDate(lastDay)]
  const end = dayKeyLongFormat.formatToParts(last)
  const part = (type: string) => end.find((p) => p.type === type)?.value ?? ''
  if (first.getUTCMonth() === last.getUTCMonth() && first.getUTCFullYear() === last.getUTCFullYear()) {
    return `${first.getUTCDate()}–${part('day')} ${part('month')} ${part('year')}`
  }
  return `${dayMonthLongFormat.format(first)} – ${part('day')} ${part('month')} ${part('year')}`
}

/** Labels for a YYYY-MM-DD key, e.g. weekday "Mon", day "13", medium "Monday 13 April". */
export function formatDayLabel(dayKey: string): {
  weekday: string
  weekdayLong: string
  day: string
  date: string
  dayMonth: string
  medium: string
  long: string
} {
  const date = dayKeyToDate(dayKey)
  return {
    weekday: weekdayShortFormat.format(date),
    weekdayLong: weekdayLongFormat.format(date),
    dayMonth: dayMonthLongFormat.format(date),
    day: String(date.getUTCDate()),
    date: dayMonthFormat.format(date),
    // Comma removed to match the design's "Monday 13 April" in all ICU versions.
    medium: dayKeyMediumFormat.format(date).replace(',', ''),
    long: dayKeyLongFormat.format(date),
  }
}
