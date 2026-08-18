<!-- components/dashboard/JsonTreeRow.vue -->
<template>
  <div class="font-sans text-xs select-text">
    <!-- 1. PRIMITIVE VALUE ROW (Color, Media, String, Number, Boolean) -->
    <div
      v-if="!isContainer"
      class="group flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 border"
      :class="[
        isModified
          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/50 text-amber-950 shadow-xs'
          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 text-slate-800 shadow-2xs'
      ]"
    >
      <!-- Left: Key Label & Type Pill -->
      <div class="flex items-center gap-2 shrink-0 min-w-[140px] max-w-[240px] overflow-hidden">
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="isModified ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'"
        ></span>

        <span
          class="font-bold text-xs truncate"
          :class="isModified ? 'text-amber-900 font-extrabold' : 'text-slate-800'"
          :title="keyName"
        >
          {{ keyName }}
        </span>

        <span class="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 text-[9px] font-mono uppercase font-bold shrink-0">
          {{ valueType }}
        </span>
      </div>

      <!-- Center: Smart Interactive Controls (Color, Media, Text, Number, Bool) -->
      <div class="flex-1 flex items-center gap-2 min-w-[200px]">
        <!-- A. SMART COLOR PICKER -->
        <div v-if="isColorField" class="flex items-center gap-2 w-full max-w-xs">
          <!-- Color Swatch & Native Color Input -->
          <div class="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
            <input
              type="color"
              :value="currentVal"
              @input="updateValue(($event.target as HTMLInputElement).value)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              class="w-full h-full"
              :style="{ backgroundColor: currentVal }"
            ></div>
          </div>

          <!-- Hex Input -->
          <input
            type="text"
            :value="currentVal"
            @input="updateValue(($event.target as HTMLInputElement).value)"
            class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
            placeholder="#000000"
          />
        </div>

        <!-- B. SMART MEDIA & THUMBNAIL INSPECTOR -->
        <div v-else-if="isMediaField" class="flex items-center gap-2.5 w-full">
          <!-- Interactive Thumbnail -->
          <div
            @click="openMediaPicker"
            class="relative w-9 h-9 rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shrink-0 cursor-pointer group/thumb shadow-2xs hover:border-emerald-500 transition"
            title="کلیک برای پیش‌نمایش بزرگ و انتخاب رسانه"
          >
            <img
              :src="currentVal"
              alt="preview"
              class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-200"
              @error="onImageError"
            />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity">
              <Icon name="mdi:eye" class="w-4 h-4" />
            </div>
          </div>

          <!-- URL Input -->
          <input
            type="text"
            :value="currentVal"
            @input="updateValue(($event.target as HTMLInputElement).value)"
            class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs truncate"
            placeholder="https://..."
          />

          <!-- 1-Click Replace from Media Gallery -->
          <button
            type="button"
            @click="openMediaPicker"
            class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
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
          class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs select-none border"
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
          class="w-32 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
        />

        <!-- E. MULTI-LINE TEXTAREA (For long content) -->
        <textarea
          v-else-if="valueType === 'string' && String(currentVal).length > 50"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLTextAreaElement).value)"
          rows="2"
          class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs leading-relaxed"
        ></textarea>

        <!-- F. STANDARD TEXT INPUT -->
        <input
          v-else
          type="text"
          :value="currentVal"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
        />
      </div>

      <!-- Right: Modified Diff Indicator & 1-Click Undo -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div v-if="isModified" class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
            تغییر یافته
          </span>
          <button
            type="button"
            @click="undoValue"
            class="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
            title="بازگردانی به نسخه اصلی"
          >
            <span>↩ بازگردانی</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. CONTAINER CARD (Object or Array) -->
    <div v-else class="space-y-1.5 rounded-2xl bg-slate-50/60 p-2 border border-slate-200/80">
      <!-- Container Header -->
      <div
        @click="isOpen = !isOpen"
        class="flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer select-none border"
        :class="[
          hasModifiedChildren
            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
            : 'bg-white hover:bg-slate-100/70 border-slate-200 text-slate-800 shadow-2xs'
        ]"
      >
        <div class="flex items-center gap-2.5">
          <!-- Chevron Indicator -->
          <span
            class="w-4 h-4 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-transform duration-150 text-[10px] font-bold"
            :class="isOpen ? 'rotate-90 bg-emerald-100 text-emerald-800' : ''"
          >
            ▶
          </span>

          <span class="font-extrabold text-xs text-slate-900">{{ keyName }}</span>

          <span class="px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold font-mono">
            {{ containerCountLabel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="hasModifiedChildren"
            class="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-300"
          >
            دارای تغییرات
          </span>
          <span class="text-slate-400 text-[11px] font-bold">{{ isOpen ? 'بستن' : 'نمایش' }}</span>
        </div>
      </div>

      <!-- Nested Container Children -->
      <div
        v-if="isOpen"
        class="pl-4 pr-1 space-y-1.5 py-1"
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

    <!-- Media Asset Picker & Editor Lightbox Modal -->
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

// Smart Field Type Detectors
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
  target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="8" fill="%2394a3b8">Img</text></svg>'
}
</script>
