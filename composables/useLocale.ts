// composables/useLocale.ts
import { computed } from 'vue'
import { useCookie, useRoute, navigateTo } from '#app'

export const useLocale = () => {
  const language = useCookie<string>('language', { default: () => 'FA', sameSite: 'lax', path: '/' })
  const langs = ['FA', 'AR', 'EN']

  const currentLangCode = computed(() => {
    const l = (language.value || 'FA').toLowerCase()
    return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
  })

  const isRTL = computed(() => {
    return language.value === 'FA' || language.value === 'AR'
  })

  /**
   * Deterministic locale-aware path generator.
   * Strips any existing /en or /ar prefix, then adds target prefix (or clean root for FA).
   * Strictly preserves external URLs and admin routes (/dash/*, /admin/*, /login, etc.).
   */
  function localePath(path: string, targetLang?: string): string {
    if (!path) {
      const t = (targetLang || language.value || 'FA').toUpperCase()
      return t === 'EN' ? '/en' : t === 'AR' ? '/ar' : '/'
    }

    // External and special URLs
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('mailto:') ||
      path.startsWith('tel:') ||
      path.startsWith('#')
    ) {
      return path
    }

    // Admin & system exclusions: never prefix
    if (
      path.startsWith('/dash') ||
      path.startsWith('/admin') ||
      path.startsWith('/dashboard') ||
      path.startsWith('/login') ||
      path.startsWith('/verify') ||
      path.startsWith('/api')
    ) {
      return path
    }

    // Strip leading /en or /ar
    let clean = path.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
    if (!clean.startsWith('/')) clean = `/${clean}`

    const t = (targetLang || language.value || 'FA').toUpperCase()
    if (t === 'EN') return `/en${clean === '/' ? '' : clean}`
    if (t === 'AR') return `/ar${clean === '/' ? '' : clean}`
    return clean
  }

  /**
   * Set active locale.
   * On public pages: navigates to the equivalent localized path (/en/..., /ar/..., or /...).
   * On admin pages (/dash/*): updates state/cookie in-place without navigating away.
   */
  function setLocale(newLang: string) {
    if (!newLang) return
    const upper = newLang.toUpperCase()
    language.value = upper

    if (typeof window !== 'undefined') {
      try {
        const route = useRoute()
        const currentPath = route.path
        if (
          !currentPath.startsWith('/dash') &&
          !currentPath.startsWith('/admin') &&
          !currentPath.startsWith('/dashboard') &&
          !currentPath.startsWith('/login') &&
          !currentPath.startsWith('/verify') &&
          !currentPath.startsWith('/api')
        ) {
          const target = localePath(currentPath, upper)
          if (target !== currentPath) {
            navigateTo(target)
          }
        }
      } catch {}
    }
  }

  function nextLanguage() {
    const idx = langs.indexOf(language.value)
    const next = langs[(idx + 1) % langs.length]
    setLocale(next)
  }

  return {
    language,
    currentLangCode,
    isRTL,
    setLocale,
    nextLanguage,
    localePath
  }
}
