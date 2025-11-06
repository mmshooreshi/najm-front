// composables/ui/usePageUI.ts
import { useFetch } from '#app'
import { computed, type ComputedRef } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { useRuntimeConfig } from '#imports'

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
} {
  const { language } = useLocale()
  const runtime = useRuntimeConfig()
  const apiBase = (runtime.public?.apiBase as string | undefined)?.replace(/\/$/, '') ?? 'https://aisland.co'

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

  // Remote source (cached by key). Query is encoded safely.
  const { data } = useFetch<{ items: { uiData: AllUi }[] }>(
    `${apiBase}/najm/api/collections/pages/records`,
    {
      key: `page-ui:${slug}`,
      query: { filter: `slug="${slug}"` },
      default: () => ({ items: [] }),
    }
  )

  // Build a complete language->UI map with remote-first, local-fallback per-language
  const allUi = computed<AllUi>(() => {
    const remoteAll: AllUi = data.value?.items?.[0]?.uiData ?? {}

    // union of languages present in remote and local
    const langs = new Set<string>([
      ...Object.keys(remoteAll || {}),
      ...Object.keys(local || {}),
    ])

    const out: AllUi = {}
    for (const lang of langs) {
      const remoteUI = remoteAll?.[lang]
      const chosen =
        (remoteUI && Object.keys(remoteUI).length > 0)
          ? remoteUI
          : (local?.[lang] ?? {})
      out[lang] = chosen
    }

    if (process.dev) {
      console.log(
        `[AdminEdit] usePageUI("${slug}") → hydrated languages: ${Object.keys(out).join(', ') || '∅'}`
      )
    }
    return out
  })

  // Current language view (for regular page rendering)
  const ui = computed<UiForLang>(() => {
    const lang = language.value
    const chosen = allUi.value?.[lang] ?? {}
    if (process.dev) {
      console.log(
        `[AdminEdit] usePageUI("${slug}") → ${lang} (${Object.keys(chosen).length} keys)`
      )
    }
    return chosen
  })

  return { ui, allUi }
}
