import { Brand } from '@/components/brand'
import { usePageScroll } from '@/utils/scroll-memory'

/** Saving and My Week are Sprint 2; this keeps the navigation destination in place. */
export function MyWeekPage() {
  usePageScroll()
  return (
    <div className="flex flex-col gap-5">
      <Brand className="self-start md:hidden" />
      <h1 className="text-4xl leading-10 font-bold text-primary">
        A week to <br className="md:hidden" />
        look forward to.
      </h1>
      <div className="flex max-w-[342px] flex-col gap-3 rounded-card bg-secondary p-6">
        <p className="text-[1.375rem] leading-7 font-bold text-primary">Coming in Sprint 2</p>
        <p className="leading-[23px] text-muted-foreground">Saving events to My Week is part of the next delivery.</p>
      </div>
    </div>
  )
}
