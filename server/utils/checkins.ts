import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

export interface CheckIn {
  phone: string
  firstName: string
  middleName: string
  lastName: string
  checkedInAt: string
}

function getCheckInsPath(): string {
  const base = process.env.ROSTER_PATH
    ? dirname(process.env.ROSTER_PATH)
    : resolve(process.cwd(), 'data')
  return resolve(base, 'checkins.json')
}

export async function loadCheckIns(): Promise<CheckIn[]> {
  try {
    const data = await readFile(getCheckInsPath(), 'utf-8')
    return JSON.parse(data) as CheckIn[]
  } catch {
    return []
  }
}

export async function saveCheckIns(checkins: CheckIn[]): Promise<void> {
  const path = getCheckInsPath()
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(checkins, null, 2), 'utf-8')
}

export async function recordCheckIn(entry: Omit<CheckIn, 'checkedInAt'>): Promise<CheckIn> {
  const checkins = await loadCheckIns()
  const record: CheckIn = { ...entry, checkedInAt: new Date().toISOString() }
  checkins.push(record)
  await saveCheckIns(checkins)
  return record
}
