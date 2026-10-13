// server/utils/telemetryDb.ts
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import type { StoredAnalyticsEvent, ElementMetricSummary, SessionSummary, TrafficStatsOverview } from '~/types/telemetry'

const req = typeof require === 'function' ? require : createRequire(import.meta.url)

const DATA_DIR = path.resolve(process.cwd(), '.data')
const DB_PATH = path.join(DATA_DIR, 'analytics.db')
const JSON_FALLBACK_PATH = path.join(DATA_DIR, 'analytics_events.json')
const EXCLUDED_FP_PATH = path.join(DATA_DIR, 'excluded_fingerprints.json')

let sqliteDb: any = null
let useFallbackJson = false
let fallbackMemoryEvents: StoredAnalyticsEvent[] = []

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {}
}

export function getExcludedFingerprints(): string[] {
  try {
    ensureDataDir()
    if (fs.existsSync(EXCLUDED_FP_PATH)) {
      const data = JSON.parse(fs.readFileSync(EXCLUDED_FP_PATH, 'utf-8'))
      if (Array.isArray(data)) return data
    }
  } catch {}
  return []
}

export function addExcludedFingerprint(fp: string): void {
  if (!fp) return
  try {
    ensureDataDir()
    const list = getExcludedFingerprints()
    if (!list.includes(fp)) {
      list.push(fp)
      fs.writeFileSync(EXCLUDED_FP_PATH, JSON.stringify(list, null, 2), 'utf-8')
    }
  } catch {}
}

export function removeExcludedFingerprint(fp: string): void {
  if (!fp) return
  try {
    ensureDataDir()
    const list = getExcludedFingerprints().filter((f) => f !== fp)
    fs.writeFileSync(EXCLUDED_FP_PATH, JSON.stringify(list, null, 2), 'utf-8')
  } catch {}
}

function initDb() {
  if (sqliteDb || useFallbackJson) return

  ensureDataDir()

  try {
    // Attempt native node:sqlite (Node 22+)
    const { DatabaseSync } = req('node:sqlite')
    const db = new DatabaseSync(DB_PATH)

    // Performance optimizations: WAL mode for fast concurrent append-only writes
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        event_name TEXT NOT NULL,
        session_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        url TEXT NOT NULL,
        referrer TEXT,
        ip_hash TEXT NOT NULL,
        user_agent TEXT,
        fingerprint TEXT,
        is_excluded INTEGER DEFAULT 0,
        properties TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_url ON analytics_events(url);
    `)

    // Safe migration: add fingerprint and is_excluded columns if table already existed without them
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN fingerprint TEXT;`)
    } catch {}
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN is_excluded INTEGER DEFAULT 0;`)
    } catch {}

    sqliteDb = db
  } catch (err) {
    console.warn('[TelemetryDb] Native node:sqlite unavailable, falling back to local JSON append store:', err)
    useFallbackJson = true
    loadFallbackJson()
  }
}

function loadFallbackJson() {
  try {
    ensureDataDir()
    if (fs.existsSync(JSON_FALLBACK_PATH)) {
      const raw = fs.readFileSync(JSON_FALLBACK_PATH, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        fallbackMemoryEvents = parsed
      }
    }
  } catch {
    fallbackMemoryEvents = []
  }
}

function saveFallbackJson() {
  try {
    ensureDataDir()
    fs.writeFileSync(JSON_FALLBACK_PATH, JSON.stringify(fallbackMemoryEvents, null, 2), 'utf-8')
  } catch {}
}

/**
 * Bulk insert an array of events
 */
export function insertBatch(events: StoredAnalyticsEvent[]): void {
  if (!events || events.length === 0) return

  initDb()

  if (sqliteDb) {
    try {
      sqliteDb.exec('BEGIN TRANSACTION;')
      const insertStmt = sqliteDb.prepare(`
        INSERT INTO analytics_events (
          id, event_name, session_id, timestamp, url, referrer, ip_hash, user_agent, fingerprint, is_excluded, properties
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const excludedFps = new Set(getExcludedFingerprints())

      for (const ev of events) {
        const fp = ev.fingerprint || null
        const isExcluded = Boolean(ev.is_excluded || (fp && excludedFps.has(fp)))
        insertStmt.run(
          ev.id || randomUUID(),
          ev.event_name,
          ev.session_id,
          ev.timestamp,
          ev.url,
          ev.referrer || null,
          ev.ip_hash,
          ev.user_agent || null,
          fp,
          isExcluded ? 1 : 0,
          typeof ev.properties === 'string' ? ev.properties : JSON.stringify(ev.properties || {})
        )
      }

      sqliteDb.exec('COMMIT;')
      return
    } catch (err) {
      try {
        sqliteDb.exec('ROLLBACK;')
      } catch {}
      console.error('[TelemetryDb] SQLite batch insert error, falling back to JSON:', err)
      useFallbackJson = true
    }
  }

  const excludedFps = new Set(getExcludedFingerprints())
  // Fallback storage
  for (const ev of events) {
    const fp = ev.fingerprint || null
    const isExcluded = Boolean(ev.is_excluded || (fp && excludedFps.has(fp)))
    fallbackMemoryEvents.push({
      ...ev,
      id: ev.id || randomUUID(),
      fingerprint: fp,
      is_excluded: isExcluded,
      properties: typeof ev.properties === 'string' ? JSON.parse(ev.properties) : ev.properties
    })
  }

  // Keep last 10,000 events in fallback file
  if (fallbackMemoryEvents.length > 10000) {
    fallbackMemoryEvents = fallbackMemoryEvents.slice(fallbackMemoryEvents.length - 10000)
  }

  saveFallbackJson()
}

