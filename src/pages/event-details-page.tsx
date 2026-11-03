import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { CategoryPill } from '@/components/event-badges'
import { SaveButton } from '@/components/save-button'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NotFoundPage } from '@/pages/not-found-page'
import { getEventById } from '@/services/events'
import type { ProgrammeEvent } from '@/types/event'
import { formatEventDate, formatTimeRange, TIME_ZONE } from '@/utils/dates'
import { formatLanguages } from '@/utils/labels'
import { getGoogleMapsUrl, getRegistrationState } from '@/utils/links'
import { usePageScroll } from '@/utils/scroll-memory'

const NEW_TAB = '(opens in a new tab)'
const Arrow = () => <ArrowUpRight aria-hidden className="size-4 shrink-0" />

function InfoCard({ children, labelledBy }: { children: ReactNode; labelledBy?: string }) {
  return (
    <section aria-labelledby={labelledBy} className="flex flex-col gap-2 rounded-card bg-card p-4 wrap-break-word">
      {children}
    </section>
  )
}

function WhereToGo({ event }: { event: ProgrammeEvent }) {
  const mapsUrl = getGoogleMapsUrl(event)
  return (
    <InfoCard labelledBy="where-heading">
      <h2 id="where-heading" className="text-lg leading-6 font-semibold">
        Where to go
      </h2>
      <p className="leading-[22px] font-semibold">{event.venue}</p>
      {event.address && <p className="leading-[23px] text-muted-foreground">{event.address}</p>}
      {!event.locationConfirmed && <p className="leading-[23px] text-muted-foreground">Venue/address to be confirmed</p>}
      <p className="text-sm leading-5 text-muted-foreground">Campus: {event.campus}</p>
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open in Google Maps ${NEW_TAB}`}
          className="inline-flex min-h-11 items-center gap-1 self-start rounded-sm leading-6 font-semibold text-primary underline outline-none focus-visible:outline-2 focus-visible:outline-ring"
        >
          Google Maps
          <Arrow />
        </a>
      ) : (
        <p className="text-sm leading-5 text-muted-foreground">Google Maps link unavailable until the venue is confirmed.</p>
      )}
    </InfoCard>
  )
}

function Registration({ event }: { event: ProgrammeEvent }) {
  const state = getRegistrationState(event)
  switch (state.kind) {
    case 'unavailable':
      return <p className="leading-[22px] font-semibold text-cancelled-foreground">Registration unavailable — event cancelled</p>
    case 'not-required':
      return <p className="leading-[22px] font-semibold">No registration needed</p>
    case 'external':
      return (
        <>
          <p className="leading-[22px] font-semibold">Registration required</p>
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Register externally ${NEW_TAB}`}
            className={cn(buttonVariants(), 'w-full md:w-[342px]')}
          >
            Register externally
            <Arrow />
          </a>
        </>
      )
    case 'contact-organiser':
      return (
        <>
          <p className="leading-[22px] font-semibold">Registration required</p>
          <p className="leading-[22px]">Contact the organiser to register.</p>
        </>
      )
  }
}

export function EventDetailsPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  usePageScroll()

  const event = getEventById(id)
  if (!event) return <NotFoundPage message="This event could not be found. It may have been removed from the programme." />

  // Back returns to the originating list entry (keeping day, filters and scroll); direct visits go to the Programme.
  const goBack = () => (location.state?.fromList ? navigate(-1) : navigate('/'))
  const flags = event.dataFlags

  return (
    // Mobile: one column. Desktop: story on the left, practical details in a sticky panel on the right.
    <article className="mx-auto flex max-w-[712px] flex-col gap-5 lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-x-14">
      <div className="flex flex-col items-start gap-5 lg:col-start-1">
        <Button variant="outline" className="w-full md:w-auto md:px-5" onClick={goBack}>
          <ArrowLeft aria-hidden />
          Back
        </Button>

        <CategoryPill category={event.category} />

        {event.status === 'cancelled' && (
          <div className="flex w-full flex-col gap-2 rounded-control bg-cancelled p-4 text-cancelled-foreground">
            <p className="text-xl leading-[26px] font-bold">Cancelled</p>
            <p className="leading-[22px]">This event is no longer taking place.</p>
          </div>
        )}

        <h1 className="w-full text-3xl leading-9 font-bold text-primary wrap-break-word lg:text-[2.5rem] lg:leading-[1.15]">
          {event.title}
        </h1>

        <SaveButton event={event} className="w-full md:w-auto md:px-5" />
      </div>

      <div className="flex w-full flex-col gap-5 lg:sticky lg:top-[112px] lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <InfoCard>
          <p className="text-lg leading-6 font-semibold">{formatEventDate(event.start)}</p>
          <p className="leading-[22px]">
            <span className="tabular-nums">{formatTimeRange(event.start, event.end)}</span> · {TIME_ZONE}
          </p>
          <p className="leading-[22px] text-muted-foreground">{formatLanguages(event.languages)}</p>
        </InfoCard>

        <WhereToGo event={event} />
      </div>

      <section aria-labelledby="about-heading" className="flex w-full flex-col gap-5 lg:col-start-1 lg:border-t lg:pt-8">
        <h2 id="about-heading" className="text-xl leading-[27px] font-semibold">
          About this event
        </h2>
        <p className="leading-6 text-muted-foreground">
          {event.description ?? 'A description has not been published for this event yet.'}
        </p>
        {event.description && (flags?.demoDescription || flags?.testVariant) && (
          <p className="-mt-3 text-sm text-muted-foreground italic">
            {flags.testVariant ? `Test-only data: ${flags.testVariant}` : 'Demonstration description, not approved event text.'}
          </p>
        )}
      </section>

      <div className="flex w-full flex-col items-start gap-5 lg:col-start-1">
        <Registration event={event} />
      </div>
    </article>
  )
}
