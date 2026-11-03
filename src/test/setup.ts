import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { loadSavedEvents } from '@/services/saved-events'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  loadSavedEvents()
})
