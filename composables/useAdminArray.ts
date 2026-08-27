// composables/useAdminArray.ts
import { computed } from 'vue'
import {
  adminEditState as state,
  addArrayItem,
  removeArrayItem,
  moveArrayItem,
  archiveArrayItem,
  restoreArchivedItem,
  getArchivedItems
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'

export function useAdminArray(arrayPath: string, targetSlug?: string) {
  const { language } = useLocale()
  const slug = computed(() => targetSlug || state.slug || 'home')
  const lang = computed(() => state.language || language.value || 'FA')
  const isEditMode = computed(() => state.canEdit && state.editMode)

  const archivedItems = computed(() => {
    return getArchivedItems(arrayPath, slug.value)
  })

  function appendNew() {
    addArrayItem(arrayPath, -1, lang.value, slug.value)
  }

  function addAfter(index: number) {
    addArrayItem(arrayPath, index, lang.value, slug.value)
  }

  function addBefore(index: number) {
    addArrayItem(arrayPath, index - 1, lang.value, slug.value)
  }

  function moveUp(index: number) {
    if (index <= 0) return
    moveArrayItem(arrayPath, index, index - 1, lang.value, slug.value)
  }

  function moveDown(index: number, maxLen?: number) {
    if (maxLen !== undefined && index >= maxLen - 1) return
    moveArrayItem(arrayPath, index, index + 1, lang.value, slug.value)
  }

  function move(fromIndex: number, toIndex: number) {
    moveArrayItem(arrayPath, fromIndex, toIndex, lang.value, slug.value)
  }

  function archive(index: number) {
    archiveArrayItem(arrayPath, index, lang.value, slug.value)
  }

  function restore(archiveIndex: number) {
    restoreArchivedItem(arrayPath, archiveIndex, lang.value, slug.value)
  }

  function removeAt(index: number) {
    removeArrayItem(arrayPath, index, lang.value, slug.value)
  }

  return {
    isEditMode,
    lang,
    slug,
    archivedItems,
    appendNew,
    addAfter,
    addBefore,
    moveUp,
    moveDown,
    move,
    archive,
    restore,
    removeAt
  }
}
