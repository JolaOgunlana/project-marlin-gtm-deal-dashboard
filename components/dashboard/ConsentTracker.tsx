'use client'

import { useState } from 'react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faq' | 'dashboard' | 'consent' | 'tracker'

// ── Constants ──────────────────────────────────────────────────────────────────
const INK   = '#1a1f4e'
const MUTED = 'rgba(26,31,78,0.50)'
const MUTED_D = 'rgba(26,31,78,0.65)'
const BORDER = '1px solid #e5e8ed'
const GREEN  = '#2E7D46'
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
const CLIENTS: TrackerClient[] = [
  {
    id: 'db',
    name: 'Deutsche Bank',
    region: 'EMEA',
    revenue: '$17.2M',
    wave: 1,
    currentStep: 'alignment',
    sfStage: 'Stage 4 · Late Sales / Pricing',
    stages: [
      {
        step: 'exploration',
        status: 'done',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Senior-to-senior whisper held with the Head of Card Services, who confirmed the account is open to evaluating the new model and agreed to a follow-up pitch.', date: '19 May 2026', link: 'debrief' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested our compliance certifications and a full list of global service locations, and asked us to send them ahead of the formal pitch.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Nominated an internal champion to coordinate next steps and proactively scheduled the pitch session — momentum is coming from their side.' },
        ],
      },
      {
        step: 'alignment',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Has the client requested pricing or commercial detail?', answer: 'Yes. Following the pitch, the client asked for the full pricing model with margin transparency and a breakdown of fees by service line — a clear move from interest into serious evaluation.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed — no request for phasing, cutover, or migration detail has been logged. To be captured at the next pitch-debrief.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed — client has not yet committed to reviewing a draft proposal or amendment. This is the key item that signals readiness to move into Consent.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed — Consent criteria are only evaluated once the client is confirmed in Alignment. Amendment discussions have not been opened.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed — no draft has been exchanged, so there are no redlines in progress with the client\'s legal team.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed — the client has not yet engaged their internal risk, legal, or procurement functions, which is the strongest signal a client has truly consented and moved into execution.' },
        ],
      },
    ],
  },
  {
    id: 'wb',
    name: 'Wells Fargo',
    region: 'NA',
    revenue: '$22.5M',
    wave: 1,
    currentStep: 'consent',
    sfStage: 'Stage 5 · Contracting',
    stages: [
      {
        step: 'exploration',
        status: 'done',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Senior-to-senior whisper held with EVP of Operations. Client confirmed openness to evaluating the transition model.', date: '12 Apr 2026', link: 'debrief' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested SLA benchmarks and offshore delivery track record ahead of the pitch.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Assigned a dedicated workstream lead and joined all scheduled follow-up calls.' },
        ],
      },
      {
        step: 'alignment',
        status: 'done',
        evidence: [
          { status: 'y', question: 'Has the client requested pricing or commercial detail?', answer: 'Yes. Full commercial model reviewed with CFO and procurement in a dedicated pricing session.' },
          { status: 'y', question: 'Has the client requested implementation specifics?', answer: 'Yes. Detailed phasing plan and cutover schedule presented and acknowledged.' },
          { status: 'y', question: 'Is the client willing to review a proposal and amendment?', answer: 'Yes. Draft proposal reviewed and internal legal notified to expect a redline.' },
        ],
      },
      {
        step: 'consent',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Is the client willing to begin amendment discussions?', answer: 'Yes. Amendment kickoff call completed with in-house counsel and FIS legal.' },
          { status: 'q', question: 'Have redlines or contract negotiations started?', answer: 'In progress — first redline returned by client legal on 14 Jul 2026. FIS legal reviewing.', date: '14 Jul 2026' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet confirmed — risk committee review is scheduled for next week pending legal sign-off.' },
        ],
      },
    ],
  },
  {
    id: 'citi',
    name: 'Citibank',
    region: 'NA',
    revenue: '$14.8M',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 2 · Early Sales',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Initial whisper held with SVP Operations. Client expressed cautious interest and asked for a structured follow-up.', date: '3 Jun 2026', link: 'debrief' },
          { status: 'q', question: 'Did the client request additional information?', answer: 'In progress — client requested a capability overview deck. Document being prepared by solutions team.' },
          { status: 'n', question: 'Has the client remained engaged in the process?', answer: 'Not yet confirmed — follow-up meeting not yet scheduled. Outreach pending from account team.' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed — client is still in Exploration. Pricing conversation cannot begin until Alignment criteria are met.' },
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
  { label: 'Exploration', count: 28, color: GRAY },
  { label: 'Alignment',   count: 22, color: AMBER },
  { label: 'Consent',     count: 13, color: GREEN,  sub: '$40M in revenue represented' },
  { label: 'Total Clients', count: 63, color: INK },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
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
              {r.status !== 'n' && <span style={{ fontWeight: 700, color: GREEN, marginRight: 4 }}>Yes.</span>}
              {r.answer}
            </div>
            {r.date && (
              <div style={{ fontSize: 10.5, color: MUTED, marginTop: 5, display: 'flex', gap: 12 }}>
                <span><span style={{ fontWeight: 700, color: MUTED_D, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 9.5 }}>Date</span> {r.date}</span>
              </div>
            )}
            {r.link && (
              <button
                onClick={e => { e.stopPropagation(); onLink(r.link!) }}
                style={{
                  marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 11px 5px 9px',
                  background: 'rgba(26,31,78,0.06)', border: '1px solid rgba(26,31,78,0.12)',
                  borderRadius: 20, fontSize: 11, fontWeight: 700, color: INK,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                }}
              >
                <span style={{ fontSize: 12 }}>→</span>
                {r.link === 'debrief' ? 'Whisper Conversation Debrief' : 'FAQ / Objection Handling'}
                <span style={{ fontSize: 9, opacity: 0.6 }}>▸</span>
              </button>
            )}
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
          <div style={{ fontSize: 10.5, color: MUTED, marginTop: 4 }}>
            Salesforce <span style={{ fontWeight: 700, color: MUTED_D }}>{client.sfStage}</span>
          </div>
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
          Blake&apos;s three steps — Exploration, Alignment, Consent — mapped onto our existing Salesforce funnel. Nothing changes in how the sales team already works; these are simply the criteria that must be true to move a client from one step to the next. Click a client to reveal the evidence recorded at each step.
        </p>

        {/* ── Stat cards ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 14, padding: '22px 24px 20px',
              border: BORDER, boxShadow: '0 1px 3px rgba(20,31,56,.06)',
            }}>
              <div style={{ fontSize: 11.5, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, color: MUTED, marginBottom: 14 }}>{s.label}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: s.color, letterSpacing: '-0.01em', lineHeight: 1 }}>{s.count}</div>
              {s.sub && <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTED_D, marginTop: 9 }}><span style={{ color: GREEN, fontWeight: 800 }}>{s.sub.split(' in ')[0]}</span>{' in ' + s.sub.split(' in ')[1]}</div>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: MUTED, fontStyle: 'italic', marginBottom: 22, marginTop: -12 }}>
          Counts shown are illustrative, for layout only — to be replaced with live figures once the Salesforce feed is mapped.
        </p>

        {/* ── Journey band ──────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 22,
          background: '#fff', border: BORDER, borderRadius: 12,
          padding: 6, boxShadow: '0 1px 3px rgba(20,31,56,.06)',
        }}>
          {[
            { num: '1', title: 'Exploration', map: 'Salesforce Stage 1–2 · New Opportunity / Early Sales', numBg: GRAY },
            { num: '2', title: 'Alignment',   map: 'Salesforce Stage 3–4 · Late Sales / Pricing',          numBg: AMBER },
            { num: '3', title: 'Consent',     map: 'Salesforce Stage 5 · Contracting',                     numBg: GREEN },
          ].reduce<React.ReactNode[]>((acc, step, i) => {
            if (i > 0) acc.push(
              <div key={`arrow-${i}`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, color: GRAY, fontSize: 20 }}>→</div>
            )
            acc.push(
              <div key={step.title} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderRadius: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: step.numBg }}>{step.num}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>{step.title}</div>
                  <div style={{ fontSize: 10.5, color: MUTED_D, marginTop: 2, letterSpacing: '0.02em' }}>
                    {step.map.replace(/Stage \S+/, m => '')}
                    <strong style={{ color: INK }}>{step.map.match(/Stage \S+[^·]*/)?.[0]?.trim()}</strong>
                    {step.map.includes('·') ? ' · ' + step.map.split('·').slice(1).join('·').trim() : ''}
                  </div>
                </div>
              </div>
            )
            return acc
          }, [])}
        </div>

        {/* ── Explainer cards ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          {[
            { step: 'Exploration', tag: 'Whisper',    color: GRAY,  desc: <>The client is <strong>willing to engage, learn more, and evaluate</strong> the opportunity. Senior-to-senior whisper conversations open the door before any formal pitch — the client is listening, not yet committing.</>, crumb: 'Stage 1–2 · New Opportunity / Early Sales' },
            { step: 'Alignment',   tag: 'Pitch',      color: AMBER, desc: <>The client <strong>wants the specifics</strong> — asking for pricing, commercial detail, and implementation plans, and willing to review a proposal. Interest has become intent to evaluate seriously.</>, crumb: 'Stage 3–4 · Late Sales / Pricing' },
            { step: 'Consent',     tag: 'Post-Pitch', color: GREEN, desc: <>The client <strong>has decided to move forward</strong> and begins execution — amendment discussions, redlines, and internal legal / risk / procurement. The conversation has crossed from evaluation into execution.</>, crumb: 'Stage 5 · Contracting' },
          ].map(c => (
            <div key={c.step} style={{
              background: '#fff', border: BORDER, borderRadius: 11,
              padding: '16px 18px 17px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: c.color, borderRadius: '11px 0 0 11px' }} />
              <div style={{ marginLeft: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: INK }}>{c.step}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: MUTED }}>{c.tag}</span>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: MUTED_D, margin: '0 0 10px' }}>{c.desc}</p>
                <div style={{ fontSize: 10.5, color: MUTED, borderTop: '1px dashed #e5e8ed', paddingTop: 9, lineHeight: 1.4 }}>
                  Maps to Salesforce <strong style={{ color: INK }}>{c.crumb}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search bar ────────────────────────────────────────────── */}
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
              { status: 'y' as const, label: 'Evidence confirmed' },
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
            <strong style={{ color: INK }}>How to read this:</strong> Each step lists the evidence a client must show to move to the next one. A client counts as <strong style={{ color: INK }}>Consent</strong> once every Consent-step item is confirmed. The three steps map to the existing Salesforce funnel — Stage 1–2 → Exploration, Stage 3–4 → Alignment, Stage 5 → Consent — so the sales team keeps tracking exactly as they do today while leadership sees the simplified three-step view.
          </div>
        </div>

      </div>
    </div>
  )
}
