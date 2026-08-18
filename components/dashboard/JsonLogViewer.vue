<!-- components/dashboard/JsonLogViewer.vue -->
<template>
  <div class="w-full h-full flex flex-col font-mono text-xs select-text overflow-hidden bg-white">
    <!-- Top Bar (Light Theme) -->
    <div class="h-9 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none text-[11px]">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-2xs">
          {{ payloadLabel }}
        </span>
        <span class="text-slate-400 text-[10px]">•</span>
        <span class="text-slate-500 text-[10px] font-bold">{{ jsonSize }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="toggleAll(true)"
          class="px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold transition cursor-pointer shadow-2xs"
        >
          گسترش همه
        </button>
        <button
          @click="toggleAll(false)"
          class="px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold transition cursor-pointer shadow-2xs"
        >
          بستن همه
        </button>
        <button
          @click="copyJson"
          class="px-2.5 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <Icon name="mdi:content-copy" class="w-3 h-3" />
          <span>{{ copied ? 'کپی شد!' : 'کپی' }}</span>
        </button>
      </div>
    </div>

    <!-- Tree Stream (Light Theme) -->
    <div class="flex-1 p-3 overflow-y-auto space-y-0.5 bg-white text-left ltr selection:bg-emerald-100 selection:text-emerald-900">
      <div v-if="!data || rootKeys.length === 0" class="text-slate-400 py-4 text-center">
        (داده‌ای وجود ندارد / خالی)
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
