'use client'

import { useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'debrief' | 'faq' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar'

// ── Shared style tokens ───────────────────────────────────────────────────────
const INK = '#1a1f4e'
const BORDER = '1px solid #e5e7eb'
const MUTED = 'rgba(26,31,78,0.55)'

// ============================================================
// EDIT HERE: rows for the new Sales FAQ table. Paste the CSV
// contents in as rows matching this shape — one object per
// question/response.
// ============================================================
export type FaqNewStatus = 'Complete' | 'WIP' | 'Delayed'
export type FaqNewRow = {
  category: string
  sharedWithGenpact: string
  points: string
  response: string
  responseDate: string
  status: FaqNewStatus
  followUp: string
  commentPwc: string
}

const FAQ_NEW_DATA: FaqNewRow[] = [
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Are there sample recordings of Philippines-based agents handling live calls, so you can show us what voice quality and English fluency sound like?',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Can all clients use all planned Tech capabilities or are there certain prerequisites (e.g. platform, technical) which must be fulfilled?',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Are there recorded walkthroughs of the new tech capabilities that you can show us?',
    response: '[9/10/2026] Genpact did live demos.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: 'In contact with Genpact and Chanda (Tech workstream) to develop client facing sales demos.',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Would you be open to join client meetings for a detailed demo at some point later in the sales process?',
    response: "[8/20/2026] Genpact is open to join client meetings and do demo's as required.",
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes - reframed',
    points: 'For each proposed technology capability, confirm: (a) whether it can be excluded for an individual client without affecting delivery of the remaining scope, (b) which capabilities are foundational and cannot be excluded, and (c) the operational impact of exclusion at client level, covering staffing model, SLA attainment, and transition sequencing. Respond at the capability level, not in aggregate.',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'Where will our data live, and how is it protected?',
    response: '[8/20/2026] Data will continue to reside with FIS/TIS; you will continue to have same controls and security protections you have today. Genpact access client applications through secure virtual desktop solutions such as Citrix, Azure Virtual Desktop, VPN-secured environments. As a result, data remains within the FIS infrastructure and is not transferred to, hosted in, or stored within Genpact systems.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Outsourcing & Offshoring',
    sharedWithGenpact: 'Yes',
    points: 'What are your key arguments why offshoring (even client facing voice) works?',
    response: "[8/20/2026] FIS/Genpact's experience across regulated financial services demonstrates that offshoring can be highly effective, including for customer-facing voice operations, when supported by the right governance, talent model, technology, training, and quality framework. The objective is to transition work into a specialized Centre of Excellence (CoE) environment that delivers greater consistency, scalability, resilience, and continuous improvement.\n\nThrough its global delivery network, FIS/Genpact brings together dedicated servicing, collections, complaints, and customer operations teams serving multiple financial services clients. This creates deep domain expertise, standardized operating procedures, robust quality controls, and access to best practices that would be difficult to replicate within smaller standalone teams. As a result, clients benefit from stronger operational performance and faster adoption of process and technology improvements.",
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK Genpact)',
    sharedWithGenpact: 'No',
    points: 'What is the impact on cost if clients select not the full program but only some e.g.,:\na) outsourcing, digitization but no offshoring\nb) outsourcing, digitization but offshoring only back office\nc) outsourcing, digitization but offshoring only front office\nd) outsourcing, offshoring but selected digitization only',
    response: "[9/10/2026] We are seeking overarching approval for the right to offshore all in-scope services rather than offering a component-by-component choice. This is a concentrated investment to improve our servicing and technology capabilities end to end, and the benefits depend on transforming the service as a whole. Splitting it would divide ownership of SLAs and KPIs and limit the improvement we can deliver — we don't want clients to miss out on having their service offering transformed.\n\nWe do not get the full realization of the cost benefit; the impact sits in our internal margin, not with the client; the client is charged a fixed fee no matter what; we are looking for consent to the full program. Prices will not increase if clients choose selected services?",
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x - 9/10',
    commentPwc: 'Confirm with Stephen, we do not increase prices, it will decrease our margin.',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: "Where exactly would our client's work be delivered from, and does any data move with it?",
    response: '[8/20/2026] This will be based on contracts; data will be accessed from delivery locations.\n\nGenpact has multiple delivery locations across 30 countries. The primary delivery locations in Asia are in India and Philippines. For Europe, Genpact has multiple delivery locations with the biggest one being in Romania along with Poland. Genpact also have strong delivery presence in South America and North America.\n\nAll delivery centers are compliant with Infosec, regulatory, and safety specifications that meet TIS standards. Data will not move. Delivery from the following global centers: US-Columbus Georgia, UK-Milton Keynes, Germany-Hamburg, Netherlands-Barneveld, Romania-Bucharest, Poland-Warsaw, Philippines-Manila, India-Pune.\n\nThere is no movement of data. FIS access client data only through citrix wherein the data resides at client location and is accessed remotely.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Outsourcing & Offshoring',
    sharedWithGenpact: 'Yes',
    points: 'In which countries do you deliver voice and back office services for a) US, b) Canada, c) UK, d) Germany, e) Netherlands',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Outsourcing & Offshoring',
    sharedWithGenpact: 'Yes',
    points: 'Provide a list of which languages will be offered at which locations?',
    response: '[8/20/2026] FIS/Genpact supports customer operations across 30+ languages through its global delivery network and multilingual Centres of Excellence. Language coverage includes all major European languages (English, German, Dutch, French, Spanish, Italian, Portuguese and Nordic languages) from its EMEA centres.',
    responseDate: '[8/20/2026]',
    status: 'WIP',
    followUp: 'x 9/10',
    commentPwc: 'Follow up with Genpact, exact location and languages (not generic)',
  },
  {
    category: 'Outsourcing & Offshoring',
    sharedWithGenpact: 'Yes',
    points: "If experienced staff are replaced through offshoring, how do we protect the client's expertise and hold SLAs?",
    response: '[8/20/2026] Our objective is to systematically capture, retain, and institutionalize client knowledge while transitioning activities into a scalable Centre of Excellence model. This ensures critical expertise is preserved and service levels are maintained throughout the transition and beyond.\nWe protect client expertise through structured knowledge capture, SME retention, phased transition governance, and operation of dedicated Financial Services Centres of Excellence. Knowledge is systematically documented, validated, and embedded into training, workflows, controls, and knowledge-management platforms, reducing dependency on individual employees. Transitions are governed through stage-gates, certification, pilot operations, and hypercare to ensure SLA, quality, compliance, and customer outcomes are maintained throughout the migration. The result is a more resilient and scalable operating model that preserves client expertise while delivering cost, capacity, and transformation benefits.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'Will clients be able to audit Genpact?',
    response: '[8/20/2026] Yes. Genpact supports client audits, regulatory reviews, and provision of relevant controls evidence, subject to confidentiality and security protocols.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'How can we address client concerns around the topics of PRA or third-party oversight?',
    response: '[8/20/2026] FIS has extensive experience supporting globally regulated financial institutions and operating within regulatory frameworks that require robust third-party oversight, governance, operational resilience, and auditability. We recognize that compliance with PRA outsourcing expectations is not solely a contractual requirement but an ongoing operating model responsibility.\nTo address these concerns, FIS has a comprehensive governance and risk management framework that provides clients with clear visibility into service performance, operational risks, control effectiveness, and regulatory compliance. This typically includes designated executive governance, periodic risk and compliance reviews, operational reporting, SLA/KPI management, issue escalation procedures, and documented oversight forums.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: "Are there documentation / certifications we can share to prove our compliance and security claims (data residency, regulatory standards, etc.)? What is your key argument for why it's safe, secure and compliant to outsource and offshore?",
    response: "[8/20/2026] Everything we deliver continues to meet the standards in your agreement. Those commitments remain intact, and we're accredited to them today. Upon request clients' can review e.g., applicable certifications, control reports, security documentation, and regulatory compliance evidence.",
    responseDate: '[8/20/2026]',
    status: 'WIP',
    followUp: 'x 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'Does the vendor have a UK-compliant complaints management system?',
    response: '[8/20/2026] Yes. Genpact can operate complaint handling processes aligned to UK regulatory and client requirements including tracking, escalation, QA and regulatory reporting.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Transition',
    sharedWithGenpact: 'Yes',
    points: 'What are the activities and related timelines for ops and technology transition at a per client level?\nWhat does a RACI look like on client transitions between Genpact, FIS and Client?\nCan a detailed timeline be developed, e.g. when do we start to plan implementation? (e.g., just after contract signature or as part of the process already)\nWho manages the transformation on Genpact, FIS, client side a) overall, b) data, c) tech, d) employees/resources, e) how will knowledge be transferred?\nHow many resources (which one) and time is required from client side for implementation?',
    response: '[9/10/2026] See pitch deck for illustrative implementation timeline.',
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x 9/28',
    commentPwc: 'Follow up with Chanda and Moona as contract negotiations continue.',
  },
  {
    category: 'Transition',
    sharedWithGenpact: 'Yes',
    points: 'The proposal references operations from Milton Keynes and Barneveld — will agents TUPE across?',
    response: '[8/20/2026] Milton Keynes is our UK delivery site; UK TUPE regulations do not apply in the Netherlands. For the UK scope, we are planning on the basis that TUPE applies, and the transfer of in-scope colleagues to Genpact will be managed on that footing. The final consultation approach will be confirmed via contracting.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'Will clients have the same access rights to Milton Keynes / Barneveld that they benefit from today, such as open door policy?',
    response: '[8/20/2026] Yes. Genpact is committed to providing clients with the same level of transparency, accessibility, and operational engagement that they benefit from today. Our delivery model is built around an "open-door" philosophy (compliant to standard security measures), where clients have direct access to operations, leadership teams, governance forums, and agreed delivery locations. Equivalent governance, visit access, operational reviews, and open-door collaboration mechanisms can be established and documented contractually.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'What is the (vendor) cost per client?',
    response: '',
    responseDate: '',
    status: 'WIP',
    followUp: 'x - 9/28',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Are costs going up? How is pricing affected? (as part of this program)',
    response: '[9/10/2026] Same fee, more value. Your cost does not change and you actually get more for it. The same fee now brings new technology and AI-powered capabilities. Think of it as a subscription. We fix your annual cost at the service level into a single predictable monthly fee per service. Normal volume swings up to 8% are absorbed at no extra charge, and higher usage runs at a simple transparent rate.',
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x - 9/10',
    commentPwc: 'Confirm with Stephen if this answer works. And also that client prices do not increase.',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'How will change management and change requests work under the new model in terms of pricing?',
    response: "[9/10/2026] Oversight team (Laura's team) will work with the vendor; no different from the current pricing process; whether the vendor does it cheaper, more expensive, or at the same level is TBD; the change management schedule in the contract should cover this; the client reaches out to their FIS rep, who routes the request to the vendor to answer or action; nothing changes for the client; need the vendor rate card for changes.",
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'How much discount can we give? Do discounts need to be approved?',
    response: '[9/10/2026] No discounts; at the moment we are assuming no discounts; the added benefits (e.g. new technology) are the difference: you are getting a lot more for your money than you did before; any discount is approved at executive level only.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'How will overages be priced?',
    response: '[9/10/2026] Bundles are based on 8% of workload per service line; triggered when a client goes over 8% of the monthly forecast.',
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x 9/10',
    commentPwc: "Confirm with Stephen - the pitch deck we say it's 8%, are we good to adjust this to 8% (we wanted to have a buffer vs the contract).",
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Do we charge for implementation cost?',
    response: "[9/10/2026] Not at the client level; this sits in the one-off transformation budget. We will waive clients' implementation fees. This must be positioned as a financial benefit.",
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: 'x 9/10',
    commentPwc: 'Confirm with Stephen if this answer works.',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Can you provide a list of Tech capabilities with\na) description\nb) their impact (e.g. increase of X% in CSAT)\nc) the benefit they create\nd) when they become available (month/year)\ne) if they will be newly launched (when do they become available - timing)\nf) if they already exist - what is your experience in terms of implementation requirements/timeline?',
    response: '[9/10/2026]\n\n1. Intelligent Voice AI Agent\na) Description: A voice assistant that handles routine customer questions end-to-end, with real-time behavioral nudges guiding automated understanding and verification — no transfer or escalation needed.\nb) Impact: ~10–15% fewer process/compliance errors from real-time nudges\nc) Benefit: Customers get answered faster, around the clock, in a way that still feels like a real conversation.\nd) Availability: In Production.\n\n2. Intelligent Chat AI Agent\na) Description: A chat agent that interacts directly with customers, resolving routine questions end-to-end, with in-the-moment nudges for process and compliance guidance.\nb) Impact: ~10–15% fewer process/compliance errors (aggregate figure).\nc) Benefit: Faster customer resolution with stronger compliance, fewer errors, and continuous coaching.\nd) Availability: In Production.\n\n3. AI Coach\na) Description: In-the-moment coaching nudges reinforcing process and compliance adherence for agents/analysts.\nb) Impact: ~10–15% fewer process/compliance errors (aggregate figure).\nc) Benefit: Reinforces a continuous-coaching culture; reduces errors via real-time feedback.\nd) Availability: In Production.\n\n4. Agent Assist\na) Description: Real-time guidance reduces agent cognitive load and stress; speeds up new-agent ramp-up and confidence; improves first-contact resolution and consistency of advice given.\nb) Quantified impact: AHT down 10–15%; new-hire ramp time cut 20–30%; first-contact resolution up 5–10 pts.\nc) Benefit: Reduced agent stress and cognitive load, faster new-agent ramp-up, and more consistent, higher-quality advice to customers.\nd) Availability: In Production.\n\n5. Speech Analytics\na) Description: Surfaces root causes of dissatisfaction and emerging compliance/risk themes; informs proactive process and product improvements; supports vulnerable-customer identification for regulatory purposes.\nb) Quantified impact: Interaction coverage up from ~2–5% (manual sample) to 100%; repeat-contact rate down 10–15%; vulnerable-customer flagging accuracy up 20–30%.\nc) Benefit: Root causes of dissatisfaction and risk get identified and acted on proactively, including regulatory protection for vulnerable customers.\nd) Availability: In Production.\n\n6. Workflow Orchestration\na) Description: Routes work to the right resource at the right time; improves SLA consistency and case traceability; reduces handoff errors between teams.\nb) Quantified impact: ~20–25% fewer handoff errors; SLA consistency up ~10%.\nc) Benefit: More consistent, traceable case handling with fewer errors as work moves between teams.\nd) Availability: In Production.\n\n7. AI Prediction\na) Description: Earlier identification of likely disputes enables proactive customer outreach, improving satisfaction; reduces regulatory/reputational risk from mishandled disputes.\nb) Quantified impact: Disputes flagged ~3–5 days earlier; proactive outreach achieved on ~30–40% of at-risk cases.\nc) Benefit: Improved customer satisfaction through earlier proactive contact, and lower regulatory/reputational exposure.\nd) Availability: In Development.\n\n8. Fraud & Dispute AI Workflow\na) Description/Impact: Faster, more accurate chargeback handling improves merchant and customer experience; strengthens compliance with card-network timelines. More thorough, consistent investigations improve case quality and regulatory defensibility; reduces investigator fatigue from repetitive research tasks.\nb) Quantified impact: ~25–30% faster chargeback cycle time; card-network SLA compliance up ~10%. ~15% more consistent investigation quality; investigator hours/case down ~20%.\nc) Benefit: Better merchant/customer experience and stronger card-network compliance on chargebacks; higher-quality, more defensible investigations with less investigator fatigue on fraud.\nd) Availability: In Development.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Compliance',
    sharedWithGenpact: 'Yes',
    points: 'Is Genpact able to support Canadian collections requirements and regulations, given specificities versus the US? If not able to, would Genpact absorb the existing vendor staff or would that portion be out of scope for the transition?',
    response: '[8/20/2026] This is out of scope.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'In / Out of Scope Services',
    sharedWithGenpact: 'No',
    points: 'Is Fraud Strategy out of scope?',
    response: '[8/20/2026] Yes, Fraud Strategy is out of scope for outsourcing but will still be provided/sold from FIS (but not Genpact).',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'In / Out of Scope Services',
    sharedWithGenpact: 'No',
    points: 'Which services are out of scope?',
    response: '[8/20/2026] Out of scope services are: Travel, Fraud Strategy, Canadian Collections. Mailroom is out of scope, the work that comes out of the mailroom and is put into a queue is in scope.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes - reframed',
    points: '[Who owns, manages and pays for legacy tech?] For each in-scope legacy tool that stays in service after transition, confirm who operates and supports it, who holds the license under the assumption you priced against, and what changes for the client in raising and escalating an issue.',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes - reframed',
    points: '[Timeline that shows commitment of each item being replaced for the portfolio. This also needs to tie out to the client-level timeline expectations we need to share with clients.] Provide a technology replacement roadmap covering every in-scope legacy tool: current tool, replacement, target replacement quarter, and any dependency on client consent or client-side integration. Present at portfolio level and identify where dates differ by migration wave or by region. For each item, state whether the date is contractually committable or indicative.',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Once the vendor gives per client costing post diligence, we need to ask Stephen to layer any additional costs that may be FIS internal that need to be recouped especially during transition. This will help ensure client pricing accounts have the right floor defined. Must also confirm OTE.',
    response: '[9/10/2026] Three parts to the cost: FIS internal IT costs, oversight costs, and vendor costs; together these give the overall client cost, which determines the client-level margin.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes - reframed',
    points: '[What tech change requires consent and what does not? E.g. in some cases they will need integration into client-owned systems (e.g. automations built for Loyalty). We need definitive guidance from client legal on what is permissible vs. what is not. Anything moving to the cloud from on-prem systems needs client consent. e.g. CCaaS on-prem Avaya moving to NICE CCaaS cloud.] For each proposed technology change, provide the change being made (from and to), whether it alters data hosting location or hosting model, whether it requires integration with client-owned systems, and the specific client-side action required to enable it.',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Need to confirm contracting mechanism: "If client only offshores 20%, what is the new 43% cost reduction."',
    response: '[9/10/2026] Work in progress with the vendor; the contracting mechanism is the scenario-based vendor cost model in the workbook, driven by the level of offshoring the client takes; that model determines the cost per client under the consent scenario the client chooses.',
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x - 9/28',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: "Ensure the vendor is not charging for 'change requests' (process change, script change).",
    response: '[9/10/2026] The vendor is acting as TMS, so there will be a charge for changes; a contractual mechanism will define the rates and the change control schedule, i.e. what is chargeable and what is not; approach to be confirmed with Procurement.',
    responseDate: '[9/10/2026]',
    status: 'WIP',
    followUp: 'x - 9/28',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Define rules for margin protection and pricing approvals (Define pricing rules for varying offshore/onshore scenarios (70%, 50%, 0%, etc.))',
    response: '[9/10/2026] Fixed fee pricing has rules in place; any change that contradicts the pricing approach has to be approved at executive level; fixed fee, no deviation.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Determine which pricing and commercial protections must be included in contract exhibits',
    response: '[9/10/2026] The Virgin TCO contract is the template.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'Determine communication approach for pricing dependencies and timing impacts to sales teams/client pitches',
    response: "[9/10/2026] Dependencies are called out during weekly SteerCo's and Project meetings.",
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Security',
    sharedWithGenpact: 'Yes',
    points: 'How will Incident Management procedures and escalations including severity timeframes for client reporting and engagement be managed?',
    response: "[8/20/2026] Genpact will follow FIS's Incident Management processes and severity guidelines and timeframes. Client communications will be managed by FIS.",
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Security',
    sharedWithGenpact: 'Yes',
    points: 'What changes/ differences will there be with Disaster Recovery & Business Continuity?',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Legal',
    sharedWithGenpact: 'Yes',
    points: "Implementation of AI usage will require client approval and where applicable the client is responsible for ensuring their customer privacy notices & T&C's inform of this usage. How would this be managed?",
    response: '[8/20/2026] We recognize that the deployment of AI capabilities in a regulated environment requires appropriate governance, client approval, and compliance with applicable privacy, consumer protection, and regulatory obligations. As such, no AI capability is introduced into production without following an agreed client approval process and governance framework.\nDuring operation, AI capabilities would be governed through agreed controls, including defined use cases, human oversight where appropriate, performance monitoring, auditability, security reviews, change management processes, and periodic governance reviews. Any material changes to AI models, functionality, or data usage would be subject to the agreed change control and approval framework before deployment.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'What languages are currently (or planned for) using AI live translation - voice and chat? How long has the solution been in place? Are there any recording / demos that can be shared',
    response: "[8/20/2026] The primary languages are Dutch, German and French. The solution is Krisp.AI. Genpact has implemented this solution for a few of their clients. Genpact doesn't have demo's which can be made available.",
    responseDate: '[8/20/2026]',
    status: 'WIP',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact on the follow up question "Good, are you using live agents for Spanish? Is it French Canadian?"',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes',
    points: 'Are there any case studies that can be shared - around people, tech, process improvements etc',
    response: "[9/10/2026] Case Study Available in Pitch Deck. Yes — the vendor has shared a detailed case study of a single client relationship, a large UK bank, that provides measurable proof points across the full lifecycle: the initial transition, the breadth of the engagement, and the outcomes delivered.\n\nThe relationship began as a first-time outsourcing decision for the client, driven by cost pressure, fragmented and siloed operations, and underinvestment in digitizing their operations. The transition itself involved moving roughly 1,000 FTEs across 13 lines of business, 250+ processes, and 1,700+ tasks, from incumbent sites in the UK, US, and Poland to delivery centers in India. It was executed in phases — the first tranche of 600 FTEs landed safely within four months — with zero business disruption and a 5/5 client satisfaction score. This was achieved through disciplined execution: small training batches, one supervisor per batch, structured training plans, and weekly knowledge checks and surveys.\n\nOver the following 10+ years, the engagement expanded to cover more than ten operational domains, including retail and business banking, mortgages, corporate and commercial banking, cards, fraud, payments servicing, and AI/ML use-case development, delivered by a team of over 1,000 people. This growth was underpinned by a consistent set of technology levers — intelligent automation (Appian, UiPath), process intelligence (Celonis), generative AI (ChatGPT, Copilot), and risk management tooling (ServiceNow) — which map closely to the modernization story FIS wants to tell its own TMS clients.\n\nThe measurable outcomes compound over that period. In the first three years, the engagement delivered 40% productivity gains, rising to 55% by Year 4. Within the first 18 months alone, it produced 35% faster account closures, a 25% increase in productivity, and a 5% improvement in NPS. Over the full relationship, results include a 42% reduction in time-to-offer with a 41% improvement in automated decisioning, a 70% reduction in lead time alongside a fourfold increase in straight-through processing, a 52% reduction in payment-processing exceptions (representing roughly £1 billion in potential risk reduction), and deposit growth from £800 million to £3 billion — lifting the client's market share from 7% to 30% and making them a top performer across all UK banks. At the relationship level, this translated into a 20% increase in mortgage applications processed, a 10% improvement in cost-to-income ratio, and more than £10 million in post-transformation income uplift.",
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Transition',
    sharedWithGenpact: 'Yes',
    points: 'Will current dedicated team set-ups remain dedicated in the Genpact solution?',
    response: '[8/20/2026] Yes we plan to replicate the same operating model to begin with',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing (DO NOT ASK GENPACT)',
    sharedWithGenpact: 'No',
    points: 'How often will the subscription model be revised (and costs to clients change) to account for growth / reduction in traffic?',
    response: '[9/10/2026] Reviewed monthly as part of the normal forecasting process; the model is only revised where there is sustained growth or reduction over a set number of months.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Transition',
    sharedWithGenpact: 'Yes',
    points: 'What data will Genpact provide to support the monthly forecasting process? (assuming forecast remains with FIS)',
    response: '[8/20/2026] Genpact will provide inputs around volume pattern shifts, forecast variance at an interval, day, weekly and monthly level for FIS to validate and approve.\nWe are partnering to improve the forecast accuracy, provide inputs which will have a potential impact on capacity linked to forecast. I.e change in AHT due to process change or new hires, and establish weekly / monthly governance to review the volume trends against the forecast.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Operations',
    sharedWithGenpact: 'Yes',
    points: 'What support will the vendor provide to respond to RFIs and RFPs and what SLAs can be agreed around timeliness and accuracy of responses?',
    response: '[8/20/2026] Genpact will provide a dedicated RFI/RFP and client due-diligence support capability, leveraging operational, technology, compliance, risk, and security SMEs to help FIS respond to client questionnaires, audits, and information requests. Through defined SLAs, quality reviews, knowledge repositories, and governance controls, Genpact can commit to timely, accurate, and consistent responses while providing full visibility of request status, ownership, and escalations.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Operations',
    sharedWithGenpact: 'Yes',
    points: 'For existing clients in the BAU environment, what does the change control governance process look like? For example, when a client has a policy change related to servicing, they submit a change control ticket that may or may not require a project, and we manage the ticket or project through implementation in production today.',
    response: 'Change Management will be owned and retained by FIS. We will then partner with Genpact.\n\nFeedback from Genpact: [8/20/2026] We will operate a structured change control process designed to ensure client-initiated changes are assessed, approved, implemented, tested, and deployed in a controlled manner while protecting service continuity, regulatory compliance, customer experience, and SLA performance.\nUnder the proposed operating model, clients would continue to submit change requests through an agreed intake process. Requests may range from minor policy or process updates through to complex regulatory, technology, product, or operating model changes. Upon receipt, we would perform an initial triage and impact assessment to determine whether the request can be managed as a standard change within BAU or whether it requires formal project governance.\nFor each change request, we would assess: operational impacts on servicing, collections, complaints, and customer journeys; workforce and training requirements; technology and workflow configuration changes; regulatory, compliance, risk, and control implications; reporting, MI, and audit impacts; and potential impacts to SLAs, customer outcomes, and service volumes.\nFollowing assessment, we would provide the client with a documented impact analysis, execution approach, timeline, resource requirements, dependencies, and associated risks. Changes would then be reviewed through agreed governance forums with appropriate client approval before implementation.',
    responseDate: '[8/20/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Pricing',
    sharedWithGenpact: 'Yes',
    points: 'What happens if a client has -8% volume for more than a month or longer?',
    response: "[9/10/2026] A single month isn't enough to confirm a downward trend, so a one-month dip on its own doesn't trigger any changes. The threshold for reworking the numbers is 3 consecutive months under forecast, with a 20% tolerance. This ensures we're reacting to a genuine trend rather than normal month-to-month fluctuation.",
    responseDate: '[9/10/2026]',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: "Pending Genpact's answers",
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes (New)',
    points: 'We have clients who are expecting a huge shift towards disputes self serve via use the TIS App. Do Genpact have a view, based on other books, of what containment can be achieved through a good app for dispute intake (appreciate this is a TIS app, rather than a Genpact App but any info would be useful).',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes (New)',
    points: 'What containment rate in IVA can be expected for Disputes claim?',
    response: '[9/10/2026] During the meeting Genpact mentioned 27% IVA containment overall.',
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes (New)',
    points: 'On disputes and process automation/ai, Pega and suppliers like Wipro, TCS offer high levels of efficiencies. Can Genpact give a view of what efficiencies % can be achieved through AI on Disputes / Fraud specifically.',
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes (New)',
    points: "Are Genpact familiar with competitors AI solutions such as Wipro's Kognitos tool and TCS's workbench? What would be an equivalent solution at Genpact, how benefits will be delivered and what tools are being considered?",
    response: '',
    responseDate: '',
    status: 'Delayed',
    followUp: 'x - 9/10',
    commentPwc: 'Follow up with Genpact',
  },
  {
    category: 'Technology',
    sharedWithGenpact: 'Yes (New)',
    points: 'Does Genpact offer a chat solution as part of this transformation?',
    response: "[9/10/2026] Genpact confirmed during the demo's they offer a chat solution and it is also part of the pitch deck tech capabilities.",
    responseDate: '[9/10/2026]',
    status: 'Complete',
    followUp: '',
    commentPwc: '',
  },
]

