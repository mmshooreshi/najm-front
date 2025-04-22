// src/stores/language.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  // 1) Your three languages
  const languages = ['en', 'de', 'fa'] as const

  // 2) A reactive, persisted current language
  //    – stored under "locale" in localStorage
  const current = useStorage<'en' | 'de' | 'fa'>('locale', languages[0])

  // 3) Uppercase label for the UI
  const currentLabel = computed(() => current.value.toUpperCase())

  // 4) Switch to a specific one
  function setLanguage(lang: typeof languages[number]) {
    if (languages.includes(lang)) {
      current.value = lang
    }
  }

  // 5) Cycle through them in order
  function nextLanguage() {
    const i = languages.indexOf(current.value)
    const next = (i + 1) % languages.length
    current.value = languages[next]
  }

  return { languages, current, currentLabel, setLanguage, nextLanguage }
})
