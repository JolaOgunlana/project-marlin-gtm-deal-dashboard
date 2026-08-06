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
    count: 63,
    countColor: AMBER,
    revenue: '$141.5M',
    revenueLabel: 'Annual contract value',
    region: '2 NA · 1 EMEA',
    descriptionParts: [
      { text: 'The client is ', bold: false },
      { text: 'willing to engage, learn more, and evaluate', bold: true },
      { text: ' the opportunity.', bold: false },
    ],
    sfStages: 'Stage 1–2 · New Opportunity / Early Sales',
  },
  {
    label: 'Alignment',
    tag: 'PITCH',
    count: 1,
    countColor: '#1a6fa8',
    revenue: '$10.3M',
    revenueLabel: 'Annual contract value',
    region: '1 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'wants the specifics', bold: true },
      { text: ' — asking for pricing, commercial detail, and implementation plans, and willing to review a proposal.', bold: false },
    ],
    sfStages: 'Stage 3–4 · Late Sales / Pricing',
  },
  {
    label: 'Committed',
    tag: 'POST-PITCH',
    count: 0,
    countColor: GREEN,
    revenue: '$0M',
    revenueLabel: 'Annual contract value committed',
    region: '0 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'has decided to move forward', bold: true },
      { text: ' and begins execution — amendment discussions, redlines, and internal legal / risk / procurement.', bold: false },
    ],
    sfStages: 'Stage 5 · Contracting',
  },
  {
    label: 'Not Pursuing',
    tag: 'CLOSED',
    count: 0,
    countColor: '#c0392b',
    revenue: '$0M',
    revenueLabel: 'Annual contract value',
    region: '0 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'has declined to proceed', bold: true },
      { text: ' — either the client has formally rejected the proposal, or the opportunity has been disqualified.', bold: false },
    ],
    sfStages: 'Stage 8 · Disqualified',
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
    exploration:   { bg: GRAY_BG,    color: '#556070', label: 'Exploration' },
    alignment:     { bg: AMBER_BG,   color: AMBER,      label: 'Alignment' },
    consent:       { bg: GREEN_BG,   color: GREEN,       label: 'Committed' },
    committed:     { bg: GREEN_BG,   color: GREEN,       label: 'Committed' },
    'not-pursuing':{ bg: '#fad4ce',  color: '#c0392b',   label: 'Not Pursuing' },
    signed:        { bg: INK,        color: '#fff',      label: 'Signed' },
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
    consent:     'Committed',
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

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Consent Tracker" />

      <div style={{ padding: '0 32px 56px' }}>

        {/* Page description */}
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 24 }}>
          This page tracks client progression through four stages — Exploration (Stages 1–2), Alignment (Stages 3–4), Committed (Stage 5), and Not Pursuing — mapped directly to your Salesforce funnel. Each stage has three specific evidence criteria that serve as decision gates: when all three are confirmed, the client moves to the next phase. Click any client to view the evidence collected and understand exactly what criteria have been met at each stage.
        </p>

        {/* ── Stage definition cards — KpiSection style ────────────── */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e4ee',
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          marginBottom: 28,
          overflow: 'hidden',
        }}>
          {/* Section title bar */}
          {/* Title bar */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Consent stages</span>
          </div>

          {/* Color bar per stage */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: 5 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: s.countColor }} />
            ))}
          </div>

          {/* Four equal columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '18px 22px 22px',
                borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined,
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Stage label + tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.countColor }}>{s.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.35)' }}>{s.tag}</div>
                </div>

                {/* ACV + client count inline */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: s.countColor, lineHeight: 1 }}>{s.revenue}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: INK, lineHeight: 1 }}>{s.count}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: MUTED_D, lineHeight: 1 }}>{s.count === 1 ? 'client' : 'clients'}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED_D, marginBottom: 14 }}>{s.revenueLabel}</div>

                {/* Description */}
                <div style={{ fontSize: 13, color: MUTED_D, lineHeight: 1.6, marginBottom: 18, flex: 1 }}>
                  {s.descriptionParts.map((part, pi) => (
                    part.bold
                      ? <strong key={pi} style={{ color: INK, fontWeight: 700 }}>{part.text}</strong>
                      : <span key={pi}>{part.text}</span>
                  ))}
                </div>

                {/* SF mapping pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: 12, fontWeight: 500,
                  color: 'rgba(26,31,78,0.50)',
                  background: 'rgba(26,31,78,0.05)',
                  border: '1px solid rgba(26,31,78,0.10)',
                  borderRadius: 20,
                  padding: '5px 14px',
                  alignSelf: 'flex-start',
                  marginTop: 'auto',
                }}>
                  {s.sfStages}
                </div>
              </div>
            ))}
          </div>

          {/* Where the ACV actually sits */}
          <div style={{ borderTop: '1px solid #e2e4ee', padding: '20px 22px 24px' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Where the ACV actually sits</span>
            </div>

            {/* Bars */}
            {(() => {
              const maxAcv = 141.5
              const target = 25
              const targetPct = (target / maxAcv) * 100
              const bars = [
                { label: 'Exploration', color: INK,      acv: 141.5, clients: 63,  text: '$141.5M', empty: false },
                { label: 'Alignment',   color: '#1a6fa8', acv: 10.3,  clients: 1,   text: '$10.3M',  empty: false },
                { label: 'Committed',   color: '#16a34a', acv: 0,     clients: 0,   text: '',       empty: true  },
              ]
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
                  {bars.map((bar) => {
                    const widthPct = bar.acv > 0 ? Math.max((bar.acv / maxAcv) * 100, 8) : 0
                    return (
                      <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 80, textAlign: 'right', fontSize: 13, fontWeight: 700, color: bar.color, flexShrink: 0 }}>{bar.label}</div>
                        <div style={{ flex: 1, position: 'relative' }}>
                          {bar.empty ? (
                            <div style={{ height: 36, display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 13, color: MUTED_D, fontStyle: 'italic', border: '1px dashed rgba(26,31,78,0.18)', borderRadius: 6 }}>
                              $0M — no clients converted yet
                            </div>
                          ) : (
                            <div style={{ width: `${widthPct}%`, height: 36, background: bar.color, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{bar.text}</span>
                            </div>
                          )}
                          {/* $25M target line — label only on first bar */}
                          {bar.label === 'Exploration' && (
                            <div style={{ position: 'absolute', top: -20, left: `${targetPct}%`, transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#c0392b', whiteSpace: 'nowrap' }}>
                              ▼ $25M target
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${targetPct}%`, width: 1, borderLeft: '2px dashed #c0392b', pointerEvents: 'none' }} />
                        </div>
                      </div>
                    )
                  })}

                </div>
              )
            })()}
          </div>
        </div>

        {/* ── Program Coverage by Wave ──────────────────────────────── */}
        <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: 28, overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Program coverage by wave</span>
          </div>

          {/* Grid: label col + 3 wave cols + total col */}
          {(() => {
            const WAVE1_BG = 'rgba(99,82,168,0.06)'
            const cols = [
              { label: 'Wave 1', status: 'STARTED',     statusColor: '#2d7a0f', statusBg: '#e6f4dc', acv: 93.5,  acvPct: 64,  clients: 21, clientsPct: 33 },
              { label: 'Wave 2', status: 'NOT STARTED',  statusColor: '#556070', statusBg: '#eff0f3', acv: 18.7,  acvPct: 13,  clients: 27, clientsPct: 42 },
              { label: 'Wave 3', status: 'NOT STARTED',  statusColor: '#556070', statusBg: '#eff0f3', acv: 33.0,  acvPct: 23,  clients: 16, clientsPct: 25 },
            ]
            const totalAcv = '$145.2M'
            const totalClients = 64

            const ProgressBar = ({ pct, color }: { pct: number; color: string }) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1, height: 10, background: 'rgba(26,31,78,0.10)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,31,78,0.55)', minWidth: 28 }}>{pct}%</span>
              </div>
            )

            return (
              <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(3, 1fr) 120px' }}>

                {/* Header row */}
                <div style={{ padding: '12px 18px', borderBottom: '1px solid #e2e4ee' }} />
                {cols.map((c, i) => (
                  <div key={i} style={{ padding: '12px 22px', borderLeft: '1px solid #e2e4ee', borderBottom: '1px solid #e2e4ee', background: i === 0 ? WAVE1_BG : undefined, textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 6 }}>{c.label}</div>
                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: c.statusColor, background: c.statusBg, borderRadius: 99, padding: '3px 9px' }}>{c.status}</span>
                  </div>
                ))}
                <div style={{ padding: '12px 22px', borderLeft: '1px solid #e2e4ee', borderBottom: '1px solid #e2e4ee', textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 6 }}>TOTAL</div>
                  <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: INK, background: 'rgba(26,31,78,0.08)', borderRadius: 99, padding: '3px 9px' }}>WAVE 1–3</span>
                </div>

                {/* ACV row */}
                <div style={{ padding: '18px 18px', borderBottom: '1px solid #e2e4ee', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>ACV</span>
                </div>
                {cols.map((c, i) => (
                  <div key={i} style={{ padding: '14px 22px', borderLeft: '1px solid #e2e4ee', borderBottom: '1px solid #e2e4ee', background: i === 0 ? WAVE1_BG : undefined }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: INK, textAlign: 'right' }}>${c.acv.toFixed(1)}M</div>
                    <ProgressBar pct={c.acvPct} color={INK} />
                  </div>
                ))}
                <div style={{ padding: '14px 22px', borderLeft: '1px solid #e2e4ee', borderBottom: '1px solid #e2e4ee', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>{totalAcv}</span>
                </div>

                {/* Clients row */}
                <div style={{ padding: '18px 18px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>Clients</span>
                </div>
                {cols.map((c, i) => (
                  <div key={i} style={{ padding: '14px 22px', borderLeft: '1px solid #e2e4ee', background: i === 0 ? WAVE1_BG : undefined }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: INK, textAlign: 'right' }}>{c.clients}</div>
                    <ProgressBar pct={c.clientsPct} color={INK} />
                  </div>
                ))}
                <div style={{ padding: '14px 22px', borderLeft: '1px solid #e2e4ee', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>{totalClients}</span>
                </div>

              </div>
            )
          })()}
        </div>

        {/* ── Wave 1 Whisper Completion Status ──────────────────────── */}
        {(() => {
          const cols = [
            {
              label: 'Completed',
              date: null,
              barColor: '#2d7a0f',
              acv: '$53.7M',
              acvColor: '#2d7a0f',
              meta: '7 clients · 57% of ACV · 33% of clients',
              names: ['Virgin Money', 'Fifth Third Bank', 'UMB', 'AIB', 'Simmons Bank', "President's Choice", 'NatWest'],
              nameColor: '#2d7a0f',
            },
            {
              label: 'Whisper ETA',
              date: 'Aug 7',
              barColor: '#3d3270',
              acv: '$25.3M',
              acvColor: '#1a1f4e',
              meta: '4 clients · 27% of ACV · 19% of clients',
              names: ['Metro Bank', 'Lloyds', 'HSBC', 'First Bank Puerto Rico'],
              nameColor: '#3d3270',
            },
            {
              label: 'Whisper ETA',
              date: 'Aug 14',
              barColor: '#1a1f4e',
              acv: '$9.4M',
              acvColor: '#1a1f4e',
              meta: '2 clients · 10% of ACV · 10% of clients',
              names: ['UBS', 'Brim Financial'],
              nameColor: '#1a1f4e',
            },
            {
              label: 'No whisper planned',
              date: null,
              barColor: '#9aa0b0',
              acv: '$5.1M',
              acvColor: '#1a1f4e',
              meta: '8 clients · 6% of ACV · 38% of clients',
              names: ['Centene Corporation', 'ServisFirst', 'Union Bank', 'Citizens Bank', 'The Bank of Nova Scotia', 'Citibank', 'Empire Innovation Group', 'MotivHealth'],
              nameColor: '#9aa0b0',
            },
          ]

          return (
            <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: 20, overflow: 'hidden' }}>
              {/* Title bar */}
              <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: INK }}>Wave 1 whisper completion</span>
              </div>

              {/* Per-column top color bars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {cols.map((c, i) => (
                  <div key={i} style={{ height: 4, background: c.barColor, borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined }} />
                ))}
              </div>

              {/* Four columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {cols.map((col, i) => (
                  <div key={i} style={{ padding: '20px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, display: 'flex', flexDirection: 'column' }}>

                    {/* Label + date */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{col.label}</span>
                      {col.date && <span style={{ fontSize: 12, color: 'rgba(26,31,78,0.42)', fontWeight: 500 }}>{col.date}</span>}
                    </div>

                    {/* ACV */}
                    <div style={{ fontSize: 30, fontWeight: 800, color: col.acvColor, lineHeight: 1, marginBottom: 6 }}>{col.acv}</div>

                    {/* Meta line */}
                    <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.55)', marginBottom: 14, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700, color: INK }}>{col.meta.split(' · ')[0]}</span>
                      {' · ' + col.meta.split(' · ').slice(1).join(' · ')}
                    </div>

                    {/* Dashed divider */}
                    <div style={{ borderTop: '1px dashed #d4d7e3', marginBottom: 14 }} />

                    {/* Client name list */}
                    <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'disc', flex: 1 }}>
                      {col.names.map((name, ni) => (
                        <li key={ni} style={{ fontSize: 13, color: col.nameColor, marginBottom: 5, lineHeight: 1.5 }}>{name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Wave 1 Client Detail ────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: 28, overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Wave 1 client detail</span>
            <span style={{ fontSize: 12, color: 'rgba(26,31,78,0.42)', fontWeight: 500 }}>Sorted by ACV</span>
          </div>

          {/* 4 metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '18px 22px' }}>
            {/* Card 1: Wave 1 clients engaged */}
            <div style={{ background: '#fff', padding: '22px 20px', borderRadius: 10, border: '1px solid #e2e4ee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 8 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: '#2d7a0f', lineHeight: 1 }}>21</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#2d7a0f', lineHeight: 1 }}>($93.5M)</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(26,31,78,0.42)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>Wave 1 clients engaged</div>
            </div>

            {/* Card 2: In Wave 1 whisper scope */}
            <div style={{ background: '#fff', padding: '22px 20px', borderRadius: 10, border: '1px solid #e2e4ee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#2d7a0f', lineHeight: 1, marginBottom: 8 }}>13</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(26,31,78,0.42)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>In Wave 1 whisper scope (8 not planned)</div>
            </div>

            {/* Card 3: Of in-scope whisper ACV in Alignment */}
            <div style={{ background: '#fff', padding: '22px 20px', borderRadius: 10, border: '1px solid #e2e4ee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#2d7a0f', lineHeight: 1, marginBottom: 8 }}>11%</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(26,31,78,0.42)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>Of in-scope whisper ACV in alignment</div>
            </div>

            {/* Card 4: Avg propensity score */}
            <div style={{ background: '#fff', padding: '22px 20px', borderRadius: 10, border: '1px solid #e2e4ee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#2d7a0f', lineHeight: 1, marginBottom: 8 }}>93</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(26,31,78,0.42)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>Avg. propensity score (in-scope)</div>
            </div>
          </div>

          {/* Table */}
          <div style={{ marginTop: 0 }}>
          <div style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr', background: INK, color: '#fff', padding: '11px 20px', gap: 8, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, alignItems: 'center' }}>
              <div>Client Name</div>
              <div>ACV</div>
              <div style={{ textAlign: 'center' }}>Salesforce Stage</div>
              <div style={{ textAlign: 'center' }}>Rating Outsourcing</div>
              <div style={{ textAlign: 'center' }}>Rating Offshoring</div>
              <div style={{ textAlign: 'center' }}>Rating Digitization</div>
              <div style={{ textAlign: 'center' }}>Rating Price Maintain</div>
              <div style={{ textAlign: 'center' }}>Overall Propensity Score</div>
              <div style={{ textAlign: 'center' }}>Client Progress Status</div>
            </div>
            {/* Rows */}
            {[
              { name: 'Virgin Money',                   acv: '$26.2M', sfStage: '2', out: 'High',   off: 'Medium',            dig: 'High',   price: 'High',   score: 94,   status: 'Exploration' },
              { name: 'Fifth Third Bank',               acv: '$13.6M', sfStage: '2', out: 'High',   off: 'Medium',            dig: 'High',   price: 'Medium', score: 88,   status: 'Exploration' },
              { name: 'Metro Bank',                     acv: '$11.8M', sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'UMB',                            acv: '$9.9M',  sfStage: '3', out: 'High',   off: 'High',              dig: 'Medium', price: 'Medium', score: 88,   status: 'Alignment' },
              { name: 'Lloyds',                         acv: '$9.1M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'UBS Financial Services Inc.',    acv: '$8.3M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'Centene Corporation',            acv: '$3.5M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'HSBC Technology & Services (USA)', acv: '$2.9M', sfStage: '1', out: null,   off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'AIB',                            acv: '$1.8M',  sfStage: '2', out: 'High',   off: 'High',              dig: 'Medium', price: 'High',   score: 94,   status: 'Exploration' },
              { name: 'Simmons Bank',                   acv: '$1.6M',  sfStage: '2', out: 'High',   off: 'High',              dig: 'High',   price: 'Medium', score: 94,   status: 'Exploration' },
              { name: 'First Bank Puerto Rico',         acv: '$1.6M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'Brim Financial',                 acv: '$1.1M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'Exploration' },
              { name: 'ServisFirst',                    acv: '$0.6M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: "President's Choice",             acv: '$0.5M',  sfStage: '1', out: 'High',   off: 'High',              dig: 'High',   price: 'High',   score: 100,  status: 'Exploration' },
              { name: 'Union Bank (MUFG)',               acv: '$0.3M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'Citizens Bank',                  acv: '$0.3M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'The Bank Of Nova Scotia',        acv: '$0.2M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'Citibank',                       acv: '$0.1M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'NatWest',                        acv: '$0.0M',  sfStage: '1', out: 'High',   off: 'High (n/a)',        dig: 'Medium', price: 'High',   score: 94,   status: 'Exploration' },
              { name: 'Empire Innovation Group',        acv: '$0.0M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
              { name: 'MotivHealth',                    acv: '$0.0M',  sfStage: '1', out: null,     off: null,                dig: null,     price: null,     score: null, status: 'No Whisper' },
            ].map((row, i) => {
              const isAlt = i % 2 === 1
              const ratingChip = (val: string | null) => {
                if (!val) return <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>
                const isHigh = val.toLowerCase().startsWith('high')
                const isMed  = val.toLowerCase().startsWith('med')
                const bg   = isHigh ? '#d8f3d8' : isMed ? '#fdf1c9' : '#fde0e0'
                const col  = isHigh ? '#1a6e1a' : isMed ? '#8a6a00' : '#a01020'
                const dot  = isHigh ? '#2e9e2e' : isMed ? '#e8a800' : '#d0021b'
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', borderRadius: 7, background: bg, color: col, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', border: '1.5px solid transparent' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                    {val}
                  </span>
                )
              }
              const statusChip = (s: string) => {
                const col = s === 'Alignment' ? '#1a6fa8' : s === 'Exploration' ? AMBER : MUTED
                const bg  = s === 'Alignment' ? '#dceefa' : s === 'Exploration' ? AMBER_BG : GRAY_BG
                return <span style={{ background: bg, color: col, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{s}</span>
              }
              return (
                <div key={row.name} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr', padding: '10px 20px', gap: 8, fontSize: 12.5, alignItems: 'center', background: isAlt ? '#fafbfc' : '#fff', borderBottom: BORDER }}>
                  <div style={{ fontWeight: 600, color: INK }}>{row.name}</div>
                  <div style={{ fontWeight: 700, color: INK }}>{row.acv}</div>
                  <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#1a1f4e' }}>Stage {row.sfStage}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.out)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.off)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.dig)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.price)}</div>
                  <div style={{ textAlign: 'center' }}>{row.score != null ? <span style={{ fontSize: 16, fontWeight: 900, color: '#2d7a0f' }}>{row.score}</span> : <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>}</div>
                  <div style={{ textAlign: 'center' }}>{statusChip(row.status)}</div>
                </div>
              )
            })}
          </div>
          </div>
          </div>
        </div>

        {/* ── Search bar ────────────────────────────────────────────── */}


      </div>
    </div>
  )
}
