<!-- components/MenuLevel.vue -->
<template>
  <div class="space-y-1">
    <div
      v-for="(item, idx) in items || []"
      :key="item?.id || idx"
      class="relative group transition-all duration-200"
      :class="{
        'ring-2 ring-emerald-500/80 rounded-xl bg-emerald-50/30 scale-[1.01]': dragOverIdx === idx,
        'opacity-40': dragFromIdx === idx
      }"
      :draggable="canEdit && isEditMode && !!parentPath"
      @dragstart="onDragStart(idx, $event)"
      @dragover="onDragOver(idx, $event)"
      @dragleave="onDragLeave(idx)"
      @drop="onDrop(idx, $event)"
      @dragend="onDragEnd"
    >
      <!-- Row Wrapper with optional Drag Handle -->
      <div class="flex items-center w-full">
        <!-- Drag Handle in Admin Edit Mode -->
        <span
          v-if="canEdit && isEditMode && !!parentPath"
          class="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-emerald-600 transition-colors select-none text-xs px-1 shrink-0"
          title="برای جابه‌جایی بکشید و رها کنید (Drag to reorder)"
        >
          ⠿
        </span>

        <div class="flex-1 min-w-0">
          <!-- Accordion Type -->
          <BaseAccordionGroupNew
            v-if="item.type === 'accordion'"
            :activeFiltersCount="trueCounts[item.id]"
            :open="false"
            :title="item.name"
            :edit-path="parentPath ? `${parentPath}.${idx}.name` : ''"
            :edit-panes-path="parentPath ? `${parentPath}.${idx}.children` : ''"
            :tabs="item.tabs"
            :panes="item.children"
            class="border border-gray-200/80 rounded-2xl overflow-hidden bg-gray-50/60"
          >
            <!-- Tabbed pane slot -->
            <template #pane="{ pane, paneIndex }">
              <MenuLevel
                :items="pane.children"
                :parent-slug="fullSlug(pane)"
                :parent-path="parentPath ? `${parentPath}.${idx}.children.${paneIndex ?? 0}.children` : ''"
                @link-click="emit('link-click')"
              />
            </template>

            <!-- Default slot -->
            <template #default>
              <MenuLevel
                :items="item.children"
                :parent-slug="fullSlug(item)"
                :parent-path="parentPath ? `${parentPath}.${idx}.children` : ''"
                @link-click="emit('link-click')"
              />
            </template>
          </BaseAccordionGroupNew>

          <!-- Label Type -->
          <div
            v-else-if="item.type === 'label'"
            class="text-gray-400 font-bold text-xs uppercase tracking-wider px-3 pt-3 pb-1"
            v-editable="parentPath ? `${parentPath}.${idx}.name` : ''"
          >
            {{ item.name }}
          </div>

          <!-- Main Link Type (e.g. Services) -->
          <NuxtLink
            v-else-if="item.type === 'link'"
            :to="formatToUrl(item)"
            @click="onLinkClick"
            @pointerenter.passive="onLinkHover(item)"
            @focus.passive="onLinkHover(item)"
            class="min-h-[44px] py-2.5 px-3 sm:px-4 flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-najmgreen hover:bg-gray-100/80 active:bg-gray-200/70 active:scale-[0.99] rounded-xl transition-all duration-200"
          >
            <span class="truncate" v-editable="parentPath ? `${parentPath}.${idx}.name` : ''">{{ item.name }}</span>
            <Icon
              :name="isRTL ? 'mdi:chevron-left' : 'mdi:chevron-right'"
              class="w-5 h-5 text-gray-400 group-hover:text-najmgreen transition-transform flex-shrink-0"
              :class="isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
            />
          </NuxtLink>

          <!-- Filter Type -->
          <div
            v-else-if="item.type === 'filter'"
            @click="item.value = !item.value"
            class="min-h-[40px] py-2 px-3 sm:px-4 flex items-center gap-2.5 cursor-pointer hover:bg-gray-100/70 active:scale-[0.99] rounded-xl transition-all select-none"
          >
            <Icon
              v-if="item.value"
              name="mdi:checkbox-marked"
              class="w-5 h-5 text-najmgreen flex-shrink-0"
            />
            <Icon
              v-else
              name="mdi:checkbox-blank-outline"
              class="w-5 h-5 text-gray-400 hover:text-gray-600 flex-shrink-0"
            />
            <div class="text-xs font-semibold" :class="item.value ? 'text-gray-900 font-bold' : 'text-gray-600'" v-editable="parentPath ? `${parentPath}.${idx}.name` : ''">
              {{ item.name }}
            </div>
            <div v-if="item.count" class="text-[11px] text-gray-400">
              ({{ toLocalizedDigits(item.count) }} {{ countSuffix }})
            </div>
          </div>

          <!-- Simple Link Type (e.g. Catalog, About, Contact) -->
          <NuxtLink
            v-else-if="item.type === 'link-simple'"
            :to="formatToUrl(item)"
            @click="onLinkClick"
            @pointerenter.passive="onLinkHover(item)"
            @focus.passive="onLinkHover(item)"
            class="min-h-[44px] py-2.5 px-3 sm:px-4 flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-najmgreen hover:bg-gray-100/80 active:bg-gray-200/70 active:scale-[0.99] rounded-xl transition-all duration-200"
          >
            <span class="truncate" v-editable="parentPath ? `${parentPath}.${idx}.name` : ''">{{ item.name }}</span>
            <div v-if="item.count" class="text-xs font-normal text-gray-400 flex-shrink-0">
              ({{ toLocalizedDigits(item.count) }} {{ countSuffix }})
            </div>
          </NuxtLink>

          <!-- Simple Small Link Type (Leaf Products Subcategory) -->
          <NuxtLink
            v-else-if="item.type === 'link-simple-xs'"
            :to="formatToUrl(item)"
            @click="onLinkClick"
            @pointerenter.passive="onLinkHover(item)"
            @focus.passive="onLinkHover(item)"
            class="min-h-[40px] py-2 px-3 sm:px-4 flex items-center justify-between text-xs sm:text-sm text-gray-600 hover:text-najmgreen hover:bg-white active:bg-gray-100 rounded-xl transition-all duration-150"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
              <span class="truncate" v-editable="parentPath ? `${parentPath}.${idx}.name` : ''">{{ item.name }}</span>
            </div>
            <span v-if="item.count" class="text-[11px] text-gray-400 flex-shrink-0">
              ({{ toLocalizedDigits(item.count) }})
            </span>
          </NuxtLink>
        </div>

        <!-- Micro Toolbar in Admin Mode for Each Row -->
        <div
          v-if="canEdit && isEditMode && !!parentPath"
          class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 select-none px-1.5"
          @click.stop.prevent
        >
          <!-- Destination Editor (if item has slug or is link) -->
          <button
            v-if="item.slug !== undefined || item.type?.startsWith('link')"
            type="button"
            @click="openDestModal(idx)"
            class="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-900 text-emerald-400 border border-white/10 transition-colors cursor-pointer"
            title="ویرایش آدرس مقصد (Edit URL / Slug)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>

          <!-- Revision History -->
          <button
            type="button"
            @click="openHistory(idx)"
            class="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="تاریخچه تغییرات این عنوان"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <!-- Move Up -->
          <button
            v-if="idx > 0"
            type="button"
            @click="onMove(idx, idx - 1)"
            class="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="انتقال به بالا (Move Up)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <!-- Move Down -->
          <button
            v-if="idx < (items?.length || 0) - 1"
            type="button"
            @click="onMove(idx, idx + 1)"
            class="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="انتقال به پایین (Move Down)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Delete Item -->
          <button
            type="button"
            @click="confirmRemove(idx)"
            class="w-6 h-6 rounded-lg flex items-center justify-center bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
            title="حذف این آیتم (Delete)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Dotted Add Item Placeholder in Admin Edit Mode -->
    <div
      v-if="canEdit && isEditMode && !!parentPath"
      class="pt-2 pb-1"
    >
      <button
        type="button"
        @click="onAddItem"
        class="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-50/60 text-emerald-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
      >
        <span class="text-sm font-bold leading-none">+</span>
        <span>افزودن آیتم جدید</span>
      </button>
    </div>

    <!-- Admin Interactive Modals (Zero impact on non-admin visitors) -->
    <template v-if="canEdit && isEditMode && !!parentPath">
      <!-- Confirmation Modal for Deletion -->
      <AdminConfirmModal
        v-model="showDeleteConfirm"
        title="حذف آیتم از منو"
        :message="`آیا از حذف آیتم «${itemToDeleteName}» از منوی سایت اطمینان دارید؟`"
        confirm-label="حذف آیتم"
        cancel-label="انصراف"
        :danger="true"
        @confirm="onConfirmedRemove"
      />

      <!-- History / Versions Popup -->
      <AdminFieldVersionsPopup
        v-model="showHistory"
        :path="historyFieldPath"
        slug="menu"
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
import { computed, ref, onMounted } from 'vue'
import { preloadRouteComponents } from '#app'
import BaseAccordionGroupNew from '~/components/Base/BaseAccordionGroupNew.vue'
import { toLocalizedDigits } from '~/utils/digits'
import { useLocale } from '~/composables/useLocale'
import {
  adminEditState as state,
  moveArrayItem,
  removeArrayItem,
  addArrayItem,
  setDraftValue
} from '@/store/adminEditStore'
import AdminConfirmModal from '@/components/admin/AdminConfirmModal.vue'
import AdminFieldVersionsPopup from '@/components/admin/AdminFieldVersionsPopup.vue'
import AdminDestinationModal from '@/components/admin/AdminDestinationModal.vue'

