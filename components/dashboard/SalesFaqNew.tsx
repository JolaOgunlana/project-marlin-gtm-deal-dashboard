'use client'

import { useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faq' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar'

// ── Shared style tokens ───────────────────────────────────────────────────────
const INK = '#1a1f4e'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'

// ============================================================
// EDIT HERE: rows for the new Sales FAQ table. Paste the CSV
// contents in as rows matching this shape — one object per
// question/response.
// ============================================================
export type FaqNewStatus = 'Answered' | 'Pending' | 'In Review' | 'Escalated' | 'Not Started'
export type FaqNewRow = {
  category: string
  sharedWithGenpact: 'Yes' | 'No'
  points: string
  response: string
  responseDate: string
  status: FaqNewStatus
  followUp: string
  commentPwc: string
}

const FAQ_NEW_DATA: FaqNewRow[] = []

const STATUS_STYLES: Record<FaqNewStatus, { bg: string; color: string; dot: string }> = {
  Answered:     { bg: '#e9fbe6', color: '#1d6b12', dot: '#4bcd3e' },
  Pending:      { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d' },
  'In Review':  { bg: '#eef1fb', color: '#2b3f8f', dot: '#4a5fc1' },
  Escalated:    { bg: '#fce8ef', color: '#8a1040', dot: '#B21A53' },
  'Not Started': { bg: '#f0f1f5', color: '#6f7d94', dot: '#6f7d94' },
}

function StatusPill({ status }: { status: FaqNewStatus }) {
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

type ColKey = keyof FaqNewRow
type Filters = Record<ColKey, string>
const EMPTY_FILTERS: Filters = {
  category: '',
  sharedWithGenpact: '',
  points: '',
  response: '',
  responseDate: '',
  status: '',
  followUp: '',
  commentPwc: '',
}

const COLUMNS: { key: ColKey; label: string; width: string }[] = [
  { key: 'category',          label: 'Category',            width: '10%' },
  { key: 'sharedWithGenpact', label: 'Shared with Genpact',  width: '8%' },
  { key: 'points',            label: 'Points to Address',    width: '19%' },
  { key: 'response',          label: 'Response',             width: '23%' },
  { key: 'responseDate',      label: 'Response Date',        width: '9%' },
  { key: 'status',            label: 'Status',               width: '9%' },
  { key: 'followUp',          label: 'Follow Up',            width: '11%' },
  { key: 'commentPwc',        label: 'Comment PwC',          width: '11%' },
]

function FaqNewTable() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const categories = useMemo(() => Array.from(new Set(FAQ_NEW_DATA.map(r => r.category))).sort(), [])
  const statuses: FaqNewStatus[] = ['Answered', 'Pending', 'In Review', 'Escalated', 'Not Started']

  const filteredRows = useMemo(() => {
    return FAQ_NEW_DATA.filter(row =>
      COLUMNS.every(({ key }) => {
        const f = filters[key].trim().toLowerCase()
        if (!f) return true
        return String(row[key]).toLowerCase().includes(f)
      })
    )
  }, [filters])

  const activeFilterCount = COLUMNS.filter(({ key }) => filters[key].trim() !== '').length

  function setFilter(key: ColKey, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
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
              {COLUMNS.map(c => <col key={c.key} style={{ width: c.width }} />)}
            </colgroup>
            <thead>
              <tr>
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
                {COLUMNS.map(c => (
                  <th key={c.key} style={{ padding: '8px 10px', background: '#f7f8fc', borderBottom: '1px solid #e5e7eb' }}>
                    {c.key === 'sharedWithGenpact' ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : c.key === 'status' ? (
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
                    ) : c.key === 'category' && categories.length > 0 ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                  <td colSpan={COLUMNS.length} style={{ padding: '48px 20px', textAlign: 'center', fontSize: 13, color: MUTED }}>
                    {FAQ_NEW_DATA.length === 0
                      ? 'No entries yet. This table is ready to be populated — submit the CSV to fill it in.'
                      : 'No rows match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? '1px solid #eef0f2' : undefined }}>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#0f1230' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, color: row.sharedWithGenpact === 'Yes' ? '#1d6b12' : MUTED, fontWeight: 700 }}>
                      {row.sharedWithGenpact}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: INK, fontWeight: 600 }}>
                      {row.points}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.response}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                      {row.responseDate}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top' }}>
                      <StatusPill status={row.status} />
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.followUp}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.commentPwc}
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

export function SalesFaqNewPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin - Consent Tracker" />
      <div style={{ padding: '0 32px 56px' }}>
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 24 }}>
          The refreshed Sales FAQ table, tracking each client question with whether it&apos;s been shared with Genpact, the point to address, the agreed response, when it was answered, its current status, and any follow-up still needed. Use the filters below to narrow by any column.
        </p>
        <FaqNewTable />
      </div>
    </div>
  )
}
