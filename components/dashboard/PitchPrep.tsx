'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { clients, type ClientRow } from '@/lib/data'

// ── localStorage persistence ──────────────────────────────────────────────────
const STORAGE_KEY = 'pitchPrep.v1'

function loadPersisted(): {
  statuses?: Record<string, StepStatus[]>
  pitchDates?: Record<string, string>
  dateOverrides?: Record<string, Record<number, string>>
} {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ── Shared style tokens (match ActionTracker) ─────────────────────────────────
const INK = '#1a1f4e'
const GREEN = '#4bcd3e'
const GREEN_LINE = '#57c94a'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'

// ============================================================
// Pitch preparation sequence. Each step carries the offset (in
// days BEFORE the pitch) used to back-calculate its due date
// from a client's scheduled pitch date.
// ============================================================
type StepStatus = 'Completed' | 'In Progress' | 'Not Started' | 'Not Applicable'

type PitchStep = {
  n: number | 'pitch'
  title: string
  detail: string
  owner: string
  offsetDays: number // days before the pitch date
  timing?: string    // annotation shown above the node
}

const STEPS: PitchStep[] = [
  { n: 1, title: 'Whisper conversation',      detail: 'Informal exec-to-exec signal; gauge appetite — no formal pitch yet.', owner: 'Exec sponsor', offsetDays: 43 },
  { n: 2, title: 'Whisper debrief',           detail: 'Sales Manager shares update & readout from the whisper conversation.', owner: 'Sales Manager', offsetDays: 42, timing: '~1 day' },
  { n: 3, title: 'Schedule pitch date',       detail: 'Lock the client pitch date & start preparation — the prep clock starts here.', owner: 'Sales Manager', offsetDays: 40 },
  { n: 4, title: 'Assemble pitch team',       detail: 'Confirm US / EMEA reps & executives.', owner: 'US: Mike · EMEA: Nathalie, TBD · CSM: Laura, Blake, Simon, Ashley', offsetDays: 35 },
  { n: 5, title: 'Create tailored pitch deck',detail: 'Client-specific deck & narrative.', owner: 'Elizabeth & Ivan (PwC)', offsetDays: 28, timing: '2–6 weeks' },
  { n: 6, title: 'Prep pricing / commercials',detail: 'Align the pricing construct & commercials.', owner: 'Sales Pitch lead, Stephen, Elizabeth / Eric (PwC)', offsetDays: 18, timing: '2–3 weeks prior' },
  { n: 7, title: 'Prep tech & implementation',detail: 'Tech stack & implementation implications tailored to the client.', owner: 'Sales Pitch lead, Genpact rep, Operations Director, Laura, PwC', offsetDays: 10, timing: '1 week prior' },
  { n: 8, title: 'Pitch dry-run',             detail: 'Full pitch rehearsal — refine roles & hand-offs.', owner: 'Full Pitch Team', offsetDays: 6 },
  { n: 'pitch', title: 'Pitch',               detail: 'Deliver the pitch to the client.', owner: 'Full Pitch Team', offsetDays: 0 },
]

// First green node is index 4 (step 5). The connector transitions to green
// at the midpoint between step 4 and step 5.
const FIRST_GREEN = 4

// ── Clients with a scheduled pitch date ───────────────────────────────────────
type ClientPitch = {
  name: string
  pitchDate: string // ISO yyyy-mm-dd — the scheduled pitch date
  statuses: StepStatus[] // one per STEP, aligned by index
}

const N = STEPS.length

// Status shorthands for the per-step matrix below.
const C: StepStatus = 'Completed'
const P: StepStatus = 'In Progress'
const S: StepStatus = 'Not Started'
const NA: StepStatus = 'Not Applicable'

// statuses align to STEPS by index: [step1..step8, pitch]
const CLIENTS: ClientPitch[] = [
    { name: 'HSBC',            pitchDate: '2026-09-21', statuses: [C, C, C, C, C, C, NA, NA, C] },
    { name: 'Virgin Money',    pitchDate: '2026-10-05', statuses: [C, C, C, C, P, P, P, P, P] },
    { name: 'Metro Bank',      pitchDate: '2026-09-10', statuses: [C, C, C, C, C, C, NA, C, C] },
    { name: 'Fifth Third Bank',pitchDate: '2026-09-24', statuses: [C, C, C, C, C, C, C, P, C] },
    { name: 'Lloyds',          pitchDate: '2026-09-15', statuses: [C, C, C, C, C, C, NA, C, C] },
    { name: 'Deutsche Bank',   pitchDate: '2026-10-21', statuses: [C, C, C, C, P, S, S, S, S] },
    { name: 'Union Bank MUFG', pitchDate: '2026-09-29', statuses: [C, C, C, C, P, S, S, S, S] },
]

// ── Merged client universe (scheduled prep rows + full master list) ───────────
// The filter categories operate on the full master client list from lib/data.
// Scheduled clients keep their real pitch dates & step statuses; every other
// master client is shown as unscheduled (no pitch date, all steps Not Started).
type MatrixClient = {
  name: string
  wave: '1' | '2' | '3'
  isPrime: boolean
  scheduled: boolean
  pitchDate: string // '' when unscheduled
  statuses: StepStatus[]
}

// Normalize names so "HSBC" matches "HSBC (Global)" and "Deutsche Bank" matches
// "Deutsche Bank (Hamburg)" when overlaying master wave/prime attributes.
const normName = (s: string) => s.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim()

const notStarted = (): StepStatus[] => Array.from({ length: N }, () => 'Not Started')

function buildUniverse(): MatrixClient[] {
  const masterByNorm = new Map<string, ClientRow>()
  for (const c of clients) {
    const k = normName(c.name)
    if (!masterByNorm.has(k)) masterByNorm.set(k, c)
  }
  const scheduledNorms = new Set(CLIENTS.map(c => normName(c.name)))

  const scheduled: MatrixClient[] = CLIENTS.map(c => {
    const m = masterByNorm.get(normName(c.name))
    return {
      name: c.name,
      wave: m?.wave ?? '1',
      isPrime: m?.isPrime ?? false,
      scheduled: true,
      pitchDate: c.pitchDate,
      statuses: [...c.statuses],
    }
  })

  const unscheduled: MatrixClient[] = clients
    .filter(c => !scheduledNorms.has(normName(c.name)))
    .map(c => ({
      name: c.name,
      wave: c.wave,
      isPrime: !!c.isPrime,
      scheduled: false,
      pitchDate: '',
      statuses: notStarted(),
    }))

  return [...scheduled, ...unscheduled]
}

const UNIVERSE: MatrixClient[] = buildUniverse()

type CatKey = 'wave1' | 'wave2' | 'prime' | 'scheduled'
  const CATEGORIES: { key: CatKey; label: string }[] = [
  { key: 'wave1', label: 'Wave 1 clients' },
  { key: 'wave2', label: 'Wave 2' },
  { key: 'prime', label: 'Prime Clients' },
  { key: 'scheduled', label: 'Scheduled Clients' },
  ]

function matchCat(c: MatrixClient, cat: CatKey): boolean {
  switch (cat) {
    case 'wave1': return c.wave === '1'
    case 'wave2': return c.wave === '2'
    case 'prime': return c.isPrime
    case 'scheduled': return c.scheduled
  }
}

const BADGE_BASE: CSSProperties = {
  fontSize: 8.5, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
  borderRadius: 999, padding: '1px 6px', lineHeight: 1.5, whiteSpace: 'nowrap',
}
const WAVE_BADGE: CSSProperties = { ...BADGE_BASE, color: INK, background: '#eef0f6', border: '1px solid #e3e5f0' }
const PRIME_BADGE: CSSProperties = { ...BADGE_BASE, color: '#8a5a00', background: '#fff4e0', border: '1px solid #f0dcae' }
const UNSCHED_BADGE: CSSProperties = { ...BADGE_BASE, color: '#454b6e', background: '#f3f4fa', border: '1px solid #e3e5f0' }

const STATUS_STYLES: Record<StepStatus, { bg: string; color: string; dot: string; label: string }> = {
  Completed:     { bg: '#e9fbe6', color: '#1d6b12', dot: GREEN,     label: 'Completed' },
  'In Progress': { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d', label: 'In Progress' },
  'Not Started': { bg: '#eef0f6', color: '#454b6e', dot: '#9aa0bf', label: 'Not Started' },
  'Not Applicable': { bg: '#f1f3f7', color: '#6b7280', dot: '#6b7280', label: 'Not Applicable' },
}

const CYCLE: StepStatus[] = ['Not Started', 'In Progress', 'Completed', 'Not Applicable']

// ── Date helpers (ISO yyyy-mm-dd ↔ display) ───────────────────────���───���────────
function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Back-calculate a step's ISO due date from the pitch date and the step offset.
function dueISO(pitchISO: string, offsetDays: number): string {
  const d = new Date(pitchISO + 'T00:00:00')
  d.setDate(d.getDate() - offsetDays)
  return toISO(d)
}

// Format an ISO date as M/D for display.
function fmtMD(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${m}/${d}`
}

// ── Completed-pitch handling ──────────────────────────────────────────────────
// Fixed "today" reference (matches PitchCalendar) so completion is deterministic
// across server/client renders — avoids hydration mismatches.
const TODAY_ISO = '2026-09-22'

// A pitch is "completed" once its scheduled date is in the past.
function isPitchCompleted(pitchISO: string): boolean {
  return !!pitchISO && pitchISO < TODAY_ISO
}

// Parse a GTM-Status style date ("Aug 6, 2026") into ISO ("2026-08-06").
const GTM_MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
}
function parseGtmDate(s: string): string {
  const m = /^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})$/.exec((s || '').trim())
  if (!m) return ''
  const mon = GTM_MONTHS[m[1].toLowerCase()]
  if (!mon) return ''
  return `${m[3]}-${mon}-${m[2].padStart(2, '0')}`
}

// Whisper-conversation date per client, sourced from GTM Status (lib/data).
const WHISPER_ISO_BY_NORM = new Map<string, string>()
for (const c of clients) {
  const k = normName(c.name)
  if (!WHISPER_ISO_BY_NORM.has(k)) WHISPER_ISO_BY_NORM.set(k, parseGtmDate(c.whisperDate))
}

// ── Horizontal stepper with hover detail ──────────────────────────────────────
function Stepper() {
  const [hover, setHover] = useState<number | null>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

  const hovered = hover != null ? STEPS[hover] : null
  const hoverRect = hover != null ? nodeRefs.current[hover]?.getBoundingClientRect() : null
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1600

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ display: 'flex', minWidth: 980, paddingTop: 34 }}>
        {STEPS.map((step, i) => {
          const isGreen = i >= FIRST_GREEN
          const isPitch = step.n === 'pitch'
          const circleBg = isPitch ? INK : isGreen ? GREEN : INK
          const ring = isPitch ? `3px solid ${GREEN}` : 'none'
          const leftGreen = i >= FIRST_GREEN
          const rightGreen = i >= FIRST_GREEN - 1 // right half turns green one node earlier → clean midpoint transition
          return (
            <div
              key={i}
              ref={el => { nodeRefs.current[i] = el }}
              style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(prev => (prev === i ? null : prev))}
            >
              {/* timing annotation */}
              {step.timing && (
                <span style={{
                  position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', color: MUTED,
                  background: '#f3f4fa', border: '1px solid #e3e5f0', borderRadius: 999,
                  padding: '2px 8px', whiteSpace: 'nowrap',
                }}>
                  {step.timing}
                </span>
              )}

              {/* connector halves */}
              {i > 0 && (
                <span style={{ position: 'absolute', top: 21, right: '50%', width: '50%', height: 3, background: leftGreen ? GREEN_LINE : INK }} />
              )}
              {i < N - 1 && (
                <span style={{ position: 'absolute', top: 21, left: '50%', width: '50%', height: 3, background: rightGreen ? GREEN_LINE : INK }} />
              )}

              {/* node */}
              <button
                type="button"
                aria-label={typeof step.n === 'number' ? `Step ${step.n}: ${step.title}` : step.title}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(prev => (prev === i ? null : prev))}
                style={{
                  position: 'relative', zIndex: 2, width: 44, height: 44, borderRadius: '50%',
                  background: circleBg, border: ring, boxSizing: 'border-box',
                  color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(26,31,78,0.18)', padding: 0, fontFamily: 'inherit',
                }}
              >
                {isPitch ? <Check size={20} color={GREEN} strokeWidth={3.5} /> : step.n}
              </button>

              {/* label */}
              <span style={{
                marginTop: 10, fontSize: 11, fontWeight: 700, color: INK, textAlign: 'center',
                lineHeight: 1.3, maxWidth: 108,
              }}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* hover tooltip — fixed so it escapes the horizontal scroll container's clipping */}
      {hovered && hoverRect && (
        <div style={{
          position: 'fixed',
          left: Math.min(Math.max(hoverRect.left + hoverRect.width / 2, 118), viewportW - 118),
          top: hoverRect.top - 6,
          transform: 'translate(-50%, -100%)',
          zIndex: 50, width: 216, background: INK, color: '#fff', borderRadius: 10,
          padding: '11px 13px', boxShadow: '0 10px 30px rgba(15,18,48,0.35)', textAlign: 'left',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.02em', marginBottom: 4 }}>
            {typeof hovered.n === 'number' ? `${hovered.n}. ` : ''}{hovered.title}
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.86)' }}>{hovered.detail}</div>
          <div style={{ marginTop: 7, fontSize: 10, lineHeight: 1.45, color: GREEN, fontWeight: 700 }}>
            Owner: <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>{hovered.owner}</span>
          </div>
          <span style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
            borderTop: `7px solid ${INK}`,
          }} />
        </div>
      )}
    </div>
  )
}

// ── Status button (cycles on click) ───────────────────────────────────────────
function StatusButton({ status, onClick }: { status: StepStatus; onClick: () => void }) {
  const s = STATUS_STYLES[status]
  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to change status"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, width: '100%', justifyContent: 'center',
        padding: '4px 6px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: s.bg, color: s.color, fontSize: 9, fontWeight: 800, letterSpacing: '0.02em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </button>
  )
}

// ── Editable date cell (opens the native calendar picker on click) ─────────────
function DateCell({ iso, onChange, muted, emptyLabel }: { iso: string; onChange: (next: string) => void; muted?: boolean; emptyLabel?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const open = () => {
    const el = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }
  const label = iso ? fmtMD(iso) : (emptyLabel ?? '')
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={open}
        title="Click to pick a date"
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: muted ? 10 : 12.5, fontWeight: 800, color: muted ? MUTED : INK,
          padding: '1px 3px', borderRadius: 5, lineHeight: 1.2,
          borderBottom: '1px dashed rgba(26,31,78,0.35)',
        }}
      >
        {label}
      </button>
      <input
        ref={ref}
        type="date"
        value={iso}
        onChange={e => e.target.value && onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden
        style={{ position: 'absolute', left: 0, bottom: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
    </span>
  )
}

// ── Matrix table (dates editable; prior steps back-calculated from pitch date) ─
function PitchMatrix() {
  const [category, setCategory] = useState<CatKey>('wave1')
  const [statuses, setStatuses] = useState<Record<string, StepStatus[]>>(() => {
    const base = Object.fromEntries(UNIVERSE.map(c => [c.name, [...c.statuses]]))
    return { ...base, ...loadPersisted().statuses }
  })
  // Scheduled pitch date per client (the anchor for backward calculation).
  const [pitchDates, setPitchDates] = useState<Record<string, string>>(() => {
    const base = Object.fromEntries(UNIVERSE.map(c => [c.name, c.pitchDate]))
    return { ...base, ...loadPersisted().pitchDates }
  })
  // Per-cell manual date overrides: client name → { stepIndex: iso }.
  const [dateOverrides, setDateOverrides] = useState<Record<string, Record<number, string>>>(() => {
    const base = Object.fromEntries(UNIVERSE.map(c => [c.name, {}]))
    return { ...base, ...loadPersisted().dateOverrides }
  })

  // Persist edits to localStorage whenever they change.
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ statuses, pitchDates, dateOverrides })
      )
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [statuses, pitchDates, dateOverrides])

  const rows = useMemo(() => {
    const list = UNIVERSE.filter(c => matchCat(c, category))
    return [...list].sort((a, b) => {
      // Scheduled clients first (by pitch date); unscheduled fall to the bottom.
      const da = pitchDates[a.name] ? new Date(pitchDates[a.name]).getTime() : Infinity
      const db = pitchDates[b.name] ? new Date(pitchDates[b.name]).getTime() : Infinity
      return da - db
    })
  }, [category, pitchDates])

  function cycle(name: string, idx: number) {
    setStatuses(prev => {
      const arr = [...prev[name]]
      arr[idx] = CYCLE[(CYCLE.indexOf(arr[idx]) + 1) % CYCLE.length]
      return { ...prev, [name]: arr }
    })
  }

  // Effective ISO date for a step: manual override wins, else back-calculated.
  function cellISO(name: string, idx: number, offsetDays: number): string {
    const override = dateOverrides[name]?.[idx]
    if (override) return override
    // No scheduled pitch date → no derived step dates (avoid NaN output).
    if (!pitchDates[name]) return ''
    return dueISO(pitchDates[name], offsetDays)
  }

  function setCellDate(name: string, idx: number, iso: string) {
    setDateOverrides(prev => ({ ...prev, [name]: { ...prev[name], [idx]: iso } }))
  }

  // Changing the pitch date recomputes every non-overridden prior step.
  function setPitchDate(name: string, iso: string) {
    setPitchDates(prev => ({ ...prev, [name]: iso }))
  }

  return (
    <div style={{ background: '#fff', border: BORDER, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 1120, borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
          <colgroup>
            <col style={{ width: 172 }} />
            {STEPS.map((_, i) => <col key={i} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={{ background: INK, padding: '10px 12px', textAlign: 'left', verticalAlign: 'bottom' }}>
                <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}>
                  Client group
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CatKey)}
                  style={{
                    width: '100%', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, color: INK,
                    padding: '5px 8px', borderRadius: 6, border: 'none', background: '#fff', cursor: 'pointer',
                  }}
                >
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </th>
              {STEPS.map((step, i) => (
                <th key={i} style={{
                  background: INK, color: '#fff', padding: '10px 6px', textAlign: 'center',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.3,
                  borderLeft: '1px solid rgba(255,255,255,0.08)', verticalAlign: 'middle',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: i >= FIRST_GREEN ? GREEN : '#fff', marginBottom: 2 }}>
                    {typeof step.n === 'number' ? step.n : '✓'}
                  </div>
                  {step.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((client, r) => (
              <tr key={client.name} style={{ borderTop: r > 0 ? '1px solid #eef0f2' : undefined }}>
                <td style={{ padding: '12px 12px', verticalAlign: 'middle', background: '#f9fafd' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#0f1230' }}>
                    {client.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span style={WAVE_BADGE}>Wave {client.wave}</span>
                    {client.isPrime && <span style={PRIME_BADGE}>Prime</span>}
                    {!client.scheduled && <span style={UNSCHED_BADGE}>Unscheduled</span>}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    Pitch <DateCell iso={pitchDates[client.name]} muted emptyLabel="TBD" onChange={next => setPitchDate(client.name, next)} />
                  </div>
                </td>
                {STEPS.map((step, i) => {
                  const isPitch = step.n === 'pitch'
                  const isWhisper = i === 0
                  // Once the pitch date has passed, the prep sequence is history:
                  // surface only the whisper date (GTM Status) and the pitch date
                  // (Pitch calendar); leave every other step blank.
                  const completed = isPitchCompleted(pitchDates[client.name])
                  // The Whisper conversation date always comes from GTM Status
                  // (lib/data), for both upcoming and completed pitches. Other
                  // steps compute backward from the pitch date, and once the
                  // pitch has passed every non-whisper/non-pitch step is blank.
                  const whisperISO = WHISPER_ISO_BY_NORM.get(normName(client.name)) || ''
                  const iso = isPitch
                    ? pitchDates[client.name]
                    : isWhisper
                      ? (whisperISO || (completed ? '' : cellISO(client.name, i, step.offsetDays)))
                      : completed
                        ? ''
                        : cellISO(client.name, i, step.offsetDays)
                  return (
                    <td key={i} style={{ padding: '10px 6px', textAlign: 'center', verticalAlign: 'middle', borderLeft: '1px solid #f1f2f7' }}>
                      <div style={{ marginBottom: 6 }}>
                        {iso ? (
                          <DateCell
                            iso={iso}
                            onChange={next => (isPitch ? setPitchDate(client.name, next) : setCellDate(client.name, i, next))}
                          />
                        ) : isPitch ? (
                          <DateCell iso="" emptyLabel="" onChange={next => setPitchDate(client.name, next)} />
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 800, color: MUTED }}>—</span>
                        )}
                      </div>
                      <StatusButton status={statuses[client.name][i]} onClick={() => cycle(client.name, i)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PitchPrepDashboard() {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: INK, letterSpacing: '-0.01em' }}>
          Client Pitch Preparation Sequence
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>
          Hover any step for detail. Click any date to pick a new one from the calendar, or click a status to update it.
          Editing a client&apos;s pitch date recalculates the prior-step due dates backwards automatically.
        </p>
      </div>

      {/* Stepper card */}
      <div style={{ background: '#fff', border: BORDER, borderRadius: 12, padding: '18px 20px 12px', marginBottom: 16 }}>
        <Stepper />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 12, fontSize: 10.5, fontWeight: 700, color: MUTED }}>
        <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Status key</span>
        {(['Completed', 'In Progress', 'Not Started', 'Not Applicable'] as StepStatus[]).map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: STATUS_STYLES[s].dot }} />
            {STATUS_STYLES[s].label}
          </span>
        ))}
      </div>

      <PitchMatrix />
    </section>
  )
}
