// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // 1. Browser Back / Forward: restore exact saved position after leave transition finishes
    if (savedPosition) {
      return new Promise((resolve) => {
        let settled = false
        nuxtApp.hook('page:transition:finish', () => {
          if (!settled) {
            settled = true
            resolve(savedPosition)
          }
        })
        setTimeout(() => {
          if (!settled) {
            settled = true
            resolve(savedPosition)
          }
        }, 260)
      })
    }

    // 2. Anchor hash navigation (e.g. #aboutus)
    if (to.hash) {
      return new Promise((resolve) => {
        let settled = false
        nuxtApp.hook('page:transition:finish', () => {
          if (!settled) {
            settled = true
            resolve({ el: to.hash, top: 90, behavior: 'smooth' })
          }
        })
        setTimeout(() => {
          if (!settled) {
            settled = true
            resolve({ el: to.hash, top: 90, behavior: 'smooth' })
          }
        }, 260)
      })
    }

    // 3. If user is already at top of the page, do not perform any scroll
    if (typeof window !== 'undefined' && window.scrollY <= 20) {
      return false
    }

    // 4. Normal navigation: wait for the leave transition to complete before resetting scroll
    // This prevents the current page from jarringly jumping before/during the fade-blur exit!
    return new Promise((resolve) => {
      let settled = false
      nuxtApp.hook('page:transition:finish', () => {
        if (!settled) {
          settled = true
          resolve({ top: 0, left: 0 })
        }
      })
      setTimeout(() => {
        if (!settled) {
          settled = true
          resolve({ top: 0, left: 0 })
        }
      }, 260)
    })
  }
}
