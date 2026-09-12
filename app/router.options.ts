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
        setTimeout(() => resolve(savedPosition), 350)
      })
    }

    // 2. If navigating to an anchor hash (e.g. #contact)
    if (to.hash) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:transition:finish', () => {
          resolve({ el: to.hash, top: 80, behavior: 'smooth' })
        })
        setTimeout(() => resolve({ el: to.hash, top: 80, behavior: 'smooth' }), 350)
      })
    }

    // 3. Normal page navigation: Smooth transitional glide to top
    return new Promise((resolve) => {
      // Start smooth scroll on navigation in sync with leave transition
      if (typeof window !== 'undefined' && window.scrollY > 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }

      nuxtApp.hook('page:transition:finish', () => {
        if (typeof window !== 'undefined' && window.scrollY > 0) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
        resolve({ top: 0, left: 0, behavior: 'smooth' })
      })

      // Fallback timeout in case page:transition:finish is not fired
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.scrollY > 0) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
        resolve({ top: 0, left: 0, behavior: 'smooth' })
      }, 350)
    })
  }
}
