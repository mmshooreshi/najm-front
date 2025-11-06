<!-- components/admin/AdminEditBar.client.vue -->
<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import HistoryModal from "~/components/admin/HistoryModal.client.vue"

import { invalidatePageUI } from '~/composables/ui/pageUiCache.ts'


import {
  adminEditState as state,
  buildChangesPayload,
  recordSavedVersions,
  changedCountForLang,
  discardAllChanges,
  isChanged
} from '@/store/adminEditStore'

/**
 * ✨ What’s new
 * - Clearer status (Saved / Saving… / Unsaved / Error) with a status dot & helpful tooltips
 * - Autosave (toggleable) with smart debounce & activity awareness
 * - Rich command palette with search, keyboard navigation, & shortcut hints
 * - Safer discard flow + page unload protection if there are unsaved changes
 * - More accessible (ARIA labels/roles), better contrast, tighter spacing on mobile
 * - Better error handling & toasts, plus one‑click JSON export of the save payload
 */

const saving = ref(false)
const paletteOpen = ref(false)
const helpOpen = ref(false)
const historyOpen = ref(false)
const autosaveEnabled = ref(false)
const autosaveDelayMs = ref(2000) // debounce window for autosave
const lastError = ref<string | null>(null)
const paletteQuery = ref('')
const paletteActiveIndex = ref(0)
let autosaveTimer: number | null = null

const lang = computed(() => state.language)
const changedCount = computed(() => changedCountForLang(lang.value))

const lastSavedDate = computed(() => (state.lastSavedAt ? new Date(state.lastSavedAt) : null))

const lastSavedLabel = computed(() => {
  if (!lastSavedDate.value) return '—'
  const d = lastSavedDate.value
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
})

const exactSavedLabel = computed(() =>
  lastSavedDate.value ? lastSavedDate.value.toLocaleString() : 'Not saved yet'
)

const status = computed<'saved' | 'saving' | 'unsaved' | 'error'>(() => {
  if (saving.value) return 'saving'
  if (lastError.value) return 'error'
  if (changedCount.value > 0) return 'unsaved'
  return 'saved'
})

const statusMeta = computed(() => {
  switch (status.value) {
    case 'saving':
      return { label: 'Saving…', dot: 'bg-sky-500', title: 'Persisting your draft' }
    case 'unsaved':
      return { label: 'Unsaved', dot: 'bg-amber-500', title: 'You have local changes' }
    case 'error':
      return { label: 'Error', dot: 'bg-rose-500', title: 'Last save failed — see details' }
    default:
      return { label: 'Saved', dot: 'bg-emerald-500', title: 'All changes saved' }
  }
})

async function saveDraft(manual = false) {
  if (!state || saving.value || changedCount.value === 0) {
    if (manual) console.warn('[AdminEdit] save skipped (no changes or busy)')
    return
  }

  saving.value = true
  lastError.value = null
  const currentLang = lang.value
  const payload = buildChangesPayload(currentLang)
  console.log(`[AdminEdit] saving "${state.slug}" [${currentLang}] (${payload.length} changes)`) // eslint-disable-line no-console

  try {
    await $fetch('/api/admin/ui/save-draft', {
      method: 'POST',
      body: { slug: state.slug, language: currentLang, changes: payload }
    })

    // Record saved versions and promote originals
    // recordSavedVersions(currentLang, payload.map(p => p.path))
    // for (const { path } of payload) {
    //   const rec = state.changes[path]?.[currentLang]
    //   if (rec) rec.original = rec.value
    // }
    // Mark current changed blocks so they fade out green and DO NOT reappear yellow
    document.querySelectorAll('.v-changed-block').forEach(el => el.classList.add('v-saved-fade'))
    document.documentElement.classList.add('v-just-saved')
    // After the slide-out, promote originals and then drop the flag
    window.setTimeout(() => {
      recordSavedVersions(currentLang, payload.map(p => p.path))
      for (const { path } of payload) {
        const rec = state.changes[path]?.[currentLang]
        if (rec) rec.original = rec.value
      }

      // Optimistic UI: nothing to do — your DOM is already showing the draft/value.
      // Then revalidate PocketBase data so next loads are fresh:
      invalidatePageUI(state.slug)

      // document.documentElement.classList.remove('v-just-saved')
    }, 700) // allow a beat after the 0.5s animation

    state.lastSavedAt = new Date().toISOString()
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'Draft saved' } }))
    console.log('[AdminEdit] save OK') // eslint-disable-line no-console
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Unknown error'
    lastError.value = msg
    console.error('[AdminEdit] save failed:', e) // eslint-disable-line no-console
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: `Failed to save draft: ${msg}` } }))
  } finally {
    saving.value = false
    invalidatePageUI(state.slug)

  }


}

