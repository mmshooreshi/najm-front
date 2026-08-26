// composables/useAdminEditable.ts
import { watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { usePageUI } from '@/composables/ui/usePageUI'
import { logger } from '@/utils/logger'
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

  // Track which languages already hydrated
  const hydrated = new Set<string>()

  // Watch both language and allUi so async fetches properly populate baselines
  watch([language, allUi], ([lang, uiMap]) => {
    if (!lang || !uiMap) return
    const currentUI = uiMap[lang] || uiMap[lang.toLowerCase()] || uiMap[lang.toUpperCase()]
    if (!currentUI || Object.keys(currentUI).length === 0) {
      return
    }

    captureLanguageSnapshot(lang, currentUI)

    if (!hydrated.has(lang)) {
      applySnapshotToBaselines(lang)
      hydrated.add(lang)
      if (process.dev) {
        logger.success('Admin:Edit', `Hydrated editable baselines for [${lang.toUpperCase()}] (${Object.keys(currentUI).length} root keys)`)
      }
    }
  }, { immediate: true, deep: true })

  return { state }
}


