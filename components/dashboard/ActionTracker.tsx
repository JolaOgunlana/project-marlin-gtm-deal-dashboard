'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Filter, X } from 'lucide-react'
import { NavBanner } from './CoverPage'
import { PitchPrepDashboard } from './PitchPrep'

type Page = 'cover' | 'debrief' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar' | 'actionTracker'

// ── Shared style tokens ───────────────────────────────────────────────────────
const INK = '#1a1f4e'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'

// ============================================================
// EDIT HERE: rows for the Action Tracker table. Add one object
// per action item matching this shape.
// ============================================================
export type ActionStatus = 'Complete' | 'WIP' | 'Delayed' | 'Not Started' | 'Not Applicable'
export type ActionRow = {
  clientName: string
  action: string
  description: string
  startDate: string
  status: ActionStatus
  owner: string
}

const ACTION_DATA: ActionRow[] = [
  {
    clientName: 'UBS',
    action: 'UBS Whisper Response',
    description: 'Preparation of UBS specific requirements asked for before pitch regarding the movement of their dedicated teams, current services and new proposed technological capabilities',
    startDate: '8/25/2026',
    status: 'Complete',
    owner: 'Mike Malone',
  },
  {
    clientName: 'Metro Bank',
    action: 'Metro Bank Pitch Response',
    description: 'Preparation of Metro Bank pitch response based on received feedback',
    startDate: '9/11/2026',
    status: 'WIP',
    owner: 'Nathalie Moreau',
  },
  {
    clientName: 'Virgin Money',
    action: 'Virgin Money Pitch Preparation',
    description: 'Preparation of Virgin Money pitch where pitch content needs to be produced, socialized and conduct pitch dry run',
    startDate: '9/14/2026',
    status: 'WIP',
    owner: 'Timothy Clack',
  },
  {
    clientName: 'All',
    action: 'FAQ Follow Up',
    description: 'Follow up on delayed and WIP questions on the FAQ with their respective owners',
    startDate: '9/10/2026',
    status: 'WIP',
    owner: 'PwC',
  },
  {
    clientName: 'All',
    action: 'Primer Client Pitches',
    description: 'Material preparation for primer clients',
    startDate: '9/14/2026',
    status: 'WIP',
    owner: 'Nathalie Moreau',
  },
  {
    clientName: 'Lloyds',
    action: 'GenPact Move Commercials',
    description: 'Produce and present the cost/commercials for the move to GenPact — the critical path Lloyds needs to see before the conversation can progress',
    startDate: '9/15/2026',
    status: 'WIP',
    owner: 'Stephen Lynch',
  },
  {
    clientName: 'Lloyds',
    action: 'Cost Options Modelling',
    description: 'Produce cost views across the four operating model options requested by Lloyds: (a) fully offshore; (b) full onshore; (c) back office offshore with specialist and telephony onshore; (d) back office offshore with specialist onshore and telephony offshore',
    startDate: '9/15/2026',
    status: 'WIP',
    owner: 'Stephen Lynch',
  },
  {
    clientName: 'Lloyds',
    action: 'Process Optimization Review',
    description: 'End-to-end review of focus areas using AI/RPA to optimize sub-optimal processes before moving offshore (avoid "rubbish in, rubbish out"); list of areas that would most benefit from these efficiencies to be produced by TMS',
    startDate: '9/15/2026',
    status: 'WIP',
    owner: 'TMS',
  },
  {
    clientName: 'Lloyds',
    action: 'Contract Renewal Alignment',
    description: 'Restate the contract and align the renewal start date to the move to GenPact, working through a longer (7 year) extension that could start earlier to facilitate the move',
    startDate: '9/15/2026',
    status: 'WIP',
    owner: 'Stewart Sims',
  },
]

