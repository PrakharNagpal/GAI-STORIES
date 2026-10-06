const ALLOWED_EVENTS = new Set(['page_view', 'scroll_depth', 'time_on_page'])
const MAX_BODY_BYTES = 2048

export default defineEventHandler(async (event) => {
  // Only accept events from our own pages.
  const origin = getHeader(event, 'origin')
  if (origin && new URL(origin).host !== getRequestHost(event, {xForwardedHost: true})) {
    throw createError({statusCode: 403, statusMessage: 'Forbidden origin'})
  }

  if (Number(getHeader(event, 'content-length') ?? 0) > MAX_BODY_BYTES) {
    throw createError({statusCode: 413, statusMessage: 'Payload too large'})
  }

  const body = await readBody<Record<string, unknown> | null>(event).catch(() => null)
  const name = typeof body?.name === 'string' ? body.name : ''
  if (!ALLOWED_EVENTS.has(name)) {
    throw createError({statusCode: 400, statusMessage: 'Unknown event'})
  }

  const record = {
    name,
    path: String(body?.path ?? '').slice(0, 200),
    sessionId: String(body?.sessionId ?? '').slice(0, 64),
    props: cleanProps(body?.props),
    clientTs: String(body?.ts ?? '').slice(0, 40),
    receivedAt: new Date().toISOString(),
  }

  // Demo sink: one structured JSON log line per event (visible in Vercel > Logs).
  // Production: write to a database in a Singapore region with a retention policy.
  console.log('[analytics:event]', JSON.stringify(record))

  setResponseStatus(event, 204)
  return null
})
