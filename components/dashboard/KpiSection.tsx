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
  // bottom row
  marginSecured: string
  // existing only
  percentACV25?: string
  percentACV40?: string
  percentWon?: string
  percentLost?: string
  won: string
  lost: string
  // controls whether to show the full 7-col existing row or slim 3-col new row
  variant: 'existing' | 'new'
}

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

const BOTTOM_LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'rgba(10,22,40,0.42)',
  lineHeight: 1.3,
  marginBottom: 4,
  whiteSpace: 'nowrap',
}

const BOTTOM_VAL: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: '#1a1f4e',
  lineHeight: 1,
}

const DIVIDER = '1px solid #e2e4ee'

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
  percentWon,
  percentLost,
  won,
  lost,
  variant,
}: KpiSectionProps) {
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
      <div style={{ padding: '16px 22px 14px', borderBottom: DIVIDER }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1f4e', letterSpacing: '0.005em' }}>{title}</span>
      </div>

      {/* Top row — 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: DIVIDER }}>

        {/* Col 1 — Total Revenue */}
        <div style={{ padding: '18px 22px 16px' }}>
          <div style={LABEL}>{totalRevLabel}</div>
          <div style={BIG_VAL}>{totalRevValue}</div>
          <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)', marginTop: 7 }}>{totalRevSub}</div>
        </div>

        {/* Col 2 — Total Clients */}
        <div style={{ padding: '18px 22px 16px', borderLeft: DIVIDER }}>
          <div style={LABEL}>Total Clients</div>
          <div style={BIG_VAL}>{totalClients}</div>
          <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.45)', marginTop: 7 }}>{totalClientsSub}</div>
        </div>

        {/* Col 3 — Executed */}
        <div style={{ padding: '18px 22px 16px', borderLeft: DIVIDER }}>
          <div style={{ ...LABEL, color: '#2d7a0f' }}>Executed</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ ...BIG_VAL, color: '#2d7a0f' }}>{executed}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(26,31,78,0.45)' }}>clients</span>
          </div>
        </div>

        {/* Col 4 — Disqualified */}
        <div style={{ padding: '18px 22px 16px', borderLeft: DIVIDER }}>
          <div style={{ ...LABEL, color: '#d0021b' }}>Disqualified</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ ...BIG_VAL, color: '#d0021b' }}>{disqualified}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(26,31,78,0.45)' }}>client</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      {variant === 'existing' ? (
        /* 7 equal columns */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          <Cell label="$ Margin Secured" value={marginSecured} />
          <Cell label="% of $25M ACV" value={percentACV25 ?? '0%'} divider />
          <Cell label="% of $40M Secured" value={percentACV40 ?? '0%'} divider />
          <Cell label="$ Won" value={won} color="#2d7a0f" divider />
          <Cell label="% of $25M ACV" value={percentWon ?? '0%'} color="#2d7a0f" divider />
          <Cell label="$ Lost" value={lost} color="#d0021b" divider />
          <Cell label="% Revenue Lost" value={percentLost ?? '0%'} color="#d0021b" divider />
        </div>
      ) : (
        /* 3 columns */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <Cell label="$ Margin Secured" value={marginSecured} />
          <Cell label="$ Won" value={won} color="#2d7a0f" divider />
          <Cell label="$ Lost" value={lost} color="#d0021b" divider />
        </div>
      )}
    </div>
  )
}

function Cell({
  label,
  value,
  color,
  divider,
}: {
  label: string
  value: string
  color?: string
  divider?: boolean
}) {
  return (
    <div style={{
      padding: '12px 18px 14px',
      borderLeft: divider ? DIVIDER : undefined,
    }}>
      <div style={BOTTOM_LABEL}>{label}</div>
      <div style={{ ...BOTTOM_VAL, color: color ?? '#1a1f4e' }}>{value}</div>
    </div>
  )
}
