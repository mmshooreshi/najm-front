<!-- components/admin/AdminEditBar.client.vue -->
<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, reactive, watch, nextTick } from 'vue'
import HistoryModal from '~/components/admin/HistoryModal.client.vue'
import ChangesDrawer from '~/components/admin/ChangesDrawer.client.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import { invalidatePageUI } from '~/composables/ui/pageUiCache'
import { useLocale } from '@/composables/useLocale'
import {
  adminEditState as state,
  buildChangesPayload,
  recordSavedVersions,
  changedCountForLang,
  discardAllChanges
} from '@/store/adminEditStore'

const { setLocale, language } = useLocale()

const saving = ref(false)
const lastError = ref<string | null>(null)
const paletteQuery = ref('')
const paletteActiveIndex = ref(0)
const autosaveDelayMs = 2000
let autosaveTimer: any = null

const lang = computed(() => state.language || language.value || 'FA')
const changedCount = computed(() => changedCountForLang(lang.value))
const availableLangs = ['FA', 'EN', 'AR']

const status = computed<'saved' | 'saving' | 'unsaved' | 'error'>(() => {
  if (saving.value) return 'saving'
  if (lastError.value) return 'error'
  if (changedCount.value > 0) return 'unsaved'
  return 'saved'
})

const statusMeta = computed(() => {
  switch (status.value) {
    case 'saving':
      return { label: 'Saving…', dot: 'bg-sky-400 animate-pulse', border: 'border-sky-500/30 text-sky-300' }
    case 'unsaved':
      return { label: `${changedCount.value} modified`, dot: 'bg-amber-400', border: 'border-amber-500/30 text-amber-300' }
    case 'error':
      return { label: 'Save error', dot: 'bg-rose-500', border: 'border-rose-500/30 text-rose-300' }
    default:
      return { label: 'All saved', dot: 'bg-emerald-400', border: 'border-emerald-500/30 text-emerald-300' }
  }
})

