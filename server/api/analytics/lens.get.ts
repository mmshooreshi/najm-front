// server/api/analytics/lens.get.ts
import { defineEventHandler, getCookie, getHeader, getQuery, createError } from 'h3'
import type { TelemetryLensResponse } from '../../../types/telemetry.ts'
import { flushBuffer } from '../../utils/telemetryBuffer.ts'
import { getRecentLogs, getElementMetrics, getScrollDensity, getFilteredTelemetryData } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event): Promise<TelemetryLensResponse> => {
  // 1. Strict admin auth check using existing pb_admin cookie or Bearer token
  const token =
    getCookie(event, 'pb_admin') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Admin authentication required'
    })
  }

  // 2. Flush pending in-memory buffer to guarantee real-time data freshness
  try {
    await flushBuffer()
  } catch {}

  // 3. Extract query filters
  const query = getQuery(event)
  const targetUrl = query.url ? String(query.url).trim() : ''
  const sessionId = query.session_id ? String(query.session_id).trim() : undefined
  const timeframeMinutes = query.timeframe ? Number(query.timeframe) : undefined

  // 4. Query analytics
  let recentLogs
  if (sessionId || timeframeMinutes) {
    recentLogs = getFilteredTelemetryData({
      targetUrl,
      sessionId,
      timeframeMinutes,
      limit: 200
    })
  } else {
    recentLogs = getRecentLogs(targetUrl, 150)
  }

  const elementMetrics = getElementMetrics(targetUrl)
  const scrollDensity = getScrollDensity(targetUrl)

  return {
    recent_logs: recentLogs,
    element_metrics: elementMetrics,
    scroll_density: scrollDensity
  }
})
