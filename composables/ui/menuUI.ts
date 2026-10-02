// composables/ui/menuUI.ts
import { computed } from 'vue'
import defaultMenuMap from '@/schemas/menu-ui.json'
import { useLocale } from '@/composables/useLocale'
import { usePageUI } from '@/composables/ui/usePageUI'
import { useAdminEditable } from '@/composables/useAdminEditable'

export function useMenuUIData() {
  const { language } = useLocale()
  const { ui, allUi, refresh } = usePageUI('menu')
  // Pass isPage = false so menu never overwrites the main active page slug
  useAdminEditable('menu', false)

  const localizedMenuData = computed(() => {
    // Return live dynamic UI from PocketBase / admin overrides
    if (ui.value && Object.keys(ui.value).length > 0) {
      return ui.value
    }

    const lang = (language.value || 'FA').toUpperCase()
    const map = defaultMenuMap as any
    return map[lang] || map['FA'] || defaultMenuMap
  })

  return {
    menuUIData: localizedMenuData,
    allUi,
    refresh
  }
}

