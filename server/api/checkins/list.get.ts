import { loadCheckIns } from '~/server/utils/checkins'

export default defineEventHandler(async () => {
  const checkins = await loadCheckIns()
  return checkins.sort((a, b) => b.checkedInAt.localeCompare(a.checkedInAt))
})
