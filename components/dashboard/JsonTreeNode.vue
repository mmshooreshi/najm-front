<!-- components/dashboard/JsonTreeNode.vue -->
<template>
  <div class="font-mono text-[11px] leading-relaxed select-text">
    <!-- 1. CONTAINER NODE (Object or Array) -->
    <div v-if="isContainer" class="space-y-0.5">
      <!-- Container Header -->
      <div
        @click="isOpen = !isOpen"
        class="inline-flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.04] cursor-pointer group select-none transition-colors"
      >
        <span
          class="w-3.5 h-3.5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-transform duration-100 text-[9px]"
          :class="isOpen ? 'rotate-90 text-slate-400' : ''"
        >
          ▶
        </span>

        <!-- Key Name -->
        <span class="text-sky-300/90 font-medium group-hover:text-sky-200">{{ keyName }}:</span>

        <!-- Preview when collapsed -->
        <span v-if="!isOpen" class="text-slate-500 text-[10px]">
          {{ collapsedLabel }}
        </span>
        <span v-else class="text-slate-500 font-bold">
          {{ isArray ? '[' : '{' }}
        </span>
      </div>

      <!-- Nested Children -->
      <div
        v-if="isOpen"
        class="pl-3.5 ml-1.5 border-l border-white/[0.06] space-y-0.5 py-0.5"
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

      <div v-if="isOpen" class="text-slate-600 pl-3.5 text-[10px]">
        {{ isArray ? ']' : '}' }}
      </div>
    </div>

    <!-- 2. PRIMITIVE LEAF NODE -->
    <div
      v-else
      class="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.03] group"
    >
      <span class="w-3.5"></span>
      <span class="text-sky-300/80 font-medium">{{ keyName }}:</span>

      <span v-if="valueType === 'string'" class="text-emerald-300 whitespace-pre-wrap break-all">
        "{{ val }}"
      </span>
      <span v-else-if="valueType === 'number'" class="text-orange-400 font-bold">
        {{ val }}
      </span>
      <span v-else-if="valueType === 'boolean'" class="text-purple-400 font-bold">
        {{ val }}
      </span>
      <span v-else-if="valueType === 'null'" class="text-rose-400 font-bold italic">
        null
      </span>
      <span v-else class="text-slate-300">
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