/**
 * Get recent raw events for a URL (or all URLs if none specified)
 */
export function getRecentLogs(targetUrl?: string, limit = 30): StoredAnalyticsEvent[] {
  initDb()

  const normalizedTarget = targetUrl ? targetUrl.split('?')[0] : null

  if (sqliteDb) {
    try {
      let rows: any[]
      if (normalizedTarget) {
        const stmt = sqliteDb.prepare(`
          SELECT * FROM analytics_events
          WHERE url = ? OR url LIKE ?
          ORDER BY timestamp DESC
          LIMIT ?
        `)
        rows = stmt.all(normalizedTarget, `${normalizedTarget}%`, limit)
        // If no events found for this specific page yet, fall back to recent global events
        if (rows.length === 0) {
          const fallbackStmt = sqliteDb.prepare(`
            SELECT * FROM analytics_events
            ORDER BY timestamp DESC
            LIMIT ?
          `)
          rows = fallbackStmt.all(limit)
        }
      } else {
        const stmt = sqliteDb.prepare(`
          SELECT * FROM analytics_events
          ORDER BY timestamp DESC
          LIMIT ?
        `)
        rows = stmt.all(limit)
      }

      return rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        fingerprint: r.fingerprint || null,
        is_excluded: Boolean(r.is_excluded),
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      console.error('[TelemetryDb] Error querying recent logs:', err)
    }
  }

  // Fallback
  let filtered = fallbackMemoryEvents
  if (normalizedTarget) {
    filtered = filtered.filter(e => e.url === normalizedTarget || e.url.startsWith(normalizedTarget))
  }

  return filtered
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

/**
 * Aggregate interaction counts, dwell, and error indicators by target_id
 */
export function getElementMetrics(targetUrl?: string): Record<string, ElementMetricSummary> {
  initDb()

  const normalizedTarget = targetUrl ? targetUrl.split('?')[0] : null
  const metrics: Record<string, { taps: number; totalDwell: number; dwellCount: number; hesitations: number; errors: number; lastTime: string }> = {}

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      let rows: any[]
      if (normalizedTarget) {
        const stmt = sqliteDb.prepare(`
          SELECT * FROM analytics_events
          WHERE (url = ? OR url LIKE ?)
            AND event_name IN ('tap_heat', 'hesitation_trigger', 'ui_error')
          ORDER BY timestamp DESC
          LIMIT 1000
        `)
        rows = stmt.all(normalizedTarget, `${normalizedTarget}%`)
      } else {
        const stmt = sqliteDb.prepare(`
          SELECT * FROM analytics_events
          WHERE event_name IN ('tap_heat', 'hesitation_trigger', 'ui_error')
          ORDER BY timestamp DESC
          LIMIT 1000
        `)
        rows = stmt.all()
      }

      events = rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      console.error('[TelemetryDb] Error querying element metrics:', err)
      events = fallbackMemoryEvents
    }
  } else {
    events = fallbackMemoryEvents
  }

  for (const ev of events) {
    const props = ev.properties || {}
    const targetId = props.target_id || props.component_id || (props.type === 'ui_error' ? 'window' : null)
    if (!targetId) continue

    if (!metrics[targetId]) {
      metrics[targetId] = {
        taps: 0,
        totalDwell: 0,
        dwellCount: 0,
        hesitations: 0,
        errors: 0,
        lastTime: ev.timestamp
      }
    }

    const m = metrics[targetId]
    if (new Date(ev.timestamp).getTime() > new Date(m.lastTime).getTime()) {
      m.lastTime = ev.timestamp
    }

    if (ev.event_name === 'tap_heat') {
      m.taps++
    } else if (ev.event_name === 'hesitation_trigger') {
      m.hesitations++
      if (props.dwell_ms) {
        m.totalDwell += Number(props.dwell_ms)
        m.dwellCount++
      }
    } else if (ev.event_name === 'ui_error') {
      m.errors++
    }
  }

  const result: Record<string, ElementMetricSummary> = {}
  for (const [targetId, m] of Object.entries(metrics)) {
    result[targetId] = {
      target_id: targetId,
      tap_count: m.taps,
      avg_dwell_ms: m.dwellCount > 0 ? Math.round(m.totalDwell / m.dwellCount) : 0,
      hesitations: m.hesitations,
      errors: m.errors,
      last_interaction: m.lastTime
    }
  }

  return result
}