const emit = defineEmits<{
  (e: 'link-click'): void
}>()

const props = defineProps<{
  items?: Array<any>
  parentSlug?: string
  parentPath?: string
}>()

const { language, localePath } = useLocale()

// Client-mount guard
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

const cleanArrayPath = computed(() => {
  if (!props.parentPath) return ''
  return props.parentPath.startsWith('menu:') ? props.parentPath.slice(5) : props.parentPath
})

const itemToDeleteName = computed(() => {
  if (deleteConfirmIdx.value === null || !props.items) return ''
  return props.items[deleteConfirmIdx.value]?.name || 'این آیتم'
})

const historyFieldPath = computed(() => {
  if (historyIdx.value === null || !props.parentPath) return ''
  return `${props.parentPath}.${historyIdx.value}.name`
})

const activeItemSlug = computed(() => {
  if (destModalIdx.value === null || !props.items) return '/'
  return props.items[destModalIdx.value]?.slug || '/'
})

const activeItemName = computed(() => {
  if (destModalIdx.value === null || !props.items) return ''
  return props.items[destModalIdx.value]?.name || ''
})

const isRTL = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return l === 'fa' || l === 'ar'
})

const countSuffix = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  if (l === 'en') return 'models'
  if (l === 'ar') return 'موديل'
  return 'مدل'
})

