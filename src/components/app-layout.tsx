import { Outlet } from 'react-router'
import { Brand } from '@/components/brand'
import { MainNavigation } from '@/components/main-navigation'
import { useSavedEvents } from '@/services/saved-events'

export function AppLayout() {
  const { persistent } = useSavedEvents()
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-card px-4 py-3 font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:outline-2 focus:outline-ring"
      >
        Skip to content
      </a>

      {/* Tablet and desktop: slim sticky top bar. On mobile the brand sits in the page and navigation at the bottom. */}
      <header className="sticky top-0 z-30 hidden border-b bg-background/85 backdrop-blur-md md:block">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-8">
          <Brand />
          <MainNavigation variant="header" />
        </div>
      </header>

      {/* Bottom padding keeps content clear of the fixed mobile navigation. */}
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-6 pb-28 outline-none md:px-8 md:pt-10 md:pb-20">
        {!persistent && (
          <p role="status" className="mb-6 rounded-control bg-highlight p-4 leading-[22px] text-highlight-foreground">
            Saved events can't be stored in this browser, so they will be lost when you close or reload this page.
          </p>
        )}
        <Outlet />
      </main>

      <MainNavigation variant="bottom" />
    </div>
  )
}
