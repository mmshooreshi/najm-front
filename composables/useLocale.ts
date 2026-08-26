// composables/useLocale.ts
import { useCookie } from '#app'     // Nuxt helper, SSR-friendly

export const useLocale = () => {
  const language = useCookie<string>('language', { default: () => 'FA' })
  const langs = ['FA', 'AR', 'EN']

  function setLocale(newLang: string) {
    if (!newLang) return
    language.value = newLang.toUpperCase()
  }

  function nextLanguage() {
    const idx = langs.indexOf(language.value)
    language.value = langs[(idx + 1) % langs.length]
    // Cookie is updated automatically
  }

  return { language, setLocale, nextLanguage }
}

