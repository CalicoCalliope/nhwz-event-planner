import { BookmarkMinus, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { removeEvent, saveEvent, useSavedEvents } from '@/services/saved-events'
import type { ProgrammeEvent } from '@/types/event'

interface SaveButtonProps {
  event: ProgrammeEvent
  /** Adds the event title to the accessible name, for lists with many buttons. */
  withTitle?: boolean
  /** Short "Save" / "Remove" text from 1024px, for the desktop card footer. */
  compact?: boolean
  className?: string
}

/** Save/remove toggle. Cancelled events can still be saved and removed (PRD FR03). */
export function SaveButton({ event, withTitle = false, compact = false, className }: SaveButtonProps) {
  const saved = useSavedEvents().ids.has(event.id)
  const label = saved ? 'Remove from My Week' : 'Save event'
  const Icon = saved ? BookmarkMinus : BookmarkPlus
  return (
    <Button
      variant={saved ? 'secondary' : 'outline'}
      className={cn('lg:text-sm', saved && 'text-primary', className)}
      // The visible text varies by screen size; the name always starts with it.
      aria-label={withTitle ? `${label}: ${event.title}` : label}
      onClick={() => (saved ? removeEvent(event.id) : saveEvent(event.id))}
    >
      {/* Mobile follows Figma (text only); the desktop redesign adds an icon. */}
      <Icon aria-hidden className="hidden lg:block" />
      {compact ? (
        <>
          <span className="lg:hidden">{label}</span>
          <span className="hidden lg:inline">{saved ? 'Remove' : 'Save'}</span>
        </>
      ) : (
        label
      )}
    </Button>
  )
}
