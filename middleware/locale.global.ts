// middleware/locale.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useLocale } from '~/composables/useLocale'

export default defineNuxtRouteMiddleware((to) => {
  // Exclude all admin, auth, and API routes with zero overhead
  if (
    to.path.startsWith('/dash') ||
    to.path.startsWith('/admin') ||
    to.path.startsWith('/dashboard') ||
    to.path.startsWith('/login') ||
    to.path.startsWith('/verify') ||
    to.path.startsWith('/api') ||
    to.path.startsWith('/_nuxt')
  ) {
    return
  }

  // Graceful 301 redirection for legacy or mistyped /fa and /fa/* URLs to root
  if (to.path === '/fa') {
    return navigateTo('/', { redirectCode: 301 })
  }
  if (to.path.startsWith('/fa/')) {
    const cleanPath = to.fullPath.replace(/^\/fa/, '') || '/'
    return navigateTo(cleanPath, { redirectCode: 301 })
  }

  // URL Authority: synchronize language state with the current URL prefix
  const { language } = useLocale()

  if (to.path === '/en' || to.path.startsWith('/en/')) {
    if (language.value !== 'EN') {
      language.value = 'EN'
    }
  } else if (to.path === '/ar' || to.path.startsWith('/ar/')) {
    if (language.value !== 'AR') {
      language.value = 'AR'
    }
  } else {
    // Un-prefixed root route is Persian default
    if (language.value !== 'FA') {
      language.value = 'FA'
    }
  }
})
