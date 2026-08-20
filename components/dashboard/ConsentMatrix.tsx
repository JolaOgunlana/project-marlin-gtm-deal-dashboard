'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { clients } from '@/lib/data'

const EGGPLANT        = '#431C5B'
const EGGPLANT_BORDER = '#d3b8dd'

const rippleKeyframes = `
@keyframes cm-ripple-ring {
  0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cm-ripple-ring { animation: none !important; }
}
`

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
    out?:   { rating: Rating; rationale: string }
    off?:   { rating: Rating; rationale: string }
    dig?:   { rating: Rating; rationale: string }
    price?: { rating: Rating; rationale: string }
  }
  conv2?: {
    out?:   { rating: Rating; rationale: string }
    off?:   { rating: Rating; rationale: string }
    dig?:   { rating: Rating; rationale: string }
    price?: { rating: Rating; rationale: string }
  }
  // Visual-only nudge in percentage points applied only in pre-whisper view
  preNudgeX?: number
  preNudgeY?: number
  // Visual-only nudge in percentage points applied only in post-whisper view
  postNudgeX?: number
  postNudgeY?: number
  // Override the out/off rating used ONLY for heatmap quadrant positioning in post-whisper
  // (table continues to use post.out/off.rating)
  postPlotOut?: Rating
  postPlotOff?: Rating
  // Lock this client to its pre-whisper position in the post-whisper heatmap
  lockPostPosition?: boolean
  // Lock this client to its post-whisper position in the pre-whisper heatmap
  lockPrePosition?: boolean
  // Absolute % position in the post-whisper heatmap (overrides all dynamic calculation)
  absPostX?: number
  absPostY?: number
}

type SortKey = 'rev' | 'name' | 'deal' | 'region' | 'wave' | 'stage' | 'out' | 'off' | 'dig' | 'price' | 'overall'
type SortDir = 'asc' | 'desc'
type DealFilter = 'total' | 'existing' | 'new'
type WaveFilter = 'all' | '1' | '2' | '3'
type RegionFilter = 'all' | 'NA' | 'EMEA'
type StageFilter = 'all' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8'
type WhisperMode = 'pre' | 'post'

