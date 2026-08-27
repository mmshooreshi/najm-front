// composables/ui/usePageUI.ts
import { useFetch } from '#app'
import { computed, type ComputedRef, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { logger } from '@/utils/logger'
import { adminEditState } from '@/store/adminEditStore'
import { getLocalSchema } from '@/composables/ui/schemaRegistry'

type UiForLang = Record<string, any>
type AllUi = Record<string, UiForLang>

/**
 * Returns CURRENT language UI plus ALL languages for the slug.
 * Remote-first with local JSON fallback and live admin clientOverrides per-language.
 */
function deepMerge(target: any, source: any): any {
  if (!target || typeof target !== 'object') return source ?? target
  if (!source || typeof source !== 'object') return target ?? source
  if (Array.isArray(source)) {
    return [...source]
  }
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined && source[key] !== null) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key])
      } else if (Array.isArray(source[key])) {
        result[key] = [...source[key]]
      } else {
        result[key] = source[key]
      }
    }
  }
  return result
}

export function usePageUI(
  slug: string
): {
  ui: ComputedRef<UiForLang>
  allUi: ComputedRef<AllUi>
  pending: ComputedRef<boolean>
  refresh: () => Promise<void>
} {
  const { language } = useLocale()

  // Local fallback schemas from schemaRegistry
  const local: AllUi = getLocalSchema(slug)

  // Fetch from unified Nuxt server endpoint connecting to live PocketBase
  const { data, pending, refresh } = useFetch<{ ok: boolean, uiData: AllUi, title?: string }>(
    `/api/content/${slug}`,
    {
      key: `page-ui-content:${slug}`,
      default: () => ({ ok: false, uiData: {} })
    }
  )

  // Build a complete language->UI map with remote-first, local-fallback, and live admin overrides
  const allUi = computed<AllUi>(() => {
    const remoteAll: AllUi = data.value?.uiData ?? {}
    const clientOverride = adminEditState.clientOverrides?.[slug] ?? {}

    // Union of languages present in remote, local, and live clientOverrides
    const langs = new Set<string>([
      'fa', 'en', 'ar', 'FA', 'EN', 'AR',
      ...Object.keys(remoteAll || {}),
      ...Object.keys(local || {}),
      ...Object.keys(clientOverride || {})
    ])

    const out: AllUi = {}
    for (const lang of langs) {
      const lower = lang.toLowerCase()
      const upper = lang.toUpperCase()
      const remoteUI = remoteAll?.[lower] || remoteAll?.[upper] || remoteAll?.[lang] || {}
      const localUI = local?.[lower] || local?.[upper] || local?.[lang] || {}
      const overrideUI = clientOverride?.[lower] || clientOverride?.[upper] || clientOverride?.[lang] || {}

      let chosen = deepMerge(localUI, remoteUI)
      if (overrideUI && Object.keys(overrideUI).length > 0) {
        chosen = deepMerge(chosen, overrideUI)
      }

      out[lower] = chosen
      out[upper] = chosen
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