/**
 * Aggregate 20-bucket scroll density array
 */
export function getScrollDensity(targetUrl?: string): number[] {
  initDb()

  const normalizedTarget = targetUrl ? targetUrl.split('?')[0] : null
  const buckets = new Array(20).fill(0)
  let count = 0

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      let rows: any[]
      if (normalizedTarget) {
        const stmt = sqliteDb.prepare(`
          SELECT properties FROM analytics_events
          WHERE (url = ? OR url LIKE ?) AND event_name = 'scroll_dwell'
          ORDER BY timestamp DESC
          LIMIT 100
        `)
        rows = stmt.all(normalizedTarget, `${normalizedTarget}%`)
        if (rows.length === 0) {
          const fallbackStmt = sqliteDb.prepare(`
            SELECT properties FROM analytics_events
            WHERE event_name = 'scroll_dwell'
            ORDER BY timestamp DESC
            LIMIT 100
          `)
          rows = fallbackStmt.all()
        }
      } else {
        const stmt = sqliteDb.prepare(`
          SELECT properties FROM analytics_events
          WHERE event_name = 'scroll_dwell'
          ORDER BY timestamp DESC
          LIMIT 100
        `)
        rows = stmt.all()
      }

      events = rows.map((r: any) => ({
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      })) as any
    } catch (err) {
      console.error('[TelemetryDb] Error querying scroll density:', err)
      events = fallbackMemoryEvents
    }
  } else {
    events = fallbackMemoryEvents
  }

  for (const ev of events) {
    const rawBuckets = ev.properties?.buckets
    if (Array.isArray(rawBuckets) && rawBuckets.length === 20) {
      for (let i = 0; i < 20; i++) {
        buckets[i] += Number(rawBuckets[i]) || 0
      }
      count++
    }
  }

  if (count === 0) {
    return new Array(20).fill(0)
  }

  return buckets.map(val => Math.round((val / count) * 10) / 10)
}

function parseDeviceType(ua?: string | null): 'mobile' | 'desktop' | 'tablet' | 'unknown' {
  if (!ua) return 'unknown'
  const lower = ua.toLowerCase()
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) return 'tablet'
  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(lower)) return 'mobile'
  return 'desktop'
}

function classifyTrafficSource(
  referrer?: string | null,
  utmSource?: string | null,
  searchQuery?: string | null
): 'google_organic' | 'google_ads' | 'direct' | 'referral' | 'social' | 'utm' | 'other' {
  if (utmSource) {
    if (/google|gads|adwords/i.test(utmSource)) return 'google_ads'
    return 'utm'
  }
  if (!referrer || referrer === 'direct') return 'direct'
  const lower = referrer.toLowerCase()
  if (searchQuery || /google\./i.test(lower)) return 'google_organic'
  if (/instagram|t\.co|twitter|x\.com|bale|telegram|whatsapp|linkedin|facebook/i.test(lower)) return 'social'
  if (/torob|emalls|divar|sheypoor/i.test(lower)) return 'referral'
  return 'referral'
}

