// plugins/telemetry.client.ts
import { defineNuxtPlugin } from 'nuxt/app'
import { trackEvent, flushClientTelemetryQueue } from '~/composables/useTracker'
import { resolveElementIdentity, scanAndTagPage, scheduleIdleScanAndTag } from '~/utils/telemetrySemanticResolver'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return

  const router = nuxtApp.$router

  // User activity tracker for mobile battery conservation (pauses intervals when inactive > 30s)
  let lastUserActivity = Date.now()
  function recordActivity() {
    lastUserActivity = Date.now()
  }
  window.addEventListener('touchstart', recordActivity, { passive: true })
  window.addEventListener('scroll', recordActivity, { passive: true })
  window.addEventListener('pointerdown', recordActivity, { passive: true })

  // Extract UTM parameters and search engine queries from URL & Referrer
  function getTrafficSourceInfo() {
    if (typeof window === 'undefined') return {}
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const utm_source = urlParams.get('utm_source') || null
      const utm_medium = urlParams.get('utm_medium') || null
      const utm_campaign = urlParams.get('utm_campaign') || null
      const utm_term = urlParams.get('utm_term') || null
      const utm_content = urlParams.get('utm_content') || null

      let search_query = urlParams.get('q') || urlParams.get('query') || null

      // Check referrer for search queries (Google, Bing, Yahoo, Torob, Eemalls)
      const ref = document.referrer || ''
      if (ref && !search_query) {
        try {
          const refUrl = new URL(ref)
          const refParams = refUrl.searchParams
          search_query = refParams.get('q') || refParams.get('query') || refParams.get('text') || null
        } catch {}
      }

      return {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        search_query
      }
    } catch {
      return {}
    }
  }

  // Initial Page Load: Non-blocking idle tagging (0 impact on LCP/FCP/TBT)
  scheduleIdleScanAndTag(document, () => {
    const initialRoute = router.currentRoute?.value
    const category = (initialRoute?.meta?.category as string) || (initialRoute?.path?.split('/')[1]) || 'home'
    const traffic = getTrafficSourceInfo()
    trackEvent('page_view', {
      title: document.title || 'Chap-e Najm',
      category,
      ...traffic
    })
    refreshDwellObservers()
    checkHorizontalOverflow()
  })

  // Ambient DOM Mutation Observer: automatically tags newly mounted modals, drawers, components in idle time
  if (typeof MutationObserver !== 'undefined') {
    let scanTimeout: any = null
    const observer = new MutationObserver(() => {
      if (scanTimeout) return
      scanTimeout = setTimeout(() => {
        scanTimeout = null
        scheduleIdleScanAndTag(document.body, () => {
          refreshDwellObservers()
        })
      }, 350)
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  /* -------------------------------------------------------------
   * 1. Route Observer (page_view)
   * ------------------------------------------------------------- */
  router.afterEach((to) => {
    // Flush pending scroll dwell for previous route before resetting
    flushScrollDwell()

    // Run tagging and page_view non-blockingly during browser idle
    scheduleIdleScanAndTag(document, () => {
      const category = (to.meta?.category as string) || to.path.split('/')[1] || 'home'
      const traffic = getTrafficSourceInfo()
      trackEvent('page_view', {
        title: document.title || 'Chap-e Najm',
        category,
        ...traffic
      })
      refreshDwellObservers()
      checkHorizontalOverflow()
    })
  })

  /* -------------------------------------------------------------
   * 2. Unload / Freeze Safety
   * ------------------------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushScrollDwell()
      flushClientTelemetryQueue()
    }
  })

  window.addEventListener('pagehide', () => {
    flushScrollDwell()
    flushClientTelemetryQueue()
  })

  /* -------------------------------------------------------------
   * 3. Ambient Error Trap
   * ------------------------------------------------------------- */
  window.addEventListener('error', (event) => {
    trackEvent('ui_error', {
      error_message: event.message || 'Window script error',
      stack: event.error?.stack?.slice(0, 500)
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    trackEvent('ui_error', {
      error_message: String(reason?.message || reason || 'Unhandled promise rejection'),
      stack: reason?.stack?.slice(0, 500)
    })
  })

  /* -------------------------------------------------------------
   * 4. Web Vitals Observers (LCP, CLS)
   * ------------------------------------------------------------- */
  let lcpValue = 0
  let clsValue = 0

  if (typeof PerformanceObserver !== 'undefined') {
    // LCP
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          lcpValue = Math.round(lastEntry.startTime)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {}

    // CLS
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch {}

    // Flush Web Vitals on first route leave or pagehide
    const reportVitals = () => {
      if (lcpValue > 0) {
        trackEvent('field_perf', { metric: 'LCP', value: lcpValue })
        lcpValue = 0
      }
      if (clsValue > 0) {
        trackEvent('field_perf', { metric: 'CLS', value: Math.round(clsValue * 1000) / 1000 })
        clsValue = 0
      }
    }

    window.addEventListener('pagehide', reportVitals, { once: true })
  }

  /* -------------------------------------------------------------
   * 5. Target Tap Interceptor (Zero-INP, Scroll vs Tap Discrimination)
   * ------------------------------------------------------------- */
  // Mobile Rage Tap Tracker
  let recentTaps: Array<{ x: number; y: number; time: number }> = []
  function detectRageTap(clientX: number, clientY: number, targetEl: Element | null) {
    const now = Date.now()
    recentTaps = recentTaps.filter((t) => now - t.time < 750)
    recentTaps.push({ x: clientX, y: clientY, time: now })

    if (recentTaps.length >= 3) {
      const first = recentTaps[0]
      const dist = Math.hypot(clientX - first.x, clientY - first.y)
      if (dist < 35) {
        const el = (targetEl as HTMLElement)?.closest('button, a, input, [role="button"]') || targetEl
        const identity = el ? resolveElementIdentity(el as HTMLElement) : { id: 'rage_tap_zone' }
        trackEvent('hesitation_trigger', {
          component_id: identity.id,
          dwell_ms: 750,
          toggle_count: recentTaps.length
        })
        recentTaps = []
      }
    }
  }

  // Mobile Horizontal Layout Overflow Check (Detects page horizontal wobble)
  function checkHorizontalOverflow() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const screenWidth = window.innerWidth || document.documentElement.clientWidth
    const docWidth = document.documentElement.scrollWidth
    if (docWidth > screenWidth + 2) {
      trackEvent('mobile_issue', {
        type: 'horizontal_overflow',
        details: {
          overflow_px: docWidth - screenWidth,
          screenWidth,
          docWidth,
          path: window.location.pathname
        }
      })
    }
  }

  window.addEventListener('resize', () => {
    checkHorizontalOverflow()
  }, { passive: true })

  // Non-blocking tap processor scheduled via microtask/RAF to ensure 0ms INP delay
  function handleTap(clientX: number, clientY: number, targetEl: Element | null) {
    if (!targetEl) return

    // Defer DOM measurements and tracking out of the critical interaction frame
    queueMicrotask(() => {
      try {
        const trackedEl = targetEl.closest(
          '[data-track], button, a, input, select, textarea, [role="button"], [data-cta-primary], [v-editable]'
        ) as HTMLElement | null
        if (!trackedEl) return

        let targetId = trackedEl.getAttribute('data-track')
        if (!targetId) {
          const identity = resolveElementIdentity(trackedEl)
          targetId = identity.id
          trackedEl.setAttribute('data-track', identity.id)
          trackedEl.setAttribute('data-telemetry-label', identity.label)
          trackedEl.setAttribute('data-telemetry-cat', identity.category)
        }

        const rect = trackedEl.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return

        const rawRx = (clientX - rect.left) / rect.width
        const rawRy = (clientY - rect.top) / rect.height

        const rx = Math.max(0, Math.min(1, Math.round(rawRx * 100) / 100))
        const ry = Math.max(0, Math.min(1, Math.round(rawRy * 100) / 100))

        const pageX = Math.round(clientX + (window.scrollX || window.pageXOffset || 0))
        const pageY = Math.round(clientY + (window.scrollY || window.pageYOffset || 0))

        const targetLabel =
          trackedEl.getAttribute('data-telemetry-label') ||
          (trackedEl as HTMLInputElement).value ||
          (trackedEl as HTMLElement).innerText?.trim().slice(0, 50) ||
          targetId

        trackEvent('tap_heat', {
          target_id: targetId,
          target_label: targetLabel,
          rx,
          ry,
          page_x: pageX,
          page_y: pageY
        })
      } catch {}
    })
  }

  // Touch discrimination: Distinguish mobile scroll swipes from deliberate taps
  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        touchStartTime = Date.now()
      }
    },
    { passive: true }
  )

  window.addEventListener(
    'touchend',
    (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touch = e.changedTouches[0]
        const dist = Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY)
        const duration = Date.now() - touchStartTime

        // Strict scroll rejection: If the finger dragged > 12px or held > 800ms, it is a scroll gesture, NOT a tap
        if (dist <= 12 && duration < 800) {
          detectRageTap(touch.clientX, touch.clientY, e.target as Element)
          handleTap(touch.clientX, touch.clientY, e.target as Element)
        }
      }
    },
    { passive: true }
  )

  window.addEventListener(
    'click',
    (e) => {
      // Record desktop clicks on tracked targets
      if (e.isTrusted && (!e.pointerType || e.pointerType === 'mouse')) {
        detectRageTap(e.clientX, e.clientY, e.target as Element)
        handleTap(e.clientX, e.clientY, e.target as Element)
      }
    },
    { passive: true }
  )

  /* -------------------------------------------------------------
   * 6. Dwell Monitor & Hesitation Observer
   * ------------------------------------------------------------- */
  const enterTimes = new WeakMap<Element, number>()
  let dwellObserver: IntersectionObserver | null = null

  function initDwellObserver() {
    if (typeof IntersectionObserver === 'undefined') return

    dwellObserver = new IntersectionObserver(
      (entries) => {
        const now = Date.now()
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const componentId = el.getAttribute('data-track') || el.id || el.tagName.toLowerCase()

          if (entry.isIntersecting) {
            enterTimes.set(el, now)
          } else {
            const entered = enterTimes.get(el)
            if (entered) {
              const dwellMs = now - entered
              enterTimes.delete(el)

              // If visitor dwelled on an interactive packaging component for > 2.5s without converting
              if (dwellMs >= 2500) {
                trackEvent('hesitation_trigger', {
                  component_id: componentId,
                  dwell_ms: dwellMs,
                  toggle_count: 1
                })
              }
            }
          }
        }
      },
      { threshold: 0.5 }
    )
  }

  function refreshDwellObservers() {
    if (!dwellObserver) {
      initDwellObserver()
    }
    if (!dwellObserver) return

    document.querySelectorAll('[data-track]').forEach((el) => {
      dwellObserver?.observe(el)
    })
  }

  setTimeout(refreshDwellObservers, 500)

  /* -------------------------------------------------------------
   * 7. Virtual Keyboard Occlusion Observer
   * ------------------------------------------------------------- */
  if (typeof window !== 'undefined' && window.visualViewport) {
    const vv = window.visualViewport
    let prevHeight = vv.height

    vv.addEventListener('resize', () => {
      const activeEl = document.activeElement as HTMLElement | null
      const isInput =
        activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)

      // Significant viewport height decrease indicating keyboard deployment
      if (isInput && prevHeight - vv.height > 120) {
        const primaryCta = document.querySelector('[data-cta-primary]') as HTMLElement | null
        if (primaryCta) {
          const ctaRect = primaryCta.getBoundingClientRect()
          // Check if CTA is occluded below current visualViewport
          if (ctaRect.bottom > vv.height || ctaRect.top > vv.height) {
            trackEvent('mobile_issue', {
              type: 'keyboard_occlusion',
              details: {
                viewportHeight: Math.round(vv.height),
                ctaBottom: Math.round(ctaRect.bottom),
                inputName: (activeEl as HTMLInputElement).name || activeEl.id || activeEl.tagName
              }
            })
          }
        }
      }
      prevHeight = vv.height
    })
  }

  /* -------------------------------------------------------------
   * 8. Readability Pinch-Zoom Detector
   * ------------------------------------------------------------- */
  let touchStartDist = 0
  let pinchLogged = false

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        pinchLogged = false
      }
    },
    { passive: true }
  )

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 2 && touchStartDist > 0 && !pinchLogged) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        // Zooming in by 25%+ indicates text readability friction
        if (currentDist / touchStartDist > 1.25) {
          pinchLogged = true
          trackEvent('mobile_issue', {
            type: 'pinch_zoom',
            details: {
              ratio: Math.round((currentDist / touchStartDist) * 100) / 100,
              path: window.location.pathname
            }
          })
        }
      }
    },
    { passive: true }
  )

  /* -------------------------------------------------------------
   * 9. Vertical Scroll Attention & Real-Time Dwell Stop Tracker
   * ------------------------------------------------------------- */
  let scrollBins = new Array(20).fill(0)
  let lastBinIndex = 0
  let isScrolling = false
  let scrollEndTimeout: any = null
  let stoppedStartTime = Date.now()

  // Cached layout metrics to eliminate layout thrashing during scroll
  let cachedDocHeight = 2000
  let cachedViewHeight = 800
  let lastDimensionRefresh = 0

  function refreshLayoutMetrics() {
    if (typeof document === 'undefined') return
    cachedDocHeight = Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0,
      document.body?.offsetHeight || 0,
      document.documentElement?.offsetHeight || 0,
      1000
    )
    cachedViewHeight = window.innerHeight || 800
    lastDimensionRefresh = Date.now()
  }

  refreshLayoutMetrics()
  window.addEventListener('resize', refreshLayoutMetrics, { passive: true })

  function getScrollMetricsFast() {
    // Only recalculate dimensions on resize or every 10 seconds
    if (Date.now() - lastDimensionRefresh > 10000) {
      refreshLayoutMetrics()
    }
    const maxScroll = Math.max(1, cachedDocHeight - cachedViewHeight)
    const currentScroll = window.scrollY || window.pageYOffset || 0
    const scrollRatio = Math.max(0, Math.min(1, currentScroll / maxScroll))
    const currentBin = Math.min(19, Math.floor(scrollRatio * 20))
    const pct = Math.round(scrollRatio * 100)

    return { maxScroll, currentScroll, currentBin, pct }
  }

  // Active Reading/Dwell Heartbeat: Only runs when page is active, visible, and user is active within 30s
  setInterval(() => {
    if (typeof document === 'undefined' || document.visibilityState !== 'visible') return
    // Pause if user has been completely idle for > 30s to conserve mobile battery & CPU
    if (Date.now() - lastUserActivity > 30000) return
    const { currentBin } = getScrollMetricsFast()
    scrollBins[currentBin] += 1.0
    lastBinIndex = currentBin
  }, 1000)

  // Scroll Event Handler: Detects when user scrolls and when user STOPS scrolling (reading pause)
  window.addEventListener(
    'scroll',
    () => {
      isScrolling = true
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout)

      scrollEndTimeout = setTimeout(() => {
        // User has STOPPED scrolling
        isScrolling = false
        stoppedStartTime = Date.now()
        const { currentBin, pct } = getScrollMetricsFast()

        // Detect section or heading in view cleanly
        let nearestHeading = ''
        try {
          const midEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
          const sectionEl = midEl?.closest('section, article, [id], main > div')
          const headingEl = sectionEl?.querySelector('h1, h2, h3, [v-editable]')
          nearestHeading = headingEl?.textContent?.trim().slice(0, 40) || sectionEl?.id || ''
        } catch {}

        // Record a read stop if they stay paused for >= 1.5s
        setTimeout(() => {
          if (!isScrolling && document.visibilityState === 'visible') {
            const dwellSec = Math.round((Date.now() - stoppedStartTime) / 1000)
            if (dwellSec >= 1) {
              scrollBins[currentBin] += dwellSec
              trackEvent('scroll_dwell', {
                path: window.location.pathname,
                buckets: scrollBins.map((b) => Math.round(b * 10) / 10),
                stopped_at_pct: pct,
                dwell_sec: dwellSec,
                section: nearestHeading || `Depth ${pct}%`
              })
            }
          }
        }, 1500)
      }, 400)
    },
    { passive: true }
  )

  // Regular Real-Time Flush: Every 4 seconds, if there is accumulated dwell, stream it to HUD & API
  setInterval(() => {
    const totalDwell = scrollBins.reduce((a, b) => a + b, 0)
    if (totalDwell >= 3.0 && document.visibilityState === 'visible') {
      const { pct } = getScrollMetricsFast()
      trackEvent('scroll_dwell', {
        path: window.location.pathname,
        buckets: scrollBins.map((b) => Math.round(b * 10) / 10),
        stopped_at_pct: pct,
        dwell_sec: Math.round(totalDwell)
      })
      // Reset bins after flushing to prevent double-counting
      scrollBins = new Array(20).fill(0)
    }
  }, 4000)

  function flushScrollDwell() {
    const totalDwell = scrollBins.reduce((a, b) => a + b, 0)
    if (totalDwell >= 0.5) {
      const { pct } = getScrollMetricsFast()
      trackEvent('scroll_dwell', {
        path: window.location.pathname,
        buckets: scrollBins.map((b) => Math.round(b * 10) / 10),
        stopped_at_pct: pct,
        dwell_sec: Math.round(totalDwell)
      })
    }
    scrollBins = new Array(20).fill(0)
  }
})
