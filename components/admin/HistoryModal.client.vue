<!-- components/admin/HistoryModal.client.vue -->
<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import {
  adminEditState as state,
  getAllPaths,
  getAllLangs,
  getVersions,
  restoreVersion,
  revertPath
} from '@/store/adminEditStore'
import DiffPreview from '~/components/admin/DiffPreview.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const ui = reactive({
  path: '' as string,
  lang: '' as string,
  compareTarget: 'current' as 'current' | 'original',
  previewIndex: -1,
})

const paths = computed(() => getAllPaths())
const langs = computed(() => getAllLangs())

watchEffect(() => {
  if (!ui.path && paths.value.length) ui.path = paths.value[0]
  if (!ui.lang) ui.lang = state.language || langs.value[0] || 'FA'
})

const currentRecord = computed(() => state.changes[ui.path]?.[ui.lang])
const versions = computed(() => ui.path && ui.lang ? getVersions(ui.path, ui.lang) : [])

function close() {
  state.historyOpen = false
  emit('close')
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function doRestore(v: string) {
  restoreVersion(ui.path, ui.lang, v)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Restored version for "${ui.path}"` } }))
}

function copyValue(v: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(v)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'Copied to clipboard' } }))
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="admin-modal">
      <div
        v-if="props.open"
        class="fixed inset-0 bg-black/75 backdrop-blur-md z-[999999] flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="bg-zinc-950 text-white rounded-2xl shadow-2xl border border-white/15 w-full max-w-3xl p-6 relative max-h-[90vh] flex flex-col">
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer z-10"
            @click="close"
            title="Close (Esc)"
          >
            <AdminIcon name="close" class="w-5 h-5" />
          </button>

          <!-- Header -->
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AdminIcon name="history" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Revision History</h2>
              <p class="text-xs text-zinc-400">Inspect version snapshots, diff comparisons, and restore earlier revisions</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-white/5 mb-4">
            <div class="flex items-center gap-2 flex-1 min-w-[200px]">
              <label class="text-xs text-zinc-400 font-medium">Path:</label>
              <select
                v-model="ui.path"
                class="flex-1 text-xs bg-zinc-800 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
              >
                <option v-for="p in paths" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-zinc-400 font-medium">Lang:</label>
              <select
                v-model="ui.lang"
                class="text-xs bg-zinc-800 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50 uppercase"
              >
                <option v-for="l in langs" :key="l" :value="l">{{ l.toUpperCase() }}</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-zinc-400 font-medium">Compare with:</label>
              <select
                v-model="ui.compareTarget"
                class="text-xs bg-zinc-800 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
              >
                <option value="current">Current Draft</option>
                <option value="original">Original Baseline</option>
              </select>
            </div>
          </div>

          <!-- Current vs Original Quick Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div class="bg-zinc-900/40 rounded-xl p-3 border border-white/5">
              <div class="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1.5">
                <span>Original Baseline</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Original</span>
              </div>
              <div class="text-xs text-zinc-300 whitespace-pre-wrap max-h-24 overflow-y-auto bg-black/30 p-2 rounded-lg leading-relaxed">
                {{ currentRecord?.original || '—' }}
              </div>
            </div>

            <div class="bg-zinc-900/40 rounded-xl p-3 border border-white/5">
              <div class="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1.5">
                <span>Current Value</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Current</span>
              </div>
              <div class="text-xs text-amber-200 whitespace-pre-wrap max-h-24 overflow-y-auto bg-black/30 p-2 rounded-lg leading-relaxed font-medium">
                {{ currentRecord?.draft ?? currentRecord?.value ?? '—' }}
              </div>
            </div>
          </div>

          <!-- Versions timeline list -->
          <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[160px]">
            <div v-if="versions.length === 0" class="text-center py-10 text-zinc-500 text-xs">
              No version history recorded yet for this field.
            </div>

            <div
              v-for="(v, i) in versions"
              :key="i"
              class="border border-white/10 bg-zinc-900/50 rounded-xl p-3 hover:bg-zinc-900/80 transition-colors"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                    :class="{
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30': v.type === 'original',
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30': v.type === 'draft',
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': v.type === 'saved'
                    }"
                  >
                    {{ v.type }}
                  </span>
                  <span class="text-xs text-zinc-400" :title="new Date(v.date).toLocaleString()">
                    {{ timeAgo(v.date) }} &middot; {{ new Date(v.date).toLocaleTimeString() }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    class="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1 transition-colors"
                    @click="ui.previewIndex = (ui.previewIndex === i ? -1 : i)"
                  >
                    <AdminIcon name="diff" class="w-3.5 h-3.5" />
                    {{ ui.previewIndex === i ? 'Hide Diff' : 'Compare' }}
                  </button>

                  <button
                    type="button"
                    class="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                    @click="doRestore(v.value)"
                  >
                    <AdminIcon name="undo" class="w-3.5 h-3.5" />
                    Restore
                  </button>

                  <button
                    type="button"
                    class="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1 transition-colors"
                    @click="copyValue(v.value)"
                    title="Copy value"
                  >
                    <AdminIcon name="copy" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Version value content -->
              <div class="text-xs text-zinc-300 whitespace-pre-wrap bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                {{ v.value || '—' }}
              </div>

              <!-- Diff expansion -->
              <div v-if="ui.previewIndex === i" class="mt-2.5 pt-2.5 border-t border-white/10">
                <div class="text-[11px] text-zinc-400 font-medium mb-1 flex items-center gap-1">
                  <span>Comparison with {{ ui.compareTarget === 'original' ? 'Original Baseline' : 'Current Draft' }}:</span>
                </div>
                <DiffPreview
                  :before="ui.compareTarget === 'original' ? currentRecord?.original ?? '' : currentRecord?.draft ?? currentRecord?.value ?? ''"
                  :after="v.value"
                  mode="inline"
                />
              </div>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              class="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="revertPath(ui.path, ui.lang)"
            >
              <AdminIcon name="undo" class="w-4 h-4" />
              Revert to original baseline
            </button>

            <button
              type="button"
              class="text-xs px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="close"
            >
              <AdminIcon name="check" class="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>