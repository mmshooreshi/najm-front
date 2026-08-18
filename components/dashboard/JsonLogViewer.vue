<!-- components/dashboard/JsonLogViewer.vue -->
<template>
  <div class="w-full h-full flex flex-col font-mono text-xs select-text overflow-hidden bg-[#070a12]">
    <!-- Top Minimalist Bar (Borderless) -->
    <div class="h-8 px-3 bg-[#0d121f] border-b border-white/[0.05] flex items-center justify-between shrink-0 select-none text-[11px]">
      <div class="flex items-center gap-2">
        <span class="text-slate-400 text-[10px]">
          {{ payloadLabel }}
        </span>
        <span class="text-slate-600 text-[10px]">•</span>
        <span class="text-slate-500 text-[10px]">{{ jsonSize }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="toggleAll(true)"
          class="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-[10px] transition cursor-pointer"
        >
          گسترش همه
        </button>
        <button
          @click="toggleAll(false)"
          class="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-[10px] transition cursor-pointer"
        >
          بستن همه
        </button>
        <button
          @click="copyJson"
          class="px-2 py-0.5 rounded text-emerald-400 hover:bg-white/[0.04] text-[10px] transition cursor-pointer flex items-center gap-1"
        >
          <Icon name="mdi:content-copy" class="w-3 h-3" />
          <span>{{ copied ? 'کپی شد' : 'کپی' }}</span>
        </button>
      </div>
    </div>

    <!-- Butter Tree Stream (Borderless, seamless) -->
    <div class="flex-1 p-3 overflow-y-auto space-y-0.5 bg-[#070a12] text-left ltr selection:bg-emerald-800 selection:text-white">
      <div v-if="!data || rootKeys.length === 0" class="text-slate-600 py-4 text-center">
        (empty)
      </div>

      <JsonTreeNode
        v-for="k in rootKeys"
        :key="String(k)"
        :key-name="String(k)"
        :val="data[k]"
        :depth="0"
        :global-expand="expandState"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JsonTreeNode from './JsonTreeNode.vue'

const props = defineProps<{
  data: any
}>()

const copied = ref(false)
const expandState = ref<boolean | null>(true)

const isArray = computed(() => Array.isArray(props.data))

const rootKeys = computed(() => {
  if (!props.data || typeof props.data !== 'object') return []
  if (Array.isArray(props.data)) return props.data.map((_, i) => i)
  return Object.keys(props.data)
})

const payloadLabel = computed(() => {
  if (isArray.value) {
    return 'Array [' + rootKeys.value.length + ']'
  }
  return 'Object {' + rootKeys.value.length + '}'
})

const jsonSize = computed(() => {
  try {
    const str = JSON.stringify(props.data)
    return `${(str.length / 1024).toFixed(1)} KB`
  } catch (e) {
    return '0 KB'
  }
})

function toggleAll(expand: boolean) {
  expandState.value = expand
}

function copyJson() {
  try {
    navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    // Ignore
  }
}
</script>
