import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Brand } from '@/components/brand';
import { EventCard } from '@/components/event-card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEventById } from '@/services/events';
import { useSavedEvents } from '@/services/saved-events';
import type { ProgrammeEvent } from '@/types/event';
import { formatDayLabel, zurichDayKey } from '@/utils/dates';
import { sortByStart } from '@/utils/filter-events';
import { pluralize } from '@/utils/labels';
import { usePageScroll } from '@/utils/scroll-memory';

/** Saved events grouped by Zurich day, days in date order, events by start time (PRD FR05). */
function groupByDay(
  events: ProgrammeEvent[],
): [day: string, events: ProgrammeEvent[]][] {
  const groups = new Map<string, ProgrammeEvent[]>();
  for (const event of sortByStart(events)) {
    const day = zurichDayKey(event.start);
    groups.set(day, [...(groups.get(day) ?? []), event]);
  }
  return [...groups];
}

export function MyWeekPage() {
  const { ids } = useSavedEvents();
  usePageScroll();

  const saved = [...ids]
    .map(getEventById)
    .filter((e): e is ProgrammeEvent => e !== undefined);
  const days = groupByDay(saved);

  // Removing an event removes the focused button with its card. Move focus to the
  // saved count (or the empty state) so keyboard users keep their place.
  const summaryRef = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const previousCount = useRef(saved.length);
  useEffect(() => {
    const focusLost = !document.activeElement || document.activeElement === document.body;
    if (saved.length < previousCount.current && focusLost) summaryRef.current?.focus();
    previousCount.current = saved.length;
  }, [saved.length]);

  return (
    // Mobile and tablet: one column. Desktop: sticky intro beside the saved events, as on the Programme.
    <div className='flex flex-col gap-5 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-x-14'>
      <aside className='flex flex-col gap-5 lg:sticky lg:top-[112px]'>
        <Brand className='self-start md:hidden' />
        <h1 className='text-4xl leading-10 font-bold text-primary'>
          A week to <br className='md:hidden lg:inline' />
          look forward to.
        </h1>
        <p className='leading-[23px] text-muted-foreground'>
          <span className='font-semibold text-foreground'>
            Saved on this device.
          </span>
        </p>
      </aside>

      {saved.length === 0 ? (
        <div className='flex max-w-[342px] flex-col gap-3 rounded-card bg-secondary p-6 lg:max-w-md'>
          <h2
            ref={summaryRef}
            tabIndex={-1}
            className='rounded-sm text-[1.375rem] leading-7 font-bold text-primary outline-none focus-visible:outline-2 focus-visible:outline-ring'
          >
            No saved events yet
          </h2>
          <p className='leading-[23px] text-muted-foreground'>
            Save events from the programme to plan your week.
          </p>
          <Link to='/' className={cn(buttonVariants(), 'mt-2 w-full')}>
            Browse programme
          </Link>
        </div>
      ) : (
        <div className='flex flex-col gap-8'>
          <p
            ref={summaryRef}
            tabIndex={-1}
            className='leading-[22px] font-semibold outline-none focus-visible:outline-2 focus-visible:outline-ring lg:border-b lg:pb-4 lg:text-2xl lg:leading-8 lg:font-bold'
          >
            {pluralize(saved.length, 'saved event')}
          </p>
          {days.map(([day, events]) => (
            <section
              key={day}
              aria-labelledby={`day-${day}`}
              className='flex flex-col gap-4'
            >
              <h2
                id={`day-${day}`}
                className='text-xl leading-[27px] font-semibold'
              >
                {formatDayLabel(day).medium}
                <span className='font-normal text-muted-foreground'>
                  {' '}
                  · {pluralize(events.length, 'event')}
                </span>
              </h2>
              <ul className='grid gap-5 md:grid-cols-2'>
                {events.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
