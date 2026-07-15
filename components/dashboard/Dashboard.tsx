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
      {/* Navy banner — full bleed, no radius */}
      <div style={{
        background: '#1a1f4e',
        marginBottom: 26,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        {/* Left: title + internal tag */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 46, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
            Project Marlin GTM Deal Dashboard
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
            Internal Use Only
          </span>
        </div>

        {/* Right: target pill + dates */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
          {/* Target pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: 999,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7ed321', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 6px #7ed32180' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
              ACV Target $25M by October 1st 2026
            </span>
          </div>
          {/* Dates */}
          <div style={{ textAlign: 'right', lineHeight: 1.65 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 1 }}>Last Update</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>July 15th 2026 · 18:00 EST</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4, marginBottom: 1 }}>Next Update</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>July 22nd 2026 · 18:00 EST</div>
          </div>
        </div>
      </div>

      {/* Content area with original padding */}
      <div style={{ padding: '0 28px 48px' }}>
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
    </div>
  )
}