const STATUS_STYLES: Record<FaqNewStatus, { bg: string; color: string; dot: string }> = {
  Complete: { bg: '#e9fbe6', color: '#1d6b12', dot: '#4bcd3e' },
  WIP:      { bg: '#fff4e0', color: '#8a5a00', dot: '#e8a33d' },
  Delayed:  { bg: '#fce8ef', color: '#8a1040', dot: '#B21A53' },
}

function StatusPill({ status }: { status: FaqNewStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 9px', borderRadius: 7,
      background: s.bg, color: s.color,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

type ColKey = keyof FaqNewRow
type Filters = Record<ColKey, string>
const EMPTY_FILTERS: Filters = {
  category: '',
  sharedWithGenpact: '',
  points: '',
  response: '',
  responseDate: '',
  status: '',
  followUp: '',
  commentPwc: '',
}

const COLUMNS: { key: ColKey; label: string; width: string }[] = [
  { key: 'category',          label: 'Category',            width: '10%' },
  { key: 'sharedWithGenpact', label: 'Shared with Genpact',  width: '8%' },
  { key: 'points',            label: 'Points to Address',    width: '19%' },
  { key: 'response',          label: 'Response',             width: '23%' },
  { key: 'responseDate',      label: 'Response Date',        width: '9%' },
  { key: 'status',            label: 'Status',               width: '9%' },
  { key: 'followUp',          label: 'Follow Up',            width: '11%' },
  { key: 'commentPwc',        label: 'Comment PwC',          width: '11%' },
]

function FaqNewTable() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const categories = useMemo(() => Array.from(new Set(FAQ_NEW_DATA.map(r => r.category))).sort(), [])
  const sharedOptions = useMemo(() => Array.from(new Set(FAQ_NEW_DATA.map(r => r.sharedWithGenpact))).sort(), [])
  const statuses: FaqNewStatus[] = ['Complete', 'WIP', 'Delayed']

  const filteredRows = useMemo(() => {
    return FAQ_NEW_DATA.filter(row =>
      COLUMNS.every(({ key }) => {
        const f = filters[key].trim().toLowerCase()
        if (!f) return true
        return String(row[key]).toLowerCase().includes(f)
      })
    )
  }, [filters])

  const activeFilterCount = COLUMNS.filter(({ key }) => filters[key].trim() !== '').length

  function setFilter(key: ColKey, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
  }

  return (
    <div>
      {/* Filter summary bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: INK, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          <Filter size={13} color={INK} strokeWidth={2.4} />
          Filter by column
          {activeFilterCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
              background: '#5b2d6e', color: '#fff', fontSize: 10.5, fontWeight: 800,
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, color: MUTED,
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px',
            }}
          >
            <X size={12} strokeWidth={2.4} />
            Clear filters
          </button>
        )}
      </div>

      <div style={{ background: '#fff', border: BORDER, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1180, borderCollapse: 'collapse', tableLayout: 'fixed' as const }}>
            <colgroup>
              {COLUMNS.map(c => <col key={c.key} style={{ width: c.width }} />)}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map(c => (
                  <th key={c.key} style={{
                    background: INK, color: '#fff', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left',
                    padding: '12px 14px',
                  }}>
                    {c.label}
                  </th>
                ))}
              </tr>
              <tr>
                {COLUMNS.map(c => (
                  <th key={c.key} style={{ padding: '8px 10px', background: '#f7f8fc', borderBottom: '1px solid #e5e7eb' }}>
                    {c.key === 'sharedWithGenpact' ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        {sharedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : c.key === 'status' ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : c.key === 'category' && categories.length > 0 ? (
                      <select
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff', cursor: 'pointer',
                        }}
                      >
                        <option value="">All</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    ) : (
                      <input
                        value={filters[c.key]}
                        onChange={e => setFilter(c.key, e.target.value)}
                        placeholder="Search…"
                        style={{
                          width: '100%', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, color: INK,
                          padding: '6px 8px', borderRadius: 6, border: '1px solid #dfe1ea', background: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ padding: '48px 20px', textAlign: 'center', fontSize: 13, color: MUTED }}>
                    {FAQ_NEW_DATA.length === 0
                      ? 'No entries yet. This table is ready to be populated — submit the CSV to fill it in.'
                      : 'No rows match the current filters. Try clearing a filter above.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? '1px solid #eef0f2' : undefined }}>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#0f1230' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, color: row.sharedWithGenpact.startsWith('Yes') ? '#1d6b12' : MUTED, fontWeight: 700 }}>
                      {row.sharedWithGenpact}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: INK, fontWeight: 600 }}>
                      {row.points}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.response}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                      {row.responseDate}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top' }}>
                      <StatusPill status={row.status} />
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.followUp}
                    </td>
                    <td style={{ padding: '14px 14px', verticalAlign: 'top', fontSize: 12.5, lineHeight: 1.6, color: 'rgba(26,31,78,0.82)' }}>
                      {row.commentPwc}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function SalesFaqNewPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin - Consent Tracker" />
      <div style={{ padding: '0 32px 56px' }}>
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 24 }}>
          The refreshed Sales FAQ table, tracking each client question with whether it&apos;s been shared with Genpact, the point to address, the agreed response, when it was answered, its current status, and any follow-up still needed. Use the filters below to narrow by any column.
        </p>
        <FaqNewTable />
      </div>
    </div>
  )
}
