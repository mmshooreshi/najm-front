<!-- components/admin/HistoryModal.client.vue -->
<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import {
  adminEditState as state,
  getAllPaths,
  getAllLangs,
  getVersions,
  restoreVersion,
  revertPathToOriginal
} from '@/store/adminEditStore'
import DiffPreview from '~/components/admin/DiffPreview.vue'

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
  if (!ui.lang) ui.lang = state.language || langs.value[0]
})

const versions = computed(() => ui.path && ui.lang ? getVersions(ui.path, ui.lang) : [])

function close() { emit('close') }

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
}

function copyValue(v: string) {
  navigator.clipboard.writeText(v)
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="props.open"
        class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
          <!-- Close button -->
          <button class="absolute top-3 right-3 text-gray-500 hover:text-black" @click="close">
            <Icon name="material-symbols:close-rounded" class="w-6 h-6" />
          </button>

          <!-- Header -->
          <div class="flex items-center gap-2 mb-4">
            <Icon name="material-symbols:history" class="w-6 h-6 text-amber-500" />
            <h2 class="text-lg font-semibold">Edit History</h2>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <label class="text-sm text-gray-600">Path</label>
            <select v-model="ui.path" class="text-sm border rounded px-2 py-1">
              <option v-for="p in paths" :key="p" :value="p">{{ p }}</option>
            </select>
            <label class="text-sm text-gray-600">Language</label>
            <select v-model="ui.lang" class="text-sm border rounded px-2 py-1">
              <option v-for="l in langs" :key="l" :value="l">{{ l }}</option>
            </select>
            <div class="ml-auto flex items-center gap-2">
              <label class="text-xs text-gray-600">Compare</label>
              <select v-model="ui.compareTarget" class="text-xs border rounded px-2 py-1">
                <option value="current">Current</option>
                <option value="original">Original</option>
              </select>
            </div>
          </div>

          <!-- Current vs Original quick view -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Original</p>
              <div class="bg-gray-50 p-2 rounded whitespace-pre-line min-h-[48px]">
                {{ state.changes[ui.path]?.[ui.lang]?.original || '—' }}
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Current Draft</p>
              <div class="bg-yellow-50 p-2 rounded whitespace-pre-line min-h-[48px]">
                {{ state.changes[ui.path]?.[ui.lang]?.value || '—' }}
              </div>
            </div>
          </div>

          <!-- Versions list -->
          <div v-if="versions.length" class="mt-4">
            <p class="text-sm font-medium text-gray-500 mb-1">Previous Versions</p>
            <ul class="space-y-2 max-h-72 overflow-auto">
              <li
                v-for="(v, i) in versions"
                :key="i"
                class="border rounded p-2 hover:bg-gray-50"
              >
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-xs"
                        :class="{
                          'bg-blue-50 text-blue-700': v.type==='original',
                          'bg-yellow-50 text-yellow-800': v.type==='draft',
                          'bg-emerald-50 text-emerald-800': v.type==='saved',
                        }">
                    {{ v.type }}
                  </span>
                  <span class="text-xs text-gray-500" :title="v.date">{{ timeAgo(v.date) }}</span>
                  <div class="ml-auto flex items-center gap-1">
                    <button class="text-xs px-2 py-1 rounded border hover:bg-white flex items-center gap-1"
                            @click="ui.previewIndex = (ui.previewIndex === i ? -1 : i)">
                      <Icon name="mdi:compare" /> Preview diff
                    </button>
                    <button class="text-xs px-2 py-1 rounded border hover:bg-white flex items-center gap-1"
                            @click="doRestore(v.value)">
                      <Icon name="mdi:backup-restore" /> Restore
                    </button>
                    <button class="text-xs px-2 py-1 rounded border hover:bg-white flex items-center gap-1"
                            @click="copyValue(v.value)">
                      <Icon name="mdi:content-copy" /> Copy
                    </button>
                  </div>
                </div>
                <div class="text-sm text-gray-800 whitespace-pre-line mt-1">
                  {{ v.value || '—' }}
                </div>
                <div v-if="ui.previewIndex === i" class="mt-2 border-t pt-2">
                  <DiffPreview
                    :before="ui.compareTarget==='original' ? state.changes[ui.path]?.[ui.lang]?.original ?? '' : state.changes[ui.path]?.[ui.lang]?.value ?? ''"
                    :after="v.value"
                  />
                </div>
              </li>
            </ul>
          </div>

          <!-- Footer actions -->
          <div class="mt-4 flex items-center justify-between">
            <button class="text-sm px-3 py-1.5 rounded-xl border inline-flex items-center gap-1"
                    @click="revertPathToOriginal(ui.path, ui.lang)">
              <Icon name="mdi:restore-alert" /> Revert to original
            </button>
            <button class="text-sm px-3 py-1.5 rounded-xl border inline-flex items-center gap-1" @click="close">
              <Icon name="mdi:check" /> Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>