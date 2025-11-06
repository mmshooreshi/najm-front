// composables/useAdminEditable.ts
import { watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { usePageUI } from '@/composables/ui/usePageUI'
import {
  adminEditState as state,
  setSlug,
  syncLanguage,
  captureLanguageSnapshot,
  applySnapshotToBaselines
} from '@/store/adminEditStore'

/**
 * Wire admin editing to a page slug.
 * - Sets slug
 * - Syncs language to store
 * - Hydrates each language **only once**
 * - Keeps capturing snapshots on subsequent updates
 */
export function useAdminEditable(slug: string) {
  const { language } = useLocale()
  const { ui, allUi } = usePageUI(slug)

  setSlug(slug)

  // keep language in sync
  watch(language, (lang) => syncLanguage(lang), { immediate: true })

  // Track which languages already hydrated
  const hydrated = new Set<string>()

  // Single watcher to handle both hydration & ongoing updates
  // Single watcher
  watch(language, (lang) => {
    const currentUI = allUi.value[lang]
    if (!currentUI || Object.keys(currentUI).length === 0) {
      console.warn(`[AdminEdit] UI empty for ${lang} — snapshot skipped`)
      return
    }

    if (!hydrated.has(lang)) {
      captureLanguageSnapshot(lang, currentUI)
      applySnapshotToBaselines(lang)
      hydrated.add(lang)
      console.log(`[AdminEdit] hydrated ${lang} (${Object.keys(currentUI).length} keys)`)
    } else {
      captureLanguageSnapshot(lang, currentUI)

      console.log(`[AdminEdit] snapshot only for ${lang}`)
    }
  }, { immediate: true })


  return { state }
}
