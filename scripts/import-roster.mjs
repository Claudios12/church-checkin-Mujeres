import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const xlsxPath = process.argv[2]
  || resolve(process.env.USERPROFILE || process.env.HOME || '.', 'Downloads', 'Inscripciones mujeres.xlsx')

console.log('Reading:', xlsxPath)

const workbook = XLSX.readFile(xlsxPath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

// Data starts at row index 4 (xlsx row 5)
const dataRows = rows.slice(4)

let imported = 0
let skipped = 0
const attendees = []

for (const row of dataRows) {
  const firstName = row[1]?.toString().trim()
  const middleName = row[2]?.toString().trim() || ''
  const lastName = row[3]?.toString().trim()
  const phoneRaw = row[4]

  if (!phoneRaw || !firstName || !lastName) {
    skipped++
    continue
  }

  const phone = String(phoneRaw).replace(/\D/g, '')

  attendees.push({ phone, firstName, middleName, lastName, isNew: false })
  imported++
}

const dataDir = join(ROOT, 'data')
if (!existsSync(dataDir)) mkdirSync(dataDir)

const outputPath = join(dataDir, 'attendees.json')
writeFileSync(outputPath, JSON.stringify(attendees, null, 2), 'utf-8')

console.log(`✓ Imported ${imported} attendees`)
console.log(`  Skipped  ${skipped} rows (missing phone/name)`)
console.log(`  Written to: ${outputPath}`)
