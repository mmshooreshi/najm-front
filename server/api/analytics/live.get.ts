// server/api/analytics/live.get.ts
import { defineEventHandler, getCookie, getHeader, getQuery, createError } from 'h3'
import type { LiveRealTimeStats } from '../../../types/telemetry.ts'
import { flushBuffer } from '../../utils/telemetryBuffer.ts'
import { getLiveRealTimeStats } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<{ live: LiveRealTimeStats }> => {
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
  const minutes = query.minutes ? Math.min(60, Math.max(1, Number(query.minutes))) : 15
  const excludeAdmin = query.exclude_admin !== 'false' && query.exclude_admin !== '0'

  const live = getLiveRealTimeStats(minutes, excludeAdmin)

  return { live }
})
