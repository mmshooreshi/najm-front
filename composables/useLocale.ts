// ~/composables/useLocale.ts
import { useState } from '#app'

export const useLocale = () => {
  // key = 'language', default = 'EN'
  const language = useState<string>('language', () => 'FA')
  const langs = ['FA', 'AR', 'EN']

  function nextLanguage() {
    const idx = langs.indexOf(language.value)
    language.value = langs[(idx + 1) % langs.length]
  }

  return { language, nextLanguage }
}
