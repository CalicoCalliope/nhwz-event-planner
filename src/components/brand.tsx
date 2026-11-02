import { Link } from 'react-router'
import { cn } from '@/lib/utils'

/** NHWZ mark and wordmark, linking home. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex min-h-11 items-center gap-2.5 rounded-control outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <img src="/nhwz-mark.svg" alt="" width={34} height={34} />
      <span className="text-[1.6875rem] leading-[34px] font-extrabold text-primary">NHWZ</span>
    </Link>
  )
}
