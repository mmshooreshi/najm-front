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
  discardAllChanges,
  toggleGlobalMotionPaused
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

// --- Ultra-Smooth, Rubbery, GPU-Accelerated Drag Engine ---
const barEl = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// Positions (in pixel coordinates)
const pos = reactive({
  x: 0,
  y: 0,
  isInitialized: false
})

// Remember user placements for expanded vs collapsed
const expandedPos = reactive({ x: 0, y: 0, saved: false })
const collapsedPos = reactive({ x: 0, y: 0, saved: false })

let startPointerX = 0
let startPointerY = 0
let startPosX = 0
let startPosY = 0
let activePointerId: number | null = null
let rafId: number | null = null

// Viewport Safe Clamping with margin
function clampPosition(x: number, y: number, margin = 12): { x: number; y: number } {
  if (typeof window === 'undefined') return { x, y }
  const barW = barEl.value?.offsetWidth || (state.minimized ? 140 : 640)
  const barH = barEl.value?.offsetHeight || 48

  const maxX = Math.max(margin, window.innerWidth - barW - margin)
  const maxY = Math.max(margin, window.innerHeight - barH - margin)

  return {
    x: Math.max(margin, Math.min(maxX, x)),
    y: Math.max(margin, Math.min(maxY, y))
  }
}

// Ensure the bar always smoothly fits inside the viewport
function fitIntoViewport() {
  if (typeof window === 'undefined' || !pos.isInitialized) return
  const clamped = clampPosition(pos.x, pos.y)
  pos.x = clamped.x
  pos.y = clamped.y
}

// Pointer Drag Handlers
function onPointerDown(e: PointerEvent) {
  // Only primary mouse button or touch
  if (e.button !== 0 && e.pointerType === 'mouse') return

  const target = e.currentTarget as HTMLElement
  if (target.setPointerCapture) {
    target.setPointerCapture(e.pointerId)
  }
  activePointerId = e.pointerId

  isDragging.value = true
  startPointerX = e.clientX
  startPointerY = e.clientY
  startPosX = pos.x
  startPosY = pos.y

  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp, { passive: false })
  window.addEventListener('pointercancel', onPointerUp, { passive: false })
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || (activePointerId !== null && e.pointerId !== activePointerId)) return

  e.preventDefault()

  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    const dx = e.clientX - startPointerX
    const dy = e.clientY - startPointerY

    // Raw new target pos
    const rawX = startPosX + dx
    const rawY = startPosY + dy

    // Rubber-band resistance if dragged beyond viewport boundary
    const margin = 12
    const barW = barEl.value?.offsetWidth || 200
    const barH = barEl.value?.offsetHeight || 48
    const minX = margin
    const maxX = window.innerWidth - barW - margin
    const minY = margin
    const maxY = window.innerHeight - barH - margin

    let targetX = rawX
    let targetY = rawY

    // Apply elastic resistance outside bounds
    if (rawX < minX) targetX = minX + (rawX - minX) * 0.25
    else if (rawX > maxX) targetX = maxX + (rawX - maxX) * 0.25

    if (rawY < minY) targetY = minY + (rawY - minY) * 0.25
    else if (rawY > maxY) targetY = maxY + (rawY - maxY) * 0.25

    pos.x = targetX
    pos.y = targetY
  })
}

function onPointerUp(e: PointerEvent) {
  if (activePointerId !== null && e.pointerId !== activePointerId) return

  isDragging.value = false
  activePointerId = null
  if (rafId) cancelAnimationFrame(rafId)

  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)

  // Snap back smoothly into safe viewport boundaries with rubber spring
  const clamped = clampPosition(pos.x, pos.y)
  pos.x = clamped.x
  pos.y = clamped.y

  // Save current position state
  savePositionState()
}

