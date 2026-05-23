import { loadCheckIns, saveCheckIns, type CheckIn } from '~/server/utils/checkins'
import { loadRoster, saveRoster, type Attendee } from '~/server/utils/attendees'

export default defineEventHandler(async () => {
  // Deduplicate checkins: per phone keep the paid entry (most recent paid),
  // or the most recent if none paid.
  const checkins = await loadCheckIns()
  const checkinMap = new Map<string, CheckIn>()
  for (const c of checkins) {
    const existing = checkinMap.get(c.phone)
    if (!existing) {
      checkinMap.set(c.phone, c)
    } else {
      const existingPaid = existing.hasPaid
      const incomingPaid = c.hasPaid
      const incomingNewer = new Date(c.checkedInAt) > new Date(existing.checkedInAt)
      if (!existingPaid && incomingPaid) {
        checkinMap.set(c.phone, c)
      } else if (existingPaid === incomingPaid && incomingNewer) {
        checkinMap.set(c.phone, c)
      }
    }
  }
  const mergedCheckins = Array.from(checkinMap.values())
    .sort((a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime())
  await saveCheckIns(mergedCheckins)

  // Deduplicate roster: per phone keep one entry, hasPaid=true if any had paid.
  const roster = await loadRoster()
  const rosterMap = new Map<string, Attendee>()
  for (const a of roster) {
    const existing = rosterMap.get(a.phone)
    if (!existing) {
      rosterMap.set(a.phone, { ...a })
    } else {
      if (a.hasPaid) existing.hasPaid = true
    }
  }
  await saveRoster(Array.from(rosterMap.values()))

  const removedCheckins = checkins.length - mergedCheckins.length
  const removedRoster = roster.length - rosterMap.size
  return { removedCheckins, removedRoster }
})
