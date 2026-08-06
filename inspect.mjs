import { read, utils } from 'xlsx'
import { readFileSync } from 'fs'

const buf = readFileSync('data/Book3-b91420.xlsx')
const wb = read(buf, { cellDates: true })
const rows = utils.sheet_to_json(wb.Sheets['Sheet1'], { header: 1, defval: null })

// Data starts at row index 5 (after header at 4)
const data = rows.slice(5).filter(r => r[0]).map(r => ({ name: r[0], region: r[2], rev: Number(r[3]) }))

const total = data.reduce((s, d) => s + d.rev, 0)
const umb = data.find(d => d.name === 'UMB')
const alignment = umb.rev
const exploration = total - alignment

console.log('CLIENT COUNT:', data.length)
console.log('GRAND TOTAL:', total, '=> $' + (total/1e6).toFixed(1) + 'M')
console.log('ALIGNMENT (UMB):', alignment, '=> $' + (alignment/1e6).toFixed(1) + 'M')
console.log('EXPLORATION (rest):', exploration, '=> $' + (exploration/1e6).toFixed(1) + 'M')
console.log('')
console.log('--- Per-client rounded to rev integer for lib/data / CM_DATA ---')
data.forEach(d => console.log(`${d.name} => ${Math.round(d.rev)}  ($${(d.rev/1e6).toFixed(d.rev>=1e6?1:d.rev>=1e5?1:d.rev>=1e4?2:3)}M)`))
