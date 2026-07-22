'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ConsentMatrix } from '@/components/dashboard/ConsentMatrix'

export default function Home() {
  const [page, setPage] = useState<'dashboard' | 'consent'>('dashboard')

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f9' }}>
      {page === 'dashboard'
        ? <Dashboard page={page} onNavigate={setPage} />
        : <ConsentMatrix page={page} onNavigate={setPage} />
      }
    </main>
  )
}
