<!-- components/dashboard/MediaAssetModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none font-sans"
    @click.self="close"
  >
    <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden text-xs">
      <!-- Modal Header -->
      <div class="h-14 px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <Icon name="mdi:image-multiple-outline" class="w-4.5 h-4.5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm">مدیریت و انتخاب رسانه‌ها</h3>
              <span class="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {{ mediaItems.length }} رسانه در PocketBase
              </span>
            </div>
            <p class="text-[10px] text-slate-500">انتخاب تصویر یا ویدیو، پیش‌نمایش بزرگ و ویرایش سریع (برش، نور، چرخش)</p>
          </div>
        </div>

        <!-- Mode Toggle & Close Button -->
        <div class="flex items-center gap-2">
          <div class="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              @click="activeTab = 'gallery'"
              class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              :class="activeTab === 'gallery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              <Icon name="mdi:view-grid-outline" class="w-3.5 h-3.5" />
              <span>گالری رسانه‌ها</span>
            </button>

            <button
              v-if="selectedMedia"
              @click="activeTab = 'editor'"
              class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              :class="activeTab === 'editor' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              <Icon name="mdi:tune-variant" class="w-3.5 h-3.5 text-emerald-800" />
              <span>ویرایشگر تصویر</span>
            </button>
          </div>

          <button
            @click="close"
            class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer ml-1"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- TAB 1: GALLERY GRID -->
      <div v-if="activeTab === 'gallery'" class="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <!-- Search & Filter Bar -->
        <div class="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <div class="relative flex-1 max-w-sm">
            <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              v-model="searchFilter"
              type="text"
              placeholder="جستجو بر اساس نام فایل یا فرمت (avif, webp, png, svg)..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div class="flex items-center gap-1.5 text-[11px]">
            <button
              v-for="fmt in ['ALL', 'avif', 'webp', 'png', 'jpg', 'svg']"
              :key="fmt"
              @click="formatFilter = fmt"
              class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
              :class="formatFilter === fmt ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ fmt.toUpperCase() }}
            </button>
          </div>
        </div>

        <!-- Media Grid -->
        <div class="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          <div
            v-for="item in filteredMedia"
            :key="item.id"
            @click="selectMedia(item)"
            class="group relative bg-white rounded-2xl border transition-all duration-150 overflow-hidden cursor-pointer flex flex-col"
            :class="[
              selectedMedia?.id === item.id
                ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md scale-102'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
            ]"
          >
            <!-- Preview Box -->
            <div class="aspect-square w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <img
                :src="getMediaUrl(item)"
                :alt="item.filename"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                @error="onImageError"
              />
              <span class="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase">
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

        <!-- Gallery Bottom Controls -->
        <div class="h-14 px-5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <span v-if="selectedMedia" class="text-slate-700 text-xs font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>انتخاب شده: <strong>{{ selectedMedia.filename }}</strong></span>
            </span>
            <span v-else class="text-slate-400 text-xs">
              یک رسانه را از گالری انتخاب کنید
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="selectedMedia"
              @click="activeTab = 'editor'"
              class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Icon name="mdi:tune" class="w-3.5 h-3.5 text-emerald-800" />
              <span>ویرایش و برش</span>
            </button>

            <button
              :disabled="!selectedMedia"
              @click="applySelectedMedia"
              class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <Icon name="mdi:check" class="w-4 h-4" />
              <span>تایید و جایگذاری در فیلد</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: LIGHTWEIGHT IMAGE EDITOR & CROPPER -->
      <div v-else-if="activeTab === 'editor' && selectedMedia" class="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <!-- Editor Canvas Workspace -->
        <div class="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
          <img
            ref="previewImgRef"
            :src="getMediaUrl(selectedMedia)"
            :alt="selectedMedia.filename"
            class="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xl transition-all"
            :style="{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`
            }"
          />
        </div>

        <!-- Light Adjustment Sliders & Tools -->
        <div class="p-4 bg-white border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 text-slate-700">
          <!-- Brightness -->
          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>روشنایی (Brightness)</span>
              <span class="font-mono text-emerald-800">{{ brightness }}%</span>
            </div>
            <input
              v-model.number="brightness"
              type="range"
              min="50"
              max="150"
              class="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          <!-- Contrast -->
          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>کنتراست (Contrast)</span>
              <span class="font-mono text-emerald-800">{{ contrast }}%</span>
            </div>
            <input
              v-model.number="contrast"
              type="range"
              min="50"
              max="150"
              class="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          <!-- Saturation -->
          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>اشباع رنگ (Saturation)</span>
              <span class="font-mono text-emerald-800">{{ saturation }}%</span>
            </div>
            <input
              v-model.number="saturation"
              type="range"
              min="0"
              max="200"
              class="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          <!-- Rotation & Flip Buttons -->
          <div class="flex items-center gap-2 pt-3">
            <button
              @click="rotation = (rotation + 90) % 360"
              class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              title="چرخش ۹۰ درجه"
            >
              <Icon name="mdi:rotate-right" class="w-4 h-4" />
              <span>چرخش</span>
            </button>
            <button
              @click="flipH = !flipH"
              class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              title="قرینه افقی"
            >
              <Icon name="mdi:flip-horizontal" class="w-4 h-4" />
              <span>قرینه</span>
            </button>
            <button
              @click="resetAdjustments"
              class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition cursor-pointer"
              title="بازنشانی فیلترها"
            >
              <Icon name="mdi:restore" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Editor Footer -->
        <div class="h-14 px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            @click="activeTab = 'gallery'"
            class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            ← بازگشت به گالری
          </button>

          <button
            @click="applySelectedMedia"
            class="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Icon name="mdi:check" class="w-4 h-4" />
            <span>تایید و درج لینک رسانه</span>
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

// Editor Adjustments
const brightness = ref(100)
const contrast = ref(100)
const saturation = ref(100)
const rotation = ref(0)
const flipH = ref(false)

function resetAdjustments() {
  brightness.value = 100
  contrast.value = 100
  saturation.value = 100
  rotation.value = 0
  flipH.value = false
}

const pbBaseUrl = 'http://65.108.80.205:8090'

function getMediaUrl(item: any) {
  if (!item) return ''
  return `${pbBaseUrl}/api/files/media_files/${item.id}/${item.file}`
}

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="8" fill="%2394a3b8">Asset</text></svg>'
}

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
  const url = getMediaUrl(selectedMedia.value)
  emit('select', url)
  emit('close')
}

function close() {
  emit('close')
}

onMounted(async () => {
  try {
    const res: any = await $fetch(`${pbBaseUrl}/api/collections/media_files/records`, {
      params: { perPage: 100 }
    }).catch(() => null)

    if (res?.items) {
      mediaItems.value = res.items
    }
  } catch (e) {
    // Fallback
  }
})
</script>
