import { recordCheckIn } from '~/server/utils/checkins'
import { normalizePhone } from '~/server/utils/attendees'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone, firstName, middleName = '', lastName } = body

  if (!phone || !firstName || !lastName) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const record = await recordCheckIn({
    phone: normalizePhone(phone),
    firstName,
    middleName,
    lastName,
  })

  return record
})
