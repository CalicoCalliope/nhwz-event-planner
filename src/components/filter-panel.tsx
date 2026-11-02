import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { CAMPUSES, CATEGORIES, EVENT_LANGUAGES } from '@/types/event'
import { EMPTY_FILTERS, type Filters } from '@/utils/filter-events'
import { languageName } from '@/utils/labels'

interface FilterPanelProps {
  applied: Filters
  onApply: (filters: Filters) => void
}

const GROUPS = [
  { key: 'campuses', title: 'Campus', options: CAMPUSES, label: (v: string) => v },
  { key: 'categories', title: 'Category', options: CATEGORIES, label: (v: string) => v },
  { key: 'languages', title: 'Language', options: EVENT_LANGUAGES, label: (v: string) => languageName(v as 'en' | 'de') },
] as const

/**
 * Filter selections are drafts until "Show results". Close, Escape and
 * backdrop dismissal all discard unapplied edits.
 */
export function FilterPanel({ applied, onApply }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Filters>(applied)

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(applied)
    setOpen(next)
  }

  const toggle = (group: keyof Filters, value: string) => {
    setDraft((current) => {
      const values = current[group] as string[]
      const nextValues = values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
      return { ...current, [group]: nextValues }
    })
  }

  const showResults = () => {
    onApply(draft)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Button variant="outline" className="w-full md:w-[342px] lg:w-full" onClick={() => handleOpenChange(true)}>
        Filters
      </Button>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 overflow-y-auto bg-background p-6 text-base data-[side=right]:w-full data-[side=right]:sm:max-w-[390px]"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className="text-2xl leading-8 font-bold text-foreground">Filters</SheetTitle>
            <SheetClose render={<Button variant="outline" className="w-[88px] text-sm" aria-label="Close filters without applying changes" />}>
              Close
            </SheetClose>
          </div>
          <SheetDescription className="text-base leading-[22px] text-foreground">Select one or more options in each group.</SheetDescription>

          {GROUPS.map((group) => (
            <section key={group.key} aria-labelledby={`filter-${group.key}`} className="flex flex-col gap-3">
              <h3 id={`filter-${group.key}`} className="text-lg leading-6 font-semibold">
                {group.title}
              </h3>
              <div role="group" aria-labelledby={`filter-${group.key}`} className="grid grid-cols-2 gap-x-3 gap-y-2">
                {group.options.map((option) => {
                  const selected = (draft[group.key] as string[]).includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggle(group.key, option)}
                      className={cn(
                        'flex min-h-12 items-center justify-center gap-1.5 rounded-control border p-3 text-center text-sm leading-[22px] font-semibold text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                        selected ? 'border-secondary bg-secondary' : 'bg-card hover:border-primary/60',
                      )}
                    >
                      {/* The tick is a non-colour cue for selection. */}
                      {selected && <Check aria-hidden className="size-4 shrink-0" />}
                      {group.label(option)}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}

          <p className="leading-[22px]">English: English-only events. German: German-only and bilingual events.</p>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="text-sm" onClick={() => setDraft(EMPTY_FILTERS)}>
              Clear filters
            </Button>
            <Button className="text-sm" onClick={showResults}>
              Show results
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
