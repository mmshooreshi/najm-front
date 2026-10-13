// composables/useTracker.ts
import type { TelemetryEventMap, TelemetryEventName, ClientTelemetryPayload } from '~/types/telemetry'

const FLUSH_INTERVAL_MS = 1500 // 1.5 seconds for snappy updates
const QUEUE_BATCH_LIMIT = 5 // Auto-flush at 5 items
const SESSION_STORAGE_KEY = 'najm_telemetry_sid'
const LAST_ACTIVITY_KEY = 'najm_telemetry_last_act'
const FINGERPRINT_STORAGE_KEY = 'najm_telemetry_fp'
const EXCLUDED_STORAGE_KEY = 'najm_telemetry_excluded'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes inactivity expiry

let memSessionId = ''
let memFingerprint = ''
let clientQueue: ClientTelemetryPayload[] = []
let flushTimer: any = null
let isDispatching = false

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `sid_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`
  }
  return `sid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Generate lightweight, deterministic client fingerprint based on browser traits
 */
export function getClientFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr_fp'
  if (memFingerprint) return memFingerprint

  try {
    const existing = localStorage.getItem(FINGERPRINT_STORAGE_KEY)
    if (existing) {
      memFingerprint = existing
      return memFingerprint
    }

    const nav = window.navigator
    const screen = window.screen
    const components = [
      nav.userAgent || '',
      nav.language || '',
      (nav.languages || []).join(','),
      screen.width + 'x' + screen.height,
      screen.colorDepth || '',
      new Date().getTimezoneOffset(),
      nav.hardwareConcurrency || '',
      nav.platform || ''
    ].join('###')

    // Simple fast 32-bit FNV-1a hash
    let hash = 2166136261
    for (let i = 0; i < components.length; i++) {
      hash ^= components.charCodeAt(i)
      hash = Math.imul(hash, 16777619)
    }
    const fp = 'fp_' + (hash >>> 0).toString(16).padStart(8, '0')
    localStorage.setItem(FINGERPRINT_STORAGE_KEY, fp)
    memFingerprint = fp
    return memFingerprint
  } catch {
    if (!memFingerprint) {
      memFingerprint = 'fp_' + Math.random().toString(36).slice(2, 10)
    }
    return memFingerprint
  }
}

/**
 * Check if the current device/admin has marked themselves as excluded
 */
export function isDeviceExcluded(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(EXCLUDED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Toggle excluding this browser/device from analytics
 */
export function setDeviceExcluded(excluded: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (excluded) {
      localStorage.setItem(EXCLUDED_STORAGE_KEY, 'true')
    } else {
      localStorage.removeItem(EXCLUDED_STORAGE_KEY)
    }
  } catch {}
}

export function getTelemetrySessionId(): string {
  if (typeof window === 'undefined') return 'ssr_session'

  try {
    const now = Date.now()
    const lastAct = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY) || 0)
    const isExpired = lastAct > 0 && now - lastAct > SESSION_TIMEOUT_MS

    if (memSessionId && !isExpired) {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      return memSessionId
    }

    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existing && !isExpired) {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      memSessionId = existing
      return memSessionId
    }

    // Inactivity timeout reached or initial session -> generate fresh session
    const newId = generateSessionId()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newId)
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now))
    memSessionId = newId
    return memSessionId
  } catch {
    // Private mode fallback
    if (!memSessionId) {
      memSessionId = generateSessionId()
    }
    return memSessionId
  }
}

/**
 * Dispatch events payload to ingestion endpoint via sendBeacon or fetch keepalive
 */
function sendPayload(batch: ClientTelemetryPayload[]) {
  if (!batch || batch.length === 0) return

  const jsonStr = JSON.stringify(batch)
  const endpoint = '/api/t'

  // Attempt sendBeacon with text/plain (CORS safelisted, 0 preflight, 100% reliable)
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([jsonStr], { type: 'text/plain' })
      const queued = navigator.sendBeacon(endpoint, blob)
      if (queued) return
    } catch {}
  }

  // Fallback to fetch with keepalive: true
  if (typeof fetch === 'function') {
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
        keepalive: true,
        priority: 'low'
      }).catch(() => {})
    } catch {}
  }
}

/**
 * Flush all currently queued client events immediately
 */
export function flushClientTelemetryQueue(): void {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  if (clientQueue.length === 0) return

  const batch = clientQueue
  clientQueue = []
  sendPayload(batch)
}

function scheduleQueueFlush() {
  if (flushTimer) return

  // Adaptive interval: if mobile user is on metered/slow data, batch less aggressively to conserve battery & bandwidth
  const navAny = typeof navigator !== 'undefined' ? (navigator as any) : null
  const isDataSaver = navAny?.connection?.saveData || ['slow-2g', '2g'].includes(navAny?.connection?.effectiveType)
  const interval = isDataSaver ? 3500 : FLUSH_INTERVAL_MS

  flushTimer = setTimeout(() => {
    flushTimer = null
    flushClientTelemetryQueue()
  }, interval)
}

/**
 * Track a typed packaging domain event
 */
export function trackEvent<K extends TelemetryEventName>(
  eventName: K,
  properties: TelemetryEventMap[K],
  immediate = false
): void {
  if (typeof window === 'undefined') return

  const payload: ClientTelemetryPayload<K> = {
    event_name: eventName,
    session_id: getTelemetrySessionId(),
    timestamp: new Date().toISOString(),
    url: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    fingerprint: getClientFingerprint(),
    is_excluded: isDeviceExcluded(),
    properties
  }

  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
  } catch {}

  // 1. Dispatch custom event for 0ms in-memory UI updates in Telemetry Lens
  try {
    window.dispatchEvent(
      new CustomEvent('najm:telemetry-event', {
        detail: { ...payload, id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }
      })
    )
  } catch {}

  // 2. Queue for server ingestion
  clientQueue.push(payload)

  const isHighPriority =
    immediate ||
    eventName === 'tap_heat' ||
    eventName === 'page_view' ||
    eventName === 'ui_error' ||
    eventName === 'sales_handoff'

  if (isHighPriority || clientQueue.length >= QUEUE_BATCH_LIMIT) {
    flushClientTelemetryQueue()
  } else {
    scheduleQueueFlush()
  }
}

export function useTracker() {
  return {
    track: trackEvent,
    flush: flushClientTelemetryQueue,
    getSessionId: getTelemetrySessionId,
    getFingerprint: getClientFingerprint,
    isExcluded: isDeviceExcluded,
    setExcluded: setDeviceExcluded,
    getQueueLength: () => clientQueue.length
  }
}
