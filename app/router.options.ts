// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // 1. If user used browser back/forward buttons, restore saved position directly
    if (savedPosition) {
      return savedPosition
    }

    // 2. If navigating to an anchor hash (e.g. #aboutus)
    if (to.hash) {
      return { el: to.hash, top: 100, behavior: 'smooth' }
    }

    // 3. Normal page navigation without hash: Always scroll directly to top (0, 0)
    return { top: 0, left: 0 }
  }
}
