import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { EventDetailsPage } from '@/pages/event-details-page'
import { MyWeekPage } from '@/pages/my-week-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { ProgrammePage } from '@/pages/programme-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProgrammePage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="my-week" element={<MyWeekPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