function fullSlug(item: any): string {
  if (!item || !item.slug) return props.parentSlug || '/'
  if (item.slug.startsWith('/')) return item.slug
  if (!props.parentSlug || props.parentSlug === '/') return `/${item.slug}`
  return `${props.parentSlug.replace(/\/+$/, '')}/${item.slug.replace(/^\/+/, '')}`
}

function formatToUrl(item: any): string {
  const raw = fullSlug(item)
  if (raw.startsWith('http')) return raw
  return localePath(raw)
}

function onLinkHover(item: any) {
  try {
    const url = formatToUrl(item)
    if (url && !url.startsWith('http')) {
      preloadRouteComponents(url).catch(() => {})
    }
  } catch {}
}

function onLinkClick() {
  emit('link-click')
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
  if (dragFromIdx.value !== null && dragFromIdx.value !== idx) {
    onMove(dragFromIdx.value, idx)
  }
  dragFromIdx.value = null
  dragOverIdx.value = null
}

function onDragEnd() {
  dragFromIdx.value = null
  dragOverIdx.value = null
}

function onMove(fromIdx: number, toIdx: number) {
  if (!cleanArrayPath.value) return
  moveArrayItem(cleanArrayPath.value, fromIdx, toIdx, state.language || 'fa', 'menu')
}

// Confirm Delete
function confirmRemove(idx: number) {
  deleteConfirmIdx.value = idx
  showDeleteConfirm.value = true
}

function onConfirmedRemove() {
  if (deleteConfirmIdx.value !== null && cleanArrayPath.value) {
    removeArrayItem(cleanArrayPath.value, deleteConfirmIdx.value, state.language || 'fa', 'menu')
    deleteConfirmIdx.value = null
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
  if (destModalIdx.value === null || !cleanArrayPath.value) return
  const currentLang = state.language || 'fa'
  const idx = destModalIdx.value
  const fullPath = `${cleanArrayPath.value}.${idx}.slug`
  setDraftValue(fullPath, currentLang, newSlug, 'menu', true)
  if (props.items && props.items[idx]) {
    props.items[idx].slug = newSlug
  }
  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: fullPath, lang: currentLang, slug: 'menu' }
  }))
}

// Add Item
function onAddItem() {
  if (!cleanArrayPath.value) return
  const currentLang = state.language || 'fa'
  const count = props.items?.length || 0
  const templateItem = count > 0 ? props.items?.[0] : null
  const defaultItem = {
    id: Date.now(),
    name: currentLang === 'en' ? 'New Item' : currentLang === 'ar' ? 'عنصر جديد' : 'آیتم جدید',
    slug: templateItem?.slug || '/',
    type: templateItem?.type || 'link',
    order: count + 1
  }
  addArrayItem(cleanArrayPath.value, count - 1, currentLang, 'menu', defaultItem)
}

// Grandchildren count helper
function countGrandchildrenTrue(children: Array<any> = []) {
  return children.reduce((sum, child) => {
    if (Array.isArray(child.children)) {
      sum += child.children.filter(gc => gc.value === true).length
    }
    return sum
  }, 0)
}

const trueCounts = computed<Record<string | number, number>>(() =>
  (props.items || []).reduce((acc, item) => {
    if (item.type === 'accordion' && Array.isArray(item.children)) {
      acc[item.id] = countGrandchildrenTrue(item.children)
    }
    return acc
  }, {} as Record<string | number, number>)
)
</script>
