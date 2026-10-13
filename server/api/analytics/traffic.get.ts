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

  const stats = getTrafficStatsOverview(includeExcluded)

  return { stats }
})
