// composables/ui/pageUiCache.ts
import { refreshNuxtData } from '#app'

export function invalidatePageUI(slug?: string) {
  if (slug) {
    return refreshNuxtData(`page-ui-content:${slug}`)
  }
  return refreshNuxtData()
}

