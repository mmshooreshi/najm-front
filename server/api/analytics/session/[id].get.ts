// server/api/analytics/session/[id].get.ts
import { defineEventHandler, getCookie, getHeader, getRouterParam, createError } from 'h3'
import type { SessionDetail } from '../../../../types/telemetry.ts'
import { flushBuffer } from '../../../utils/telemetryBuffer.ts'
import { getSessionList, getSessionEvents } from '../../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<SessionDetail> => {
  const token =
    getCookie(event, 'pb_admin') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Admin authentication required'
    })
  }

  try {
    await flushBuffer()
  } catch {}

  const sessionId = getRouterParam(event, 'id')
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  const events = getSessionEvents(sessionId)
  const summaries = getSessionList(200)
  const summary = summaries.find(s => s.session_id === sessionId) || {
    session_id: sessionId,
    first_seen: events[0]?.timestamp || new Date().toISOString(),
    last_seen: events[events.length - 1]?.timestamp || new Date().toISOString(),
    duration_sec: 0,
    page_count: new Set(events.map(e => e.url)).size,
    event_count: events.length,
    tap_count: events.filter(e => e.event_name === 'tap_heat').length,
    referrer: events[0]?.referrer || null,
    device_type: 'unknown',
    user_agent: events[0]?.user_agent || null,
    pages: Array.from(new Set(events.map(e => e.url)))
  }

  return {
    session_id: sessionId,
    summary,
    events
  }
})
