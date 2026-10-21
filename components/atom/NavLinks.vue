<!-- components/atom/NavLinks.vue -->
<template>
  <nav class="flex items-center" aria-label="Desktop Main Navigation">
    <ul class="flex flex-row items-center gap-3 lg:gap-5 text-xs lg:text-sm font-medium select-none">
      <li
        v-for="(item, idx) in visibleNavItems"
        :key="item.id || idx"
        class="relative group py-1 transition-all duration-200"
        :class="{
          'hidden xl:block': idx === 4 && !isEditMode,
          'opacity-60 border border-dashed border-amber-400/80 rounded-lg px-2 py-0.5': item.archived,
          'ring-2 ring-emerald-500/80 rounded-lg bg-emerald-50/20 scale-[1.02]': dragOverIdx === idx,
          'opacity-40': dragFromIdx === idx
        }"
        :draggable="canEdit && isEditMode"
        @dragstart="onDragStart(idx, $event)"
        @dragover="onDragOver(idx, $event)"
        @dragleave="onDragLeave(idx)"
        @drop="onDrop(idx, $event)"
        @dragend="onDragEnd"
      >
        <div class="flex items-center gap-1">
          <!-- Non-navigating text in Edit Mode vs NuxtLink in Visitor Mode -->
          <component
            :is="isEditMode ? 'span' : NuxtLink"
            :to="isEditMode ? undefined : formatToUrl(item.slug)"
            @click="isEditMode ? onLinkClick($event) : undefined"
            class="hover:text-najmgreen text-gray-700 transition-colors duration-200 py-1.5 px-1 block whitespace-nowrap cursor-pointer"
            :class="{ 'cursor-default': isEditMode }"
            active-class="text-najmgreen font-bold"
          >
            <span
              class="inline-block transition-all"
              :class="{
                'min-w-[65px] px-2 py-0.5 rounded border border-dashed border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold': isEditMode && (!item.name || !item.name.trim()),
                'hover:outline-1 hover:outline-dashed hover:outline-emerald-400 rounded px-1': isEditMode
              }"
              v-editable="`headerNav.${idx}.name`"
            >{{ item.name || (isEditMode ? 'لینک جدید' : '') }}</span>
          </component>
        </div>

        <!-- Archived Indicator in Admin Mode -->
        <span
          v-if="item.archived && canEdit && isEditMode"
          class="absolute -top-2 -right-1 bg-amber-500 text-zinc-950 font-bold text-[9px] px-1.5 rounded-full shadow-xs"
        >
          آرشیو
        </span>

        <!-- Streamlined Admin Micro-Toolbar (Non-disruptive, compact) -->
        <div
          v-if="canEdit && isEditMode"
          class="absolute top-full mt-1 right-0 hidden group-hover:flex items-center gap-1 bg-zinc-950/95 text-white rounded-lg py-0.5 px-1.5 border border-white/20 shadow-xl backdrop-blur-md z-50 text-[10px]"
          @click.stop
        >
          <!-- Edit Destination / Slug -->
          <button
            type="button"
            @click="openDestModal(idx)"
            class="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition cursor-pointer"
            title="ویرایش آدرس مقصد (URL / Slug)"
          >
            🔗
          </button>

          <!-- History / Versions -->
          <button
            type="button"
            @click="openHistory(idx)"
            class="p-1 rounded hover:bg-sky-500/20 text-sky-300 transition cursor-pointer"
            title="تاریخچه تغییرات"
          >
            🕒
          </button>

          <!-- Remove Item -->
          <button
            type="button"
            @click="confirmRemove(idx)"
            class="p-1 rounded hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
            title="حذف لینک"
          >
            ✕
          </button>
        </div>
      </li>

      <!-- Subtle Dotted Add Link in Admin Mode -->
      <li v-if="canEdit && isEditMode" class="list-none">
        <button
          type="button"
          @click="onAdd"
          class="h-7 px-2.5 rounded-xl border border-dashed border-emerald-500/60 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          title="افزودن لینک جدید به هدر"
        >
          <span class="text-sm leading-none">+</span>
          <span class="hidden xl:inline">لینک جدید</span>
        </button>
      </li>
    </ul>

    <!-- Admin Interactive Modals (Zero impact on non-admin visitors) -->
    <template v-if="canEdit && isEditMode">
      <!-- Confirmation Modal for Deletion -->
      <AdminConfirmModal
        v-model="showDeleteConfirm"
        title="حذف لینک از منوی بالا"
        :message="`آیا از حذف لینک «${itemToDeleteName}» از منوی بالای سایت اطمینان دارید؟`"
        confirm-label="حذف لینک"
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
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMenuUIData } from '@/composables/ui/menuUI'
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

