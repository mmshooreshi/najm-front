// composables/useLocale.ts
import { computed } from 'vue'
import { useCookie } from '#app'     // Nuxt helper, SSR-friendly

export const useLocale = () => {
  const language = useCookie<string>('language', { default: () => 'FA' })
  const langs = ['FA', 'AR', 'EN']

  const currentLangCode = computed(() => {
    const l = (language.value || 'FA').toLowerCase()
    return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
  })

  const isRTL = computed(() => {
    return language.value === 'FA' || language.value === 'AR'
  })

  function setLocale(newLang: string) {
    if (!newLang) return
    language.value = newLang.toUpperCase()
  }

  function nextLanguage() {
    const idx = langs.indexOf(language.value)
    language.value = langs[(idx + 1) % langs.length]
  }

  function localePath(path: string): string {
    if (!path) return '/'
    return path.startsWith('/') ? path : `/${path}`
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

