export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone, firstName, lastName } = body ?? {}

  if (!phone || !firstName || !lastName) {
    throw createError({ statusCode: 400, message: 'phone, firstName, lastName required' })
  }

  const normalized = normalizePhone(String(phone))
  const existing = await findByPhone(normalized)
  if (existing) return existing

  const newAttendee: Attendee = {
    phone: normalized,
    firstName: String(firstName).trim(),
    middleName: '',
    lastName: String(lastName).trim(),
    isNew: true,
    hasPaid: false,
  }

  const roster = await loadRoster()
  roster.push(newAttendee)
  await saveRoster(roster)

  return newAttendee
})
