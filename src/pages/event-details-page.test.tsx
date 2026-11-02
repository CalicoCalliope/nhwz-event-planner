import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

beforeAll(() => {
  window.scrollTo = () => {}
})

describe('Event details', () => {
  it('shows the event information and the supplied Google Maps link', () => {
    renderApp('/events/e01')
    expect(screen.getByRole('heading', { level: 1, name: 'Computer Maintenance and Repair' })).toBeInTheDocument()
    expect(screen.getByText('13 April 2026')).toBeInTheDocument()
    expect(screen.getByText('10:00–12:00')).toBeInTheDocument()
    expect(screen.getByText('Campus: UZH Irchel')).toBeInTheDocument()
    expect(screen.getByText('Winterthurerstrasse 190, 8057 Zürich')).toBeInTheDocument()
    const maps = screen.getByRole('link', { name: /open in google maps/i })
    expect(maps).toHaveAttribute('href', 'https://maps.app.goo.gl/SLHPurSCCuQNmcSB9')
    expect(maps).toHaveAttribute('target', '_blank')
    expect(maps).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('No registration needed')).toBeInTheDocument()
  })

  it('explains that directions are unavailable for an unconfirmed venue', () => {
    renderApp('/events/e07')
    expect(screen.queryByRole('link', { name: /google maps/i })).toBeNull()
    expect(screen.getByText('Venue/address to be confirmed')).toBeInTheDocument()
    expect(screen.getByText('Google Maps link unavailable until the venue is confirmed.')).toBeInTheDocument()
  })

  it('shows cancellation and no active registration action', () => {
    renderApp('/events/e04')
    expect(screen.getByText('This event is no longer taking place.')).toBeInTheDocument()
    expect(screen.getByText('Registration unavailable — event cancelled')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /register/i })).toBeNull()
  })

  it('links to external registration in a new tab', () => {
    renderApp('/events/e05')
    expect(screen.getByText('Registration required')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /register externally/i })
    expect(link).toHaveAttribute('href', expect.stringMatching(/^https:\/\/docs\.google\.com\/forms\//))
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('labels demonstration content', () => {
    renderApp('/events/e01')
    expect(screen.getByText(/demonstration description/i)).toBeInTheDocument()
  })

  it('shows not found for an unknown event', () => {
    renderApp('/events/nope')
    expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument()
  })

  it('Back returns to the Programme with the same day and filters', async () => {
    const { url } = renderApp('/?day=2026-04-13&category=Tour')
    await userEvent.click(screen.getByRole('link', { name: 'Walking Tour on ETH Zentrum Campus' }))
    expect(url()).toBe('/events/e04')
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(url()).toBe('/?day=2026-04-13&category=Tour')
    expect(screen.getByRole('button', { name: 'Remove filter: Tour' })).toBeInTheDocument()
  })

  it('Back from a directly opened event goes to the Programme', async () => {
    const { url } = renderApp('/events/e01')
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(url()).toBe('/')
  })
})
