// server/api/analytics/sessions.get.ts
import { defineEventHandler, getCookie, getHeader, getQuery, createError } from 'h3'
import type { SessionSummary } from '../../../types/telemetry.ts'
import { flushBuffer } from '../../utils/telemetryBuffer.ts'
import { getSessionList } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<{ sessions: SessionSummary[] }> => {
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

  const query = getQuery(event)
  const limit = query.limit ? Math.min(100, Math.max(1, Number(query.limit))) : 50
  const includeExcluded = query.include_excluded === 'true' || query.include_excluded === '1'

  const sessions = getSessionList(limit, includeExcluded)

  return { sessions }
})
