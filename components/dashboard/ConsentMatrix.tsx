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
// Each band occupies exactly 1/3 of the axis (0–33.33%, 33.33–66.67%, 66.67–100%).
// Within a band the overall propensity score (0–100) nudges the bubble:
//   higher score → further right (X) and higher up (Y) within the band.
// We leave 15% padding at each band edge so bubbles never sit on grid lines.
const BAND_START: Record<string, number> = { Low: 0, Medium: 33.33, High: 66.67 }
const BAND_SIZE = 33.33
const BAND_PAD = 0.15 // fraction of band to leave as margin on each side

// Returns X% position (0=left, 100=right) for an offshoring band + score
const bandXPct = (band: string, score: number | null): number => {
  const start = BAND_START[band] ?? 33.33
  const inner = BAND_SIZE * (1 - 2 * BAND_PAD)
  // higher off score → further right within band
  const norm = score !== null ? score / 100 : 0.5
  return start + BAND_SIZE * BAND_PAD + inner * norm
}

// Returns Y% position (0=top, 100=bottom) for an outsourcing band + score
// High outsourcing = top (low Y%), so higher score → smaller Y%
const bandYPct = (band: string, score: number | null): number => {
  const bandTop: Record<string, number> = { High: 0, Medium: 33.33, Low: 66.67 }
  const start = bandTop[band] ?? 33.33
  const inner = BAND_SIZE * (1 - 2 * BAND_PAD)
  // higher out score → higher up → lower Y%
  const norm = score !== null ? score / 100 : 0.5
  return start + BAND_SIZE * BAND_PAD + inner * (1 - norm)
}

const STAGE_COLOR: Record<string, string> = {
  0: '#c9ccdb', 1: '#1a1f4e', 2: '#7aa8ff', 3: '#8b5cf6',
  4: '#f59e0b', 5: '#14b8a6', 6: '#2e9e2e', 8: '#d0021b',
}
const STAGE_LABELS: [string, string, string][] = [
  ['0','0 · Not Started','#c9ccdb'],
  ['1','1 · New Opportunity','#1a1f4e'],
  ['2','2 · Early Sales','#7aa8ff'],
  ['3','3 · Mid Sales','#8b5cf6'],
  ['4','4 · Late Sales / Pricing','#f59e0b'],
  ['5','5 · Contracting','#14b8a6'],
  ['6','6 · Executed','#2e9e2e'],
  ['8','8 · Disqualified','#d0021b'],
]
const revTierDiam = (rev: number) => rev >= 10e6 ? 52 : rev >= 5e6 ? 38 : rev >= 1e6 ? 26 : 16



interface HeatMapProps {
  allClients: CMClient[]
  whisperMode: WhisperMode
}

