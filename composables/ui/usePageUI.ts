// composables/ui/usePageUI.ts
import { useFetch } from '#app'
import { computed, type ComputedRef, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { logger } from '@/utils/logger'

type UiForLang = Record<string, any>
type AllUi = Record<string, UiForLang>

/**
 * Returns CURRENT language UI plus ALL languages for the slug.
 * Remote-first with local JSON fallback per-language.
 */
export function usePageUI(
  slug: string
): {
  ui: ComputedRef<UiForLang>
  allUi: ComputedRef<AllUi>
  pending: ComputedRef<boolean>
  refresh: () => Promise<void>
} {
  const { language } = useLocale()

  // Local fallback schemas (eager so they're available at build/runtime without extra fetch)
  const localData = import.meta.glob<{ default: AllUi }>(
    '@/schemas/*-ui.json',
    { eager: true }
  )

  // Robustly find the local JSON matching `${slug}-ui.json` regardless of Vite's key format
  const local: AllUi = (() => {
    const entry = Object.entries(localData).find(([key]) => key.endsWith(`/${slug}-ui.json`))
    return (entry?.[1]?.default ?? {}) as AllUi
  })()

  // Fetch from unified Nuxt server endpoint connecting to live PocketBase
  const { data, pending, refresh } = useFetch<{ ok: boolean, uiData: AllUi, title?: string }>(
    `/api/content/${slug}`,
    {
      key: `page-ui-content:${slug}`,
      default: () => ({ ok: false, uiData: {} })
    }
  )

  // Build a complete language->UI map with remote-first, local-fallback per-language
  const allUi = computed<AllUi>(() => {
    const remoteAll: AllUi = data.value?.uiData ?? {}

    // Union of languages present in remote and local
    const langs = new Set<string>([
      'fa', 'en', 'ar', 'FA', 'EN', 'AR',
      ...Object.keys(remoteAll || {}),
      ...Object.keys(local || {})
    ])

    const out: AllUi = {}
    for (const lang of langs) {
      const lower = lang.toLowerCase()
      const upper = lang.toUpperCase()
      const remoteUI = remoteAll?.[lower] || remoteAll?.[upper] || remoteAll?.[lang]
      const localUI = local?.[lower] || local?.[upper] || local?.[lang]

      const chosen =
        (remoteUI && Object.keys(remoteUI).length > 0)
          ? remoteUI
          : (localUI ?? {})
      out[lower] = chosen
      out[upper] = chosen
    }

    if (process.dev) {
      const availableLangs = Array.from(new Set(Object.keys(out).map(l => l.toUpperCase())))
      logger.group('Content:Hydrate', `Hydrated UI schema for "${slug}" [${availableLangs.join(', ')}]`, () => {
        logger.debug('Content:Hydrate', 'Remote Source Status:', data.value?.ok ? '✓ Remote PocketBase OK' : '⚠ Fallback Schema Applied')
        logger.debug('Content:Hydrate', 'Available Languages:', availableLangs)
        logger.debug('Content:Hydrate', 'Schema Keys Summary:', Object.keys(out.fa || out.FA || {}))
      })
    }

    return out
  })

  // Current language view (for regular page rendering)
  const ui = computed<UiForLang>(() => {
    const lang = (language.value || 'FA').toLowerCase()
    const chosen = allUi.value?.[lang] || allUi.value?.[lang.toUpperCase()] || {}
    return chosen
  })

  return { ui, allUi, pending, refresh }
}
