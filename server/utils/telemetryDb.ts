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
        ip TEXT,
        region TEXT,
        properties TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_url ON analytics_events(url);
    `)

    // Safe migrations: add columns if table already existed without them
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN fingerprint TEXT;`)
    } catch {}
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN is_excluded INTEGER DEFAULT 0;`)
    } catch {}
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN ip TEXT;`)
    } catch {}
    try {
      db.exec(`ALTER TABLE analytics_events ADD COLUMN region TEXT;`)
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
          id, event_name, session_id, timestamp, url, referrer, ip_hash, user_agent, fingerprint, is_excluded, ip, region, properties
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          ev.ip || null,
          ev.region || null,
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
      ip: ev.ip || null,
      region: ev.region || null,
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
        ip: r.ip || null,
        region: r.region || null,
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

export function isAdminUrl(url?: string | null): boolean {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return (
    clean.startsWith('/dash') ||
    clean.startsWith('/admin') ||
    clean.startsWith('/api') ||
    clean === '/admin-login' ||
    clean === '/login'
  )
}

export interface TelemetryQueryOptions {
  limit?: number
  includeExcluded?: boolean
  excludeAdmin?: boolean
  excludeFingerprints?: string[]
  excludePages?: string[]
  filterUtm?: string
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d' | 'all'
  since?: string
  until?: string
}

function getTimeRangeCutoff(timeRange?: string, since?: string): string | null {
  if (since) {
    try {
      return new Date(since).toISOString()
    } catch {}
  }
  const now = Date.now()
  switch (timeRange) {
    case '1h':
      return new Date(now - 1 * 3600 * 1000).toISOString()
    case '24h':
      return new Date(now - 24 * 3600 * 1000).toISOString()
    case '7d':
      return new Date(now - 7 * 86400 * 1000).toISOString()
    case '30d':
      return new Date(now - 30 * 86400 * 1000).toISOString()
    case '90d':
      return new Date(now - 90 * 86400 * 1000).toISOString()
    case 'all':
      return null
    default:
      return null
  }
}

function parseBrowserInfo(ua?: string | null): { name: string; icon: string; version?: string } {
  if (!ua) return { name: 'مرورگر وب', icon: 'globe' }
  const lower = ua.toLowerCase()
  if (lower.includes('bale')) return { name: 'پیام‌رسان بله', icon: 'globe' }
  if (lower.includes('telegram')) return { name: 'تلگرام', icon: 'globe' }
  if (lower.includes('instagram')) return { name: 'اینستاگرام', icon: 'globe' }
  if (lower.includes('edg/') || lower.includes('edge/')) return { name: 'Microsoft Edge', icon: 'edge' }
  if (lower.includes('samsungbrowser')) return { name: 'سامسونگ اینترنت', icon: 'globe' }
  if (lower.includes('opr/') || lower.includes('opera/')) return { name: 'اپرا (Opera)', icon: 'globe' }
  if (lower.includes('firefox/') || lower.includes('fxios/')) return { name: 'فایرفاکس (Firefox)', icon: 'firefox' }
  if (lower.includes('chrome/') || lower.includes('crios/')) return { name: 'گوگل کروم (Chrome)', icon: 'chrome' }
  if (lower.includes('safari/')) return { name: 'سافاری (Safari)', icon: 'safari' }
  return { name: 'مرورگر دسکتاپ', icon: 'globe' }
}

function parseDeviceDetails(ua?: string | null): { name: string; icon: string; os: string; type: string } {
  if (!ua) return { name: 'دستگاه نامشخص', icon: 'desktop', os: 'نامشخص', type: 'desktop' }
  const lower = ua.toLowerCase()
  if (/ipad/i.test(lower)) return { name: 'آیپد (iPadOS)', icon: 'apple', os: 'iPadOS', type: 'tablet' }
  if (/iphone|ipod/i.test(lower)) return { name: 'آیفون (iOS)', icon: 'apple', os: 'iOS', type: 'mobile' }
  if (/android/i.test(lower)) {
    const isTab = !/mobile/i.test(lower)
    return { name: isTab ? 'تبلت اندروید' : 'گوشی اندروید', icon: 'android', os: 'Android', type: isTab ? 'tablet' : 'mobile' }
  }
  if (/macintosh|mac os x/i.test(lower)) return { name: 'مک (macOS)', icon: 'apple', os: 'macOS', type: 'desktop' }
  if (/windows/i.test(lower)) return { name: 'ویندوز (Windows)', icon: 'windows', os: 'Windows', type: 'desktop' }
  if (/linux/i.test(lower)) return { name: 'لینوکس (Linux)', icon: 'desktop', os: 'Linux', type: 'desktop' }
  return { name: 'رایانه رومیزی', icon: 'desktop', os: 'دسکتاپ', type: 'desktop' }
}

function buildJourneySteps(events: StoredAnalyticsEvent[], sourceType: string, durationSec: number): any[] {
  if (!events || events.length === 0) return []

  const steps: any[] = []
  let stepIdx = 1

  // 1. Landing step
  const firstEv = events[0]
  const firstUrl = firstEv.url?.split('?')[0] || '/'
  steps.push({
    step: stepIdx++,
    type: 'landing',
    title: 'ورود به سایت',
    subtitle: firstUrl,
    badge: sourceType,
    timestamp: firstEv.timestamp
  })

  // 2. Process chronological interactions
  let lastUrl = firstUrl
  for (let i = 1; i < events.length; i++) {
    const ev = events[i]
    const cleanUrl = ev.url?.split('?')[0] || '/'
    const props = ev.properties || {}

    if (ev.event_name === 'page_view') {
      if (cleanUrl !== lastUrl) {
        steps.push({
          step: stepIdx++,
          type: 'page',
          title: 'مشاهده صفحه',
          subtitle: cleanUrl,
          timestamp: ev.timestamp
        })
        lastUrl = cleanUrl
      }
    } else if (ev.event_name === 'tap_heat') {
      const label = props.target_label || props.target_id || 'کلیک روی دکمه'
      steps.push({
        step: stepIdx++,
        type: 'tap',
        title: label,
        subtitle: cleanUrl,
        icon: 'cursor-click',
        target_id: props.target_id,
        target_label: props.target_label,
        timestamp: ev.timestamp
      })
    } else if (ev.event_name === 'scroll_dwell') {
      const dwell = Number(props.dwell_sec || 0)
      if (dwell >= 3) {
        steps.push({
          step: stepIdx++,
          type: 'dwell',
          title: `مطالعه و مکث (${dwell} ثانیه)`,
          subtitle: props.section ? `بخش: ${props.section}` : cleanUrl,
          dwell_sec: dwell,
          timestamp: ev.timestamp
        })
      }
    } else if (['sales_handoff', 'dieline_download', 'spec_configured', 'volume_inquired'].includes(ev.event_name)) {
      let title = 'تبدیل هدف'
      let subtitle = ''
      if (ev.event_name === 'sales_handoff') {
        title = `ارتباط فروش (${props.channel || 'واتساپ'})`
        subtitle = props.spec_summary || ''
      } else if (ev.event_name === 'dieline_download') {
        title = `دانلود قالب (${props.box_type || 'جعبه'})`
        subtitle = props.dimensions || ''
      } else if (ev.event_name === 'spec_configured') {
        title = `محاسبه ابعاد (${props.packaging_type || 'جعبه'})`
      } else if (ev.event_name === 'volume_inquired') {
        title = `استعلام تیراژ (${props.quantity ? props.quantity + ' عدد' : ''})`
      }

      steps.push({
        step: stepIdx++,
        type: 'conversion',
        title,
        subtitle,
        badge: '🎯 هدف',
        timestamp: ev.timestamp
      })
    }

    if (steps.length >= 15) break
  }

  return steps
}

/**
 * Get aggregated summary of recent sessions
 */
export function getSessionList(
  limitOrOptions: number | TelemetryQueryOptions = 50,
  legacyIncludeExcluded = true
): SessionSummary[] {
  initDb()

  const opts: TelemetryQueryOptions = typeof limitOrOptions === 'object'
    ? limitOrOptions
    : { limit: limitOrOptions, includeExcluded: legacyIncludeExcluded }

  const limit = opts.limit ?? 50
  const includeExcluded = opts.includeExcluded ?? false
  const excludeAdmin = opts.excludeAdmin !== false
  const excludeFps = new Set(opts.excludeFingerprints || [])
  const excludePages = opts.excludePages || []
  const filterUtm = opts.filterUtm ? opts.filterUtm.toLowerCase().trim() : undefined
  const cutoff = getTimeRangeCutoff(opts.timeRange, opts.since)
  const until = opts.until ? new Date(opts.until).toISOString() : null

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      let query = `SELECT * FROM analytics_events WHERE 1=1`
      const params: any[] = []

      if (cutoff) {
        query += ` AND timestamp >= ?`
        params.push(cutoff)
      }
      if (until) {
        query += ` AND timestamp <= ?`
        params.push(until)
      }

      query += ` ORDER BY timestamp DESC LIMIT 25000`

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
        ip: r.ip || null,
        region: r.region || null,
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
    if (cutoff) {
      events = events.filter(e => e.timestamp >= cutoff)
    }
    if (until) {
      events = events.filter(e => e.timestamp <= until)
    }
  }

  const excludedFps = new Set(getExcludedFingerprints())

  const sessionMap = new Map<string, {
    events: StoredAnalyticsEvent[]
    urls: Set<string>
    tapCount: number
    referrer: string | null
    userAgent: string | null
    fingerprint: string | null
    ip: string | null
    ipHash: string | null
    region: string | null
    isExcluded: boolean
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    searchQuery: string | null
  }>()

  for (const ev of events) {
    // Exclude admin URLs if requested
    if (excludeAdmin && isAdminUrl(ev.url)) continue

    // Exclude custom fingerprints
    if (ev.fingerprint && excludeFps.has(ev.fingerprint)) continue

    // Exclude custom pages
    if (excludePages.some(p => ev.url && ev.url.startsWith(p))) continue

    const sid = ev.session_id || 'anonymous'
    if (!sessionMap.has(sid)) {
      sessionMap.set(sid, {
        events: [],
        urls: new Set(),
        tapCount: 0,
        referrer: ev.referrer || null,
        userAgent: ev.user_agent || null,
        fingerprint: ev.fingerprint || null,
        ip: ev.ip || null,
        ipHash: ev.ip_hash || null,
        region: ev.region || null,
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
    if (!item.ip && ev.ip) item.ip = ev.ip
    if (!item.ipHash && ev.ip_hash) item.ipHash = ev.ip_hash
    if (!item.region && ev.region) item.region = ev.region
    if (ev.is_excluded || (ev.fingerprint && excludedFps.has(ev.fingerprint))) {
      item.isExcluded = true
    }

    // Extract UTM or search query from event properties or url
    const props = ev.properties || {}
    if (props.utm_source && !item.utmSource) item.utmSource = String(props.utm_source)
    if (props.utm_medium && !item.utmMedium) item.utmMedium = String(props.utm_medium)
    if (props.utm_campaign && !item.utmCampaign) item.utmCampaign = String(props.utm_campaign)
    if (props.search_query && !item.searchQuery) item.searchQuery = String(props.search_query)

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

    // If session only had admin visits and has 0 public pages, omit when excludeAdmin is true
    if (data.urls.size === 0) {
      continue
    }

    // Filter by UTM if specified
    if (filterUtm) {
      const uSrc = (data.utmSource || '').toLowerCase()
      const uCamp = (data.utmCampaign || '').toLowerCase()
      if (uSrc !== filterUtm && uCamp !== filterUtm) {
        continue
      }
    }

    // Sort chronological
    data.events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const firstSeen = data.events[0]?.timestamp || new Date().toISOString()
    const lastSeen = data.events[data.events.length - 1]?.timestamp || firstSeen

    // Calculate realistic active duration by summing gaps capped at 300s (prevents idle runaway duration)
    let activeDurationSec = 0
    if (data.events.length > 1) {
      for (let i = 0; i < data.events.length - 1; i++) {
        const t1 = new Date(data.events[i].timestamp).getTime()
        const t2 = new Date(data.events[i + 1].timestamp).getTime()
        const deltaSec = Math.max(0, Math.round((t2 - t1) / 1000))
        if (deltaSec > 300) {
          activeDurationSec += 30 // Idle/away: count max 30s
        } else {
          activeDurationSec += deltaSec
        }
      }
    } else {
      activeDurationSec = Math.max(1, Number(data.events[0]?.properties?.dwell_sec || 0))
    }
    const durationSec = Math.min(7200, activeDurationSec)

    const sourceType = classifyTrafficSource(data.referrer, data.utmSource, data.searchQuery)
    const browser = parseBrowserInfo(data.userAgent)
    const device = parseDeviceDetails(data.userAgent)
    const journeySteps = buildJourneySteps(data.events, sourceType, durationSec)

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
      ip: data.ip,
      ip_hash: data.ipHash,
      region: data.region,
      browser,
      device,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      search_query: data.searchQuery,
      source_type: sourceType,
      pages: Array.from(data.urls),
      journey_steps: journeySteps
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
export function getTrafficStatsOverview(
  includeExcludedOrOptions: boolean | TelemetryQueryOptions = false
): TrafficStatsOverview {
  initDb()

  const opts: TelemetryQueryOptions = typeof includeExcludedOrOptions === 'object'
    ? includeExcludedOrOptions
    : { includeExcluded: includeExcludedOrOptions }

  const includeExcluded = opts.includeExcluded ?? false
  const excludeAdmin = opts.excludeAdmin !== false
  const excludeFps = new Set(opts.excludeFingerprints || [])
  const excludePages = opts.excludePages || []
  const filterUtm = opts.filterUtm ? opts.filterUtm.toLowerCase().trim() : undefined

  const cutoff = getTimeRangeCutoff(opts.timeRange, opts.since)
  const until = opts.until ? new Date(opts.until).toISOString() : null

  const allSessions = getSessionList({
    limit: 5000,
    includeExcluded,
    excludeAdmin,
    excludeFingerprints: opts.excludeFingerprints,
    excludePages: opts.excludePages,
    filterUtm: opts.filterUtm,
    timeRange: opts.timeRange,
    since: opts.since,
    until: opts.until
  })
  const excludedFps = getExcludedFingerprints()

  let events: StoredAnalyticsEvent[] = []

  if (sqliteDb) {
    try {
      let query = `SELECT * FROM analytics_events WHERE 1=1`
      const params: any[] = []

      if (cutoff) {
        query += ` AND timestamp >= ?`
        params.push(cutoff)
      }
      if (until) {
        query += ` AND timestamp <= ?`
        params.push(until)
      }

      query += ` ORDER BY timestamp DESC LIMIT 50000`

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
        ip: r.ip || null,
        region: r.region || null,
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
    if (cutoff) {
      events = events.filter(e => e.timestamp >= cutoff)
    }
    if (until) {
      events = events.filter(e => e.timestamp <= until)
    }
  }

  // Filter out excluded events, admin URLs, and custom exclusions
  const excludedFpSet = new Set(excludedFps)
  events = events.filter((e) => {
    if (!includeExcluded && (e.is_excluded || (e.fingerprint && excludedFpSet.has(e.fingerprint)))) return false
    if (excludeAdmin && isAdminUrl(e.url)) return false
    if (e.fingerprint && excludeFps.has(e.fingerprint)) return false
    if (excludePages.some(p => e.url && e.url.startsWith(p))) return false
    return true
  })

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

  // 2. UTM Sources, Campaigns & Mediums breakdown with conversions
  const utmMap = new Map<string, { count: number; conversions: number }>()
  const campaignMap = new Map<string, { count: number; conversions: number }>()
  const mediumMap = new Map<string, number>()

  // 3. Google Queries
  const queryMap = new Map<string, { count: number; landingPage: string }>()
  // 4. Source Types
  const sourceBreakdownMap = new Map<string, number>()
  // 5. Landing Pages
  const landingPageMap = new Map<string, number>()

  for (const s of allSessions) {
    const isConverted = (s.tap_count > 0 && s.duration_sec >= 15) ||
      (s.journey_steps && s.journey_steps.some(st => st.type === 'conversion'))

    // UTM Source
    if (s.utm_source) {
      const src = s.utm_source.toLowerCase().trim()
      const existing = utmMap.get(src) || { count: 0, conversions: 0 }
      existing.count++
      if (isConverted) existing.conversions++
      utmMap.set(src, existing)
    }
    // UTM Campaign
    if (s.utm_campaign) {
      const c = s.utm_campaign.toLowerCase().trim()
      const existing = campaignMap.get(c) || { count: 0, conversions: 0 }
      existing.count++
      if (isConverted) existing.conversions++
      campaignMap.set(c, existing)
    }
    // UTM Medium
    if (s.utm_medium) {
      const m = s.utm_medium.toLowerCase().trim()
      mediumMap.set(m, (mediumMap.get(m) || 0) + 1)
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

    // Landing page (skip admin pages)
    if (s.pages && s.pages.length > 0) {
      const landing = s.pages[0]
      if (!excludeAdmin || !isAdminUrl(landing)) {
        landingPageMap.set(landing, (landingPageMap.get(landing) || 0) + 1)
      }
    }
  }

  const utmSources = Array.from(utmMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      conversions: data.conversions,
      percentage: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const utmCampaigns = Array.from(campaignMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      conversions: data.conversions,
      percentage: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const utmMediums = Array.from(mediumMap.entries())
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

  // 6. Page Flows & Top Click Targets
  const flowMap = new Map<string, number>()
  const sessionPageSequence = new Map<string, Array<{ url: string; time: number }>>()
  const targetClickMap = new Map<string, { label: string; count: number }>()

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
    } else if (ev.event_name === 'tap_heat') {
      const tid = ev.properties?.target_id || 'عنصر نامشخص'
      const label = ev.properties?.target_label || tid
      const existing = targetClickMap.get(tid) || { label, count: 0 }
      existing.count++
      targetClickMap.set(tid, existing)
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

  const topClickedTargets = Array.from(targetClickMap.entries())
    .map(([target_id, data]) => ({
      target_id,
      label: data.label,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Calculate transitions
  for (const [_, seq] of sessionPageSequence.entries()) {
    seq.sort((a, b) => a.time - b.time)
    for (let i = 0; i < seq.length - 1; i++) {
      const from = seq[i].url
      const to = seq[i + 1].url
      if (from !== to) {
        if (excludeAdmin && (isAdminUrl(from) || isAdminUrl(to))) continue
        if (excludePages.some(p => from.startsWith(p) || to.startsWith(p))) continue

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

  // 7. Dynamic Timeline Data for charts
  const range = opts.timeRange || '24h'
  let hourlyTimeline: Array<{ hour: string; timestamp: string; pageviews: number; sessions: number }> = []

  if (range === '1h') {
    const timelineMap = new Map<string, { pageviews: number; sessionIds: Set<string>; hourStr: string }>()
    const now = Date.now()
    for (let m = 11; m >= 0; m--) {
      const d = new Date(now - m * 5 * 60 * 1000)
      const label = d.getHours().toString().padStart(2, '0') + ':' + (Math.floor(d.getMinutes() / 5) * 5).toString().padStart(2, '0')
      const key = d.toISOString().slice(0, 15)
      timelineMap.set(key, { pageviews: 0, sessionIds: new Set(), hourStr: label })
    }
    for (const ev of events) {
      const k = ev.timestamp.slice(0, 15)
      if (timelineMap.has(k)) {
        const bucket = timelineMap.get(k)!
        if (ev.event_name === 'page_view') bucket.pageviews++
        bucket.sessionIds.add(ev.session_id)
      }
    }
    hourlyTimeline = Array.from(timelineMap.values()).map(v => ({
      hour: v.hourStr,
      timestamp: v.hourStr,
      pageviews: v.pageviews,
      sessions: v.sessionIds.size
    }))
  } else if (range === '7d') {
    const timelineMap = new Map<string, { pageviews: number; sessionIds: Set<string>; hourStr: string }>()
    const now = Date.now()
    for (let dIdx = 6; dIdx >= 0; dIdx--) {
      const d = new Date(now - dIdx * 86400 * 1000)
      const dayKey = d.toISOString().slice(0, 10)
      const weekdayFa = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d)
      timelineMap.set(dayKey, { pageviews: 0, sessionIds: new Set(), hourStr: weekdayFa })
    }
    for (const ev of events) {
      const k = ev.timestamp.slice(0, 10)
      if (timelineMap.has(k)) {
        const bucket = timelineMap.get(k)!
        if (ev.event_name === 'page_view') bucket.pageviews++
        bucket.sessionIds.add(ev.session_id)
      }
    }
    hourlyTimeline = Array.from(timelineMap.values()).map(v => ({
      hour: v.hourStr,
      timestamp: v.hourStr,
      pageviews: v.pageviews,
      sessions: v.sessionIds.size
    }))
  } else if (range === '30d' || range === '90d' || range === 'all') {
    const timelineMap = new Map<string, { pageviews: number; sessionIds: Set<string>; hourStr: string }>()
    let daysCount = range === '30d' ? 30 : range === '90d' ? 90 : 14

    if (range === 'all' && events.length > 0) {
      const timestamps = events.map(e => new Date(e.timestamp).getTime()).filter(t => !isNaN(t))
      if (timestamps.length > 0) {
        const minT = Math.min(...timestamps)
        const maxT = Math.max(...timestamps, Date.now())
        daysCount = Math.min(60, Math.max(7, Math.ceil((maxT - minT) / (86400 * 1000)) + 1))
      }
    }

    const now = Date.now()
    for (let dIdx = daysCount - 1; dIdx >= 0; dIdx--) {
      const d = new Date(now - dIdx * 86400 * 1000)
      const dayKey = d.toISOString().slice(0, 10)
      const dayLabel = new Intl.DateTimeFormat('fa-IR', { month: 'numeric', day: 'numeric' }).format(d)
      timelineMap.set(dayKey, { pageviews: 0, sessionIds: new Set(), hourStr: dayLabel })
    }
    for (const ev of events) {
      const k = ev.timestamp.slice(0, 10)
      if (timelineMap.has(k)) {
        const bucket = timelineMap.get(k)!
        if (ev.event_name === 'page_view') bucket.pageviews++
        bucket.sessionIds.add(ev.session_id)
      }
    }
    hourlyTimeline = Array.from(timelineMap.values()).map(v => ({
      hour: v.hourStr,
      timestamp: v.hourStr,
      pageviews: v.pageviews,
      sessions: v.sessionIds.size
    }))
  } else {
    // 24 hours
    const timelineMap = new Map<string, { pageviews: number; sessionIds: Set<string>; hourStr: string }>()
    const now = Date.now()
    for (let h = 23; h >= 0; h--) {
      const d = new Date(now - h * 3600 * 1000)
      const hourLabel = d.getHours().toString().padStart(2, '0') + ':00'
      const key = d.toISOString().slice(0, 13)
      timelineMap.set(key, { pageviews: 0, sessionIds: new Set(), hourStr: hourLabel })
    }
    for (const ev of events) {
      const k = ev.timestamp.slice(0, 13)
      if (timelineMap.has(k)) {
        const bucket = timelineMap.get(k)!
        if (ev.event_name === 'page_view') bucket.pageviews++
        bucket.sessionIds.add(ev.session_id)
      }
    }
    hourlyTimeline = Array.from(timelineMap.values()).map(v => ({
      hour: v.hourStr,
      timestamp: v.hourStr,
      pageviews: v.pageviews,
      sessions: v.sessionIds.size
    }))
  }

  // Device, Browser, Region breakdowns from sessions
  const deviceCounts = new Map<string, { count: number; icon: string }>()
  const browserCounts = new Map<string, { count: number; icon: string }>()
  const regionCounts = new Map<string, number>()

  for (const s of allSessions) {
    const devName = s.device?.name || (s.device_type === 'mobile' ? 'گوشی هوشمند' : 'رایانه رومیزی')
    const devIcon = s.device?.icon || (s.device_type === 'mobile' ? 'android' : 'desktop')
    const dObj = deviceCounts.get(devName) || { count: 0, icon: devIcon }
    dObj.count++
    deviceCounts.set(devName, dObj)

    const brName = s.browser?.name || 'مرورگر وب'
    const brIcon = s.browser?.icon || 'chrome'
    const bObj = browserCounts.get(brName) || { count: 0, icon: brIcon }
    bObj.count++
    browserCounts.set(brName, bObj)

    const regName = s.region || 'ایران'
    regionCounts.set(regName, (regionCounts.get(regName) || 0) + 1)
  }

  const deviceBreakdown = Array.from(deviceCounts.entries())
    .map(([device, data]) => ({
      device,
      count: data.count,
      icon: data.icon,
      percentage: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const browserBreakdown = Array.from(browserCounts.entries())
    .map(([browser, data]) => ({
      browser,
      count: data.count,
      icon: data.icon,
      percentage: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  const regionBreakdown = Array.from(regionCounts.entries())
    .map(([region, count]) => ({
      region,
      count,
      percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  let earliestDate: string | undefined
  let latestDate: string | undefined
  let totalHistoricalSessions = totalSessions

  if (sqliteDb) {
    try {
      const minMax = sqliteDb.prepare('SELECT MIN(timestamp) as min_ts, MAX(timestamp) as max_ts, COUNT(DISTINCT session_id) as total_s FROM analytics_events').get()
      if (minMax) {
        earliestDate = minMax.min_ts || undefined
        latestDate = minMax.max_ts || undefined
        if (minMax.total_s) totalHistoricalSessions = minMax.total_s
      }
    } catch {}
  }

  return {
    total_sessions: totalSessions,
    total_pageviews: totalPageviews,
    total_events: events.length,
    avg_duration_sec: avgDurationSec,
    bounce_rate_pct: bounceRatePct,
    time_range: range,
    since: cutoff || undefined,
    until: until || undefined,
    total_historical_sessions: totalHistoricalSessions,
    earliest_event_date: earliestDate,
    latest_event_date: latestDate,
    utm_sources: utmSources,
    utm_campaigns: utmCampaigns,
    utm_mediums: utmMediums,
    google_queries: googleQueries,
    source_breakdown: sourceBreakdown,
    device_breakdown: deviceBreakdown,
    browser_breakdown: browserBreakdown,
    region_breakdown: regionBreakdown,
    page_flows: pageFlows,
    top_landing_pages: topLandingPages,
    hourly_timeline: hourlyTimeline,
    top_clicked_targets: topClickedTargets,
    debounce_stats: {
      total_debounced_scrolls: debouncedScrollsCount,
      avg_dwell_before_stop: dwellEventsCount > 0 ? Math.round((totalDwellSecBeforeStop / dwellEventsCount) * 10) / 10 : 0,
      hesitations: hesitationsCount
    },
    excluded_fingerprints: excludedFps
  }
}

/**
 * Get real-time stats of active visitors within the last N minutes
 */
export function getLiveRealTimeStats(minutes = 15, excludeAdmin = true): LiveRealTimeStats {
  initDb()
  const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString()
  const excludedFps = new Set(getExcludedFingerprints())

  let recentEvents: StoredAnalyticsEvent[] = []
  if (sqliteDb) {
    try {
      const query = `
        SELECT * FROM analytics_events
        WHERE timestamp >= ?
        ORDER BY timestamp DESC
        LIMIT 500
      `
      const rows = sqliteDb.prepare(query).all(cutoff)
      recentEvents = rows.map((r: any) => ({
        id: r.id,
        event_name: r.event_name,
        session_id: r.session_id,
        timestamp: r.timestamp,
        url: r.url,
        referrer: r.referrer,
        ip_hash: r.ip_hash,
        ip: r.ip || null,
        region: r.region || null,
        user_agent: r.user_agent,
        fingerprint: r.fingerprint || null,
        is_excluded: Boolean(r.is_excluded),
        properties: typeof r.properties === 'string' ? JSON.parse(r.properties || '{}') : (r.properties || {})
      }))
    } catch (err) {
      recentEvents = fallbackMemoryEvents.filter(e => e.timestamp >= cutoff)
    }
  } else {
    recentEvents = fallbackMemoryEvents.filter(e => e.timestamp >= cutoff)
  }

  // Filter exclusions and admin
  recentEvents = recentEvents.filter(e => {
    if (e.is_excluded || (e.fingerprint && excludedFps.has(e.fingerprint))) return false
    if (excludeAdmin && isAdminUrl(e.url)) return false
    return true
  })

  // Get active sessions
  const activeSessions = getSessionList({
    limit: 50,
    includeExcluded: false,
    excludeAdmin,
    since: cutoff
  })

  // Group pages where visitors currently are
  const pageMap = new Map<string, number>()
  for (const s of activeSessions) {
    if (s.pages && s.pages.length > 0) {
      const current = s.pages[s.pages.length - 1]
      pageMap.set(current, (pageMap.get(current) || 0) + 1)
    }
  }

  const activePages = Array.from(pageMap.entries())
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)

  const liveEvents = recentEvents.slice(0, 40).map(e => ({
    id: e.id,
    event_name: e.event_name,
    session_id: e.session_id,
    timestamp: e.timestamp,
    url: e.url,
    label: e.properties?.target_label || e.properties?.title || undefined,
    fingerprint: e.fingerprint || undefined,
    ip: e.ip || undefined,
    region: e.region || undefined,
    user_agent: e.user_agent || undefined
  }))

  return {
    active_visitors: activeSessions.length,
    active_sessions: activeSessions,
    live_events: liveEvents,
    active_pages: activePages,
    timestamp: new Date().toISOString()
  }
}
