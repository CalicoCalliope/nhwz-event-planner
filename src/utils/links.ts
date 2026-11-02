import type { ProgrammeEvent } from '@/types/event'

/** True only for valid absolute http(s) URLs. */
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isGoogleMapsUrl(value: string): boolean {
  const { hostname, pathname } = new URL(value)
  const host = hostname.toLowerCase()
  if (host === 'maps.app.goo.gl') return true
  if (host === 'goo.gl') return pathname.startsWith('/maps')
  if (/^maps\.google\.[a-z.]+$/.test(host)) return true
  return /^(www\.)?google\.[a-z.]+$/.test(host) && pathname.startsWith('/maps')
}

/**
 * The single "Open in Google Maps" destination for an event, or null when the
 * location is missing or disputed. Never guesses a destination.
 */
export function getGoogleMapsUrl(event: ProgrammeEvent): string | null {
  if (!event.locationConfirmed) return null
  if (isHttpUrl(event.mapUrl) && isGoogleMapsUrl(event.mapUrl)) return event.mapUrl

  // Other providers or no URL: search Google Maps for the confirmed place.
  const query = [event.venue, event.address].filter(Boolean).join(', ').trim()
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export type RegistrationState =
  | { kind: 'unavailable' }
  | { kind: 'not-required' }
  | { kind: 'external'; url: string }
  | { kind: 'contact-organiser' }

export function getRegistrationState(event: ProgrammeEvent): RegistrationState {
  if (event.status === 'cancelled') return { kind: 'unavailable' }
  if (!event.registration.required) return { kind: 'not-required' }
  if (isHttpUrl(event.registration.url)) return { kind: 'external', url: event.registration.url }
  return { kind: 'contact-organiser' }
}
