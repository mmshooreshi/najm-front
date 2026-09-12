// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // 1. If user used browser back/forward buttons, restore saved position
    if (savedPosition) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:transition:finish', () => {
          resolve(savedPosition)
        })
        setTimeout(() => resolve(savedPosition), 250)
      })
    }

    // 2. If navigating to an anchor hash (e.g. #contact)
    if (to.hash) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:transition:finish', () => {
          resolve({ el: to.hash, top: 80, behavior: 'smooth' })
        })
        setTimeout(() => resolve({ el: to.hash, top: 80, behavior: 'smooth' }), 250)
      })
    }

    // 3. Normal page navigation: ALWAYS scroll cleanly to top (top: 0, left: 0)
    return new Promise((resolve) => {
      // Immediately reset scroll on client
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }

      nuxtApp.hook('page:transition:finish', () => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
        resolve({ top: 0, left: 0 })
      })

      // Fallback timeout in case page:transition:finish is not fired (e.g. initial load or no transition)
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
        resolve({ top: 0, left: 0 })
      }, 150)
    })
  }
}
