const XLSX = require('../node_modules/xlsx')
const fs = require('fs')
const path = require('path')

const xlsxPath = process.argv[2] || path.join(
  process.env.USERPROFILE || process.env.HOME,
  'Downloads',
  'LISTADO CRISTIAN.xlsx'
)
const outPath = path.resolve(__dirname, '..', 'data', 'attendees.json')

if (!fs.existsSync(xlsxPath)) {
  console.error('ERROR: File not found:', xlsxPath)
  process.exit(1)
}

const wb = XLSX.readFile(xlsxPath)
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })

// Header is on row index 2: item, Primer Nombre, Segundo Nombre, Primer Apellido, Teléfono Móvil
const data = rows.slice(3)

let imported = 0
let skipped = 0

const attendees = []
const seen = new Set()

for (const row of data) {
  const firstName = String(row[1] || '').trim()
  const middleName = String(row[2] || '').trim()
  const lastName = String(row[3] || '').trim()
  const rawPhone = String(row[4] || '').trim()

  if (!firstName && !lastName) continue  // blank row, don't count

  let phone = rawPhone.replace(/\D/g, '')

  // Strip leading country code if present (57 = Colombia, 56 = Chile, 1 = US)
  if (phone.length === 12 && phone.startsWith('57')) phone = phone.slice(2)
  if (phone.length === 11 && phone.startsWith('56')) phone = phone.slice(2)
  if (phone.length === 11 && phone.startsWith('1'))  phone = phone.slice(1)

  if (!phone) { skipped++; continue }
  if (seen.has(phone)) { skipped++; continue }
  seen.add(phone)

  attendees.push({ phone, firstName, middleName, lastName, isNew: false })
  imported++
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(attendees, null, 2), 'utf-8')

console.log(`Imported : ${imported}`)
console.log(`Skipped  : ${skipped} (no phone or duplicate)`)
console.log(`Written  : ${outPath}`)
