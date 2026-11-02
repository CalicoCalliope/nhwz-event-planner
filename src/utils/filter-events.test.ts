import { describe, expect, it } from 'vitest'
import { makeEvent } from '@/test/factories'
import { EMPTY_FILTERS, filterEvents, matchesFilters } from './filter-events'

const en = makeEvent({ id: 'en', languages: ['en'] })
const de = makeEvent({ id: 'de', languages: ['de'] })
const both = makeEvent({ id: 'both', languages: ['de', 'en'] })
const ids = (events: { id: string }[]) => events.map((e) => e.id)

describe('language rule', () => {
  const all = [en, de, both]
  const pick = (languages: ('en' | 'de')[]) => ids(all.filter((e) => matchesFilters(e, { ...EMPTY_FILTERS, languages })))

  it('English matches English-only events', () => expect(pick(['en'])).toEqual(['en']))
  it('German matches German-only and bilingual events', () => expect(pick(['de'])).toEqual(['de', 'both']))
  it('both selections return the union', () => expect(pick(['en', 'de'])).toEqual(['en', 'de', 'both']))
  it('no selection adds no restriction', () => expect(pick([])).toEqual(['en', 'de', 'both']))
})

describe('filterEvents', () => {
  const events = [
    makeEvent({ id: 'b', start: '2026-04-13T14:00:00+02:00', end: '2026-04-13T15:00:00+02:00', campus: 'PHZH', category: 'Panel' }),
    makeEvent({ id: 'a', start: '2026-04-13T09:00:00+02:00', end: '2026-04-13T10:00:00+02:00', campus: 'ZHAW', category: 'Food' }),
    makeEvent({ id: 'x', start: '2026-04-14T09:00:00+02:00', end: '2026-04-14T10:00:00+02:00', campus: 'PHZH', category: 'Panel' }),
    makeEvent({ id: 'c', start: '2026-04-13T11:00:00+02:00', end: '2026-04-13T12:00:00+02:00', campus: 'PHZH', category: 'Food', status: 'cancelled' }),
  ]

  it('limits to the selected day, ordered by start, keeping cancelled events', () => {
    expect(ids(filterEvents(events, '2026-04-13', EMPTY_FILTERS))).toEqual(['a', 'c', 'b'])
  })

  it('orders simultaneous starts by title', () => {
    const same = { start: '2026-04-13T12:00:00+02:00', end: '2026-04-13T13:00:00+02:00' }
    const list = [makeEvent({ ...same, id: 'z', title: 'Zwiebeln' }), makeEvent({ ...same, id: 'a', title: 'apple' })]
    expect(ids(filterEvents(list, '2026-04-13', EMPTY_FILTERS))).toEqual(['a', 'z'])
  })

  it('ORs within a group and ANDs across groups', () => {
    expect(ids(filterEvents(events, '2026-04-13', { ...EMPTY_FILTERS, campuses: ['PHZH', 'ZHAW'] }))).toEqual(['a', 'c', 'b'])
    expect(ids(filterEvents(events, '2026-04-13', { ...EMPTY_FILTERS, campuses: ['PHZH'], categories: ['Food'] }))).toEqual(['c'])
    expect(ids(filterEvents(events, '2026-04-13', { ...EMPTY_FILTERS, campuses: ['ZHdK'] }))).toEqual([])
  })
})
