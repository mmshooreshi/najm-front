// composables/ui/pageUiCache.ts
import { refreshNuxtData, clearNuxtData } from '#app'

export function invalidatePageUI(slug?: string) {
  if (slug) {
    try {
      clearNuxtData(`page-ui-content:${slug}`)
    } catch {}
    return refreshNuxtData(`page-ui-content:${slug}`)
  }
  try {
    clearNuxtData()
  } catch {}
  return refreshNuxtData()
}