const STATUS_STYLES: Record<ActionStatus, { bg: string; color: string; dot: string }> = {
  Complete:     { bg: '#e9fbe6', color: '#1d6b12', dot: '#4bcd3e' },
  WIP:          { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d' },
  Delayed:      { bg: '#fce8ef', color: '#8a1040', dot: '#B21A53' },
  'Not Started': { bg: '#eef0f6', color: '#454b6e', dot: '#9aa0bf' },
  'Not Applicable': { bg: '#eceef4', color: '#c0143c', dot: '#c0143c' },
}

function StatusPill({ status }: { status: ActionStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 9px', borderRadius: 7,
      background: s.bg, color: s.color,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

const ACTION_STORAGE_KEY = 'actionTracker.v1'

function loadPublished(): ActionRow[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ACTION_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ActionRow[]) : null
  } catch {
    return null
  }
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
    >
      <span style={{ position: 'relative', width: 38, height: 22, borderRadius: 999, background: checked ? '#5b2d6e' : '#cfd2e0', transition: 'background 0.15s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{label}</span>
    </button>
  )
}

type ColKey = keyof ActionRow
type Filters = Record<ColKey, string>
const EMPTY_FILTERS: Filters = {
  clientName: '',
  action: '',
  description: '',
  startDate: '',
  status: '',
  owner: '',
}

const COLUMNS: { key: ColKey; label: string; width: string }[] = [
  { key: 'clientName',  label: 'Client Name',  width: '14%' },
  { key: 'action',      label: 'Action',       width: '18%' },
  { key: 'description', label: 'Description',  width: '30%' },
  { key: 'startDate',   label: 'Start Date',   width: '11%' },
  { key: 'status',      label: 'Status',       width: '12%' },
  { key: 'owner',       label: 'Owner',        width: '15%' },
]

function ActionTable() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [numberFilter, setNumberFilter] = useState('')
  const [rowsData, setRowsData] = useState<ActionRow[]>(ACTION_DATA)
  const [adminMode, setAdminMode] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [justPublished, setJustPublished] = useState(false)

  // Load any previously published edits after mount so the SSR and initial
  // client render stay identical (avoids hydration mismatches).
  useEffect(() => {
    const published = loadPublished()
    if (published) setRowsData(published)
  }, [])

  const statuses: ActionStatus[] = ['Complete', 'WIP', 'Delayed', 'Not Started', 'Not Applicable']

  const filteredRows = useMemo(() => {
    const nFilter = numberFilter.trim().toLowerCase()
    return rowsData.filter((row, index) => {
      const number = String(index + 1)
      if (nFilter && !number.includes(nFilter)) return false
      return COLUMNS.every(({ key }) => {
        const f = filters[key].trim().toLowerCase()
        if (!f) return true
        return String(row[key]).toLowerCase().includes(f)
      })
    })
  }, [filters, numberFilter, rowsData])

  function updateStatus(rowIndex: number, status: ActionStatus) {
    setRowsData(prev => prev.map((r, i) => (i === rowIndex ? { ...r, status } : r)))
    setDirty(true)
    setJustPublished(false)
  }

  function publish() {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(rowsData))
      setDirty(false)
      setJustPublished(true)
    } catch {
      /* ignore quota / serialization errors */
    }
  }

  const activeFilterCount = COLUMNS.filter(({ key }) => filters[key].trim() !== '').length + (numberFilter.trim() ? 1 : 0)

  function setFilter(key: ColKey, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setNumberFilter('')
  }

  return (
    <div>
      {/* Admin edit / publish bar */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        flexWrap: 'wrap', marginBottom: 14, padding: '12px 14px',
        background: '#f7f8fc', border: BORDER, borderRadius: 10,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Toggle checked={adminMode} onChange={v => { setAdminMode(v); setJustPublished(false) }} label="Admin edit mode" />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999,
              background: adminMode ? '#fff4e0' : '#eef0f6', color: adminMode ? '#8a5a00' : '#454b6e',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {adminMode ? 'Editing' : 'View only'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: MUTED, maxWidth: 640 }}>
            <strong style={{ color: '#c0143c', fontWeight: 800 }}>View only — admin edit access only.</strong>{' '}
            Edit access is restricted to the 3 project admins. This toggle is client-side, so in production it must be gated to those named admins — front-end visitors should not be able to enable editing or publish changes.
          </p>
        </div>
        {adminMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {justPublished && !dirty && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#1d6b12' }}>
                <Check size={13} strokeWidth={3} /> Published
              </span>
            )}
            <button
              type="button"
              onClick={publish}
              disabled={!dirty}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.02em',
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: dirty ? INK : '#c9ccdb', color: '#fff',
                cursor: dirty ? 'pointer' : 'not-allowed',
              }}
            >
              Publish changes
            </button>
          </div>
        )}
      </div>

      {/* Filter summary bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: INK, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <Filter size={13} color={INK} strokeWidth={2.4} />
          Filter by column
          {activeFilterCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
              background: '#5b2d6e', color: '#fff', fontSize: 10.5, fontWeight: 800,
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, color: MUTED,
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px',
            }}
          >
            <X size={12} strokeWidth={2.4} />
            Clear filters
          </button>
        )}
      </div>

      <div style={{ background: '#fff', border: BORDER, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1180, borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
            <colgroup>
              <col style={{ width: '4%' }} />
              {COLUMNS.map(c => <col key={c.key} style={{ width: c.width }} />)}
            </colgroup>
            <thead>
              <tr>
                <th style={{ background: INK, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', padding: '12px 8px' }}>#</th>
                {COLUMNS.map(c => (
                  <th key={c.key} style={{
                    background: INK, color: '#fff', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left',
                    padding: '12px 14px',
                  }}>
                    {c.label}
                  </th>
                ))}
              </tr>
              <tr>
                <th style={{ padding: '8px 6px', background: '#f7f8fc', borderBottom: '1px solid #e5e7eb' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Filter by number"
                    placeholder="#"
                    value={numberFilter}
                    onChange={e => setNumberFilter(e.target.value)}
                    style={{ width: '100%', padding: '6px 4px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', color: INK, fontFamily: 'inherit', fontSize: 11.5, textAlign: 'center' }}
                  />
                </th>
                {COLUMNS.map(c => (
                  <th key={c.key} style={{ padding: '8px 10px', background: '#f7f8fc', borderBottom: '1px solid #e5e7eb' }}>
                    {c.key === 'status' ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        placeholder="Search…"
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} style={{ padding: '48px 20px', textAlign: 'center', fontSize: 13, color: MUTED }}>
                    {rowsData.length === 0
                      ? 'No actions yet. This table is ready to be populated.'
                      : 'No rows match the current filters. Try clearing a filter above.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? '1px solid #eef0f2' : undefined }}>
                    <td style={{ padding: '14px 8px', verticalAlign: 'top', textAlign: 'center', fontSize: 12, fontWeight: 800, color: MUTED }}>
                      {rowsData.indexOf(row) + 1}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#0f1230' }}>
                      {row.clientName}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: INK, fontWeight: 600 }}>
                      {row.action}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.description}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                      {row.startDate}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top' }}>
                      {adminMode ? (
                        <select
                          value={row.status}
                          onChange={e => updateStatus(rowsData.indexOf(row), e.target.value as ActionStatus)}
                          aria-label={`Status for ${row.action}`}
                          style={{
                            width: '100%', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, color: INK,
                            padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                          }}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <StatusPill status={row.status} />
                      )}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.owner}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function ActionTrackerPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin - Consent Tracker" />
      <div style={{ padding: '0 32px 56px' }}>
        <PitchPrepDashboard />
        <div style={{ marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: INK, letterSpacing: '-0.01em' }}>
            Action Items
          </h2>
        </div>
        <div style={{ marginTop: 12 }}>
          <ActionTable />
        </div>
      </div>
    </div>
  )
}
