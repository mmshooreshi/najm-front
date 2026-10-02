<!-- components/admin/ChangesDrawer.client.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  adminEditState as state,
  getChangedDetails,
  revertPath,
  buildChangesPayloadBySlug,
  recordSavedVersions,
  discardAllChanges,
  getPageContentItems,
  getActiveSlugs,
  setDraftValue,
  type PageContentItem
} from '@/store/adminEditStore'
import { invalidatePageUI } from '~/composables/ui/pageUiCache'
import DiffPreview from '~/components/admin/DiffPreview.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Active Tab
const activeTab = ref<'explorer' | 'diff'>('explorer')

// Selected Scope & Filters
const selectedSlug = ref(state.slug || 'home')
const selectedSection = ref<string>('all')
const filterQuery = ref('')
const viewMode = ref<'inline' | 'split'>('inline')
const isSaving = ref(false)

// Keep selectedSlug in sync with store slug when opening
watch(() => props.open, (isOpen) => {
  if (isOpen && state.slug) {
    selectedSlug.value = state.slug
  }
})

const lang = computed(() => state.language || 'FA')
const activeSlugs = computed(() => getActiveSlugs())

// Diff items across current language
const changedItems = computed(() => getChangedDetails(lang.value))

// Page content items for selected slug & language
const pageItems = computed(() => getPageContentItems(selectedSlug.value, lang.value))

// Available sections for current page
const availableSections = computed(() => {
  const map = new Map<string, { key: string; label: string; count: number }>()
  for (const item of pageItems.value) {
    const existing = map.get(item.section)
    if (existing) {
      existing.count++
    } else {
      map.set(item.section, { key: item.section, label: item.sectionLabel, count: 1 })
    }
  }
  return Array.from(map.values())
})

// Filtered explorer items
const filteredPageItems = computed(() => {
  let list = pageItems.value
  if (selectedSection.value !== 'all') {
    list = list.filter(item => item.section === selectedSection.value)
  }
  const q = filterQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(item =>
    item.path.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q) ||
    item.sectionLabel.toLowerCase().includes(q) ||
    item.current.toLowerCase().includes(q) ||
    item.original.toLowerCase().includes(q)
  )
})

// Filtered diff items
const filteredDiffItems = computed(() => {
  const q = filterQuery.value.trim().toLowerCase()
  if (!q) return changedItems.value
  return changedItems.value.filter(item =>
    item.path.toLowerCase().includes(q) ||
    item.current.toLowerCase().includes(q) ||
    item.original.toLowerCase().includes(q)
  )
})

function close() {
  state.inspectorOpen = false
  emit('close')
}

function handleFieldInput(item: PageContentItem, event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  if (!target) return
  setDraftValue(item.path, lang.value, target.value, selectedSlug.value, true)
}

function handleRevert(path: string) {
  revertPath(path, lang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `بازنشانی شد: "${path}"` } }))
}

function copyText(text: string, label = 'متن') {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `${label} در کلیپ‌بورد کپی شد` } }))
  }
}

function scrollToElement(path: string) {
  if (typeof document === 'undefined') return
  const el = document.querySelector(`[data-edit-path="${CSS.escape(path)}"]`) as HTMLElement | null
  if (!el) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: {
        type: 'info',
        text: `المنت «${path}» روی این صفحه باز نیست یا درون یک منو/آکاردئون بسته قرار دارد.`
      }
    }))
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('admin-element-pulse-highlight')
  setTimeout(() => {
    el.classList.remove('admin-element-pulse-highlight')
  }, 2500)

  window.dispatchEvent(new CustomEvent('toast', {
    detail: {
      type: 'success',
      text: `المنت روی صفحه هایلایت شد`
    }
  }))
}

function elementExistsOnDom(path: string): boolean {
  if (typeof document === 'undefined') return false
  return !!document.querySelector(`[data-edit-path="${CSS.escape(path)}"]`)
}

