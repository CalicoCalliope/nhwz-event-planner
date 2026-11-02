import { render } from '@testing-library/react'
import { useEffect } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { EventDetailsPage } from '@/pages/event-details-page'
import { MyWeekPage } from '@/pages/my-week-page'
import { ProgrammePage } from '@/pages/programme-page'

const probe = { url: '' }
function LocationProbe() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    probe.url = `${pathname}${search}`
  }, [pathname, search])
  return null
}

/** Renders the app routes in memory, starting at url. */
export function renderApp(url = '/') {
  const result = render(
    <MemoryRouter initialEntries={[url]}>
      <LocationProbe />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProgrammePage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="my-week" element={<MyWeekPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
  return { ...result, url: () => decodeURIComponent(probe.url).replaceAll('+', ' ') }
}
