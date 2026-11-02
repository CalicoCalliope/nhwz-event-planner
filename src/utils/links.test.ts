import { describe, expect, it } from 'vitest'
import { makeEvent } from '@/test/factories'
import { getGoogleMapsUrl, getRegistrationState, isHttpUrl } from './links'

describe('isHttpUrl', () => {
  it('accepts absolute http(s) only', () => {
    expect(isHttpUrl('https://example.org/a')).toBe(true)
    expect(isHttpUrl('http://example.org')).toBe(true)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpUrl('mailto:a@b.ch')).toBe(false)
    expect(isHttpUrl('/relative')).toBe(false)
    expect(isHttpUrl('not a url')).toBe(false)
    expect(isHttpUrl(null)).toBe(false)
  })
})

describe('getGoogleMapsUrl', () => {
  it('preserves a supplied Google Maps URL', () => {
    for (const url of [
      'https://www.google.com/maps/place/ETH',
      'https://maps.google.ch/?q=ETH',
      'https://maps.app.goo.gl/abc123',
      'https://www.google.ch/maps/search/?api=1&query=ETH',
    ]) {
      expect(getGoogleMapsUrl(makeEvent({ mapUrl: url }))).toBe(url)
    }
  })

  it('replaces another provider with a Google Maps search for the confirmed place', () => {
    const url = getGoogleMapsUrl(makeEvent({ mapUrl: 'https://www.openstreetmap.org/node/1' }))
    expect(url).toBe(
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Main Building, Rämistrasse 101, 8092 Zürich'),
    )
  })

  it('does not treat other google.com pages as maps', () => {
    expect(getGoogleMapsUrl(makeEvent({ mapUrl: 'https://www.google.com/search?q=x' }))).toContain('/maps/search/')
  })

  it('never offers directions for unconfirmed locations', () => {
    expect(getGoogleMapsUrl(makeEvent({ locationConfirmed: false, mapUrl: 'https://maps.app.goo.gl/x' }))).toBeNull()
  })
})

describe('getRegistrationState', () => {
  it('covers every registration state', () => {
    expect(getRegistrationState(makeEvent())).toEqual({ kind: 'not-required' })
    expect(getRegistrationState(makeEvent({ registration: { required: true, url: 'https://example.org' } }))).toEqual({
      kind: 'external',
      url: 'https://example.org',
    })
    expect(getRegistrationState(makeEvent({ registration: { required: true, url: null } }))).toEqual({ kind: 'contact-organiser' })
    expect(getRegistrationState(makeEvent({ registration: { required: true, url: 'ftp://x' } }))).toEqual({
      kind: 'contact-organiser',
    })
    expect(
      getRegistrationState(makeEvent({ status: 'cancelled', registration: { required: true, url: 'https://example.org' } })),
    ).toEqual({ kind: 'unavailable' })
  })
})
