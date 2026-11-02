import type { EventLanguage } from '@/types/event'

const LANGUAGE_NAMES: Record<EventLanguage, string> = { en: 'English', de: 'German' }

/** e.g. "English", "German", or "German & English" for bilingual events. */
export function formatLanguages(languages: EventLanguage[]): string {
  return [...languages]
    .sort((a, b) => (a === 'de' ? -1 : b === 'de' ? 1 : 0))
    .map((l) => LANGUAGE_NAMES[l])
    .join(' & ')
}

export function languageName(language: EventLanguage): string {
  return LANGUAGE_NAMES[language]
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
