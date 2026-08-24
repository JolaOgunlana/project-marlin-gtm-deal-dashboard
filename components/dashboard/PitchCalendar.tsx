'use client'

import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { NavBanner } from './CoverPage'

type Page = 'cover' | 'faq' | 'dashboard' | 'consent' | 'tracker' | 'calendar'

// ── Design tokens (matched to the rest of the dashboard) ──────────────────────
const INK        = '#1a1f4e'
const INK_2      = '#252a5c'
const EGGPLANT   = '#431C5B'
const GREEN      = '#4bcd3e'
const GREEN_DIM  = '#3aa830'
const MUTED      = 'rgba(26,31,78,0.50)'
const MUTED_2    = 'rgba(26,31,78,0.35)'
const LINE       = '#e5e8ed'
const LINE_STRONG= '#d7dae8'

const WAVE1 = '#3ec24a'
const WAVE2 = '#3E8BCD'
const WAVE3 = '#9B6BD8'
const WAVE_COLORS: Record<string, { dot: string; halo: string }> = {
  w1: { dot: WAVE1, halo: 'rgba(62,194,74,.14)' },
  w2: { dot: WAVE2, halo: 'rgba(62,139,205,.14)' },
  w3: { dot: WAVE3, halo: 'rgba(155,107,216,.16)' },
}

// ============================================================
// Client ACV reference ($M), from the TMS client revenue
// distribution chart in the GTM proposal. Approximate figures
// for the top-10 portfolio; extend as more clients are added.
// ============================================================
const CLIENT_ACV: Record<string, number> = {
  'Virgin Money': 27.0,
  'Deutsche Bank': 17.2,
  'Mercury Financial': 17.0, // projected churn — excluded from target math
  'Fifth Third': 13.9,
  'Metro Bank': 12.4,
  'UMB': 9.0,
  'Lloyds': 9.4,
  'UBS': 8.4,
  'PNC': 5.5,
  'ING': 4.6,
}
const TARGET_ACV = 60 // $M consent target

type PitchType = 'w1' | 'w2' | 'w3'
type Pitch = { client: string; service: string; type: PitchType }

// ============================================================
// EDIT HERE: pitch dates per client.
// Key = 'YYYY-MM-DD' (must be a weekday Mon–Fri).
// type: 'w1' (Wave 1 anchor) | 'w2' (Wave 2) | 'w3' (Wave 3)
// ============================================================
const PITCHES: Record<string, Pitch[]> = {
  '2026-08-31': [{ client: 'UMB', service: 'Pitch Meeting', type: 'w1' }],
  '2026-09-10': [{ client: 'Metro Bank', service: 'Pitch Meeting', type: 'w1' }],
  '2026-09-15': [{ client: 'Lloyds', service: 'Pitch Meeting', type: 'w1' }],
}

const TODAY: string | null = null
const START = new Date(2026, 7, 24) // Aug 24 2026 (Mon)
const END   = new Date(2026, 8, 30) // Sep 30 2026 (Wed)

const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function iso(d: Date) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}
function parseKey(key: string) {
  const [y, m, dd] = key.split('-').map(Number)
  return new Date(y, m - 1, dd)
}
function fmtShortDate(d: Date) {
  return `${DOW_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`
}
function weekdayPos(d: Date) {
  return d.getDay() - 1 // Mon=0 ... Fri=4
}
function inRange(d: Date) {
  return d >= START && d <= END
}
function fmtM(n: number) {
  return (Math.round(n * 10) / 10).toString()
}

type MonthGroup = { y: number; m: number; cells: Date[] }

// Build list of weekday cells grouped by calendar month, aligned Mon-Fri.
function buildMonths(): MonthGroup[] {
  const months: MonthGroup[] = []
  let cur = new Date(START.getFullYear(), START.getMonth(), 1)
  const last = new Date(END.getFullYear(), END.getMonth(), 1)

  while (cur <= last) {
    const y = cur.getFullYear(), m = cur.getMonth()
    const cells: Date[] = []
    const daysInMonth = new Date(y, m + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day)
      const wd = d.getDay() // 0 Sun ... 6 Sat
      if (wd === 0 || wd === 6) continue // weekdays only
      cells.push(d)
    }
    if (cells.length) months.push({ y, m, cells })
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }
  return months
}

const MONTHLIST = buildMonths()