function scheduleAutosave() {
  if (!autosaveEnabled.value || changedCount.value === 0 || saving.value) {
    if (autosaveTimer) {
      window.clearTimeout(autosaveTimer)
      autosaveTimer = null
    }
    return
  }
  if (autosaveTimer) window.clearTimeout(autosaveTimer)
  autosaveTimer = window.setTimeout(() => saveDraft(false), autosaveDelayMs.value)
}

function discardWithConfirm() {
  if (!changedCount.value) return
  // const ok = confirm('Discard ALL unsaved changes for the current language?')
  // if (!ok) return

  const langCode = lang.value
  discardAllChanges(langCode)

  // clean only those that were changed
  for (const [path, perLang] of Object.entries(state.changes)) {
    const rec = perLang[langCode]
    if (!rec) continue
    if (!isChanged(path, langCode)) {
      document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
        .forEach(el => { el.textContent = rec.original ?? '' })
    }
  }

  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'Draft discarded' } }))
}



function copyPayload() {
  const currentLang = lang.value
  const payload = buildChangesPayload(currentLang)
  const text = JSON.stringify({ slug: state.slug, language: currentLang, changes: payload }, null, 2)

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'Payload copied to clipboard' } })))
      .catch(() => fallbackCopy(text))
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy'); window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'Payload copied' } })) } catch {}
  document.body.removeChild(ta)
}