// --- Save Action ---
async function saveDraft(manual = false) {
  if (!state || saving.value || changedCount.value === 0) {
    if (manual) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'No pending changes to save' } }))
    }
    return
  }

  saving.value = true
  lastError.value = null
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

    // Flash green indicator on saved fields
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-admin-changed="true"]').forEach(el => {
        el.classList.add('v-saved-flash')
        setTimeout(() => el.classList.remove('v-saved-flash'), 1200)
      })
    }

    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Saved ${payload.length} changes successfully!` } }))
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Failed to save draft'
    lastError.value = msg
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: `Save error: ${msg}` } }))
  } finally {
    saving.value = false
  }
}

// --- Autosave schedule ---
function scheduleAutosave() {
  if (!state.autosaveEnabled || changedCount.value === 0 || saving.value) {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer)
      autosaveTimer = null
    }
    return
  }
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => saveDraft(false), autosaveDelayMs)
}

// --- Discard changes ---
function discardWithConfirm() {
  if (changedCount.value === 0) return
  discardAllChanges(lang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'All unsaved changes discarded' } }))
}

// --- Switch language ---
function handleLangChange(newLang: string) {
  if (typeof setLocale === 'function') {
    setLocale(newLang)
  }
  state.language = newLang
}

// --- Persistent Draggable Position State ---
const dockPos = reactive<{ x: number | null; y: number | null }>({
  x: null,
  y: null
})

const dockStyle = computed(() => {
  if (dockPos.x !== null && dockPos.y !== null) {
    return {
      left: `${dockPos.x}px`,
      top: `${dockPos.y}px`,
      transform: 'none',
      bottom: 'auto',
      right: 'auto'
    }
  }
  return {
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
})

const barEl = ref<HTMLElement | null>(null)
let isDragging = false
let startX = 0
let startY = 0
let initialLeft = 0
let initialTop = 0

function startDrag(e: MouseEvent) {
  if (!barEl.value) return
  isDragging = true
  startX = e.clientX
  startY = e.clientY

  const rect = barEl.value.getBoundingClientRect()
  initialLeft = rect.left
  initialTop = rect.top

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging || !barEl.value) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  const barW = barEl.value.offsetWidth
  const barH = barEl.value.offsetHeight

  const newLeft = Math.max(12, Math.min(window.innerWidth - barW - 12, initialLeft + dx))
  const newTop = Math.max(12, Math.min(window.innerHeight - barH - 12, initialTop + dy))

  dockPos.x = newLeft
  dockPos.y = newTop

  try {
    localStorage.setItem('admin_dock_pos', JSON.stringify({ x: newLeft, y: newTop }))
  } catch {}
}

function stopDrag() {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function restorePosition() {
  try {
    const raw = localStorage.getItem('admin_dock_pos')
    if (raw) {
      const pos = JSON.parse(raw)
      if (typeof pos.x === 'number' && typeof pos.y === 'number') {
        dockPos.x = Math.max(12, Math.min(window.innerWidth - 200, pos.x))
        dockPos.y = Math.max(12, Math.min(window.innerHeight - 60, pos.y))
      }
    }
  } catch {}
}

// --- Command Palette ---
const commands = computed(() => [
  { id: 'toggle-edit', icon: 'pencil', label: state.editMode ? 'Disable Edit Mode (Preview)' : 'Enable Edit Mode', shortcut: '⌘E', action: () => (state.editMode = !state.editMode) },
  { id: 'save', icon: 'save', label: 'Save Pending Changes', shortcut: '⌘S', action: () => saveDraft(true) },
  { id: 'inspector', icon: 'diff', label: 'Open Modified Fields Inspector', shortcut: '⌘K', action: () => (state.inspectorOpen = true) },
  { id: 'history', icon: 'history', label: 'View Revisions & History', shortcut: '', action: () => (state.historyOpen = true) },
  { id: 'discard', icon: 'trash', label: 'Discard All Unsaved Changes', shortcut: 'Esc', action: () => discardWithConfirm() },
  { id: 'autosave', icon: 'clock-bolt', label: state.autosaveEnabled ? 'Turn Off Autosave' : 'Turn On Autosave', shortcut: '', action: () => (state.autosaveEnabled = !state.autosaveEnabled) },
  { id: 'minimize', icon: 'minimize', label: state.minimized ? 'Expand Admin Dock' : 'Minimize Admin Dock', shortcut: '', action: () => (state.minimized = !state.minimized) }
])

const filteredCommands = computed(() => {
  const q = paletteQuery.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter(c => c.label.toLowerCase().includes(q))
})

function onPaletteKey(e: KeyboardEvent) {
  if (!state.paletteOpen) return
  const max = filteredCommands.value.length - 1
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    paletteActiveIndex.value = Math.min(max, paletteActiveIndex.value + 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    paletteActiveIndex.value = Math.max(0, paletteActiveIndex.value - 1)
  }
  if (e.key === 'Enter') {
    const cmd = filteredCommands.value[paletteActiveIndex.value]
    if (cmd) {
      cmd.action()
      state.paletteOpen = false
    }
  }
}

// --- Lifecycle & Events ---
onMounted(() => {
  restorePosition()

  const onSaveEvt = () => saveDraft(true)
  const onDiscardEvt = () => discardWithConfirm()
  const onToggleEvt = () => (state.editMode = !state.editMode)

  window.addEventListener('admin-save', onSaveEvt)
  window.addEventListener('admin-discard', onDiscardEvt)
  window.addEventListener('admin-toggle-edit', onToggleEvt)
  window.addEventListener('keydown', onPaletteKey)

  window.addEventListener('beforeunload', (e) => {
    if (changedCount.value > 0 && !saving.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  })

  ;(window as any)._adminBarCleanup = () => {
    window.removeEventListener('admin-save', onSaveEvt)
    window.removeEventListener('admin-discard', onDiscardEvt)
    window.removeEventListener('admin-toggle-edit', onToggleEvt)
    window.removeEventListener('keydown', onPaletteKey)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminBarCleanup?.()
})

watch([changedCount, () => state.editMode, () => state.autosaveEnabled], scheduleAutosave)
</script>

<template>
  <div v-if="state.canEdit">
    <!-- Single Persistent Floating Container -->
    <div
      ref="barEl"
      class="admin-floating-dock fixed z-[999990] select-none transition-all duration-150"
      :style="dockStyle"
    >
      <!-- Minimized Mode -->
      <div
        v-if="state.minimized"
        class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-950/90 text-white border border-white/15 shadow-2xl backdrop-blur-xl"
      >
        <div
          class="flex items-center justify-center w-5 h-6 text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing"
          title="Drag to reposition"
          @mousedown="startDrag"
        >
          <AdminIcon name="grip" class="w-3.5 h-3.5" />
        </div>

        <button
          type="button"
          class="flex items-center gap-2 text-xs font-semibold hover:text-amber-300 transition-colors"
          @click="state.minimized = false"
          title="Click to expand editor dock"
        >
          <span class="w-2.5 h-2.5 rounded-full" :class="statusMeta.dot"></span>
          <span>Admin</span>
          <span
            v-if="changedCount > 0"
            class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30"
          >
            {{ changedCount }}
          </span>
          <AdminIcon name="maximize" class="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      <!-- Expanded Full Dock -->
      <div
        v-else
        class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/90 text-white border border-white/15 shadow-2xl backdrop-blur-xl"
        role="toolbar"
        aria-label="Admin Page Editor Dock"
      >
        <!-- Drag Gripper -->
        <div
          class="flex items-center justify-center w-5 h-7 text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing px-0.5"
          title="Drag dock to reposition"
          @mousedown="startDrag"
        >
          <AdminIcon name="grip" class="w-4 h-4" />
        </div>

        <!-- Edit / Preview Toggle Switch -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          :class="state.editMode
            ? 'bg-emerald-600/90 text-white shadow-sm shadow-emerald-900/40'
            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'"
          @click="state.editMode = !state.editMode"
          title="Toggle In-Place Edit Mode (⌘/Ctrl+E)"
        >
          <AdminIcon :name="state.editMode ? 'pencil' : 'eye'" class="w-3.5 h-3.5" />
          <span>{{ state.editMode ? 'Editing' : 'Preview' }}</span>
        </button>

        <div class="h-4 w-px bg-white/10 mx-0.5"></div>

        <!-- Slug & Quick Language Selector -->
        <div class="flex items-center gap-1.5 bg-zinc-900/80 px-2 py-1 rounded-xl border border-white/5 text-xs">
          <span class="text-zinc-400 text-[11px] truncate max-w-[100px]" :title="`Page: /${state.slug}`">
            /{{ state.slug || 'home' }}
          </span>

          <div class="flex items-center gap-0.5 bg-black/40 rounded-lg p-0.5 border border-white/5">
            <button
              v-for="l in availableLangs"
              :key="l"
              type="button"
              class="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded transition-colors"
              :class="lang.toUpperCase() === l
                ? 'bg-zinc-700 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'"
              @click="handleLangChange(l)"
              :title="`Switch to ${l}`"
            >
              {{ l }}
            </button>
          </div>
        </div>

        <!-- Status & Changed Count Badge -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium bg-zinc-900/60 transition-colors"
          :class="statusMeta.border"
          @click="state.inspectorOpen = true"
          :title="`Click to open Changes Inspector (${changedCount} modified)`"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="statusMeta.dot"></span>
          <span>{{ statusMeta.label }}</span>
        </button>

        <div class="h-4 w-px bg-white/10 mx-0.5"></div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-1">
          <!-- Save Button -->
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            :class="changedCount > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/30'
              : 'bg-zinc-900 text-zinc-500 border border-white/5 cursor-not-allowed'"
            :disabled="changedCount === 0 || saving"
            @click="saveDraft(true)"
            :title="saving ? 'Saving...' : (changedCount ? 'Save Changes (⌘/Ctrl+S)' : 'No changes to save')"
          >
            <AdminIcon
              :name="saving ? 'spinner' : 'save'"
              class="w-3.5 h-3.5"
              :class="{ 'animate-spin': saving }"
            />
            <span>Save</span>
          </button>

          <!-- Changes Inspector Toggle -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors relative"
            @click="state.inspectorOpen = true"
            title="Inspect Modified Fields (Diff Viewer)"
          >
            <AdminIcon name="diff" class="w-4 h-4" />
            <span
              v-if="changedCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center"
            >
              {{ changedCount }}
            </span>
          </button>

          <!-- History Toggle -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors"
            @click="state.historyOpen = true"
            title="Open Revision History"
          >
            <AdminIcon name="history" class="w-4 h-4" />
          </button>

          <!-- Discard All -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/5 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="changedCount === 0 || saving"
            @click="discardWithConfirm"
            title="Discard All Changes (Esc)"
          >
            <AdminIcon name="undo" class="w-4 h-4" />
          </button>

          <!-- Command Palette -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors"
            @click="state.paletteOpen = true"
            title="Command Palette (⌘/Ctrl+K)"
          >
            <AdminIcon name="command" class="w-4 h-4" />
          </button>

          <!-- Minimize Button -->
          <button
            type="button"
            class="w-7 h-8 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 flex items-center justify-center transition-colors"
            @click="state.minimized = true"
            title="Minimize Dock"
          >
            <AdminIcon name="minimize" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Changes Inspector Drawer -->
    <ChangesDrawer
      :open="state.inspectorOpen"
      @close="state.inspectorOpen = false"
    />

    <!-- History & Rollback Modal -->
    <HistoryModal
      :open="state.historyOpen"
      @close="state.historyOpen = false"
    />

    <!-- Command Palette Modal -->
    <teleport to="body">
      <transition name="admin-modal">
        <div
          v-if="state.paletteOpen"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999999] flex items-start justify-center pt-24 p-4"
          @click.self="state.paletteOpen = false"
        >
          <div class="bg-zinc-950 text-white rounded-2xl shadow-2xl border border-white/10 w-full max-w-xl overflow-hidden flex flex-col">
            <!-- Search Bar -->
            <div class="p-4 border-b border-white/10 flex items-center gap-3">
              <AdminIcon name="command" class="w-5 h-5 text-amber-400 shrink-0" />
              <input
                id="admin-palette-input"
                v-model="paletteQuery"
                type="text"
                placeholder="Type a command or search actions..."
                class="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                autofocus
              />
              <kbd class="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded border border-white/10">Esc</kbd>
            </div>

            <!-- Command List -->
            <div class="max-h-80 overflow-y-auto p-2 space-y-1">
              <button
                v-for="(cmd, i) in filteredCommands"
                :key="cmd.id"
                type="button"
                class="w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-colors"
                :class="paletteActiveIndex === i ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30' : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'"
                @click="cmd.action(); state.paletteOpen = false"
                @mouseenter="paletteActiveIndex = i"
              >
                <div class="flex items-center gap-2.5">
                  <AdminIcon :name="cmd.icon" class="w-4 h-4 text-zinc-400" />
                  <span class="font-medium">{{ cmd.label }}</span>
                </div>
                <kbd v-if="cmd.shortcut" class="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded border border-white/10">
                  {{ cmd.shortcut }}
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.admin-floating-dock {
  touch-action: none;
}

.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>

