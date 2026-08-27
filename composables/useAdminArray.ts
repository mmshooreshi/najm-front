// composables/useAdminArray.ts
import { computed } from 'vue'
import {
  adminEditState as state,
  addArrayItem,
  removeArrayItem
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'

export function useAdminArray(arrayPath: string, targetSlug?: string) {
  const { language } = useLocale()
  const lang = computed(() => state.language || language.value || 'FA')
  const isEditMode = computed(() => state.canEdit && state.editMode)

  function appendNew() {
    addArrayItem(arrayPath, -1, lang.value, targetSlug)
  }

  function addAfter(index: number) {
    addArrayItem(arrayPath, index, lang.value, targetSlug)
  }

  function removeAt(index: number) {
    removeArrayItem(arrayPath, index, lang.value, targetSlug)
  }

  return {
    isEditMode,
    lang,
    appendNew,
    addAfter,
    removeAt
  }
}
