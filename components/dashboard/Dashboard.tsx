'use client'

import { useState } from 'react'
import { KpiSection } from './KpiSection'
import { PipelineFunnel } from './PipelineFunnel'
import { ClientTable } from './ClientTable'

type ClientFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'
type RegionFilter = 'all' | 'NA' | 'EMEA'
type StageFilter = 'all' | 'hold' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
type WhisperFilter = 'all' | 'completed'

type Page = 'cover' | 'faq' | 'dashboard' | 'consent' | 'tracker' | 'calendar'

export function Dashboard({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const [clientFilter, setClientFilter] = useState<ClientFilter>('total')
  const [waveFilter, setWaveFilter] = useState<WaveFilter>('all')
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all')
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const [whisperFilter, setWhisperFilter] = useState<WhisperFilter>('all')

  return (
    <div className="db-wrap" style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      {/* Navy banner — full bleed, no radius */}
      <div style={{
        background: "linear-gradient(90deg, rgba(22,24,56,0.87) 0%, rgba(22,24,56,0.87) 100%), url('/images/marlin-banner-bridge.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 34%',
        marginBottom: 18,
        padding: '18px 32px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Top row: title left, meta right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingBottom: 14 }}>
          {/* Left: title + internal tag */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 58, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05, fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
              Project Marlin
            </div>
            <div style={{ fontSize: 28, fontWeight: 400, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05, fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
              Consent Tracker
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
              Internal Use Only
            </span>
          </div>

          {/* Right: target pill + dates */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', background: 'rgba(75,205,62,0.16)',
              border: '1px solid rgba(75,205,62,0.45)', borderRadius: 999,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4bcd3e', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 6px #4bcd3e80' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                ACV Target $25M by End of Year 2026
              </span>
            </div>
            <div style={{ textAlign: 'right', lineHeight: 1.65 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 1 }}>Last Update</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>September 8th 2026 · 18:00 EST</div>
<div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4, marginBottom: 1 }}>Next Update</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>September 15th 2026 · 18:00 EST</div>
            </div>
          </div>
        </div>

        {/* Bottom: page tabs flush to banner bottom-left */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {([
            { id: 'tracker',   label: 'GTM Status' },
            { id: 'calendar',  label: 'Pitch Calendar' },
            { id: 'consent',   label: 'Consent Matrix' },
            { id: 'dashboard', label: 'Deal Dashboard' },
            { id: 'faq',       label: 'Sales FAQ (old)' },
            { id: 'cover',     label: 'How to Use' },
          ] as { id: Page; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: page === tab.id ? '#fff' : 'rgba(255,255,255,0.10)',
                color: page === tab.id ? '#1a1f4e' : 'rgba(255,255,255,0.65)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area with original padding */}
      <div style={{ padding: '0 28px 48px' }}>
        {/* Description */}
        <p style={{ fontSize: 13.5, color: 'rgba(26,31,78,0.55)', lineHeight: 1.65, marginBottom: 24 }}>
          Wave-level view of consent opportunities showing Salesforce sales stages mapped to consent stages. Click a stage or client to explore the details.
        </p>

      {/* Pipeline Funnel */}
      <PipelineFunnel
        clientFilter={clientFilter}
        waveFilter={waveFilter}
        regionFilter={regionFilter}
        stageFilter={stageFilter}
        whisperFilter={whisperFilter}
        onClientFilter={(v) => setClientFilter(v)}
        onWaveFilter={(v) => setWaveFilter(v)}
        onRegionFilter={(v) => setRegionFilter(v)}
        onStageFilter={(v) => setStageFilter(v)}
        onWhisperFilter={(v) => setWhisperFilter(v)}
      />

      {/* Client Table */}
      <ClientTable clientFilter={clientFilter} waveFilter={waveFilter} regionFilter={regionFilter} stageFilter={stageFilter} whisperFilter={whisperFilter} />

      {/* KPI — Revenue Retention Opportunities */}
      <div style={{ marginTop: 56 }}>
      <KpiSection
        variant="existing"
        title="Revenue Retention Opportunities"
        totalRevLabel="TOTAL PORTOLIO REVENUE"
        totalRevValue="$145.2M"
        totalRevSub="Current annual contract value"
        totalClients="64"
        totalClientsSub="53 NA  ·  11 EMEA"
        executed="0"
        disqualified="0"
        marginSecured="$0"
        percentACV25="0%"
        percentACV40="0%"
        totalACV="0%"
        won="$0"
        percentWon="0%"
        lost="$0"
        percentLost="0%"
      />
      </div>

      {/* KPI — New Deal Opportunities */}
      <div style={{ marginTop: 40 }}>
      <KpiSection
        variant="new"
        title="New Deal Opportunities"
        totalRevLabel="Total Opportunity Revenue"
        totalRevValue="$0"
        totalRevSub="Annual contract value"
        totalClients="0"
        totalClientsSub="0 NA  ·  0 EMEA"
        executed="0"
        disqualified="0"
        marginSecured="$0"
        won="$0"
        lost="$0"
      />
      </div>
      </div>
    </div>
  )
}
