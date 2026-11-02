import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Remembers list scroll positions per history entry, so Back from event
 * details returns to the same place in the Programme.
 */
const positions = new Map<string, number>()

export function rememberScroll(historyKey: string): void {
  positions.set(historyKey, window.scrollY)
}

/** Returns and forgets the remembered position for a history entry. */
export function takeScroll(historyKey: string): number | undefined {
  const y = positions.get(historyKey)
  positions.delete(historyKey)
  return y
}

/**
 * On page mount, restores the remembered position for this history entry or
 * starts at the top. Runs once, so in-page URL updates (day, filters) keep scroll.
 */
export function usePageScroll(): void {
  const { key } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, takeScroll(key) ?? 0)
    // Mount only: later key changes come from in-page URL updates.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
