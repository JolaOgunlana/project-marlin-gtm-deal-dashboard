'use client'

import { useMemo } from 'react'
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
  const filtered = useMemo(() => {
    return clients.filter((row) => {
      const cMatch = clientFilter === 'total' || clientFilter === row.clientType
      const wMatch = waveFilter === 'all' || waveFilter === row.wave
      const rMatch = regionFilter === 'all' || (regionFilter === 'NA' ? row.region === 'NA' : row.region.startsWith('EMEA'))
      const sMatch = stageFilter === 'all' || stageFilter === row.stage
      const isCompleted = row.salesCategory.trim() !== '' && row.salesCategory.trim() !== 'TBD'
      const wMatch2 = whisperFilter === 'all' || (whisperFilter === 'completed' && isCompleted)
      return cMatch && wMatch && rMatch && sMatch && wMatch2
    })
  }, [clientFilter, waveFilter, regionFilter, stageFilter, whisperFilter])

  const cl = clientFilter === 'total' ? 'All clients' : clientFilter === 'existing' ? 'Revenue Retention Opportunities' : 'New Deal Opportunities'
  const wv = waveFilter === 'all' ? 'all waves' : `Wave ${waveFilter}`
  const rg = regionFilter === 'all' ? 'all regions' : regionFilter
  const st = stageFilter === 'all' ? 'all stages' : `Stage ${stageFilter}`
  const wp = whisperFilter === 'all' ? 'all whisper' : 'whisper completed'
  const noteText = `${filtered.length} shown · ${cl} · ${wv} · ${rg} · ${st} · ${wp}`

  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e4ee', overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #e2e4ee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1f4e' }}>Client Status</div>
        <div style={{ fontSize: 13, color: 'rgba(26,31,78,0.45)', whiteSpace: 'nowrap' }}>{noteText}</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '6%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#f7f8fc' }}>
              {['Oppt. ID', 'Client Name', 'Deal Type', 'Region', 'TMS Total Revenue', 'Wave', 'TCV', 'TCV Currency', 'Stage', 'Probability (%)', 'Risk', 'Next Step', 'Disqualified Reason', 'Opportunity Owner', 'Whisper Outcome'].map((h) => (
                <th key={h} style={{ padding: '8px 7px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#1a1f4e', borderBottom: '1px solid #e2e4ee', whiteSpace: 'normal', lineHeight: 1.2, verticalAlign: 'bottom', wordBreak: 'break-word' }}>
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
                <td style={{ padding: '8px 7px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}><TBDCell /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
