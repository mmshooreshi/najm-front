// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // 1. If user used browser back/forward buttons, restore saved position directly
    if (savedPosition) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:transition:finish', () => {
          resolve(savedPosition)
        })
        setTimeout(() => resolve(savedPosition), 300)
      })
    }

    // 2. If navigating to an anchor hash (e.g. #contact)
    if (to.hash) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:transition:finish', () => {
          resolve({ el: to.hash, top: 80, behavior: 'smooth' })
        })
        setTimeout(() => resolve({ el: to.hash, top: 80, behavior: 'smooth' }), 300)
      })
    }

    // 3. Normal page navigation:
    // If user is already near top (<= 80px), do NOT scroll! Just let the soothing fade/blur play
    if (typeof window !== 'undefined' && window.scrollY <= 80) {
      return { top: 0, left: 0 }
    }

    // If user was scrolled down, resolve to top after transition completes
    return new Promise((resolve) => {
      nuxtApp.hook('page:transition:finish', () => {
        resolve({ top: 0, left: 0 })
      })

      // Fallback timeout in case page:transition:finish is not fired
      setTimeout(() => {
        resolve({ top: 0, left: 0 })
      }, 300)
    })
  }
}
