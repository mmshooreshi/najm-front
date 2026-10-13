<!-- components/Base/BaseFooterAccordion.vue -->
<template>
  <div
    class="group bg-[#115247] border border-transparent rounded-xl overflow-hidden transition-colors"
    :class="{ '!border-white/20': open }"
  >
    <!-- Header Button -->
    <button
      type="button"
      class="w-full flex transition-height duration-500 ease justify-between hover:bg-[#023028]/20 items-center py-4 px-6 text-sm gap-2 cursor-pointer bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none"
      :class="{ 'bg-[#023028]/20': open }"
      @click="toggle"
    >
      <span
        class="text-white/80 group-hover:text-white/100 text-sm text-d4 text-demibold transition-colors"
        v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.name` : ''"
      >{{ title || '' }}</span>

      <!-- chevron -->
      <Icon
        name="mdi:chevron-down"
        class="w-5 h-5 text-white/80 group-hover:text-white/100 transition-transform duration-300"
        :style="{ transform: `rotate(${open ? 180 : 0}deg)` }"
      />
    </button>

    <!-- Sliding panel with Smooth Transition -->
    <div
      ref="contentRef"
      :style="contentStyles"
      @transitionend="onTransitionEnd"
      class="accordion-content overflow-hidden bg-[#115247]"
    >
      <ul class="my-0 divide-y divide-white/20 list-none p-0">
        <li
          v-for="(item, iIdx) in (items || [])"
          :key="item?.id || iIdx"
          class="relative hover:bg-white/10 text-center py-2 border-t border-t-0.5 border-white/20 flex items-center justify-between px-4 group/item transition-all duration-200"
          :class="{
            'ring-2 ring-emerald-400/80 bg-white/15 scale-[1.01]': dragOverIdx === iIdx,
            'opacity-40': dragFromIdx === iIdx
          }"
          :draggable="canEdit && isEditMode && sectionIndex !== undefined"
          @dragstart="onDragStart(iIdx, $event)"
          @dragover="onDragOver(iIdx, $event)"
          @dragleave="onDragLeave(iIdx)"
          @drop="onDrop(iIdx, $event)"
          @dragend="onDragEnd"
        >
          <!-- Drag Handle in Edit Mode -->
          <span
            v-if="canEdit && isEditMode && sectionIndex !== undefined"
            class="cursor-grab active:cursor-grabbing text-white/40 hover:text-white transition-colors select-none text-xs px-1 shrink-0 ml-1"
            title="برای جابه‌جایی بکشید و رها کنید (Drag to reorder)"
          >
            ⠿
          </span>

          <NuxtLink
            v-if="item"
            :to="localePath(item.slug?.startsWith('/') ? item.slug : '/' + (item.slug || ''))"
            @pointerenter.passive="onLinkHover(item.slug)"
            @focus.passive="onLinkHover(item.slug)"
            class="block py-1 text-white/100 text-xs text-d4 text-demibold text-right hover:text-white/80 transition-colors flex-1"
          >
            <div
              class="w-max rounded-lg p-1"
              v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.children.${iIdx}.name` : ''"
            >
              {{ item?.name || '' }}
            </div>
          </NuxtLink>

          <!-- Sleek micro-action cluster in edit mode -->
          <div
            v-if="canEdit && isEditMode && sectionIndex !== undefined"
            class="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 shrink-0 select-none mr-2"
            @click.stop.prevent
          >
            <!-- Destination Editor -->
            <button
              type="button"
              @click="openDestModal(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
              title="ویرایش آدرس مقصد (Edit URL / Slug)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            <!-- History / Versions -->
            <button
              type="button"
              @click="openHistory(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="تاریخچه تغییرات این عنوان"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- Move Up -->
            <button
              v-if="iIdx > 0"
              type="button"
              @click="onMoveUp(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="انتقال به بالا (Move Up)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <!-- Move Down -->
            <button
              v-if="iIdx < (items?.length || 0) - 1"
              type="button"
              @click="onMoveDown(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="انتقال به پایین (Move Down)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Delete Item (with Confirmation Modal) -->
            <button
              type="button"
              @click="confirmRemove(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="حذف این لینک (Delete)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </li>

        <!-- Dotted Add Link Action in Edit Mode -->
        <li
          v-if="canEdit && isEditMode && sectionIndex !== undefined"
          class="list-none py-2 px-4"
        >
          <button
            type="button"
            @click="onAdd"
            class="w-full py-2 px-3 rounded-xl border border-dashed border-white/25 hover:border-emerald-400 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <span class="text-sm font-bold leading-none">+</span>
            <span>افزودن لینک جدید</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Admin Interactive Modals (Zero overhead on non-admin visitors) -->
    <template v-if="canEdit && isEditMode && sectionIndex !== undefined">
      <!-- Confirmation Modal for Deletion -->
      <AdminConfirmModal
        v-model="showDeleteConfirm"
        title="حذف لینک از فوتر"
        :message="`آیا از حذف لینک «${itemToDeleteName}» از بخش فوتر سایت اطمینان دارید؟`"
        confirm-label="حذف لینک"
        cancel-label="انصراف"
        :danger="true"
        @confirm="onConfirmedRemove"
      />

      <!-- History / Versions Popup -->
      <AdminFieldVersionsPopup
        v-model="showHistory"
        :path="historyFieldPath"
        slug="footer"
        :lang="state.language"
      />

      <!-- Destination / Slug Editor Modal -->
      <AdminDestinationModal
        v-model="showDestModal"
        :current-slug="activeItemSlug"
        :item-name="activeItemName"
        @save="onSaveDestination"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { preloadRouteComponents } from '#app'
