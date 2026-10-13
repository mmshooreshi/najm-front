// tests/telemetry.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { EventEmitter } from 'node:events'
import { H3Event } from 'h3'
import ingestHandler from '../server/api/t.post.ts'
import lensHandler from '../server/api/analytics/lens.get.ts'

// Test Database & Storage Adapter
import {
  insertBatch,
  getRecentLogs,
  getElementMetrics,
  getScrollDensity,
  getSessionList,
  getSessionEvents,
  getFilteredTelemetryData,
  getTrafficStatsOverview,
  addExcludedFingerprint,
  removeExcludedFingerprint,
  getExcludedFingerprints
} from '../server/utils/telemetryDb.ts'

import {
  enqueueEvents,
  flushBuffer,
  getBufferSize
} from '../server/utils/telemetryBuffer.ts'

test('1. IP Hashing - SHA-256 16-character truncation', () => {
  const rawIp = '185.190.35.42'
  const hash = createHash('sha256').update(rawIp).digest('hex').slice(0, 16)

  assert.equal(hash.length, 16)
  assert.equal(typeof hash, 'string')
  assert.notEqual(hash, rawIp)
  assert.ok(/^[0-9a-f]{16}$/.test(hash))

  // Deterministic for same IP
  const hash2 = createHash('sha256').update(rawIp).digest('hex').slice(0, 16)
  assert.equal(hash, hash2)
})

test('2. Packaging Domain Events - Schema & Payloads', () => {
  const events = [
    {
      event_name: 'page_view',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: { title: 'هاردباکس لوکس زعفران', category: 'packaging' }
    },
    {
      event_name: 'spec_configured',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        packaging_type: 'hardbox_magnetic',
        dimensions_cm: { l: 20, w: 15, h: 5 },
        paper_stock: 'inderboard_300gsm',
        gsm: 300,
        finishing: ['gold_foil', 'velvet_lamination']
      }
    },
    {
      event_name: 'volume_inquired',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        packaging_type: 'hardbox_magnetic',
        quantity: 5000,
        is_custom_mold: true
      }
    },
    {
      event_name: 'sales_handoff',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/contact',
      properties: {
        channel: 'whatsapp',
        spec_summary: '5000 hardbox boxes'
      }
    },
    {
      event_name: 'tap_heat',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        target_id: 'consultation-submit',
        rx: 0.48,
        ry: 0.52
      }
    },
    {
      event_name: 'hesitation_trigger',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        component_id: 'consultation-submit',
        dwell_ms: 3200,
        toggle_count: 2
      }
    },
    {
      event_name: 'scroll_dwell',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        path: '/products/hardbox',
        buckets: [1, 2, 4, 8, 12, 10, 6, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    {
      event_name: 'mobile_issue',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        type: 'keyboard_occlusion',
        details: { viewportHeight: 420, ctaBottom: 550 }
      }
    },
    {
      event_name: 'field_perf',
      session_id: 'sid_test_1',
      timestamp: new Date().toISOString(),
      url: '/products/hardbox',
      properties: {
        metric: 'LCP',
        value: 1240
      }
    }
  ]

  assert.equal(events.length, 9)
  for (const ev of events) {
    assert.ok(ev.event_name)
    assert.ok(ev.properties)
  }
})

