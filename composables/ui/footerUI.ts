// composables/ui/footerUI.ts
import { computed } from 'vue'
import { useFetch } from '#app'
import defaultfooterUIData from '@/schemas/footer-ui.json'

export type footerUIData = typeof defaultfooterUIData

export function usefooterUIData(lang?: string) {
  const url = `https://aisland.co/najm/api/collections/pages/records?filter=slug="footer"`
  const { data } = useFetch<{ items: { uiData: footerUIData }[] }>(
    url,
    {
      key: 'footer-ui',
      default: () => ({ items: [{ uiData: defaultfooterUIData }] })
    }
  )

  const footerUIData = computed(() => data.value?.items?.[0]?.uiData ?? defaultfooterUIData)

  return { footerUIData }
}
