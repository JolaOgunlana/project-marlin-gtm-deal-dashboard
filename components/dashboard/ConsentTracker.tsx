'use client'

import { useState } from 'react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faq' | 'dashboard' | 'consent' | 'tracker'

// ── Constants ──────────────────────────────────────────────────────────────────
const INK   = '#1a1f4e'
const MUTED = 'rgba(26,31,78,0.50)'
const MUTED_D = 'rgba(26,31,78,0.65)'
const BORDER = '1px solid #e5e8ed'
const GREEN  = '#2d7a0f'  // Matches executed section in Dashboard KPI
const GREEN_BG = '#DFF3E4'
const AMBER  = '#B7860B'
const AMBER_BG = '#FBF0D0'
const GRAY   = '#8A93A2'
const GRAY_BG = '#ECEEF2'

// ── Types ──────────────────────────────────────────────────────────────────────
type StepStatus = 'done' | 'active' | 'pending'
type ConsentStep = 'exploration' | 'alignment' | 'consent'

interface EvidenceRow {
  status: 'y' | 'q' | 'n'
  question: string
  answer: string
  date?: string
  link?: 'debrief' | 'faq'
}

interface StageBlock {
  step: ConsentStep
  status: StepStatus
  evidence: EvidenceRow[]
}

interface TrackerClient {
  id: string
  name: string
  region: string
  revenue: string
  wave: number
  currentStep: ConsentStep | 'signed'
  sfStage: string
  stages: StageBlock[]
}

