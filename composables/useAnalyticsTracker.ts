// composables/useAnalyticsTracker.ts
import { ref, onMounted } from 'vue'

const journey = ref<string[]>([])
const startTime = ref<number>(Date.now())
const currentProductContext = ref<string>('')

export function useAnalyticsTracker() {
  function recordStep(path: string, context?: string) {
    if (typeof window === 'undefined') return
    if (!journey.value.includes(path)) {
      journey.value.push(path)
    }
    if (context) {
      currentProductContext.value = context
    }
    try {
      sessionStorage.setItem('najm_journey', JSON.stringify(journey.value))
      if (context) sessionStorage.setItem('najm_product_context', context)
    } catch {}
  }

  function getAttribution() {
    if (typeof window === 'undefined') {
      return {
        path: '/',
        referer: '',
        device: 'Desktop',
        journey: ['/'],
        timeOnSite: '30s',
        productContext: ''
      }
    }

    const ua = navigator.userAgent
    let device = 'Desktop'
    if (/android/i.test(ua)) device = 'Android'
    else if (/iphone|ipad|ipod/i.test(ua)) device = 'iOS'
    else if (/mobile/i.test(ua)) device = 'Mobile'

    const elapsedSeconds = Math.max(5, Math.round((Date.now() - startTime.value) / 1000))
    const timeFormatted = elapsedSeconds < 60 ? `${elapsedSeconds} ثانیه` : `${Math.round(elapsedSeconds / 60)} دقیقه`

    return {
      path: window.location.pathname,
      referer: document.referrer || 'ورود مستقیم',
      device,
      journey: journey.value.length > 0 ? journey.value : [window.location.pathname],
      timeOnSite: timeFormatted,
      productContext: currentProductContext.value
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('najm_journey')
        if (stored) journey.value = JSON.parse(stored)
        const ctx = sessionStorage.getItem('najm_product_context')
        if (ctx) currentProductContext.value = ctx
      } catch {}
      recordStep(window.location.pathname)
    }
  })

  return {
    recordStep,
    getAttribution,
    currentProductContext
  }
}
