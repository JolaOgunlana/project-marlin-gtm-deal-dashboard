'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
type Rating = 'High' | 'Medium' | 'Low' | null

interface PostLever {
  rating: Rating
  rationale: string
}

interface CMClient {
  name: string
  id: string
  rev: number
  region: string
  dealType: 'existing' | 'new'
  wave: number
  stage: number
  out: Rating
  off: Rating
  dig: Rating
  price: Rating
  post?: {
    out?: PostLever
    off?: PostLever
    dig?: PostLever
    price?: PostLever
  }
}

type SortKey = 'id' | 'name' | 'deal' | 'region' | 'wave' | 'stage' | 'out' | 'off' | 'dig' | 'price' | 'overall'
type SortDir = 'asc' | 'desc'
type DealFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'
type RegionFilter = 'all' | 'NA' | 'EMEA'
type StageFilter = 'all' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8'
type WhisperMode = 'pre' | 'post'

// ── Data ──────────────────────────────────────────────────────────────────
const CM_DATA: CMClient[] = [
  { name:"Virgin Money", id:"VM", rev:27154967, region:"EMEA-UK", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low",
    post:{
      out:{ rating:"High", rationale:'They are open to further outsourcing and did not express any concerns regarding Genpact. While they are not a current user, they have engaged with them previously. There are concerns around introducing additional layers of "material outsourcing" under PRA regulation. The opportunity to access more modernised technical capabilities (e.g. AI), funded by FIS, resonated well. Maintaining existing day-to-day relationship ownership was positively received.' },
      off:{ rating:"Medium", rationale:'Offshore voice support is a clear "red light". It was stated that they cannot envisage a future where voice services would move offshore. Given the ongoing Nationwide/Virgin Money integration, any offshoring would be viewed as additional customer disruption. However, they are open to exploring offshoring for chat and operational activities.' },
      dig:{ rating:"High", rationale:"Strong appetite for digitization and automation across servicing workflows; leadership actively sponsoring the agenda." },
      price:{ rating:"High", rationale:"They already operate on a TCO model, so a subscription-based, predictable pricing structure would align with expectations." }
    }},
  { name:"Deutsche Bank (Hamburg)", id:"", rev:17352102, region:"EMEA-HH", dealType:"existing", wave:3, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"Fifth Third Bank", id:"5685", rev:14062039, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"High", price:"Medium",
    post:{
      out:{ rating:"High", rationale:"The overall message was received well with little resistance and candid feedback provided. He sees the logic in outsourcing to a provider that shores up much of our operational risk and traditional shortcomings — specifically scalability and lacking technology." },
      off:{ rating:"Medium", rationale:"His initial and largest concern is the low-cost location component. He advised this will more than likely present some legal challenges as well as business ops challenges. Through the operational lens, he is concerned about degradation of voice services specifically, with little to no concern on offshoring any and all back-office/non-voice work." },
      dig:{ rating:"High", rationale:"He is comfortable injecting more tech into our front ends and processes but admits this will have to be thoroughly proven prior to 5/3 moving forward." },
      price:{ rating:"Medium", rationale:"Other than John understanding it is a price-neutral move with us assuming cost for the tech in conjunction with low-cost location, he had no comment relative to pricing." }
    }},
  { name:"Metro Bank", id:"METRO", rev:12444434, region:"EMEA-UK", dealType:"existing", wave:1, stage:1, out:"High", off:"High", dig:"High", price:"Low" },
  { name:"UMB", id:"9463", rev:10320970, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Low", dig:"Medium", price:"Low",
    post:{
      out:{ rating:"Medium", rationale:"The concept was not rejected outright, which is encouraging given the expected sensitivity around the topic. Uma appeared to recognize the value of aligning with the broader operating model rather than pursuing a unique solution for UMB." },
      off:{ rating:"High", rationale:"Offshoring was a primary area of focus. We confirmed that voice operations would be supported from the Philippines and off-phone/back-office activities from India." }
    }},
  { name:"Lloyds", id:"LLOYDS", rev:9355708, region:"EMEA-UK", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low" },
  { name:"UBS Financial Services Inc.", id:"7826", rev:8421652, region:"NA", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"High" },
  { name:"PNC Bank", id:"", rev:5499455, region:"NA", dealType:"existing", wave:3, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low" },
  { name:"ING (BV / Barneveld)", id:"", rev:4690204, region:"EMEA-BV", dealType:"existing", wave:2, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"Synovus Bank (incl. Business)", id:"", rev:3682762, region:"NA", dealType:"existing", wave:3, stage:1, out:"Low", off:null, dig:null, price:null },
  { name:"Centene Corporation", id:"7697", rev:3489339, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"High", price:"High" },
  { name:"HSBC Technology & Services (USA)", id:"9368", rev:3083942, region:"NA", dealType:"existing", wave:1, stage:1, out:"Medium", off:"High", dig:"High", price:"Medium" },
  { name:"First Hawaiian Bank", id:"", rev:2197457, region:"NA", dealType:"existing", wave:2, stage:1, out:"High", off:"High", dig:null, price:null },
  { name:"Arvest", id:"", rev:2036070, region:"NA", dealType:"existing", wave:2, stage:1, out:"High", off:"High", dig:"Medium", price:"Low" },
  { name:"AIB", id:"AIB", rev:1827370, region:"EMEA-UK", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"Low" },
  { name:"Hancock-Whitney Bank", id:"", rev:1749293, region:"NA", dealType:"existing", wave:2, stage:1, out:"Low", off:null, dig:null, price:null },
  { name:"Simmons Bank", id:"0149+7805+7873", rev:1744800, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"High", dig:"High", price:"Medium" },
  { name:"First Bank Puerto Rico", id:"444", rev:1721272, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Medium", dig:"High", price:"Medium" },
  { name:"Capital One", id:"", rev:1590370, region:"NA", dealType:"existing", wave:2, stage:1, out:"Medium", off:null, dig:null, price:null },
  { name:"Degussa (Hamburg) / OLB", id:"", rev:1533603, region:"EMEA-HH", dealType:"existing", wave:3, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low" },
  { name:"TDNA", id:"6899", rev:1461484, region:"NA", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"Low", price:"Medium" },
  { name:"Brim Financial", id:"9159", rev:1266978, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"US Bank (BV / Barneveld)", id:"", rev:1151833, region:"EMEA-BV", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Fairstone Bank of Canada", id:"", rev:978405, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Marlette Funding / Best Egg", id:"", rev:921463, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"M & T Bank", id:"", rev:910405, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Central Trust Bank", id:"", rev:909758, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"City National Bank", id:"", rev:793955, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Truist Bank", id:"", rev:717090, region:"NA", dealType:"existing", wave:2, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"Low" },
  { name:"Rogers Bank", id:"", rev:606000, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Jaja Finance", id:"", rev:590000, region:"EMEA-UK", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:"Low", price:null },
  { name:"Regions Financial Corporation", id:"", rev:567870, region:"NA", dealType:"existing", wave:3, stage:1, out:"Low", off:"Low", dig:"Low", price:"Low" },
  { name:"ServisFirst", id:"7841", rev:555696, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"High", price:"High" },
  { name:"President's Choice", id:"7607", rev:525550, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"High", dig:"High", price:"High" },
  { name:"Santander Bank", id:"", rev:485904, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Royal Bank Of Canada", id:"", rev:477860, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Texas Capital", id:"", rev:426600, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Wells Fargo", id:"", rev:414000, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Marshall and Ilsley (BMO)", id:"164", rev:380045, region:"NA", dealType:"existing", wave:1, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Key Bank", id:"", rev:376815, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Union Bank (MUFG)", id:"8470", rev:344400, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"High", dig:"High", price:"High" },
  { name:"Citizens Bank", id:"6053", rev:330550, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Low", dig:"Medium", price:"Low" },
  { name:"BOKF, NA", id:"", rev:308614, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Bank Of America", id:"", rev:307350, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Banco Popular", id:"", rev:238800, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"The Bank Of Nova Scotia", id:"2280", rev:225000, region:"NA", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"Low" },
  { name:"IVR BOA", id:"", rev:160907, region:"EMEA-UK", dealType:"existing", wave:2, stage:1, out:"Medium", off:"Medium", dig:"Low", price:"Medium" },
  { name:"Navy Federal Credit Union", id:"", rev:151400, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Vancouver City Savings Credit", id:"", rev:132600, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Citibank", id:"1410", rev:106021, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"Medium", price:"Low" },
  { name:"First Caribbean International Bank", id:"", rev:96000, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Bank of Montreal", id:"", rev:94334, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Valley National BK", id:"", rev:84000, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Ameriprise Trust Bank", id:"", rev:62220, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"IVR RBS CLI", id:"IVRRBS", rev:25243, region:"EMEA-UK", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Medium", dig:"Medium", price:"High",
    post:{
      out:{ rating:"Medium", rationale:"Reassurance provided that the very reliable current IVR service will remain reliable. Not allergic to the idea of a new provider provided the appropriate checks and approvals are in place. However, as expected, Ailsa viewed this as a possible opportunity to take the final IVR back in house and terminate our service." },
      off:{ rating:"Medium", rationale:"Offshoring not applicable." }
    }},
  { name:"Empire Innovation Group", id:"9018", rev:25200, region:"NA", dealType:"existing", wave:1, stage:1, out:null, off:null, dig:null, price:null },
  { name:"San Diego County Credit Union", id:"", rev:18780, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"MotivHealth", id:"9414", rev:10500, region:"NA", dealType:"existing", wave:1, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Commerce Bank Of Kansas City", id:"", rev:7800, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Pitney Bowes Credit Corp", id:"", rev:7620, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Acclaris, Inc.", id:"", rev:5400, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Wright Express Financial Serv", id:"", rev:3120, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Chase Corporate Card (JP Morgan)", id:"", rev:2400, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
]

// ── Helpers ────────────────────────────────────────────────────────────────
const RATING_SCORE: Record<string, number> = { High: 100, Medium: 75, Low: 50 }
const ratingScore = (r: Rating) => (r ? (RATING_SCORE[r] ?? 0) : 0)
const overallScore = (c: CMClient, mode: WhisperMode) => {
  const levers = mode === 'post' && c.post
    ? [c.post.out?.rating ?? c.out, c.post.off?.rating ?? c.off, c.post.dig?.rating ?? c.dig, c.post.price?.rating ?? c.price]
    : [c.out, c.off, c.dig, c.price]
  const filled = levers.filter(Boolean)
  if (!filled.length) return null
  return filled.reduce((s, r) => s + ratingScore(r as Rating), 0) / filled.length
}
const scoreBand = (s: number | null): Rating => {
  if (s === null) return null
  if (s >= 75) return 'High'
  if (s >= 50) return 'Medium'
  return 'Low'
}
const fmtRev = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}
const regionLabel = (r: string) => {
  if (r === 'NA') return 'NA'
  if (r.startsWith('EMEA')) return 'EMEA'
  return r
}
const regionColor = (r: string) => {
  if (r === 'NA') return '#1a1f4e'
  if (r === 'EMEA-UK') return '#5b2d6e'
  if (r === 'EMEA-HH') return '#252a5a'
  return '#2e9e2e'
}

// ── Sub-components ─────────────────────────────────────────────────────────
function RatingPill({ rating, onClick, active }: { rating: Rating; onClick?: () => void; active?: boolean }) {
  if (!rating) return <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    High: { bg: '#d8f3d8', color: '#1a6e1a', dot: '#2e9e2e' },
    Medium: { bg: '#fdf1c9', color: '#8a6a00', dot: '#e8a800' },
    Low: { bg: '#fde0e0', color: '#a01020', dot: '#d0021b' },
  }
  const s = styles[rating]
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 9px', borderRadius: 7,
        background: active ? 'rgba(26,31,78,0.08)' : s.bg,
        color: s.color,
        fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
        border: active ? '1.5px solid rgba(26,31,78,0.25)' : '1.5px solid transparent',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'inherit',
        transition: 'background 0.12s',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {rating}
      {onClick && <span style={{ fontSize: 9, color: 'rgba(26,31,78,0.4)', marginLeft: 2, transform: active ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.18s' }}>▾</span>}
    </button>
  )
}

function OverallScore({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: 'rgba(26,31,78,0.35)', fontStyle: 'italic', fontSize: 11 }}>—</span>
  const band = scoreBand(score)
  const barColor = band === 'High' ? '#2e9e2e' : band === 'Medium' ? '#e8a800' : '#d0021b'
  const badgeBg = band === 'High' ? '#d8f3d8' : band === 'Medium' ? '#fdf1c9' : '#fde0e0'
  const badgeColor = band === 'High' ? '#1a6e1a' : band === 'Medium' ? '#8a6a00' : '#a01020'
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 8, background: badgeBg, color: badgeColor, fontSize: 12.5, fontWeight: 800 }}>
        {Math.round(score)}
        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{band}</span>
      </span>
      <div style={{ width: 66, height: 7, background: '#e8eaf2', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: barColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
        padding: '6px 14px', borderRadius: 999,
        border: `1px solid ${active ? '#1a1f4e' : '#d8dae8'}`,
        background: active ? '#1a1f4e' : '#fff',
        color: active ? '#fff' : 'rgba(26,31,78,0.75)',
        cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1.1,
        transition: 'all 0.13s',
      }}
    >
      {children}
    </button>
  )
}

// ── Heat-map constants ─────────────────────────────────────────────────────
const CM_Y_POS: Record<string, number> = { Low: 20, Medium: 50, High: 78 }
const CM_X_POS: Record<string, number> = { Low: 16.666, Medium: 50, High: 83.333 }
const STAGE_COLOR: Record<string, string> = { 0:'#c9ccdb', 1:'#7aa8ff', 2:'#06b6d4', 3:'#8b5cf6', 4:'#f59e0b', 5:'#14b8a6', 6:'#2e9e2e', 8:'#d0021b' }
const revTierDiam = (rev: number) => rev >= 10e6 ? 52 : rev >= 5e6 ? 38 : rev >= 1e6 ? 26 : 16

function heatColor(v: number): [number, number, number] {
  v = Math.max(0, Math.min(1, v))
  let r, g, b
  if (v < 0.5) {
    const t = v / 0.5
    r = Math.round(55 + (255 - 55) * t); g = Math.round(150 + (225 - 150) * t); b = Math.round(50 + (60 - 50) * t)
  } else {
    const t = (v - 0.5) / 0.5
    r = Math.round(255 + (232 - 255) * t); g = Math.round(225 + (95 - 225) * t); b = Math.round(60 + (80 - 60) * t)
  }
  return [r, g, b]
}

interface HeatMapProps {
  clients: CMClient[]
  whisperMode: WhisperMode
}

function HeatMap({ clients, whisperMode }: HeatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; out: Rating; off: Rating; score: number | null } | null>(null)

  // Paint the canvas background
  const paintBackground = useCallback(() => {
    const c = canvasRef.current
    const plot = plotRef.current
    if (!c || !plot) return
    const W = plot.clientWidth || 900
    const H = plot.clientHeight || 420
    const RW = 160, RH = Math.max(60, Math.round(160 * H / W))
    c.width = RW; c.height = RH
    c.style.width = W + 'px'; c.style.height = H + 'px'
    const ctx = c.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(RW, RH)
    for (let yy = 0; yy < RH; yy++) {
      for (let xx = 0; xx < RW; xx++) {
        const xN = xx / (RW - 1)
        const yN = yy / (RH - 1)
        let v = ((1 - xN) + yN) / 2
        v += 0.05 * Math.sin(xN * 6.0 + yN * 2.0) + 0.04 * Math.cos(yN * 5.0 - xN * 1.5)
        const [r, g, b] = heatColor(v)
        const idx = (yy * RW + xx) * 4
        img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [])

  useEffect(() => {
    paintBackground()
    const obs = new ResizeObserver(() => paintBackground())
    if (plotRef.current) obs.observe(plotRef.current)
    return () => obs.disconnect()
  }, [paintBackground])

  // Only plot clients that have both out + off ratings
  const plotted = clients.filter(c => {
    const ar = whisperMode === 'post' && c.post
      ? { out: c.post.out?.rating ?? c.out, off: c.post.off?.rating ?? c.off }
      : { out: c.out, off: c.off }
    return ar.out && ar.off
  })

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #eef0f6' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1f4e' }}>Consent Propensity Heat-Map</div>
        <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.5)', marginTop: 3 }}>
          Outsourcing (Y-axis) vs. Offshoring (X-axis) · bubble size = TMS revenue · {plotted.length} client{plotted.length !== 1 ? 's' : ''} plotted
        </div>
      </div>

      {/* Plot area */}
      <div style={{ padding: '16px 24px 0', position: 'relative' }}>
        {/* Y-axis label */}
        <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: 10.5, fontWeight: 700, color: 'rgba(26,31,78,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', transformOrigin: 'center center' }}>
          Outsourcing Consent
        </div>

        <div ref={plotRef} style={{ position: 'relative', height: 420, marginLeft: 24, background: '#f4f5f9', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e4ee' }}>
          {/* Canvas heatmap background */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.82, borderRadius: 10 }} />

          {/* Grid dividers */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* Vertical dividers at 33.3% and 66.6% */}
            {[33.333, 66.666].map(p => (
              <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, borderLeft: '1px solid rgba(255,255,255,0.35)', zIndex: 1 }} />
            ))}
            {/* Horizontal dividers at 33.3% and 66.6% from bottom */}
            {[33.333, 66.666].map(p => (
              <div key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `${p}%`, borderBottom: '1px solid rgba(255,255,255,0.35)', zIndex: 1 }} />
            ))}
            {/* X-axis tier labels */}
            {(['Low', 'Medium', 'High'] as const).map((tier, i) => (
              <div key={tier} style={{ position: 'absolute', bottom: 6, left: `${i * 33.333 + 16.666}%`, transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                {tier}
              </div>
            ))}
            {/* Y-axis tier labels */}
            {(['High', 'Medium', 'Low'] as const).map((tier, i) => (
              <div key={tier} style={{ position: 'absolute', left: 6, top: `${i * 33.333 + 11}%`, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                {tier}
              </div>
            ))}
          </div>

          {/* Bubbles */}
          {plotted.map((c, i) => {
            const ar = whisperMode === 'post' && c.post
              ? { out: c.post.out?.rating ?? c.out, off: c.post.off?.rating ?? c.off }
              : { out: c.out, off: c.off }
            const xPct = CM_X_POS[ar.off as string] ?? 50
            const yPct = CM_Y_POS[ar.out as string] ?? 50
            const diam = revTierDiam(c.rev)
            const score = overallScore(c, whisperMode)
            const stageCol = STAGE_COLOR[String(c.stage)] ?? '#c9ccdb'
            return (
              <div
                key={i}
                title={c.name}
                onMouseEnter={e => setTooltip({ x: (e.currentTarget as HTMLElement).getBoundingClientRect().left + diam / 2, y: (e.currentTarget as HTMLElement).getBoundingClientRect().top - 8, name: c.name, out: ar.out as Rating, off: ar.off as Rating, score })}
                onMouseLeave={() => setTooltip(null)}
                style={{
                  position: 'absolute',
                  left: `calc(${xPct}% - ${diam / 2}px)`,
                  bottom: `calc(${yPct}% - ${diam / 2}px)`,
                  width: diam, height: diam, borderRadius: '50%',
                  background: stageCol,
                  border: '2px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
                  zIndex: 3,
                  cursor: 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.1s',
                  fontSize: Math.max(7, diam * 0.22),
                  fontWeight: 800,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {diam >= 38 ? c.id || c.name.slice(0, 4) : ''}
              </div>
            )
          })}
        </div>

        {/* X-axis label */}
        <div style={{ textAlign: 'center', marginTop: 6, marginLeft: 24, fontSize: 10.5, fontWeight: 700, color: 'rgba(26,31,78,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Offshoring Consent
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 24px 18px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', borderTop: '1px solid #eef0f6', marginTop: 14 }}>
        {/* Stage legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.5)', marginRight: 2 }}>Stage</span>
          {([['1','New Opp.','#7aa8ff'],['2','Early Sales','#06b6d4'],['3','Mid Sales','#8b5cf6'],['4','Late Sales','#f59e0b'],['5','Contracting','#14b8a6'],['6','Executed','#2e9e2e'],['8','Disqualified','#d0021b']] as const).map(([k, label, col]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: col }} />
              <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.65)' }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Size legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.5)' }}>Revenue tier</span>
          {([['16px','< $1M'],['26px','$1M–5M'],['38px','$5M–10M'],['52px','$10M+']] as const).map(([sz, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: sz, height: sz, borderRadius: '50%', background: '#1a1f4e', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.65)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: 'fixed', top: tooltip.y, left: tooltip.x, transform: 'translate(-50%, -100%)', zIndex: 9999, background: '#1a1f4e', color: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 12, pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 800, marginBottom: 3 }}>{tooltip.name}</div>
          <div style={{ opacity: 0.75 }}>Out: {tooltip.out} · Off: {tooltip.off} · Score: {tooltip.score !== null ? Math.round(tooltip.score) : '—'}</div>
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function ConsentMatrix({ onNavigateBack }: { onNavigateBack: () => void }) {
  const [whisperMode, setWhisperMode] = useState<WhisperMode>('pre')
  const [dealFilter, setDealFilter] = useState<DealFilter>('total')
  const [waveFilter, setWaveFilter] = useState<WaveFilter>('all')
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all')
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('rev' as SortKey)
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [openDetail, setOpenDetail] = useState<{ row: number; lever: 'out' | 'off' | 'dig' | 'price' } | null>(null)
  const [rationaleOpen, setRationaleOpen] = useState(false)
  const [criteriaOpen, setCriteriaOpen] = useState(false)

  const effectiveRating = (c: CMClient, lever: 'out' | 'off' | 'dig' | 'price'): Rating => {
    if (whisperMode === 'post' && c.post?.[lever]) return c.post[lever]!.rating
    return c[lever]
  }

  const filtered = useMemo(() => {
    return CM_DATA.filter(c => {
      const d = dealFilter === 'total' || dealFilter === c.dealType
      const w = waveFilter === 'all' || String(c.wave) === waveFilter
      const r = regionFilter === 'all' || (regionFilter === 'NA' ? c.region === 'NA' : c.region.startsWith('EMEA'))
      const s = stageFilter === 'all' || String(c.stage) === stageFilter
      const q = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
      return d && w && r && s && q
    })
  }, [dealFilter, waveFilter, regionFilter, stageFilter, search])

  const sorted = useMemo(() => {
    const ratingOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
    const getRatingVal = (r: Rating) => r ? (ratingOrder[r] ?? 0) : 0
    return [...filtered].sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0
      if (sortKey === 'id') { av = a.id; bv = b.id }
      else if (sortKey === 'name') { av = a.name; bv = b.name }
      else if (sortKey === 'deal') { av = a.dealType; bv = b.dealType }
      else if (sortKey === 'region') { av = a.region; bv = b.region }
      else if (sortKey === 'wave') { av = a.wave; bv = b.wave }
      else if (sortKey === 'stage') { av = a.stage; bv = b.stage }
      else if (sortKey === 'out') { av = getRatingVal(effectiveRating(a, 'out')); bv = getRatingVal(effectiveRating(b, 'out')) }
      else if (sortKey === 'off') { av = getRatingVal(effectiveRating(a, 'off')); bv = getRatingVal(effectiveRating(b, 'off')) }
      else if (sortKey === 'dig') { av = getRatingVal(effectiveRating(a, 'dig')); bv = getRatingVal(effectiveRating(b, 'dig')) }
      else if (sortKey === 'price') { av = getRatingVal(effectiveRating(a, 'price')); bv = getRatingVal(effectiveRating(b, 'price')) }
      else if (sortKey === 'overall') { av = overallScore(a, whisperMode) ?? -1; bv = overallScore(b, whisperMode) ?? -1 }
      else { av = a.rev; bv = b.rev }
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, whisperMode])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sortArrow = (key: SortKey) => sortKey === key ? (sortDir === 'desc' ? ' ▼' : ' ▲') : ''

  // Summary stats
  const postClients = filtered.filter(c => c.post)
  const highOverall = filtered.filter(c => (overallScore(c, whisperMode) ?? 0) >= 75).length
  const medOverall = filtered.filter(c => { const s = overallScore(c, whisperMode); return s !== null && s >= 50 && s < 75 }).length
  const lowOverall = filtered.filter(c => { const s = overallScore(c, whisperMode); return s !== null && s < 50 }).length
  const scoredClients = filtered.map(c => overallScore(c, whisperMode)).filter((s): s is number => s !== null)
  const avgPropensity = scoredClients.length > 0 ? Math.round(scoredClients.reduce((a, b) => a + b, 0) / scoredClients.length) : null

  const toggleDetail = (row: number, lever: 'out' | 'off' | 'dig' | 'price') => {
    if (openDetail?.row === row && openDetail?.lever === lever) setOpenDetail(null)
    else setOpenDetail({ row, lever })
  }

  const leverLabel: Record<string, string> = { out: 'Outsourcing', off: 'Offshoring', dig: 'Digitization', price: 'Price Maintain' }

  // ── Shared header style matching page 1 ───────────────────────────────
  const thStyle: React.CSSProperties = {
    background: '#1a1f4e', color: '#fff',
    padding: '11px 8px', textAlign: 'center',
    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em',
    borderBottom: '2px solid #5b2d6e', verticalAlign: 'middle',
    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      {/* ── Page Header — matching page 1 style ── */}
      <div style={{
        background: '#1a1f4e', marginBottom: 26,
        padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 46, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
            Consent Likelihood Matrix
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Internal Use Only
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.28)', borderRadius: 999,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7ed321', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 6px #7ed32180' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
              ACV Target $25M by October 1st 2026
            </span>
          </div>
          <div style={{ textAlign: 'right', lineHeight: 1.65 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 1 }}>Last Update</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>July 15th 2026 · 18:00 EST</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4, marginBottom: 1 }}>Next Update</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>July 22nd 2026 · 18:00 EST</div>
          </div>
          {/* Back to page 1 nav button */}
          <button
            onClick={onNavigateBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 6,
              padding: '10px 22px',
              background: '#7ed321', color: '#1a1f4e',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 800, letterSpacing: '0.03em',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(126,211,33,0.4)',
              transition: 'background 0.15s, transform 0.1s',
            }}
          >
            ← GTM Deal Dashboard
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '0 28px 48px' }}>
        {/* Description */}
        <p style={{ fontSize: 13.5, color: 'rgba(26,31,78,0.55)', lineHeight: 1.65, marginBottom: 24, maxWidth: 820 }}>
          A simplified view for comparing clients — this dashboard shows propensity ratings across the four consent levers (Outsourcing, Offshoring, Digitization and Price Maintain) and an overall blended propensity score. Data combines FIS/TIS client intelligence for pre-whisper ratings with Executive/CSM feedback for post-whisper ratings. Colour bands flag where consent risk concentrates to help inform client strategy.
        </p>

        {/* ── Top row: Toggle card + Total Clients + Avg Propensity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

          {/* Left: Propensity Rating toggle */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)', marginBottom: 14 }}>
              Propensity Rating
            </div>
            <div style={{ display: 'flex', gap: 10, background: '#eef0f6', borderRadius: 11, padding: 5 }}>
              {(['post', 'pre'] as WhisperMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setWhisperMode(m)}
                  style={{
                    flex: 1,
                    fontFamily: 'inherit', fontSize: 17, fontWeight: 800,
                    padding: '14px 20px', borderRadius: 8,
                    border: `1.5px solid ${whisperMode === m ? '#1a1f4e' : '#d8dae8'}`,
                    background: whisperMode === m ? '#1a1f4e' : '#fff',
                    color: whisperMode === m ? '#fff' : '#1a1f4e',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: whisperMode === m ? '0 4px 14px rgba(26,31,78,0.28)' : 'none',
                    transition: 'all 0.12s',
                  }}
                >
                  {m === 'post' ? 'Post-whisper' : 'Pre-whisper'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(26,31,78,0.42)', marginTop: 12, fontStyle: 'italic' }}>
              Filter comparison with Post-Whisper and Pre-Whisper Consent Likelihood
            </div>
          </div>

          {/* Middle: Total Clients */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)', marginBottom: 12 }}>
              Total Clients
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, color: '#1a1f4e', lineHeight: 1 }}>
              {whisperMode === 'post' ? postClients.length : filtered.length}
            </div>
          </div>

          {/* Right: Avg. Propensity */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)', marginBottom: 12 }}>
              Avg. Propensity
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: '#1a1f4e', lineHeight: 1 }}>
                {avgPropensity ?? '—'}
              </span>
              {avgPropensity !== null && (
                <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(26,31,78,0.45)' }}>/100</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Rationale accordion ── */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
          <button
            onClick={() => setRationaleOpen(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '15px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>ⓘ</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>How the Overall Propensity Score is calculated</span>
            <span style={{ color: '#9aa0b8', fontSize: 12, transition: 'transform 0.2s', transform: rationaleOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
          </button>
          {rationaleOpen && (
            <div style={{ padding: '4px 20px 22px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13, color: '#4a5060', lineHeight: 1.65, margin: '16px 0 18px' }}>
                Each client is scored on four categories — Outsourcing, Offshoring, Digitization and Price. Each rating becomes a percentage, and the four are averaged into one 0–100 score.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '16px 18px', background: '#fbfbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 12 }}>Rating → Points</div>
                  {[['High','100%'],['Medium','75%'],['Low','50%']].map(([r,p])=>(
                    <div key={r} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f1f7', fontSize: 12.5, color: '#1a1f4e', fontWeight: 600 }}>
                      <span>{r}</span><span>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '16px 18px', background: '#fbfbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 12 }}>Score → Band</div>
                  {[['High','75 – 100'],['Medium','50 – 74'],['Low','under 50']].map(([b,r])=>(
                    <div key={b} style={{ display: 'flex', gap: 9, padding: '8px 0', fontSize: 12.5, color: '#4a5060' }}>
                      <span style={{ fontWeight: 800, color: '#1a1f4e' }}>{b}</span><span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Criteria accordion ── */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <button
            onClick={() => setCriteriaOpen(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '15px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>ⓘ</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>Category Rating Criteria (Post-Whisper)</span>
            <span style={{ color: '#9aa0b8', fontSize: 12, transition: 'transform 0.2s', transform: criteriaOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
          </button>
          {criteriaOpen && (
            <div style={{ padding: '4px 20px 22px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13, color: '#4a5060', lineHeight: 1.65, margin: '16px 0 18px' }}>
                How each lever is rated after the whisper conversation, based on trigger phrases and signals in the client&apos;s comments.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 860, fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 78, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b2d6e', padding: '0 12px 12px 0', textAlign: 'left' }}>Rating</th>
                      {['Outsourcing','Offshoring','Digitization','Pricing'].map(h => (
                        <th key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b2d6e', padding: '0 14px 12px', borderBottom: '1px solid #e2e4ee', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th style={{ padding: '14px 12px 14px 0', verticalAlign: 'middle', borderBottom: '1px solid #f0f1f7' }}><RatingPill rating="High" /></th>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Openness to further outsourcing, no objection to the model itself, and positive language toward the value proposition.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Openness across all service types with no named exclusions.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Clear enthusiasm for digital transformation with no stated hesitation.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Existing pricing model already aligns with the proposed structure.</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '14px 12px 14px 0', verticalAlign: 'middle', borderBottom: '1px solid #f0f1f7' }}><RatingPill rating="Medium" /></th>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Openness in principle, paired with an unresolved concern or condition.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Open to specific service types with an explicit exclusion in another area.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>General openness with conditions, timing concerns, or a phased approach preference.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55, borderBottom: '1px solid #f0f1f7' }}>Different pricing model described with no explicit resistance stated.</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '14px 12px 14px 0', verticalAlign: 'middle' }}><RatingPill rating="Low" /></th>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55 }}>Explicit rejection language with no qualifier or path forward.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55 }}>Blanket rejection with no named area of openness.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55 }}>Reluctance or resistance to digital transformation.</td>
                      <td style={{ padding: '14px', fontSize: 12, color: '#4a5060', lineHeight: 1.55 }}>Won&apos;t accept the pricing model or high discount expectations.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Heat-Map ── */}
        <HeatMap clients={filtered} whisperMode={whisperMode} />

        {/* ── Filters ── */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Opportunities', btns: [['total','Total'],['existing','Revenue Retention'],['new','New Deal']], state: dealFilter, set: setDealFilter as (v: string) => void },
              { label: 'Wave', btns: [['all','All'],['1','Wave 1'],['2','Wave 2'],['3','Wave 3']], state: waveFilter, set: setWaveFilter as (v: string) => void },
              { label: 'Region', btns: [['all','All'],['NA','NA'],['EMEA','EMEA']], state: regionFilter, set: setRegionFilter as (v: string) => void },
              { label: 'Stage', btns: [['all','All'],['1','1 · New Opp.'],['2','2 · Early Sales'],['3','3 · Mid Sales'],['4','4 · Late Sales'],['5','5 · Contracting'],['6','6 · Executed'],['8','8 · Disqualified']], state: stageFilter, set: setStageFilter as (v: string) => void },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.5)', minWidth: 80, flexShrink: 0 }}>{row.label}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {row.btns.map(([val, lbl]) => (
                    <FilterBtn key={val} active={row.state === val} onClick={() => row.set(val)}>{lbl}</FilterBtn>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info note ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, padding: '10px 14px', background: 'rgba(26,31,78,0.03)', border: '1px solid #e2e4ee', borderRadius: 8, fontSize: 12, lineHeight: 1.55, color: 'rgba(26,31,78,0.7)' }}>
          <span style={{ color: '#5b2d6e', fontSize: 13, flexShrink: 0 }}>ⓘ</span>
          <span><strong style={{ color: '#1a1f4e' }}>Overall Propensity Likelihood</strong> blends four consent levers — Outsourcing, Offshoring, Digitization and Price Maintain. <strong style={{ color: '#1a1f4e' }}>Low</strong> likelihood signals high consent risk; <strong style={{ color: '#1a1f4e' }}>High</strong> likelihood signals low consent risk. {whisperMode === 'post' && <strong style={{ color: '#1a1f4e' }}>Post-whisper ratings override pre-whisper where available. Click any rating pill to expand the supporting rationale.</strong>}</span>
        </div>

        {/* ── Search ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e4ee', borderRadius: 8, padding: '8px 12px', marginBottom: 16, maxWidth: 340 }}>
          <span style={{ color: 'rgba(26,31,78,0.4)', fontSize: 15 }}>⌕</span>
          <input
            type="text"
            placeholder="Search client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 13, color: '#1a1f4e', width: '100%', background: 'transparent' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(26,31,78,0.4)', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>}
        </div>

        {/* ── Table ── */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e4ee', overflow: 'hidden', boxShadow: '0 2px 16px rgba(26,31,78,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', minWidth: 900 }}>
              <colgroup>
                <col style={{ width: 52 }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 48 }} />
                <col style={{ width: 48 }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ ...thStyle, textAlign: 'left' }}>ID{sortArrow('id')}</th>
                  <th onClick={() => handleSort('name')} style={{ ...thStyle, textAlign: 'left' }}>Client Name{sortArrow('name')}</th>
                  <th onClick={() => handleSort('deal')} style={thStyle}>Type{sortArrow('deal')}</th>
                  <th onClick={() => handleSort('region')} style={thStyle}>Region{sortArrow('region')}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>TMS Revenue</th>
                  <th onClick={() => handleSort('wave')} style={thStyle}>Wave{sortArrow('wave')}</th>
                  <th onClick={() => handleSort('stage')} style={thStyle}>Stage{sortArrow('stage')}</th>
                  <th onClick={() => handleSort('out')} style={thStyle}>Outsourcing{sortArrow('out')}</th>
                  <th onClick={() => handleSort('off')} style={thStyle}>Offshoring{sortArrow('off')}</th>
                  <th onClick={() => handleSort('dig')} style={thStyle}>Digitization{sortArrow('dig')}</th>
                  <th onClick={() => handleSort('price')} style={thStyle}>Price Maintain{sortArrow('price')}</th>
                  <th onClick={() => handleSort('overall')} style={{ ...thStyle, background: '#5b2d6e', borderLeft: '3px solid #9ca3b5' }}>
                    Overall Propensity{sortArrow('overall')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr><td colSpan={12} style={{ padding: '32px 24px', textAlign: 'center', color: 'rgba(26,31,78,0.5)', fontSize: 13 }}>No clients match the current filters.</td></tr>
                )}
                {sorted.map((c, i) => {
                  const score = overallScore(c, whisperMode)
                  const levers: Array<'out' | 'off' | 'dig' | 'price'> = ['out', 'off', 'dig', 'price']
                  const hasDetail = whisperMode === 'post' && c.post
                  return (
                    <React.Fragment key={`${c.name}-${i}`}>
                      <tr
                        style={{ background: i % 2 === 1 ? '#fafbfe' : '#fff', transition: 'background 0.1s' }}
                      >
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', fontSize: 11, fontWeight: 700, color: 'rgba(26,31,78,0.7)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          {c.id || <span style={{ fontStyle: 'italic', opacity: 0.4 }}>—</span>}
                        </td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', fontWeight: 600, fontSize: 12, color: '#1a1f4e', lineHeight: 1.3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {whisperMode === 'post' && c.post && (
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7ed321', flexShrink: 0, boxShadow: '0 0 4px #7ed32180' }} title="Whisper completed" />
                            )}
                            {c.name}
                          </div>
                        </td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 5, fontSize: 10.5, fontWeight: 700, background: 'rgba(26,31,78,0.08)', color: '#1a1f4e', whiteSpace: 'nowrap' }}>
                            {c.dealType === 'existing' ? 'Retention' : 'New Deal'}
                          </span>
                        </td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: `${regionColor(c.region)}18`, color: regionColor(c.region), whiteSpace: 'nowrap' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: regionColor(c.region), flexShrink: 0 }} />
                            {regionLabel(c.region)}
                          </span>
                        </td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: 12, color: '#1a1f4e', whiteSpace: 'nowrap' }}>
                          {fmtRev(c.rev)}
                        </td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'center', fontWeight: 700, fontSize: 12, color: '#1a1f4e' }}>{c.wave}</td>
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'center', fontWeight: 600, fontSize: 11, color: '#1a1f4e', whiteSpace: 'nowrap' }}>{c.stage}</td>
                        {levers.map(lever => {
                          const rating = effectiveRating(c, lever)
                          const isDetailOpen = openDetail?.row === i && openDetail?.lever === lever
                          const canExpand = hasDetail && !!(c.post?.[lever])
                          return (
                            <td key={lever} style={{ padding: '9px 6px', borderBottom: '1px solid #eef0f6', textAlign: 'center', verticalAlign: 'middle' }}>
                              <RatingPill
                                rating={rating}
                                onClick={canExpand ? () => toggleDetail(i, lever) : undefined}
                                active={isDetailOpen}
                              />
                            </td>
                          )
                        })}
                        <td style={{ padding: '9px 8px', borderBottom: '1px solid #eef0f6', textAlign: 'center', verticalAlign: 'middle', borderLeft: '3px solid #9ca3b5', background: 'rgba(26,31,78,0.015)' }}>
                          <OverallScore score={score} />
                        </td>
                      </tr>
                      {/* Expandable detail row */}
                      {openDetail?.row === i && hasDetail && c.post?.[openDetail.lever] && (
                        <tr>
                          <td colSpan={12} style={{ padding: 0, borderBottom: '1px solid #eef0f6' }}>
                            <div style={{ padding: '18px 28px 20px', background: 'linear-gradient(180deg,#f7f8fc,#fbfbfe)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b2d6e' }}>
                                  {c.name} — {leverLabel[openDetail.lever]} Rationale
                                </span>
                                <RatingPill rating={c.post![openDetail.lever]!.rating} />
                              </div>
                              <p style={{ fontSize: 13, color: '#3a4056', lineHeight: 1.7, maxWidth: 880 }}>
                                {c.post![openDetail.lever]!.rationale}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: '1px solid #f0f1f7', fontSize: 11, color: 'rgba(26,31,78,0.45)', fontStyle: 'italic' }}>
            {sorted.length} client{sorted.length !== 1 ? 's' : ''} shown · {whisperMode === 'post' ? 'Post-Whisper' : 'Pre-Whisper'} ratings · Green dot = whisper completed
          </div>
        </div>
      </div>
    </div>
  )
}
