'use client'

import { clients, formatRevM } from '@/lib/data'

const DIVIDER = '1px solid #e2e4ee'

const LABEL: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'rgba(10,22,40,0.42)',
  lineHeight: 1.3,
  marginBottom: 5,
  whiteSpace: 'nowrap',
}

const BIG_VAL: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 900,
  color: '#1a1f4e',
  lineHeight: 1,
}

function RegionBadge({ region }: { region: string }) {
  const isEmea = region.startsWith('EMEA')
  const isGlobal = region === 'Global'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: 4,
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      background: isGlobal ? 'rgba(8,145,178,0.12)' : isEmea ? 'rgba(91,45,110,0.1)' : 'rgba(26,31,78,0.08)',
      color: isGlobal ? '#0891b2' : isEmea ? '#5b2d6e' : '#1a1f4e',
    }}>
      {region}
    </span>
  )
}

export function PrimeBand() {
  const primeClients = clients.filter((c) => c.isPrime)
  const primeRev = primeClients.reduce((sum, c) => sum + (typeof c.tmsRevenue === 'number' ? c.tmsRevenue : 0), 0)
  const primeNA = primeClients.filter((c) => c.region === 'NA').length
  const primeEMEA = primeClients.filter((c) => c.region.startsWith('EMEA')).length
  const primeGlobal = primeClients.filter((c) => c.region === 'Global').length
  const primeSub = [
    primeNA ? `${primeNA} NA` : null,
    primeEMEA ? `${primeEMEA} EMEA` : null,
    primeGlobal ? `${primeGlobal} Global` : null,
  ].filter(Boolean).join('  ·  ')

  return (
    <div style={{
      background: 'white',
      border: DIVIDER,
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      marginBottom: 24,
      overflow: 'hidden',
    }}>
      {/* Section title */}
      <div style={{ padding: '16px 22px 14px', borderBottom: DIVIDER, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1f4e', letterSpacing: '0.005em' }}>New Deal Opportunities (Prime)</span>
        <span style={{
          display: 'inline-block', padding: '3px 9px', borderRadius: 999,
          fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
          background: 'rgba(8,145,178,0.12)', color: '#0891b2',
        }}>
          Prime
        </span>
      </div>

      {/* Summary row — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: DIVIDER }}>
        <div style={{ padding: '18px 22px 16px' }}>
          <div style={LABEL}>Total Prime ACV</div>
          <div style={BIG_VAL}>{formatRevM(primeRev)}</div>
          <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)', marginTop: 7 }}>Annual contract value</div>
        </div>
        <div style={{ padding: '18px 22px 16px', borderLeft: DIVIDER }}>
          <div style={LABEL}>Total Clients</div>
          <div style={BIG_VAL}>{primeClients.length}</div>
          <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)', marginTop: 7 }}>{primeSub}</div>
        </div>
      </div>

      {/* Prime client detail table */}
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '26%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Client Name', 'Region', 'ACV Business Case', 'Deal Type', 'Opp. Owner - Salesforce'].map((h) => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 8.5, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff',
                  background: '#1a1f4e', whiteSpace: 'normal', lineHeight: 1.3, verticalAlign: 'bottom',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {primeClients.map((row, i) => (
              <tr key={i} style={{ background: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfd')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.25, color: '#1a1f4e' }}>{row.name}</div>
                </td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <RegionBadge region={row.region} />
                </td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', fontSize: 11, fontWeight: 700, color: '#1a1f4e', fontVariantNumeric: 'tabular-nums' }}>
                  {formatRevM(row.tmsRevenue)}
                </td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle' }}>
                  <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: 'rgba(8,145,178,0.12)', color: '#0891b2', whiteSpace: 'nowrap' }}>
                    New / Prime
                  </span>
                </td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f1f7', verticalAlign: 'middle', fontSize: 11, color: '#1a1f4e' }}>
                  {row.opportunityOwner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
