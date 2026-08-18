<!-- components/dashboard/JsonTreeRow.vue -->
<template>
  <div class="font-mono text-[11px] select-text">
    <!-- 1. PRIMITIVE VALUE ROW (String, Number, Boolean, Null) -->
    <div
      v-if="!isContainer"
      class="group flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg transition-colors duration-100"
      :class="[
        isModified
          ? 'bg-amber-500/[0.08] text-amber-100'
          : 'hover:bg-white/[0.03] text-slate-200'
      ]"
    >
      <!-- Key Label & Type Indicator -->
      <div class="flex items-center gap-2 shrink-0 min-w-[130px] max-w-[220px] overflow-hidden">
        <span
          class="font-medium text-[11px] truncate"
          :class="isModified ? 'text-amber-300 font-bold' : 'text-sky-300/90'"
          :title="keyName"
        >
          {{ keyName }}
        </span>
        <span class="text-[9px] opacity-40 uppercase font-sans">
          {{ valueType }}
        </span>
      </div>

      <!-- Center: Seamless Inline Input -->
      <div class="flex-1 flex items-center gap-2">
        <!-- Boolean Toggle Pill -->
        <button
          v-if="valueType === 'boolean'"
          type="button"
          @click="updateValue(!currentVal)"
          class="px-2.5 py-0.5 rounded-md text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer select-none"
          :class="currentVal ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.04] text-slate-500 hover:text-slate-300'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="currentVal ? 'bg-emerald-400' : 'bg-slate-600'"></span>
          <span>{{ currentVal ? 'TRUE' : 'FALSE' }}</span>
        </button>

        <!-- Number Input -->
        <input
          v-else-if="valueType === 'number'"
          type="number"
          :value="currentVal"
          @input="updateValue(Number(($event.target as HTMLInputElement).value))"
          class="w-28 bg-transparent hover:bg-white/[0.04] focus:bg-white/[0.06] rounded px-2 py-0.5 text-[11px] font-mono focus:outline-none transition-colors"
          :class="isModified ? 'text-amber-200' : 'text-orange-300'"
        />

        <!-- Multi-line String / Textarea -->
        <textarea
          v-else-if="valueType === 'string' && String(currentVal).length > 60"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLTextAreaElement).value)"
          rows="2"
          class="w-full bg-transparent hover:bg-white/[0.04] focus:bg-white/[0.06] rounded p-1.5 text-[11px] font-sans focus:outline-none transition-colors"
          :class="isModified ? 'text-amber-100' : 'text-slate-100'"
        ></textarea>

        <!-- Single Line String Input -->
        <input
          v-else
          type="text"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          class="w-full bg-transparent hover:bg-white/[0.04] focus:bg-white/[0.06] rounded px-2 py-0.5 text-[11px] font-sans focus:outline-none transition-colors"
          :class="isModified ? 'text-amber-100' : 'text-slate-100'"
        />
      </div>

      <!-- Right: Minimalist Modified Pill & Undo Action -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div v-if="isModified" class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <button
            type="button"
            @click="undoValue"
            class="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-amber-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            title="بازگردانی"
          >
            <span>↩</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. CONTAINER ROW (Object or Array) -->
    <div v-else class="space-y-0.5">
      <!-- Container Header -->
      <div
        @click="isOpen = !isOpen"
        class="group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors duration-100 cursor-pointer select-none"
        :class="[
          hasModifiedChildren
            ? 'bg-amber-500/[0.05] text-amber-200'
            : 'hover:bg-white/[0.03] text-slate-300'
        ]"
      >
        <div class="flex items-center gap-2">
          <!-- Chevron Indicator -->
          <span
            class="w-3.5 h-3.5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-transform duration-100 text-[9px]"
            :class="isOpen ? 'rotate-90 text-slate-400' : ''"
          >
            ▶
          </span>

          <span class="font-medium text-[11px] text-purple-300">{{ keyName }}</span>

          <span class="text-[10px] text-slate-500 font-sans">
            {{ containerCountLabel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span v-if="hasModifiedChildren" class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span class="text-slate-600 group-hover:text-slate-400 text-[10px]">{{ isOpen ? 'بستن' : 'باز' }}</span>
        </div>
      </div>

      <!-- Nested Container Children (Whisper-thin left guideline) -->
      <div
        v-if="isOpen"
        class="pl-3.5 ml-2 border-l border-white/[0.06] space-y-0.5 py-0.5"
      >
        <JsonTreeRow
          v-for="childKey in childKeys"
          :key="String(childKey)"
          :key-name="String(childKey)"
          :current-val="currentVal[childKey]"
          :original-val="originalVal ? originalVal[childKey] : undefined"
          :path="[...path, childKey]"
          @update-field="forwardUpdate"
          @undo-field="forwardUndo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  keyName: string
  currentVal: any
  originalVal: any
  path: (string | number)[]
}>()

const emit = defineEmits<{
  (e: 'update-field', path: (string | number)[], newVal: any): void
  (e: 'undo-field', path: (string | number)[]): void
}>()

const isOpen = ref(true)

const valueType = computed(() => {
  if (props.currentVal === null) return 'null'
  if (Array.isArray(props.currentVal)) return 'array'
  return typeof props.currentVal
})

const isContainer = computed(() => {
  return valueType.value === 'object' || valueType.value === 'array'
})

const childKeys = computed(() => {
  if (!isContainer.value || !props.currentVal) return []
  if (Array.isArray(props.currentVal)) {
    return props.currentVal.map((_, i) => i)
  }
  return Object.keys(props.currentVal)
})

const containerCountLabel = computed(() => {
  if (valueType.value === 'array') {
    return '[' + childKeys.value.length + ']'
  }
  return '{' + childKeys.value.length + '}'
})

const isModified = computed(() => {
  if (isContainer.value) return false
  return JSON.stringify(props.currentVal) !== JSON.stringify(props.originalVal)
})

const hasModifiedChildren = computed(() => {
  if (!isContainer.value) return false
  return JSON.stringify(props.currentVal) !== JSON.stringify(props.originalVal)
})

function updateValue(newVal: any) {
  emit('update-field', props.path, newVal)
}

function undoValue() {
  emit('undo-field', props.path)
}

function forwardUpdate(path: (string | number)[], newVal: any) {
  emit('update-field', path, newVal)
}

function forwardUndo(path: (string | number)[]) {
  emit('undo-field', path)
}
</script>
