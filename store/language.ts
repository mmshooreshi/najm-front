// src/stores/language.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import nuxtStorage from 'nuxt-storage' // Import Nuxt Storage

export const useLanguageStore = defineStore('language', () => {
  // 1) Your three languages
  const languages = ['en', 'de', 'fa'] as const
  const current = ref<typeof languages[number]>(languages[0])

  // 2) A nice uppercase label for the UI
  const currentLabel = computed(() => current.value.toUpperCase())

  // 3) Switch to a specific one (and persist if you like)
  function setLanguage(lang: typeof languages[number]) {
    if (languages.includes(lang)) {
      current.value = lang
      nuxtStorage.localStorage.setData('locale', lang)
    }
  }

  // 4) Cycle through them in order
  function nextLanguage() {
    const i = languages.indexOf(current.value)
    const next = (i + 1) % languages.length
    setLanguage(languages[next])
  }

  // 5) Initialise from localStorage
  const saved = nuxtStorage.localStorage.getData('locale')
  if (saved && languages.includes(saved as any)) {
    current.value = saved as typeof languages[number]
  }

  return { languages, current, currentLabel, setLanguage, nextLanguage }
})
