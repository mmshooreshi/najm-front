<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    @keydown.esc="$emit('close')"
    tabindex="0"
  >
    <div
      class="relative bg-white/80 overflow-auto max-h-[80vh] dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg shadow-2xl ring-1 ring-black/10 transition-all"
    >
      <!-- Close Button -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        @click="$emit('close')"
        title="Close"
      >
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>

      <!-- Title -->
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ file.filename }}
      </h2>

      <!-- Standard URL -->
      <CopyableBlock
        :value="getUrlStandard(file)"
        containerClass="mb-4 bg-white/5 p-2 rounded-md border border-gray-200 dark:border-gray-700"
        iconPosition="center-right"
        triggerIcon="mdi:open-in-new"
        copyLabel="Copy URL"
        copiedLabel="URL Copied!"
      >
        <p class="line-clamp-3 min-w-0 break-words whitespace-pre-wrap">
          {{ getUrlStandard(file) }}
        </p>
      </CopyableBlock>

      <!-- Known Properties -->
      <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <li><strong>Type:</strong> {{ file.mime }}</li>
        <li><strong>Size:</strong> {{ (file.size / 1024).toFixed(1) }} KB</li>
        <li><strong>Dimensions:</strong> {{ file.width }} × {{ file.height }}</li>
        <li><strong>Duration:</strong> {{ file.duration ?? 'n/a' }}</li>
        <li>
          <strong>Uploaded:</strong>
          {{ new Date(file.created).toLocaleString() }}
        </li>
      </ul>

      <!-- Extra Properties -->
      <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li v-for="(val, key) in extraProps" :key="key">
          <CopyableBlock
            :value="String(val)"
            containerClass="bg-white/5 p-2 rounded-md border border-gray-200 dark:border-gray-700"
            iconPosition="center-right"
            triggerIcon="mdi:content-copy"
            copyLabel="Copy"
            copiedLabel="Copied!"
          >
            <p class="line-clamp-3 min-w-0 break-words whitespace-pre-wrap">
              <strong>{{ key }}:</strong> {{ val }}
            </p>
          </CopyableBlock>
        </li>
      </ul>

      <!-- Bottom Close Button -->
      <button
        class="btn btn-sm mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'
import CopyableBlock from '~/components/CopyWrapper.vue'

const props = defineProps<{ file: Record<string, any> }>()
const emit = defineEmits(['close'])

// Known keys to exclude
const knownKeys = new Set([
  'filename', 'mime', 'size', 'width', 'height', 'duration', 'created'
])

const extraProps = computed(() => {
  return Object.fromEntries(
    Object.entries(props.file).filter(([k]) => !knownKeys.has(k))
  )
})

function getUrlStandard(f: any): string {
  const pb = usePocketBase()
  return pb.files.getURL(f, f.file)
}

// Close on Escape
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
