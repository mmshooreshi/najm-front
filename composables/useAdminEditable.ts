// composables/useAdminEditable.ts
import { watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { usePageUI } from '@/composables/ui/usePageUI'
import { logger } from '@/utils/logger'
import {
  adminEditState as state,
  setSlug,
  syncLanguage,
  captureLanguageSnapshot
} from '@/store/adminEditStore'

/**
 * Wire admin editing to a page slug.
 * - Sets slug
 * - Syncs language to store
 * - Hydrates baselines when data is loaded
 * - Keeps capturing snapshots on subsequent updates
 */
export function useAdminEditable(slug: string) {
  const { language } = useLocale()
  const { ui, allUi } = usePageUI(slug)

  setSlug(slug)
  if (process.dev) {
    logger.info('Admin:Edit', `Attached useAdminEditable to slug: "${slug}"`)
  }

  // Keep language in sync
  watch(language, (lang) => {
    if (lang) {
      syncLanguage(lang)
      if (process.dev) {
        logger.info('Content:Locale', `Active editing locale switched to: [${lang.toUpperCase()}] for slug: "${slug}"`)
      }
    }
  }, { immediate: true })

  // Watch language and allUi without deep: true to eliminate main-thread freezing
  watch([language, () => allUi.value], ([lang, uiMap]) => {
    if (!lang || !uiMap) return
    const currentUI = uiMap[lang] || uiMap[lang.toLowerCase()] || uiMap[lang.toUpperCase()]
    if (!currentUI || Object.keys(currentUI).length === 0) {
      return
    }

    // Capture snapshot for live clientOverrides and saving
    if (!state.canEdit) return
    captureLanguageSnapshot(lang, currentUI, slug)
  }, { immediate: true })

  return { state }
}


