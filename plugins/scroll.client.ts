// plugins/scroll.client.ts
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const smoothScrollToTop = () => {
    if (typeof window === 'undefined') return
    try {
      const smoother = ScrollSmoother.get()
      if (smoother) {
        smoother.scrollTo(0, true)
        return
      }
    } catch {
      // fallback
    }
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  // 1. As soon as user clicks a link and page begins leaving, start smooth glide upwards in sync with the fade
  router.beforeEach((to, from) => {
    if (to.path !== from.path && !to.hash) {
      smoothScrollToTop()
    }
  })

  // 2. Once route resolves, ensure smooth completion to top
  router.afterEach((to, from) => {
    if (to.path !== from.path && !to.hash) {
      smoothScrollToTop()
    }
  })
})
