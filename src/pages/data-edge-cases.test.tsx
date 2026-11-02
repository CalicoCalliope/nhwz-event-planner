import { screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { makeEvent } from '@/test/factories'
import { renderApp } from '@/test/render-app'

// States the acceptance dataset does not contain (e.g. records from the full programme transcription).
vi.mock('@/services/events', () => {
  const events = [
    makeEvent({ id: 'no-description', title: 'Event without description', description: null, locationConfirmed: false, address: null }),
    makeEvent({ id: 'invalid-registration', title: 'Invalid registration link', registration: { required: true, url: 'not-a-url' } }),
    makeEvent({ id: 'other-map', title: 'Other map provider', mapUrl: 'https://www.openstreetmap.org/node/1' }),
  ]
  return {
    getEdition: () => ({ name: 'Test week', days: ['2026-04-13', '2026-04-14'], timeZone: 'Europe/Zurich', notice: null }),
    getAllEvents: () => events,
    getEventById: (id: string) => events.find((e) => e.id === id),
  }
})

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('Data edge cases', () => {
  it('says when no description has been published, without a demonstration label or guessed directions', () => {
    renderApp('/events/no-description')
    expect(screen.getByText('A description has not been published for this event yet.')).toBeInTheDocument()
    expect(screen.queryByText(/demonstration description/i)).toBeNull()
    expect(screen.queryByRole('link', { name: /google maps/i })).toBeNull()
  })

  it('asks to contact the organiser when the registration link is invalid', () => {
    renderApp('/events/invalid-registration')
    expect(screen.getByText('Contact the organiser to register.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /register/i })).toBeNull()
  })

  it('replaces another map provider with a Google Maps search', () => {
    renderApp('/events/other-map')
    expect(screen.getByRole('link', { name: /open in google maps/i }).getAttribute('href')).toMatch(/google\.com\/maps\/search/)
  })

  it('shows the empty-day message without No matches when no filters apply', () => {
    renderApp('/?day=2026-04-14')
    expect(screen.getByText('No events listed for this day. Try another day.')).toBeInTheDocument()
    expect(screen.queryByText('No matches')).toBeNull()
  })
})
