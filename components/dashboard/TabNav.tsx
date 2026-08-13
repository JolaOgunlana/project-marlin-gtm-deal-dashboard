'use client'

import React from 'react'

export type TabId = 'cover' | 'faq' | 'dashboard' | 'consent' | 'tracker'

const TABS: { id: TabId; label: string }[] = [
  { id: 'tracker', label: 'GTM Status' },
  { id: 'consent', label: 'Consent Matrix' },
  { id: 'dashboard', label: 'Deal Dashboard' },
  { id: 'faq', label: 'Sales FAQ' },
  { id: 'cover', label: 'How to Use' },
]

export function TabNav({ page, onNavigate }: { page: TabId; onNavigate: (p: TabId) => void }) {
  return (
    <>
      <nav role="tablist" aria-label="Dashboard sections" className="tab-nav-row">
        {TABS.map((tab) => {
          const selected = page === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              onClick={() => onNavigate(tab.id)}
              className={`tab-nav-btn${selected ? ' is-active' : ''}`}
            >
              {tab.label}
              <span className="tab-nav-underline" aria-hidden="true" />
            </button>
          )
        })}
      </nav>
      <style>{`
        .tab-nav-row {
          display: flex;
          align-items: center;
          gap: 34px;
          background: #0A0B22;
          border-top: 1px solid rgba(255,255,255,0.09);
          padding: 0 34px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tab-nav-row::-webkit-scrollbar {
          display: none;
        }
        .tab-nav-btn {
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          white-space: nowrap;
          padding: 17px 2px;
          border: none;
          background: none;
          cursor: pointer;
          color: #B7B2CE;
          position: relative;
          transition: color 0.18s ease;
        }
        .tab-nav-btn:hover {
          color: #F4F2FA;
        }
        .tab-nav-btn:hover .tab-nav-underline {
          transform: scaleX(0.5);
          background: rgba(255,255,255,0.3);
        }
        .tab-nav-btn.is-active {
          color: #F4F2FA;
          font-weight: 600;
        }
        .tab-nav-btn.is-active .tab-nav-underline {
          transform: scaleX(1);
          background: #4BCD3E;
        }
        .tab-nav-btn.is-active:hover .tab-nav-underline {
          transform: scaleX(1);
          background: #4BCD3E;
        }
        .tab-nav-underline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #4BCD3E;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.22s ease;
        }
        .tab-nav-btn:focus-visible {
          outline: 2px solid #4BCD3E;
          outline-offset: -4px;
          border-radius: 5px;
        }
      `}</style>
    </>
  )
}
