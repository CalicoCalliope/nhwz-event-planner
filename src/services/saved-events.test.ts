import { describe, expect, it } from 'vitest'
import { loadSavedEvents, parseSavedIds, removeEvent, saveEvent, STORAGE_KEY } from '@/services/saved-events'

const stored = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')

describe('parseSavedIds', () => {
  it('reads a stored list of known event IDs', () => {
    expect(parseSavedIds('["e02","e05"]')).toEqual(['e02', 'e05'])
  })

  it('AC07: treats missing or malformed data as no saves', () => {
    for (const raw of [null, '', 'not json', '{"e02":true}', '42', 'null']) expect(parseSavedIds(raw)).toEqual([])
  })

  it('ignores unknown IDs, non-string entries and duplicates', () => {
    expect(parseSavedIds('["e02","gone",7,null,"e02"]')).toEqual(['e02'])
  })
})

describe('saving', () => {
  it('AC07: persists saved IDs under nhwz.saved.v1', () => {
    saveEvent('e02')
    saveEvent('e05')
    removeEvent('e05')
    expect(STORAGE_KEY).toBe('nhwz.saved.v1')
    expect(stored()).toEqual(['e02'])
  })

  it('AC07: restores saves after a reload', () => {
    window.localStorage.setItem(STORAGE_KEY, '["e02"]')
    loadSavedEvents()
    saveEvent('e05')
    expect(stored()).toEqual(['e02', 'e05'])
  })
})
