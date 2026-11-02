import { describe, expect, it } from 'vitest'
import { formatDayLabel, formatDayRange, formatFullDate, formatTimeRange, isIsoWithOffset, zurichDayKey } from './dates'

describe('dates', () => {
  it('requires an explicit offset', () => {
    expect(isIsoWithOffset('2026-04-13T12:15:00+02:00')).toBe(true)
    expect(isIsoWithOffset('2026-04-13T10:15:00Z')).toBe(true)
    expect(isIsoWithOffset('2026-04-13T12:15:00')).toBe(false)
    expect(isIsoWithOffset('13.04.2026 12:15')).toBe(false)
  })

  it('formats in Europe/Zurich regardless of the supplied offset', () => {
    expect(formatTimeRange('2026-04-13T10:15:00Z', '2026-04-13T11:30:00Z')).toBe('12:15–13:30')
    // 23:30 UTC on 13 April is already 14 April in Zurich (CEST).
    expect(zurichDayKey('2026-04-13T23:30:00Z')).toBe('2026-04-14')
    expect(formatFullDate('2026-04-13T12:15:00+02:00')).toBe('Monday, 13 April 2026')
  })

  it('labels configured days', () => {
    expect(formatDayLabel('2026-04-13')).toEqual({
      weekday: 'Mon',
      day: '13',
      weekdayLong: 'Monday',
      date: '13 Apr',
      dayMonth: '13 April',
      medium: 'Monday 13 April',
      long: 'Monday, 13 April 2026',
    })
    expect(formatDayRange('2026-04-13', '2026-04-17')).toBe('13–17 April 2026')
  })
})
