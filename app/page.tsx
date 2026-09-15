'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ConsentMatrix } from '@/components/dashboard/ConsentMatrix'
import { CoverPage } from '@/components/dashboard/CoverPage'
import { ConsentTrackerPage } from '@/components/dashboard/ConsentTracker'
import { SalesFaqNewPage } from '@/components/dashboard/SalesFaqNew'
import { PitchCalendarPage } from '@/components/dashboard/PitchCalendar'
import { ActionTrackerPage } from '@/components/dashboard/ActionTracker'

export type Page = 'cover' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar' | 'actionTracker'

export default function Home() {
  const [page, setPage] = useState<Page>('tracker')

  function navigate(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFaqLink() {
    setPage('faqNew')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f9' }}>
      {page === 'cover'     && <CoverPage page={page} onNavigate={navigate} />}
      {page === 'faqNew'    && <SalesFaqNewPage page={page} onNavigate={navigate} />}
      {page === 'dashboard' && <Dashboard page={page} onNavigate={navigate} />}
      {page === 'consent'   && <ConsentMatrix page={page} onNavigate={navigate} />}
      {page === 'tracker'   && <ConsentTrackerPage page={page} onNavigate={navigate} onFaqLink={handleFaqLink} />}
      {page === 'calendar'  && <PitchCalendarPage page={page} onNavigate={navigate} />}
      {page === 'actionTracker' && <ActionTrackerPage page={page} onNavigate={navigate} />}
    </main>
  )
}
