// server/api/analytics/sessions.get.ts
import { defineEventHandler, getCookie, getHeader, getQuery, createError } from 'h3'
import type { SessionSummary } from '../../../types/telemetry.ts'
import { flushBuffer } from '../../utils/telemetryBuffer.ts'
import { getSessionList } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<{ sessions: SessionSummary[] }> => {
  const isDev = process.env.NODE_ENV !== 'production' || Boolean((process as any).dev)
  const token =
    getCookie(event, 'pb_admin') ||
    getCookie(event, 'pb_auth') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

  if (!token && !isDev) {
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
  const excludeAdmin = query.exclude_admin !== 'false' && query.exclude_admin !== '0'
  const excludeFps = query.exclude_fps ? String(query.exclude_fps).split(',').map(s => s.trim()).filter(Boolean) : []
  const excludePages = query.exclude_pages ? String(query.exclude_pages).split(',').map(s => s.trim()).filter(Boolean) : []
  const filterUtm = query.filter_utm ? String(query.filter_utm).trim() : undefined
  const timeRange = (query.time_range as any) || undefined
  const since = query.since ? String(query.since) : undefined
  const until = query.until ? String(query.until) : undefined

  const sessions = getSessionList({
    limit,
    includeExcluded,
    excludeAdmin,
    excludeFingerprints: excludeFps,
    excludePages,
    filterUtm,
    timeRange,
    since,
    until
  })

  return { sessions }
})
