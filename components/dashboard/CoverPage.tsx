'use client'

import React from 'react'

type Page = 'cover' | 'faqNew' | 'dashboard' | 'consent' | 'tracker' | 'calendar' | 'actionTracker'

// ── Shared nav banner ─────────────────────────────────────────────────────────
export function NavBanner({ page, onNavigate, title }: {
  page: Page
  onNavigate: (p: Page) => void
  title: string
}) {
  const tabs: { id: Page; label: string }[] = [
    { id: 'tracker',   label: 'GTM Status' },
    { id: 'calendar',  label: 'Pitch Calendar' },
    { id: 'consent',   label: 'Consent Matrix' },
    { id: 'dashboard', label: 'Deal Dashboard' },
    { id: 'faqNew',    label: 'Sales FAQ' },
    { id: 'actionTracker', label: 'Action Tracker' },
    { id: 'cover',     label: 'How to Use' },
  ]

  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(22,24,56,0.87) 0%, rgba(22,24,56,0.87) 100%), url('/images/marlin-banner-bridge.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center 34%',
      marginBottom: 18,
      padding: '18px 32px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingBottom: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 58, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05, fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
            Project Marlin
          </div>
          <div style={{ fontSize: 28, fontWeight: 400, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05, fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
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
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>September 15th 2026 · 18:00 EST</div>
<div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4, marginBottom: 1 }}>Next Update</div>
  <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>September 22nd 2026 · 18:00 EST</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {tabs.map(tab => (
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
  )
}

// ── Cover Page ────────────────────────────────────────────────────────────────
export function CoverPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const s = {
    border: '1px solid #e5e7eb',
    white: '#ffffff',
    ink: '#1a1f4e',
    accent: '#5b2d6e',
    muted: 'rgba(26,31,78,0.55)',
  }

  const overviewRows = [
    {
      key: 'What This Is',
      val: 'The single source of truth for the TMS go-to-market campaign — the sales narrative, client segmentation, pricing rules, objection handling, and a live record of client questions and agreed answers, all in one navigable place. This playbook is a living document, updated weekly on whisper progress. Questions and answers grow as client negotiations advance.',
    },
    {
      key: 'Purpose',
      val: <>Secure client consent across the TMS portfolio so FIS can transition contact center operations to its BPO partner — reaching the program&apos;s <strong>$60M ACV</strong> consent target (of which <strong>$25M ACV</strong> by end of 2026).</>,
    },
    {
      key: "Who It's For",
      val: 'Client Success Managers running client conversations, and the leadership team tracking progress toward consent.',
    },
    {
      key: 'Why It Exists',
      val: 'To help us make progress together. We capture every client question and the agreed answer here, so the whole team learns from each other and walks into every meeting prepared.',
    },
    {
      key: 'How To Use It',
      val: <><strong>Fully clickable</strong> — use the three steps below to jump to any section. <strong>Learn</strong> the program → <strong>Use</strong> the assets in meetings → <strong>Track</strong> every client.</>,
    },
    {
      key: 'Kept Current',
      val: 'Updated weekly with the latest whisper-conversation progress — new questions and answers are added as negotiations move forward.',
    },
  ]

  const steps: {
    num: number
    title: string
    desc: string
    color: string
    links: { label: string; page: Page }[]
  }[] = [
    {
      num: 1,
      title: 'Learn',
      desc: 'Start here. Understand the program, the consent goal, and how to use this playbook before you engage clients.',
      color: '#1a1f4e',
      links: [],
    },
    {
      num: 2,
      title: 'Use',
      desc: 'See what we learned and what still needs addressing per client, across the four levers. Each point links to a ready FAQ response for your next conversation.',
      color: '#B21A53',
      links: [
        { label: 'GTM Status', page: 'tracker' },
        { label: 'Sales FAQ', page: 'faqNew' },
        { label: 'Action Tracker', page: 'actionTracker' },
      ],
    },
    {
      num: 3,
      title: 'Track',
      desc: 'Compare client consent at a glance across the four levers, with a blended score and colour-coded risk bands to guide prioritization and account strategy.',
      color: '#4bcd3e',
      links: [
        { label: 'Consent Matrix', page: 'consent' },
        { label: 'Deal Dashboard', page: 'dashboard' },
      ],
    },
  ]

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin Sales Playbook" />

      <div style={{ padding: '0 32px 56px' }}>

        {/* Overview card */}
        <div style={{ background: s.white, border: s.border, borderRadius: 12, padding: '28px 32px', marginBottom: 24 }}>
          <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: s.border }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.ink, letterSpacing: '-0.01em' }}>Overview</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {overviewRows.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: s.accent, minWidth: 132, paddingTop: 3 }}>{row.key}</div>
                <div style={{ fontSize: 14, color: s.ink, lineHeight: 1.55, flex: 1 }}>{row.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr 28px 1fr', alignItems: 'stretch', marginBottom: 24 }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div style={{
                background: s.white,
                border: s.border,
                borderRadius: 14,
                padding: '30px 28px 28px',
                borderTop: `4px solid ${step.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: step.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0 }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.ink, lineHeight: 1, letterSpacing: '-0.01em' }}>{step.title}</div>
                </div>
                <div style={{ fontSize: 14, color: s.ink, lineHeight: 1.55, marginBottom: 20, minHeight: 72 }}>{step.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {step.links.map(link => (
                    <button
                      key={link.page}
                      onClick={() => onNavigate(link.page)}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: s.ink,
                        padding: '14px 16px',
                        background: step.color === '#B21A53' ? 'rgba(178,26,83,0.12)' : step.color === '#4bcd3e' ? 'rgba(75,205,62,0.12)' : 'rgba(91,45,110,0.12)',
                        border: step.color === '#B21A53' ? '1px solid rgba(178,26,83,0.18)' : step.color === '#4bcd3e' ? '1px solid rgba(75,205,62,0.18)' : '1px solid rgba(91,45,110,0.18)',
                        borderRadius: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { 
                        (e.currentTarget as HTMLButtonElement).style.background = step.color === '#B21A53' ? 'rgba(178,26,83,0.20)' : step.color === '#4bcd3e' ? 'rgba(75,205,62,0.20)' : 'rgba(91,45,110,0.20)'
                      }}
                      onMouseLeave={e => { 
                        (e.currentTarget as HTMLButtonElement).style.background = step.color === '#B21A53' ? 'rgba(178,26,83,0.12)' : step.color === '#4bcd3e' ? 'rgba(75,205,62,0.12)' : 'rgba(91,45,110,0.12)'
                      }}
                    >
                      <span>{link.label}</span>
                      <span style={{ color: s.accent, fontWeight: 700, fontSize: 15 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent, fontSize: 24, fontWeight: 300 }}>›</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footnote */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: s.muted, padding: '14px 18px', background: s.white, border: s.border, borderRadius: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4bcd3e', flexShrink: 0 }} />
          <span>This document is strictly confidential and for internal use only. Do not distribute outside of the named stakeholder group.</span>
        </div>

      </div>
    </div>
  )
}
