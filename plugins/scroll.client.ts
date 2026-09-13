// plugins/scroll.client.ts
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  let isPopState = false

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      isPopState = true
    }, { passive: true })
  }

  const smoothScrollToTopIfNeeded = () => {
    if (typeof window === 'undefined') return

    // If user is already near the top (<= 80px), do NOT force scroll!
    if (window.scrollY <= 80) {
      if (window.scrollX !== 0) {
        window.scrollTo({ left: 0, top: window.scrollY })
      }
      return
    }

    try {
      const smoother = ScrollSmoother.get()
      if (smoother) {
        smoother.scrollTo(0, true)
        return
      }
    } catch {
      // fallback
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  // 1. On forward link navigation, smoothly glide up ONLY if user is scrolled down
  router.beforeEach((to, from) => {
    if (isPopState) {
      isPopState = false
      return
    }

    if (to.path !== from.path && !to.hash) {
      smoothScrollToTopIfNeeded()
    }
  })

  // 2. Once route resolves, reset horizontal offset to prevent Android layout shift
  router.afterEach((to, from) => {
    isPopState = false
    if (typeof window !== 'undefined' && window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY })
    }
  })
})