/**
 * Get aggregated summary of recent sessions
 */
export function getSessionList(limit = 50, includeExcluded = true): SessionSummary[] {
  initDb()

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        SELECT * FROM analytics_events
        ORDER BY timestamp DESC
        LIMIT 5000
      `)
      const rows = stmt.all()
      events = rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        fingerprint: r.fingerprint || null,
        is_excluded: Boolean(r.is_excluded),
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      console.error('[TelemetryDb] Error querying events for session list:', err)
      events = fallbackMemoryEvents
    }
  } else {
    events = fallbackMemoryEvents
  }

  const excludedFps = new Set(getExcludedFingerprints())

  const sessionMap = new Map<string, {
    events: StoredAnalyticsEvent[]
    urls: Set<string>
    tapCount: number
    referrer: string | null
    userAgent: string | null
    fingerprint: string | null
    isExcluded: boolean
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    searchQuery: string | null
  }>()

  for (const ev of events) {
    const sid = ev.session_id || 'anonymous'
    if (!sessionMap.has(sid)) {
      sessionMap.set(sid, {
        events: [],
        urls: new Set(),
        tapCount: 0,
        referrer: ev.referrer || null,
        userAgent: ev.user_agent || null,
        fingerprint: ev.fingerprint || null,
        isExcluded: Boolean(ev.is_excluded || (ev.fingerprint && excludedFps.has(ev.fingerprint))),
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        searchQuery: null
      })
    }
    const item = sessionMap.get(sid)!
    item.events.push(ev)
    if (ev.url) item.urls.add(ev.url.split('?')[0])
    if (ev.event_name === 'tap_heat') item.tapCount++
    if (!item.referrer && ev.referrer) item.referrer = ev.referrer
    if (!item.userAgent && ev.user_agent) item.userAgent = ev.user_agent
    if (!item.fingerprint && ev.fingerprint) item.fingerprint = ev.fingerprint
    if (ev.is_excluded || (ev.fingerprint && excludedFps.has(ev.fingerprint))) {
      item.isExcluded = true
    }

    // Extract UTM or search query from event properties or url
    const props = ev.properties || {}
    if (props.utm_source && !item.utmSource) item.utmSource = String(props.utm_source)
    if (props.utm_medium && !item.utmMedium) item.utmMedium = String(props.utm_medium)
    if (props.utm_campaign && !item.utmCampaign) item.utmCampaign = String(props.utm_campaign)
    if (props.search_query && !item.searchQuery) item.searchQuery = String(props.search_query)

    // Inspect URL query params if present
    if (ev.url && ev.url.includes('?')) {
      try {
        const queryStr = ev.url.split('?')[1]
        const params = new URLSearchParams(queryStr)
        if (!item.utmSource && params.get('utm_source')) item.utmSource = params.get('utm_source')
        if (!item.utmMedium && params.get('utm_medium')) item.utmMedium = params.get('utm_medium')
        if (!item.utmCampaign && params.get('utm_campaign')) item.utmCampaign = params.get('utm_campaign')
        if (!item.searchQuery && (params.get('q') || params.get('query'))) {
          item.searchQuery = params.get('q') || params.get('query')
        }
      } catch {}
    }
  }

  const summaries: SessionSummary[] = []

  for (const [sid, data] of sessionMap.entries()) {
    if (!includeExcluded && data.isExcluded) {
      continue
    }

    // Sort chronological
    data.events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const firstSeen = data.events[0]?.timestamp || new Date().toISOString()
    const lastSeen = data.events[data.events.length - 1]?.timestamp || firstSeen
    const durationSec = Math.max(0, Math.round((new Date(lastSeen).getTime() - new Date(firstSeen).getTime()) / 1000))

    const sourceType = classifyTrafficSource(data.referrer, data.utmSource, data.searchQuery)

    summaries.push({
      session_id: sid,
      first_seen: firstSeen,
      last_seen: lastSeen,
      duration_sec: durationSec,
      page_count: data.urls.size,
      event_count: data.events.length,
      tap_count: data.tapCount,
      referrer: data.referrer,
      device_type: parseDeviceType(data.userAgent),
      user_agent: data.userAgent,
      fingerprint: data.fingerprint,
      is_excluded: data.isExcluded,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      search_query: data.searchQuery,
      source_type: sourceType,
      pages: Array.from(data.urls)
    })
  }

  // Sort sessions by last_seen descending
  summaries.sort((a, b) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime())
  return summaries.slice(0, limit)
}

/**
 * Get all events for a specific session
 */
export function getSessionEvents(sessionId: string): StoredAnalyticsEvent[] {
  initDb()

  if (sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        SELECT * FROM analytics_events
        WHERE session_id = ?
        ORDER BY timestamp ASC
      `)
      const rows = stmt.all(sessionId)
      return rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      console.error('[TelemetryDb] Error querying session events:', err)
    }
  }

  return fallbackMemoryEvents
    .filter(e => e.session_id === sessionId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

/**
 * Query tap events and scroll logs with optional session filtering and timeframe filtering
 */
export function getFilteredTelemetryData(options: {
  targetUrl?: string
  sessionId?: string
  timeframeMinutes?: number
  limit?: number
}) {
  initDb()
  const { targetUrl, sessionId, timeframeMinutes, limit = 200 } = options
  const normalizedTarget = targetUrl ? targetUrl.split('?')[0] : null

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      const conditions: string[] = []
      const params: any[] = []

      if (normalizedTarget) {
        conditions.push('(url = ? OR url LIKE ?)')
        params.push(normalizedTarget, `${normalizedTarget}%`)
      }

      if (sessionId && sessionId !== 'all') {
        conditions.push('session_id = ?')
        params.push(sessionId)
      }

      if (timeframeMinutes && timeframeMinutes > 0) {
        const cutoff = new Date(Date.now() - timeframeMinutes * 60 * 1000).toISOString()
        conditions.push('timestamp >= ?')
        params.push(cutoff)
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const query = `
        SELECT * FROM analytics_events
        ${whereClause}
        ORDER BY timestamp DESC
        LIMIT ?
      `
      params.push(limit)

      const stmt = sqliteDb.prepare(query)
      const rows = stmt.all(...params)

      events = rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
      return events
    } catch (err) {
      console.error('[TelemetryDb] Error querying filtered telemetry data:', err)
      events = fallbackMemoryEvents
    }
  } else {
    events = fallbackMemoryEvents
  }

  let filtered = events
  if (normalizedTarget) {
    filtered = filtered.filter(e => e.url === normalizedTarget || e.url.startsWith(normalizedTarget))
  }
  if (sessionId && sessionId !== 'all') {
    filtered = filtered.filter(e => e.session_id === sessionId)
  }
  if (timeframeMinutes && timeframeMinutes > 0) {
    const cutoffTime = Date.now() - timeframeMinutes * 60 * 1000
    filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= cutoffTime)
  }

  return filtered
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

