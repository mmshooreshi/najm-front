// plugins/scroll.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.afterEach((to, from) => {
    // If the path actually changed and there is no hash
    if (to.path !== from.path && !to.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      // Re-check after next tick for components that adjust layout height asynchronously
      nextTick(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })
    }
  })
})
