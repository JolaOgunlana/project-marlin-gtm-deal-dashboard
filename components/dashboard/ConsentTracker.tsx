'use client'

import { useState } from 'react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'faq' | 'dashboard' | 'consent' | 'tracker' | 'calendar'

// ── Constants ──────────────────────────────────────────────────────────────────
const INK   = '#1a1f4e'
const MUTED = 'rgba(26,31,78,0.50)'
const MUTED_D = 'rgba(26,31,78,0.65)'
const BORDER = '1px solid #e5e8ed'
const GREEN  = '#4bcd3e'
const GREEN_BG = '#e9fbe6'
const AMBER  = '#B7860B'
const AMBER_BG = '#FBF0D0'
const GRAY   = '#8A93A2'
const GRAY_BG = '#ECEEF2'

// ── Whisper Intelligence data (per-client learnings & points to address) ──────
type LeverPoint = { label: string; id: string } | { plain: string }
type LeverRow = { lever: string; learnings: string[]; points: LeverPoint[] }
const WHISPER_DATA: Record<string, LeverRow[]> = {
  'Virgin Money': [
    { lever: 'Outsourcing', learnings: ['Open to more outsourcing, with no concerns about Genpact.', 'Liked that FIS funds access to modern technology like AI.', 'Glad to keep day-to-day control of the relationship.', 'Chris knows Genpact well, having spent three weeks in India evaluating contact centre tech providers.', 'Frames this as a long-term partnership with mutual growth in mind.', 'Targeting £11bn in balances, backed by investment in the Nationwide Credit Card app.'], points: [{ label: 'Concern about additional "material outsourcing" layers under PRA regulation.', id: 'oh-oo-pra' }, { label: 'Are you bringing in support delivery partners?', id: 'oh-oo-partners' }] },
    { lever: 'Offshoring', learnings: ['Open to offshoring chat and back-office (non-voice) work.'], points: [{ label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' }, { label: 'Can a client offshore only part of the service, for example, back office but not voice?', id: 'oh-oo-partial' }, { label: 'What are your key arguments why offshoring (even client facing voice) works?', id: 'oh-off-voice-works' }] },
    { lever: 'Digitization', learnings: ['Keen on digitization and automation, with leadership backing it.'], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: ['Already use a total-cost model, so predictable subscription pricing fits.', 'Growth should not mean a bigger cost base; expects synergies from any move.', 'Anticipates a commercial benefit from offshoring.'], points: [{ label: 'What is the impact on cost if clients select not the full program but only some (e.g. outsourcing, digitization but offshoring only back office)?', id: 'oh-pr-nooffshore' }] },
  ],
  'Fifth Third Bank': [
    { lever: 'Outsourcing', learnings: ['The overall proposal landed well, with little pushback.', 'Sees how outsourcing helps with risk, scale, and technology gaps.'], points: [{ plain: 'N/A' }] },
    { lever: 'Offshoring', learnings: ['Little to no concern about offshoring back-office / non-voice work.'], points: [{ label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' }, { label: 'How do we know this meets standards? (Compliance & Infosec)', id: 'oh-comp-standards' }, { label: 'Can a client offshore only part of the service, for example, back office but not voice?', id: 'oh-oo-partial' }] },
    { lever: 'Digitization', learnings: ['Comfortable adding more technology to their systems and processes.'], points: [{ label: 'Technology must be thoroughly proven end-to-end before moving forward (cited TCS implementation experience).', id: 'oh-tech-walkthroughs' }, { label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' }] },
    { lever: 'Price Maintain', learnings: ['Accepts it costs them nothing extra, as FIS covers the technology cost.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }] },
  ],
  'UMB': [
    { lever: 'Outsourcing', learnings: ["Didn't reject the idea — encouraging given the expected sensitivity.", 'Prefers aligning UMB to the standard operating model over a bespoke solution.', 'Recently involved in multiple outsourcing reviews across the business.', 'Very positive on Genpact selection; believes they have the capability and credibility to deliver.'], points: [{ label: 'Confidence in execution: raised concern based on prior experiences with FIS.', id: 'oh-oo-expertise' }] },
    { lever: 'Offshoring', learnings: ['Exploring the offshoring split: voice from the Philippines, back-office from India.', 'Exploring offshore model opportunities; Technology Modernization identified as primary near-term opportunity.'], points: [{ label: "Where exactly would our client's work be delivered from, and does any data move with it? (model already accepted; confirms the split)", id: 'oh-oo-delivered' }] },
    { lever: 'Digitization', learnings: ['Technology Modernization identified as primary near-term opportunity.', 'Technology capabilities viewed as key differentiator in vendor selection.'], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: ['Challenged concept of maintaining current economics while offshoring.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }, { label: 'Do we charge for implementation cost?', id: 'oh-pr-impl' }] },
  ],
  'Brim Financial': [
    { lever: 'Outsourcing', learnings: [], points: [{ label: 'Is outsourcing mandatory, and what happens if a client refuses it outright? What is the impact to pricing?', id: 'oh-oo-mandatory' }, { label: 'What do we do if a client refuses Genpact or the new model altogether?', id: 'oh-oo-refuse' }] },
    { lever: 'Offshoring', learnings: ['Opposed to offshoring citing data residency and geopolitical concerns', '"Offshoring is never the answer. Automating, yes, offshoring, no."'], points: [{ label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' }, { label: 'Can a client offshore only part of the service, for example, back office but not voice?', id: 'oh-oo-partial' }, { label: "If experienced staff are replaced through offshoring, how do we protect the client's expertise and hold SLAs?", id: 'oh-oo-expertise' }] },
    { lever: 'Digitization', learnings: ['Expects high outcomes, and high customer experiences are the most important.'], points: [{ label: 'Are there recorded walkthroughs of the new tech capabilities (Intelligent Virtual Assistant, Agent Assist, AI Coach, fraud/dispute bots, etc.) that you can show us?', id: 'oh-tech-walkthroughs' }] },
    { lever: 'Price Maintain', learnings: ['Interested in a high-end experience and the cost of it way lower.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }] },
  ],
  "President's Choice": [
    { lever: 'Outsourcing', learnings: ['Open to the outsourcing investment, but wants to see it tied to outbound fraud specifically.'], points: [{ label: 'New Tech Capabilities — what are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-out-techcaps' }] },
    { lever: 'Offshoring', learnings: ['Not a concern for PCF; they already offshore today.', 'New owner EQ Bank runs fully in-house and is finding it costly, so is cautiously evaluating offshoring options.', 'Keeps a 15% Canadian agent population, and wants that preserved.'], points: [{ label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-off-delivered' }, { label: 'Which languages do you currently support across your delivery network? List associated delivery locations.', id: 'oh-off-languages' }] },
    { lever: 'Digitization', learnings: ['Values having agents located in Canada; sees it as a real differentiator.', 'With other providers, customers actively ask to be routed to a Canadian agent.'], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: ["Sees offshoring as offsetting the cost of tech investment, so wants to discuss why the price wouldn't drop.", 'Would push back on flat pricing unless the tech genuinely improves the outbound fraud experience.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }, { label: "If a client outsources, takes the technology but doesn't offshore, does the price change?", id: 'oh-pr-nooffshore' }] },
  ],
  'AIB': [
    { lever: 'Outsourcing', learnings: ['Open to outsourcing, with no concerns about Genpact.', 'Would welcome the enhanced technical capabilities.', 'Keen to keep the strong TMS–Customer Engagement relationship in place.'], points: [{ label: 'New Tech Capabilities — what are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-out-techcaps' }] },
    { lever: 'Offshoring', learnings: ['No objections to offshore voice support.'], points: [{ plain: 'N/A' }] },
    { lever: 'Digitization', learnings: [], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: ['Open to discussing subscription-based pricing.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }] },
  ],
  'Simmons Bank': [
    { lever: 'Outsourcing', learnings: ['Questioned options if they are not able to agree to off-shore/outsource. Plan to go into more detail at pitch and address questions or specifics when the time comes.'], points: [{ label: 'Is outsourcing mandatory, and what happens if a client refuses it outright? What is the impact to pricing?', id: 'oh-oo-mandatory' }, { label: 'What do we do if a client refuses Genpact or the new model altogether?', id: 'oh-oo-genpact-refuse' }] },
    { lever: 'Offshoring', learnings: ['Generally conservative when it comes to offshore support.'], points: [{ label: 'What are your key arguments why offshoring (even client facing voice) works?', id: 'oh-off-voice-works' }] },
    { lever: 'Digitization', learnings: [], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: [], points: [{ plain: 'N/A' }] },
  ],
  'NatWest': [
    { lever: 'Outsourcing', learnings: ['Open to a new provider, as long as the right checks and approvals are in place.', 'Reassured the IVR service will stay reliable.'], points: [{ label: 'Sees this as a possible opportunity to take the final IVR back in-house and terminate our service.', id: 'oh-oo-refuse' }, { label: "What if timing isn't right?", id: 'oh-nc-timing' }, { label: 'Are you bringing in support delivery partners?', id: 'oh-oo-partners' }] },
    { lever: 'Offshoring', learnings: ['N/A — IVR service only, no agents involved.'], points: [{ plain: 'N/A' }] },
    { lever: 'Digitization', learnings: [], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: [], points: [{ plain: 'N/A' }] },
  ],
  'Lloyds': [
    { lever: 'Outsourcing', learnings: ["Views TMS's current approach and tech as outdated.", 'Agreed to wrap robotics and complaints into the conversation, as current hot spots.', 'Wants an early September deep dive.'], points: [{ plain: 'N/A' }] },
    { lever: 'Offshoring', learnings: ['Did not say no to voice offshoring, but will need convincing.', 'Will need to see a financial benefit from offshoring, though hinted this could play out over time.'], points: [{ plain: 'N/A' }] },
    { lever: 'Digitization', learnings: [], points: [{ label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' }] },
    { lever: 'Price Maintain', learnings: ['Unhappy with the current FTE model; wants an outcome/SLA-based approach instead.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }] },
  ],
  'HSBC Technology & Services (USA)': [
{ lever: 'Outsourcing', learnings: ['Have a process for vetting 4th parties and we can expect to have to walk through that as part of contracting process.'], points: [{ plain: 'N/A' }] },
  { lever: 'Offshoring', learnings: [], points: [{ plain: 'N/A' }] },
  { lever: 'Digitization', learnings: ['Interested about the technology and process improvement opportunities.'], points: [{ plain: 'N/A' }] },
    { lever: 'Price Maintain', learnings: ['Simpler more predictable pricing is well received and no pushback on the fixed fee model.'], points: [{ plain: 'N/A' }] },
  ],
  'UBS Financial Services Inc.': [
    { lever: 'Outsourcing', learnings: ['Positive on tech modernization — views current TMS tech as an area that has historically fallen short.', 'Receptive to investment that improves client and agent experience through better technology.'], points: [{ label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' }] },
    { lever: 'Offshoring', learnings: ['Open to hearing the Genpact value prop beyond labor arbitrage (specialized capabilities, automation, quality controls, workforce management).'], points: [{ label: 'Will our work be done through global delivery locations?', id: 'oh-off-global-delivery' }, { label: "Where exactly would our client's work be delivered from, and does any data move with it?", id: 'oh-oo-delivered' }, { label: 'If work moves offshore, how will my current team and contacts be impacted? Will I have the same contacts?', id: 'oh-off-contacts' }, { label: "If experienced staff are replaced through offshoring, how do we protect the client's expertise and hold SLAs?", id: 'oh-off-expertise' }, { label: 'Is outsourcing mandatory, and what happens if a client refuses it outright? What is the impact to pricing?', id: 'oh-oo-mandatory' }] },
    { lever: 'Digitization', learnings: ['Wants better self-service functionality for opening, tracking, and resolving cases.', 'Sees this as a genuine upgrade opportunity, not just a cost play.'], points: [{ label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' }] },
    { lever: 'Price Maintain', learnings: [], points: [{ plain: 'N/A' }] },
  ],
  'Metro Bank': [
    { lever: 'Outsourcing', learnings: ['The transformation concept, using a scale player like Genpact, landed well.', "Genpact is well known to Metro, having just lost out to Infosys for Metro's current transformation."], points: [{ label: 'Are you bringing in support delivery partners?', id: 'oh-oo-partners' }] },
    { lever: 'Offshoring', learnings: ['Open to offshoring voice in principle, but wants small steps to prove the concept first.'], points: [{ plain: 'N/A' }] },
    { lever: 'Digitization', learnings: [], points: [{ label: 'What are the key new tech capabilities to be enabled and their associated benefits?', id: 'oh-cap-list' }] },
    { lever: 'Price Maintain', learnings: ['Unhappy with the current FTE model; wants an outcome/SLA-based approach instead.'], points: [{ label: 'Are costs going up? How is pricing affected?', id: 'oh-pr-costs' }] },
  ],
}

// ── Types ──────────����─────────────────────────────────────────────────��─────────
type StepStatus = 'done' | 'active' | 'pending'
type ConsentStep = 'exploration' | 'alignment' | 'consent'

interface EvidenceRow {
  status: 'y' | 'q' | 'n'
  question: string
  answer: string
  date?: string
  link?: 'faq'
}

interface StageBlock {
  step: ConsentStep
  status: StepStatus
  evidence: EvidenceRow[]
}

interface TrackerClient {
  id: string
  name: string
  region: string
  revenue: string
  wave: number
  currentStep: ConsentStep | 'signed'
  sfStage: string
  stages: StageBlock[]
}

// ── Data ──────────���────────────────────────────────────────────────────────────
// Only clients with completed whisper conversations are shown in the tracker
const CLIENTS: TrackerClient[] = [
  {
    id: 'vm',
    name: 'Virgin Money',
    region: 'EMEA',
    revenue: '$27.2M',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 1 · Early Engagement',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '15 May 2026', link: 'faq' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Open to further outsourcing; concerns around PRA regulation and offshore voice flagged.', link: 'faq' },
          { status: 'q', question: 'Has the client remained engaged in the process?', answer: 'No formal follow-up confirmed yet.' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'ft',
    name: 'Fifth Third Bank',
    region: 'NA',
    revenue: '$14.1M',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 2 · Early Sales',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '8 Jun 2026', link: 'faq' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested case studies on digital transformation and geographic delivery capabilities.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Follow-up meeting scheduled; internal sponsors committed.' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'umb',
    name: 'UMB',
    region: 'NA',
    revenue: '$10.3M',
    wave: 1,
    currentStep: 'alignment',
    sfStage: 'Stage 3 · Mid Sales',
    stages: [
      {
        step: 'exploration',
        status: 'done',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '22 May 2026', link: 'faq' },
          { status: 'y', question: 'Did the client request additional information?', answer: 'Yes. Requested offshore capability details and delivery location options for voice and back-office.', link: 'faq' },
          { status: 'y', question: 'Has the client remained engaged in the process?', answer: 'Yes. Formal pitch requested; targeting late August or early September.' },
        ],
      },
      {
        step: 'alignment',
        status: 'active',
        evidence: [
          { status: 'q', question: 'Has the client requested pricing or commercial detail?', answer: 'Partially. Pricing benchmarked against market rates; challenged current economics — expects topic to resurface.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed — formal pitch not yet delivered.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
  {
    id: 'nw',
    name: 'NatWest',
    region: 'EMEA',
    revenue: '$25.2K',
    wave: 1,
    currentStep: 'exploration',
    sfStage: 'Stage 2 · Early Sales',
    stages: [
      {
        step: 'exploration',
        status: 'active',
        evidence: [
          { status: 'y', question: 'Have whisper conversations been held?', answer: 'Yes. Whisper held.', date: '28 May 2026', link: 'faq' },
          { status: 'q', question: 'Did the client request additional information?', answer: 'No request yet', link: 'faq' },
          { status: 'q', question: 'Has the client remained engaged in the process?', answer: 'Not Assessed Yet' },
        ],
      },
      {
        step: 'alignment',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Has the client requested pricing or commercial detail?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has the client requested implementation specifics?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Is the client willing to review a proposal and amendment?', answer: 'Not yet assessed.' },
        ],
      },
      {
        step: 'consent',
        status: 'pending',
        evidence: [
          { status: 'n', question: 'Is the client willing to begin amendment discussions?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Have redlines or contract negotiations started?', answer: 'Not yet assessed.' },
          { status: 'n', question: 'Has internal risk, legal, or procurement review been initiated?', answer: 'Not yet assessed.' },
        ],
      },
    ],
  },
]

// ── Summary stats ────────��────────────────────────────────────────────────────
const STATS = [
  {
    label: 'Exploration',
    tag: 'WHISPER',
  count: 56,
  countColor: INK,
  revenue: '$59.5M',
    revenueLabel: 'Annual contract value',
    region: '2 NA · 1 EMEA',
    descriptionParts: [
      { text: 'The client is ', bold: false },
      { text: 'willing to engage, learn more, and evaluate', bold: true },
      { text: ' the opportunity.', bold: false },
    ],
    sfStages: 'Stage 1–2 · New Opportunity / Early Sales',
  },
  {
    label: 'Alignment',
    tag: 'PITCH',
  count: 8,
  countColor: '#0891b2',
  revenue: '$85.3M',
  revenueLabel: 'Annual contract value',
  region: '8 clients',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'wants the specifics', bold: true },
      { text: ' — asking for pricing, commercial detail, and implementation plans, and willing to review a proposal.', bold: false },
    ],
    sfStages: 'Stage 3–4 · Late Sales / Pricing',
  },
  {
    label: 'Committed',
    tag: 'POST-PITCH',
    count: 0,
    countColor: GREEN,
    revenue: '$0M',
    revenueLabel: 'Annual contract value committed',
    region: '0 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'has decided to move forward', bold: true },
      { text: ' and begins execution — amendment discussions, redlines, and internal legal / risk / procurement.', bold: false },
    ],
    sfStages: 'Stage 5 · Contracting',
  },
  {
    label: 'Not Pursuing',
    tag: 'CLOSED',
    count: 0,
    countColor: '#B21A53',
    revenue: '$0M',
    revenueLabel: 'Annual contract value',
    region: '0 NA · 0 EMEA',
    descriptionParts: [
      { text: 'The client ', bold: false },
      { text: 'has declined to proceed', bold: true },
      { text: ' — either the client has formally rejected the proposal, or the opportunity has been disqualified.', bold: false },
    ],
    sfStages: 'Stage 7 · Disqualified',
  },
]

// ── Sub-components ──────────────────────────────────────��──────────────────────
function TickIcon({ status }: { status: 'y' | 'q' | 'n' }) {
  const map = {
    y: { bg: GREEN_BG,  color: GREEN, label: '✓' },
    q: { bg: AMBER_BG,  color: AMBER, label: '?' },
    n: { bg: GRAY_BG,   color: GRAY,  label: '–' },
  }
  const s = map[status]
  return (
    <span style={{
      flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 800, marginTop: 1,
    }}>{s.label}</span>
  )
}

function Badge({ status }: { status: StepStatus }) {
  const map: Record<StepStatus, { bg: string; color: string; dot: string; label: string }> = {
    done:    { bg: GREEN_BG,  color: GREEN, dot: GREEN,  label: 'Complete' },
    active:  { bg: AMBER_BG,  color: AMBER, dot: AMBER,  label: 'In progress' },
    pending: { bg: GRAY_BG,   color: GRAY,  dot: GRAY,   label: 'Not yet assessed' },
  }
  const s = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 16,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function CurrentStagePill({ step }: { step: TrackerClient['currentStep'] }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
  exploration:   { bg: '#e5e8ed',  color: INK, label: 'Exploration' },
  alignment:     { bg: '#cce9f7',  color: '#0891b2',  label: 'Alignment' },
    consent:       { bg: GREEN_BG,   color: GREEN,       label: 'Committed' },
    committed:     { bg: GREEN_BG,   color: GREEN,       label: 'Committed' },
    'not-pursuing':{ bg: '#fce8ef',  color: '#B21A53',   label: 'Not Pursuing' },
    signed:        { bg: INK,        color: '#fff',      label: 'Signed' },
  }
  const s = map[step]
  return (
    <span style={{
      display: 'inline-block', padding: '5px 12px', borderRadius: 14,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase',
    }}>{s.label}</span>
  )
}

function StepLabel({ step }: { step: ConsentStep }) {
  const map: Record<ConsentStep, string> = {
    exploration: 'Exploration',
    alignment:   'Alignment',
    consent:     'Committed',
  }
  const sub: Record<ConsentStep, string> = {
    exploration: 'Whisper',
    alignment:   'Pitch',
    consent:     'Post-Pitch',
  }
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: INK }}>{map[step]}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>{sub[step]}</div>
    </div>
  )
}

function SbHead({ step, status }: { step: ConsentStep; status: StepStatus }) {
  const bgMap: Record<StepStatus, string> = { done: GREEN_BG, active: AMBER_BG, pending: GRAY_BG }
  const colorMap: Record<StepStatus, string> = { done: GREEN, active: AMBER, pending: MUTED_D }
  const labelMap: Record<StepStatus, string> = { done: 'Complete', active: 'In progress', pending: 'Not yet assessed' }
  return (
    <div style={{
      padding: '11px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: BORDER, background: bgMap[status],
    }}>
      <StepLabel step={step} />
      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: colorMap[status] }}>
        {labelMap[status]}
      </span>
    </div>
  )
}

function EvidenceRows({ rows, onLink }: { rows: EvidenceRow[]; onLink: (target: 'faq') => void }) {
  return (
    <div style={{ padding: '6px 14px 12px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 11, alignItems: 'flex-start',
          padding: '11px 0', borderTop: i > 0 ? BORDER : 'none',
          opacity: r.status === 'n' ? 0.7 : 1,
        }}>
          <TickIcon status={r.status} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.status === 'n' ? MUTED : INK, lineHeight: 1.35 }}>{r.question}</div>
            <div style={{ fontSize: 12, color: r.status === 'n' ? MUTED : 'rgba(26,31,78,0.75)', lineHeight: 1.5, marginTop: 4, fontStyle: r.status === 'n' ? 'italic' : 'normal' }}>
              {r.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientRow({ client, onLink }: { client: TrackerClient; onLink: (target: Page) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Main row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'grid',
          gridTemplateColumns: '2.1fr 1fr 1fr 1fr 1.6fr 40px',
          padding: '16px 22px',
          alignItems: 'center',
          borderBottom: BORDER,
          cursor: 'pointer',
          background: open ? '#fafbfc' : '#fff',
          transition: 'background 0.12s',
          gap: 8,
        }}
      >
        {/* Client info */}
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{client.name}</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{client.region} · {client.revenue} · Wave {client.wave}</div>
        </div>

        {/* 3 stage badge columns */}
        {client.stages.map(s => (
          <div key={s.step} style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge status={s.status} />
          </div>
        ))}

        {/* Current stage */}
        <div>
          <CurrentStagePill step={client.currentStep} />
        </div>

        {/* Chevron */}
        <div style={{ textAlign: 'center', color: MUTED, fontSize: 13, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none', userSelect: 'none' }}>▾</div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ background: '#fff', borderBottom: BORDER }}>
          <div style={{ padding: '6px 22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, paddingTop: 16 }}>
              {client.stages.map(s => (
                <div key={s.step} style={{ border: BORDER, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <SbHead step={s.step} status={s.status} />
                  <EvidenceRows
                    rows={s.evidence}
                    onLink={target => onLink(target === 'debrief' ? 'debrief' : 'faq')}
                  />
                </div>
              ))}
            </div>
            {/* Whisper Debrief button at bottom */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={e => { e.stopPropagation(); onLink('debrief') }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px',
                  background: 'rgba(26,31,78,0.06)', border: '1px solid rgba(26,31,78,0.12)',
                  borderRadius: 20, fontSize: 12, fontWeight: 700, color: INK,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                }}
              >
                <span style={{ fontSize: 13 }}>→</span>
                Whisper Conversation Debrief
                <span style={{ fontSize: 10, opacity: 0.6 }}>▸</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ConsentTrackerPage({ page, onNavigate, onFaqLink }: { page: Page; onNavigate: (p: Page) => void; onFaqLink: (id: string) => void }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin - Consent Tracker" />

      <div style={{ padding: '0 32px 56px' }}>

        {/* Page description */}
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 24 }}>
          Client-by-client progression through Exploration, Alignment, Committed, and Not Pursuing across each Wave. Shows program coverage per Wave. Click a client to view its details.
        </p>

        {/* ��─ Stage definition cards — KpiSection style ────────────── */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e4ee',
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          marginBottom: 28,
          overflow: 'hidden',
        }}>
          {/* Section title bar */}
          {/* Title bar */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #e2e4ee' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Consent stages</span>
          </div>

          {/* Color bar per stage */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: 5 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: s.countColor }} />
            ))}
          </div>

          {/* Four equal columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: '18px 22px 22px',
                borderLeft: i > 0 ? '1px solid #e2e4ee' : undefined,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}>
                {/* Stage label + tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.countColor }}>{s.label}</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 999, background: `${s.countColor}18`, color: s.countColor, fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.tag}</span>
                </div>

                {/* ACV + client count inline */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: s.countColor, lineHeight: 1 }}>{s.revenue}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: INK, lineHeight: 1 }}>{s.count}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: MUTED_D, lineHeight: 1 }}>{s.count === 1 ? 'client' : 'clients'}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED_D, marginBottom: 14 }}>{s.revenueLabel}</div>

                {/* Description */}
                <div style={{ fontSize: 13, color: MUTED_D, lineHeight: 1.6, marginBottom: 18, flex: 1 }}>
                  {s.descriptionParts.map((part, pi) => (
                    part.bold
                      ? <strong key={pi} style={{ color: INK, fontWeight: 700 }}>{part.text}</strong>
                      : <span key={pi}>{part.text}</span>
                  ))}
                </div>

                {/* SF mapping pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: 12, fontWeight: 500,
                  color: 'rgba(26,31,78,0.50)',
                  background: 'rgba(26,31,78,0.05)',
                  border: '1px solid rgba(26,31,78,0.10)',
                  borderRadius: 20,
                  padding: '5px 14px',
                  alignSelf: 'flex-start',
                  marginTop: 'auto',
                }}>
                  {s.sfStages}
                </div>

                {i < STATS.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: '50%',
                      width: 18,
                      height: 18,
                      background: '#fff',
                      borderTop: '2px solid #e2e4ee',
                      borderRight: '2px solid #e2e4ee',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 2,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Where the ACV actually sits */}
          <div style={{ borderTop: '1px solid #e2e4ee', padding: '20px 22px 24px' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Where the ACV actually sits</span>
            </div>

            {/* Bars */}
            {(() => {
              const maxAcv = 85.3
              const target = 25
              const targetPct = (target / maxAcv) * 100
              const bars = [
{ label: 'Exploration', color: INK, acv: 59.5, clients: 56, text: '$59.5M', empty: false },
  { label: 'Alignment',   color: '#0891b2', acv: 85.3, clients: 8, text: '$85.3M', empty: false },
                { label: 'Committed',   color: '#4bcd3e', acv: 0,     clients: 0,   text: '',       empty: true  },
              ]
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
                  {bars.map((bar) => {
                    const widthPct = bar.acv > 0 ? Math.max((bar.acv / maxAcv) * 100, 8) : 0
                    return (
                      <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 80, textAlign: 'right', fontSize: 13, fontWeight: 700, color: bar.color, flexShrink: 0 }}>{bar.label}</div>
                        <div style={{ flex: 1, position: 'relative' }}>
                          {bar.empty ? (
                            <div style={{ height: 36, display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 13, color: MUTED_D, fontStyle: 'italic', border: '1px dashed rgba(26,31,78,0.18)', borderRadius: 6 }}>
                              $0M — no clients converted yet
                            </div>
                          ) : (
                            <div style={{ width: `${widthPct}%`, height: 36, background: bar.color, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{bar.text}</span>
                            </div>
                          )}
                          {/* $25M target line — label only on first bar */}
                          {bar.label === 'Exploration' && (
                            <div style={{ position: 'absolute', top: -20, left: `${targetPct}%`, transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#c0392b', whiteSpace: 'nowrap' }}>
                              ▼ $25M target
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${targetPct}%`, width: 1, borderLeft: '2px dashed #c0392b', pointerEvents: 'none' }} />
                        </div>
                      </div>
                    )
                  })}

                </div>
              )
            })()}
          </div>
        </div>

        {/* ── Program coverage by wave ────────────────────────────── */}
        {(() => {
          const waves = [
            { label: 'Wave 1', status: 'STARTED',     statusColor: '#4bcd3e', statusBg: '#e9fbe6', statusText: '#1d6b12', acv: '$93.5M',  acvPct: 64, clients: 20, clientPct: 31 },
            { label: 'Wave 2', status: 'NOT STARTED', statusColor: '#9aa0b0', statusBg: '#f0f1f5', statusText: '#556070', acv: '$17.0M',  acvPct: 12, clients: 21, clientPct: 33 },
            { label: 'Wave 3', status: 'NOT STARTED', statusColor: '#9aa0b0', statusBg: '#f0f1f5', statusText: '#556070', acv: '$34.7M',  acvPct: 24, clients: 23, clientPct: 36 },
          ]
          const CELL: React.CSSProperties = { padding: '18px 24px', borderLeft: '1px solid #e8eaf0', verticalAlign: 'top' }
          const LABEL: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'rgba(26,31,78,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }
          return (
            <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e4ee', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(26,31,78,0.06)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid #e8eaf0' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: INK }}>Program coverage by wave</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {/* Column headers */}
                <thead>
                  <tr style={{ borderBottom: '1px solid #e8eaf0' }}>
                    <th style={{ width: 140, padding: '14px 24px', textAlign: 'left' }} />
                    {waves.map(w => (
                      <th key={w.label} style={{ ...CELL, textAlign: 'right', fontWeight: 800 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: INK, marginBottom: 6 }}>{w.label}</div>
                        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', padding: '3px 9px', borderRadius: 20, background: w.statusBg, color: w.statusText }}>
                          {w.status}
                        </span>
                      </th>
                    ))}
                    <th style={{ ...CELL, textAlign: 'right', fontWeight: 800 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#431C5B', marginBottom: 6 }}>TOTAL</div>
                      <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', padding: '3px 9px', borderRadius: 20, background: 'rgba(67,28,91,0.1)', color: '#431C5B' }}>
                        WAVE 1–3
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* ACV row */}
                  <tr style={{ borderBottom: '1px solid #e8eaf0' }}>
                    <td style={{ padding: '18px 24px', verticalAlign: 'middle' }}>
                      <span style={{ ...LABEL }}>ACV Business Case</span>
                    </td>
                    {waves.map(w => (
                      <td key={w.label} style={{ ...CELL, textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: INK, marginBottom: 8 }}>{w.acv}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                          <div style={{ flex: 1, height: 10, borderRadius: 5, background: '#e8eaf0', maxWidth: 120 }}>
                            <div style={{ width: `${w.acvPct}%`, height: '100%', borderRadius: 3, background: '#431C5B' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,31,78,0.5)', minWidth: 28 }}>{w.acvPct}%</span>
                        </div>
                      </td>
                    ))}
                    <td style={{ ...CELL, textAlign: 'right', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#431C5B' }}>$145.2M</span>
                    </td>
                  </tr>
                  {/* Clients row */}
                  <tr>
                    <td style={{ padding: '18px 24px', verticalAlign: 'middle' }}>
                      <span style={{ ...LABEL }}>Clients</span>
                    </td>
                    {waves.map(w => (
                      <td key={w.label} style={{ ...CELL, textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: INK, marginBottom: 8 }}>{w.clients}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                          <div style={{ flex: 1, height: 10, borderRadius: 5, background: '#e8eaf0', maxWidth: 120 }}>
                            <div style={{ width: `${w.clientPct}%`, height: '100%', borderRadius: 3, background: INK }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,31,78,0.5)', minWidth: 28 }}>{w.clientPct}%</span>
                        </div>
                      </td>
                    ))}
                    <td style={{ ...CELL, textAlign: 'right', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#431C5B' }}>64</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })()}

        {/* ── Wave 1 Client Detail ────────────────────────── */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Wave 1 Whisper Completion ──────────────���──────────────── */}
        {(() => {
          const cols = [
            {
              label: 'Completed', date: null, barColor: '#4bcd3e', acv: '$86.8M', acvColor: '#4bcd3e',
              meta: '11 clients · 93% of ACV · 55% of clients',
              names: ['Virgin Money', 'Fifth Third Bank', 'UMB', 'AIB', 'Simmons Bank', "President's Choice", 'Metro Bank', 'Lloyds', 'UBS', 'Brim Financial', 'HSBC'],
              nameColor: '#4bcd3e',
            },
            {
  label: 'No whisper planned', date: null, barColor: INK, acv: '$6.7M', acvColor: INK,
  meta: '9 clients · 7% of ACV · 45% of clients',
  names: ['First Bank Puerto Rico', 'Centene Corporation', 'ServisFirst', 'Union Bank', 'Citizens Bank', 'The Bank of Nova Scotia', 'Citibank', 'Empire Innovation Group', 'MotivHealth'],
              nameColor: INK,
            },
          ]
          const ALIGNMENT = '#0891b2'
          const alignmentCols = [
            {
              label: 'Completed', date: null, barColor: '#4bcd3e', acv: '$9.9M', acvColor: '#4bcd3e',
              meta: '1 client · 11% of ACV · 5% of clients',
              names: ['UMB'],
              nameColor: '#4bcd3e',
            },
            {
              label: 'Pitch Scheduled', date: null, barColor: ALIGNMENT, acv: '$47.1M', acvColor: ALIGNMENT,
              meta: '3 clients · 50% of ACV · 15% of clients',
              names: ['Metro Bank (Sep 10)', 'Lloyds (Sep 15)', 'Virgin Money (Oct 5)'],
              nameColor: INK,
            },
            {
  label: 'Pitch ETA', date: 'Sep 31', barColor: ALIGNMENT, acv: '$28.3M', acvColor: ALIGNMENT,
  meta: '4 clients · 30% of ACV · 20% of clients',
  names: ['Fifth Third Bank', 'UBS', 'Centene', 'HSBC'],
              nameColor: INK,
            },
          ]
          return (
            <div style={{ background: 'white', border: '1px solid #e2e4ee', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 22px 10px', borderBottom: '1px solid #e2e4ee' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: INK }}>Wave 1 Consent Status</span>
              </div>
              {(() => {
                const renderCard = (col: typeof cols[number], bordered: boolean) => (
                  <div style={{ padding: '20px 22px', borderLeft: bordered ? '1px solid #e2e4ee' : undefined, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{col.label}</span>
                      {col.date && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 999, background: `${col.barColor}18`, color: col.barColor, fontSize: 13, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap' }}>{col.date}</span>}
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: col.acvColor, lineHeight: 1, marginBottom: 6 }}>{col.acv}</div>
                    <div style={{ fontSize: 12, color: 'rgba(26,31,78,0.55)', marginBottom: 14, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700, color: INK }}>{col.meta.split(' · ')[0]}</span>
                      {' · ' + col.meta.split(' · ').slice(1).join(' · ')}
                    </div>
                    <div style={{ borderTop: '1px dashed #d4d7e3', marginBottom: 14 }} />
                    <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'disc', flex: 1 }}>
                      {col.names.map((name, ni) => (
                        <li key={ni} style={{ fontSize: 13, color: col.nameColor, marginBottom: 5, lineHeight: 1.5 }}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )

                return (
                  <>
                    {/* Stage labels row */}
                    <div style={{ display: 'flex', padding: '10px 22px 0' }}>
                      <div style={{ flex: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK, whiteSpace: 'nowrap' }}>
                  Exploration
                        </span>
                      </div>
                      <div style={{ width: 30, flexShrink: 0 }} />
                      <div style={{ flex: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: ALIGNMENT, whiteSpace: 'nowrap' }}>
                  Alignment
                        </span>
                      </div>
                    </div>

                    {/* Stage color bars + flow arrow */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 22px 0' }}>
                      <div style={{ flex: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        {cols.map((c, i) => (
                          <div key={i} style={{ height: 5, background: INK }} />
                        ))}
                      </div>
                      <div style={{ width: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M2 8H13M13 8L9 4M13 8L9 12" stroke={ALIGNMENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {alignmentCols.map((_, i) => (
                          <div key={i} style={{ height: 5, background: ALIGNMENT, borderRadius: i === 2 ? '0 3px 3px 0' : undefined }} />
                        ))}
                      </div>
                    </div>

                    {/* Column cards */}
                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                      <div style={{ flex: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        {cols.map((col, i) => (
                          <div key={i}>{renderCard(col, i > 0)}</div>
                        ))}
                      </div>
                      <div style={{ width: 30, flexShrink: 0 }} />
                      <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {alignmentCols.map((col, i) => (
                          <div key={i}>{renderCard(col, true)}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          )
        })()}

        {/* ── Wave 1 Client Details wrapper ──────────�����───��─────────�����─��─ */}
        <div style={{ border: '1px solid #e2e4ee', borderRadius: 14, overflow: 'hidden', background: '#f8f9fc', boxShadow: '0 1px 6px rgba(26,31,78,0.06)' }}>

          {/* Section header */}
          <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #e2e4ee', background: '#fff' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: INK, letterSpacing: '0.005em' }}>Wave 1 Client Details</span>
          </div>

          {/* Metric cards inside the wrapper */}
          <div style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {/* Card 1: Wave 1 clients engaged */}
          <div style={{ background: '#fff', padding: '24px 22px', borderRadius: 12, border: '1px solid #e2e4ee', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: '#4bcd3e', lineHeight: 1 }}>20</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1 }}>($93.5M)</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(26,31,78,0.42)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wave 1 clients engaged</div>
          </div>

          {/* Card 2: In Wave 1 whisper scope */}
          <div style={{ background: '#fff', padding: '24px 22px', borderRadius: 12, border: '1px solid #e2e4ee', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#4bcd3e', lineHeight: 1, marginBottom: 8 }}>11</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(26,31,78,0.42)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Wave 1 whisper scope (9 not planned)</div>
          </div>

          {/* Card 3: Of in-scope whisper ACV in Alignment */}
          <div style={{ background: '#fff', padding: '24px 22px', borderRadius: 12, border: '1px solid #e2e4ee', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#4bcd3e', lineHeight: 1, marginBottom: 8 }}>59%</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(26,31,78,0.42)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Of in-scope whisper ACV in Alignment</div>
          </div>

          {/* Card 4: Avg propensity score */}
          <div style={{ background: '#fff', padding: '24px 22px', borderRadius: 12, border: '1px solid #e2e4ee', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#4bcd3e', lineHeight: 1, marginBottom: 8 }}>88</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(26,31,78,0.42)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. propensity score (in-scope)</div>
          </div>
          </div>{/* end metric cards grid */}

          {/* ── Wave 1 Client Detail Table — connected flush inside wrapper */}
          <div style={{ marginTop: 20 }}>
          <div style={{ overflow: 'hidden', borderTop: BORDER }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr 28px', background: INK, color: '#fff', padding: '11px 20px', gap: 8, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, alignItems: 'center' }}>
              <div>Client Name</div>
              <div>ACV Business Case</div>
              <div style={{ textAlign: 'center' }}>Salesforce Stage</div>
              <div style={{ textAlign: 'center' }}>Rating Outsourcing</div>
              <div style={{ textAlign: 'center' }}>Rating Offshoring</div>
              <div style={{ textAlign: 'center' }}>Rating Digitization</div>
              <div style={{ textAlign: 'center' }}>Rating Price Maintain</div>
              <div style={{ textAlign: 'center' }}>Overall Propensity Score</div>
              <div style={{ textAlign: 'center' }}>Client Progress Status</div>
            </div>
            {/* Rows */}
            {(() => {
              const rows = [
                { name: 'Virgin Money',                   acv: '$26.2M', sfStage: '3', out: 'High',   off: 'Medium',     dig: 'High',   price: 'Low',    score: 81,   status: 'Alignment' },
                { name: 'Fifth Third Bank',               acv: '$13.6M', sfStage: '3', out: 'High',   off: 'Medium',     dig: 'High',   price: 'Medium', score: 88,   status: 'Alignment' },
                { name: 'Metro Bank',                     acv: '$11.8M', sfStage: '3', out: 'High',   off: 'High',       dig: 'High',   price: 'Low',    score: 88,   status: 'Alignment' },
                { name: 'UMB',                            acv: '$9.9M',  sfStage: '3', out: 'High',   off: 'High',       dig: 'Medium', price: 'Medium', score: 88,   status: 'Alignment' },
                { name: 'Lloyds',                         acv: '$9.1M',  sfStage: '3', out: 'High',   off: 'Medium',     dig: 'High',   price: 'Low',    score: 81,   status: 'Alignment' },
                { name: 'UBS Financial Services Inc.',    acv: '$8.3M',  sfStage: '3', out: 'Medium', off: 'Medium',     dig: 'High',   price: 'High',   score: 88,   status: 'Alignment' },
                { name: 'Centene Corporation',            acv: '$3.5M',  sfStage: '3', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'Alignment' },
                { name: 'HSBC Technology & Services (USA)', acv: '$2.9M', sfStage: '3', out: 'High', off: 'High', dig: 'High', price: 'High', score: 100, status: 'Alignment' },
                { name: 'AIB',                            acv: '$1.8M',  sfStage: '2', out: 'High',   off: 'High',       dig: 'Medium', price: 'High',   score: 94,   status: 'Exploration' },
                { name: 'Simmons Bank',                   acv: '$1.6M',  sfStage: '2', out: 'High',   off: 'High',       dig: 'High',   price: 'Medium', score: 94,   status: 'Exploration' },
                { name: 'First Bank Puerto Rico',         acv: '$1.6M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'Exploration' },
                { name: 'Brim Financial',                 acv: '$1.1M',  sfStage: '1', out: 'Low',    off: 'Low',        dig: 'High',   price: 'Low',    score: 61,   status: 'Exploration' },
                { name: 'ServisFirst',                    acv: '$0.6M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: "President's Choice",             acv: '$0.5M',  sfStage: '2', out: 'High',   off: 'High',       dig: 'High',   price: 'High',   score: 100,  status: 'Exploration' },
                              { name: 'Union Bank (MUFG)',               acv: '$0.3M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: 'Citizens Bank',                  acv: '$0.3M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: 'The Bank Of Nova Scotia',        acv: '$0.2M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: 'Citibank',                       acv: '$0.1M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: 'Empire Innovation Group',        acv: '$0.0M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
                { name: 'MotivHealth',                    acv: '$0.0M',  sfStage: '1', out: null,     off: null,         dig: null,     price: null,     score: null, status: 'No Whisper' },
              ]

              const ratingChip = (val: string | null) => {
                if (!val) return <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>
                const isHigh = val.toLowerCase().startsWith('high')
                const isMed  = val.toLowerCase().startsWith('med')
                const bg   = isHigh ? '#e9fbe6' : isMed ? '#E6E7E8' : '#fce8ef'
                const col  = isHigh ? '#1d6b12' : isMed ? '#3d4455' : '#8a1040'
                const dot  = isHigh ? '#4bcd3e' : isMed ? '#6f7d94' : '#B21A53'
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', borderRadius: 7, background: bg, color: col, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', border: '1.5px solid transparent' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                    {val}
                  </span>
                )
              }
              const statusChip = (s: string) => {
                const col = s === 'Alignment' ? '#0891b2' : s === 'Exploration' ? INK : MUTED
                const bg  = s === 'Alignment' ? '#cce9f7' : s === 'Exploration' ? '#e5e8ed' : GRAY_BG
                return <span style={{ background: bg, color: col, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{s}</span>
              }

              return rows.map((row, i) => {
                const isAlt    = i % 2 === 1
                const isOpen   = expandedRow === row.name
                const whisper  = WHISPER_DATA[row.name] ?? []
                const defaultLevels = ['Outsourcing', 'Offshoring', 'Digitization', 'Price Maintain']
                const displayData = whisper.length > 0 ? whisper : defaultLevels.map(l => ({ lever: l, learnings: [], points: [{ plain: 'N/A' }] }))

                return (
                  <div key={row.name}>
                    {/* Main row */}
                    <div
                      onClick={() => setExpandedRow(isOpen ? null : row.name)}
                      style={{
                        display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1fr 1fr 0.8fr 1.1fr 28px',
                        padding: '10px 20px', gap: 8, fontSize: 12.5, alignItems: 'center',
                        background: isOpen ? 'rgba(91,45,110,0.04)' : isAlt ? '#fafbfc' : '#fff',
                        borderBottom: BORDER,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLDivElement).style.background = 'rgba(91,45,110,0.03)' }}
                      onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLDivElement).style.background = isAlt ? '#fafbfc' : '#fff' }}
                    >
                      <div style={{ fontWeight: 600, color: INK }}>{row.name}</div>
                      <div style={{ fontWeight: 700, color: INK }}>{row.acv}</div>
                      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#1a1f4e' }}>Stage {row.sfStage}</div>
                      <div style={{ textAlign: 'center' }}>{ratingChip(row.out)}</div>
                      <div style={{ textAlign: 'center' }}>{ratingChip(row.off)}</div>
                      <div style={{ textAlign: 'center' }}>{ratingChip(row.dig)}</div>
                      <div style={{ textAlign: 'center' }}>{ratingChip(row.price)}</div>
                      <div style={{ textAlign: 'center' }}>{row.score != null ? <span style={{ fontSize: 16, fontWeight: 900, color: row.score >= 75 ? '#4bcd3e' : GRAY }}>{row.score}</span> : <span style={{ color: 'rgba(26,31,78,0.4)', fontStyle: 'italic', fontSize: 11 }}>—</span>}</div>
                      <div style={{ textAlign: 'center' }}>{statusChip(row.status)}</div>
                      <div style={{ textAlign: 'center', color: 'rgba(26,31,78,0.35)', fontSize: 13, transition: 'transform .15s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</div>
                    </div>

                    {/* Expandable whisper detail panel */}
                    {isOpen && (
                      <div style={{ borderBottom: BORDER, background: '#fafbff' }}>
                        {/* Panel header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '14% 43% 43%', background: '#f0eef8', borderBottom: '1px solid #e2ddf0' }}>
                          {['Lever', 'Learnings', 'Points to Address'].map(h => (
                            <div key={h} style={{ padding: '9px 20px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#5b2d6e' }}>{h}</div>
                          ))}
                        </div>
                        {/* Lever rows */}
                        {displayData.map((lev, li) => (
                          <div key={lev.lever} style={{ display: 'grid', gridTemplateColumns: '14% 43% 43%', borderTop: li > 0 ? '1px solid #eef0f6' : undefined }}>
                            <div style={{ padding: '12px 20px', fontSize: 11.5, fontWeight: 700, color: INK, textTransform: 'uppercase', letterSpacing: '0.04em', paddingTop: 14 }}>{lev.lever}</div>
                            <div style={{ padding: '12px 20px', fontSize: 12.5, lineHeight: 1.55, color: INK, borderLeft: '1px solid #eef0f6' }}>
                              {lev.learnings.length === 0
                                ? <span style={{ color: 'rgba(26,31,78,0.38)', fontStyle: 'italic', fontSize: 11.5 }}>N/A</span>
                                : lev.learnings.map((l, idx) => (
                                  <div key={idx} style={{ position: 'relative', paddingLeft: 14, marginBottom: idx < lev.learnings.length - 1 ? 5 : 0 }}>
                                    <span style={{ position: 'absolute', left: 2, color: 'rgba(26,31,78,0.4)' }}>•</span>
                                    {l}
                                  </div>
                                ))
                              }
                            </div>
                            <div style={{ padding: '12px 20px', fontSize: 12.5, lineHeight: 1.55, color: INK, borderLeft: '1px solid #eef0f6' }}>
                              {lev.points.map((p, idx) => (
                                'plain' in p
                                  ? <div key={idx} style={{ color: 'rgba(26,31,78,0.38)', fontStyle: 'italic', fontSize: 11.5 }}>{p.plain}</div>
                                  : <div key={idx} style={{ position: 'relative', paddingLeft: 14, marginBottom: idx < lev.points.length - 1 ? 5 : 0 }}>
                                      <span style={{ position: 'absolute', left: 2, color: 'rgba(26,31,78,0.4)' }}>•</span>
                                      <button
                                        onClick={e => { e.stopPropagation(); onFaqLink(p.id) }}
                                        style={{
                                          background: 'none', border: 'none', padding: 0,
                                          fontFamily: 'inherit', fontSize: 12.5, color: INK,
                                          cursor: 'pointer', textAlign: 'left',
                                          borderBottom: '1px dotted rgba(91,45,110,0.5)',
                                          lineHeight: 1.55,
                                        }}
                                      >
                                        {p.label} <span style={{ fontSize: 10, color: '#5b2d6e' }}>→ FAQ</span>
                                      </button>
                                    </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>{/* closes table overflow div */}
          </div>{/* closes marginTop wrapper */}
        </div>{/* closes Wave 1 Client Details outer box */}
      </div>{/* closes Wave 1 section div (754) */}

      </div>
    </div>
  )
}
