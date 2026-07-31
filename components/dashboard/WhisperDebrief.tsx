'use client'

import { useState, useEffect, useRef } from 'react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faq' | 'dashboard' | 'consent'

// ── Shared style tokens ───────────────────────────────────────────────────────
const INK = '#1a1f4e'
const ACCENT = '#5b2d6e'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'
const LINK_COL = '#5b2d6e'

function RatingCell({ r }: { r: 'High' | 'Medium' | 'Low' }) {
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    High:   { bg: '#d8f3d8', color: '#1a6e1a', dot: '#2e9e2e' },
    Medium: { bg: '#fdf1c9', color: '#8a6a00', dot: '#e8a800' },
    Low:    { bg: '#fde0e0', color: '#a01020', dot: '#d0021b' },
  }
  const s = styles[r]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 9px', borderRadius: 7,
      background: s.bg, color: s.color,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
      border: '1.5px solid transparent',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {r}
    </span>
  )
}

// ── Whisper Conversation Debrief ──────────────────────────────────────────────
type FuLink = { label: string; id: string; note?: string }
type LeverRow = {
  lever: string
  learnings: string[]
  points: (FuLink | { plain: string })[]
}
type ClientRecord = {
  name: string
  meta: string
  ratings: { out: 'High' | 'Medium' | 'Low'; off: 'High' | 'Medium' | 'Low'; dig: 'High' | 'Medium' | 'Low'; price: 'High' | 'Medium' | 'Low' }
  pointsCount: number
  levers: LeverRow[]
}

