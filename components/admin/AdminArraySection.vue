<!-- components/admin/AdminArraySection.vue -->
<template>
  <div class="admin-array-section" :class="wrapperClass">
    <!-- Archive Drawer Modal for this array -->
    <AdminArrayArchiveModal
      :open="showArchiveModal"
      :path="path"
      :slug="slug"
      @close="showArchiveModal = false"
    />

    <!-- Render items with inter-item insertion lines and live drag-drop reordering -->
    <template v-for="(item, index) in (list || [])" :key="getItemKey(item, index)">
      <!-- 1. Inter-Item Insertion Line Before Item (only if index > 0 or first item) -->
      <AdminArrayInsertLine
        v-if="isEditMode && showInsertLines"
        :path="path"
        :insertIndex="index"
        :slug="slug"
      />

      <!-- 2. Item Container with Drag-Drop Reorder and Actions -->
      <div
        class="relative group/array-item transition-all duration-200"
        :class="[itemWrapperClass, isDragOverIndex === index ? 'ring-2 ring-emerald-500/80 scale-[1.01]' : '']"
        @dragover.prevent="onDragOver(index)"
        @dragleave="onDragLeave(index)"
        @drop.prevent="onDrop(index)"
      >
        <!-- Corner Action Pill (Move, Drag, Archive, Delete) in Admin Edit Mode -->
        <AdminArrayItemActions
          :path="path"
          :index="index"
          :total="list.length"
          :slug="slug"
          :position="actionsPosition"
        />

        <!-- Render Slot Content -->
        <slot :item="item" :index="index" />
      </div>
    </template>

    <!-- 3. Bottom Insertion & Archive Management Controls in Edit Mode -->
    <div v-if="isEditMode" class="col-span-full flex flex-col gap-2 mt-3">
      <!-- Add Card Placeholder -->
      <AdminAddCardPlaceholder
        :path="path"
        :slug="slug"
        :label="label || 'افزودن آیتم جدید'"
        :customClass="placeholderClass"
      />

      <!-- Archive View Pill (if items archived) -->
      <div v-if="archivedItems && archivedItems.length > 0" class="flex justify-center mt-1">
        <button
          type="button"
          @click="showArchiveModal = true"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-medium transition cursor-pointer select-none"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span>مشاهده موارد در آرشیو ({{ archivedItems.length }} مورد)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminEditState } from '@/store/adminEditStore'
import { useAdminArray } from '~/composables/useAdminArray'
import AdminArrayItemActions from '~/components/admin/AdminArrayItemActions.vue'
import AdminArrayInsertLine from '~/components/admin/AdminArrayInsertLine.vue'
import AdminAddCardPlaceholder from '~/components/admin/AdminAddCardPlaceholder.vue'
import AdminArrayArchiveModal from '~/components/admin/AdminArrayArchiveModal.vue'

const props = withDefaults(defineProps<{
  path: string
  list: any[]
  slug?: string
  label?: string
  wrapperClass?: string
  itemWrapperClass?: string
  placeholderClass?: string
  actionsPosition?: 'top-left' | 'top-right' | 'inline'
  showInsertLines?: boolean
}>(), {
  list: () => [],
  slug: '',
  label: '',
  wrapperClass: 'contents',
  itemWrapperClass: '',
  placeholderClass: '',
  actionsPosition: 'top-left',
  showInsertLines: true
})

const showArchiveModal = ref(false)
const isDragOverIndex = ref<number | null>(null)

const isEditMode = computed(() => adminEditState.canEdit && adminEditState.editMode)
const { archivedItems, move } = useAdminArray(props.path, props.slug)

function getItemKey(item: any, fallbackIdx: number): string | number {
  if (item && typeof item === 'object') {
    return item.id || item.key || item.slug || item.name || fallbackIdx
  }
  return fallbackIdx
}

function onDragOver(index: number) {
  isDragOverIndex.value = index
}

function onDragLeave(index: number) {
  if (isDragOverIndex.value === index) {
    isDragOverIndex.value = null
  }
}

function onDrop(toIndex: number) {
  isDragOverIndex.value = null
  // In HTML5 drag-and-drop, retrieve dragged index
  try {
    // If dragged within same array
    const dragData = window.event && (window.event as DragEvent).dataTransfer?.getData('text/plain')
    if (dragData) {
      const parsed = JSON.parse(dragData)
      if (parsed.path === props.path && typeof parsed.index === 'number') {
        move(parsed.index, toIndex)
      }
    }
  } catch {}
}
</script>
