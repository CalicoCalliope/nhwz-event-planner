import type { Category } from '@/types/event'

const PILL = 'inline-flex items-center rounded-full p-2 text-sm leading-[18px] font-medium whitespace-nowrap'

export function CategoryPill({ category }: { category: Category }) {
  return <span className={`${PILL} bg-secondary text-secondary-foreground`}>{category}</span>
}

/** Cancellation label: always text, never colour alone. */
export function CancelledPill() {
  return <span className={`${PILL} bg-cancelled text-cancelled-foreground`}>Cancelled</span>
}