async function handleSaveAll() {
  if (isSaving.value || changedItems.value.length === 0) return
  isSaving.value = true
  const currentLang = lang.value
  const payloadBySlug = buildChangesPayloadBySlug(currentLang)

  let totalSaved = 0
  try {
    for (const [slugKey, changes] of Object.entries(payloadBySlug)) {
      if (!changes || changes.length === 0) continue
      await $fetch('/api/admin/ui/save-draft', {
        method: 'POST',
        body: { slug: slugKey, language: currentLang, changes }
      })

      recordSavedVersions(currentLang, changes.map(p => p.path))
      invalidatePageUI(slugKey)
      totalSaved += changes.length
    }

    state.lastSavedAt = new Date().toISOString()
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `با موفقیت ${totalSaved} تغییر ذخیره شد!` } }))
    close()
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'خطا در ذخیره تغییرات'
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: msg } }))
  } finally {
    isSaving.value = false
  }
}

function handleDiscardAll() {
  if (changedItems.value.length === 0) return
  discardAllChanges(lang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'تمام تغییرات بازنشانی شدند' } }))
  close()
}
</script>

<template>
  <teleport to="body">
    <transition name="admin-drawer">
      <div
        v-if="open"
        class="fixed inset-0 z-[999998] flex justify-end bg-black/65 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full max-w-3xl h-full bg-zinc-950 text-white border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in select-text"
          dir="rtl"
        >
          <!-- Drawer Header -->
          <div class="p-4 border-b border-white/10 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AdminIcon name="diff" class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-sm font-bold flex items-center gap-2 text-white">
                  <span>کاوشگر محتوا و تغییرات صفحه</span>
                  <span
                    v-if="changedItems.length > 0"
                    class="px-2 py-0.5 text-[11px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono"
                  >
                    {{ changedItems.length }} تغییر
                  </span>
                </h2>
                <div class="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                  <span class="font-mono text-zinc-300">/{{ selectedSlug }}</span>
                  <span>&bull;</span>
                  <span class="font-mono text-amber-300 uppercase">{{ lang }}</span>
                </div>
              </div>
            </div>

            <!-- Tab Switcher -->
            <div class="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeTab === 'explorer' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="activeTab = 'explorer'"
              >
                <span>کاوشگر کل محتوا</span>
                <span class="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-300 font-mono">
                  {{ filteredPageItems.length }}
                </span>
              </button>

              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                :class="activeTab === 'diff' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="activeTab = 'diff'"
              >
                <span>تغییرات ذخیره‌نشده</span>
                <span
                  class="px-1.5 py-0.2 rounded text-[10px] font-mono"
                  :class="changedItems.length > 0 ? 'bg-amber-500/30 text-amber-300' : 'bg-black/40 text-zinc-400'"
                >
                  {{ changedItems.length }}
                </span>
              </button>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              class="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              @click="close"
              title="بستن (Esc)"
            >
              <AdminIcon name="close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Controls & Filters Bar -->
          <div class="p-3 border-b border-white/5 bg-zinc-900/50 flex flex-wrap items-center gap-2.5">
            <!-- Slug Switcher (home, menu, footer, etc.) -->
            <div class="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg border border-white/10 text-xs">
              <span class="text-zinc-400 text-[11px]">صفحه/بخش:</span>
              <select
                v-model="selectedSlug"
                class="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option v-for="s in activeSlugs" :key="s" :value="s" class="bg-zinc-900 text-white">
                  /{{ s }}
                </option>
              </select>
            </div>

            <!-- Section Filter (for explorer tab) -->
            <div v-if="activeTab === 'explorer'" class="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg border border-white/10 text-xs">
              <span class="text-zinc-400 text-[11px]">بخش:</span>
              <select
                v-model="selectedSection"
                class="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1 max-w-[140px] truncate"
              >
                <option value="all" class="bg-zinc-900 text-white">همه بخش‌ها ({{ pageItems.length }})</option>
                <option v-for="sec in availableSections" :key="sec.key" :value="sec.key" class="bg-zinc-900 text-white">
                  {{ sec.label }} ({{ sec.count }})
                </option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="relative flex-1 min-w-[180px]">
              <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="filterQuery"
                type="text"
                :placeholder="activeTab === 'explorer' ? 'جستجو در فیلدها، مقادیر یا مسیرها...' : 'فیلتر تغییرات...'"
                class="w-full bg-zinc-900 border border-white/10 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <!-- View Mode Switcher (for diff tab) -->
            <div v-if="activeTab === 'diff'" class="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                class="px-2 py-1 rounded text-[11px] transition-colors"
                :class="viewMode === 'inline' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="viewMode = 'inline'"
              >
                یکپارچه
              </button>
              <button
                type="button"
                class="px-2 py-1 rounded text-[11px] transition-colors"
                :class="viewMode === 'split' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="viewMode = 'split'"
              >
                دوستونه
              </button>
            </div>
          </div>

          <!-- TAB 1: Content Explorer -->
          <div v-if="activeTab === 'explorer'" class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <!-- Empty state -->
            <div v-if="filteredPageItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
                <AdminIcon name="search" class="w-5 h-5" />
              </div>
              <p class="text-sm font-medium text-zinc-300">
                هیچ فیلدی با فیلتر فعلی مطابقت ندارد
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                عبارت جستجو را پاک کنید یا بخش دیگری را انتخاب نمایید.
              </p>
            </div>

            <!-- List of All Content Items -->
            <div
              v-for="item in filteredPageItems"
              :key="item.path"
              class="rounded-xl bg-zinc-900/60 border p-3.5 transition-all space-y-2.5"
              :class="item.isChanged ? 'border-amber-500/40 bg-amber-950/10' : 'border-white/10 hover:border-white/20'"
            >
              <!-- Card Header -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="item.isChanged ? 'bg-amber-400 shadow-xs shadow-amber-400' : 'bg-zinc-600'"
                  ></span>
                  <span class="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-300 font-medium">
                    {{ item.sectionLabel }}
                  </span>
                  <span
                    class="text-xs font-mono text-zinc-400 truncate cursor-pointer hover:text-amber-300 hover:underline"
                    dir="ltr"
                    :title="`کلیک برای کپی مسیر: ${item.path}`"
                    @click="copyText(item.path, 'مسیر')"
                  >
                    {{ item.path }}
                  </span>
                </div>

                <!-- Action Tools for Field -->
                <div class="flex items-center gap-1.5 shrink-0">
                  <!-- Scroll to DOM Element Button -->
                  <button
                    v-if="elementExistsOnDom(item.path)"
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="scrollToElement(item.path)"
                    title="مشاهده و هایلایت در صفحه"
                  >
                    <span>👁️</span>
                    <span>روی صفحه</span>
                  </button>

                  <button
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="copyText(item.current, 'متن')"
                    title="کپی مقدار فعلی"
                  >
                    <AdminIcon name="copy" class="w-3 h-3" />
                  </button>

                  <button
                    v-if="item.isChanged"
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="handleRevert(item.path)"
                    title="بازنشانی این فیلد به حالت اولیه"
                  >
                    <AdminIcon name="undo" class="w-3 h-3" />
                    <span>بازنشانی</span>
                  </button>
                </div>
              </div>

              <!-- Editable Input Field -->
              <div>
                <textarea
                  v-if="item.isMultiline"
                  :value="item.current"
                  rows="2"
                  class="w-full bg-zinc-950/80 border border-white/15 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all leading-relaxed custom-scrollbar"
                  @input="handleFieldInput(item, $event)"
                ></textarea>

                <input
                  v-else
                  type="text"
                  :value="item.current"
                  class="w-full bg-zinc-950/80 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  @input="handleFieldInput(item, $event)"
                />
              </div>

              <!-- Original Value Preview if modified -->
              <div v-if="item.isChanged" class="text-[10px] text-zinc-500 flex items-start gap-1 pt-0.5">
                <span class="text-zinc-400 shrink-0">مقدار اولیه:</span>
                <span class="truncate line-through text-zinc-500" :title="item.original">{{ item.original }}</span>
              </div>
            </div>
          </div>

          <!-- TAB 2: Modified Fields Diff -->
          <div v-else class="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            <div v-if="filteredDiffItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600 mb-3">
                <AdminIcon name="check" class="w-6 h-6 text-emerald-500" />
              </div>
              <p class="text-sm font-medium text-zinc-300">
                {{ filterQuery ? 'هیچ فیلد تغییریافته‌ای با جستجو مطابقت ندارد' : 'هیچ تغییر ذخیره‌نشده‌ای وجود ندارد' }}
              </p>
              <p class="text-xs text-zinc-500 mt-1 max-w-sm">
                {{ filterQuery ? 'عبارت جستجو را پاک کنید.' : 'تمامی فیلدهای ویرایش‌پذیر این صفحه با نسخه سرور همگام هستند.' }}
              </p>
            </div>

            <div
              v-for="item in filteredDiffItems"
              :key="item.path"
              class="rounded-xl bg-zinc-900/70 border border-white/10 p-3.5 transition-all hover:border-white/20 space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span
                    class="text-xs font-semibold text-amber-200 truncate cursor-pointer hover:underline font-mono"
                    dir="ltr"
                    :title="`کلیک برای کپی: ${item.path}`"
                    @click="copyText(item.path, 'مسیر')"
                  >
                    {{ item.path }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    v-if="elementExistsOnDom(item.path)"
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="scrollToElement(item.path)"
                    title="مشاهده و هایلایت در صفحه"
                  >
                    <span>👁️</span>
                    <span>روی صفحه</span>
                  </button>

                  <button
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="copyText(item.current, 'مقدار')"
                    title="کپی مقدار جدید"
                  >
                    <AdminIcon name="copy" class="w-3.5 h-3.5" />
                    <span>کپی</span>
                  </button>
                  <button
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="handleRevert(item.path)"
                    title="بازنشانی فقط این فیلد"
                  >
                    <AdminIcon name="undo" class="w-3.5 h-3.5" />
                    <span>بازنشانی</span>
                  </button>
                </div>
              </div>

              <!-- Diff Viewer -->
              <DiffPreview
                :before="item.original"
                :after="item.current"
                :mode="viewMode"
              />
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-4 border-t border-white/10 bg-zinc-900/90 flex items-center justify-between gap-3">
            <button
              type="button"
              class="px-3 py-2 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              :disabled="changedItems.length === 0 || isSaving"
              @click="handleDiscardAll"
            >
              <AdminIcon name="trash" class="w-4 h-4" />
              <span>لغو تمامی تغییرات ({{ changedItems.length }})</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors cursor-pointer"
                @click="close"
              >
                بستن
              </button>

              <button
                type="button"
                class="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
                :disabled="changedItems.length === 0 || isSaving"
                @click="handleSaveAll"
              >
                <AdminIcon
                  :name="isSaving ? 'spinner' : 'save'"
                  class="w-4 h-4"
                  :class="{ 'animate-spin': isSaving }"
                />
                <span>{{ isSaving ? 'در حال ذخیره...' : `ذخیره قطعی در سرور (${changedItems.length})` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.admin-drawer-enter-active,
.admin-drawer-leave-active {
  transition: opacity 0.25s ease;
}

.admin-drawer-enter-from,
.admin-drawer-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

:global(.admin-element-pulse-highlight) {
  outline: 3px solid #10b981 !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.8) !important;
  transition: all 0.3s ease !important;
  border-radius: 4px !important;
}
</style>

