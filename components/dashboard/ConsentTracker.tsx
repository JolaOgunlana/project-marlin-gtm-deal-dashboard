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
    countColor: AMBER,
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
    countColor: '#1a6fa8',
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
      { text: ' and begins execution — amendment discussions, redlines, and internal legal / risk / procurement. The conversation has crossed from evaluation into execution.', bold: false },
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
      { text: ' — either the client has formally rejected the proposal, or the opportunity has been disqualified. No further pursuit is planned at this time.', bold: false },
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
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Consent Stages</span>
          </div>

          {/* Four equal columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => {
              return (
                <div key={s.label} style={{
                  padding: '18px 22px 20px',
                  borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Stage label + tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: s.countColor,
                    }}>{s.label}</div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: 'rgba(26,31,78,0.38)',
                    }}>{s.tag}</div>
                  </div>
                  {/* Description */}
                  <div style={{ fontSize: 12, color: MUTED_D, lineHeight: 1.65, marginBottom: 14, flex: 1 }}>
                    {s.descriptionParts.map((part, pi) => (
                      part.bold
                        ? <strong key={pi} style={{ color: INK, fontWeight: 700 }}>{part.text}</strong>
                        : <span key={pi}>{part.text}</span>
                    ))}
                  </div>
                  {/* SF mapping pill */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: 'rgba(26,31,78,0.45)',
                    background: 'rgba(26,31,78,0.05)',
                    border: '1px solid rgba(26,31,78,0.10)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                    letterSpacing: '0.01em',
                  }}>
                    {s.sfStages}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Program Coverage by Wave ──────────────────────────────── */}
        <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: 28, overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Program Coverage by Wave</span>
          </div>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { label: 'Total', sub: null },
              { label: 'Wave 1', sub: 'Started' },
              { label: '% of Total', sub: null },
              { label: 'Wave 2', sub: 'Not started' },
              { label: '% of Total', sub: null },
              { label: 'Wave 3', sub: 'Not started' },
              { label: '% of Total', sub: null },
              { label: 'Total Wave 1–3', sub: null },
            ].map((col, i) => (
              <div key={i} style={{ padding: '10px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.42)', lineHeight: 1.3 }}>{col.label}</div>
                {col.sub && <div style={{ fontSize: 11, color: 'rgba(26,31,78,0.38)', marginTop: 1 }}>{col.sub}</div>}
              </div>
            ))}
          </div>
          {/* ACV row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { val: 'ACV $', bold: true, muted: false },
              { val: '$93.5M', bold: true, muted: false },
              { val: '64%', bold: false, muted: false },
              { val: '$18.7M', bold: true, muted: false },
              { val: '13%', bold: false, muted: false },
              { val: '$33.0M', bold: true, muted: false },
              { val: '23%', bold: false, muted: false },
              { val: '$145.2M', bold: true, muted: false },
            ].map((cell, i) => (
              <div key={i} style={{ padding: '14px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, fontSize: cell.bold ? 22 : 14, fontWeight: cell.bold ? 800 : 400, color: cell.muted ? 'rgba(26,31,78,0.42)' : INK, lineHeight: 1 }}>
                {cell.val}
              </div>
            ))}
          </div>
          {/* Clients row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { val: 'Clients #', bold: true, muted: false },
              { val: '21', bold: true, muted: false },
              { val: '33%', bold: false, muted: false },
              { val: '27', bold: true, muted: false },
              { val: '42%', bold: false, muted: false },
              { val: '16', bold: true, muted: false },
              { val: '25%', bold: false, muted: false },
              { val: '64 Clients', bold: true, muted: false },
            ].map((cell, i) => (
              <div key={i} style={{ padding: '14px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, fontSize: cell.bold ? 22 : 14, fontWeight: cell.bold ? 800 : 400, color: cell.muted ? 'rgba(26,31,78,0.42)' : INK, lineHeight: 1, background: '#fafbfc' }}>
                {cell.val}
              </div>
            ))}
          </div>
        </div>

        {/* ── Wave 1 Whisper Completion Status ──────────────────────── */}
        <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: 20, overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Wave 1 Whisper Completion Status</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(26,31,78,0.42)' }}>21 Clients · 13 in Scope</span>
          </div>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { label: 'Wave 1', sub: null },
              { label: 'Whisper Completed', sub: null },
              { label: '% Total', sub: null },
              { label: 'Whisper ETA', sub: '8/7' },
              { label: '% Total', sub: null },
              { label: 'Whisper ETA', sub: '8/14' },
              { label: '% Total', sub: null },
              { label: 'No Whisper Planned', sub: null },
              { label: '% Total', sub: null },
              { label: 'Total Wave 1', sub: null },
            ].map((col, i) => (
              <div key={i} style={{ padding: '10px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.42)', lineHeight: 1.3 }}>{col.label}</div>
                {col.sub && <div style={{ fontSize: 11, color: 'rgba(26,31,78,0.38)', marginTop: 1 }}>{col.sub}</div>}
              </div>
            ))}
          </div>
          {/* ACV row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { val: 'ACV $', bold: true, muted: false },
              { val: '$53.7M', bold: true, muted: false },
              { val: '57%', bold: false, muted: false },
              { val: '$25.3M', bold: true, muted: false },
              { val: '27%', bold: false, muted: false },
              { val: '$9.4M', bold: true, muted: false },
              { val: '10%', bold: false, muted: false },
              { val: '$5.1M', bold: true, muted: false },
              { val: '6%', bold: false, muted: false },
              { val: '$93.5M', bold: true, muted: false },
            ].map((cell, i) => (
              <div key={i} style={{ padding: '14px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, fontSize: cell.bold ? 22 : 14, fontWeight: cell.bold ? 800 : 400, color: cell.muted ? 'rgba(26,31,78,0.42)' : INK, lineHeight: 1 }}>
                {cell.val}
              </div>
            ))}
          </div>
          {/* Clients row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { val: 'Clients #', bold: true, muted: false },
              { val: '7', bold: true, muted: false },
              { val: '33%', bold: false, muted: false },
              { val: '4', bold: true, muted: false },
              { val: '19%', bold: false, muted: false },
              { val: '2', bold: true, muted: false },
              { val: '10%', bold: false, muted: false },
              { val: '8', bold: true, muted: false },
              { val: '38%', bold: false, muted: false },
              { val: '21 Clients', bold: true, muted: false },
            ].map((cell, i) => (
              <div key={i} style={{ padding: '14px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, fontSize: cell.bold ? 22 : 14, fontWeight: cell.bold ? 800 : 400, color: cell.muted ? 'rgba(26,31,78,0.42)' : INK, lineHeight: 1, background: '#fafbfc' }}>
                {cell.val}
              </div>
            ))}
          </div>
          {/* Client names row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr' }}>
            {[
              { names: null, bold: true },
              { names: ['Virgin Money', 'Fifth Third Bank', 'UMB', 'AIB', 'Simmons Bank', 'President\'s Choice', 'NatWest'], bold: false },
              { names: null, bold: false },
              { names: ['Metro Bank', 'Lloyds', 'HSBC', 'First Bank Puerto Rico'], bold: false },
              { names: null, bold: false },
              { names: ['UBS', 'Brim Financial'], bold: false },
              { names: null, bold: false },
              { names: ['Centene Corporation', 'ServisFirst', 'Union Bank', 'Citizens Bank', 'The Bank of Nova Scotia', 'Citibank', 'Empire Innovation Group', 'MotivHealth'], bold: false },
              { names: null, bold: false },
              { names: null, bold: false },
            ].map((cell, i) => (
              <div key={i} style={{ padding: '14px 22px', borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined, fontSize: 12, fontWeight: cell.bold ? 700 : 400, color: INK, lineHeight: 1.6 }}>
                {i === 0 ? 'Client Names' : cell.names ? (
                  <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
                    {cell.names.map((name, ni) => (
                      <li key={ni} style={{ marginBottom: 4, color: INK }}>{name}</li>
                    ))}
                  </ul>
                ) : '–'}
              </div>
            ))}
          </div>
        </div>

        {/* ── Wave 1 Client Detail Table ────────────────────────────── */}
        <div style={{ marginTop: 32, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: INK, marginBottom: 10 }}>
            Wave 1 Client Detail
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: BORDER, boxShadow: '0 1px 3px rgba(20,31,56,.06)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr', background: INK, color: '#fff', padding: '11px 20px', gap: 8, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, alignItems: 'center' }}>
              <div>Client Name</div>
              <div>ACV $</div>
              <div style={{ textAlign: 'center' }}>Rating Outsourcing</div>
              <div style={{ textAlign: 'center' }}>Rating Offshoring</div>
              <div style={{ textAlign: 'center' }}>Rating Digitization</div>
              <div style={{ textAlign: 'center' }}>Rating Price Maintain</div>
              <div style={{ textAlign: 'center' }}>Overall Propensity Score</div>
              <div style={{ textAlign: 'center' }}>Client Progress Status</div>
            </div>
            {/* Rows */}
            {[
              { name: 'Virgin Money',                   acv: '$26.23M', out: 'High',   off: 'Med',         dig: 'High', price: 'High', score: 94,  status: 'Exploration' },
              { name: 'Fifth Third Bank',               acv: '$13.56M', out: 'High',   off: 'Med',         dig: 'High', price: 'Med',  score: 88,  status: 'Exploration' },
              { name: 'Metro Bank',                     acv: '$11.79M', out: null,     off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'UMB',                            acv: '$9.91M',  out: 'High',   off: 'High',        dig: 'Med',  price: 'Med',  score: 88,  status: 'Alignment' },
              { name: 'Lloyds',                         acv: '$9.10M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'UBS Financial Services Inc.',    acv: '$8.33M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'Centene Corporation',            acv: '$3.49M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'HSBC Technology & Services (USA)', acv: '$2.88M', out: null,   off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'AIB',                            acv: '$1.83M',  out: 'High',   off: 'High',        dig: 'Med',  price: 'High', score: 94,  status: 'Exploration' },
              { name: 'Simmons Bank',                   acv: '$1.63M',  out: 'High',   off: 'High',        dig: 'High', price: 'Med',  score: 94,  status: 'Exploration' },
              { name: 'First Bank Puerto Rico',         acv: '$1.61M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'Brim Financial',                 acv: '$1.06M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'Exploration' },
              { name: 'ServisFirst',                    acv: '$0.56M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: "President's Choice",             acv: '$0.47M',  out: 'High',   off: 'High',        dig: 'High', price: 'High', score: 100, status: 'Exploration' },
              { name: 'Union Bank (MUFG)',               acv: '$0.33M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'Citizens Bank',                  acv: '$0.33M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'The Bank Of Nova Scotia',        acv: '$0.23M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'Citibank',                       acv: '$0.11M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'NatWest',                        acv: '$0.03M',  out: 'High',   off: 'High (n/a)',  dig: 'Med',  price: 'High', score: 94,  status: 'Exploration' },
              { name: 'Empire Innovation Group',        acv: '$0.03M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
              { name: 'MotivHealth',                    acv: '$0.01M',  out: null,     off: null,          dig: null,   price: null,   score: null, status: 'No Whisper' },
            ].map((row, i) => {
              const isAlt = i % 2 === 1
              const ratingChip = (val: string | null) => {
                if (!val) return <span style={{ color: MUTED, fontSize: 16, lineHeight: 1 }}>—</span>
                const isHigh = val.toLowerCase().startsWith('high')
                const isMed  = val.toLowerCase().startsWith('med')
                const bg  = isHigh ? GREEN_BG  : isMed ? AMBER_BG  : GRAY_BG
                const col = isHigh ? GREEN      : isMed ? AMBER      : GRAY
                return <span style={{ background: bg, color: col, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{val}</span>
              }
              const statusChip = (s: string) => {
                const col = s === 'Alignment' ? '#1a6fa8' : s === 'Exploration' ? AMBER : MUTED
                const bg  = s === 'Alignment' ? '#dceefa' : s === 'Exploration' ? AMBER_BG : GRAY_BG
                return <span style={{ background: bg, color: col, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{s}</span>
              }
              return (
                <div key={row.name} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr', padding: '10px 20px', gap: 8, fontSize: 12.5, alignItems: 'center', background: isAlt ? '#fafbfc' : '#fff', borderBottom: BORDER }}>
                  <div style={{ fontWeight: 600, color: INK }}>{row.name}</div>
                  <div style={{ color: MUTED_D }}>{row.acv}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.out)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.off)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.dig)}</div>
                  <div style={{ textAlign: 'center' }}>{ratingChip(row.price)}</div>
                  <div style={{ textAlign: 'center', fontWeight: 700, color: INK }}>{row.score ?? <span style={{ color: MUTED, fontSize: 16 }}>—</span>}</div>
                  <div style={{ textAlign: 'center' }}>{statusChip(row.status)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Search bar ────────────────────────────────────────────── */}


      </div>
    </div>
  )
}
