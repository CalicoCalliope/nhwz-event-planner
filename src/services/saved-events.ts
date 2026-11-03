/**
 * Saved events (PRD FR05). IDs persist in this browser's localStorage under
 * STORAGE_KEY. If storage is unavailable, saves are kept in memory for the
 * current session and `persistent` turns false so the UI can say so.
 */
import { useSyncExternalStore } from 'react'
import { getEventById } from '@/services/events'

export const STORAGE_KEY = 'nhwz.saved.v1'

export interface SavedState {
  ids: ReadonlySet<string>
  /** False once reading or writing localStorage has failed. */
  persistent: boolean
}

/** Saved IDs from a stored value; malformed data and unknown event IDs are ignored. */
export function parseSavedIds(raw: string | null): string[] {
  if (!raw) return []
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(value)) return []
  const ids = value.filter((id): id is string => typeof id === 'string' && getEventById(id) !== undefined)
  return [...new Set(ids)]
}

let state: SavedState = { ids: new Set(), persistent: true }
const listeners = new Set<() => void>()

function setState(next: SavedState) {
  state = next
  listeners.forEach((listener) => listener())
}

/** Re-reads localStorage. Also used by tests to reset between cases. */
export function loadSavedEvents(): void {
  try {
    setState({ ids: new Set(parseSavedIds(window.localStorage.getItem(STORAGE_KEY))), persistent: true })
  } catch {
    // Storage blocked: keep whatever this session has saved so far.
    setState({ ...state, persistent: false })
  }
}

function write(ids: Set<string>) {
  let persistent = true
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    persistent = false
  }
  setState({ ids, persistent })
}

export function saveEvent(id: string): void {
  if (!state.ids.has(id)) write(new Set(state.ids).add(id))
}

export function removeEvent(id: string): void {
  if (!state.ids.has(id)) return
  const ids = new Set(state.ids)
  ids.delete(id)
  write(ids)
}

// Another tab changed saves (key is null when that tab cleared all storage).
function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) loadSavedEvents()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

loadSavedEvents()

export function useSavedEvents(): SavedState {
  return useSyncExternalStore(subscribe, () => state)
}
