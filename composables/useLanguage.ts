// composables/useLanguage.ts
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import nuxtStorage from 'nuxt-storage' // Import Nuxt Storage

export function useLanguage() {

  const languages = ['en', 'de', 'fa'] as const
  type Lang = typeof languages[number]
  const defaultLang: Lang = languages[0]
  const current = ref<Lang>(defaultLang)

  // load saved value on mount
  onMounted(() => {
    // only in browser
    if (process.client) {
      const stored = nuxtStorage.localStorage.getData('locale') as string | null
      if (stored && languages.includes(stored as Lang)) {
        current.value = stored as Lang
      }

      // attach listener
      const onStorage = (e: StorageEvent) => {
        if (e.key === 'locale'
          && e.newValue
          && languages.includes(e.newValue as Lang)
        ) {
          current.value = e.newValue as Lang
        }
      }
      window.addEventListener('storage', onStorage)

      // clean up when no longer used
      onBeforeUnmount(() => {
        window.removeEventListener('storage', onStorage)
      })
    }
  })

  // whenever we change, persist
  function save(lang: Lang) {
    current.value = lang
    nuxtStorage.localStorage.setData('locale', lang)
  }

  const currentLabel = computed(() => current.value.toUpperCase())
  function setLanguage(lang: Lang) {
    if (languages.includes(lang)) save(lang)
  }
  function nextLanguage() {
    const idx = languages.indexOf(current.value)
    save(languages[(idx + 1) % languages.length])
  }

  return { languages, current, currentLabel, setLanguage, nextLanguage }
}
