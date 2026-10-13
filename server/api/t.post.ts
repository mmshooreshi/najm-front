// server/api/t.post.ts
import { createHash, randomUUID } from 'node:crypto'
import { defineEventHandler, readBody, getRequestHeader, getRequestIP } from 'h3'
import type { ClientTelemetryPayload, StoredAnalyticsEvent } from '../../types/telemetry.ts'
import { enqueueEvents, flushBuffer } from '../utils/telemetryBuffer.ts'

export default defineEventHandler(async (event) => {
  try {
    let rawPayload = await readBody(event)

    // Handle beacon sendings formatted as stringified JSON
    if (typeof rawPayload === 'string') {
      try {
        rawPayload = JSON.parse(rawPayload)
      } catch {
        return { ok: false, error: 'Invalid JSON body' }
      }
    }

    if (!rawPayload) {
      return { ok: true, count: 0 }
    }

    // Support single event payload or array of events
    const rawEvents: ClientTelemetryPayload[] = Array.isArray(rawPayload)
      ? rawPayload
      : [rawPayload]

    if (rawEvents.length === 0) {
      return { ok: true, count: 0 }
    }

    // Extract client IP and create 16-character SHA-256 hash (never persist raw IP)
    const clientIp =
      getRequestIP(event, { xForwardedFor: true }) ||
      getRequestHeader(event, 'x-forwarded-for') ||
      getRequestHeader(event, 'x-real-ip') ||
      event.node?.req?.socket?.remoteAddress ||
      '127.0.0.1'

    const ipHash = createHash('sha256')
      .update(String(clientIp))
      .digest('hex')
      .slice(0, 16)

    const userAgent = getRequestHeader(event, 'user-agent') || null
    const headerReferer = getRequestHeader(event, 'referer') || null

    const storedRecords: StoredAnalyticsEvent[] = []

    for (const item of rawEvents) {
      if (!item || !item.event_name) continue

      storedRecords.push({
        id: randomUUID(),
        event_name: String(item.event_name),
        session_id: String(item.session_id || 'anonymous'),
        timestamp: item.timestamp || new Date().toISOString(),
        url: item.url || '/',
        referrer: item.referrer !== undefined ? item.referrer : headerReferer,
        ip_hash: ipHash,
        user_agent: userAgent,
        fingerprint: (item as any).fingerprint || null,
        is_excluded: Boolean((item as any).is_excluded),
        properties: item.properties || {}
      })
    }

    if (storedRecords.length > 0) {
      enqueueEvents(storedRecords)
    }

    return { ok: true, count: storedRecords.length }
  } catch (err: any) {
    console.error('[Telemetry:Ingest] Ingestion error:', err)
    return { ok: false, error: err?.message || 'Internal error' }
  }
})
