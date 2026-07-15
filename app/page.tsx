import { Dashboard } from '@/components/dashboard/Dashboard'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f4f5f9',
        padding: '32px 28px 48px',
      }}
    >
      <Dashboard />
    </main>
  )
}
