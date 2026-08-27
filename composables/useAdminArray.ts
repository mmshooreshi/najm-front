// composables/useAdminArray.ts
import { computed } from 'vue'
import {
  adminEditState as state,
  addArrayItem,
  removeArrayItem
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'

export function useAdminArray(arrayPath: string) {
  const { language } = useLocale()
  const lang = computed(() => state.language || language.value || 'FA')
  const isEditMode = computed(() => state.canEdit && state.editMode)

  function appendNew() {
    addArrayItem(arrayPath, -1, lang.value)
  }

  function addAfter(index: number) {
    addArrayItem(arrayPath, index, lang.value)
  }

  function removeAt(index: number) {
    removeArrayItem(arrayPath, index, lang.value)
  }

  return {
    isEditMode,
    lang,
    appendNew,
    addAfter,
    removeAt
  }
}
