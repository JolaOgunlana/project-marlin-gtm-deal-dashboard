'use client'

import { useMemo, useState } from 'react'
import { clients } from '@/lib/data'

const EGGPLANT        = '#431C5B'
const EGGPLANT_SOFT   = '#f2ebf5'
const EGGPLANT_BORDER = '#d3b8dd'

const rippleKeyframes = `
@keyframes ripple-ring {
  0%   { transform: scale(0.4); opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ripple-ring { animation: none !important; }
}
`

type ClientFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'
type RegionFilter = 'all' | 'NA' | 'EMEA'
type StageFilter = 'all' | 'hold' | '1' | '2' | '3' | '4' | '5' | '6' | '8'
type WhisperFilter = 'all' | 'completed'

interface PipelineFunnelProps {
  clientFilter: ClientFilter
  waveFilter: WaveFilter
  regionFilter: RegionFilter
  stageFilter: StageFilter
  whisperFilter: WhisperFilter
  onClientFilter: (v: ClientFilter) => void
  onWaveFilter: (v: WaveFilter) => void
  onRegionFilter: (v: RegionFilter) => void
  onStageFilter: (v: StageFilter) => void
  onWhisperFilter: (v: WhisperFilter) => void
}

const STAGES = [
  { key: '1',    label: 'New Opportunity',      color: '#1a1f4e', labelColor: '#1a1f4e',  num: 1, suffix: '',          desc: 'Opportunity loaded and qualified for pursuit.' },
  { key: '2',    label: 'Early Sales',          color: '#1a1f4e', labelColor: '#1a1f4e',  num: 2, suffix: '',          desc: 'Whisper conversation conducted with client.' },
  { key: '3',    label: 'Mid Sales',            color: '#0891b2', labelColor: '#0891b2',  num: 3, suffix: '',          desc: 'First pitch delivered to client.' },
  { key: '4',    label: 'Late Sales / Pricing', color: '#0891b2', labelColor: '#0891b2',  num: 4, suffix: '',          desc: 'Client has agreed to further meetings; pricing and commercial terms are under discussion.' },
  { key: '5',    label: 'Contracting',          color: '#4bcd3e', labelColor: '#4bcd3e',  num: 5, suffix: '',          desc: 'Contract amendment submitted to legal; negotiations in progress, with commercial terms and pricing verbally agreed by client.' },
  { key: '6',    label: 'Executed',             color: '#4bcd3e', labelColor: '#4bcd3e',  num: 6, suffix: ' \u2713',   desc: null },
  { key: '8',    label: 'Disqualified',         color: '#B21A53', labelColor: '#B21A53',  num: 8, suffix: ' \u2715',   desc: null },
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
  const [hovered, setHovered] = useState<T | null>(null)
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,31,78,0.45)', marginRight: 4 }}>{label}</span>
      {options.map((opt) => {
        const isActive  = active === opt.value
        const isHovered = hovered === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            onMouseEnter={() => setHovered(opt.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '6px 13px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1.5px solid',
              borderColor: isActive ? '#1a1f4e' : isHovered ? EGGPLANT : '#e2e4ee',
              color: isActive ? 'white' : isHovered ? EGGPLANT : 'rgba(26,31,78,0.45)',
              background: isActive ? '#1a1f4e' : 'transparent',
              transform: !isActive && isHovered ? 'translateY(-2px)' : 'none',
              boxShadow: !isActive && isHovered ? `0 4px 10px rgba(67,28,91,0.18)` : 'none',
              transition: 'all 0.18s ease',
              outline: 'none',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function FilterCluster({
  clientFilter, onClientFilter,
  waveFilter,   onWaveFilter,
  regionFilter, onRegionFilter,
  whisperFilter, onWhisperFilter,
}: Omit<PipelineFunnelProps, 'stageFilter' | 'onStageFilter'>) {
  const [boxHovered, setBoxHovered] = useState(false)

  return (
    <>
      <style>{rippleKeyframes}</style>
      <div
        onMouseEnter={() => setBoxHovered(true)}
        onMouseLeave={() => setBoxHovered(false)}
        style={{
          background: EGGPLANT_SOFT,
          border: `1.5px solid ${boxHovered ? EGGPLANT : EGGPLANT_BORDER}`,
          borderRadius: 16,
          padding: '12px 16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-end',
          boxShadow: boxHovered
            ? `0 4px 16px rgba(67,28,91,0.20)`
            : `0 2px 8px rgba(67,28,91,0.10)`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Caption row with ripple icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-end' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: EGGPLANT, letterSpacing: '0.01em' }}>
            Click any filter to refine the pipeline
          </span>
          {/* Cursor icon with two ripple rings */}
          <div style={{ position: 'relative', width: 26, height: 26, flexShrink: 0 }}>
            {/* Ripple rings emanate from cursor tip (bottom-left) */}
            {[0, 1.1].map((delay, i) => (
              <div
                key={i}
                className="ripple-ring"
                style={{
                  position: 'absolute',
                  bottom: 2,
                  left: 2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: `2px solid ${EGGPLANT}`,
                  animation: `ripple-ring 2.2s ease-out ${delay}s infinite`,
                  pointerEvents: 'none',
                }}
              />
            ))}
            {/* Cursor SVG */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 3L19 12L12 13.5L9 21L5 3Z" stroke={EGGPLANT} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Filter rows */}
        <FilterTabGroup
          label="Opportunities"
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
        <FilterTabGroup
          label="Region"
          active={regionFilter}
          onSelect={onRegionFilter}
          options={[
            { value: 'all' as RegionFilter, label: 'All' },
            { value: 'NA' as RegionFilter, label: 'NA' },
            { value: 'EMEA' as RegionFilter, label: 'EMEA' },
          ]}
        />
        <FilterTabGroup
          label="Whisper Completion"
          active={whisperFilter}
          onSelect={onWhisperFilter}
          options={[
            { value: 'all' as WhisperFilter, label: 'All' },
            { value: 'completed' as WhisperFilter, label: 'Completed' },
          ]}
        />
      </div>
    </>
  )
}

export function PipelineFunnel({ clientFilter, waveFilter, regionFilter, stageFilter, whisperFilter, onClientFilter, onWaveFilter, onRegionFilter, onStageFilter, onWhisperFilter }: PipelineFunnelProps) {
  const stageCounts = useMemo(() => {
    const cnt: Record<string, number> = {}
    const rev: Record<string, number> = {}
    STAGES.forEach((s) => { cnt[s.key] = 0; rev[s.key] = 0 })

    clients.forEach((row) => {
      const cMatch = clientFilter === 'total' || clientFilter === row.clientType
      const wMatch = waveFilter === 'all' || waveFilter === row.wave
      const rMatch = regionFilter === 'all' || (regionFilter === 'NA' ? row.region === 'NA' : row.region.startsWith('EMEA'))
      const isCompleted = row.salesCategory.trim() !== '' && row.salesCategory.trim() !== 'TBD'
      const whisperMatch = whisperFilter === 'all' || (whisperFilter === 'completed' && isCompleted)
      if (!cMatch || !wMatch || !rMatch || !whisperMatch) return
      const s = row.stage
      if (s in cnt) {
        cnt[s]++
        rev[s] += row.tmsRevenue
      }
    })
    return { cnt, rev }
  }, [clientFilter, waveFilter, regionFilter, whisperFilter])

  const maxRev = Math.max(1, ...STAGES.map((s) => stageCounts.rev[s.key]))

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 24px', marginBottom: 24, overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.005em', color: '#1a1f4e' }}>Pipeline by Opportunity Stage</div>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(26,31,78,0.42)', marginTop: 3 }}>Click any stage to filter opportunities</div>
        </div>
        <FilterCluster
          clientFilter={clientFilter} onClientFilter={onClientFilter}
          waveFilter={waveFilter}     onWaveFilter={onWaveFilter}
          regionFilter={regionFilter} onRegionFilter={onRegionFilter}
          whisperFilter={whisperFilter} onWhisperFilter={onWhisperFilter}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 10, alignItems: 'stretch' }}>
        {STAGES.map((stage) => {
          const count = stageCounts.cnt[stage.key]
          const rev = stageCounts.rev[stage.key]
          const barHeight = rev > 0 ? Math.max(28, Math.round((rev / maxRev) * 150)) : 4
          const amtLabel = rev > 0 ? `$${(rev / 1_000_000).toFixed(1)}M` : null
          const isActive = stageFilter === stage.key
          return (
            <button
              key={stage.key}
              onClick={() => onStageFilter(isActive ? 'all' : stage.key as StageFilter)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                background: isActive ? 'rgba(26,31,78,0.045)' : 'transparent',
                border: isActive ? `2px solid ${stage.color}` : '2px solid transparent',
                borderRadius: 10,
                padding: '6px 4px 8px',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
                outline: 'none',
                position: 'relative',
              }}
            >
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
                    opacity: stageFilter !== 'all' && !isActive ? 0.35 : 1,
                  }}
                >
                  {amtLabel && (
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{amtLabel}</span>
                  )}
                </div>
              </div>
              {/* Opportunity count */}
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,31,78,0.55)', textAlign: 'center' }}>
                {count} {count === 1 ? 'opportunity' : 'opportunities'}
              </div>
              {/* Numbered badge */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: stage.color,
                  color: '#fff',
                  fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? `0 0 0 3px ${stage.color}40` : 'none',
                  transition: 'box-shadow 0.15s',
                }}>
                  {stage.num}
                </div>
              </div>
              {/* Stage label */}
              <div style={{ fontSize: 12, fontWeight: isActive ? 800 : 700, color: stage.labelColor, textAlign: 'center', lineHeight: 1.35 }}>
                {stage.label}{stage.suffix}
              </div>
              {/* Stage description */}
              {stage.desc && (
                <div style={{
                  fontSize: 10.5,
                  color: 'rgba(26,31,78,0.42)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  paddingTop: 4,
                  borderTop: '1px solid rgba(26,31,78,0.08)',
                  marginTop: 2,
                }}>
                  {stage.desc}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Consent stage color key */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,31,78,0.4)' }}>Consent Stage</span>
        {[
          { color: '#1a1f4e', label: 'Exploration' },
          { color: '#0891b2', label: 'Alignment' },
          { color: '#4bcd3e', label: 'Committed' },
          { color: '#B21A53', label: 'Disqualified' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'rgba(26,31,78,0.65)', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
