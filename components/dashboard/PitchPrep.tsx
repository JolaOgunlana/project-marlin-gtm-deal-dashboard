'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'

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
type StepStatus = 'Completed' | 'In Progress' | 'Not Started'

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
const seed = (done: number, wip: number): StepStatus[] =>
  Array.from({ length: N }, (_, i) => (i < done ? 'Completed' : i < done + wip ? 'In Progress' : 'Not Started'))

const CLIENTS: ClientPitch[] = [
    { name: 'HSBC',            pitchDate: '2026-09-21', statuses: ['Completed', 'In Progress', 'In Progress', ...seed(0, 0).slice(3)] },
    { name: 'Virgin Money',    pitchDate: '2026-10-05', statuses: seed(3, 2) },
    { name: 'Metro Bank',      pitchDate: '2026-09-10', statuses: seed(2, 2) },
    { name: 'Fifth Third Bank',pitchDate: '2026-09-24', statuses: seed(1, 1) },
    { name: 'Lloyds',          pitchDate: '2026-09-15', statuses: seed(4, 2) },
    { name: 'Deutsche Bank',   pitchDate: '2026-10-21', statuses: seed(2, 1) },
]

const STATUS_STYLES: Record<StepStatus, { bg: string; color: string; dot: string; label: string }> = {
  Completed:     { bg: '#e9fbe6', color: '#1d6b12', dot: GREEN,     label: 'Completed' },
  'In Progress': { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d', label: 'In Progress' },
  'Not Started': { bg: '#eef0f6', color: '#454b6e', dot: '#9aa0bf', label: 'Not Started' },
}

const CYCLE: StepStatus[] = ['Not Started', 'In Progress', 'Completed']

// ── Date helpers (ISO yyyy-mm-dd ↔ display) ────────────────────────────────────
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

// ── Horizontal stepper with hover detail ──────────────────────────────────────
function Stepper() {
  const [hover, setHover] = useState<number | null>(null)

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

              {/* hover tooltip */}
              {hover === i && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% - 22px)', left: '50%', transform: 'translateX(-50%)',
                  zIndex: 20, width: 216, background: INK, color: '#fff', borderRadius: 10,
                  padding: '11px 13px', boxShadow: '0 10px 30px rgba(15,18,48,0.35)', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.02em', marginBottom: 4 }}>
                    {typeof step.n === 'number' ? `${step.n}. ` : ''}{step.title}
                  </div>
                  <div style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.86)' }}>{step.detail}</div>
                  <div style={{ marginTop: 7, fontSize: 10, lineHeight: 1.45, color: GREEN, fontWeight: 700 }}>
                    Owner: <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>{step.owner}</span>
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
        })}
      </div>
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
function DateCell({ iso, onChange, muted }: { iso: string; onChange: (next: string) => void; muted?: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  const open = () => {
    const el = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }
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
        {fmtMD(iso)}
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
  const [clientFilter, setClientFilter] = useState('All')
  const [statuses, setStatuses] = useState<Record<string, StepStatus[]>>(() => {
    const base = Object.fromEntries(CLIENTS.map(c => [c.name, [...c.statuses]]))
    return { ...base, ...loadPersisted().statuses }
  })
  // Scheduled pitch date per client (the anchor for backward calculation).
  const [pitchDates, setPitchDates] = useState<Record<string, string>>(() => {
    const base = Object.fromEntries(CLIENTS.map(c => [c.name, c.pitchDate]))
    return { ...base, ...loadPersisted().pitchDates }
  })
  // Per-cell manual date overrides: client name → { stepIndex: iso }.
  const [dateOverrides, setDateOverrides] = useState<Record<string, Record<number, string>>>(() => {
    const base = Object.fromEntries(CLIENTS.map(c => [c.name, {}]))
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
    const list = clientFilter === 'All' ? CLIENTS : CLIENTS.filter(c => c.name === clientFilter)
    return [...list].sort(
      (a, b) =>
        new Date(pitchDates[a.name]).getTime() - new Date(pitchDates[b.name]).getTime()
    )
  }, [clientFilter, pitchDates])

  function cycle(name: string, idx: number) {
    setStatuses(prev => {
      const arr = [...prev[name]]
      arr[idx] = CYCLE[(CYCLE.indexOf(arr[idx]) + 1) % CYCLE.length]
      return { ...prev, [name]: arr }
    })
  }

  // Effective ISO date for a step: manual override wins, else back-calculated.
  function cellISO(name: string, idx: number, offsetDays: number): string {
    return dateOverrides[name]?.[idx] ?? dueISO(pitchDates[name], offsetDays)
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
                  Client (filter)
                </label>
                <select
                  value={clientFilter}
                  onChange={e => setClientFilter(e.target.value)}
                  style={{
                    width: '100%', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, color: INK,
                    padding: '5px 8px', borderRadius: 6, border: 'none', background: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="All">All scheduled clients</option>
                  {CLIENTS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
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
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    Pitch <DateCell iso={pitchDates[client.name]} muted onChange={next => setPitchDate(client.name, next)} />
                  </div>
                </td>
                {STEPS.map((step, i) => {
                  const isPitch = step.n === 'pitch'
                  const iso = isPitch ? pitchDates[client.name] : cellISO(client.name, i, step.offsetDays)
                  return (
                    <td key={i} style={{ padding: '10px 6px', textAlign: 'center', verticalAlign: 'middle', borderLeft: '1px solid #f1f2f7' }}>
                      <div style={{ marginBottom: 6 }}>
                        <DateCell
                          iso={iso}
                          onChange={next => (isPitch ? setPitchDate(client.name, next) : setCellDate(client.name, i, next))}
                        />
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
        {(['Completed', 'In Progress', 'Not Started'] as StepStatus[]).map(s => (
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