import {
  adminEditState as state,
  moveArrayItem,
  removeArrayItem,
  addArrayItem,
  setDraftValue
} from '@/store/adminEditStore'
import { useLocale } from '~/composables/useLocale'
import AdminConfirmModal from '@/components/admin/AdminConfirmModal.vue'
import AdminFieldVersionsPopup from '@/components/admin/AdminFieldVersionsPopup.vue'
import AdminDestinationModal from '@/components/admin/AdminDestinationModal.vue'

const { localePath } = useLocale()
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const canEdit = computed(() => isMounted.value && state.canEdit)
const isEditMode = computed(() => isMounted.value && state.editMode)

// Drag and drop states
const dragFromIdx = ref<number | null>(null)
const dragOverIdx = ref<number | null>(null)

// Modal states
const deleteConfirmIdx = ref<number | null>(null)
const showDeleteConfirm = ref(false)

const historyIdx = ref<number | null>(null)
const showHistory = ref(false)

const destModalIdx = ref<number | null>(null)
const showDestModal = ref(false)

interface Item {
  id: string
  name: string
  slug: string
}

const props = defineProps<{
  id: string
  title: string
  items: Item[]
  initialOpen?: boolean
  modelValue: boolean
  sectionIndex?: number
}>()

const open = computed(() => props.modelValue)
const contentRef = ref<HTMLElement | null>(null)

const contentStyles = reactive<{ height: string; opacity: string }>({
  height: '0px',
  opacity: '0'
})

const itemToDeleteName = computed(() => {
  if (deleteConfirmIdx.value === null || !props.items) return ''
  return props.items[deleteConfirmIdx.value]?.name || 'این لینک'
})

const historyFieldPath = computed(() => {
  if (historyIdx.value === null || props.sectionIndex === undefined) return ''
  return `sections.${props.sectionIndex}.children.${historyIdx.value}.name`
})

const activeItemSlug = computed(() => {
  if (destModalIdx.value === null || !props.items) return '/'
  return props.items[destModalIdx.value]?.slug || '/'
})

const activeItemName = computed(() => {
  if (destModalIdx.value === null || !props.items) return ''
  return props.items[destModalIdx.value]?.name || ''
})

function onLinkHover(slug?: string) {
  try {
    if (!slug || slug.startsWith('http')) return
    const path = localePath(slug.startsWith('/') ? slug : '/' + slug)
    preloadRouteComponents(path).catch(() => {})
  } catch {}
}

