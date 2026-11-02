import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Filters } from '@/utils/filter-events'
import { languageName } from '@/utils/labels'

interface AppliedFiltersProps {
  filters: Filters
  onRemove: (group: keyof Filters, value: string) => void
  onClearAll: () => void
}

/** Removable chips for applied filters; each removes only its own value. */
export function AppliedFilters({ filters, onRemove, onClearAll }: AppliedFiltersProps) {
  const chips = (Object.keys(filters) as (keyof Filters)[]).flatMap((group) =>
    (filters[group] as string[]).map((value) => ({
      group,
      value,
      label: group === 'languages' ? languageName(value as 'en' | 'de') : value,
    })),
  )
  if (chips.length === 0) return null

  return (
    <div className="flex w-full max-w-[342px] flex-col gap-2 lg:max-w-none">
      <ul aria-label="Applied filters" className="grid grid-cols-2 gap-x-3 gap-y-2">
        {chips.map(({ group, value, label }) => (
          <li key={`${group}:${value}`}>
            <Button variant="outline" className="w-full text-sm" onClick={() => onRemove(group, value)} aria-label={`Remove filter: ${label}`}>
              {label}
              <X aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="outline" className="w-full text-sm" onClick={onClearAll}>
        Clear all filters
      </Button>
    </div>
  )
}
