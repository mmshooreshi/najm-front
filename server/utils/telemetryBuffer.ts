// server/utils/telemetryBuffer.ts
import type { StoredAnalyticsEvent } from '~/types/telemetry'
import { insertBatch } from './telemetryDb.ts'

const FLUSH_INTERVAL_MS = 3500 // 3.5 seconds
const BATCH_SIZE_THRESHOLD = 50 // Flush once 50 records accumulate
const MAX_QUEUE_LIMIT = 2000 // Emergency threshold

let buffer: StoredAnalyticsEvent[] = []
let flushTimer: NodeJS.Timeout | null = null
let isFlushing = false

/**
 * Start the periodic flush timer if not active
 */
function ensureTimer() {
  if (!flushTimer) {
    flushTimer = setInterval(() => {
      flushBuffer().catch(err => {
        console.error('[TelemetryBuffer] Interval flush error:', err)
      })
    }, FLUSH_INTERVAL_MS)

    // Unref timer so it doesn't hold the process open
    if (typeof flushTimer.unref === 'function') {
      flushTimer.unref()
    }
  }
}

/**
 * Flush accumulated events to the database
 */
export async function flushBuffer(): Promise<number> {
  if (isFlushing || buffer.length === 0) return 0
  isFlushing = true

  // Atomically grab current batch
  const itemsToFlush = buffer
  buffer = []

  try {
    insertBatch(itemsToFlush)
    return itemsToFlush.length
  } catch (err) {
    console.error('[TelemetryBuffer] Failed to flush batch, restoring buffer:', err)
    // Put items back at front of buffer
    buffer = itemsToFlush.concat(buffer).slice(0, MAX_QUEUE_LIMIT)
    return 0
  } finally {
    isFlushing = false
  }
}

/**
 * Enqueue incoming event records into the in-memory buffer
 */
export function enqueueEvents(events: StoredAnalyticsEvent[]): void {
  if (!events || events.length === 0) return

  buffer.push(...events)
  ensureTimer()

  // If batch threshold exceeded, flush immediately
  if (buffer.length >= BATCH_SIZE_THRESHOLD) {
    flushBuffer().catch(err => {
      console.error('[TelemetryBuffer] Immediate batch flush error:', err)
    })
  }
}

/**
 * Get current buffer queue length
 */
export function getBufferSize(): number {
  return buffer.length
}

// Clean up on process exit
if (typeof process !== 'undefined') {
  const exitHandler = () => {
    if (buffer.length > 0) {
      try {
        insertBatch(buffer)
        buffer = []
      } catch {}
    }
  }

  process.once('beforeExit', exitHandler)
  process.once('SIGINT', exitHandler)
  process.once('SIGTERM', exitHandler)
}
