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
        referrerSource: 'Direct',
        referrerCategory: 'direct',
        locale: 'FA',
        isCardboardBoxesLanding: false,
        device: 'Desktop',
        journey: ['/'],
        timeOnSite: '30 ثانیه',
        productContext: ''
      }
    }

    const path = window.location.pathname
    const ref = document.referrer || ''
    const lowerRef = ref.toLowerCase()

    let referrerSource = 'ورود مستقیم'
    let referrerCategory = 'direct'

    if (lowerRef.includes('google.')) {
      if (lowerRef.includes('imgres') || lowerRef.includes('images.')) {
        referrerSource = 'گوگل ایمیج (Google Images)'
        referrerCategory = 'search_image'
      } else {
        referrerSource = 'جستجوی گوگل (Google SERP)'
        referrerCategory = 'search_organic'
      }
    } else if (lowerRef.includes('perplexity.ai')) {
      referrerSource = 'موتور هوش مصنوعی پرپلکسیتی (Perplexity AI)'
      referrerCategory = 'ai_answer'
    } else if (lowerRef.includes('chatgpt.com') || lowerRef.includes('chat.openai.com')) {
      referrerSource = 'چت‌جی‌پی‌تی (ChatGPT Search)'
      referrerCategory = 'ai_answer'
    } else if (lowerRef.includes('claude.ai')) {
      referrerSource = 'کلود (Claude AI)'
      referrerCategory = 'ai_answer'
    } else if (lowerRef.includes('torob.com')) {
      referrerSource = 'موتور جستجوی ترب (Torob)'
      referrerCategory = 'search_shopping'
    } else if (lowerRef.includes('instagram.com') || lowerRef.includes('t.me') || lowerRef.includes('linkedin.com')) {
      referrerSource = 'شبکه‌های اجتماعی'
      referrerCategory = 'social'
    } else if (ref) {
      try {
        referrerSource = new URL(ref).hostname
        referrerCategory = 'referral'
      } catch {
        referrerSource = ref
        referrerCategory = 'referral'
      }
    }

    const locale: 'FA' | 'EN' | 'AR' = path === '/en' || path.startsWith('/en/') ? 'EN' : (path === '/ar' || path.startsWith('/ar/') ? 'AR' : 'FA')
    const isCardboardBoxesLanding = journey.value.some(p => p.includes('boxes') || p.includes('packaging')) || path.includes('boxes') || path.includes('packaging')

    const ua = navigator.userAgent
    let device = 'Desktop'
    if (/android/i.test(ua)) device = 'Android'
    else if (/iphone|ipad|ipod/i.test(ua)) device = 'iOS'
    else if (/mobile/i.test(ua)) device = 'Mobile'

    const elapsedSeconds = Math.max(5, Math.round((Date.now() - startTime.value) / 1000))
    const timeFormatted = elapsedSeconds < 60 ? `${elapsedSeconds} ثانیه` : `${Math.round(elapsedSeconds / 60)} دقیقه`

    return {
      path,
      referer: ref || 'ورود مستقیم',
      referrerSource,
      referrerCategory,
      locale,
      isCardboardBoxesLanding,
      device,
      journey: journey.value.length > 0 ? journey.value : [path],
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