function setHeight(expand: boolean) {
  const el = contentRef.value
  if (!el) return

  if (expand) {
    contentStyles.height = '0px'
    contentStyles.opacity = '0'
    requestAnimationFrame(() => {
      if (!el) return
      contentStyles.height = `${el.scrollHeight}px`
      contentStyles.opacity = '1'
    })
  } else {
    contentStyles.height = `${el.scrollHeight}px`
    contentStyles.opacity = '1'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentStyles.height = '0px'
        contentStyles.opacity = '0'
      })
    })
  }
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'height') return
  if (open.value) {
    contentStyles.height = 'auto'
  }
}

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

watch(
  () => open.value,
  v => nextTick(() => setHeight(v)),
  { immediate: true }
)

function toggle() {
  emit('toggle', props.id)
}

// Drag & Drop handlers
function onDragStart(idx: number, e: DragEvent) {
  dragFromIdx.value = idx
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }
}

function onDragOver(idx: number, e: DragEvent) {
  e.preventDefault()
  if (dragFromIdx.value !== null && dragFromIdx.value !== idx) {
    dragOverIdx.value = idx
  }
}

function onDragLeave(idx: number) {
  if (dragOverIdx.value === idx) {
    dragOverIdx.value = null
  }
}

function onDrop(idx: number, e: DragEvent) {
  e.preventDefault()
  if (dragFromIdx.value !== null && dragFromIdx.value !== idx && props.sectionIndex !== undefined) {
    moveArrayItem(`sections.${props.sectionIndex}.children`, dragFromIdx.value, idx, state.language || 'fa', 'footer')
  }
  dragFromIdx.value = null
  dragOverIdx.value = null
}

function onDragEnd() {
  dragFromIdx.value = null
  dragOverIdx.value = null
}

function onMoveUp(idx: number) {
  if (props.sectionIndex === undefined) return
  moveArrayItem(`sections.${props.sectionIndex}.children`, idx, idx - 1, state.language || 'fa', 'footer')
}

function onMoveDown(idx: number) {
  if (props.sectionIndex === undefined) return
  moveArrayItem(`sections.${props.sectionIndex}.children`, idx, idx + 1, state.language || 'fa', 'footer')
}

// Confirm Delete
function confirmRemove(idx: number) {
  deleteConfirmIdx.value = idx
  showDeleteConfirm.value = true
}

function onConfirmedRemove() {
  if (deleteConfirmIdx.value !== null && props.sectionIndex !== undefined) {
    removeArrayItem(`sections.${props.sectionIndex}.children`, deleteConfirmIdx.value, state.language || 'fa', 'footer')
    deleteConfirmIdx.value = null
    // Refresh height if open
    if (open.value && contentRef.value) {
      contentStyles.height = 'auto'
    }
  }
}

// History & Destination Modals
function openHistory(idx: number) {
  historyIdx.value = idx
  showHistory.value = true
}

function openDestModal(idx: number) {
  destModalIdx.value = idx
  showDestModal.value = true
}

function onSaveDestination(newSlug: string) {
  if (destModalIdx.value === null || props.sectionIndex === undefined) return
  const currentLang = state.language || 'fa'
  const idx = destModalIdx.value
  const fullPath = `sections.${props.sectionIndex}.children.${idx}.slug`
  setDraftValue(fullPath, currentLang, newSlug, 'footer', true)
  if (props.items && props.items[idx]) {
    props.items[idx].slug = newSlug
  }
  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: fullPath, lang: currentLang, slug: 'footer' }
  }))
}

function onAdd() {
  if (props.sectionIndex === undefined) return
  const count = props.items?.length || 0
  addArrayItem(`sections.${props.sectionIndex}.children`, count - 1, state.language || 'fa', 'footer')
  // Expand height smoothly if open
  if (open.value && contentRef.value) {
    contentStyles.height = 'auto'
  }
}
</script>

<style scoped>
.accordion-content {
  transition: height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, border-color 0.2s ease;
  will-change: height, opacity;
}
</style>