function savePositionState() {
  try {
    if (state.minimized) {
      collapsedPos.x = pos.x
      collapsedPos.y = pos.y
      collapsedPos.saved = true
    } else {
      expandedPos.x = pos.x
      expandedPos.y = pos.y
      expandedPos.saved = true
    }
    localStorage.setItem('admin_dock_expanded', JSON.stringify({ x: expandedPos.x, y: expandedPos.y }))
    localStorage.setItem('admin_dock_collapsed', JSON.stringify({ x: collapsedPos.x, y: collapsedPos.y }))
  } catch {}
}

function restoreInitialPosition() {
  if (typeof window === 'undefined') return
  try {
    const rawExp = localStorage.getItem('admin_dock_expanded')
    const rawCol = localStorage.getItem('admin_dock_collapsed')
    if (rawExp) {
      const p = JSON.parse(rawExp)
      if (typeof p.x === 'number' && typeof p.y === 'number') {
        expandedPos.x = p.x
        expandedPos.y = p.y
        expandedPos.saved = true
      }
    }
    if (rawCol) {
      const p = JSON.parse(rawCol)
      if (typeof p.x === 'number' && typeof p.y === 'number') {
        collapsedPos.x = p.x
        collapsedPos.y = p.y
        collapsedPos.saved = true
      }
    }
  } catch {}

  // Calculate default bottom-center position
  const defaultX = Math.round((window.innerWidth - 640) / 2)
  const defaultY = window.innerHeight - 80

  if (state.minimized) {
    pos.x = collapsedPos.saved ? collapsedPos.x : (defaultX + 240)
    pos.y = collapsedPos.saved ? collapsedPos.y : defaultY
  } else {
    pos.x = expandedPos.saved ? expandedPos.x : defaultX
    pos.y = expandedPos.saved ? expandedPos.y : defaultY
  }

  const clamped = clampPosition(pos.x, pos.y)
  pos.x = clamped.x
  pos.y = clamped.y
  pos.isInitialized = true
}

// Watch minimization changes to smoothly adapt and fit coordinates
watch(
  () => state.minimized,
  async (isMin) => {
    await nextTick()
    if (!pos.isInitialized) return

    if (isMin) {
      // Transitioning to Collapsed:
      if (collapsedPos.saved) {
        pos.x = collapsedPos.x
        pos.y = collapsedPos.y
      }
    } else {
      // Transitioning to Expanded:
      if (expandedPos.saved) {
        pos.x = expandedPos.x
        pos.y = expandedPos.y
      }
    }

    // Always clamp to viewport on state change so expanded view never goes offscreen
    fitIntoViewport()
  }
)

// Computed style for ultra-smooth 60fps GPU transform
const dockTransformStyle = computed(() => {
  if (!pos.isInitialized) {
    return {
      left: '50%',
      bottom: '24px',
      transform: 'translateX(-50%)',
      opacity: '0'
    }
  }

  return {
    transform: `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0) ${isDragging.value ? 'scale(1.02)' : 'scale(1)'}`,
    transition: isDragging.value
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, opacity 0.2s ease',
    opacity: '1'
  }
})

// --- Command Palette ---
const commands = computed(() => [
  { id: 'toggle-edit', icon: 'pencil', label: state.editMode ? 'Disable Edit Mode (Preview)' : 'Enable Edit Mode', shortcut: '⌘E', action: () => (state.editMode = !state.editMode) },
  { id: 'toggle-motion', icon: state.isMotionPausedGlobally ? 'play' : 'pause', label: state.isMotionPausedGlobally ? 'Resume All Animations & Motions' : 'Pause / Freeze All Animations & Motions', shortcut: '⌘P', action: () => toggleGlobalMotionPaused() },
  { id: 'media-studio', icon: 'sparkles', label: 'Open Media Studio & Asset Manager', shortcut: '', action: () => { state.mediaStudioOpen = true; if (!state.activeMediaInitialUrl) state.activeMediaInitialUrl = '/images/sections/cards/01.png' } },
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
  nextTick(() => {
    restoreInitialPosition()
  })

  window.addEventListener('resize', fitIntoViewport, { passive: true })

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
    window.removeEventListener('resize', fitIntoViewport)
    window.removeEventListener('admin-save', onSaveEvt)
    window.removeEventListener('admin-discard', onDiscardEvt)
    window.removeEventListener('admin-toggle-edit', onToggleEvt)
    window.removeEventListener('keydown', onPaletteKey)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminBarCleanup?.()
  if (rafId) cancelAnimationFrame(rafId)
})