const { localePath } = useLocale()
const { menuUIData } = useMenuUIData()

// Client-mount guard to ensure 100% flawless SSR hydration
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

// Extract headerNav items or fallback to top items from links and contact
const rawNavItems = computed<any[]>(() => {
  if (Array.isArray(menuUIData.value?.headerNav) && menuUIData.value.headerNav.length > 0) {
    return menuUIData.value.headerNav
  }

  const extracted: any[] = []
  const linksChildren = menuUIData.value?.links?.children || []
  const contactChildren = menuUIData.value?.contact?.children || []

  for (const item of [...linksChildren, ...contactChildren]) {
    extracted.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      order: item.order || extracted.length + 1
    })
  }

  return extracted
})

// In visitor mode: filter out archived items, limit to top 5 max
// In admin edit mode: show all items so admin can manage them
const visibleNavItems = computed(() => {
  if (canEdit.value && isEditMode.value) {
    return rawNavItems.value
  }
  return rawNavItems.value.filter(item => !item.archived).slice(0, 5)
})

const totalCount = computed(() => rawNavItems.value.length)

const itemToDeleteName = computed(() => {
  if (deleteConfirmIdx.value === null) return ''
  return rawNavItems.value[deleteConfirmIdx.value]?.name || 'این آیتم'
})

const historyFieldPath = computed(() => {
  if (historyIdx.value === null) return ''
  return `headerNav.${historyIdx.value}.name`
})

const activeItemSlug = computed(() => {
  if (destModalIdx.value === null) return '/'
  return rawNavItems.value[destModalIdx.value]?.slug || '/'
})

const activeItemName = computed(() => {
  if (destModalIdx.value === null) return ''
  return rawNavItems.value[destModalIdx.value]?.name || ''
})

function formatToUrl(slug = ''): string {
  if (!slug) return localePath('/')
  if (slug.startsWith('http')) return slug
  const clean = slug.startsWith('/') ? slug : '/' + slug
  return localePath(clean)
}

function onLinkClick(e?: MouseEvent) {
  if (isEditMode.value) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
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
  moveArrayItem('headerNav', fromIdx, toIdx, state.language || 'fa', 'menu')
}

function onToggleArchive(idx: number, item: any) {
  const currentLang = state.language || 'fa'
  const isArchived = Boolean(item.archived)
  const updated = [...rawNavItems.value]
  updated[idx] = { ...updated[idx], archived: !isArchived }
  state.clientOverrides.menu = state.clientOverrides.menu || {}
  state.clientOverrides.menu[currentLang] = state.clientOverrides.menu[currentLang] || {}
  state.clientOverrides.menu[currentLang].headerNav = updated
  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: 'headerNav', lang: currentLang, slug: 'menu' }
  }))
}

// Confirm delete
function confirmRemove(idx: number) {
  deleteConfirmIdx.value = idx
  showDeleteConfirm.value = true
}

function onConfirmedRemove() {
  if (deleteConfirmIdx.value !== null) {
    onRemove(deleteConfirmIdx.value)
    deleteConfirmIdx.value = null
  }
}

function onRemove(idx: number) {
  removeArrayItem('headerNav', idx, state.language || 'fa', 'menu')
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
  if (destModalIdx.value === null) return
  const currentLang = state.language || 'fa'
  const idx = destModalIdx.value
  setDraftValue(`headerNav.${idx}.slug`, currentLang, newSlug, 'menu', true)
  const updated = [...rawNavItems.value]
  if (updated[idx]) {
    updated[idx] = { ...updated[idx], slug: newSlug }
    state.clientOverrides.menu = state.clientOverrides.menu || {}
    state.clientOverrides.menu[currentLang] = state.clientOverrides.menu[currentLang] || {}
    state.clientOverrides.menu[currentLang].headerNav = updated
  }
  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: `headerNav.${idx}.slug`, lang: currentLang, slug: 'menu' }
  }))
}

function onAdd() {
  const currentLang = state.language || 'fa'
  const defaultItem = {
    id: Date.now(),
    name: currentLang === 'en' ? 'New Link' : currentLang === 'ar' ? 'رابط جديد' : 'لینک جدید',
    slug: '/',
    order: rawNavItems.value.length + 1
  }
  addArrayItem('headerNav', rawNavItems.value.length - 1, currentLang, 'menu', defaultItem)
}
</script>
