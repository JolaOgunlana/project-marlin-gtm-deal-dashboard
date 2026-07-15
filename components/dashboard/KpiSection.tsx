'use client'

interface KpiSectionProps {
  title: string
  totalRevLabel: string
  totalRevValue: string
  totalRevSub: string
  totalClients: string
  totalClientsSub: string
  executed: string
  disqualified: string
  marginSecured: string
  percentACV25: string
  percentACV40?: string
  won: string
  percentWon: string
  lost: string
  percentLost: string
}

export function KpiSection({
  title,
  totalRevLabel,
  totalRevValue,
  totalRevSub,
  totalClients,
  totalClientsSub,
  executed,
  disqualified,
  marginSecured,
  percentACV25,
  percentACV40,
  won,
  percentWon,
  lost,
  percentLost,
}: KpiSectionProps) {
  return (
    <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e4ee' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1f4e', letterSpacing: '0.01em' }}>{title}</div>
      </div>
      {/* Row 1: 4 big KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        <div style={{ padding: '20px 24px 16px' }}>
          <div className="kpi-label-db">{totalRevLabel}</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: '#1a1f4e', lineHeight: 1 }}>{totalRevValue}</div>
          <div style={{ fontSize: 13, color: 'rgba(26,31,78,0.45)', marginTop: 6 }}>{totalRevSub}</div>
        </div>
        <div style={{ padding: '20px 24px 16px', borderLeft: '1px solid #e2e4ee' }}>
          <div className="kpi-label-db">Total Clients</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: '#1a1f4e', lineHeight: 1 }}>{totalClients}</div>
          <div style={{ fontSize: 13, color: 'rgba(26,31,78,0.45)', marginTop: 6 }}>{totalClientsSub}</div>
        </div>
        <div style={{ padding: '20px 24px 16px', borderLeft: '1px solid #e2e4ee' }}>
          <div className="kpi-label-db" style={{ color: '#2d7a0f' }}>Executed</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#2d7a0f', lineHeight: 1 }}>{executed}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#2d7a0f', opacity: 0.6 }}>clients</div>
          </div>
        </div>
        <div style={{ padding: '20px 24px 16px', borderLeft: '1px solid #e2e4ee' }}>
          <div className="kpi-label-db" style={{ color: '#d0021b' }}>Disqualified</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#d0021b', lineHeight: 1 }}>{disqualified}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#d0021b', opacity: 0.6 }}>clients</div>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: '#e2e4ee' }} />
      {/* Row 2: financials */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {percentACV40 ? (
          <div style={{ gridColumn: '1 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div style={{ padding: '14px 24px', background: 'white' }}>
              <div className="kpi-label-db">$ Margin Secured</div>
              <div className="kpi-value-db">{marginSecured}</div>
            </div>
            <div style={{ padding: '14px 24px', background: 'white', borderLeft: '1px solid #e2e4ee' }}>
              <div className="kpi-label-db">% of $25M ACV</div>
              <div className="kpi-value-db">{percentACV25}</div>
            </div>
            <div style={{ padding: '14px 24px', background: 'white', borderLeft: '1px solid #e2e4ee' }}>
              <div className="kpi-label-db">% of $40M Secured</div>
              <div className="kpi-value-db">{percentACV40}</div>
            </div>
          </div>
        ) : (
          <div style={{ gridColumn: '1 / span 2', padding: '14px 24px', background: 'white' }}>
            <div className="kpi-label-db">$ Margin Secured</div>
            <div className="kpi-value-db">{marginSecured}</div>
          </div>
        )}
        <div style={{ borderLeft: '1px solid #e2e4ee', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '14px 16px', background: 'white' }}>
            <div className="kpi-label-db">$ Won</div>
            <div className="kpi-value-db" style={{ color: '#2d7a0f' }}>{won}</div>
          </div>
          <div style={{ padding: '14px 16px', background: 'white', borderLeft: '1px solid #e2e4ee' }}>
            <div className="kpi-label-db">% of $25M ACV</div>
            <div className="kpi-value-db" style={{ color: '#2d7a0f' }}>{percentWon}</div>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid #e2e4ee', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '14px 16px', background: 'white' }}>
            <div className="kpi-label-db">$ Lost</div>
            <div className="kpi-value-db" style={{ color: '#d0021b' }}>{lost}</div>
          </div>
          <div style={{ padding: '14px 16px', background: 'white', borderLeft: '1px solid #e2e4ee' }}>
            <div className="kpi-label-db">% Revenue Lost</div>
            <div className="kpi-value-db" style={{ color: '#d0021b' }}>{percentLost}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
