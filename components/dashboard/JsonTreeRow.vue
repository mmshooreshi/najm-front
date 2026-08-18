<!-- components/dashboard/JsonTreeRow.vue -->
<template>
  <div class="font-mono text-xs select-text">
    <!-- 1. PRIMITIVE VALUE ROW (String, Number, Boolean, Null) -->
    <div
      v-if="!isContainer"
      class="group flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-150 border"
      :class="[
        isModified
          ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 text-amber-100 shadow-md shadow-amber-950/30'
          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700 text-slate-200'
      ]"
    >
      <!-- Key Label & Type Badge -->
      <div class="flex items-center gap-2 shrink-0 min-w-[140px] max-w-[240px] overflow-hidden">
        <span
          class="font-bold text-[11px] truncate"
          :class="isModified ? 'text-amber-300 font-extrabold' : 'text-sky-300'"
          :title="keyName"
        >
          {{ keyName }}
        </span>
        <span
          class="px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 uppercase"
          :class="typeBadgeClass"
        >
          {{ valueType }}
        </span>
      </div>

      <!-- Center: Inline Editable Control -->
      <div class="flex-1 flex items-center gap-2">
        <!-- Boolean Switch -->
        <div v-if="valueType === 'boolean'" class="flex items-center gap-2">
          <button
            type="button"
            @click="updateValue(!currentVal)"
            class="px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer"
            :class="currentVal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'"
          >
            <span class="w-2 h-2 rounded-full" :class="currentVal ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-500'"></span>
            <span>{{ currentVal ? 'TRUE' : 'FALSE' }}</span>
          </button>
        </div>

        <!-- Number Input -->
        <input
          v-else-if="valueType === 'number'"
          type="number"
          :value="currentVal"
          @input="updateValue(Number(($event.target as HTMLInputElement).value))"
          class="w-32 bg-slate-950/80 border rounded-lg px-2.5 py-1 text-[11px] font-mono focus:outline-none focus:ring-1 transition"
          :class="isModified ? 'border-amber-400 text-amber-200 focus:ring-amber-400' : 'border-slate-700 text-orange-300 focus:ring-emerald-400'"
        />

        <!-- Multi-line String / Textarea if long -->
        <textarea
          v-else-if="valueType === 'string' && String(currentVal).length > 60"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLTextAreaElement).value)"
          rows="2"
          class="w-full bg-slate-950/80 border rounded-lg p-2 text-[11px] font-sans focus:outline-none focus:ring-1 transition"
          :class="isModified ? 'border-amber-400 text-amber-100 focus:ring-amber-400' : 'border-slate-700 text-slate-100 focus:ring-emerald-400'"
        ></textarea>

        <!-- Single Line String Input -->
        <input
          v-else
          type="text"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          class="w-full bg-slate-950/80 border rounded-lg px-2.5 py-1 text-[11px] font-sans focus:outline-none focus:ring-1 transition"
          :class="isModified ? 'border-amber-400 text-amber-100 focus:ring-amber-400' : 'border-slate-700 text-slate-100 focus:ring-emerald-400'"
        />
      </div>

      <!-- Right: Modified Pill & Undo Action Button -->
      <div class="flex items-center gap-2 shrink-0">
        <div v-if="isModified" class="flex items-center gap-1.5 animate-fadeIn">
          <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[9px] font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>ویرایش‌شده</span>
          </span>

          <button
            type="button"
            @click="undoValue"
            class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-950 hover:text-amber-300 text-slate-300 border border-slate-700 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            title="بازگردانی به مقدار اصلی سرور"
          >
            <span>↩️ بازگردانی</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. CONTAINER ROW (Object or Array) -->
    <div v-else class="space-y-1">
      <!-- Container Header -->
      <div
        @click="isOpen = !isOpen"
        class="group flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-150 cursor-pointer select-none"
        :class="[
          hasModifiedChildren
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-slate-900/70 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
        ]"
      >
        <div class="flex items-center gap-2">
          <!-- Expand/Collapse Chevron -->
          <span
            class="w-4 h-4 rounded flex items-center justify-center text-slate-400 transition-transform duration-150"
            :class="isOpen ? 'rotate-90 text-emerald-400' : ''"
          >
            ▶
          </span>

          <span class="font-bold text-[11px] text-purple-300">{{ keyName }}</span>

          <span
            class="px-1.5 py-0.2 rounded text-[9px] font-bold"
            :class="valueType === 'array' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-purple-950 text-purple-300 border border-purple-800'"
          >
            {{ valueType === 'array' ? `Array [ ${childKeys.length} ]` : `Object { ${childKeys.length} keys }` }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span v-if="hasModifiedChildren" class="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>شامل تغییرات</span>
          </span>
          <span class="text-slate-500 text-[10px]">{{ isOpen ? 'بستن' : 'گسترش' }}</span>
        </div>
      </div>

      <!-- Nested Container Children (Indented) -->
      <div
        v-if="isOpen"
        class="pr-3 mr-2 border-r-2 border-slate-800/80 space-y-1.5 pt-1.5 pb-1"
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

const isModified = computed(() => {
  if (isContainer.value) return false
  return JSON.stringify(props.currentVal) !== JSON.stringify(props.originalVal)
})

const hasModifiedChildren = computed(() => {
  if (!isContainer.value) return false
  return JSON.stringify(props.currentVal) !== JSON.stringify(props.originalVal)
})

const typeBadgeClass = computed(() => {
  switch (valueType.value) {
    case 'string': return 'bg-emerald-950 text-emerald-300 border border-emerald-800'
    case 'number': return 'bg-orange-950 text-orange-300 border border-orange-800'
    case 'boolean': return 'bg-sky-950 text-sky-300 border border-sky-800'
    default: return 'bg-slate-800 text-slate-400'
  }
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
