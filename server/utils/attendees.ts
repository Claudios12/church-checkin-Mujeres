import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

export interface Attendee {
  phone: string
  firstName: string
  middleName: string
  lastName: string
  isNew: boolean
  hasPaid: boolean
}

function getRosterPath(): string {
  return process.env.ROSTER_PATH || resolve(process.cwd(), 'data', 'attendees.json')
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

export async function loadRoster(): Promise<Attendee[]> {
  try {
    const data = await readFile(getRosterPath(), 'utf-8')
    return JSON.parse(data) as Attendee[]
  } catch {
    return []
  }
}

export async function saveRoster(attendees: Attendee[]): Promise<void> {
  const path = getRosterPath()
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(attendees, null, 2), 'utf-8')
}

export async function findByPhone(phone: string): Promise<Attendee | null> {
  const normalized = normalizePhone(phone)
  const roster = await loadRoster()
  return roster.find(a => a.phone === normalized) ?? null
}
