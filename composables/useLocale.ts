// composables/useLocale.ts
import { computed } from 'vue'
import { useCookie, useRoute } from '#app'

export const useLocale = () => {
  const route = useRoute()
  const languageCookie = useCookie<string>('language', { default: () => 'FA', sameSite: 'lax', path: '/' })
  const langs = ['FA', 'AR', 'EN']

  // Route-authoritative locale calculation (100% deterministic, zero hydration mismatch)
  const activeLocale = computed<'FA' | 'AR' | 'EN'>(() => {
    const p = route?.path || ''
    // If inside admin/dashboard, allow cookie override for content editing preview
    if (p.startsWith('/dash') || p.startsWith('/admin') || p.startsWith('/dashboard')) {
      const c = (languageCookie.value || 'FA').toUpperCase()
      return (c === 'EN' || c === 'AR') ? c : 'FA'
    }
    // For all public routes, URL prefix is the absolute authority
    if (p === '/en' || p.startsWith('/en/')) return 'EN'
    if (p === '/ar' || p.startsWith('/ar/')) return 'AR'
    return 'FA'
  })

  // Proxy ref-like behavior for backward compatibility while enforcing URL authority
  const language = computed({
    get(): string {
      return activeLocale.value
    },
    set(newVal: string) {
      if (!newVal) return
      const upper = newVal.toUpperCase()
      languageCookie.value = upper
    }
  })

  const currentLangCode = computed<'fa' | 'en' | 'ar'>(() => {
    const l = activeLocale.value.toLowerCase()
    return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
  })

  const isRTL = computed(() => {
    return activeLocale.value === 'FA' || activeLocale.value === 'AR'
  })

  /**
   * Deterministic locale-aware path generator.
   * Strips any existing /en or /ar prefix, then adds target prefix (or clean root for FA).
   * Strictly preserves external URLs and admin routes (/dash/*, /admin/*, /login, etc.).
   */
  function localePath(path: string, targetLang?: string): string {
    if (!path) {
      const t = (targetLang || activeLocale.value || 'FA').toUpperCase()
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

    const t = (targetLang || activeLocale.value || 'FA').toUpperCase()
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
    languageCookie.value = upper

    if (typeof window !== 'undefined') {
      try {
        const currentPath = route?.path || '/'
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
            window.location.href = target
          }
        }
      } catch {}
    }
  }

  function nextLanguage() {
    const idx = langs.indexOf(activeLocale.value)
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
