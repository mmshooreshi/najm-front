import { computed } from 'vue'
import { useFetch } from '#app'
import defaultMenuUIData from '@/schemas/menu-ui.json'

export type MenuUIData = typeof defaultMenuUIData

export function useMenuUIData(lang?: string) {
  const url = `http://65.108.80.205:8090/api/collections/pages/records?filter=slug="menu"`
  const { data } = useFetch<{ items: { uiData: MenuUIData }[] }>(
    url,
    {
      key: 'menu-ui',
      default: () => ({ items: [{ uiData: defaultMenuUIData }] })
    }
  )

  const menuUIData = computed(() => data.value?.items?.[0]?.uiData ?? defaultMenuUIData)

  return { menuUIData }
}