function downloadPayload() {
  const currentLang = lang.value
  const payload = buildChangesPayload(currentLang)
  const text = JSON.stringify({ slug: state.slug, language: currentLang, changes: payload }, null, 2)
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  a.href = url
  a.download = `draft-${state.slug}-${currentLang}-${ts}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function togglePalette(force?: boolean) {
  paletteOpen.value = typeof force === 'boolean' ? force : !paletteOpen.value
  if (paletteOpen.value) {
    nextTick(() => {
      const input = document.getElementById('admin-cmd-input') as HTMLInputElement | null
      input?.focus()
      paletteQuery.value = ''
      paletteActiveIndex.value = 0
    })
  }
}

function openHelp() {
  helpOpen.value = !helpOpen.value
  paletteOpen.value = true
}

// — Keyboard shortcuts —
function onKeydown(e: KeyboardEvent) {
  const isMeta = e.metaKey || e.ctrlKey
  if (isMeta && e.key.toLowerCase() === 's') {
    e.preventDefault(); saveDraft(true); return
  }
  if (isMeta && e.key.toLowerCase() === 'e') {
    e.preventDefault(); state.editMode = !state.editMode; return
  }
  if (isMeta && e.key.toLowerCase() === 'k') {
    e.preventDefault(); togglePalette(true); return
  }
  if (e.key === 'Escape') {
    if (paletteOpen.value) { togglePalette(false); return }
    if (changedCount.value) discardWithConfirm()
  }
  if (e.key === '?') {
    openHelp()
  }
}

// — Page‑leave guard when there are unsaved changes —
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (changedCount.value > 0 && !saving.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

// — Command palette —
const commands = computed(() => [
  { id: 'save', icon: 'mdi:content-save', label: 'Save draft', shortcut: '⌘/Ctrl+S', action: () => saveDraft(true), show: true },
  { id: 'discard', icon: 'mdi:backup-restore', label: 'Discard changes', shortcut: 'Esc', action: () => discardWithConfirm(), show: true },
  { id: 'toggle-edit', icon: 'mdi:pencil', label: state.editMode ? 'Disable edit mode' : 'Enable edit mode', shortcut: '⌘/Ctrl+E', action: () => (state.editMode = !state.editMode), show: true },
  { id: 'history', icon: 'mdi:history', label: 'Open history', shortcut: '', action: () => (historyOpen.value = true), show: true },
  { id: 'copy', icon: 'mdi:content-copy', label: 'Copy save payload (JSON)', shortcut: '', action: () => copyPayload(), show: true },
  { id: 'download', icon: 'mdi:file-download-outline', label: 'Download save payload (JSON)', shortcut: '', action: () => downloadPayload(), show: true },
  { id: 'autosave', icon: autosaveEnabled.value ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off', label: autosaveEnabled.value ? 'Turn off autosave' : 'Turn on autosave', shortcut: '', action: () => (autosaveEnabled.value = !autosaveEnabled.value), show: true },
  { id: 'help', icon: 'mdi:help-circle-outline', label: 'Quick help', shortcut: '?', action: () => (helpOpen.value = !helpOpen.value), show: true }
])

const filteredCommands = computed(() => {
  const q = paletteQuery.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter(c => c.label.toLowerCase().includes(q))
})

function onPaletteKey(e: KeyboardEvent) {
  if (!paletteOpen.value) return
  const max = filteredCommands.value.length - 1
  if (e.key === 'ArrowDown') { e.preventDefault(); paletteActiveIndex.value = Math.min(max, paletteActiveIndex.value + 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); paletteActiveIndex.value = Math.max(0, paletteActiveIndex.value - 1) }
  if (e.key === 'Enter') {
    const cmd = filteredCommands.value[paletteActiveIndex.value]
    if (cmd) { cmd.action(); togglePalette(false) }
  }
}
// --- Draggable bar logic (cursor sticks where clicked) ---
const barEl = ref<HTMLElement | null>(null)
let dragging = false
let offsetX = 0
let offsetY = 0

function startDrag(e: MouseEvent) {
  if (!barEl.value) return
  dragging = true

  const rect = barEl.value.getBoundingClientRect()
  // store the exact offset where you clicked
  offsetX = e.clientX - rect.left
  offsetY = e.clientY - rect.top

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragging || !barEl.value) return
  const x = e.clientX - offsetX
  const y = e.clientY - offsetY
  barEl.value.style.left = `${x}px`
  barEl.value.style.top = `${y}px`
}

function stopDrag() {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  // Hotkeys
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keydown', onPaletteKey)
  // Admin bus
  const onSave = () => saveDraft(true)
  const onDiscard = () => discardWithConfirm()
  const onToggleEdit = () => (state.editMode = !state.editMode)
  const onPalette = () => togglePalette(true)
  const onHelpEvt = () => openHelp()

  window.addEventListener('admin-save', onSave)
  window.addEventListener('admin-discard', onDiscard)
  window.addEventListener('admin-toggle-edit', onToggleEdit)
  window.addEventListener('admin-command-palette', onPalette)
  window.addEventListener('admin-help', onHelpEvt)
  window.addEventListener('beforeunload', onBeforeUnload)

  ;(window as any)._adminEditBarCleanup = () => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('keydown', onPaletteKey)
    window.removeEventListener('admin-save', onSave)
    window.removeEventListener('admin-discard', onDiscard)
    window.removeEventListener('admin-toggle-edit', onToggleEdit)
    window.removeEventListener('admin-command-palette', onPalette)
    window.removeEventListener('admin-help', onHelpEvt)
    window.removeEventListener('beforeunload', onBeforeUnload)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminEditBarCleanup?.()
})

// Re‑debounce autosave whenever the change count or edit mode changes
watch([changedCount, () => state.editMode, autosaveEnabled], scheduleAutosave, { immediate: false })
</script>



<template>

<div
  v-if="state.canEdit"
  ref="barEl"
  class="admin-edit-bar fixed z-[1000] left-[50%] top-[80%] cursor-move"
  @mousedown="startDrag"
>

  <div
    class="backdrop-blur-md bg-white/40 dark:bg-zinc-900/70 rounded-xl shadow-lg border border-black/10 dark:border-white/20
           px-2 py-1 flex items-center gap-2 text-xs select-none"
    :aria-label="`Admin editor for ${state.slug} (${lang})`"
  >
    <!-- Edit toggle -->
    <label class="flex items-center gap-1 cursor-pointer" title="Toggle Edit mode (⌘/Ctrl+E)">
      <label class="cl-checkbox">
        <input v-model="state.editMode" type="checkbox" aria-label="Toggle edit mode" />
        <span></span>
      </label>
      <span>Edit</span>
    </label>

    <!-- Slug + lang -->
    <span
      class="truncate max-w-[18ch] flex items-center gap-1 opacity-70"
      :title="`/${state.slug} · ${lang}`"
    >
      <Icon name="mdi:file-tree" class="shrink-0" />/{{ state.slug }} · {{ lang }}
    </span>

    <!-- Status -->
    <span
      class="flex items-center gap-1 px-1 py-0.5 rounded border text-[10px]"
      :class="{
        'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300': status==='saved',
        'bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300': status==='saving',
        'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300': status==='unsaved',
        'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300': status==='error'
      }"
      :title="statusMeta.title"
    >
      <span class="inline-block w-1.5 h-1.5 rounded-full" :class="statusMeta.dot"></span>
      <span>{{ statusMeta.label }}</span>
    </span>

    <!-- Changed count -->
    <span
      class="inline-flex items-center gap-1 px-1 py-0.5 rounded border bg-white/50 dark:bg-zinc-800/50 text-[10px]"
      title="Changed fields count"
    >
      <Icon name="mdi:counter" class="opacity-70" />
      <strong :class="changedCount ? 'text-amber-700 dark:text-amber-300' : 'opacity-70'">
        {{ changedCount }}
      </strong>
    </span>

    <!-- Autosave toggle (tiny) -->
    <button
      class="inline-flex items-center gap-1 px-1 py-0.5 rounded border text-[10px]"
      :class="autosaveEnabled
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
        : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-300'"
      @click="autosaveEnabled = !autosaveEnabled"
      title="Toggle autosave"
    >
      <Icon :name="autosaveEnabled ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" />
    </button>

    <!-- Action buttons -->
    <div class="flex items-center gap-1">
      <button
        class="px-2 py-0.5 rounded border inline-flex items-center gap-1 text-[11px] disabled:opacity-50"
        :disabled="changedCount === 0 || saving"
        @click="saveDraft(true)"
        :title="saving ? 'Saving…' : (changedCount ? 'Save changes (⌘/Ctrl+S)' : 'Nothing to save')"
      >
        <Icon :name="saving ? 'mdi:loading' : 'mdi:content-save'" :class="saving ? 'animate-spin' : ''" />
        {{ saving ? '…' : changedCount }}
      </button>

      <button
        class="px-2 py-0.5 rounded border inline-flex items-center gap-1 text-[11px] hover:bg-rose-50 dark:hover:bg-rose-900/20"
        @click="discardWithConfirm"
        title="Discard ALL unsaved changes (Esc)"
      >
        <Icon name="mdi:backup-restore" />
      </button>

      <button
        class="px-2 py-0.5 rounded border inline-flex items-center gap-1 text-[11px]"
        @click="historyOpen = true"
        title="Open history"
      >
        <Icon name="mdi:history" />
      </button>

      <button
        class="px-2 py-0.5 rounded border inline-flex items-center gap-1 text-[11px]"
        @click="togglePalette(true)"
        title="Command palette (⌘/Ctrl+K)"
      >
        <Icon name="mdi:command" />
      </button>
    </div>
  </div>

  <!-- History Modal -->
  <HistoryModal v-if="historyOpen" :open="historyOpen" @close="historyOpen = false" />
</div>

</template>

<style scoped>
.cl-checkbox { position: relative; display: inline-block; }
.cl-checkbox > input {
  appearance: none; position: absolute; left: -10px; top: -8px; width: 40px; height: 40px;
  opacity: 0; pointer-events: none;
}
.cl-checkbox > span { display: inline-block; width: 100%; cursor: pointer; }
.cl-checkbox > span::before {
  content: ''; display: inline-block; box-sizing: border-box; margin: 3px 11px 3px 1px;
  border: solid 2px rgba(0,0,0,.6); border-radius: 2px; width: 18px; height: 18px;
}
.cl-checkbox > span::after {
  content: ''; position: absolute; top: 3px; left: 1px; width: 10px; height: 5px;
  border: solid 2px transparent; border-top: none; border-right: none;
  transform: translate(4px, 5px) rotate(-45deg);
}
.cl-checkbox > input:checked + span::before { border-color: #018786; background-color: #018786; }
.cl-checkbox > input:checked + span::after { border-color: #fff; }

.fade-enter-active, .fade-leave-active { transition: opacity .18s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
