'use client'

import { useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar' | 'actionTracker'

// ── Shared style tokens ───────────────────────────────────────────────────────
const INK = '#1a1f4e'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'

// ============================================================
// EDIT HERE: rows for the Action Tracker table. Add one object
// per action item matching this shape.
// ============================================================
export type ActionStatus = 'Complete' | 'WIP' | 'Delayed' | 'Not Started'
export type ActionRow = {
  clientName: string
  action: string
  description: string
  startDate: string
  status: ActionStatus
  owner: string
}

const ACTION_DATA: ActionRow[] = []

const STATUS_STYLES: Record<ActionStatus, { bg: string; color: string; dot: string }> = {
  Complete:     { bg: '#e9fbe6', color: '#1d6b12', dot: '#4bcd3e' },
  WIP:          { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d' },
  Delayed:      { bg: '#fce8ef', color: '#8a1040', dot: '#B21A53' },
  'Not Started': { bg: '#eef0f6', color: '#454b6e', dot: '#9aa0bf' },
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

  const statuses: ActionStatus[] = ['Complete', 'WIP', 'Delayed', 'Not Started']

  const filteredRows = useMemo(() => {
    const nFilter = numberFilter.trim().toLowerCase()
    return ACTION_DATA.filter((row, index) => {
      const number = String(index + 1)
      if (nFilter && !number.includes(nFilter)) return false
      return COLUMNS.every(({ key }) => {
        const f = filters[key].trim().toLowerCase()
        if (!f) return true
        return String(row[key]).toLowerCase().includes(f)
      })
    })
  }, [filters, numberFilter])

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
                    {ACTION_DATA.length === 0
                      ? 'No actions yet. This table is ready to be populated.'
                      : 'No rows match the current filters. Try clearing a filter above.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? '1px solid #eef0f2' : undefined }}>
                    <td style={{ padding: '14px 8px', verticalAlign: 'top', textAlign: 'center', fontSize: 12, fontWeight: 800, color: MUTED }}>
                      {ACTION_DATA.indexOf(row) + 1}
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
                      <StatusPill status={row.status} />
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
        <ActionTable />
      </div>
    </div>
  )
}
