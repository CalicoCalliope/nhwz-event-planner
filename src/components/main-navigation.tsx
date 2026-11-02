import { Link, useLocation } from 'react-router'
import myWeekIcon from '@/assets/nav-myweek.svg'
import programmeIcon from '@/assets/nav-programme.svg'
import { cn } from '@/lib/utils'

const ITEMS = [
  // Event details belong to the Programme section.
  { to: '/', label: 'Programme', icon: programmeIcon, matches: (path: string) => path === '/' || path.startsWith('/events/') },
  { to: '/my-week', label: 'My Week', icon: myWeekIcon, matches: (path: string) => path === '/my-week' },
] as const

interface MainNavigationProps {
  /** Fixed tab bar at the bottom on mobile; inline tabs in the top bar on larger screens. */
  variant: 'header' | 'bottom'
}

/** Primary navigation: Programme and My Week only (PRD section 3). */
export function MainNavigation({ variant }: MainNavigationProps) {
  const { pathname } = useLocation()
  const isBottom = variant === 'bottom'
  return (
    <nav
      aria-label="Main"
      className={cn(
        isBottom
          ? 'fixed inset-x-0 bottom-0 z-40 border bg-card px-2.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden'
          : 'hidden md:block',
      )}
    >
      <ul className={cn('flex gap-1', isBottom && 'mx-auto max-w-md')}>
        {ITEMS.map(({ to, label, icon, matches }) => {
          const active = matches(pathname)
          return (
            <li key={to} className={cn(isBottom && 'flex-1')}>
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-center rounded-control font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isBottom ? 'h-[60px] flex-col gap-1 text-sm leading-[18px]' : 'h-11 gap-2 rounded-full px-5 text-[0.9375rem]',
                  active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <img src={icon} alt="" width={isBottom ? 22 : 20} height={isBottom ? 22 : 20} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
