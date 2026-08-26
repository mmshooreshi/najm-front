<!-- components/admin/ChangesDrawer.client.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  adminEditState as state,
  getChangedDetails,
  revertPath,
  buildChangesPayload,
  recordSavedVersions,
  changedCountForLang,
  discardAllChanges
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

const filterQuery = ref('')
const viewMode = ref<'inline' | 'split'>('inline')
const isSaving = ref(false)

const lang = computed(() => state.language || 'FA')
const changedItems = computed(() => getChangedDetails(lang.value))

const filteredItems = computed(() => {
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

function handleRevert(path: string) {
  revertPath(path, lang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `Reverted "${path}"` } }))
}

function copyText(text: string, label = 'Text') {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `${label} copied to clipboard` } }))
  }
}

async function handleSaveAll() {
  if (isSaving.value || changedItems.value.length === 0) return
  isSaving.value = true
  const currentLang = lang.value
  const payload = buildChangesPayload(currentLang)

  try {
    await $fetch('/api/admin/ui/save-draft', {
      method: 'POST',
      body: { slug: state.slug, language: currentLang, changes: payload }
    })

    recordSavedVersions(currentLang, payload.map(p => p.path))
    invalidatePageUI(state.slug)
    state.lastSavedAt = new Date().toISOString()

    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Successfully saved ${payload.length} changes!` } }))
    close()
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Failed to save changes'
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: msg } }))
  } finally {
    isSaving.value = false
  }
}

function handleDiscardAll() {
  if (changedItems.value.length === 0) return
  discardAllChanges(lang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'All changes discarded' } }))
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
          class="w-full max-w-2xl h-full bg-zinc-950 text-white border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in"
        >
          <!-- Drawer Header -->
          <div class="p-4 border-b border-white/10 bg-zinc-900/80 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AdminIcon name="diff" class="w-5 h-5" />
              </div>
              <div>
                <h2 class="text-sm font-semibold flex items-center gap-2 text-white">
                  Modified Fields
                  <span class="px-1.5 py-0.5 text-[11px] rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {{ changedItems.length }}
                  </span>
                </h2>
                <p class="text-[11px] text-zinc-400">
                  /{{ state.slug || 'home' }} &middot; {{ lang.toUpperCase() }}
                </p>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-2">
              <div class="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  class="px-2 py-1 rounded text-[11px] transition-colors"
                  :class="viewMode === 'inline' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                  @click="viewMode = 'inline'"
                >
                  Inline
                </button>
                <button
                  type="button"
                  class="px-2 py-1 rounded text-[11px] transition-colors"
                  :class="viewMode === 'split' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                  @click="viewMode = 'split'"
                >
                  Split
                </button>
              </div>

              <button
                type="button"
                class="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                @click="close"
                title="Close (Esc)"
              >
                <AdminIcon name="close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Search / Filter Bar -->
          <div class="p-3 border-b border-white/5 bg-zinc-900/40 flex items-center gap-2">
            <div class="relative flex-1">
              <AdminIcon name="search" class="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="filterQuery"
                type="text"
                placeholder="Filter modified fields by path or content..."
                class="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <!-- Changed Fields List -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            <div v-if="filteredItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600 mb-3">
                <AdminIcon name="check" class="w-6 h-6 text-emerald-500" />
              </div>
              <p class="text-sm font-medium text-zinc-300">
                {{ filterQuery ? 'No modified fields match your filter' : 'No unsaved modifications' }}
              </p>
              <p class="text-xs text-zinc-500 mt-1 max-w-sm">
                {{ filterQuery ? 'Try clearing the search query above.' : 'All editable fields on this page match their baseline.' }}
              </p>
            </div>

            <div
              v-for="item in filteredItems"
              :key="item.path"
              class="rounded-xl bg-zinc-900/70 border border-white/10 p-3.5 transition-all hover:border-white/20"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span
                    class="text-xs font-semibold text-amber-200 truncate cursor-pointer hover:underline"
                    :title="`Click to copy path: ${item.path}`"
                    @click="copyText(item.path, 'Path')"
                  >
                    {{ item.path }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="copyText(item.current, 'Value')"
                    title="Copy current value"
                  >
                    <AdminIcon name="copy" class="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    type="button"
                    class="px-2 py-1 rounded text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="handleRevert(item.path)"
                    title="Revert only this field"
                  >
                    <AdminIcon name="undo" class="w-3.5 h-3.5" />
                    Revert
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
              Discard All ({{ changedItems.length }})
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors cursor-pointer"
                @click="close"
              >
                Cancel
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
                <span>{{ isSaving ? 'Saving...' : `Save All (${changedItems.length})` }}</span>
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
</style>