export function PitchCalendarPage({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const [viewIndex, setViewIndex] = useState(0)
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const mo = MONTHLIST[viewIndex]

  const entries = useMemo(() => {
    const list: (Pitch & { date: string })[] = []
    Object.keys(PITCHES).forEach(key => PITCHES[key].forEach(p => list.push({ ...p, date: key })))
    return list
  }, [])

  const pitchCount = entries.length
  const totalACV = entries.reduce((sum, e) => sum + (CLIENT_ACV[e.client] || 0), 0)
  const next = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date))[0], [entries])

  const lead = weekdayPos(mo.cells[0])
  const trailCount = 4 - weekdayPos(mo.cells[mo.cells.length - 1])

  return (
    <div style={{ fontFamily: "var(--font-inter), 'Source Sans 3', system-ui, sans-serif" }}>
      <NavBanner page={page} onNavigate={onNavigate} title="Project Marlin - Pitch Calendar" />

  <style>{`
  @keyframes cm-ripple-ring {
    0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
    100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cm-ripple-ring { animation: none !important; }
  }
  @media (max-width: 820px) {
          .pcal-stat-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ padding: '0 32px 56px' }}>
        {/* Board */}
        <div style={{
          background: 'white',
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          padding: '24px 26px 30px',
        }}>

          {/* Nav row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '2px 0 18px', marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED, maxWidth: 720 }}>
              Your upcoming client pitch meetings, Monday to Friday. Each card shows the client and the scheduled date; the summary above tracks how many pitches are booked and the ACV they represent.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 0, flex: 'none' }}>
              <button
                aria-label="Previous month"
                disabled={viewIndex === 0}
                onClick={() => viewIndex > 0 && setViewIndex(viewIndex - 1)}
                style={{
                  width: 46, height: 46, flex: 'none', cursor: viewIndex === 0 ? 'default' : 'pointer',
                  background: viewIndex === 0 ? '#d5d7e3' : INK, color: '#fff', border: 'none', borderRadius: 4,
                  fontSize: 20, fontWeight: 700, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                &#8592;
              </button>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 19, fontWeight: 800, letterSpacing: 2, color: INK, textTransform: 'uppercase', lineHeight: 1 }}>
                {MONTHS[mo.m]}<span style={{ color: MUTED_2, fontWeight: 700, marginLeft: 8 }}>{mo.y}</span>
              </div>
              <div style={{ position: 'relative', flex: 'none', paddingTop: 28 }}>
                <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: 5, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: EGGPLANT, letterSpacing: '0.01em' }}>Click to switch view</span>
                  <div style={{ position: 'relative', width: 18, height: 18, flexShrink: 0 }}>
                    {[0, 1.1].map((delay, i) => (
                      <div key={i} className="cm-ripple-ring" style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 10, borderRadius: '50%', border: `2px solid ${EGGPLANT}`, animation: `cm-ripple-ring 2.2s ease-out ${delay}s infinite`, pointerEvents: 'none' }} />
                    ))}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                      <path d="M5 3L19 12L12 13.5L9 21L5 3Z" stroke={EGGPLANT} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                </div>
                <button
                aria-label="Next month"
                disabled={viewIndex === MONTHLIST.length - 1}
                onClick={() => viewIndex < MONTHLIST.length - 1 && setViewIndex(viewIndex + 1)}
                style={{
                  width: 38, height: 38, flex: 'none', cursor: viewIndex === MONTHLIST.length - 1 ? 'default' : 'pointer',
                  background: viewIndex === MONTHLIST.length - 1 ? '#d5d7e3' : INK, color: '#fff', border: 'none', borderRadius: 4,
                  fontSize: 20, fontWeight: 700, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                >
                  &#8594;
                </button>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="pcal-stat-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {next && (
              <div style={{
                background: `radial-gradient(400px 200px at 100% 0%, rgba(75,205,62,.18), transparent 65%), ${INK}`,
                border: `1px solid ${INK}`, borderRadius: 14, padding: '14px 16px', position: 'relative',
              }}>
                <div style={{ fontSize: 13, letterSpacing: '0.08em', fontWeight: 800, color: GREEN, textTransform: 'uppercase' }}>Upcoming Pitch</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 6, lineHeight: 1 }}>{next.client}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, fontWeight: 700, color: '#c7cae0', letterSpacing: 0.2 }}>
                  <CalendarIcon size={11} color={GREEN} strokeWidth={2.4} />
                  {fmtShortDate(parseKey(next.date))}
                </div>
              </div>
            )}
            <div style={{ background: 'linear-gradient(180deg,#ffffff,#fbfdff)', border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, letterSpacing: '0.08em', fontWeight: 800, color: MUTED, textTransform: 'uppercase' }}>Pitches Scheduled</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: INK, marginTop: 6, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                {pitchCount}<span style={{ fontSize: 15, fontWeight: 700, color: MUTED_2 }}>meeting{pitchCount === 1 ? '' : 's'}</span>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(180deg,#ffffff,#fbfdff)', border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, letterSpacing: '0.08em', fontWeight: 800, color: MUTED, textTransform: 'uppercase' }}>Pitch Scheduled ACV</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: INK, marginTop: 6, lineHeight: 1 }}>
                ${fmtM(totalACV)}M
              </div>
            </div>
          </div>

          {/* Calendar grid panel */}
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 20, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {DOW.map(d => (
                <div key={d} style={{ color: MUTED, fontSize: 10, letterSpacing: 2.5, fontWeight: 800, textTransform: 'uppercase', padding: '2px 4px 8px', textAlign: 'left' }}>
                  {d}
                </div>
              ))}

              {Array.from({ length: lead }).map((_, i) => (
                <div key={`lead-${i}`} style={{ minHeight: 132, background: 'transparent', border: '1px dashed #e7e9f2', borderRadius: 14 }} />
              ))}

              {mo.cells.map((d) => {
                const key = iso(d)
                const outside = !inRange(d)
                const isToday = key === TODAY
                const dayPitches = !outside ? PITCHES[key] : undefined
                const hasPitch = !!dayPitches
                const isHovered = hoveredCell === key

                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      minHeight: 132,
                      background: outside
                        ? 'repeating-linear-gradient(135deg,#f7f8fc,#f7f8fc 8px,#f4f5fa 8px,#f4f5fa 16px)'
                        : hasPitch ? 'linear-gradient(180deg,#ffffff, #fbfdff)' : '#fdfdff',
                      border: `1px solid ${hasPitch ? '#d5e7f7' : LINE}`,
                      borderRadius: 14,
                      padding: '12px 12px 12px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: outside ? 'none' : hasPitch
                        ? '0 2px 6px rgba(29,31,72,.06), 0 0 0 1px rgba(62,139,205,.08) inset'
                        : '0 1px 3px rgba(29,31,72,.05)',
                      transform: isHovered && !outside ? 'translateY(-2px)' : 'none',
                      borderColor: isHovered && !outside ? LINE_STRONG : (hasPitch ? '#d5e7f7' : LINE),
                      transition: 'transform .16s ease, box-shadow .16s ease, border-color .16s ease',
                    }}
                  >
                    <span style={{
                      fontSize: hasPitch ? 12.5 : 15,
                      fontWeight: 800,
                      color: outside ? MUTED_2 : hasPitch ? '#fff' : INK,
                      lineHeight: 1,
                      letterSpacing: 0.3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(hasPitch ? { background: INK, minWidth: 24, height: 24, borderRadius: 8 } : {}),
                    }}>
                      {d.getDate()}
                    </span>

                    {isToday && (
                      <span style={{ position: 'absolute', top: 11, right: 12, fontSize: 8, letterSpacing: 1.5, fontWeight: 800, color: GREEN_DIM, textTransform: 'uppercase' }}>
                        Today
                      </span>
                    )}

                    {dayPitches?.map((p, pi) => {
                      const wc = WAVE_COLORS[p.type]
                      return (
                        <div key={pi} style={{
                          display: 'block', marginTop: 9, padding: '7px 10px 7px 22px', borderRadius: 10,
                          fontSize: 11.5, fontWeight: 800, lineHeight: 1.2, color: INK,
                          background: '#f4f6fb', border: '1px solid #eceff7', position: 'relative',
                        }}>
                          <span style={{
                            position: 'absolute', left: 9, top: 11, width: 7, height: 7, borderRadius: '50%',
                            background: wc.dot, boxShadow: `0 0 0 3px ${wc.halo}`,
                          }} />
                          {p.client}
                          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: 0.4, color: MUTED, marginTop: 3, textTransform: 'uppercase' }}>
                            {p.service}
                          </span>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingTop: 6,
                            borderTop: '1px solid #e6e9f2', fontSize: 10, fontWeight: 700, color: INK, letterSpacing: 0.2,
                          }}>
                            <CalendarIcon size={9} color={MUTED} strokeWidth={2.4} />
                            {fmtShortDate(d)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {Array.from({ length: trailCount }).map((_, i) => (
                <div key={`trail-${i}`} style={{ minHeight: 132, background: 'transparent', border: '1px dashed #e7e9f2', borderRadius: 14 }} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
