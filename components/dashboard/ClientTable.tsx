'use client'

import { useMemo, useState } from 'react'
import { clients, formatRevM, type ClientRow } from '@/lib/data'

type ClientFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'
type RegionFilter = 'all' | 'NA' | 'EMEA'
type StageFilter = 'all' | 'hold' | '1' | '2' | '3' | '4' | '5' | '6' | '8'
type WhisperFilter = 'all' | 'completed'

interface ClientTableProps {
  clientFilter: ClientFilter
  waveFilter: WaveFilter
  regionFilter: RegionFilter
  stageFilter: StageFilter
  whisperFilter: WhisperFilter
}

function TBDCell() {
  return <span style={{ color: 'rgba(26,31,78,0.45)', fontStyle: 'italic', fontSize: 10 }}>TBD</span>
}

function RegionBadge({ region }: { region: string }) {
  const isEmea = region.startsWith('EMEA')
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 5px',
      borderRadius: 4,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      background: isEmea ? 'rgba(91,45,110,0.1)' : 'rgba(26,31,78,0.08)',
      color: isEmea ? '#5b2d6e' : '#1a1f4e',
    }}>
      {region}
    </span>
  )
}

export function ClientTable({ clientFilter, waveFilter, regionFilter, stageFilter, whisperFilter }: ClientTableProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return clients.filter((row) => {
      const cMatch = clientFilter === 'total' || clientFilter === row.clientType
      const wMatch = waveFilter === 'all' || waveFilter === row.wave
      const rMatch = regionFilter === 'all' || (regionFilter === 'NA' ? row.region === 'NA' : row.region.startsWith('EMEA'))
      const sMatch = stageFilter === 'all' || stageFilter === row.stage
      const isCompleted = row.salesCategory.trim() !== '' && row.salesCategory.trim() !== 'TBD'
      const wMatch2 = whisperFilter === 'all' || (whisperFilter === 'completed' && isCompleted)
      const q = search.trim().toLowerCase()
      const sSearch = !q || row.name.toLowerCase().includes(q) || row.region.toLowerCase().includes(q) || row.salesCategory.toLowerCase().includes(q)
      return cMatch && wMatch && rMatch && sMatch && wMatch2 && sSearch
    })
  }, [clientFilter, waveFilter, regionFilter, stageFilter, whisperFilter, search])

  const cl = clientFilter === 'total' ? 'All clients' : clientFilter === 'existing' ? 'Revenue Retention Opportunities' : 'New Deal Opportunities'
  const wv = waveFilter === 'all' ? 'all waves' : `Wave ${waveFilter}`
  const rg = regionFilter === 'all' ? 'all regions' : regionFilter
  const st = stageFilter === 'all' ? 'all stages' : `Stage ${stageFilter}`
  const wp = whisperFilter === 'all' ? 'all whisper' : 'whisper completed'
  const noteText = `${filtered.length} shown · ${cl} · ${wv} · ${rg} · ${st} · ${wp}`

  return (
    <div>
      {/* Title + search bar — outside the table card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.005em', color: '#1a1f4e' }}>Client Status</div>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="rgba(26,31,78,0.4)" strokeWidth="1.5" />
              <path d="M10 10L14 14" stroke="rgba(26,31,78,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
                fontSize: 12, border: '1px solid #e2e4ee', borderRadius: 8,
                outline: 'none', width: 200, color: '#1a1f4e',
                background: '#fff', fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)', whiteSpace: 'nowrap' }}>{noteText}</div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e4ee', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '4%' }} />  {/* Oppt. ID */}
            <col style={{ width: '10%' }} /> {/* Client Name */}
            <col style={{ width: '5%' }} />  {/* Deal Type */}
            <col style={{ width: '5%' }} />  {/* Region */}
            <col style={{ width: '6%' }} />  {/* TMS Total Revenue */}
            <col style={{ width: '3%' }} />  {/* Wave */}
            <col style={{ width: '4%' }} />  {/* TCV */}
            <col style={{ width: '4%' }} />  {/* TCV Currency */}
            <col style={{ width: '4%' }} />  {/* Stage */}
            <col style={{ width: '5%' }} />  {/* Probability */}
            <col style={{ width: '4%' }} />  {/* Risk */}
            <col style={{ width: '6%' }} />  {/* Next Step */}
            <col style={{ width: '6%' }} />  {/* Disqualified Reason */}
            <col style={{ width: '6%' }} />  {/* Opportunity Owner */}
            <col style={{ width: '28%' }} /> {/* Whisper Outcome — intentionally wide */}
          </colgroup>
          <thead>
            <tr>
              {['Oppt. ID', 'Client Name', 'Deal Type', 'Region', 'TMS Total Revenue', 'Wave', 'TCV', 'TCV Currency', 'Stage', 'Probability (%)', 'Risk', 'Next Step', 'Disqualified Reason', 'Opportunity Owner', 'Whisper Outcome'].map((h) => (
                <th key={h} style={{
                  padding: '10px 7px', textAlign: 'left', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
                  background: '#1a1f4e', whiteSpace: 'normal', lineHeight: 1.2,
                  verticalAlign: 'bottom', wordBreak: 'break-word',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row: ClientRow, i: number) => (
              <tr key={i} style={{ background: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfd')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '8px 7px', fontSize: 10.5, color: '#1a1f4e', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  <TBDCell />
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.25, color: '#1a1f4e' }}>{row.name}</div>
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <span style={{ display: 'inline-block', padding: '2px 5px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: 'rgba(26,31,78,0.08)', color: '#1a1f4e', whiteSpace: 'nowrap' }}>
                    {row.clientType === 'existing' ? 'Existing' : 'New'}
                  </span>
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <RegionBadge region={row.region} />
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', fontSize: 10.5, fontWeight: 700, color: '#1a1f4e', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatRevM(row.tmsRevenue)}
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', fontSize: 10.5, color: '#1a1f4e', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {row.wave}
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', fontWeight: 600, color: '#1a1f4e', fontSize: 10.5 }}>
                  {row.stage}
                </td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'top', fontSize: 10.5, color: '#1a1f4e', lineHeight: 1.45, wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  {row.salesCategory && row.salesCategory !== 'TBD' ? row.salesCategory : <TBDCell />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
