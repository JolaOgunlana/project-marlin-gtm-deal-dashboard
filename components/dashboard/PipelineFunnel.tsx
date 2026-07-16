'use client'

import { useMemo } from 'react'
import { clients } from '@/lib/data'

type ClientFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'

interface PipelineFunnelProps {
  clientFilter: ClientFilter
  waveFilter: WaveFilter
  onClientFilter: (v: ClientFilter) => void
  onWaveFilter: (v: WaveFilter) => void
}

const STAGES = [
  { key: 'hold', label: 'Not Started',       color: '#9ca3af', labelColor: '#6b7280',  num: 0,  suffix: ''   },
  { key: '1',    label: 'New Opportunity',    color: '#1a1f4e', labelColor: '#1a1f4e',  num: 1,  suffix: ''   },
  { key: '2',    label: 'Early Sales',        color: '#1a1f4e', labelColor: '#1a1f4e',  num: 2,  suffix: ''   },
  { key: '3',    label: 'Mid Sales',          color: '#1a1f4e', labelColor: '#1a1f4e',  num: 3,  suffix: ''   },
  { key: '4',    label: 'Late Sales / Pricing', color: '#1a1f4e', labelColor: '#1a1f4e', num: 4, suffix: ''   },
  { key: '5',    label: 'Contracting',        color: '#1a1f4e', labelColor: '#1a1f4e',  num: 5,  suffix: ''   },
  { key: '6',    label: 'Executed',           color: '#52b000', labelColor: '#52b000',  num: 6,  suffix: ' \u2713' },
  { key: '8',    label: 'Disqualified',       color: '#d0021b', labelColor: '#d0021b',  num: 8,  suffix: ' \u2715' },
]

function FilterTabGroup<T extends string>({
  label,
  options,
  active,
  onSelect,
}: {
  label: string
  options: { value: T; label: string }[]
  active: T
  onSelect: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,31,78,0.45)', marginRight: 4 }}>{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          style={{
            padding: '6px 13px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: active === opt.value ? '#1a1f4e' : '#e2e4ee',
            color: active === opt.value ? 'white' : 'rgba(26,31,78,0.45)',
            background: active === opt.value ? '#1a1f4e' : 'transparent',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function PipelineFunnel({ clientFilter, waveFilter, onClientFilter, onWaveFilter }: PipelineFunnelProps) {
  const stageCounts = useMemo(() => {
    const cnt: Record<string, number> = {}
    const rev: Record<string, number> = {}
    STAGES.forEach((s) => { cnt[s.key] = 0; rev[s.key] = 0 })

    clients.forEach((row) => {
      const cMatch = clientFilter === 'total' || clientFilter === row.clientType
      const wMatch = waveFilter === 'all' || waveFilter === row.wave
      if (!cMatch || !wMatch) return
      const s = row.stage
      if (s in cnt) {
        cnt[s]++
        rev[s] += row.tmsRevenue
      }
    })
    return { cnt, rev }
  }, [clientFilter, waveFilter])

  const maxRev = Math.max(1, ...STAGES.map((s) => stageCounts.rev[s.key]))

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 24px', marginBottom: 24, overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.01em', color: '#1a1f4e' }}>Pipeline by Opportunity Stage</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <FilterTabGroup
            label="Clients"
            active={clientFilter}
            onSelect={onClientFilter}
            options={[
              { value: 'total' as ClientFilter, label: 'Total' },
              { value: 'existing' as ClientFilter, label: 'Revenue Retention Opportunities' },
              { value: 'new' as ClientFilter, label: 'New Deal Opportunities' },
            ]}
          />
          <FilterTabGroup
            label="Wave"
            active={waveFilter}
            onSelect={onWaveFilter}
            options={[
              { value: 'all' as WaveFilter, label: 'All' },
              { value: '1' as WaveFilter, label: 'Wave 1' },
              { value: '2' as WaveFilter, label: 'Wave 2' },
              { value: '3' as WaveFilter, label: 'Wave 3' },
            ]}
          />
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--border)', margin: '0 -24px 20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: 10, alignItems: 'stretch' }}>
        {STAGES.map((stage) => {
          const count = stageCounts.cnt[stage.key]
          const rev = stageCounts.rev[stage.key]
          const barHeight = rev > 0 ? Math.max(10, Math.round((rev / maxRev) * 150)) : 4
          const amtLabel = rev > 0 ? `$${(rev / 1_000_000).toFixed(1)}M` : null
          return (
            <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Bar */}
              <div style={{ height: 160, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div
                  style={{
                    background: stage.color,
                    height: barHeight,
                    borderRadius: '6px 6px 3px 3px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: 8,
                    transition: 'height 0.4s ease',
                  }}
                >
                  {amtLabel && barHeight > 20 && (
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{amtLabel}</span>
                  )}
                </div>
              </div>
              {/* Client count */}
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,31,78,0.55)', textAlign: 'center' }}>
                {count} {count === 1 ? 'client' : 'clients'}
              </div>
              {/* Numbered badge */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: stage.color,
                  color: '#fff',
                  fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {stage.num}
                </div>
              </div>
              {/* Stage label */}
              <div style={{ fontSize: 12, fontWeight: 700, color: stage.labelColor, textAlign: 'center', lineHeight: 1.35 }}>
                {stage.label}{stage.suffix}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
