import type { ProgrammeEvent } from '@/types/event'

export function makeEvent(overrides: Partial<ProgrammeEvent> = {}): ProgrammeEvent {
  return {
    id: 'test-event',
    title: 'Test event',
    description: 'Test description',
    start: '2026-04-13T12:00:00+02:00',
    end: '2026-04-13T13:00:00+02:00',
    campus: 'ETH Zentrum',
    venue: 'Main Building',
    address: 'Rämistrasse 101, 8092 Zürich',
    locationConfirmed: true,
    mapUrl: null,
    category: 'Workshop',
    languages: ['en'],
    registration: { required: false, url: null },
    status: 'scheduled',
    ...overrides,
  }
}
