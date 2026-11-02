import { describe, expect, it } from 'vitest'
import fullTranscription from '../../docs/reference/programme-2026-transcription.json'
import rawData from '../../data/events.json'
import { makeEvent } from '@/test/factories'
import { validateEvent, validateEventData } from './validate-events'

const edition = { name: 'Test', days: ['2026-04-13'], timeZone: 'Europe/Zurich', notice: null }

describe('validateEvent', () => {
  it('accepts a complete record', () => expect(validateEvent(makeEvent())).toEqual([]))

  it('rejects end before or equal to start', () => {
    expect(validateEvent(makeEvent({ end: '2026-04-13T12:00:00+02:00' }))).toContain('end: must be after start')
  })

  it('rejects timestamps without an explicit offset', () => {
    expect(validateEvent(makeEvent({ start: '2026-04-13T12:00:00' })).join()).toMatch(/^start:/)
  })

  it('rejects unknown campus, category and language values', () => {
    const errors = validateEvent({ ...makeEvent(), campus: 'Mars', category: 'Party', languages: ['fr'] }).join('\n')
    expect(errors).toMatch(/campus/)
    expect(errors).toMatch(/category/)
    expect(errors).toMatch(/languages/)
  })

  it('rejects non-http map links', () => {
    expect(validateEvent(makeEvent({ mapUrl: 'javascript:alert(1)' })).join()).toMatch(/mapUrl/)
  })
})

describe('validateEventData', () => {
  it('excludes invalid and duplicate records but keeps valid ones', () => {
    const result = validateEventData({
      edition,
      events: [makeEvent({ id: 'ok' }), makeEvent({ id: 'ok' }), { id: 'broken' }],
    })
    expect(result.data.events.map((e) => e.id)).toEqual(['ok'])
    expect(result.errors.some((e) => e.includes('duplicate'))).toBe(true)
    expect(result.errors.some((e) => e.startsWith('event "broken"'))).toBe(true)
  })

  it('warns, without excluding, for an invalid registration URL', () => {
    const result = validateEventData({ edition, events: [makeEvent({ registration: { required: true, url: 'nope' } })] })
    expect(result.data.events).toHaveLength(1)
    expect(result.warnings[0]).toMatch(/registration.url/)
  })

  it('handles completely malformed input safely', () => {
    expect(validateEventData(null).data.events).toEqual([])
    expect(validateEventData('x').errors.length).toBeGreaterThan(0)
  })

  it('the full programme transcription (docs/reference) is valid and ready to switch in', () => {
    const result = validateEventData(fullTranscription)
    expect(result.errors).toEqual([])
    expect(result.data.events).toHaveLength(49)
  })

  it('the shipped events.json is valid', () => {
    const result = validateEventData(rawData)
    expect(result.errors).toEqual([])
    expect(result.data.events.length).toBe(rawData.events.length)
  })
})