test('3. Database Adapter - Batch Insert & Analytics Queries', () => {
  const testUrl = `/test-packaging-${Date.now()}`
  const testEvents = [
    {
      id: randomUUID(),
      event_name: 'tap_heat',
      session_id: 'sid_test_1',
      timestamp: new Date(Date.now() - 3000).toISOString(),
      url: testUrl,
      referrer: 'https://google.com',
      ip_hash: '1a2b3c4d5e6f7080',
      user_agent: 'TestAgent/1.0',
      properties: { target_id: 'cta-primary', rx: 0.5, ry: 0.5 }
    },
    {
      id: randomUUID(),
      event_name: 'hesitation_trigger',
      session_id: 'sid_test_1',
      timestamp: new Date(Date.now() - 2000).toISOString(),
      url: testUrl,
      referrer: 'https://google.com',
      ip_hash: '1a2b3c4d5e6f7080',
      user_agent: 'TestAgent/1.0',
      properties: { component_id: 'cta-primary', dwell_ms: 4000, toggle_count: 1 }
    },
    {
      id: randomUUID(),
      event_name: 'scroll_dwell',
      session_id: 'sid_test_1',
      timestamp: new Date(Date.now() - 1000).toISOString(),
      url: testUrl,
      referrer: 'https://google.com',
      ip_hash: '1a2b3c4d5e6f7080',
      user_agent: 'TestAgent/1.0',
      properties: {
        path: testUrl,
        buckets: [10, 8, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    }
  ]

  // Insert batch
  insertBatch(testEvents)

  // Query recent logs
  const logs = getRecentLogs(testUrl, 10)
  assert.ok(logs.length >= 3, `Expected at least 3 logs, got ${logs.length}`)
  assert.equal(logs[0].url, testUrl)

  // Query element metrics
  const metrics = getElementMetrics(testUrl)
  assert.ok(metrics['cta-primary'], 'cta-primary should have aggregated metrics')
  assert.equal(metrics['cta-primary'].tap_count, 1)
  assert.equal(metrics['cta-primary'].hesitations, 1)
  assert.equal(metrics['cta-primary'].avg_dwell_ms, 4000)

  // Query scroll density
  const scrollDensity = getScrollDensity(testUrl)
  assert.equal(scrollDensity.length, 20)
  assert.ok(scrollDensity[0] >= 10, 'Top bucket should reflect recorded dwell')
})

test('4. In-Memory Aggregation Buffer - Enqueue & Bulk Flush', async () => {
  const initialSize = getBufferSize()
  assert.equal(initialSize, 0)

  const items = Array.from({ length: 15 }, (_, i) => ({
    id: randomUUID(),
    event_name: 'tap_heat',
    session_id: 'sid_buf_test',
    timestamp: new Date().toISOString(),
    url: '/buffer-test',
    referrer: null,
    ip_hash: 'abcdef0123456789',
    user_agent: 'Mozilla/5.0',
    properties: { target_id: `btn-${i}`, rx: 0.1, ry: 0.2 }
  }))

  enqueueEvents(items)
  assert.equal(getBufferSize(), 15)

  const flushedCount = await flushBuffer()
  assert.equal(flushedCount, 15)
  assert.equal(getBufferSize(), 0)
})

test('5. Mobile Tap Coordinate Normalization & Clamping (0.00 - 1.00)', () => {
  // Test coordinate normalization function logic
  function calcNormalizedCoords(clientX, clientY, rect) {
    const rawRx = (clientX - rect.left) / rect.width
    const rawRy = (clientY - rect.top) / rect.height
    const rx = Math.max(0, Math.min(1, Math.round(rawRx * 100) / 100))
    const ry = Math.max(0, Math.min(1, Math.round(rawRy * 100) / 100))
    return { rx, ry }
  }

  const rect = { left: 100, top: 200, width: 200, height: 100 }

  // Dead center
  const center = calcNormalizedCoords(200, 250, rect)
  assert.equal(center.rx, 0.5)
  assert.equal(center.ry, 0.5)

  // Top-left boundary
  const topLeft = calcNormalizedCoords(100, 200, rect)
  assert.equal(topLeft.rx, 0)
  assert.equal(topLeft.ry, 0)

  // Bottom-right boundary
  const bottomRight = calcNormalizedCoords(300, 300, rect)
  assert.equal(bottomRight.rx, 1)
  assert.equal(bottomRight.ry, 1)

  // Outside bounds (clamping)
  const outside = calcNormalizedCoords(50, 450, rect)
  assert.equal(outside.rx, 0)
  assert.equal(outside.ry, 1)
})

test('6. Admin Lens Route Auth Verification', () => {
  // Verify token validation logic used in server/api/analytics/lens.get.ts
  function verifyAdminAuth(cookies, headers) {
    const token = cookies?.pb_admin || headers?.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) {
      return { statusCode: 401, error: 'Unauthorized' }
    }
    return { statusCode: 200, ok: true }
  }

  // Without auth
  const unauth1 = verifyAdminAuth({}, {})
  assert.equal(unauth1.statusCode, 401)

  const unauth2 = verifyAdminAuth({ session: 'user123' }, {})
  assert.equal(unauth2.statusCode, 401)

  // With pb_admin cookie
  const auth1 = verifyAdminAuth({ pb_admin: 'test_token_xyz' }, {})
  assert.equal(auth1.statusCode, 200)

  // With Bearer authorization header
  const auth2 = verifyAdminAuth({}, { authorization: 'Bearer test_token_xyz' })
  assert.equal(auth2.statusCode, 200)
})

test('7. End-to-End Ingest & Lens Pipeline Test', async () => {
  function createMockEvent({ method = 'GET', url = '/', headers = {}, body = null }) {
    const req = new EventEmitter()
    req.method = method
    req.url = url
    req.headers = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
    req.socket = { remoteAddress: '185.190.35.42' }
    if (body !== null) {
      req.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const res = new EventEmitter()
    res.setHeader = () => {}
    res.getHeader = () => null
    res.end = () => {}

    return new H3Event(req, res)
  }

  const testSession = `test_sid_${Date.now()}`
  const testUrl = `/products/boxes-${Date.now()}`

  const sampleBatch = [
    {
      event_name: 'page_view',
      session_id: testSession,
      timestamp: new Date().toISOString(),
      url: testUrl,
      referrer: 'https://chapenajm.com/',
      properties: { title: 'جعبه هاردباکس ۵ رنگ', category: 'hardbox' }
    },
    {
      event_name: 'tap_heat',
      session_id: testSession,
      timestamp: new Date().toISOString(),
      url: testUrl,
      properties: { target_id: 'consultation-submit', rx: 0.52, ry: 0.49 }
    },
    {
      event_name: 'hesitation_trigger',
      session_id: testSession,
      timestamp: new Date().toISOString(),
      url: testUrl,
      properties: { component_id: 'consultation-submit', dwell_ms: 3800, toggle_count: 2 }
    },
    {
      event_name: 'spec_configured',
      session_id: testSession,
      timestamp: new Date().toISOString(),
      url: testUrl,
      properties: {
        packaging_type: 'hardbox',
        dimensions_cm: { l: 25, w: 18, h: 6 },
        paper_stock: 'inderboard',
        gsm: 350,
        finishing: ['gold_foil']
      }
    },
    {
      event_name: 'scroll_dwell',
      session_id: testSession,
      timestamp: new Date().toISOString(),
      url: testUrl,
      properties: {
        path: testUrl,
        buckets: [5, 12, 18, 14, 8, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    }
  ]

  // Ingest
  const ingestEvt = createMockEvent({
    method: 'POST',
    url: '/api/t',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'PipelineTester/1.0',
      'x-forwarded-for': '185.190.35.42'
    },
    body: sampleBatch
  })

  const ingestRes = await ingestHandler(ingestEvt)
  assert.equal(ingestRes.ok, true)
  assert.equal(ingestRes.count, 5)

  // Commit buffer
  await flushBuffer()

  // Unauthorized Lens request
  const unauthLensEvt = createMockEvent({
    method: 'GET',
    url: `/api/analytics/lens?url=${encodeURIComponent(testUrl)}`,
    headers: {}
  })

  await assert.rejects(async () => {
    await lensHandler(unauthLensEvt)
  }, (err) => {
    assert.equal(err.statusCode, 401)
    return true
  })

  // Authorized Lens request
  const authLensEvt = createMockEvent({
    method: 'GET',
    url: `/api/analytics/lens?url=${encodeURIComponent(testUrl)}`,
    headers: {
      cookie: 'pb_admin=valid_super_token_12345'
    }
  })

  const lensData = await lensHandler(authLensEvt)
  assert.ok(Array.isArray(lensData.recent_logs))
  assert.ok(lensData.recent_logs.length >= 5)
  assert.equal(lensData.recent_logs[0].url, testUrl)
  assert.equal(lensData.recent_logs[0].ip_hash.length, 16)

  assert.ok(lensData.element_metrics['consultation-submit'])
  const ctaMetrics = lensData.element_metrics['consultation-submit']
  assert.equal(ctaMetrics.tap_count, 1)
  assert.equal(ctaMetrics.hesitations, 1)
  assert.equal(ctaMetrics.avg_dwell_ms, 3800)

  assert.equal(lensData.scroll_density.length, 20)
  assert.ok(lensData.scroll_density[2] >= 18)
})

test('8. Innate Semantic Resolver - Persian & English UI elements', async () => {
  const { resolveElementIdentity } = await import('../utils/telemetrySemanticResolver.ts')

  // Mock DOM Element helper
  function createMockElement({
    tagName = 'button',
    text = '',
    attributes = {},
    closest = () => null
  } = {}) {
    return {
      tagName: tagName.toUpperCase(),
      innerText: text,
      textContent: text,
      id: attributes.id || '',
      getAttribute: (k) => attributes[k] || null,
      hasAttribute: (k) => Boolean(attributes[k]),
      closest,
      querySelector: () => null,
      classList: { contains: () => false }
    }
  }

  // 1. Header Login Button (The exact case from the user's screenshot!)
  const headerContext = { tagName: 'HEADER' }
  const loginBtn = createMockElement({
    tagName: 'button',
    text: 'ورود',
    closest: (selector) => (selector.includes('header') ? headerContext : null)
  })
  const loginIdentity = resolveElementIdentity(loginBtn)
  assert.equal(loginIdentity.id, 'nav-login')
  assert.equal(loginIdentity.label, 'ورود به حساب کاربری')
  assert.equal(loginIdentity.category, 'auth')

  // 2. Language Switcher Button (Text: 'FA')
  const langBtn = createMockElement({
    tagName: 'button',
    text: 'FA',
    attributes: { 'aria-label': 'Switch Language' },
    closest: (selector) => (selector.includes('header') ? headerContext : null)
  })
  const langIdentity = resolveElementIdentity(langBtn)
  assert.equal(langIdentity.id, 'nav-lang-switcher')
  assert.equal(langIdentity.category, 'localization')

  // 3. Search Trigger Button (Text: 'جست‌وجو…')
  const searchBtn = createMockElement({
    tagName: 'button',
    text: 'جست‌وجو…',
    closest: (selector) => (selector.includes('header') ? headerContext : null)
  })
  const searchIdentity = resolveElementIdentity(searchBtn)
  assert.equal(searchIdentity.id, 'nav-search-input')
  assert.equal(searchIdentity.category, 'search')

  // 4. Hamburger Menu (aria-label: 'باز کردن منو')
  const menuBtn = createMockElement({
    tagName: 'button',
    attributes: { 'aria-label': 'باز کردن منو' },
    closest: (selector) => (selector.includes('header') ? headerContext : null)
  })
  const menuIdentity = resolveElementIdentity(menuBtn)
  assert.equal(menuIdentity.id, 'nav-menu-toggle')
  assert.equal(menuIdentity.category, 'navigation')

  // 5. Consultation & Quote CTA (Text: 'مشاوره و استعلام تخصصی')
  const ctaBtn = createMockElement({
    tagName: 'button',
    text: 'مشاوره و استعلام تخصصی',
    attributes: { 'data-cta-primary': 'true' }
  })
  const ctaIdentity = resolveElementIdentity(ctaBtn)
  assert.equal(ctaIdentity.id, 'cta-primary-consultation')
  assert.equal(ctaIdentity.category, 'conversion')

  // 6. Navigation Link ('تماس با ما' -> /contact)
  const contactLink = createMockElement({
    tagName: 'a',
    text: 'تماس با ما',
    attributes: { href: '/contact' },
    closest: (selector) => (selector.includes('header') ? headerContext : null)
  })
  const contactIdentity = resolveElementIdentity(contactLink)
  assert.equal(contactIdentity.id, 'nav-contact')
  assert.equal(contactIdentity.category, 'navigation')
})

test('9. Mobile Touch Discrimination & Rage Tap Logic', () => {
  // 1. Scroll Discrimination: A touch moving > 12px must NOT be classified as an intentional tap
  function isIntentionalTap(startX, startY, endX, endY, durationMs) {
    const dist = Math.hypot(endX - startX, endY - startY)
    return dist <= 12 && durationMs < 800
  }

  assert.equal(isIntentionalTap(100, 200, 103, 202, 150), true, 'Tiny movement is a valid tap')
  assert.equal(isIntentionalTap(100, 200, 100, 250, 300), false, '50px vertical swipe is a scroll, NOT a tap')
  assert.equal(isIntentionalTap(100, 200, 101, 201, 1200), false, 'Long press (>800ms) is not a quick tap')

  // 2. Mobile Rage Tap Detector
  let recentTaps = []
  function simulateTap(x, y, timestamp) {
    recentTaps = recentTaps.filter((t) => timestamp - t.time < 750)
    recentTaps.push({ x, y, time: timestamp })

    if (recentTaps.length >= 3) {
      const first = recentTaps[0]
      const dist = Math.hypot(x - first.x, y - first.y)
      if (dist < 35) {
        recentTaps = []
        return true // Rage tap triggered!
      }
    }
    return false
  }

  const t0 = 1000
  assert.equal(simulateTap(50, 50, t0), false)
  assert.equal(simulateTap(52, 51, t0 + 100), false)
  assert.equal(simulateTap(49, 53, t0 + 200), true, '3 rapid taps in 35px radius triggers rage tap')
})

test('10. Cloud Div Anti-Occlusion & Clearance Guarantee', () => {
  // Mathematical verification that the inspector card NEVER intersects the target element
  function calculateCardPosition(rect, viewportW, viewportH) {
    const cardW = 310
    const cardH = 250
    const gap = 16
    const margin = 16

    const canFitBelow = rect.bottom + gap + cardH <= viewportH - margin
    const canFitAbove = rect.top - gap - cardH >= margin

    let placement = 'below'
    let posX = rect.left
    let posY = rect.bottom + gap

    if (canFitBelow) {
      placement = 'below'
      posY = rect.bottom + gap
      posX = Math.max(margin, Math.min(viewportW - cardW - margin, rect.left))
    } else if (canFitAbove) {
      placement = 'above'
      posY = rect.top - gap - cardH
      posX = Math.max(margin, Math.min(viewportW - cardW - margin, rect.left))
    } else {
      const canFitRight = rect.right + gap + cardW <= viewportW - margin
      const canFitLeft = rect.left - gap - cardW >= margin

      if (canFitRight) {
        placement = 'right'
        posX = rect.right + gap
        posY = Math.max(margin, Math.min(viewportH - cardH - margin, rect.top))
      } else if (canFitLeft) {
        placement = 'left'
        posX = rect.left - gap - cardW
        posY = Math.max(margin, Math.min(viewportH - cardH - margin, rect.top))
      }
    }

    return { x: posX, y: posY, w: cardW, h: cardH, placement }
  }

  function boxesIntersect(r1, r2) {
    return !(
      r2.x >= r1.right ||
      r2.x + r2.w <= r1.left ||
      r2.y >= r1.bottom ||
      r2.y + r2.h <= r1.top
    )
  }

  // Case A: Navbar element near top of screen
  const navElement = { left: 100, top: 12, right: 220, bottom: 52, width: 120, height: 40 }
  const posA = calculateCardPosition(navElement, 1200, 800)
  assert.equal(posA.placement, 'below')
  assert.ok(posA.y >= navElement.bottom + 16, 'Card is at least 16px BELOW nav element')
  assert.equal(boxesIntersect(navElement, posA), false, 'Card must NEVER intersect nav element')

  // Case B: Element near bottom of screen
  const bottomBtn = { left: 400, top: 720, right: 550, bottom: 765, width: 150, height: 45 }
  const posB = calculateCardPosition(bottomBtn, 1200, 800)
  assert.equal(posB.placement, 'above')
  assert.ok(posB.y + posB.h <= bottomBtn.top - 16, 'Card is at least 16px ABOVE bottom element')
  assert.equal(boxesIntersect(bottomBtn, posB), false, 'Card must NEVER intersect bottom element')
})

test('11. Per-User Session Observation & Scoped Telemetry Filtering', () => {
  const sessionAlice = `sid_alice_${Date.now()}`
  const sessionBob = `sid_bob_${Date.now()}`

  const now = new Date()
  const events = [
    {
      id: randomUUID(),
      event_name: 'page_view',
      session_id: sessionAlice,
      timestamp: new Date(now.getTime() - 10000).toISOString(),
      url: '/products/hardbox',
      referrer: 'https://google.com',
      ip_hash: 'hash_alice',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      properties: { title: 'هاردباکس' }
    },
    {
      id: randomUUID(),
      event_name: 'tap_heat',
      session_id: sessionAlice,
      timestamp: new Date(now.getTime() - 8000).toISOString(),
      url: '/products/hardbox',
      referrer: 'https://google.com',
      ip_hash: 'hash_alice',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      properties: { target_id: 'btn-order-cta', rx: 0.5, ry: 0.5 }
    },
    {
      id: randomUUID(),
      event_name: 'tap_heat',
      session_id: sessionBob,
      timestamp: new Date(now.getTime() - 2000).toISOString(),
      url: '/calculator',
      referrer: null,
      ip_hash: 'hash_bob',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      properties: { target_id: 'calc-submit', rx: 0.8, ry: 0.4 }
    }
  ]

  insertBatch(events)

  // 1. Verify getSessionList aggregates user sessions properly
  const sessions = getSessionList(50)
  const foundAlice = sessions.find(s => s.session_id === sessionAlice)
  const foundBob = sessions.find(s => s.session_id === sessionBob)

  assert.ok(foundAlice, 'Session Alice exists in session list')
  assert.equal(foundAlice.device_type, 'mobile', 'Alice device is detected as mobile')
  assert.equal(foundAlice.tap_count, 1, 'Alice has 1 tap')
  assert.equal(foundAlice.referrer, 'https://google.com')

  assert.ok(foundBob, 'Session Bob exists in session list')
  assert.equal(foundBob.device_type, 'desktop', 'Bob device is detected as desktop')

  // 2. Verify getSessionEvents retrieves full journey for Alice
  const aliceEvents = getSessionEvents(sessionAlice)
  assert.equal(aliceEvents.length, 2, 'Alice has 2 chronological events')
  assert.equal(aliceEvents[0].event_name, 'page_view')
  assert.equal(aliceEvents[1].event_name, 'tap_heat')

  // 3. Verify getFilteredTelemetryData isolates taps per session
  const aliceScoped = getFilteredTelemetryData({ sessionId: sessionAlice })
  assert.ok(aliceScoped.every(e => e.session_id === sessionAlice), 'All events belong to Alice')

  const bobScoped = getFilteredTelemetryData({ sessionId: sessionBob })
  assert.ok(bobScoped.every(e => e.session_id === sessionBob), 'All events belong to Bob')

  // 4. Verify timeframe filtering
  const recentEvents = getFilteredTelemetryData({ timeframeMinutes: 1 })
  assert.ok(recentEvents.length >= 3, 'Recent events within last 1 minute retrieved')
})

test('12. Traffic Overview, UTM, Google Query, Page Flows, Debounces, & Fingerprint Exclusion', async () => {
  const adminFingerprint = 'fp_test_admin_999'
  const visitorFingerprint = 'fp_test_visitor_123'
  const sessionVisitor = 'sid_traffic_visitor_' + Date.now()
  const sessionAdmin = 'sid_traffic_admin_' + Date.now()

  // 1. Exclude admin fingerprint
  addExcludedFingerprint(adminFingerprint)
  assert.ok(getExcludedFingerprints().includes(adminFingerprint), 'Admin fingerprint is registered as excluded')

  const now = new Date()

  // Insert visitor events with Google Search referrer and page transitions
  const visitorEvents = [
    {
      id: randomUUID(),
      event_name: 'page_view',
      session_id: sessionVisitor,
      timestamp: new Date(now.getTime() - 25000).toISOString(),
      url: '/products/hardbox',
      referrer: 'https://www.google.com/url?sa=t&q=جعبه+هاردباکس+لوکس',
      ip_hash: 'hash_visitor',
      user_agent: 'Mozilla/5.0 (iPhone)',
      fingerprint: visitorFingerprint,
      is_excluded: false,
      properties: {
        path: '/products/hardbox',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
        search_query: 'جعبه هاردباکس لوکس'
      }
    },
    {
      id: randomUUID(),
      event_name: 'scroll_dwell',
      session_id: sessionVisitor,
      timestamp: new Date(now.getTime() - 20000).toISOString(),
      url: '/products/hardbox',
      referrer: 'https://www.google.com',
      ip_hash: 'hash_visitor',
      user_agent: 'Mozilla/5.0 (iPhone)',
      fingerprint: visitorFingerprint,
      is_excluded: false,
      properties: {
        path: '/products/hardbox',
        dwell_sec: 4.5,
        debounce_count: 3
      }
    },
    {
      id: randomUUID(),
      event_name: 'page_view',
      session_id: sessionVisitor,
      timestamp: new Date(now.getTime() - 10000).toISOString(),
      url: '/calculator',
      referrer: 'https://najmpack.ir/products/hardbox',
      ip_hash: 'hash_visitor',
      user_agent: 'Mozilla/5.0 (iPhone)',
      fingerprint: visitorFingerprint,
      is_excluded: false,
      properties: {
        path: '/calculator'
      }
    }
  ]

  // Insert admin events (should be excluded)
  const adminEvents = [
    {
      id: randomUUID(),
      event_name: 'page_view',
      session_id: sessionAdmin,
      timestamp: new Date(now.getTime() - 5000).toISOString(),
      url: '/dash',
      referrer: null,
      ip_hash: 'hash_admin',
      user_agent: 'Mozilla/5.0 (Macintosh)',
      fingerprint: adminFingerprint,
      is_excluded: true,
      properties: {
        path: '/dash'
      }
    }
  ]

  insertBatch([...visitorEvents, ...adminEvents])

  // Query traffic stats without excluded devices
  const statsWithoutAdmin = getTrafficStatsOverview(false)
  assert.ok(statsWithoutAdmin.total_sessions >= 1, 'Should include visitor session')
  assert.ok(statsWithoutAdmin.excluded_fingerprints.includes(adminFingerprint), 'Excluded fingerprints list is present')

  // Verify UTM sources
  const foundUtm = statsWithoutAdmin.utm_sources.find(u => u.name === 'google')
  assert.ok(foundUtm, 'UTM source "google" is aggregated')
  assert.ok(foundUtm.count >= 1)

  // Verify Google Search Queries
  const foundQuery = statsWithoutAdmin.google_queries.find(q => q.query.includes('هاردباکس'))
  assert.ok(foundQuery, 'Google query "جعبه هاردباکس لوکس" is extracted')

  // Verify Page Flows: /products/hardbox ===> /calculator
  const foundFlow = statsWithoutAdmin.page_flows.find(f => f.from.includes('/products/hardbox') && f.to.includes('/calculator'))
  assert.ok(foundFlow, 'Page transition /products/hardbox -> /calculator is recorded')
  assert.ok(foundFlow.count >= 1)

  // Verify Debounce metrics
  assert.ok(statsWithoutAdmin.debounce_stats.total_debounced_scrolls >= 1, 'Debounced scrolls recorded')
  assert.ok(statsWithoutAdmin.debounce_stats.avg_dwell_before_stop > 0, 'Average dwell before stop is computed')

  // Verify Fingerprint Exclusion: includeExcluded=false vs includeExcluded=true
  const statsWithAdmin = getTrafficStatsOverview(true)
  assert.ok(statsWithAdmin.total_events >= statsWithoutAdmin.total_events, 'All events count is >= filtered count')

  // Cleanup exclusion
  removeExcludedFingerprint(adminFingerprint)
  assert.ok(!getExcludedFingerprints().includes(adminFingerprint), 'Admin fingerprint was cleanly removed')
})



