<!-- components/dashboard/JsonTreeRow.vue -->
<template>
  <div class="w-full font-sans text-xs select-text border-b border-slate-200/90 last:border-b-0 bg-white">
    <!-- Main Flush Rectangular Row -->
    <div
      class="w-full flex items-center justify-between transition-colors duration-100 min-h-[44px] px-4"
      :class="[
        hasChanged ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-slate-50/80',
        isCollapsible ? 'cursor-pointer' : ''
      ]"
      @click="isCollapsible ? (isExpanded = !isExpanded) : null"
    >
      <!-- Left: Key Name & Type Badge -->
      <div class="flex items-center gap-2 overflow-hidden py-1.5" :style="{ paddingRight: `${depth * 18}px` }">
        <!-- Expand/Collapse Chevron -->
        <span
          v-if="isCollapsible"
          class="w-5 h-5 flex items-center justify-center rounded text-slate-400 font-mono text-[10px] select-none hover:bg-slate-200/60 transition shrink-0"
        >
          {{ isExpanded ? '▼' : '▶' }}
        </span>
        <span v-else class="w-5 shrink-0"></span>

        <!-- Key Name -->
        <span class="font-mono font-bold text-slate-800 text-xs truncate max-w-[200px]" dir="ltr">
          {{ keyName }}
        </span>

        <!-- Data Type Badge -->
        <span
          class="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold shrink-0"
          :class="badgeClass"
        >
          {{ typeLabel }}
        </span>

        <span v-if="hasChanged" class="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[8px] font-bold shrink-0">
          تغییر یافته
        </span>
      </div>

      <!-- Right: Value Editor or Undo Action -->
      <div class="flex items-center gap-2 max-w-[55%] shrink-0 py-1" @click.stop>
        <!-- A. PRIMITIVE STRING INPUT -->
        <div v-if="isPrimitiveString" class="w-full flex items-center gap-2">
          <!-- Color Swatch if Hex Color -->
          <div
            v-if="isColorValue"
            class="relative w-6 h-6 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer"
          >
            <input
              type="color"
              :value="currentVal"
              @input="updateVal(($event.target as HTMLInputElement).value)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="w-full h-full" :style="{ backgroundColor: currentVal }"></div>
          </div>

          <input
            type="text"
            :value="currentVal"
            @input="updateVal(($event.target as HTMLInputElement).value)"
            class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none transition shadow-2xs"
            :dir="isLtr ? 'ltr' : 'auto'"
          />
        </div>

        <!-- B. NUMBER INPUT -->
        <div v-else-if="isPrimitiveNumber" class="w-36">
          <input
            type="number"
            :value="currentVal"
            @input="updateVal(Number(($event.target as HTMLInputElement).value))"
            class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono text-left focus:outline-none"
            dir="ltr"
          />
        </div>

        <!-- C. BOOLEAN SWITCH -->
        <div v-else-if="isPrimitiveBoolean" class="flex items-center">
          <button
            @click="updateVal(!currentVal)"
            class="px-3 py-1 rounded-lg font-mono font-bold text-xs transition cursor-pointer"
            :class="currentVal ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
          >
            {{ currentVal ? 'TRUE' : 'FALSE' }}
          </button>
        </div>

        <!-- D. COMPLEX OBJECT / ARRAY SUMMARY -->
        <div v-else class="text-[11px] font-mono text-slate-400">
          {{ summaryText }}
        </div>

        <!-- Undo Button -->
        <button
          v-if="hasChanged"
          @click="undoVal"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 text-amber-800 transition cursor-pointer shrink-0"
          title="بازگردانی این فیلد"
        >
          <Icon name="mdi:undo" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Recursive Sub-Rows -->
    <div v-if="isCollapsible && isExpanded" class="w-full bg-slate-50/20 divide-y divide-slate-100">
      <JsonTreeRow
        v-for="k in childKeys"
        :key="k"
        :key-name="k"
        :current-val="currentVal[k]"
        :original-val="originalVal ? originalVal[k] : undefined"
        :path="[...path, k]"
        :depth="depth + 1"
        @update-field="(p, v) => $emit('update-field', p, v)"
        @undo-field="(p) => $emit('undo-field', p)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    keyName: string | number
    currentVal: any
    originalVal: any
    path: (string | number)[]
    depth?: number
  }>(),
  {
    depth: 0
  }
)

const emit = defineEmits<{
  (e: 'update-field', path: (string | number)[], newVal: any): void
  (e: 'undo-field', path: (string | number)[]): void
}>()

const isExpanded = ref(true)

const isObject = computed(() => typeof props.currentVal === 'object' && props.currentVal !== null)
const isArray = computed(() => Array.isArray(props.currentVal))
const isCollapsible = computed(() => isObject.value)

const isPrimitiveString = computed(() => typeof props.currentVal === 'string')
const isPrimitiveNumber = computed(() => typeof props.currentVal === 'number')
const isPrimitiveBoolean = computed(() => typeof props.currentVal === 'boolean')

const isColorValue = computed(() => {
  return typeof props.currentVal === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(props.currentVal)
})

const isLtr = computed(() => {
  const k = String(props.keyName).toLowerCase()
  return k.includes('slug') || k.includes('url') || k.includes('path') || k.includes('icon') || k.includes('color') || k.includes('count')
})

const typeLabel = computed(() => {
  if (isArray.value) return `Array [${props.currentVal.length}]`
  if (isObject.value) return `Object {${Object.keys(props.currentVal).length}}`
  if (isPrimitiveString.value) return 'string'
  if (isPrimitiveNumber.value) return 'number'
  if (isPrimitiveBoolean.value) return 'bool'
  return 'null'
})

const badgeClass = computed(() => {
  if (isArray.value) return 'bg-purple-50 text-purple-700 border border-purple-200'
  if (isObject.value) return 'bg-blue-50 text-blue-700 border border-blue-200'
  if (isPrimitiveString.value) return 'bg-emerald-50 text-emerald-700'
  if (isPrimitiveNumber.value) return 'bg-amber-50 text-amber-700'
  if (isPrimitiveBoolean.value) return 'bg-indigo-50 text-indigo-700'
  return 'bg-slate-100 text-slate-500'
})

const summaryText = computed(() => {
  if (isArray.value) return `${props.currentVal.length} مورد`
  if (isObject.value) return `${Object.keys(props.currentVal).length} کلید`
  return ''
})

const childKeys = computed(() => {
  if (!isObject.value) return []
  return Object.keys(props.currentVal)
})

const hasChanged = computed(() => {
  return JSON.stringify(props.currentVal) !== JSON.stringify(props.originalVal)
})

function updateVal(val: any) {
  emit('update-field', props.path, val)
}

function undoVal() {
  emit('undo-field', props.path)
}
</script>
