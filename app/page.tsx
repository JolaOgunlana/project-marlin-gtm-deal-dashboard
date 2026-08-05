'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ConsentMatrix } from '@/components/dashboard/ConsentMatrix'
import { CoverPage } from '@/components/dashboard/CoverPage'
import { WhisperDebriefPage, FaqPage } from '@/components/dashboard/WhisperDebrief'
import { ConsentTrackerPage } from '@/components/dashboard/ConsentTracker'

export type Page = 'cover' | 'debrief' | 'faq' | 'dashboard' | 'consent' | 'tracker'

export default function Home() {
  const [page, setPage] = useState<Page>('tracker')
  const [faqHighlight, setFaqHighlight] = useState<string | null>(null)

  function navigate(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFaqLink(id: string) {
    setFaqHighlight(id)
    setPage('faq')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f9' }}>
      {page === 'cover'     && <CoverPage page={page} onNavigate={navigate} />}
      {page === 'debrief'   && <WhisperDebriefPage page={page} onNavigate={navigate} onFaqLink={handleFaqLink} />}
      {page === 'faq'       && <FaqPage page={page} onNavigate={navigate} highlightId={faqHighlight} onClearHighlight={() => setFaqHighlight(null)} />}
      {page === 'dashboard' && <Dashboard page={page} onNavigate={navigate} />}
      {page === 'consent'   && <ConsentMatrix page={page} onNavigate={navigate} />}
      {page === 'tracker'   && <ConsentTrackerPage page={page} onNavigate={navigate} />}
    </main>
  )
}
