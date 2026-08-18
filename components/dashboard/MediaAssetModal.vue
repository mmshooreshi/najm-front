<!-- components/dashboard/MediaAssetModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none font-sans"
    @click.self="close"
  >
    <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden text-xs">
      <!-- Modal Header -->
      <div class="h-12 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <Icon name="mdi:image-multiple-outline" class="w-4 h-4" />
          </div>
          <span class="font-extrabold text-slate-900 text-xs">گالری رسانه‌های PocketBase</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 text-[10px] font-mono font-bold">
            {{ mediaItems.length }} فایل زنده
          </span>
        </div>

        <!-- Mode Toggle, Refresh & Close -->
        <div class="flex items-center gap-1.5">
          <!-- Refresh Button -->
          <button
            @click="fetchMediaAssets"
            :disabled="isRefreshing"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer shadow-2xs"
            title="بروزرسانی داده‌ها از سرور"
          >
            <Icon :name="isRefreshing ? 'mdi:loading' : 'mdi:refresh'" class="w-3.5 h-3.5" :class="isRefreshing ? 'animate-spin' : ''" />
          </button>

          <button
            @click="activeTab = 'gallery'"
            class="px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] font-bold"
            :class="activeTab === 'gallery' ? 'bg-white text-emerald-800 border border-slate-200 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
          >
            گالری
          </button>

          <button
            v-if="selectedMedia"
            @click="activeTab = 'editor'"
            class="px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] font-bold"
            :class="activeTab === 'editor' ? 'bg-white text-emerald-800 border border-slate-200 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
          >
            تنظیمات نور
          </button>

          <button
            @click="close"
            class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer ml-1"
            title="بستن"
          >
            <Icon name="mdi:close" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- TAB 1: GALLERY GRID -->
      <div v-if="activeTab === 'gallery'" class="flex-1 flex flex-col overflow-hidden bg-slate-50/40">
        <!-- Search & Filter Bar -->
        <div class="p-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
          <div class="relative flex-1 max-w-xs">
            <Icon name="mdi:magnify" class="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              v-model="searchFilter"
              type="text"
              placeholder="جستجو در ۹۵ رسانه..."
              class="w-full bg-slate-50 border border-slate-200 rounded-lg pr-7 pl-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          <div class="flex items-center gap-1 text-[10px] font-bold">
            <button
              v-for="fmt in ['ALL', 'avif', 'webp', 'png', 'jpg', 'svg']"
              :key="fmt"
              @click="formatFilter = fmt"
              class="px-2 py-0.5 rounded-md transition cursor-pointer"
              :class="formatFilter === fmt ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ fmt.toUpperCase() }}
            </button>
          </div>
        </div>

        <!-- Loading / Empty State -->
        <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-emerald-600" />
          <span>در حال دریافت ۹۵ فایل رسانه از PocketBase...</span>
        </div>

        <!-- Media Grid -->
        <div v-else class="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div
            v-for="item in filteredMedia"
            :key="item.id"
            @click="selectMedia(item)"
            class="group relative bg-white rounded-xl border transition-all duration-150 overflow-hidden cursor-pointer flex flex-col"
            :class="[
              selectedMedia?.id === item.id
                ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
            ]"
          >
            <!-- 1:1 Aspect Ratio Thumbnail -->
            <div class="aspect-square w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <img
                :src="item.url"
                :alt="item.filename"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span class="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-black/60 backdrop-blur-xs text-white text-[8px] font-mono uppercase font-bold">
                {{ item.format || 'img' }}
              </span>
            </div>

            <!-- Meta Details -->
            <div class="p-2 bg-white flex flex-col gap-0.5 border-t border-slate-100">
              <span class="font-bold text-slate-800 truncate text-[11px]" :title="item.filename">
                {{ item.filename }}
              </span>
              <div class="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>{{ item.width }}x{{ item.height }}</span>
                <span class="text-emerald-700 font-bold">انتخاب ↵</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="h-12 px-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span v-if="selectedMedia" class="text-slate-800 text-xs font-bold truncate max-w-xs">
            انتخاب: {{ selectedMedia.filename }}
          </span>
          <span v-else class="text-slate-400 text-xs">یک رسانه را از بالا انتخاب نمایید</span>

          <div class="flex items-center gap-2">
            <button
              v-if="selectedMedia"
              @click="activeTab = 'editor'"
              class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              تنظیمات تصویر
            </button>

            <button
              :disabled="!selectedMedia"
              @click="applySelectedMedia"
              class="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              تایید و درج لینک
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: LIGHTWEIGHT IMAGE EDITOR -->
      <div v-else-if="activeTab === 'editor' && selectedMedia" class="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <div class="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
          <img
            :src="selectedMedia.url"
            :alt="selectedMedia.filename"
            class="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xl transition-all"
            :style="{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`
            }"
          />
        </div>

        <!-- Adjustments -->
        <div class="p-3.5 bg-white border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-slate-700">
          <div>
            <div class="flex justify-between text-[10px] font-bold mb-0.5">
              <span>روشنایی</span>
              <span class="font-mono text-emerald-800">{{ brightness }}%</span>
            </div>
            <input v-model.number="brightness" type="range" min="50" max="150" class="w-full accent-emerald-800 cursor-pointer" />
          </div>

          <div>
            <div class="flex justify-between text-[10px] font-bold mb-0.5">
              <span>کنتراست</span>
              <span class="font-mono text-emerald-800">{{ contrast }}%</span>
            </div>
            <input v-model.number="contrast" type="range" min="50" max="150" class="w-full accent-emerald-800 cursor-pointer" />
          </div>

          <div>
            <div class="flex justify-between text-[10px] font-bold mb-0.5">
              <span>اشباع رنگ</span>
              <span class="font-mono text-emerald-800">{{ saturation }}%</span>
            </div>
            <input v-model.number="saturation" type="range" min="0" max="200" class="w-full accent-emerald-800 cursor-pointer" />
          </div>

          <div class="flex items-center gap-1.5 pt-2">
            <button
              @click="rotation = (rotation + 90) % 360"
              class="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer text-[11px]"
            >
              <Icon name="mdi:rotate-right" class="w-3.5 h-3.5" />
              <span>چرخش</span>
            </button>
            <button
              @click="flipH = !flipH"
              class="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer text-[11px]"
            >
              <Icon name="mdi:flip-horizontal" class="w-3.5 h-3.5" />
              <span>قرینه</span>
            </button>
          </div>
        </div>

        <div class="h-12 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            @click="activeTab = 'gallery'"
            class="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            ← بازگشت به گالری
          </button>

          <button
            @click="applySelectedMedia"
            class="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Icon name="mdi:check" class="w-4 h-4" />
            <span>تایید و درج لینک</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  initialUrl?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', url: string): void
}>()

