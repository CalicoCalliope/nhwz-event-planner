import { cn } from '@/lib/utils'
import { formatDayLabel } from '@/utils/dates'
import { pluralize } from '@/utils/labels'

interface DaySelectorProps {
  days: string[]
  selectedDay: string
  onSelect: (day: string) => void
  /** Matching events per day, shown in the desktop list. */
  counts: Record<string, number>
}

/** Day tiles on mobile and tablet; a vertical list with event counts on desktop. */
export function DaySelector({ days, selectedDay, onSelect, counts }: DaySelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select day"
      className="grid w-full max-w-[342px] shrink-0 gap-2 lg:flex lg:max-w-none lg:flex-col"
      style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 62px))` }}
    >
      {days.map((day) => {
        const label = formatDayLabel(day)
        const selected = day === selectedDay
        return (
          <button
            key={day}
            type="button"
            aria-pressed={selected}
            aria-label={label.long}
            onClick={() => onSelect(day)}
            className={cn(
              'group flex h-[62px] flex-col items-center justify-center gap-0.5 rounded-control border text-center transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              'lg:h-auto lg:flex-row lg:justify-between lg:gap-3 lg:px-4 lg:py-3 lg:text-left',
              selected ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-foreground hover:border-primary/60',
            )}
          >
            {/* Tile */}
            <span className={cn('text-sm leading-[18px] font-medium lg:hidden', !selected && 'text-muted-foreground')}>
              {label.weekday}
            </span>
            <span className="text-xl leading-[25px] font-bold lg:hidden">{label.day}</span>

            {/* Desktop list row */}
            <span className="hidden flex-col lg:flex">
              <span className="leading-[22px] font-semibold">{label.weekdayLong}</span>
              <span className={cn('text-sm leading-5', !selected && 'text-muted-foreground')}>{label.dayMonth}</span>
            </span>
            <span
              className={cn(
                'hidden rounded-full px-2.5 py-0.5 text-sm font-medium whitespace-nowrap lg:inline',
                selected ? 'bg-white/15 text-primary-foreground' : 'bg-secondary text-secondary-foreground',
              )}
            >
              {pluralize(counts[day] ?? 0, 'event')}
            </span>
          </button>
        )
      })}
    </div>
  )
}
