<!-- components/dashboard/JsonTreeRow.vue -->
<template>
  <div class="w-full font-sans text-xs select-text border-b border-slate-200/90 last:border-b-0">
    <!-- 1. PRIMITIVE VALUE ROW (Full-Width Flush Rectangle) -->
    <div
      v-if="!isContainer"
      class="w-full flex items-center justify-between px-4 py-2 transition-colors duration-100"
      :class="[
        isModified
          ? 'bg-amber-50/90 text-amber-950 border-r-4 border-r-amber-500'
          : 'bg-white hover:bg-slate-50/90 text-slate-800'
      ]"
    >
      <!-- Key Column -->
      <div class="w-48 sm:w-60 shrink-0 flex items-center gap-2 overflow-hidden">
        <span
          class="w-1.5 h-1.5 rounded-full shrink-0"
          :class="isModified ? 'bg-amber-500' : 'bg-slate-300'"
        ></span>

        <span
          class="font-mono text-xs font-bold truncate text-slate-800"
          :class="isModified ? 'text-amber-900 font-extrabold' : ''"
          :title="keyName"
        >
          {{ keyName }}
        </span>

        <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-400 text-[9px] font-mono uppercase font-bold shrink-0">
          {{ valueType }}
        </span>
      </div>

      <!-- Value Column (Flush Edge-to-Edge Input Controls) -->
      <div class="flex-1 flex items-center gap-3 px-3 min-w-[200px]">
        <!-- A. SMART COLOR PICKER -->
        <div v-if="isColorField" class="flex items-center gap-2 w-full max-w-sm">
          <div class="relative w-6 h-6 rounded-md overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
            <input
              type="color"
              :value="currentVal"
              @input="updateValue(($event.target as HTMLInputElement).value)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="w-full h-full" :style="{ backgroundColor: currentVal }"></div>
          </div>
          <input
            type="text"
            :value="currentVal"
            @input="updateValue(($event.target as HTMLInputElement).value)"
            class="w-32 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md px-2 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition"
            placeholder="#000000"
          />
        </div>

        <!-- B. SMART MEDIA & THUMBNAIL -->
        <div v-else-if="isMediaField" class="flex items-center gap-2.5 w-full">
          <div
            @click="openMediaPicker"
            class="relative w-8 h-8 rounded-md border border-slate-300 overflow-hidden bg-slate-100 shrink-0 cursor-pointer group/thumb hover:border-emerald-600 transition"
            title="انتخاب و پیش‌نمایش رسانه"
          >
            <img
              :src="currentVal"
              alt="preview"
              class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-150"
              @error="onImageError"
            />
          </div>

          <input
            type="text"
            :value="currentVal"
            @input="updateValue(($event.target as HTMLInputElement).value)"
            class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md px-2.5 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition truncate"
            placeholder="https://..."
          />

          <button
            type="button"
            @click="openMediaPicker"
            class="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Icon name="mdi:image-multiple" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">گالری رسانه</span>
          </button>
        </div>

        <!-- C. BOOLEAN SWITCH PILL -->
        <button
          v-else-if="valueType === 'boolean'"
          type="button"
          @click="updateValue(!currentVal)"
          class="px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-2 cursor-pointer select-none border"
          :class="[
            currentVal
              ? 'bg-emerald-800 text-white border-emerald-700'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          ]"
        >
          <span class="w-2 h-2 rounded-full" :class="currentVal ? 'bg-white' : 'bg-slate-400'"></span>
          <span>{{ currentVal ? 'فعال (TRUE)' : 'غیرفعال (FALSE)' }}</span>
        </button>

        <!-- D. NUMBER INPUT -->
        <input
          v-else-if="valueType === 'number'"
          type="number"
          :value="currentVal"
          @input="updateValue(Number(($event.target as HTMLInputElement).value))"
          class="w-36 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md px-2 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition"
        />

        <!-- E. MULTI-LINE TEXTAREA -->
        <textarea
          v-else-if="valueType === 'string' && String(currentVal).length > 60"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLTextAreaElement).value)"
          rows="2"
          class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition leading-relaxed font-sans"
        ></textarea>

        <!-- F. STANDARD TEXT INPUT -->
        <input
          v-else
          type="text"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 transition font-sans"
        />
      </div>

      <!-- Action Column (Undo & Modified Pill) -->
      <div class="flex items-center gap-2 shrink-0">
        <div v-if="isModified" class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
            تغییر
          </span>
          <button
            type="button"
            @click="undoValue"
            class="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-amber-900 border border-amber-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            title="بازگردانی"
          >
            <span>↩ بازگردانی</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. CONTAINER SECTION (Full-Width Flush Block) -->
    <div v-else class="w-full flex flex-col">
      <!-- Container Header Row -->
      <div
        @click="isOpen = !isOpen"
        class="w-full flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer select-none border-b border-slate-200/80"
        :class="[
          hasModifiedChildren
            ? 'bg-amber-100/70 text-amber-950 font-bold border-r-4 border-r-amber-500'
            : 'bg-slate-100 hover:bg-slate-200/70 text-slate-900'
        ]"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-4 h-4 flex items-center justify-center text-slate-500 transition-transform duration-100 text-[9px] font-bold"
            :class="isOpen ? 'rotate-90 text-emerald-800' : ''"
          >
            ▶
          </span>

          <span class="font-mono text-xs font-extrabold text-slate-900">{{ keyName }}</span>

          <span class="px-1.5 py-0.2 rounded bg-white/80 border border-slate-300/80 text-slate-600 text-[10px] font-mono font-bold">
            {{ containerCountLabel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="hasModifiedChildren"
            class="px-2 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-bold"
          >
            دارای تغییرات
          </span>
          <span class="text-slate-500 text-[10px] font-bold">{{ isOpen ? 'بستن' : 'نمایش' }}</span>
        </div>
      </div>

      <!-- Nested Children Stream (Full Width, Left Line Indentation) -->
      <div
        v-if="isOpen"
        class="w-full border-l-2 border-l-slate-200 pl-3 bg-white"
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

    <!-- Media Asset Picker Lightbox Modal -->
    <MediaAssetModal
      :is-open="isMediaModalOpen"
      :initial-url="String(currentVal)"
      @close="isMediaModalOpen = false"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MediaAssetModal from './MediaAssetModal.vue'

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
const isMediaModalOpen = ref(false)

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

// Smart Field Detectors
const isColorField = computed(() => {
  if (typeof props.currentVal !== 'string') return false
  const keyLower = props.keyName.toLowerCase()
  const val = props.currentVal.trim()
  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val)
  const isColorKey = /color|accent|background|bg|theme|fill|stroke/i.test(keyLower)
  return isHex || (isColorKey && val.startsWith('#'))
})

const isMediaField = computed(() => {
  if (typeof props.currentVal !== 'string') return false
  const val = props.currentVal.trim().toLowerCase()
  const keyLower = props.keyName.toLowerCase()
  const hasMediaExt = /\.(avif|webp|png|jpe?g|gif|svg|mp4|webm)($|\?)/i.test(val)
  const isMediaKey = /image|cover|thumb|logo|video|media|asset|avatar|banner|src|photo|pic/i.test(keyLower)
  const hasMediaPath = val.includes('/api/files/') || val.includes('/media/') || val.includes('/images/')
  return hasMediaExt || (isMediaKey && (val.startsWith('http') || val.startsWith('/') || hasMediaPath))
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

function openMediaPicker() {
  isMediaModalOpen.value = true
}

function handleMediaSelect(newUrl: string) {
  updateValue(newUrl)
}

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="8" fill="%2394a3b8">Img</text></svg>'
}
</script>
