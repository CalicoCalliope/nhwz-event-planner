import { useSearchParams } from 'react-router'
import { AppliedFilters } from '@/components/applied-filters'
import { Brand } from '@/components/brand'
import { DaySelector } from '@/components/day-selector'
import { EventCard } from '@/components/event-card'
import { FilterPanel } from '@/components/filter-panel'
import { getAllEvents, getEdition } from '@/services/events'
import { formatDayLabel, formatDayRange } from '@/utils/dates'
import { EMPTY_FILTERS, filterEvents, hasActiveFilters, type Filters } from '@/utils/filter-events'
import { readFilters, writeFilters } from '@/utils/filter-params'
import { pluralize } from '@/utils/labels'
import { usePageScroll } from '@/utils/scroll-memory'

export function ProgrammePage() {
  const edition = getEdition()
  const [searchParams, setSearchParams] = useSearchParams()

  // Day and applied filters live in the URL so Back from details restores them.
  const requestedDay = searchParams.get('day')
  const selectedDay = requestedDay && edition.days.includes(requestedDay) ? requestedDay : edition.days[0]
  const filters = readFilters(searchParams)
  const filtered = hasActiveFilters(filters)

  const allEvents = getAllEvents()
  const events = filterEvents(allEvents, selectedDay, filters)
  const dayIsEmpty = filterEvents(allEvents, selectedDay, EMPTY_FILTERS).length === 0
  const counts = Object.fromEntries(edition.days.map((day) => [day, filterEvents(allEvents, day, filters).length]))

  usePageScroll()

  const update = (change: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((params) => change(new URLSearchParams(params)), { replace: true, preventScrollReset: true })
  }

  const selectDay = (day: string) =>
    update((params) => {
      params.set('day', day)
      return params
    })
  const applyFilters = (next: Filters) => update((params) => writeFilters(params, next))
  const removeFilter = (group: keyof Filters, value: string) =>
    applyFilters({ ...filters, [group]: (filters[group] as string[]).filter((v) => v !== value) })
  const clearFilters = () => applyFilters(EMPTY_FILTERS)

  const days = edition.days

  const intro = (
    <>
      <Brand className="self-start md:hidden" />
      <div className="text-sm leading-5 font-medium text-muted-foreground">
        <p>{edition.name}</p>
        {days.length > 0 && <p>{formatDayRange(days[0], days[days.length - 1])}</p>}
        {edition.notice && <p className="mt-1 font-normal">{edition.notice}</p>}
      </div>
      <h1 className="text-4xl leading-10 font-bold text-primary">
        Your week, <br className="md:hidden lg:inline" />
        your way.
      </h1>
    </>
  )

  if (days.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        {intro}
        <p>The programme has not been published yet.</p>
      </div>
    )
  }

  return (
    // Mobile and tablet: one column. Desktop: sticky sidebar (intro, days, filters) beside the results.
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-x-14">
      <aside className="flex flex-col gap-5 lg:sticky lg:top-[112px]">
        {intro}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6 lg:flex-col lg:gap-3 lg:pt-2">
          <DaySelector days={days} selectedDay={selectedDay} onSelect={selectDay} counts={counts} />
          <FilterPanel applied={filters} onApply={applyFilters} />
        </div>
        <AppliedFilters filters={filters} onRemove={removeFilter} onClearAll={clearFilters} />
      </aside>

      <section aria-labelledby="results-heading" className="flex flex-col gap-5">
        <h2
          id="results-heading"
          aria-live="polite"
          className="leading-[22px] font-semibold lg:border-b lg:pb-4 lg:text-2xl lg:leading-8 lg:font-bold"
        >
          {pluralize(events.length, 'event')} · {formatDayLabel(selectedDay).medium}
        </h2>

        {events.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {dayIsEmpty && <p className="leading-[22px] text-muted-foreground">No events listed for this day. Try another day.</p>}
            {filtered && (
              <div className="flex max-w-[342px] flex-col gap-3 rounded-card bg-secondary p-6 lg:max-w-md">
                <p className="text-[1.375rem] leading-7 font-bold text-primary">No matches</p>
                <p className="leading-[23px] text-muted-foreground">Choose another day or adjust your filters.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
