// server/api/analytics/traffic.get.ts
import { defineEventHandler, getCookie, getHeader, getQuery, createError } from 'h3'
import type { TrafficStatsOverview } from '../../../types/telemetry.ts'
import { flushBuffer } from '../../utils/telemetryBuffer.ts'
import { getTrafficStatsOverview } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<{ stats: TrafficStatsOverview }> => {
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
  const includeExcluded = query.include_excluded === 'true' || query.include_excluded === '1'
  const excludeAdmin = query.exclude_admin !== 'false' && query.exclude_admin !== '0'
  const excludeFps = query.exclude_fps ? String(query.exclude_fps).split(',').map(s => s.trim()).filter(Boolean) : []
  const excludePages = query.exclude_pages ? String(query.exclude_pages).split(',').map(s => s.trim()).filter(Boolean) : []
  const filterUtm = query.filter_utm ? String(query.filter_utm).trim() : undefined
  const timeRange = (query.time_range as any) || undefined
  const since = query.since ? String(query.since) : undefined
  const until = query.until ? String(query.until) : undefined

  const stats = getTrafficStatsOverview({
    includeExcluded,
    excludeAdmin,
    excludeFingerprints: excludeFps,
    excludePages,
    filterUtm,
    timeRange,
    since,
    until
  })

  return { stats }
})