const activeTab = ref<'gallery' | 'editor'>('gallery')
const searchFilter = ref('')
const formatFilter = ref('ALL')
const selectedMedia = ref<any | null>(null)
const mediaItems = ref<any[]>([])
const isLoading = ref(true)
const isRefreshing = ref(false)

// Editor Adjustments
const brightness = ref(100)
const contrast = ref(100)
const saturation = ref(100)
const rotation = ref(0)
const flipH = ref(false)

const filteredMedia = computed(() => {
  return mediaItems.value.filter((m) => {
    if (formatFilter.value !== 'ALL' && m.format?.toLowerCase() !== formatFilter.value.toLowerCase()) {
      return false
    }
    if (searchFilter.value) {
      const q = searchFilter.value.toLowerCase()
      const matchName = (m.filename || '').toLowerCase().includes(q)
      const matchFmt = (m.format || '').toLowerCase().includes(q)
      if (!matchName && !matchFmt) return false
    }
    return true
  })
})

function selectMedia(item: any) {
  selectedMedia.value = item
}

function applySelectedMedia() {
  if (!selectedMedia.value) return
  emit('select', selectedMedia.value.url)
  emit('close')
}

function close() {
  emit('close')
}

async function fetchMediaAssets() {
  isRefreshing.value = true
  try {
    const res: any = await $fetch('/api/admin/media')
    if (res?.items && Array.isArray(res.items)) {
      mediaItems.value = res.items
    }
  } catch (e) {
    // Fallback
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

onMounted(() => {
  fetchMediaAssets()
})
</script>
