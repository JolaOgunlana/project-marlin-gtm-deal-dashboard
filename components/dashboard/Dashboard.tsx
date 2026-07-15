'use client'

import { useState } from 'react'
import { KpiSection } from './KpiSection'
import { PipelineFunnel } from './PipelineFunnel'
import { ClientTable } from './ClientTable'

type ClientFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'

export function Dashboard() {
  const [clientFilter, setClientFilter] = useState<ClientFilter>('total')
  const [waveFilter, setWaveFilter] = useState<WaveFilter>('all')

  return (
    <div className="db-wrap" style={{ fontFamily: "'Geist', system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 46, fontWeight: 900, color: '#1a1f4e', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
            Project Marlin GTM Deal Dashboard
          </div>
          <div style={{ fontSize: 14, color: 'rgba(26,31,78,0.5)', fontStyle: 'italic', fontWeight: 700, marginTop: 6 }}>
            INTERNAL USE ONLY
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#ffffff', border: '1px solid rgba(26,31,78,0.2)', borderRadius: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7ed321', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1f4e', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>ACV Target $25M by October 1st 2026</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.6)', textAlign: 'right', lineHeight: 1.55, whiteSpace: 'nowrap' }}>
            Last Update July 15th 18:00 EST<br />Next Update July 22nd 18:00 EST
          </div>
        </div>
      </div>

      {/* KPI — Existing Deal Clients */}
      <KpiSection
        variant="existing"
        title="Existing Deal Clients"
        totalRevLabel="Total Portfolio Revenue"
        totalRevValue="$151.2M"
        totalRevSub="Current annual contract value"
        totalClients="63"
        totalClientsSub="52 NA  ·  11 EMEA"
        executed="0"
        disqualified="0"
        marginSecured="$0"
        percentACV25="0%"
        percentACV40="0%"
        won="$0"
        percentWon="0%"
        lost="$0"
        percentLost="0%"
      />

      {/* KPI — New Deal Clients */}
      <KpiSection
        variant="new"
        title="New Deal Clients"
        totalRevLabel="Total Opportunity Revenue"
        totalRevValue="$0"
        totalRevSub="Annual Contract Value"
        totalClients="0"
        totalClientsSub="0 NA  ·  0 EMEA"
        executed="0"
        disqualified="0"
        marginSecured="$0"
        won="$0"
        lost="$0"
      />

      {/* Pipeline Funnel */}
      <PipelineFunnel
        clientFilter={clientFilter}
        waveFilter={waveFilter}
        onClientFilter={(v) => setClientFilter(v)}
        onWaveFilter={(v) => setWaveFilter(v)}
      />

      {/* Client Table */}
      <ClientTable clientFilter={clientFilter} waveFilter={waveFilter} />
    </div>
  )
}