watch([changedCount, () => state.editMode, () => state.autosaveEnabled], scheduleAutosave)
</script>

<template>
  <div v-if="state.canEdit">
    <!-- Single Floating Dock Root -->
    <div
      ref="barEl"
      class="admin-floating-dock fixed top-0 left-0 z-[999990] select-none touch-none will-change-transform"
      :style="dockTransformStyle"
    >
      <!-- Minimized Mode -->
      <div
        v-if="state.minimized"
        class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-950/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl transition-shadow"
        :class="{ 'ring-2 ring-amber-400/40 shadow-amber-500/20': isDragging }"
      >
        <div
          class="flex items-center justify-center w-6 h-7 text-zinc-400 hover:text-zinc-200 cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reposition dock"
          @pointerdown="onPointerDown"
        >
          <AdminIcon name="grip" class="w-3.5 h-3.5" />
        </div>

        <button
          type="button"
          class="flex items-center gap-2 text-xs font-semibold hover:text-amber-300 transition-colors cursor-pointer"
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
        class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl transition-shadow"
        :class="{ 'ring-2 ring-emerald-400/40 shadow-emerald-500/20': isDragging }"
        role="toolbar"
        aria-label="Admin Page Editor Dock"
      >
        <!-- Drag Gripper Handle -->
        <div
          class="flex items-center justify-center w-6 h-8 text-zinc-400 hover:text-zinc-200 cursor-grab active:cursor-grabbing px-0.5 rounded-lg hover:bg-white/5 shrink-0"
          title="Drag dock to reposition smoothly"
          @pointerdown="onPointerDown"
        >
          <AdminIcon name="grip" class="w-4 h-4" />
        </div>

        <!-- Edit / Preview Toggle Switch -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          :class="state.editMode
            ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-900/40'
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
          <span class="text-zinc-400 text-[11px] truncate max-w-[90px]" :title="`Page: /${state.slug}`">
            /{{ state.slug || 'home' }}
          </span>

          <div class="flex items-center gap-0.5 bg-black/40 rounded-lg p-0.5 border border-white/5">
            <button
              v-for="l in availableLangs"
              :key="l"
              type="button"
              class="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded transition-colors cursor-pointer"
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
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium bg-zinc-900/60 transition-colors cursor-pointer"
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
            class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            :class="changedCount > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-900/30'
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
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors relative cursor-pointer"
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
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors cursor-pointer"
            @click="state.historyOpen = true"
            title="Open Revision History"
          >
            <AdminIcon name="history" class="w-4 h-4" />
          </button>

          <!-- Motion Freeze / Pause Toggle -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
            :class="state.isMotionPausedGlobally
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-white/5'"
            @click="toggleGlobalMotionPaused"
            :title="state.isMotionPausedGlobally ? 'Resume All Motions & Animations (Play)' : 'Pause / Freeze All Motions & Animations (Pause)'"
          >
            <AdminIcon :name="state.isMotionPausedGlobally ? 'play' : 'pause'" class="w-3.5 h-3.5" />
          </button>

          <!-- Discard All -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/5 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            :disabled="changedCount === 0 || saving"
            @click="discardWithConfirm"
            title="Discard All Changes (Esc)"
          >
            <AdminIcon name="undo" class="w-4 h-4" />
          </button>

          <!-- Command Palette -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 flex items-center justify-center transition-colors cursor-pointer"
            @click="state.paletteOpen = true"
            title="Command Palette (⌘/Ctrl+K)"
          >
            <AdminIcon name="command" class="w-4 h-4" />
          </button>

          <!-- Minimize Button -->
          <button
            type="button"
            class="w-7 h-8 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
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
  user-select: none;
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