const CLIENTS: ClientRecord[] = [
  {
    name: 'Virgin Money', meta: 'EMEA · UK · $27.15M',
    ratings: { out: 'High', off: 'Medium', dig: 'High', price: 'High' },
    pointsCount: 4,
    levers: [
      {
        lever: 'Outsourcing',
        learnings: ['Open to more outsourcing, with no concerns about Genpact.', 'Liked that FIS funds access to modern technology like AI.', 'Glad to keep day-to-day control of the relationship.'],
        points: [
          { label: 'Concern about additional "material outsourcing" layers under PRA regulation.', id: 'oh-oo-pra' },
          { label: 'Are you bringing in support delivery partners?', id: 'oh-oo-partners' },
        ],
      },
      {
        lever: 'Offshoring',
        learnings: ['Open to offshoring chat and back-office (non-voice) work.'],
        points: [
          { label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' },
          { label: 'Can a client offshore only part of the service, for example, back office but not voice?', id: 'oh-oo-partial' },
        ],
      },
      {
        lever: 'Digitization',
        learnings: ['Keen on digitization and automation, with leadership backing it.'],
        points: [{ plain: 'N/A' }],
      },
      {
        lever: 'Price Maintain',
        learnings: ['Already use a total-cost model, so predictable subscription pricing fits.'],
        points: [{ plain: 'N/A' }],
      },
    ],
  },
  {
    name: 'Fifth Third Bank', meta: 'North America · $14.06M',
    ratings: { out: 'High', off: 'Medium', dig: 'High', price: 'Medium' },
    pointsCount: 6,
    levers: [
      {
        lever: 'Outsourcing',
        learnings: ['The overall proposal landed well, with little pushback.', 'Sees how outsourcing helps with risk, scale, and technology gaps.'],
        points: [{ plain: 'N/A' }],
      },
      {
        lever: 'Offshoring',
        learnings: ['Little to no concern about offshoring back-office / non-voice work.'],
        points: [
          { label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' },
          { label: 'How do we know this meets standards? (Compliance & Infosec)', id: 'oh-comp-standards' },
          { label: 'Can a client offshore only part of the service, for example, back office but not voice?', id: 'oh-oo-partial' },
        ],
      },
      {
        lever: 'Digitization',
        learnings: ['Comfortable adding more technology to their systems and processes.'],
        points: [
          { label: 'Technology must be thoroughly proven end-to-end before moving forward (cited TCS implementation experience).', id: 'oh-tech-walkthroughs' },
          { label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' },
        ],
      },
      {
        lever: 'Price Maintain',
        learnings: ['Accepts it costs them nothing extra, as FIS covers the technology cost.'],
        points: [
          { label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' },
        ],
      },
    ],
  },
  {
    name: 'UMB', meta: 'North America · $10.32M',
    ratings: { out: 'High', off: 'High', dig: 'Medium', price: 'Low' },
    pointsCount: 5,
    levers: [
      {
        lever: 'Outsourcing',
        learnings: ["Didn't reject the idea — encouraging given the expected sensitivity.", 'Prefers aligning UMB to the standard operating model over a bespoke solution.', 'Recently involved in multiple outsourcing reviews across the business.', 'Very positive on Genpact selection; believes they have the capability and credibility to deliver.'],
        points: [
          { label: 'Confidence in execution: raised concern based on prior experiences with FIS.', id: 'oh-oo-expertise' },
        ],
      },
      {
        lever: 'Offshoring',
        learnings: ['Accepted the offshoring split: voice from the Philippines, back-office from India.', 'Exploring offshore model opportunities; Technology Modernization identified as primary near-term opportunity.'],
        points: [
          { label: "Where exactly would our client's work be delivered from, and does any data move with it? (model already accepted; confirms the split)", id: 'oh-oo-delivered' },
        ],
      },
      {
        lever: 'Digitization',
        learnings: ['Technology Modernization identified as primary near-term opportunity.', 'Technology capabilities viewed as key differentiator in vendor selection.'],
        points: [{ plain: 'N/A' }],
      },
      {
        lever: 'Price Maintain',
        learnings: ['Challenged concept of maintaining current economics while offshoring.'],
        points: [
          { label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' },
          { label: 'Do we charge for implementation cost?', id: 'oh-pr-impl' },
        ],
      },
    ],
  },
  {
    name: 'NatWest', meta: 'EMEA · UK · $25.2K',
    ratings: { out: 'Medium', off: 'Medium', dig: 'Medium', price: 'High' },
    pointsCount: 3,
    levers: [
      {
        lever: 'Outsourcing',
        learnings: ['Open to a new provider, as long as the right checks and approvals are in place.', 'Reassured the IVR service will stay reliable.'],
        points: [
          { label: 'Sees this as a possible opportunity to take the final IVR back in-house and terminate our service.', id: 'oh-oo-refuse' },
          { label: "What if timing isn't right?", id: 'oh-nc-timing' },
          { label: 'Are you bringing in support delivery partners?', id: 'oh-oo-partners' },
        ],
      },
      {
        lever: 'Offshoring',
        learnings: ['N/A — IVR service only, no agents involved.'],
        points: [{ plain: 'N/A' }],
      },
      {
        lever: 'Digitization',
        learnings: [],
        points: [{ plain: 'N/A' }],
      },
      {
        lever: 'Price Maintain',
        learnings: ['Accepts no significant price change is likely.'],
        points: [{ plain: 'N/A' }],
      },
    ],
  },
]

function DebriefSection({ onFaqLink }: { onFaqLink: (id: string) => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const visible = CLIENTS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: '-0.01em', marginBottom: 14 }}>Whisper Intelligence</div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative', maxWidth: 360 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 15 }}>⌕</span>
        <input
          type="text"
          placeholder="Search client…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 14px 9px 34px',
            border: BORDER, borderRadius: 8, fontFamily: 'inherit',
            fontSize: 13, color: INK, background: '#fff', outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: BORDER, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '13%' }} /><col style={{ width: '13%' }} /><col style={{ width: '13%' }} /><col style={{ width: '13%' }} />
            <col style={{ width: '15%' }} /><col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Client', 'Outsourcing', 'Offshoring', 'Digitization', 'Price', 'Points to Address', ''].map((h, i) => (
                <th key={i} style={{
                  background: INK, color: '#fff', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '11px 14px', textAlign: i === 0 ? 'left' : 'center',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((c, idx) => {
              const isOpen = openIdx === idx
              return (
                <>
                  <tr
                    key={c.name}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    style={{ cursor: 'pointer', transition: 'background .12s', background: isOpen ? 'rgba(91,45,110,0.03)' : undefined }}
                    onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(91,45,110,0.03)' }}
                    onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLTableRowElement).style.background = '' }}
                  >
                    <td style={{ padding: '7px 14px', borderTop: idx > 0 ? BORDER : 'none', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{c.meta}</div>
                    </td>
                    {(['out', 'off', 'dig', 'price'] as const).map(k => (
                      <td key={k} style={{ padding: '7px 14px', borderTop: idx > 0 ? BORDER : 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                        <RatingCell r={c.ratings[k]} />
                      </td>
                    ))}
                    <td style={{ padding: '7px 14px', borderTop: idx > 0 ? BORDER : 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 11px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: 'rgba(91,45,110,0.10)', color: ACCENT,
                      }}>{c.pointsCount}</span>
                    </td>
                    <td style={{ padding: '7px 14px', borderTop: idx > 0 ? BORDER : 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 12, color: MUTED, display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>›</span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${c.name}-detail`}>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ background: '#fff' }}>
                          {/* Column headers */}
                          <div style={{ display: 'grid', gridTemplateColumns: '16% 42% 42%', background: '#fff', borderBottom: BORDER }}>
                            {['Lever', 'Learnings', 'Points to Address'].map(h => (
                              <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: INK, padding: '12px 20px' }}>{h}</span>
                            ))}
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
                            <colgroup>
                              <col style={{ width: '16%' }} />
                              <col style={{ width: '42%' }} />
                              <col style={{ width: '42%' }} />
                            </colgroup>
                            <tbody>
                              {c.levers.map((lev, li) => (
                                <tr key={lev.lever}>
                                  <td style={{ padding: '12px 20px', verticalAlign: 'top', fontSize: 12.5, borderTop: li > 0 ? '1px solid #eef0f2' : 'none', color: '#12163d' }}>
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f1230', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lev.lever}</span>
                                  </td>
                                  <td style={{ padding: '12px 20px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.5, borderTop: li > 0 ? '1px solid #eef0f2' : 'none', color: '#12163d' }}>
                                    {lev.learnings.length === 0
                                      ? <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11.5 }}>N/A</span>
                                      : lev.learnings.map((l, i) => (
                                        <div key={i} style={{ color: INK, marginBottom: i < lev.learnings.length - 1 ? 6 : 0, paddingLeft: 16, position: 'relative' }}>
                                          <span style={{ position: 'absolute', left: 2, color: 'rgba(26,31,78,0.45)' }}>•</span>
                                          {l}
                                        </div>
                                      ))
                                    }
                                  </td>
                                  <td style={{ padding: '12px 20px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.5, borderTop: li > 0 ? '1px solid #eef0f2' : 'none', color: '#12163d' }}>
                                    {lev.points.map((p, i) => (
                                      'plain' in p
                                        ? <div key={i} style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11.5 }}>{p.plain}</div>
                                        : (
                                          <div key={i} style={{ marginBottom: i < lev.points.length - 1 ? 6 : 0, paddingLeft: 16, position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: 2, color: 'rgba(26,31,78,0.45)' }}>•</span>
                                            <button
                                              onClick={e => { e.stopPropagation(); onFaqLink(p.id) }}
                                              style={{
                                                background: 'none', border: 'none', padding: 0,
                                                fontFamily: 'inherit', fontSize: 12.5, color: INK,
                                                cursor: 'pointer', textAlign: 'left',
                                                borderBottom: '1px dotted rgba(91,45,110,0.5)',
                                                lineHeight: 1.5,
                                              }}
                                            >{p.label} <span style={{ fontSize: 10, color: ACCENT }}>→</span></button>
                                          </div>
                                        )
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── FAQ / Objection Handling ──────────────────────────────────────────────────
type FaqRow = { id: string; q: string; r: string | React.ReactNode; note?: string; internalNote?: string }
type FaqCategory = { cat: string; rows: FaqRow[] }

const FAQ_DATA: FaqCategory[] = [
  {
    cat: 'Technology',
    rows: [
      { id: 'oh-tech-optout', q: 'Can a client opt out of specific technologies?', r: 'We are deeply aware of considerations for customer experience, compliance, and existing investments for proposed technologies offered by FIS. We will fulfil all necessary requirements. If we are unable to satisfy your standards, we will respect your decision to not deploy.', internalNote: 'We really want the client to opt into technology which drives productivity; others can be optional (e.g., sentiment analysis).' },
      { id: 'oh-tech-data', q: 'Where will our data live, and how is it protected?', r: 'Nothing changes on security or compliance. The standards in your current TSYS agreement stay fully intact, and you keep the same protections you have today. What improves is service quality.' },
      { id: 'oh-tech-recordings', q: 'Are there sample recordings of Philippines-based agents handling live calls, so you can show us what voice quality and English fluency actually sound like?', r: 'Collecting inputs from vendor.' },
      { id: 'oh-tech-walkthroughs', q: 'Are there recorded walkthroughs of the new tech capabilities (Intelligent Virtual Assistant, Agent Assist, AI Coach, fraud/dispute bots, etc.) that you can show us?', r: 'Collecting inputs from vendor.' },
    ],
  },
  {
    cat: 'Outsourcing & Offshoring',
    rows: [
      { id: 'oh-oo-global', q: 'Will our work be done through global delivery locations?', r: "Yes — and with your agreement, it should be. It's how the full value of the program reaches you. We deliver through a distributed global model that gives us depth and surge capacity a single site can't match, and that's what protects your SLAs. When you've hit capacity strain or fraud-and-dispute backlogs before, this is what prevents a repeat: more hands when volume spikes, multiple centers to route to, faster dispute turnaround. It's vetted against your standards, fully compliant, and open to your audits, and FIS stays accountable for every outcome. Banks across the industry already operate this way, with analysts expecting the support delivery partner market to keep growing." },
      { id: 'oh-oo-partners', q: 'Are you bringing in support delivery partners?', r: "FIS already delivers this service to you today. What's changing is that we're bringing in a support delivery partner to work alongside us, specifically to lift your service levels and sustain capacity. FIS remains your service provider and stays fully accountable for your outcomes. Your contract doesn't change; we amend it to reflect the partner and the model. Same accountability, stronger delivery." },
      { id: 'oh-oo-vendor', q: 'Who delivers this, and do we have a say?', r: "Yes, and the partner is one we know well. We believe Genpact is a vendor the industry relies on: an established partner with deep financial services experience and the compliance standards this work requires. They're proven on this kind of servicing, and FIS remains accountable for them." },
      { id: 'oh-oo-delivered', q: "Where exactly would our client's work be delivered from, and does any data move with it?", r: "All delivery centers are compliant with Infosec, regulatory, and safety specifications that meet TIS standards. Delivery from the following global centers: US-Columbus Georgia, UK-Milton Keynes, Germany-Hamburg, Netherlands-Barneveld, Romania-Bucharest, Poland-Warsaw, Philippines-Manila, India-Pune.\n\nData will continue to be hosted with TIS platforms against compliance standards that you have already approved.\n\nUK clients: UK for onshore servicing, Philippines for offshore voice, India for offshore back office, Poland and Romania as back up depending on client reservations.\n\nGermany & NL: Germany for onshore, Poland and Romania for nearshore (voice and back office). Philippines and India reserved if clients are more flexible.\n\nUS clients: US for onshore servicing, Philippines for offshore voice, India for offshore back office." },
      { id: 'oh-oo-refuse', q: 'What do we do if a client refuses Genpact or the new model altogether?', r: 'This is the path forward for TIS. We will re-engage in a few months.' },
      { id: 'oh-oo-partial', q: 'Can a client offshore only part of the service, for example, back office but not voice?', r: "We are seeking overarching approval for the right to offshore all in-scope services rather than offering a component-by-component choice. This is a concentrated investment to improve our servicing and technology capabilities end to end, and the benefits depend on transforming the service as a whole. Splitting it would divide ownership of SLAs and KPIs and limit the improvement we can deliver — we don't want clients to miss out on having their service offering transformed.", note: 'Fallback option: Client gives right in the contract for offshoring, but it requires go-live consent collected in BAU governance.' },
      { id: 'oh-oo-mandatory', q: 'Is outsourcing mandatory, and what happens if a client refuses it outright? What is the impact to pricing?', r: 'TIS position: we accept that right now is not the right time, and we will re-engage in a few months, as this is the TIS go-forward strategy. If the client refuses the outsourcing model, then TMS will honor the rest of the contract but will not renew the contract.' },
      { id: 'oh-oo-countries', q: 'In which countries do you currently deliver contact center or back-office services?', r: 'Below are our Key contact center delivery hubs:\n• Philippines\n• India\n• Romania\n• Poland\n• Guatemala' },
      { id: 'oh-oo-languages', q: 'Which languages do you currently support across your delivery network? List associated delivery locations.', r: 'English: United States (Atlanta; Wilkes-Barre; Richardson; Bloomington; Jacksonville; Danville; Chicago; Portland; Bentonville), Canada (Mississauga), United Kingdom (Belfast; Manchester).\n\nSpanish: United States (Atlanta; Wilkes-Barre; Richardson; Bloomington; Jacksonville; Danville; Chicago; Portland; Bentonville), United Kingdom (Manchester), Romania (Bucharest; Cluj), Poland (Lublin; Krakow; Katowice), Hungary (Budapest), Germany (Munich), Mexico (Juarez; Guadalajara), Costa Rica (Heredia), Guatemala (Guatemala City).\n\nFrench-Canadian: Canada (Mississauga).\n\nGerman: United Kingdom (Manchester), Romania (Bucharest; Cluj), Poland (Lublin; Krakow; Katowice), Hungary (Budapest), Germany (Munich), Egypt (Cairo).\n\nDutch: United Kingdom (Manchester), Romania (Bucharest; Cluj), Poland (Krakow), Netherlands (Hoofddorp), Hungary (Budapest).\n\nPortuguese: China (Shanghai), Romania (Bucharest; Cluj), Poland (Lublin), Mexico (Monterrey), Brazil (Uberlandia).' },
      { id: 'oh-oo-techonly', q: "If a client outsources, takes the technology but doesn't offshore, does the price change?", r: 'Yes, the price will increase, details on exact pricing to come.' },
      { id: 'oh-oo-contacts', q: 'If work moves offshore, how will my current team and contacts be impacted? Will I have the same contacts?', r: 'Your key relationship and leadership contacts stay the same, and FIS stays accountable for the service you get.', internalNote: 'Do not name roles, tiers, or who is affected, and do not imply who stays or leaves.' },
      { id: 'oh-oo-expertise', q: 'If experienced staff are replaced through offshoring, how do we protect the client\'s expertise and hold SLAs?', r: "FIS is committed to upholding SLAs for today and the future.\n\nThis model includes re-badging of existing workforce to ensure there is no disruption or knowledge lost. Experienced and critical resources will be given retention bonuses and incentives to ensure continuity of service.\n\nFIS's experience with offshoring has shown 5–15% SLA improvements within 6 months." },
      { id: 'oh-oo-audit', q: 'Will clients be able to audit Genpact?', r: 'Yes. The intent is for clients to retain audit rights over the services provided consistent with current arrangements and expectations. This includes audit of Genpact as the delivery partner — scope, frequency, and mechanism will be confirmed during contracting.' },
      { id: 'oh-oo-pra', q: 'How can we address client concerns around the topics of PRA or third-party oversight?', r: 'Oversight of the arrangement will be governed through a vendor management framework that is being established. We will work with you to confirm the model aligns with your specific regulatory requirements.' },
    ],
  },
  {
    cat: 'Compliance',
    rows: [
      { id: 'oh-comp-standards', q: 'How do we know this meets standards? (Compliance & Infosec)', r: 'Everything we deliver continues to meet the standards in your agreement. Those commitments remain intact, and we\'re accredited to them today.' },
      { id: 'oh-comp-docs', q: 'Are there documentation or certifications we can share to prove our compliance and security claims (data residency, regulatory standards, etc.)?', r: 'Collecting inputs from vendor.' },
    ],
  },
  {
    cat: 'Transition',
    rows: [
      { id: 'oh-tr-timeline', q: 'What is the implementation timeline, and how much effort does it demand from the client?', r: 'Collecting inputs from vendor.' },
      { id: 'oh-tr-complaints', q: 'Does the vendor have a UK-compliant complaints management system?', r: 'Collecting inputs from vendor.' },
      { id: 'oh-tr-tupe', q: 'The proposal references operations from Milton Keynes and Barneveld — will agents TUPE across?', r: "Milton Keynes is our UK delivery site; UK TUPE regulations do not apply in the Netherlands. For the UK scope, we are planning on the basis that TUPE applies, and the transfer of in-scope colleagues to Genpact will be managed on that footing. The final consultation approach will be confirmed via contracting." },
      { id: 'oh-tr-access', q: 'Will clients have the same access rights to Milton Keynes / Barneveld that they benefit from today, such as open door policy?', r: 'Our intent is to fully preserve the access you have today. You will continue to have access for site visits and reviews at the same, subject to the standard operational and security controls of each site. The specific access provisions will be set out in the contract.' },
    ],
  },
  {
    cat: 'Pricing',
    rows: [
      { id: 'oh-pr-costs', q: 'Are costs going up? How is pricing affected?', r: 'Same fee, more value. Your cost does not change and you actually get more for it. The same fee now brings new technology and AI-powered capabilities. Think of it as a subscription. We fix your annual cost at the service level into a single predictable monthly fee per service. Normal volume swings up to 8% are absorbed at no extra charge, and higher usage runs at a simple transparent rate.' },
      { id: 'oh-pr-change', q: 'How will change management and change requests work under the new model in terms of pricing?', r: 'Collecting inputs from vendor.' },
      { id: 'oh-pr-discount', q: 'How much discount can we give? Do discounts need to be approved?', r: 'The pitch to the client is that cost will not change. Discounts are reserved for exception cases. TIS pricing team defines applicable discounts that will vary by client. E.g., we are waiving the change management fee.' },
      { id: 'oh-pr-overages', q: 'How will overages be priced?', internalNote: 'Details on exact pricing to come.', r: '' },
      { id: 'oh-pr-impl', q: 'Do we charge for implementation cost?', r: 'There is an implementation cost; we will waive clients\' implementation fees. This must be positioned as a financial benefit.' },
    ],
  },
  {
    cat: 'No Consent',
    rows: [
      { id: 'oh-nc-timing', q: "What if timing isn't right?", r: "Nothing changes without your agreement. If now isn't the right time, your current service, terms, and pricing continue as they are today. That said, the use of support delivery partners is accelerating across the industry and this is where the market is heading. We will revisit soon to make sure you are positioned ahead of this shift." },
    ],
  },
  {
    cat: 'New Tech Capabilities',
    rows: [
      {
        id: 'oh-cap-list',
        q: 'What are the key new tech capabilities to be enabled and their associated benefits?',
        r: <TechCapabilities />,
      },
    ],
  },
]

function TechCapabilities() {
  const groups = [
    {
      group: 'Customer Experience Capabilities',
      caps: [
        { name: 'Intelligent Virtual Assistant', desc: ': Voice and chat bot that resolves routine intents end to end, 24/7, deflecting volume before it reaches an agent queue.', benefits: ['Lower ASA: AI intake and callback answer contacts faster, cutting average speed of answer', '24/7 containment: routine intents self-serve overnight, lifting deflection', 'Shorter handle time: volume deflected so live contacts are simpler and faster to resolve'] },
        { name: 'Agent Assist', desc: ': Real time desktop that surfaces answers and account context mid call, eliminating hold time and search driven transfers.', benefits: ['Reduced hold time: agent-assist surfaces the answer on-screen, so customers wait less mid-call', 'Higher FCR: next-best-action guidance resolves the issue in one contact', 'Lower handle time: answers and account context surfaced in real time cut time-per-contact'] },
        { name: 'Real-time language translation', desc: ': Live voice and chat translation across multiple languages, closing coverage gaps without native speaker staffing on every shift.', benefits: ['Expanded language coverage: multiple languages served on any shift', 'Reduced routing: less hand-offs to find a bilingual agent'] },
        { name: 'Speech analytics', desc: ': Monitors all interactions to flag recurring drivers, compliance risk, and QA gaps, turning contacts into continuous improvement.', benefits: ['Proactive issue detection: catch recurring customer problems early, before they turn into call spikes', 'Higher CSAT: recurring pain points detected and fixed before they drive complaints'] },
      ],
    },
    {
      group: 'Productivity and Backoffice Capabilities',
      caps: [
        { name: 'AI-powered forecasting', desc: ': WFM forecasting that predicts contact volume and schedules to demand, preventing both understaffing and overstaffing at peak.', benefits: ['Shorter wait at peak: staffing matched to demand so answer speed increases even in the busiest intervals', 'Lower peak abandonment: capacity scales with call arrival, holding service level in busy periods', 'Fast answers: lower ASA and answer rates across busy and quiet intervals'] },
        { name: 'AI Coach', desc: ': Automated QA that scores and coaches on every interaction in near real time, replacing sampled manual reviews.', benefits: ['First-contact resolution: coaching on every interaction resolving issues right the first time', 'Continuous CSAT lift: AI coaching on every interaction drives sustained CSAT improvement'] },
        { name: 'AI document extraction', desc: ': Reads and processes case documents automatically, clearing the manual back-office bottleneck that drives handle time and rework.', benefits: ['Faster resolution: automated case handling clears work in seconds, not manually', 'Lower handle time: back-office bottleneck cleared so cases do not stall and inflate handle time', 'Reduced backlog: right-first-time processing reduces rework and backlog'] },
        { name: 'Automated case routing & QA', desc: ': Skills based routing that lands each case right the first time, with quality checked in flight to prevent stalls and rework.', benefits: ['Faster resolution: each contact routed to the team that can resolve it', 'Fewer transfers: reduced hand-offs keep contacts with the right agent', 'Consistent service quality: standards checked in-flight, not after the fact'] },
      ],
    },
    {
      group: 'Risk and Fraud Capabilities',
      caps: [
        { name: 'Fraud & dispute agentic bots', desc: ': Autonomous agents that investigate, document, and resolve fraud and dispute cases accurately, protecting funds and speeding provisional credit.', benefits: ['Higher decision accuracy: better-informed adjudication protects customer funds', 'Single-touch resolution: cases investigated and documented right the first time', 'Faster disputed-funds recovery: customers recover disputed funds sooner'] },
        { name: 'Dynamic workflow orchestration', desc: ': Orchestrates the end to end fraud and dispute lifecycle, routing work between agents with no manual hand offs and full customer visibility.', benefits: ['Faster case resolution: work keeps moving between agents with no manual hand-offs', 'Full case visibility: customers see where their case stands at every stage of the investigation', 'Reduced dispute cycle time: fewer hold-ups so cases reach resolution faster'] },
      ],
    },
  ]

  return (
    <div>
      {groups.map(g => (
        <div key={g.group}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT, margin: '16px 0 10px', paddingBottom: 5, borderBottom: BORDER }}>{g.group}</div>
          {g.caps.map(cap => (
            <div key={cap.name} style={{ marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: '#0f1230' }}>{cap.name}</span>
              <span style={{ color: 'rgba(26,31,78,0.72)' }}>{cap.desc}</span>
              <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0 }}>
                {cap.benefits.map((b, i) => {
                  const [bold, ...rest] = b.split(':')
                  return (
                    <li key={i} style={{ position: 'relative', paddingLeft: 16, marginBottom: 4, color: 'rgba(26,31,78,0.72)', fontSize: 12, lineHeight: 1.5 }}>
                      <span style={{ position: 'absolute', left: 2, color: 'rgba(26,31,78,0.45)' }}>•</span>
                      <strong style={{ color: '#0f1230', fontWeight: 600 }}>{bold}</strong>{rest.length > 0 ? ':' + rest.join(':') : ''}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function FaqSection({ highlightId, onClearHighlight }: { highlightId: string | null; onClearHighlight: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlightId) return

    // Wait for the programmatic scrollIntoView to finish before attaching
    // listeners — otherwise the scroll animation itself would clear immediately.
    const listenTimer = setTimeout(() => {
      const clear = () => onClearHighlight()
      window.addEventListener('scroll', clear, { once: true, passive: true })
      window.addEventListener('click', clear, { once: true })
      window.addEventListener('keydown', clear, { once: true })
      return () => {
        window.removeEventListener('scroll', clear)
        window.removeEventListener('click', clear)
        window.removeEventListener('keydown', clear)
      }
    }, 800)

    return () => clearTimeout(listenTimer)
  }, [highlightId, onClearHighlight])

  return (
    <div ref={containerRef}>
      <div style={{ background: '#fff', border: BORDER, borderRadius: 12, overflow: 'hidden', marginTop: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '36%' }} />
            <col style={{ width: '49%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Category', 'Points to Address', 'Response'].map(h => (
                <th key={h} style={{
                  background: INK, color: '#fff', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'left',
                  padding: '12px 20px',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FAQ_DATA.map(cat => (
              cat.rows.map((row, ri) => (
                <tr
                  key={row.id}
                  id={row.id}
                  style={{
                    background: highlightId === row.id ? 'rgba(139,92,246,0.12)' : undefined,
                    transition: highlightId === row.id ? 'none' : 'background 0.4s ease',
                  }}
                >
                  {ri === 0 && (
                    <td
                      rowSpan={cat.rows.length}
                      style={{ padding: '16px 20px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: '#12163d', borderTop: '1px solid #eef0f2', borderRight: '1px solid #eef0f2' }}
                    >
                      <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f1230' }}>{cat.cat}</span>
                    </td>
                  )}
                  <td style={{ padding: '16px 20px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: '#12163d', borderTop: '1px solid #eef0f2', borderRight: '1px solid #eef0f2' }}>
                    <span style={{ fontWeight: 600, color: INK }}>{row.q}</span>
                  </td>
                  <td style={{ padding: '16px 20px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)', borderTop: '1px solid #eef0f2' }}>
                    {typeof row.r === 'string'
                      ? row.r.split('\n\n').map((para, i) => <p key={i} style={{ margin: i > 0 ? '10px 0 0' : 0 }}>{para}</p>)
                      : row.r
                    }
                    {row.note && (
                      <span style={{ display: 'block', marginTop: 8, padding: '7px 10px', background: 'rgba(184,134,11,0.10)', borderLeft: '3px solid #b8860b', borderRadius: 4, fontSize: 11.5, color: '#7a5a00' }}>
                        <strong style={{ color: '#5f4600' }}>Fallback option:</strong> {row.note}
                      </span>
                    )}
                    {row.internalNote && (
                      <span style={{ display: 'block', marginTop: 8, padding: '7px 10px', background: 'rgba(184,134,11,0.10)', borderLeft: '3px solid #b8860b', borderRadius: 4, fontSize: 11.5, color: '#7a5a00' }}>
                        <strong style={{ color: '#5f4600' }}>Internal note only:</strong> {row.internalNote}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Exported page wrappers ──────────────���─────────────────────────────────────
export function WhisperDebriefPage({ page, onNavigate, onFaqLink }: { page: Page; onNavigate: (p: Page) => void; onFaqLink: (id: string) => void }) {
  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Whisper Conversation Debrief" />
      <div style={{ padding: '0 32px 56px' }}>
        <p style={{ fontSize: 13.5, color: MUTED, marginBottom: 22, lineHeight: 1.6 }}>
          This page captures what we learned from client whisper conversations and what still needs to be addressed across the four levers: Outsourcing, Offshoring, Digitization and Price Maintain. The table below shows each client&apos;s position on every lever at a glance. Click a client to see their Learnings and Points to Address. Each point links to the FAQ / Objection Handling page, where you&apos;ll find a ready response to use in your next conversation.
        </p>
        <DebriefSection onFaqLink={onFaqLink} />
      </div>
    </div>
  )
}

export function FaqPage({ page, onNavigate, highlightId, onClearHighlight }: { page: Page; onNavigate: (p: Page) => void; highlightId?: string | null; onClearHighlight?: () => void }) {
  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="FAQ / Objection Handling" />
      <div style={{ padding: '0 32px 56px' }}>
        <p style={{ fontSize: 13.5, color: 'rgba(26,31,78,0.55)', lineHeight: 1.65, marginBottom: 24 }}>
          This page gives the account team ready-to-use responses for the most common objections and questions. It&apos;s organized by lever, including Technology, Outsourcing and Offshoring, Compliance, Transition, Pricing, No Consent, and New Tech Capabilities, so you can go straight to the relevant concern. Each row pairs a client&apos;s point with a concise, FIS-approved response drawn from programme talking points. Every unresolved point links directly to its corresponding response here.
        </p>
        <FaqSection highlightId={highlightId ?? null} onClearHighlight={onClearHighlight ?? (() => {})} />
      </div>
    </div>
  )
}