/**
 * Get comprehensive traffic, UTM, search query, page flow, and debounce statistics
 */
export function getTrafficStatsOverview(includeExcluded = false): TrafficStatsOverview {
  initDb()

  const allSessions = getSessionList(500, includeExcluded)
  const excludedFps = getExcludedFingerprints()

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        SELECT * FROM analytics_events
        ORDER BY timestamp DESC
        LIMIT 10000
      `)
      const rows = stmt.all()
      events = rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        user_agent: r.user_agent,
        fingerprint: r.fingerprint || null,
        is_excluded: Boolean(r.is_excluded),
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      events = fallbackMemoryEvents
    }
  } else {
    events = fallbackMemoryEvents
  }

  // Filter out excluded events if requested
  if (!includeExcluded) {
    const excludedFpSet = new Set(excludedFps)
    events = events.filter((e) => !e.is_excluded && !(e.fingerprint && excludedFpSet.has(e.fingerprint)))
  }

  // 1. Overview Totals
  const totalSessions = allSessions.length
  let totalPageviews = 0
  let totalDurationSec = 0
  let bouncedSessions = 0

  for (const s of allSessions) {
    totalDurationSec += s.duration_sec
    if (s.page_count <= 1 && s.duration_sec < 10) {
      bouncedSessions++
    }
  }

  const avgDurationSec = totalSessions > 0 ? Math.round(totalDurationSec / totalSessions) : 0
  const bounceRatePct = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0

  // 2. UTM Sources breakdown
  const utmMap = new Map<string, number>()
  // 3. Google Queries
  const queryMap = new Map<string, { count: number; landingPage: string }>()
  // 4. Source Types
  const sourceBreakdownMap = new Map<string, number>()
  // 5. Landing Pages
  const landingPageMap = new Map<string, number>()

  for (const s of allSessions) {
    // UTM
    if (s.utm_source) {
      const src = s.utm_source.toLowerCase().trim()
      utmMap.set(src, (utmMap.get(src) || 0) + 1)
    }

    // Google query
    if (s.search_query) {
      const q = s.search_query.trim()
      const existing = queryMap.get(q) || { count: 0, landingPage: s.pages[0] || '/' }
      existing.count++
      queryMap.set(q, existing)
    }

    // Source breakdown
    const st = s.source_type || 'direct'
    sourceBreakdownMap.set(st, (sourceBreakdownMap.get(st) || 0) + 1)

    // Landing page
    if (s.pages && s.pages.length > 0) {
      const landing = s.pages[0]
      landingPageMap.set(landing, (landingPageMap.get(landing) || 0) + 1)
    }
  }

  const utmSources = Array.from(utmMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const googleQueries = Array.from(queryMap.entries())
    .map(([query, val]) => ({
      query,
      count: val.count,
      landing_page: val.landingPage
    }))
    .sort((a, b) => b.count - a.count)

  const sourceLabels: Record<string, string> = {
    google_organic: 'گوگل ارگانیک (Google Search)',
    google_ads: 'تبلیغات گوگل (Google Ads)',
    direct: 'ورود مستقیم (Direct / Bookmark)',
    referral: 'سایت‌های معرف (Referral)',
    social: 'شبکه‌های اجتماعی (Social / Messaging)',
    utm: 'کمپین‌های نشانه‌دار (UTM Campaigns)',
    other: 'سایر منابع (Other)'
  }

  const sourceBreakdown = Array.from(sourceBreakdownMap.entries())
    .map(([type, count]) => ({
      type,
      label: sourceLabels[type] || type,
      count,
      percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const topLandingPages = Array.from(landingPageMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // 6. Page Flows (Transitions from Page A -> Page B in user journeys)
  const flowMap = new Map<string, number>()
  const sessionPageSequence = new Map<string, Array<{ url: string; time: number }>>()

  let debouncedScrollsCount = 0
  let totalDwellSecBeforeStop = 0
  let dwellEventsCount = 0
  let hesitationsCount = 0

  for (const ev of events) {
    if (ev.event_name === 'page_view') {
      totalPageviews++
      const cleanUrl = ev.url.split('?')[0]
      if (!sessionPageSequence.has(ev.session_id)) {
        sessionPageSequence.set(ev.session_id, [])
      }
      sessionPageSequence.get(ev.session_id)!.push({
        url: cleanUrl,
        time: new Date(ev.timestamp).getTime()
      })
    } else if (ev.event_name === 'scroll_dwell') {
      debouncedScrollsCount++
      const d = Number(ev.properties?.dwell_sec || 0)
      if (d > 0) {
        totalDwellSecBeforeStop += d
        dwellEventsCount++
      }
    } else if (ev.event_name === 'hesitation_trigger') {
      hesitationsCount++
    }
  }

  // Calculate transitions
  for (const [_, seq] of sessionPageSequence.entries()) {
    seq.sort((a, b) => a.time - b.time)
    for (let i = 0; i < seq.length - 1; i++) {
      const from = seq[i].url
      const to = seq[i + 1].url
      if (from !== to) {
        const key = `${from} ===> ${to}`
        flowMap.set(key, (flowMap.get(key) || 0) + 1)
      }
    }
  }

  const pageFlows = Array.from(flowMap.entries())
    .map(([key, count]) => {
      const [from, to] = key.split(' ===> ')
      return { from, to, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return {
    total_sessions: totalSessions,
    total_pageviews: totalPageviews,
    total_events: events.length,
    avg_duration_sec: avgDurationSec,
    bounce_rate_pct: bounceRatePct,
    utm_sources: utmSources,
    google_queries: googleQueries,
    source_breakdown: sourceBreakdown,
    page_flows: pageFlows,
    top_landing_pages: topLandingPages,
    debounce_stats: {
      total_debounced_scrolls: debouncedScrollsCount,
      avg_dwell_before_stop: dwellEventsCount > 0 ? Math.round((totalDwellSecBeforeStop / dwellEventsCount) * 10) / 10 : 0,
      hesitations: hesitationsCount
    },
    excluded_fingerprints: excludedFps
  }
}


