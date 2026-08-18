<!-- components/dashboard/JsonTreeNode.vue -->
<template>
  <div class="font-mono text-xs leading-relaxed select-text">
    <!-- 1. CONTAINER NODE (Object or Array) -->
    <div v-if="isContainer" class="space-y-0.5">
      <!-- Container Header -->
      <div
        @click="isOpen = !isOpen"
        class="inline-flex items-center gap-1.5 py-0.5 px-1.5 rounded-lg hover:bg-slate-100 cursor-pointer group select-none transition-colors"
      >
        <span
          class="w-3.5 h-3.5 flex items-center justify-center text-slate-400 group-hover:text-emerald-800 transition-transform duration-100 text-[9px]"
          :class="isOpen ? 'rotate-90 text-slate-700' : ''"
        >
          ▶
        </span>

        <!-- Key Name -->
        <span class="text-sky-700 font-bold group-hover:text-sky-900">{{ keyName }}:</span>

        <!-- Preview when collapsed -->
        <span v-if="!isOpen" class="text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 text-[10px]">
          {{ collapsedLabel }}
        </span>
        <span v-else class="text-slate-500 font-bold">
          {{ isArray ? '[' : '{' }}
        </span>
      </div>

      <!-- Nested Children -->
      <div
        v-if="isOpen"
        class="pl-4 ml-1.5 border-l border-slate-200 space-y-0.5 py-0.5"
      >
        <JsonTreeNode
          v-for="ck in childKeys"
          :key="String(ck)"
          :key-name="String(ck)"
          :val="val[ck]"
          :depth="depth + 1"
          :global-expand="globalExpand"
        />
      </div>

      <div v-if="isOpen" class="text-slate-400 pl-4 text-[11px] font-bold">
        {{ isArray ? ']' : '}' }}
      </div>
    </div>

    <!-- 2. PRIMITIVE LEAF NODE -->
    <div
      v-else
      class="flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-slate-50 group"
    >
      <span class="w-3.5"></span>
      <span class="text-sky-700 font-semibold">{{ keyName }}:</span>

      <!-- String -->
      <span v-if="valueType === 'string'" class="text-emerald-700 font-medium whitespace-pre-wrap break-all">
        "{{ val }}"
      </span>

      <!-- Number -->
      <span v-else-if="valueType === 'number'" class="text-amber-700 font-bold">
        {{ val }}
      </span>

      <!-- Boolean -->
      <span v-else-if="valueType === 'boolean'" class="text-violet-700 font-extrabold">
        {{ val }}
      </span>

      <!-- Null -->
      <span v-else-if="valueType === 'null'" class="text-rose-700 font-bold italic">
        null
      </span>

      <!-- Fallback -->
      <span v-else class="text-slate-800">
        {{ String(val) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  keyName: string
  val: any
  depth: number
  globalExpand?: boolean | null
}>()

const isOpen = ref(props.depth < 2)

watch(
  () => props.globalExpand,
  (newVal) => {
    if (newVal !== null && newVal !== undefined) {
      isOpen.value = newVal
    }
  }
)

const valueType = computed(() => {
  if (props.val === null) return 'null'
  if (Array.isArray(props.val)) return 'array'
  return typeof props.val
})

const isContainer = computed(() => {
  return valueType.value === 'object' || valueType.value === 'array'
})

const isArray = computed(() => Array.isArray(props.val))

const childKeys = computed(() => {
  if (!isContainer.value || !props.val) return []
  if (Array.isArray(props.val)) {
    return props.val.map((_, i) => i)
  }
  return Object.keys(props.val)
})

const collapsedLabel = computed(() => {
  if (isArray.value) {
    return '[... ' + childKeys.value.length + ']'
  }
  return '{... ' + childKeys.value.length + '}'
})
</script>