// ── Data ──────────────────────────────────────────────────────────────────
// CM_DATA contains consent-specific data. For the table, Client ID, Region,
// TMS Revenue, Wave and Stage are enriched at render time from the shared
// `clients` array in @/lib/data so they stay in sync with the GTM dashboard.
const CM_DATA: CMClient[] = [
  { name:"Virgin Money", id:"VM", rev:26229417, region:"EMEA-UK", dealType:"existing", wave:1, stage:3, out:"Medium", off:"Low", dig:"High", price:"Low",
    lockPostPosition: true, absPostX: 42, absPostY: 13,
    post:{
      out:{ rating:"High", rationale:'They are open to further outsourcing and did not express any concerns regarding Genpact. While they are not a current user, they have engaged with them previously. There are concerns around introducing additional layers of "material outsourcing" under PRA regulation. The opportunity to access more modernised technical capabilities (e.g. AI), funded by FIS, resonated well. Maintaining existing day-to-day relationship ownership was positively received.' },
      off:{ rating:"Medium", rationale:'Offshore voice support is a clear "red light". It was stated that they cannot envisage a future where voice services would move offshore. Given the ongoing Nationwide/Virgin Money integration, any offshoring would be viewed as additional customer disruption. However, they are open to exploring offshoring for chat and operational activities.' },
      dig:{ rating:"High", rationale:"Strong appetite for digitization and automation across servicing workflows; leadership actively sponsoring the agenda." },
      price:{ rating:"High", rationale:"They already operate on a TCO model, so a subscription-based, predictable pricing structure would align with expectations." }
    }},
  { name:"Deutsche Bank (Hamburg)", id:"", rev:16362300, region:"EMEA-HH", dealType:"existing", wave:3, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"Fifth Third Bank", id:"5685", rev:13558253, region:"NA", dealType:"existing", wave:1, stage:3, out:"High", off:"Medium", dig:"High", price:"Medium",
    preNudgeY: 13.335, postPlotOff: "High", lockPostPosition: true, absPostX: 53, absPostY: 13,
    post:{
      out:{ rating:"High", rationale:"The overall message was received well with little resistance and candid feedback provided. He sees the logic in outsourcing to a provider that shores up much of our operational risk and traditional shortcomings — specifically scalability and lacking technology." },
      off:{ rating:"Medium", rationale:"His initial and largest concern is the low-cost location component. He advised this will more than likely present some legal challenges as well as business ops challenges. Through the operational lens, he is concerned about degradation of voice services specifically, with little to no concern on offshoring any and all back-office/non-voice work." },
      dig:{ rating:"High", rationale:"He is comfortable injecting more tech into our front ends and processes but admits this will have to be thoroughly proven prior to 5/3 moving forward." },
      price:{ rating:"Medium", rationale:"Other than John understanding it is a price-neutral move with us assuming cost for the tech in conjunction with low-cost location, he had no comment relative to pricing." }
    }},
  { name:"Metro Bank", id:"METRO", rev:11793783, region:"EMEA-UK", dealType:"existing", wave:1, stage:3, out:"High", off:"High", dig:"High", price:"Low",
    lockPostPosition: true, absPostX: 84, absPostY: 13,
    post:{
      out:{ rating:"High", rationale:"The transformation concept, using a scale player like Genpact, landed well." },
      off:{ rating:"High", rationale:"Open to offshoring voice in principle, but wants small steps to prove the concept first." },
      dig:{ rating:"High", rationale:"No specific digitization learning captured." },
      price:{ rating:"Low", rationale:"Are costs going up? How is pricing affected?" }
    }
  },
  { name:"UMB", id:"9463", rev:9913772, region:"NA", dealType:"existing", wave:1, stage:3, out:"Low", off:"Low", dig:"Medium", price:"Low",
    preNudgeX: -2.665, lockPostPosition: true, absPostX: 78, absPostY: 17, lockPrePosition: true, absPreX: 15, absPreY: 80,
    post:{
      out:{ rating:"High", rationale:"The concept was not rejected outright, which is encouraging given the expected sensitivity around the topic. Uma appeared to recognize the value of aligning with the broader operating model rather than pursuing a unique solution for UMB." },
      off:{ rating:"High", rationale:"Offshoring was a primary area of focus. We confirmed that voice operations would be supported from the Philippines and off-phone/back-office activities from India." },
      dig:{ rating:"Medium", rationale:"Technology Modernization identified as the most likely near-term opportunity, with potential to expand into other digitization initiatives." },
      price:{ rating:"Medium", rationale:"Challenged concept of maintaining current economics while offshoring." }
    },
    postPlotOut: "High",
    conv2:{
      out:{ rating:"High", rationale:"1) Recently involved in several outsourcing reviews across the business. 2) Currently exploring opportunities with Infosys in other areas. 3) Very positive on Genpact selection and believes they have the capability and credibility to deliver. 4) Strong receptivity to outsourcing discussion demonstrated." },
      off:{ rating:"Medium", rationale:"1) Exploring offshore model opportunities. 2) Some level of offshore implementation being considered. 3) Technology Modernization identified as most likely near-term opportunity. 4) Potential to expand offshore scope from initial engagement." },
      dig:{ rating:"Medium", rationale:"1) Technology Modernization identified as primary near-term opportunity. 2) Potential for expansion to other digitization initiatives. 3) Technology capabilities viewed as key differentiator in vendor selection. 4) Forward-looking on modern technology implementation." },
      price:{ rating:"Medium", rationale:"1) Challenged concept of maintaining current economics while offshoring. 2) Benchmark work from other outsourcing efforts suggests our pricing may be too high. 3) Comparison of current onshore rates to market pricing and prospective vendor rates provided as counterpoint. 4) Pricing concern expected to resurface during formal discussions; no resolution at this point." }
    }},
  { name:"Lloyds", id:"LLOYDS", rev:9103883, region:"EMEA-UK", dealType:"existing", wave:1, stage:3, out:"High", off:"Medium", dig:"High", price:"Low",
  absPostX: 55, absPostY: 2,
  post:{
      out:{ rating:"High", rationale:"The transformation concept and outsourcing opportunity are being evaluated." },
      off:{ rating:"Medium", rationale:"Open to offshoring as part of the operating model." },
      dig:{ rating:"High", rationale:"Strong interest in digitization and automation." },
      price:{ rating:"Low", rationale:"Pricing remains a point to address." }
    }
  },
  { name:"UBS Financial Services Inc.", id:"7826", rev:8332814, region:"NA", dealType:"existing", wave:1, stage:3, out:"Medium", off:"Low", dig:"Medium", price:"High" },
  { name:"PNC Bank", id:"", rev:5143978, region:"NA", dealType:"existing", wave:3, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low" },
  { name:"ING (BV / Barneveld)", id:"", rev:4502484, region:"EMEA-BV", dealType:"existing", wave:2, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"Synovus Bank (incl. Business)", id:"", rev:3577829, region:"NA", dealType:"existing", wave:3, stage:1, out:"Low", off:null, dig:null, price:null },
  { name:"Centene Corporation", id:"7697", rev:3489339, region:"NA", dealType:"existing", wave:1, stage:3, out:"High", off:"Medium", dig:"High", price:"High" },
  { name:"HSBC Technology & Services (USA)", id:"9368", rev:2876755, region:"NA", dealType:"existing", wave:1, stage:3, out:"Medium", off:"High", dig:"High", price:"Medium" },
  { name:"First Hawaiian Bank", id:"", rev:1836975, region:"NA", dealType:"existing", wave:2, stage:1, out:"High", off:"High", dig:null, price:null },
  { name:"Arvest", id:"", rev:2022941, region:"NA", dealType:"existing", wave:2, stage:1, out:"High", off:"High", dig:"Medium", price:"Low" },
  { name:"AIB", id:"AIB", rev:1827370, region:"EMEA-UK", dealType:"existing", wave:1, stage:2, out:"Medium", off:"Low", dig:"Medium", price:"Low",
    post:{
      out:{ rating:"High", rationale:"They've had no previous engagement with Genpact, however are open to outsourcing and again did not express any concerns. The potential enhanced technical capabilities would be welcomed. John doesn't have an existing relationship with TMS so this wasn't discussed. However, TMS has a very strong relationship with the AIB Customer Engagement team and would be keen for this to remain in place." },
      off:{ rating:"High", rationale:"There were no objections to offshore voice support." },
      dig:{ rating:"Medium", rationale:"N/A" },
      price:{ rating:"High", rationale:"AIB would be open to discuss a subscription-based pricing structure." }
    },
    lockPostPosition: true, absPostX: 78, absPostY: 8,
  },
  { name:"Hancock-Whitney Bank", id:"", rev:1703235, region:"NA", dealType:"existing", wave:2, stage:1, out:"Low", off:null, dig:null, price:null },
  { name:"Simmons Bank", id:"0149+7805+7873", rev:1634077, region:"NA", dealType:"existing", wave:1, stage:2, out:"High", off:"High", dig:"High", price:"Medium",
    post:{
      out:{ rating:"High", rationale:"Questioned options if they are not able to agree to off-shore/outsource. Plan to go into more detail at pitch and address questions or specifics when the time comes." },
      off:{ rating:"High", rationale:"Not surprised by request and generally open to the idea from a Business POV, but has concerns legal team reaction. Generally conservative when it comes to offshore support." },
      dig:{ rating:"High", rationale:"N/A" },
      price:{ rating:"Medium", rationale:"N/A" }
    },
    lockPostPosition: true, absPostX: 84, absPostY: 22, lockPrePosition: true, absPreX: 86, absPreY: 22,
  },
  { name:"Mission Lane", id:"", rev:99655, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"First Bank Puerto Rico", id:"444", rev:1610916, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Medium", dig:"High", price:"Medium" },
  { name:"Capital One", id:"", rev:1553245, region:"NA", dealType:"existing", wave:2, stage:1, out:"Medium", off:null, dig:null, price:null },
  { name:"Degussa (Hamburg) / OLB", id:"", rev:1374601, region:"EMEA-HH", dealType:"existing", wave:3, stage:1, out:"Medium", off:"Low", dig:"High", price:"Low" },
  { name:"TDNA", id:"6899", rev:1461484, region:"NA", dealType:"existing", wave:3, stage:1, out:"Medium", off:"Low", dig:"Low", price:"Medium" },
  { name:"Brim Financial", id:"9159", rev:1057228, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Low", dig:"High", price:"Low" },
  { name:"US Bank (BV / Barneveld)", id:"", rev:1151833, region:"EMEA-BV", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Fairstone Bank of Canada", id:"", rev:978405, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Marlette Funding / Best Egg", id:"", rev:859588, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"M & T Bank", id:"", rev:337396, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Central Trust Bank", id:"", rev:864644, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"City National Bank", id:"", rev:732080, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Truist Bank", id:"", rev:717090, region:"NA", dealType:"existing", wave:2, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"Low" },
  { name:"Rogers Bank", id:"", rev:268907, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Jaja Finance", id:"", rev:1444530, region:"EMEA-UK", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:"Low", price:null },
  { name:"Regions Financial Corporation", id:"", rev:567870, region:"NA", dealType:"existing", wave:3, stage:1, out:"Low", off:"Low", dig:"Low", price:"Low" },
  { name:"ServisFirst", id:"7841", rev:555696, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"High", price:"High" },
  { name:"President's Choice", id:"7607", rev:469862, region:"NA", dealType:"existing", wave:1, stage:2, out:"High", off:"High", dig:"High", price:"High",
    post:{
      out:{ rating:"High", rationale:"Will also need to be mindful of the fourth party element, would still need to have the right governance around that oversight, audit rights would be a discussion given cardholder data would be in play." },
      off:{ rating:"High", rationale:"Offshoring is not a concern for PCF, they do it today; although their new owner, EQ Bank, is completely in-house, which he mentioned is costly, so EQ is cautiously evaluating options within that area. What sets TMS apart is that the agents were located in Canada. This has always been beneficial, and would still be meaningful for PCF. Within PCF's other servicing experience with other providers (likely NTT), customers will sometimes say \"put me to an agent in Canada\" so they keep a 15% population of agents that are Canadian." },
      dig:{ rating:"High", rationale:"It makes sense that FIS and TMS are looking into investments, technology investment has not been prevalent with TMS. Open to the investment in technology, would be interested in understanding what the different experiences/use cases would be for outbound fraud, which is the only service PCF uses with TMS today." },
      price:{ rating:"High", rationale:"Acknowledging the offshoring offsets the cost of technology investment, value for not changing the price would need to be discussed. Unless FIS is able to add technology that really increases the experience for the specific service PCF uses (outbound fraud), then PCF would question why the price would not decrease. Example - If we can attempt more phone calls given the technology, then that would be \"cool\"; there are only so many agent-led calls that can be made in a day, which they have observed in the past with TMS. An example could be if the first part of the call is automation and then press 1 to talk to an agent if needed. Would still need to vet if we want to do this, but it's an example where tech could add value." }
    },
    lockPostPosition: true, absPostX: 90, absPostY: 8, lockPrePosition: true, absPreX: 90, absPreY: 17,
  },
  { name:"Santander Bank", id:"", rev:485904, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Royal Bank Of Canada", id:"", rev:477860, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Texas Capital", id:"", rev:364725, region:"NA", dealType:"existing", wave:3, stage:3, out:null, off:null, dig:null, price:null },
  { name:"Wells Fargo", id:"", rev:414000, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Marshall and Ilsley (BMO)", id:"164", rev:380045, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Key Bank", id:"", rev:376815, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Union Bank (MUFG)", id:"8470", rev:331182, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"High", dig:"High", price:"High" },
  { name:"Citizens Bank", id:"6053", rev:330550, region:"NA", dealType:"existing", wave:1, stage:1, out:"Low", off:"Low", dig:"Medium", price:"Low" },
  { name:"BOKF, NA", id:"", rev:265301, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Bank Of America", id:"", rev:307350, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Banco Popular", id:"", rev:238800, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"The Bank Of Nova Scotia", id:"2280", rev:225000, region:"NA", dealType:"existing", wave:1, stage:1, out:"Medium", off:"Low", dig:"Medium", price:"Low" },
  { name:"IVR BOA", id:"", rev:160907, region:"EMEA-UK", dealType:"existing", wave:2, stage:1, out:"Medium", off:"Medium", dig:"Low", price:"Medium" },
  { name:"Navy Federal Credit Union", id:"", rev:151400, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Vancouver City Savings Credit", id:"", rev:132600, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Citibank", id:"1410", rev:106021, region:"NA", dealType:"existing", wave:1, stage:1, out:"High", off:"Medium", dig:"Medium", price:"Low" },
  { name:"First Caribbean International Bank", id:"", rev:96000, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Bank of Montreal", id:"", rev:94334, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Valley National BK", id:"", rev:81938, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Ameriprise Trust Bank", id:"", rev:62220, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"NatWest", id:"IVRRBS", rev:25243, region:"EMEA-UK", dealType:"existing", wave:3, stage:2, out:"Medium", off:"Medium", dig:"Medium", price:"High", lockPrePosition:true, lockPostPosition:true, absPostX: 81, absPostY: 26,
    post:{
      out:{ rating:"High", rationale:"Reassurance provided that the very reliable current IVR service will remain reliable. Not allergic to the idea of a new provider provided the appropriate checks and approvals are in place. However, as expected, Ailsa viewed this as a possible opportunity to take the final IVR back in house and terminate our service." },
      off:{ rating:"High", rationale:"Offshoring not applicable." },
      dig:{ rating:"Medium", rationale:"" },
      price:{ rating:"High", rationale:"" }
    }},
  { name:"Empire Innovation Group", id:"9018", rev:25200, region:"NA", dealType:"existing", wave:1, stage:1, out:null, off:null, dig:null, price:null },
  { name:"San Diego County Credit Union", id:"", rev:18780, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
  { name:"MotivHealth", id:"9414", rev:10500, region:"NA", dealType:"existing", wave:1, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Commerce Bank Of Kansas City", id:"", rev:7800, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Pitney Bowes Credit Corp", id:"", rev:7620, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Acclaris, Inc.", id:"", rev:5400, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Wright Express Financial Serv", id:"", rev:3120, region:"NA", dealType:"existing", wave:3, stage:1, out:null, off:null, dig:null, price:null },
  { name:"Chase Corporate Card (JP Morgan)", id:"", rev:2400, region:"NA", dealType:"existing", wave:2, stage:1, out:null, off:null, dig:null, price:null },
]

// ── Helpers ─────────────────────��───────���────────────────��������──����─────────────
const RATING_SCORE: Record<string, number> = { High: 100, Medium: 75, Low: 50 }
const ratingScore = (r: Rating) => (r ? (RATING_SCORE[r] ?? 0) : 0)
const overallScore = (c: CMClient, mode: WhisperMode) => {
  const levers = mode === 'post' && c.post
    ? [c.post.out?.rating ?? c.out, c.post.off?.rating ?? c.off, c.post.dig?.rating ?? c.dig, c.post.price?.rating ?? c.price]
    : [c.out, c.off, c.dig, c.price]
  if (levers.some(r => !r)) return null
  return levers.reduce((s, r) => s + ratingScore(r as Rating), 0) / levers.length
}
const scoreBand = (s: number | null): Rating => {
  if (s === null) return null
  if (s >= 75) return 'High'
  if (s >= 50) return 'Medium'
  return 'Low'
}
const fmtRev = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 100_000)   return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000)    return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${(n / 1_000_000).toFixed(3)}M`
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
  return '#4bcd3e'
}

// ── Sub-components ─────────────────────────────────────────────────────────
function NotEnoughSignals() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 9px', borderRadius: 7,
      background: '#f0f1f5', color: 'rgba(26,31,78,0.45)',
      fontSize: 10.5, fontStyle: 'italic', fontWeight: 500,
      whiteSpace: 'nowrap', border: '1.5px solid transparent',
    }}>
      Not enough signals
    </span>
  )
}

function RatingPill({ rating, onClick, active, noSignals }: { rating: Rating; onClick?: () => void; active?: boolean; noSignals?: boolean }) {
  if (!rating) return noSignals ? <NotEnoughSignals /> : <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    High: { bg: '#e9fbe6', color: '#1d6b12', dot: '#4bcd3e' },
    Medium: { bg: '#f0f1f5', color: '#6f7d94', dot: '#6f7d94' },
    Low: { bg: '#fce8ef', color: '#8a1040', dot: '#B21A53' },
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

function OverallScore({ score, noSignals }: { score: number | null; noSignals?: boolean }) {
  if (score === null) return noSignals ? <NotEnoughSignals /> : <span style={{ color: 'rgba(26,31,78,0.35)', fontStyle: 'italic', fontSize: 11 }}>—</span>
  const band = scoreBand(score)
    const barColor = band === 'High' ? '#4bcd3e' : band === 'Medium' ? '#6f7d94' : '#B21A53'
    const badgeBg = band === 'High' ? '#e9fbe6' : band === 'Medium' ? '#E6E7E8' : '#fce8ef'
    const badgeColor = band === 'High' ? '#1d6b12' : band === 'Medium' ? '#3d4455' : '#8a1040'
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '6px 13px', borderRadius: 8, background: badgeBg, color: badgeColor, fontSize: 12.5, fontWeight: 800, minWidth: 90 }}>
        {Math.round(score)}
        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{band}</span>
      </span>
      <div style={{ width: 90, height: 7, background: '#e8eaf2', borderRadius: 99, overflow: 'hidden' }}>
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
// Within a quadrant, clients are spread using their overall propensity score
// normalised *relative to the min/max scores inside that same quadrant*,
// so the full interior of every quadrant is always used.
// A fixed margin keeps bubbles off the dashed grid lines.
const BAND_SIZE = 33.33
const BAND_MARGIN = 6 // % of total axis to inset from each quadrant edge — keeps largest bubble (52px) clear of borders and grid lines

const BAND_LEFT: Record<string, number> = { Low: 0, Medium: 33.33, High: 66.67 }
const BAND_TOP: Record<string, number>  = { High: 0, Medium: 33.33, Low: 66.67 }

// Given a normalised value t ∈ [0,1], return % position within the band
const inBandX = (band: string, t: number): number => {
  const start = (BAND_LEFT[band] ?? 33.33) + BAND_MARGIN
  return start + (BAND_SIZE - 2 * BAND_MARGIN) * t
}
const inBandY = (band: string, t: number): number => {
  const start = (BAND_TOP[band] ?? 33.33) + BAND_MARGIN
  // higher t → higher up → smaller Y%
  return start + (BAND_SIZE - 2 * BAND_MARGIN) * (1 - t)
}

// Pre-compute per-quadrant score ranges so we can normalise within each quadrant
type QuadrantKey = string // `${outBand}-${offBand}`
const computeQuadrantRanges = (clients: CMClient[], mode: WhisperMode) => {
  const ranges: Record<QuadrantKey, { min: number; max: number }> = {}
  clients.forEach(c => {
    const ar = mode === 'post' && c.post
      ? { out: c.post.out?.rating ?? c.out, off: c.post.off?.rating ?? c.off }
      : { out: c.out, off: c.off }
    if (!ar.out || !ar.off) return
    const s = overallScore(c, mode)
    if (s === null) return
    const key: QuadrantKey = `${ar.out}-${ar.off}`
    if (!ranges[key]) ranges[key] = { min: s, max: s }
    else { ranges[key].min = Math.min(ranges[key].min, s); ranges[key].max = Math.max(ranges[key].max, s) }
  })
  return ranges
}

const STAGE_COLOR: Record<string, string> = {
  0: '#c9ccdb',   // grey
  1: '#4f8ef7',   // cornflower blue
  2: '#06b6d4',   // cyan
  3: '#8b5cf6',   // purple
  4: '#f59e0b',   // amber
  5: '#14b8a6',   // teal
  6: '#22c55e',   // green
  8: '#B21A53',   // raspberry
}
const STAGE_LABELS: [string, string, string][] = [
  ['1','1 · New Opportunity','#4f8ef7'],
  ['2','2 · Early Sales','#06b6d4'],
  ['3','3 · Mid Sales','#8b5cf6'],
  ['4','4 · Late Sales / Pricing','#f59e0b'],
  ['5','5 · Contracting','#14b8a6'],
  ['6','6 · Executed','#22c55e'],
  ['8','8 · Disqualified','#B21A53'],
]
const revTierDiam = (rev: number) => rev >= 10e6 ? 52 : rev >= 5e6 ? 38 : rev >= 1e6 ? 26 : 16



// ── PlotArea: renders gradient canvas + grid + bubbles with collision-free labels ──
const LABEL_H = 14   // px height of each label line
const LABEL_CHAR_W = 6 // approximate px per character at font-size 10.5

interface TooltipInfo {
  x: number
  y: number
  client: CMClient
  whisperMode: WhisperMode
}

interface PlotAreaProps {
  plotRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  allClients: CMClient[]
  plotted: CMClient[]
  whisperMode: WhisperMode
  quadrantRanges: Record<string, { min: number; max: number }>
  setTooltip: (t: TooltipInfo | null) => void
}

function PlotArea({ plotRef, canvasRef, allClients, plotted, whisperMode, quadrantRanges, setTooltip }: PlotAreaProps) {
  const PLOT_H = 640
  const REF_W = 1200 // reference px width for label collision maths

  type BubbleData = {
    c: CMClient
    ar: { out: Rating; off: Rating }
    score: number | null
    diam: number
    isEMEA: boolean
    bubbleBg: string
    stage: number
    xPct: number
    yPct: number
    labelAbove: boolean
    labelOffsetPx: number
  }

  // ── Step 1a: pre-compute pre-whisper positions for locked clients ───────────
  // Compute locked clients' positions from the FULL pre-whisper dataset so the
  // result is never affected by which clients happen to be in the current
  // post-whisper `plotted` list or its derived quadrant ranges.
  const preBase = useMemo(() => {
    // Use absolute post positions when provided — these are immune to any
    // changes in the post-whisper client roster or quadrant ranges.
    return allClients.filter(c => c.lockPostPosition).map(c => ({
      name: c.name,
      xPct: c.absPostX ?? 50,
      yPct: c.absPostY ?? 50,
    }))
  }, [allClients])

  // Compute locked clients' post-whisper coordinates to pin them in pre-whisper view.
  // We build a temporary full post-whisper base (mirroring what PlotArea would render
  // in post mode) so the position is pixel-perfect — same quadrant ranges, same fanning.
  const postBase = useMemo(() => {
    return allClients.filter(c => c.lockPrePosition && c.post).map(c => ({
      name: c.name,
      xPct: c.absPreX ?? 50,
      yPct: c.absPreY ?? 50,
    }))
  }, [allClients])

  // ── Step 1: base positions from overall propensity within quadrant ─────────
  const base = plotted.map(c => {
    const ar = whisperMode === 'post' && c.post
      ? { out: (c.postPlotOut ?? c.post.out?.rating ?? c.out) as Rating, off: (c.postPlotOff ?? c.post.off?.rating ?? c.off) as Rating }
      : { out: c.out, off: c.off }
    const scoreForPos = overallScore(c, whisperMode) ?? 50
    const qKey = `${ar.out}-${ar.off}`
    const qRange = quadrantRanges[qKey] ?? { min: scoreForPos, max: scoreForPos }
    const t = qRange.max > qRange.min ? (scoreForPos - qRange.min) / (qRange.max - qRange.min) : 0.5
    const isEMEA = c.region.startsWith('EMEA')
    const lockedPost = whisperMode === 'post' && c.lockPostPosition
      ? preBase.find(p => p.name === c.name)
      : null
    const lockedPre = whisperMode === 'pre' && c.lockPrePosition
      ? postBase.find(p => p.name === c.name)
      : null
    const locked = lockedPost ?? lockedPre ?? null

    return {
      c, ar,
      score: overallScore(c, whisperMode),
      diam: revTierDiam(c.rev),
      isEMEA,
      bubbleBg: '#1a1f4e',
      stage: c.stage,
      xPct: locked ? locked.xPct : inBandX(ar.off as string, t) + (whisperMode === 'post' ? (c.postNudgeX ?? 0) : (c.preNudgeX ?? 0)),
      yPct: locked ? locked.yPct : inBandY(ar.out as string, t) + (whisperMode === 'post' ? (c.postNudgeY ?? 0) : (c.preNudgeY ?? 0)),
      lockPos: !!locked,
    }
  })

  // ── Step 2: horizontal fanning for ties ────────────────────────────────────
  // Clients sharing the exact same (out, off, score) fan out horizontally
  // so they sit side-by-side rather than stacking. Y stays identical so they
  // remain visually "at the same level" — exactly like the reference image.
  const tieKey = (b: typeof base[0]) => {
    // Locked clients get a unique key so they never join a fan group
    if (b.lockPos) return `__locked__${b.c.name}`
    return `${b.ar.out}-${b.ar.off}-${Math.round((overallScore(b.c, whisperMode) ?? 50) * 2) / 2}`
  }

  // Count group sizes first
  const groupCount: Record<string, number> = {}
  base.forEach(b => { const k = tieKey(b); groupCount[k] = (groupCount[k] ?? 0) + 1 })

  // Assign horizontal index within each group
  const groupIdx: Record<string, number> = {}
  const FAN_STEP_PCT = 2.8 // % horizontal spacing between tie buddies

  const final: BubbleData[] = base.map(b => {
    const k = tieKey(b)
    const idx = groupIdx[k] ?? 0
    groupIdx[k] = idx + 1
    const count = groupCount[k]

    // Centre the fan: offset = (idx - (count-1)/2) * FAN_STEP_PCT
    const xOffset = count > 1 ? (idx - (count - 1) / 2) * FAN_STEP_PCT : 0
    const xPct = Math.max(4, Math.min(96, b.xPct + xOffset))

    return { ...b, xPct, labelAbove: true, labelOffsetPx: 0 }
  })

  // ── Step 3: label collision resolution ─────────────────────────��──────────
  // Try 6 candidate positions per label (above, below, right, left, top-right, top-left).
  // Place in the first non-overlapping slot; fall back to least-overlap option.
  type LabelRect = { left: number; right: number; top: number; bottom: number; labelAbove: boolean; labelOffsetPx: number }
  const placedLabels: LabelRect[] = []

  const overlaps = (a: LabelRect, b: LabelRect) =>
    a.left < b.right + 2 && a.right > b.left - 2 && a.top < b.bottom + 2 && a.bottom > b.top - 2

  const resolved = final.map(b => {
    const cx = (b.xPct / 100) * REF_W
    const cy = (b.yPct / 100) * PLOT_H
    const labelW = Math.min(b.c.name.length * LABEL_CHAR_W + 4, 150)
    const halfW = labelW / 2
    const r = b.diam / 2 + 4

    // Candidate positions: above, below, top-right, top-left, right, left
    const candidates: LabelRect[] = [
      { left: cx - halfW, right: cx + halfW, top: cy - r - LABEL_H, bottom: cy - r, labelAbove: true,  labelOffsetPx: 0 },
      { left: cx - halfW, right: cx + halfW, top: cy + r,            bottom: cy + r + LABEL_H, labelAbove: false, labelOffsetPx: 0 },
      { left: cx + r * 0.5,         right: cx + r * 0.5 + labelW, top: cy - r - LABEL_H, bottom: cy - r, labelAbove: true, labelOffsetPx: r * 0.5 + halfW },
      { left: cx - r * 0.5 - labelW,right: cx - r * 0.5, top: cy - r - LABEL_H, bottom: cy - r, labelAbove: true, labelOffsetPx: -(r * 0.5 + halfW) },
      { left: cx + r,  right: cx + r + labelW, top: cy - LABEL_H / 2, bottom: cy + LABEL_H / 2, labelAbove: true, labelOffsetPx: r + halfW },
      { left: cx - r - labelW, right: cx - r,  top: cy - LABEL_H / 2, bottom: cy + LABEL_H / 2, labelAbove: true, labelOffsetPx: -(r + halfW) },
    ]

    // Find first candidate with no overlaps
    let chosen = candidates[0]
    for (const cand of candidates) {
      const inBounds = cand.top >= 0 && cand.bottom <= PLOT_H && cand.left >= 0 && cand.right <= REF_W
      const noOverlap = !placedLabels.some(p => overlaps(p, cand))
      if (noOverlap && inBounds) { chosen = cand; break }
    }
    // If none is clean, pick least-overlapping candidate
    if (!chosen) {
      chosen = candidates.reduce((best, cand) => {
        const count = placedLabels.filter(p => overlaps(p, cand)).length
        const bestCount = placedLabels.filter(p => overlaps(p, best)).length
        return count < bestCount ? cand : best
      }, candidates[0])
    }

    placedLabels.push(chosen)
    return { ...b, labelAbove: chosen.labelAbove, labelOffsetPx: chosen.labelOffsetPx }
  })

  return (
    <>
      <div
        ref={plotRef}
        style={{ position: 'relative', height: PLOT_H, borderRadius: 8, overflow: 'hidden' }}
      >
        {/* Canvas gradient */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 8, display: 'block' }} />

        {/* Dashed grid lines */}
        {[33.33, 66.67].map(p => (
          <React.Fragment key={`g${p}`}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, borderLeft: '1px dashed rgba(120,130,160,0.5)', zIndex: 1, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, borderTop: '1px dashed rgba(120,130,160,0.5)', zIndex: 1, pointerEvents: 'none' }} />
          </React.Fragment>
        ))}

        {/* Hover discovery hint chip — top-left, never blocks bubbles */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px 6px 9px',
            borderRadius: 999,
            background: '#f2ebf5',
            border: '1.5px solid #d3b8dd',
            boxShadow: '0 3px 12px rgba(67,28,91,0.10)',
          }}
        >
          {/* Eye icon with blink animation */}
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <style>{`
              @keyframes eye-blink {
                0%, 88%  { transform: scaleY(1); }
                92%      { transform: scaleY(0.08); }
                96%      { transform: scaleY(1); }
                100%     { transform: scaleY(1); }
              }
              @media (prefers-reduced-motion: reduce) {
                .eye-lid { animation: none !important; }
              }
            `}</style>
            {/* Eyelid almond path — animates the blink */}
            <path
              className="eye-lid"
              d="M2 10 C5 4.5 15 4.5 18 10 C15 15.5 5 15.5 2 10 Z"
              stroke="#431C5B"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill="none"
              style={{
                transformOrigin: '50% 50%',
                transformBox: 'fill-box',
                animation: 'eye-blink 3.4s ease-in-out infinite',
              }}
            />
            {/* Pupil */}
            <circle cx="10" cy="10" r="2.4" fill="#431C5B" />
          </svg>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#431C5B', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
            Hover over any bubble to see client details
          </span>
        </div>

        {/* Bubbles + collision-resolved name labels */}
        {resolved.map((b, i) => {
          const { c, xPct, yPct, diam, score, ar, bubbleBg, isEMEA, stage, labelAbove, labelOffsetPx } = b
          const labelGap = diam / 2 + 4
          // Stage color ring wraps the bubble fill
          const stageRingColor = STAGE_COLOR[String(stage)] ?? '#c9ccdb'
          return (
            <React.Fragment key={i}>
              {/* Label */}
              <div
                onMouseEnter={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setTooltip({ x: rect.right + 8, y: rect.top, client: c, whisperMode })
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{
                position: 'absolute',
                left: `calc(${xPct}% + ${labelOffsetPx > 0 ? labelGap : labelOffsetPx < 0 ? -labelGap : 0}px)`,
                top: labelAbove
                  ? `calc(${yPct}% - ${labelGap + LABEL_H}px)`
                  : `calc(${yPct}% + ${labelGap}px)`,
                transform: labelOffsetPx === 0 ? 'translateX(-50%)' : labelOffsetPx > 0 ? 'translateX(0)' : 'translateX(-100%)',
                fontSize: 10.5, fontWeight: 600, color: '#1a1f4e',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 4px rgba(255,255,255,0.98), 0 0 8px rgba(255,255,255,0.98)',
                zIndex: 5,
                cursor: 'default',
                maxWidth: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: `${LABEL_H}px`,
              }}>
                {c.name}
              </div>

              {/* Bubble — filled circle with region color */}
              <div
                onMouseEnter={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setTooltip({ x: rect.right + 8, y: rect.top, client: c, whisperMode })
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{
                  position: 'absolute',
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform: 'translate(-50%, -50%)',
                  width: diam, height: diam, borderRadius: '50%',
                  background: bubbleBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  cursor: 'default',
                  zIndex: 4,
                  flexShrink: 0,
                }}
              />

            </React.Fragment>
          )
        })}
      </div>

      {/* X band labels */}
      <div style={{ display: 'flex', marginTop: 6 }}>
        {(['LOW','MEDIUM','HIGH'] as const).map(l => (
          <div key={l} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
              color: l === 'HIGH' ? '#1d6b12' : l === 'LOW' ? '#8a1040' : '#3d4455',
            }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 8, fontSize: 13, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.78)' }}>
        Offshoring Consent Likelihood
      </div>
    </>
  )
}

function HeatMap({ allClients, whisperMode, dealFilter, setDealFilter, waveFilter, setWaveFilter, regionFilter, setRegionFilter, stageFilter, setStageFilter }: HeatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null)

  // Own filter state inside the heatmap card
  const [hmDeal, setHmDeal] = useState<DealFilter>('total')
  const [hmWave, setHmWave] = useState<WaveFilter>('all')
  const [hmRegion, setHmRegion] = useState<RegionFilter>('all')
  const [hmStage, setHmStage] = useState<StageFilter>('all')

  // Pre-compute per-quadrant score ranges (used for intra-quadrant normalisation)
  // Always compute ranges using pre-whisper ratings as the stable baseline so
  // clients whose pre and post ratings are identical stay in the same position.
  const quadrantRanges = useMemo(
    () => computeQuadrantRanges(allClients, 'pre'),
    [allClients]
  )

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

  // Canvas background: flat secondary grey (#E6E7E8)
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
        // Near-white light grey: #F7F7F8 = rgb(247, 247, 248)
        const r = 247, g = 247, b = 248
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

  const [boxHovered, setBoxHovered] = useState(false)
  const [hoveredPill, setHoveredPill] = useState<string | null>(null)

  const HmPill = ({ active, onClick, children, id }: { active: boolean; onClick: () => void; children: React.ReactNode; id: string }) => {
    const isHovered = hoveredPill === id
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredPill(id)}
        onMouseLeave={() => setHoveredPill(null)}
        style={{
          fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          padding: '6px 13px', borderRadius: 999,
          border: '1.5px solid',
          borderColor: active ? '#1a1f4e' : isHovered ? EGGPLANT : '#e2e4ee',
          background: active ? '#1a1f4e' : 'transparent',
          color: active ? '#fff' : isHovered ? EGGPLANT : 'rgba(26,31,78,0.45)',
          cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1,
          transform: !active && isHovered ? 'translateY(-2px)' : 'none',
          boxShadow: !active && isHovered ? `0 4px 10px rgba(67,28,91,0.18)` : 'none',
          transition: 'all 0.18s ease',
          outline: 'none',
        }}
      >{children}</button>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>

      {/* ── Header row: title left, filters right ── */}
      <style>{rippleKeyframes}</style>
      <div style={{ padding: '18px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>

          {/* Left: title only */}
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1f4e', whiteSpace: 'nowrap', paddingTop: 2 }}>
            Consent Propensity Heat-Map
          </div>

          {/* Right: hover-reveal filter cluster */}
          <div
            onMouseEnter={() => setBoxHovered(true)}
            onMouseLeave={() => setBoxHovered(false)}
            style={{
              background: boxHovered ? 'rgba(242,235,245,0.55)' : 'transparent',
              border: `1.5px solid ${boxHovered ? 'rgba(211,184,221,0.7)' : 'transparent'}`,
              borderRadius: 16,
              padding: '12px 16px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 8,
              boxShadow: boxHovered ? `0 4px 16px rgba(67,28,91,0.08)` : 'none',
              transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
            }}
          >
            {/* Caption row with ripple icon — sits above filter rows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-end' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: EGGPLANT, letterSpacing: '0.01em' }}>
                Click any filter to refine the heat-map
              </span>
              <div style={{ position: 'relative', width: 26, height: 26, flexShrink: 0 }}>
                {[0, 1.1].map((delay, i) => (
                  <div key={i} className="cm-ripple-ring" style={{ position: 'absolute', top: '50%', left: '50%', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${EGGPLANT}`, animation: `cm-ripple-ring 2.2s ease-out ${delay}s infinite`, pointerEvents: 'none' }} />
                ))}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <path d="M5 3L19 12L12 13.5L9 21L5 3Z" stroke={EGGPLANT} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
            </div>

            {[
              { label: 'Opportunities', btns: [['total','Total'],['existing','Revenue Retention Opportunities'],['new','New Deal Opportunities']], state: dealFilter, set: setDealFilter },
              { label: 'Wave', btns: [['all','All'],['1','Wave 1'],['2','Wave 2'],['3','Wave 3']], state: waveFilter, set: setWaveFilter },
              { label: 'Region', btns: [['all','All'],['NA','NA'],['EMEA','EMEA']], state: regionFilter, set: setRegionFilter },
              { label: 'Stage', btns: [['all','All'],['1','1 · New Opportunity'],['2','2 · Early Sales'],['3','3 · Mid Sales'],['4','4 · Late Sales / Pricing'],['5','5 · Contracting'],['6','6 · Executed'],['8','8 · Disqualified']], state: stageFilter, set: setStageFilter },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(26,31,78,0.45)', marginRight: 4, flexShrink: 0 }}>{row.label}</span>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {row.btns.map(([val, lbl]) => (
                    <HmPill key={val} id={`${row.label}-${val}`} active={row.state === val} onClick={() => row.set(val as any)}>{lbl}</HmPill>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ─������� Main plot layout ── */}
      <div style={{ display: 'flex', padding: '20px 24px 0' }}>
        {/* Y-axis label (rotated) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 20, marginRight: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'rgba(26,31,78,0.78)', whiteSpace: 'nowrap',
            transform: 'rotate(-90deg)', transformOrigin: 'center center',
            display: 'block',
          }}>Outsourcing Consent Likelihood</span>
        </div>

        {/* Y band labels — absolutely pinned to the centre of each band (33.33% each) */}
        <div style={{ position: 'relative', width: 44, marginRight: 6, flexShrink: 0, height: 640 }}>
          {(['HIGH','MEDIUM','LOW'] as const).map((l, i) => (
            <div key={l} style={{
              position: 'absolute',
              top: `${i * 33.33 + 16.67}%`,
              right: 0,
              transform: 'translateY(-50%)',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <span style={{
                fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
                color: l === 'HIGH' ? '#1d6b12' : l === 'MEDIUM' ? '#3d4455' : '#8a1040',
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Plot canvas area */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <PlotArea
            plotRef={plotRef}
            canvasRef={canvasRef}
            allClients={CM_DATA}
            plotted={plotted}
            whisperMode={whisperMode}
            quadrantRanges={quadrantRanges}
            setTooltip={setTooltip}
          />
        </div>
      </div>

      {/* ── Legend row ── */}
      <div style={{ padding: '12px 24px 16px', display: 'flex', alignItems: 'flex-end', gap: 24 }}>



        {/* Right: Region (top) + Revenue Tier (bottom) stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>

          {/* Revenue Tier row — circles bottom-aligned with label beneath */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.4)', marginBottom: 4 }}>Revenue Tier</span>
            {([[16,'< $1M'],[26,'$1M–5M'],[38,'$5M–10M'],[52,'$10M+']] as [number,string][]).map(([sz, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: sz, height: sz, borderRadius: '50%', background: '#c9ccdb', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(26,31,78,0.5)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (() => {
        const c = tooltip.client
        const mode = tooltip.whisperMode
        const out  = mode === 'post' && c.post?.out  ? (c.post.out.rating  ?? c.out)  : c.out
        const off  = mode === 'post' && c.post?.off  ? (c.post.off.rating  ?? c.off)  : c.off
        const dig  = mode === 'post' && c.post?.dig  ? (c.post.dig.rating  ?? c.dig)  : c.dig
        const price= mode === 'post' && c.post?.price? (c.post.price.rating?? c.price): c.price
        const score = overallScore(c, mode)
        const stageLbl = STAGE_LABELS.find(([s]) => s === String(c.stage))
        const regionLbl = c.region === 'NA' ? 'North America' : c.region.startsWith('EMEA') ? 'EMEA' : c.region
        const ratingColor = (r: Rating) => r === 'High' ? '#6ee76e' : r === 'Medium' ? '#fde87a' : r === 'Low' ? '#ff9999' : 'rgba(255,255,255,0.4)'

        // Position: prefer right of cursor, flip left if too close to edge
        const left = typeof window !== 'undefined' && tooltip.x + 220 > window.innerWidth
          ? tooltip.x - 228
          : tooltip.x

        const rows: [string, React.ReactNode][] = [
          ['Region', <span key="r" style={{ color: '#fff', fontWeight: 700 }}>{regionLbl}</span>],
          ['Stage',  <span key="s" style={{ color: '#fff', fontWeight: 700 }}>{stageLbl ? stageLbl[1] : c.stage}</span>],
          ['Overall',<span key="o" style={{ color: score !== null ? ratingColor(scoreBand(score)) : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{score !== null ? `${Math.round(score)} · ${scoreBand(score)}` : '—'}</span>],
          ['ACV',<span key="v" style={{ color: '#fff', fontWeight: 700 }}>{fmtRev(c.rev)}</span>],
          ['Outsourcing', <span key="ou" style={{ color: ratingColor(out), fontWeight: 700 }}>{out ?? '—'}</span>],
          ['Offshoring',  <span key="of" style={{ color: ratingColor(off), fontWeight: 700 }}>{off ?? '—'}</span>],
          ['Digitization',<span key="d"  style={{ color: ratingColor(dig), fontWeight: 700 }}>{dig ?? '—'}</span>],
          ['Price',       <span key="p"  style={{ color: ratingColor(price), fontWeight: 700 }}>{price ?? '—'}</span>],
        ]

        return (
          <div style={{
            position: 'fixed',
            top: Math.max(8, tooltip.y),
            left,
            zIndex: 9999,
            background: '#1a1f4e',
            color: 'rgba(255,255,255,0.65)',
            borderRadius: 10,
            padding: '14px 18px',
            fontSize: 12.5,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.38)',
            minWidth: 210,
            maxWidth: 260,
          }}>
            {/* Header */}
            <div style={{
              fontWeight: 800, fontSize: 14, color: '#fff',
              marginBottom: 10, lineHeight: 1.3,
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 8,
            }}>
              {c.name}
            </div>
            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {rows.map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, whiteSpace: 'nowrap' }}>{label}</span>
                  {val}
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ── Main component ────────────────────────��─������────�����─���───���─────────�����─────���──
  type Page = 'cover' | 'faq' | 'dashboard' | 'consent' | 'tracker'

export function ConsentMatrix({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const [whisperMode, setWhisperMode] = useState<WhisperMode>('post')
  const [dealFilter, setDealFilter] = useState<DealFilter>('total')
  const [waveFilter, setWaveFilter] = useState<WaveFilter>('all')
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all')
  const [stageFilter, setStageFilter] = useState<StageFilter>('all')

  const [sortKey, setSortKey] = useState<SortKey>('rev')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [openDetail, setOpenDetail] = useState<{ row: number; lever: 'out' | 'off' | 'dig' | 'price'; conv: 1 | 2 } | null>(null)
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
      return d && w && r && s
    })
    }, [whisperMode, dealFilter, waveFilter, regionFilter, stageFilter])

  const sorted = useMemo(() => {
    const ratingOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
    const getRatingVal = (r: Rating) => r ? (ratingOrder[r] ?? 0) : 0
    return [...filtered].sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0
      if (sortKey === 'name') { av = a.name; bv = b.name }
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
    else setOpenDetail({ row, lever, conv: 1 })
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
        background: "linear-gradient(90deg, rgba(22,24,56,0.87) 0%, rgba(22,24,56,0.87) 100%), url('/images/marlin-banner-bridge.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 34%',
        marginBottom: 18,
        padding: '18px 32px 0',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {/* Top row: title left, meta right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 58, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              Project Marlin
            </div>
            <div style={{ fontSize: 28, fontWeight: 400, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              Consent Tracker
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
              Internal Use Only
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', background: 'rgba(75,205,62,0.16)',
              border: '1px solid rgba(75,205,62,0.45)', borderRadius: 999,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4bcd3e', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 6px #4bcd3e80' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                ACV Target $25M by End of Year 2026
              </span>
            </div>
            <div style={{ textAlign: 'right', lineHeight: 1.65 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 1 }}>Last Update</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Aug 19th 2026 · 18:00 EST</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4, marginBottom: 1 }}>Next Update</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>August 26th 2026 · 18:00 EST</div>
            </div>
          </div>
        </div>

        {/* Bottom: page tabs flush to banner bottom-left */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {([
            { id: 'tracker',   label: 'GTM Status' },
            { id: 'consent',   label: 'Consent Matrix' },
            { id: 'dashboard', label: 'Deal Dashboard' },
            { id: 'faq',       label: 'Sales FAQ' },
            { id: 'cover',     label: 'How to Use' },
          ] as { id: Page; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: page === tab.id ? '#fff' : 'rgba(255,255,255,0.10)',
                color: page === tab.id ? '#1a1f4e' : 'rgba(255,255,255,0.65)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '0 28px 48px' }}>
        {/* Description */}
        <p style={{ fontSize: 13.5, color: 'rgba(26,31,78,0.55)', lineHeight: 1.65, marginBottom: 24, width: '100%' }}>
          Average propensity scores for all clients across four levers: Outsourcing, Offshoring, Digitization, and Price. The Heat Map compares Offshoring vs. Outsourcing. Click a client bubble to view its details.
        </p>

        {/* ── Top row: Toggle card + Total Clients + Avg Propensity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

          {/* Left: Propensity Rating toggle */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)' }}>
                Propensity Rating
              </div>
              {/* Click affordance: caption + ripple cursor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: EGGPLANT, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                  Click to switch view
                </span>
                <div style={{ position: 'relative', width: 22, height: 22, flexShrink: 0 }}>
                  {[0, 1.1].map((delay, i) => (
                    <div key={i} className="cm-ripple-ring" style={{ position: 'absolute', top: '50%', left: '50%', width: 12, height: 12, borderRadius: '50%', border: `2px solid ${EGGPLANT}`, animation: `cm-ripple-ring 2.2s ease-out ${delay}s infinite`, pointerEvents: 'none' }} />
                  ))}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                    <path d="M5 3L19 12L12 13.5L9 21L5 3Z" stroke={EGGPLANT} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, background: '#eef0f6', borderRadius: 11, padding: 5 }}>
              {(['pre', 'post'] as WhisperMode[]).map(m => (
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
            <div style={{ fontSize: 13, color: 'rgba(26,31,78,0.42)', marginTop: 12, fontStyle: 'italic' }}>
              Filter comparison with Pre-Whisper and Post-Whisper Consent Likelihood
            </div>
          </div>

          {/* Middle: Total Clients */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)', marginBottom: 12 }}>
              {whisperMode === 'post' ? 'Completed Whisper Clients' : 'Total Clients'}
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, color: whisperMode === 'post' ? '#4bcd3e' : '#1a1f4e', lineHeight: 1 }}>
              {whisperMode === 'post' ? 9 : filtered.length}
            </div>
          </div>

          {/* Right: Avg. Propensity */}
          <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,31,78,0.45)', marginBottom: 12 }}>
              Avg. Propensity
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: whisperMode === 'post' ? '#4bcd3e' : '#1a1f4e', lineHeight: 1 }}>
                {avgPropensity ?? '—'}
              </span>
              {avgPropensity !== null && (
                <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(26,31,78,0.45)' }}>/100</span>
              )}
            </div>
          </div>
        </div>

        {/* ─��� Heat-Map with Filters ── */}
        <HeatMap 
          allClients={filtered} 
          whisperMode={whisperMode}
          dealFilter={dealFilter}
          setDealFilter={setDealFilter}
          waveFilter={waveFilter}
          setWaveFilter={setWaveFilter}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
        />

        {/* ����� Info note ── */}
        {/* ── Rationale accordion ── */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
          <button onClick={() => setRationaleOpen(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>i</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>How the Overall Propensity Score is calculated</span>
            <span style={{ color: '#9aa0b8', fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{rationaleOpen ? '×' : '+'}</span>
          </button>
          {rationaleOpen && (
            <div style={{ padding: '0 22px 26px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13.5, color: '#4a5060', lineHeight: 1.7, margin: '18px 0 22px' }}>Each client is scored on four categories ��� Outsourcing, Offshoring, Digitization and Price. Each rating becomes a percentage, and the four are averaged into one 0–100 score.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '18px 22px', background: '#fafbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 16 }}>Rating → Points</div>
                  {([['High','100%'],['Medium','75%'],['Low','50%']] as const).map(([r, p], idx, arr) => (
                    <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #eef0f6' : 'none', fontSize: 13.5, color: '#1a1f4e' }}>
                      <span style={{ fontWeight: 700 }}>{r}</span><span style={{ fontWeight: 400, color: '#4a5060' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid #e2e4ee', borderRadius: 10, padding: '18px 22px', background: '#fafbfd' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b2d6e', marginBottom: 16 }}>Score → Band</div>
                  {([['High','75 – 100'],['Medium','50 – 74'],['Low','under 50']] as const).map(([b, r], idx, arr) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #eef0f6' : 'none', fontSize: 13.5 }}>
                      <span style={{ fontWeight: 700, color: '#1a1f4e', minWidth: 64 }}>{b}</span><span style={{ color: '#4a5060' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Criteria accordion ���─ */}
        <div style={{ background: '#fff', border: '1px solid #e2e4ee', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
          <button onClick={() => setCriteriaOpen(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#5b2d6e', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>i</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1f4e', flex: 1 }}>Category Rating Criteria (Post-Whisper)</span>
            <span style={{ color: '#9aa0b8', fontSize: 18, fontWeight: 300, lineHeight: 1 }}>{criteriaOpen ? '×' : '+'}</span>
          </button>
          {criteriaOpen && (
            <div style={{ padding: '0 22px 26px', borderTop: '1px solid #eef0f6' }}>
              <p style={{ fontSize: 13.5, color: '#4a5060', lineHeight: 1.7, margin: '18px 0 22px' }}>How each lever is rated after the whisper conversation, based on trigger phrases and signals in the client&apos;s comments.</p>
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
                    <tr style={{ borderBottom: '1px solid #eef0f6' }}>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}><span style={{ fontSize: 13.5, fontWeight: 800, color: '#1d6b12' }}>High</span></td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness to further outsourcing, no objection to the model itself, and positive language toward the value proposition. Regulatory mentions are framed as considerations to manage, not blockers.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness across all service types with no named exclusions.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Clear enthusiasm or readiness for digital transformation, including interest in modernizing processes or contact-centre capabilities, with no stated hesitation or conditions.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>The client&apos;s existing pricing model already aligns with the proposed pricing structure, and discount expectations are in line with what can be offered.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #eef0f6' }}>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}><span style={{ fontSize: 13.5, fontWeight: 800, color: '#3d4455' }}>Medium</span></td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness in principle, paired with an unresolved concern or condition that hasn&apos;t been ruled out yet, including external factors such as timing not being right.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>Openness to specific service types, paired with an explicit exclusion in another area, including external factors such as timing not being right.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>General openness to digital transformation, but with conditions, timing concerns, or a preference for a phased approach before committing.</td>
                      <td style={{ padding: '18px 14px', fontSize: 12.5, color: '#4a5060', lineHeight: 1.6, verticalAlign: 'top' }}>A different pricing model is described, with no explicit resistance stated, or discount expectations somewhat above what can be offered but not stated as a blocker.</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '18px 14px 18px 0', verticalAlign: 'top' }}><span style={{ fontSize: 13.5, fontWeight: 800, color: '#8a1040' }}>Low / No</span></td>
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

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, padding: '10px 14px', background: 'rgba(26,31,78,0.03)', border: '1px solid #e2e4ee', borderRadius: 8, fontSize: 12, lineHeight: 1.55, color: 'rgba(26,31,78,0.7)' }}>
          <span style={{ color: '#5b2d6e', fontSize: 13, flexShrink: 0 }}>ⓘ</span>
          <span><strong style={{ color: '#1a1f4e' }}>Overall Propensity Likelihood</strong> blends four consent levers — Outsourcing, Offshoring, Digitization and Price Maintain. <strong style={{ color: '#1a1f4e' }}>Low</strong> likelihood signals high consent risk; <strong style={{ color: '#1a1f4e' }}>High</strong> likelihood signals low consent risk.</span>
        </div>



      </div>
    </div>
  )
}
