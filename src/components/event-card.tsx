import { Link, useLocation } from 'react-router'
import { CancelledPill, CategoryPill } from '@/components/event-badges'
import type { ProgrammeEvent } from '@/types/event'
import { formatTimeRange } from '@/utils/dates'
import { formatLanguages } from '@/utils/labels'
import { rememberScroll } from '@/utils/scroll-memory'

interface EventCardProps {
  event: ProgrammeEvent
}

export function EventCard({ event }: EventCardProps) {
  const location = useLocation()
  return (
    <article className="relative flex h-full flex-col gap-2.5 rounded-card border bg-card p-4 transition duration-200 hover:shadow-md md:p-5 md:hover:-translate-y-0.5 md:hover:border-primary/30 md:hover:shadow-[0_12px_32px_-12px_rgb(0_107_60/0.25)] has-[a[data-card-link]:focus-visible]:outline-2 has-[a[data-card-link]:focus-visible]:outline-offset-2 has-[a[data-card-link]:focus-visible]:outline-ring">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:justify-between">
        <p className="w-[170px] max-w-full leading-[22px] font-bold text-primary tabular-nums md:w-auto">
          {formatTimeRange(event.start, event.end)}
        </p>
        {event.status === 'cancelled' && <CancelledPill />}
      </div>

      <h3 className="text-xl leading-[26px] font-semibold wrap-break-word">
        {/* The pseudo-element stretches the link over the whole card. */}
        <Link
          to={`/events/${encodeURIComponent(event.id)}`}
          state={{ fromList: true }}
          onClick={() => rememberScroll(location.key)}
          data-card-link
          className="outline-none after:absolute after:inset-0 after:rounded-card after:content-['']"
        >
          {event.title}
        </Link>
      </h3>

      <p className="text-sm leading-5 text-muted-foreground wrap-break-word">{event.venue}</p>

      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill category={event.category} />
        <span className="text-sm text-muted-foreground">{formatLanguages(event.languages)}</span>
      </div>
    </article>
  )
}
