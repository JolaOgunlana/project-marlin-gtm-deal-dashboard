'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ConsentMatrix } from '@/components/dashboard/ConsentMatrix'
import { CoverPage } from '@/components/dashboard/CoverPage'
import { WhisperDebriefPage, FaqPage } from '@/components/dashboard/WhisperDebrief'

export type Page = 'cover' | 'debrief' | 'faq' | 'dashboard' | 'consent'

export default function Home() {
  const [page, setPage] = useState<Page>('cover')
  const [faqHighlight, setFaqHighlight] = useState<string | null>(null)

  function navigate(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f9' }}>
      {page === 'cover'     && <CoverPage page={page} onNavigate={navigate} />}
      {page === 'debrief'   && <WhisperDebriefPage page={page} onNavigate={navigate} />}
      {page === 'faq'       && <FaqPage page={page} onNavigate={navigate} highlightId={faqHighlight} />}
      {page === 'dashboard' && <Dashboard page={page} onNavigate={navigate} />}
      {page === 'consent'   && <ConsentMatrix page={page} onNavigate={navigate} />}
    </main>
  )
}
