import { useFetch } from '#app'
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

export function usePageUI(slug: string) {
  const { language } = useLocale()

  // Static fallback from local JSON file
  const localData = import.meta.glob<{ default: any }>('@/schemas/*-ui.json', { eager: true })
  const local = localData[`/schemas/${slug}-ui.json`]?.default ?? {}

  const url = `https://aisland.co/najm/api/collections/pages/records?filter=slug="${slug}"`

  const { data } = useFetch<{ items: { uiData: any }[] }>(url, {
    key: `${slug}-ui`,
    default: () => ({ items: [] }), // default to empty
  })

  const ui = computed(() => {
    const remoteUI = data.value?.items?.[0]?.uiData?.[language.value]
    return remoteUI && Object.keys(remoteUI).length > 0 ? remoteUI : local?.[language.value] ?? {}
  })

  return { ui }
}
