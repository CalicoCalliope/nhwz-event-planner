import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { loadSavedEvents, STORAGE_KEY } from '@/services/saved-events'
import { renderApp } from '@/test/render-app'

beforeAll(() => {
  window.scrollTo = () => {}
})

afterEach(() => vi.restoreAllMocks())

const goToMyWeek = () => userEvent.click(screen.getAllByRole('link', { name: 'My Week' })[0])
const cardTitles = (section: HTMLElement) => within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

/** Stores saves as if from an earlier visit. */
function seed(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  loadSavedEvents()
}

describe('Saving and My Week', () => {
  it('AC06: My Week starts empty with a Browse programme action', async () => {
    const { url } = renderApp('/my-week')
    expect(screen.getByRole('heading', { name: 'No saved events yet' })).toBeInTheDocument()
    expect(screen.getByText('Saved on this device.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Browse programme' }))
    expect(url()).toBe('/')
  })

  it('AC06: saving from a card updates the card and My Week without opening details', async () => {
    const { url } = renderApp('/?day=2026-04-13')
    await userEvent.click(screen.getByRole('button', { name: 'Save event: Foodsave Lunch' }))
    expect(url()).toBe('/?day=2026-04-13')
    expect(screen.getByRole('button', { name: 'Remove from My Week: Foodsave Lunch' })).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await goToMyWeek()
    expect(screen.getByText('1 saved event')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Foodsave Lunch' })).toBeInTheDocument()
  })

  it('saving from event details shows on My Week, and Back returns there (AC19)', async () => {
    const { url } = renderApp('/events/e06')
    await userEvent.click(screen.getByRole('button', { name: 'Save event' }))
    expect(screen.getByRole('button', { name: 'Remove from My Week' })).toBeInTheDocument()

    await goToMyWeek()
    await userEvent.click(screen.getByRole('link', { name: 'From Waste Plastic to 3D Printing' }))
    expect(url()).toBe('/events/e06')
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(url()).toBe('/my-week')
  })

  it('groups saved events by day and orders them by start time', () => {
    seed(['e06', 'e05', 'e01', 'e04'])
    renderApp('/my-week')
    const days = screen.getAllByRole('region')
    expect(days.map((d) => within(d).getByRole('heading', { level: 2 }).textContent)).toEqual([
      'Monday 13 April · 3 events',
      'Tuesday 14 April · 1 event',
    ])
    expect(cardTitles(days[0])).toEqual([
      'Computer Maintenance and Repair',
      'Walking Tour on ETH Zentrum Campus',
      'Sustainable PubQuiz',
    ])
  })

  it('AC11: shows a cancelled saved event with its label and lets it be removed', async () => {
    seed(['e04'])
    renderApp('/my-week')
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remove from My Week: Walking Tour on ETH Zentrum Campus' }))
    expect(screen.getByRole('heading', { name: 'No saved events yet' })).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('[]')
  })

  it('keeps keyboard focus on the page after removing an event', async () => {
    seed(['e02', 'e05'])
    renderApp('/my-week')
    screen.getByRole('button', { name: 'Remove from My Week: Foodsave Lunch' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByText('1 saved event')).toHaveFocus()

    screen.getByRole('button', { name: 'Remove from My Week: Sustainable PubQuiz' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'No saved events yet' })).toHaveFocus()
  })

  it('ignores saved IDs that are not in the programme', () => {
    seed(['e02', 'removed-event'])
    renderApp('/my-week')
    expect(screen.getByText('1 saved event')).toBeInTheDocument()
  })

  it('reflects saves made in another tab', () => {
    renderApp('/my-week')
    act(() => {
      window.localStorage.setItem(STORAGE_KEY, '["e08"]')
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    })
    expect(screen.getByRole('heading', { level: 3, name: 'Gender, Sustainability & Climate Change' })).toBeInTheDocument()
  })

  it('AC07: keeps saves for the session and shows a notice when storage fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    renderApp('/?day=2026-04-13')
    expect(screen.queryByRole('status')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Save event: Foodsave Lunch' }))
    expect(screen.getByRole('status')).toHaveTextContent(/can't be stored in this browser/)

    await goToMyWeek()
    expect(screen.getByRole('heading', { level: 3, name: 'Foodsave Lunch' })).toBeInTheDocument()
  })
})
