// plugins/scroll.client.ts
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  // On page transition completion, reset ScrollSmoother internal offset and refresh ScrollTrigger
  nuxtApp.hook('page:transition:finish', () => {
    try {
      const smoother = ScrollSmoother.get()
      if (smoother) {
        smoother.scrollTop(0)
      }
    } catch {}

    try {
      ScrollTrigger.refresh()
    } catch {}
  })

  // Once route resolves, reset horizontal offset to prevent mobile layout shift
  router.afterEach(() => {
    if (typeof window !== 'undefined' && window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY })
    }
  })
})