// ── Data ───────────────────────────────────────────────────────────────────────
// Only clients with completed whisper conversations are shown in the tracker
const CLIENTS: TrackerClient[] = [
  {
    id: 'vm',
    name: 'Virgin Money',
    region: 'EMEA',
    revenue: '$27.2M',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 1 · Early Engagement',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '15 May 2026', link: 'debrief' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Open to further outsourcing; concerns around PRA regulation and offshore voice flagged.', link: 'faq' },
          { status: 'q', question: 'Has the client remained engaged in the process?', answer: 'No formal follow-up confirmed yet.' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'ft',
    name: 'Fifth Third Bank',
    region: 'NA',
    revenue: '$14.1M',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 2 · Early Sales',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '8 Jun 2026', link: 'debrief' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested case studies on digital transformation and geographic delivery capabilities.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Follow-up meeting scheduled; internal sponsors committed.' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'umb',
    name: 'UMB',
    region: 'NA',
    revenue: '$10.3M',
    wave: 1,
    currentStep: 'alignment',
    sfStage: 'Stage 3 · Mid Sales',
    stages: [
      {
        step: 'exploration',
        status: 'done',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '22 May 2026', link: 'debrief' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested offshore capability details and delivery location options for voice and back-office.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Formal pitch requested; targeting late August or early September.' },
        ],
      },
      {
        step: 'alignment',
        status: 'active',
        evidence: [
          { status: 'q', question: 'Has the client requested pricing or commercial detail?', answer: 'Partially. Pricing benchmarked against market rates; challenged current economics — expects topic to resurface.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed — formal pitch not yet delivered.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'nw',
    name: 'NatWest',
    region: 'EMEA',
    revenue: '$25.2K',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 1 · Early Engagement',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '28 May 2026', link: 'debrief' },
          { status: 'q', question: 'Did the client request additional information?', answer: 'No request yet', link: 'faq' },
          { status: 'q', question: 'Has the client remained engaged in the process?', answer: 'Not Assessed Yet' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
]

// ── Summary stats ─────────────────────────────────────────────────────────────
const STATS = [
  {
    label: 'Exploration',
    tag: 'WHISPER',
    count: 3,
    countColor: GRAY,
    revenue: '$41.3M',
    revenueLabel: 'Annual contract value',
    region: '2 NA · 1 EMEA',
    descriptionParts: [
      { text: 'The client is ', bold: false },
      { text: 'willing to engage, learn more, and evaluate', bold: true },
      { text: ' the opportunity. Senior-to-senior whisper conversations open the door before any formal pitch — the client is listening, not yet committing.', bold: false },
    ],
    sfStages: 'Stage 1–2 · New Opportunity / Early Sales',
  },
  {
    label: 'Alignment',
    tag: 'PITCH',
    count: 1,
    countColor: AMBER,
    revenue: '$10.3M',
    revenueLabel: 'Annual contract value',
    region: '1 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'wants the specifics', bold: true },
      { text: ' — asking for pricing, commercial detail, and implementation plans, and willing to review a proposal. Interest has become intent to evaluate seriously.', bold: false },
    ],
    sfStages: 'Stage 3–4 · Late Sales / Pricing',
  },
  {
    label: 'Consent',
    tag: 'POST-PITCH',
    count: 0,
    countColor: GREEN,
    revenue: '$0M',
    revenueLabel: 'Annual contract value consented',
    region: '0 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'has decided to move forward', bold: true },
      { text: ' and begins execution — amendment discussions, redlines, and internal legal / risk / procurement. The conversation has crossed from evaluation into execution.', bold: false },
    ],
    sfStages: 'Stage 5 · Contracting',
  },
]

// ── Sub-components ──────────────────────────────────────��──────────────────────
function TickIcon({ status }: { status: 'y' | 'q' | 'n' }) {
  const map = {
    y: { bg: GREEN_BG,  color: GREEN, label: '✓' },
    q: { bg: AMBER_BG,  color: AMBER, label: '?' },
    n: { bg: GRAY_BG,   color: GRAY,  label: '–' },
  }
  const s = map[status]
  return (
    <span style={{
      flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 800, marginTop: 1,
    }}>{s.label}</span>
  )
}

function Badge({ status }: { status: StepStatus }) {
  const map: Record<StepStatus, { bg: string; color: string; dot: string; label: string }> = {
    done:    { bg: GREEN_BG,  color: GREEN, dot: GREEN,  label: 'Complete' },
    active:  { bg: AMBER_BG,  color: AMBER, dot: AMBER,  label: 'In progress' },
    pending: { bg: GRAY_BG,   color: GRAY,  dot: GRAY,   label: 'Not yet assessed' },
  }
  const s = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 16,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function CurrentStagePill({ step }: { step: TrackerClient['currentStep'] }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    exploration: { bg: GRAY_BG,  color: '#556070', label: 'Exploration' },
    alignment:   { bg: AMBER_BG, color: AMBER,      label: 'Alignment' },
    consent:     { bg: GREEN_BG, color: GREEN,       label: 'Consent' },
    signed:      { bg: INK,      color: '#fff',      label: 'Signed' },
  }
  const s = map[step]
  return (
    <span style={{
      display: 'inline-block', padding: '5px 12px', borderRadius: 14,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase',
    }}>{s.label}</span>
  )
}

function StepLabel({ step }: { step: ConsentStep }) {
  const map: Record<ConsentStep, string> = {
    exploration: 'Exploration',
    alignment:   'Alignment',
    consent:     'Consent',
  }
  const sub: Record<ConsentStep, string> = {
    exploration: 'Whisper',
    alignment:   'Pitch',
    consent:     'Post-Pitch',
  }
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: INK }}>{map[step]}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>{sub[step]}</div>
    </div>
  )
}

function SbHead({ step, status }: { step: ConsentStep; status: StepStatus }) {
  const bgMap: Record<StepStatus, string> = { done: GREEN_BG, active: AMBER_BG, pending: GRAY_BG }
  const colorMap: Record<StepStatus, string> = { done: GREEN, active: AMBER, pending: MUTED_D }
  const labelMap: Record<StepStatus, string> = { done: 'Complete', active: 'In progress', pending: 'Not yet assessed' }
  return (
    <div style={{
      padding: '11px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: BORDER, background: bgMap[status],
    }}>
      <StepLabel step={step} />
      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: colorMap[status] }}>
        {labelMap[status]}
      </span>
    </div>
  )
}