function HeatMap({ allClients, whisperMode }: HeatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; out: Rating; off: Rating; score: number | null } | null>(null)

  // Own filter state inside the heatmap card
  const [hmDeal, setHmDeal] = useState<DealFilter>('total')
  const [hmWave, setHmWave] = useState<WaveFilter>('all')
  const [hmRegion, setHmRegion] = useState<RegionFilter>('all')
  const [hmStage, setHmStage] = useState<StageFilter>('all')

  // Filter clients to the ones that have both out+off ratings for current mode
  const plotted = useMemo(() => {
    return allClients.filter(c => {
      const ar = whisperMode === 'post' && c.post
        ? { out: c.post.out?.rating ?? c.out, off: c.post.off?.rating ?? c.off }
        : { out: c.out, off: c.off }
      if (!ar.out || !ar.off) return false
      if (hmDeal !== 'total' && c.dealType !== hmDeal) return false
      if (hmWave !== 'all' && String(c.wave) !== hmWave) return false
      if (hmRegion !== 'all' && (hmRegion === 'NA' ? c.region !== 'NA' : !c.region.startsWith('EMEA'))) return false
      if (hmStage !== 'all' && String(c.stage) !== hmStage) return false
      return true
    })
  }, [allClients, whisperMode, hmDeal, hmWave, hmRegion, hmStage])

  // Canvas gradient background: red(bottom-left) → yellow(center) → green(top-right)
  const paintBg = useCallback(() => {
    const canvas = canvasRef.current
    const plot = plotRef.current
    if (!canvas || !plot) return
    const W = plot.clientWidth || 900
    const H = plot.clientHeight || 480
    canvas.width = 300; canvas.height = Math.round(300 * H / W)
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const RW = canvas.width, RH = canvas.height
    const img = ctx.createImageData(RW, RH)
    for (let yy = 0; yy < RH; yy++) {
      for (let xx = 0; xx < RW; xx++) {
        // xN=0 left(low off), xN=1 right(high off)
        // yN=0 top(high out), yN=1 bottom(low out)
        const xN = xx / (RW - 1)
        const yN = yy / (RH - 1)
        // "goodness": high offshoring(x) + high outsourcing(1-y) → green
        const goodness = (xN + (1 - yN)) / 2
        let r, g, b
        if (goodness < 0.35) {
          // red zone
          const t = goodness / 0.35
          r = 230; g = Math.round(80 + 120 * t); b = Math.round(80 + 40 * t)
        } else if (goodness < 0.6) {
          // yellow zone
          const t = (goodness - 0.35) / 0.25
          r = Math.round(230 + 10 * t); g = Math.round(200 + 25 * t); b = Math.round(120 - 80 * t)
        } else {
          // green zone
          const t = (goodness - 0.6) / 0.4
          r = Math.round(240 - 110 * t); g = Math.round(225 - 15 * t); b = Math.round(40 + 30 * t)
        }
        const idx = (yy * RW + xx) * 4
        img.data[idx] = r; img.data[idx+1] = g; img.data[idx+2] = b; img.data[idx+3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [])

  useEffect(() => {
    paintBg()
    const obs = new ResizeObserver(() => paintBg())
    if (plotRef.current) obs.observe(plotRef.current)
    return () => obs.disconnect()
  }, [paintBg])

  const HmPill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} style={{
      fontFamily: 'inherit', fontSize: 11.5, fontWeight: active ? 700 : 500,
      padding: '5px 12px', borderRadius: 999,
      border: `1px solid ${active ? '#1a1f4e' : '#d8dae8'}`,
      background: active ? '#1a1f4e' : '#fff',
      color: active ? '#fff' : 'rgba(26,31,78,0.65)',
      cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1,
      transition: 'all 0.12s',
    }}>{children}</button>
  )

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>

      {/* ── Header row: title left, filters right ── */}
      <div style={{ padding: '18px 24px 16px', borderBottom: '1px solid #eef0f6' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1f4e', whiteSpace: 'nowrap', paddingTop: 2 }}>
            Consent Propensity Heat-Map
          </div>
          {/* Filter pills — stacked rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            {/* Opportunities row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.4)', marginRight: 2 }}>Opportunities</span>
              {([['total','Total'],['existing','Revenue Retention Opportunities'],['new','New Deal Opportunities']] as const).map(([v,l]) => (
                <HmPill key={v} active={hmDeal===v} onClick={() => setHmDeal(v)}>{l}</HmPill>
              ))}
            </div>
            {/* Wave row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.4)', marginRight: 2 }}>Wave</span>
              {([['all','All'],['1','Wave 1'],['2','Wave 2'],['3','Wave 3']] as const).map(([v,l]) => (
                <HmPill key={v} active={hmWave===v} onClick={() => setHmWave(v)}>{l}</HmPill>
              ))}
            </div>
            {/* Region row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.4)', marginRight: 2 }}>Region</span>
              {([['all','All'],['NA','NA'],['EMEA','EMEA']] as const).map(([v,l]) => (
                <HmPill key={v} active={hmRegion===v} onClick={() => setHmRegion(v)}>{l}</HmPill>
              ))}
            </div>
            {/* Stage row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.4)', marginRight: 2 }}>Stage</span>
              {([['all','All'],['0','0 · Not Started'],['1','1 · New Opportunity'],['2','2 · Early Sales'],['3','3 · Mid Sales'],['4','4 · Late Sales / Pricing'],['5','5 · Contracting'],['6','6 · Executed'],['8','8 · Disqualified']] as const).map(([v,l]) => (
                <HmPill key={v} active={hmStage===v} onClick={() => setHmStage(v as StageFilter)}>{l}</HmPill>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main plot layout ── */}
      <div style={{ display: 'flex', padding: '20px 24px 0' }}>
        {/* Y-axis label (rotated) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 20, marginRight: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(26,31,78,0.55)', whiteSpace: 'nowrap',
            transform: 'rotate(-90deg)', transformOrigin: 'center center',
            display: 'block',
          }}>Outsourcing Consent Likelihood</span>
        </div>

        {/* Y band labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: 40, marginRight: 6, paddingTop: 4, paddingBottom: 4, flexShrink: 0 }}>
          {(['HIGH','MEDIUM','LOW'] as const).map(l => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                color: l === 'HIGH' ? '#1a6e1a' : l === 'MEDIUM' ? '#8a6a00' : '#a01020',
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Plot canvas area */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <div
            ref={plotRef}
            style={{ position: 'relative', height: 480, borderRadius: 8, overflow: 'visible' }}
          >
            {/* Canvas gradient */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 8, display: 'block' }} />

            {/* Dashed grid lines */}
            {[33.33, 66.67].map(p => (
              <React.Fragment key={`g${p}`}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, borderLeft: '1px dashed rgba(120,130,160,0.45)', zIndex: 1, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, borderTop: '1px dashed rgba(120,130,160,0.45)', zIndex: 1, pointerEvents: 'none' }} />
              </React.Fragment>
            ))}

            {/* Bubbles + name labels */}
            {plotted.map((c, i) => {
              const ar = whisperMode === 'post' && c.post
                ? { out: (c.post.out?.rating ?? c.out) as Rating, off: (c.post.off?.rating ?? c.off) as Rating }
                : { out: c.out, off: c.off }
              const diam = revTierDiam(c.rev)
              const score = overallScore(c, whisperMode)
              const xPct = bandXPct(ar.off as string, score)
              const yPct = bandYPct(ar.out as string, score)
              const isEMEA = c.region.startsWith('EMEA')
              const bubbleBg = isEMEA ? '#9aa0c0' : '#1a1f4e'
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 4,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  {/* Client name above */}
                  <div style={{
                    fontSize: 10.5, fontWeight: 600, color: '#1a1f4e',
                    whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(255,255,255,0.9)',
                    marginBottom: 2, textAlign: 'center',
                    maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {c.name}
                  </div>
                  {/* Bubble */}
                  <div
                    onMouseEnter={e => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setTooltip({ x: rect.left + diam / 2, y: rect.top, name: c.name, out: ar.out, off: ar.off, score })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: diam, height: diam, borderRadius: '50%',
                      background: bubbleBg,
                      border: `3px solid ${isEMEA ? '#c9ccdb' : '#fff'}`,
                      boxShadow: '0 3px 12px rgba(0,0,0,0.22)',
                      cursor: 'default',
                      flexShrink: 0,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* X band labels inside chart area — LOW / MEDIUM / HIGH */}
          <div style={{ display: 'flex', marginTop: 6 }}>
            {(['LOW','MEDIUM','HIGH'] as const).map((l, i) => (
              <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                  color: l === 'HIGH' ? '#1a6e1a' : l === 'LOW' ? '#a01020' : '#8a6a00',
                }}>{l}</span>
              </div>
            ))}
          </div>
          {/* X-axis main label */}
          <div style={{ textAlign: 'center', marginTop: 4, marginBottom: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.55)' }}>
            Offshoring Consent Likelihood
          </div>
        </div>
      </div>

      {/* ── Legend row ── */}
      <div style={{ padding: '14px 24px 18px', borderTop: '1px solid #eef0f6', display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
        {/* Stage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)' }}>Stage</span>
          {STAGE_LABELS.map(([, label, col]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Region */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 24, marginRight: 24 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)' }}>Region</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#1a1f4e' }} />
            <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.6)' }}>North America</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#9aa0c0' }} />
            <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.6)' }}>EMEA</span>
          </div>
        </div>
        {/* Revenue Tier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)' }}>Revenue Tier</span>
          {([[16,'< $1M'],[26,'$1M–5M'],[38,'$5M–10M'],[52,'$10M+']] as [number,string][]).map(([sz, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: sz, height: sz, borderRadius: '50%', background: '#c9ccdb', border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: 'rgba(26,31,78,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: 'fixed', top: tooltip.y - 8, left: tooltip.x, transform: 'translate(-50%, -100%)', zIndex: 9999, background: '#1a1f4e', color: '#fff', borderRadius: 8, padding: '9px 14px', fontSize: 12, pointerEvents: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.28)', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{tooltip.name}</div>
          <div style={{ opacity: 0.75, fontSize: 11 }}>Out: {tooltip.out} · Off: {tooltip.off} · Score: {tooltip.score !== null ? Math.round(tooltip.score) : '—'}</div>
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
      // In post-whisper mode only show clients that have whisper data
      if (whisperMode === 'post' && !c.post) return false
      const d = dealFilter === 'total' || dealFilter === c.dealType
      const w = waveFilter === 'all' || String(c.wave) === waveFilter
      const r = regionFilter === 'all' || (regionFilter === 'NA' ? c.region === 'NA' : c.region.startsWith('EMEA'))
      const s = stageFilter === 'all' || String(c.stage) === stageFilter
      const q = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
      return d && w && r && s && q
    })
  }, [whisperMode, dealFilter, waveFilter, regionFilter, stageFilter, search])

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
        <p style={{ fontSize: 13.5, color: 'rgba(26,31,78,0.55)', lineHeight: 1.65, marginBottom: 24, width: '100%' }}>
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
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>i</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>How the Overall Propensity Score is calculated</span>
            <span style={{ color: '#9aa0b8', fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{rationaleOpen ? '×' : '+'}</span>
          </button>
          {rationaleOpen && (
            <div style={{ padding: '0 22px 26px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13.5, color: '#4a5060', lineHeight: 1.7, margin: '18px 0 22px' }}>
                Each client is scored on four categories— Outsourcing, Offshoring, Digitization and Price. Each rating becomes a percentage, and the four are averaged into one 0–100 score.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Rating → Points */}
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '18px 22px', background: '#fafbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 16 }}>Rating → Points</div>
                  {([['High','100%'],['Medium','75%'],['Low','50%']] as const).map(([r, p], idx, arr) => (
                    <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #eef0f6' : 'none', fontSize: 13.5, color: '#1a1f4e' }}>
                      <span style={{ fontWeight: 700 }}>{r}</span>
                      <span style={{ fontWeight: 400, color: '#4a5060' }}>{p}</span>
                    </div>
                  ))}
                </div>
                {/* Score → Band */}
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '18px 22px', background: '#fafbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 16 }}>Score → Band</div>
                  {([['High','75 – 100'],['Medium','50 – 74'],['Low','under 50']] as const).map(([b, r], idx, arr) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #eef0f6' : 'none', fontSize: 13.5 }}>
                      <span style={{ fontWeight: 700, color: '#1a1f4e', minWidth: 64 }}>{b}</span>
                      <span style={{ color: '#4a5060' }}>{r}</span>
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
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>i</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>Category Rating Criteria (Post-Whisper)</span>
            <span style={{ color: '#9aa0b8', fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{criteriaOpen ? '×' : '+'}</span>
          </button>
          {criteriaOpen && (
            <div style={{ padding: '0 22px 26px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13.5, color: '#4a5060', lineHeight: 1.7, margin: '18px 0 22px' }}>
                How each lever is rated after the whisper conversation, based on trigger phrases and signals in the client&apos;s comments.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 900, fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e4ee' }}>
                      <th style={{ width: 90, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', padding: '0 14px 14px 0', textAlign: 'left' }}>Rating</th>
                      {(['Outsourcing','Offshoring','Digitization','Pricing'] as const).map(h => (
                        <th key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', padding: '0 14px 14px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* High */}
                    <tr style={{ borderBottom: '1px solid #eef0f6' }}>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1a6e1a' }}>High</span>
                      </td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness to further outsourcing, no objection to the model itself, and positive language toward the value proposition. Regulatory mentions are framed as considerations to manage, not blockers.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness across all service types with no named exclusions.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Clear enthusiasm or readiness for digital transformation, including interest in modernizing processes or contact-centre capabilities, with no stated hesitation or conditions.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>The client&apos;s existing pricing model already aligns with the proposed pricing structure, and discount expectations are in line with what can be offered.</td>
                    </tr>
                    {/* Medium */}
                    <tr style={{ borderBottom: '1px solid #eef0f6' }}>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#8a6a00' }}>Medium</span>
                      </td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness in principle, paired with an unresolved concern or condition that hasn&apos;t been ruled out yet, including external factors such as timing not being right.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness to specific service types, paired with an explicit exclusion in another area, including external factors such as timing not being right.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>General openness to digital transformation, but with conditions, timing concerns, or a preference for a phased / cautious approach before committing, including external factors such as timing not being right.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>A different pricing model is described, with no explicit resistance stated, or discount expectations are somewhat above what can be offered but not stated as a blocker.</td>
                    </tr>
                    {/* Low / No */}
                    <tr>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#a01020' }}>Low / No</span>
                      </td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Explicit rejection language with no qualifier or path forward.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Blanket rejection with no named area of openness.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Reluctance or resistance to digital transformation, preference to maintain current processes, or explicit concerns that outweigh interest in modernization.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Won&apos;t accept the pricing model, or high discount expectations that would not be accepted.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Heat-Map ── */}
        <HeatMap allClients={filtered} whisperMode={whisperMode} />

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
