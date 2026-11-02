import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import { renderApp } from '@/test/render-app'

// Runs on the historical acceptance dataset (client README, "Historical acceptance dataset").
// Test names cite the client's acceptance IDs (AC01…) where one applies.

beforeAll(() => {
  window.scrollTo = () => {}
})

// Card titles only (the open filter panel also has level-3 headings).
const cardTitles = () => [...document.querySelectorAll('article h3')].map((h) => h.textContent)
const day = (name: string) => screen.getByRole('button', { name })
const resultsHeading = () => screen.getByRole('heading', { level: 2 }).textContent
const chip = (label: string) => screen.queryByRole('button', { name: `Remove filter: ${label}` })

const E01 = 'Computer Maintenance and Repair'
const E02 = 'Foodsave Lunch'
const E03 = 'Making the Switch to Linux'
const E04 = 'Walking Tour on ETH Zentrum Campus'
const E05 = 'Sustainable PubQuiz'
const MONDAY = [E01, E02, E03, E04, E05]

async function openFilters() {
  await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
  return screen.getByRole('dialog')
}

describe('Programme', () => {
  it('offers only Programme and My Week as main navigation', () => {
    renderApp()
    for (const nav of screen.getAllByRole('navigation', { name: 'Main' })) {
      expect(within(nav).getAllByRole('link').map((l) => l.textContent)).toEqual(['Programme', 'My Week'])
    }
  })

  it('has no search field or Now & Next (removed by the PRD)', () => {
    renderApp()
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.queryByText(/now & next/i)).toBeNull()
  })

  it('initially selects the first day and lists events by start time, keeping cancelled e04', () => {
    renderApp()
    expect(day('Monday, 13 April 2026')).toHaveAttribute('aria-pressed', 'true')
    expect(resultsHeading()).toBe('5 events · Monday 13 April')
    expect(cardTitles()).toEqual(MONDAY)
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })

  it('shows the empty-day message on Thursday (no fixture events)', async () => {
    renderApp()
    await userEvent.click(day('Thursday, 16 April 2026'))
    expect(resultsHeading()).toBe('0 events · Thursday 16 April')
    expect(screen.getByText('No events listed for this day. Try another day.')).toBeInTheDocument()
    expect(screen.queryByText('No matches')).toBeNull()
  })

  it('falls back to the first day for an unknown day in the URL', () => {
    renderApp('/?day=2030-01-01')
    expect(day('Monday, 13 April 2026')).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Filters', () => {
  it.each([
    ['unfiltered', '/', MONDAY],
    ['English', '/?language=en', [E01, E02, E03, E05]],
    ['German', '/?language=de', [E04]],
    ['English + German', '/?language=en&language=de', MONDAY],
  ])('AC01: Monday %s', (_, url, expected) => {
    renderApp(url)
    expect(cardTitles()).toEqual(expected)
  })

  it.each([
    ['ETH Zentrum + English', '/?campus=ETH+Zentrum&language=en', [E05]],
    ['UZH Irchel + Workshop + English', '/?campus=UZH+Irchel&category=Workshop&language=en', [E01, E03]],
  ])('AC02: %s', (_, url, expected) => {
    renderApp(url)
    expect(cardTitles()).toEqual(expected)
  })

  it('AC05: keeps changes as a draft until Show results', async () => {
    const { url } = renderApp()
    const panel = await openFilters()
    await userEvent.click(within(panel).getByRole('button', { name: 'Tour' }))
    expect(within(panel).getByRole('button', { name: 'Tour' })).toHaveAttribute('aria-pressed', 'true')
    expect(cardTitles()).toEqual(MONDAY)

    await userEvent.click(within(panel).getByRole('button', { name: 'Show results' }))
    expect(cardTitles()).toEqual([E04])
    expect(chip('Tour')).toBeInTheDocument()
    expect(url()).toContain('category=Tour')
  })

  it.each([
    ['Close', async () => userEvent.click(screen.getByRole('button', { name: /close filters/i }))],
    ['Escape', async () => userEvent.keyboard('{Escape}')],
  ])('AC05: discards unapplied edits on %s', async (_, dismiss) => {
    renderApp()
    const panel = await openFilters()
    await userEvent.click(within(panel).getByRole('button', { name: 'Food' }))
    await dismiss()
    expect(cardTitles()).toEqual(MONDAY)
    expect(chip('Food')).toBeNull()

    const reopened = await openFilters()
    expect(within(reopened).getByRole('button', { name: 'Food' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Clear filters inside the panel resets only the draft', async () => {
    renderApp('/?category=Workshop')
    const panel = await openFilters()
    await userEvent.click(within(panel).getByRole('button', { name: 'Clear filters' }))
    expect(within(panel).getByRole('button', { name: 'Workshop' })).toHaveAttribute('aria-pressed', 'false')
    expect(cardTitles()).toEqual([E01, E03])

    await userEvent.click(within(panel).getByRole('button', { name: 'Show results' }))
    expect(cardTitles()).toEqual(MONDAY)
  })

  it('removing a chip clears only that value; changing day keeps filters', async () => {
    const { url } = renderApp('/?campus=UZH+Irchel&language=en')
    expect(cardTitles()).toEqual([E01, E02, E03])

    await userEvent.click(day('Tuesday, 14 April 2026'))
    expect(cardTitles()).toEqual(['From Waste Plastic to 3D Printing'])
    expect(url()).toContain('campus=UZH Irchel')

    await userEvent.click(chip('UZH Irchel')!)
    expect(url()).not.toContain('campus=')
    expect(url()).toContain('language=en')
    expect(url()).toContain('day=2026-04-14')
  })

  it('shows the empty-day message and No matches together on an empty filtered day', () => {
    renderApp('/?day=2026-04-16&campus=UZH+Irchel')
    expect(screen.getByText('No events listed for this day. Try another day.')).toBeInTheDocument()
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('shows No matches; Clear all filters acts immediately and keeps the selected day', async () => {
    const { url } = renderApp('/?day=2026-04-17&campus=PHZH')
    expect(screen.getByText('No matches')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(cardTitles()).toEqual(['Gender, Sustainability & Climate Change'])
    expect(url()).toBe('/?day=2026-04-17')
  })
})