function EvidenceRows({ rows, onLink }: { rows: EvidenceRow[]; onLink: (target: 'debrief' | 'faq') => void }) {
  return (
    <div style={{ padding: '6px 14px 12px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 11, alignItems: 'flex-start',
          padding: '11px 0', borderTop: i > 0 ? BORDER : 'none',
          opacity: r.status === 'n' ? 0.7 : 1,
        }}>
          <TickIcon status={r.status} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.status === 'n' ? MUTED : INK, lineHeight: 1.35 }}>{r.question}</div>
            <div style={{ fontSize: 12, color: r.status === 'n' ? MUTED : 'rgba(26,31,78,0.75)', lineHeight: 1.5, marginTop: 4, fontStyle: r.status === 'n' ? 'italic' : 'normal' }}>
              {r.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientRow({ client, onLink }: { client: TrackerClient; onLink: (target: Page) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Main row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'grid',
          gridTemplateColumns: '2.1fr 1fr 1fr 1fr 1.6fr 40px',
          padding: '16px 22px',
          alignItems: 'center',
          borderBottom: BORDER,
          cursor: 'pointer',
          background: open ? '#fafbfc' : '#fff',
          transition: 'background 0.12s',
          gap: 8,
        }}
      >
        {/* Client info */}
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{client.name}</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{client.region} · {client.revenue} · Wave {client.wave}</div>
        </div>

        {/* 3 stage badge columns */}
        {client.stages.map(s => (
          <div key={s.step} style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge status={s.status} />
          </div>
        ))}

        {/* Current stage */}
        <div>
          <CurrentStagePill step={client.currentStep} />
        </div>

        {/* Chevron */}
        <div style={{ textAlign: 'center', color: MUTED, fontSize: 13, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none', userSelect: 'none' }}>▾</div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ background: '#fff', borderBottom: BORDER }}>
          <div style={{ padding: '6px 22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, paddingTop: 16 }}>
              {client.stages.map(s => (
                <div key={s.step} style={{ border: BORDER, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <SbHead step={s.step} status={s.status} />
                  <EvidenceRows
                    rows={s.evidence}
                    onLink={target => onLink(target === 'debrief' ? 'debrief' : 'faq')}
                  />
                </div>
              ))}
            </div>
            {/* Whisper Debrief button at bottom */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={e => { e.stopPropagation(); onLink('debrief') }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px',
                  background: 'rgba(26,31,78,0.06)', border: '1px solid rgba(26,31,78,0.12)',
                  borderRadius: 20, fontSize: 12, fontWeight: 700, color: INK,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                }}
              >
                <span style={{ fontSize: 13 }}>→</span>
                Whisper Conversation Debrief
                <span style={{ fontSize: 10, opacity: 0.6 }}>▸</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ConsentTrackerPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState('')

  const filtered = CLIENTS.filter(c =>
    !search.trim() || c.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Consent Tracker" />

      <div style={{ padding: '0 32px 56px' }}>

        {/* Page description */}
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 24 }}>
          This page tracks client progression through three stages — Exploration (Stages 1–2), Alignment (Stages 3–4), and Consent (Stage 5) — mapped directly to your Salesforce funnel. Each stage has three specific evidence criteria that serve as decision gates: when all three are confirmed, the client moves to the next phase. Click any client to view the evidence collected and understand exactly what criteria have been met at each stage.
        </p>

        {/* ── Single-box chevron stepper ───────────────────────────── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          background: '#fff',
          border: BORDER,
          borderRadius: 14,
          boxShadow: '0 1px 4px rgba(20,31,56,.08)',
          marginBottom: 28,
          overflow: 'hidden',
          minHeight: 220,
        }}>
          {STATS.map((s, i) => {
            const isLast = i === STATS.length - 1
            return (
              <div key={s.label} style={{
                flex: 1,
                padding: '22px 26px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Header row: stage label (colored uppercase) + tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ fontSize: 13, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600, color: s.countColor, whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: 'rgba(26,31,78,0.38)', textTransform: 'uppercase' }}>{s.tag}</div>
                </div>
                {/* Revenue + client count side by side */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 7 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: s.countColor, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.revenue}</div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: s.countColor, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.count}</div>
                </div>
                {/* Labels side by side */}
                <div style={{ display: 'flex', gap: 28, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)' }}>{s.revenueLabel}</div>
                  <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)' }}>clients · {s.region}</div>
                </div>
                {/* Rich description */}
                <div style={{ fontSize: 12, color: MUTED_D, lineHeight: 1.65, marginBottom: 14 }}>
                  {s.descriptionParts.map((part, pi) => (
                    part.bold
                      ? <strong key={pi} style={{ color: INK, fontWeight: 700 }}>{part.text}</strong>
                      : <span key={pi}>{part.text}</span>
                  ))}
                </div>
                {/* SF mapping */}
                <div style={{ fontSize: 11, color: MUTED, marginTop: 'auto' }}>
                  Maps to Salesforce <strong style={{ color: MUTED_D, fontWeight: 700 }}>{s.sfStages}</strong>
                </div>
              </div>
            )
          })}

          {/* Chevron dividers: absolutely positioned between each column */}
          {STATS.slice(0, -1).map((_, i) => {
            const pct = ((i + 1) / STATS.length) * 100
            const TIP = 18  // half-width of the arrow tip on each side
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(${pct}% - ${TIP}px)`,
                  top: 0,
                  bottom: 0,
                  width: TIP * 2,
                  zIndex: 10,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                <svg
                  width={TIP * 2}
                  height="100%"
                  viewBox={`0 0 ${TIP * 2} 100`}
                  preserveAspectRatio="none"
                  style={{ display: 'block', overflow: 'visible' }}
                >
                  {/* White fill to blank out the column seam behind the arrow */}
                  <polygon
                    points={`0,0 ${TIP * 2},0 ${TIP * 2},100 0,100`}
                    fill="white"
                  />
                  {/* Two lines forming the > chevron: top-left → mid-right → bottom-left */}
                  <polyline
                    points={`2,0 ${TIP * 2 - 2},50 2,100`}
                    fill="none"
                    stroke="#dde0e6"
                    strokeWidth="1"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            )
          })}
        </div>

        {/* ── Search bar ─────────────────────────────────────────────��� */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="rgba(26,31,78,0.35)" strokeWidth="1.5" />
              <path d="M10 10L14 14" stroke="rgba(26,31,78,0.35)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search client…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 32, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                fontSize: 13, border: BORDER, borderRadius: 10,
                outline: 'none', width: 320, color: INK,
                background: '#fff', fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: BORDER, boxShadow: '0 1px 3px rgba(20,31,56,.06)' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2.1fr 1fr 1fr 1fr 1.6fr 40px',
            background: INK, color: '#fff',
            padding: '13px 22px', gap: 8,
            fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, alignItems: 'center',
          }}>
            <div>Client</div>
            <div style={{ textAlign: 'center' }}>Exploration</div>
            <div style={{ textAlign: 'center' }}>Alignment</div>
            <div style={{ textAlign: 'center' }}>Consent</div>
            <div>Current Stage</div>
            <div />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 22px', textAlign: 'center', color: MUTED, fontSize: 13 }}>No clients match your search.</div>
          ) : (
            filtered.map(c => (
              <ClientRow key={c.id} client={c} onLink={p => onNavigate(p)} />
            ))
          )}
        </div>

        {/* ── Legend ────────────────────────────────────────────────── */}
        <div style={{ marginTop: 18, background: '#fff', borderRadius: 12, padding: '16px 22px', border: BORDER, boxShadow: '0 1px 3px rgba(20,31,56,.06)' }}>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { status: 'y' as const, label: 'Complete' },
              { status: 'q' as const, label: 'In progress' },
              { status: 'n' as const, label: 'Not yet assessed' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: MUTED_D }}>
                <TickIcon status={item.status} />
                {item.label}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: MUTED_D, lineHeight: 1.55, marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e5e8ed' }}>
            <strong style={{ color: INK }}>How to read this:</strong> Each step lists the evidence a client must show to move to the next one. A client counts as <strong style={{ color: INK }}>Consent</strong> once every Consent-step item is confirmed. The three steps map to the existing Salesforce funnel — Stage 1–2 → Exploration, Stage 3–4 → Alignment, Stage 5 → Consent.
          </div>
        </div>

      </div>
    </div>
  )
}
