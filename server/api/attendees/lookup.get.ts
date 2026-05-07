export default defineEventHandler(async (event) => {
  const { phone } = getQuery(event)
  if (!phone || typeof phone !== 'string') {
    throw createError({ statusCode: 400, message: 'phone required' })
  }
  return findByPhone(phone)
})
