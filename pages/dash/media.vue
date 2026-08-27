<!-- pages/dash/media.vue -->
<template>
  <div class="space-y-6 select-none font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">مدیریت و آرشیو فایل‌ها و رسانه‌های مجتمع نجم</h2>
        <p class="text-xs text-zinc-400">آرشیو جامع ۳۱۰+ تصویر، ویدیو، فایل‌های قالب تیغ دایکات (PDF/AI) و اسناد با ادیتور یکپارچه</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="triggerUpload"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
        >
          <AdminIcon name="upload" class="w-4 h-4" />
          <span>آپلود فایل جدید</span>
        </button>
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          accept="*/*"
          @change="onFileSelected"
        />
      </div>
    </div>

    <!-- Drag & Drop Quick Dropzone -->
    <div
      class="border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 relative overflow-hidden"
      :class="isDragging ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-zinc-900/90'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDropFile"
      @click="triggerUpload"
    >
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
        <AdminIcon name="upload" class="w-6 h-6" />
      </div>
      <div>
        <div class="font-bold text-xs text-zinc-200 font-d4">
          فایل‌های خود را به اینجا بکشید یا برای انتخاب از سیستم کلیک کنید
        </div>
        <div class="text-[11px] text-zinc-400 font-mono mt-0.5">
          پشتیبانی از: PNG, JPG, WEBP, AVIF, SVG, MP4, MP3, PDF, PSD, AI
        </div>
      </div>
    </div>

    <!-- Upload Progress Bar -->
    <div v-if="isUploading" class="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
      <div class="flex justify-between text-xs font-semibold text-zinc-200 font-d4">
        <span>در حال آپلود و ذخیره‌سازی فایل در پاکت‌بیس...</span>
        <span class="font-mono text-emerald-400">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-emerald-500 transition-all duration-150 rounded-full"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Search, Category Filters & View Mode Switcher -->
    <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی نام فایل یا فرمت..."
          class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
      </div>

      <!-- Category Filter Chips -->
      <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeCategory = cat.id"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          :class="activeCategory === cat.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
        >
          <span>{{ cat.label }}</span>
          <span class="px-1 rounded-full text-[10px] bg-white/10 font-mono">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </div>

      <!-- View Switcher (Grid / List) -->
      <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-zinc-400 self-end md:self-auto">
        <button
          type="button"
          @click="viewMode = 'grid'"
          class="p-1.5 rounded-lg cursor-pointer transition-colors"
          :class="viewMode === 'grid' ? 'bg-najmgreen text-white font-bold' : 'hover:text-white'"
          title="نمایش شبکه‌ای"
        >
          <AdminIcon name="dashboard" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="viewMode = 'list'"
          class="p-1.5 rounded-lg cursor-pointer transition-colors"
          :class="viewMode === 'list' ? 'bg-najmgreen text-white font-bold' : 'hover:text-white'"
          title="نمایش سطری"
        >
          <AdminIcon name="file" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Media Content Display -->
    <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs font-d4">
      در حال دریافت آرشیو رسانه‌ها...
    </div>

    <div v-else-if="filteredItems.length === 0" class="p-16 text-center text-zinc-500 text-xs font-d4">
      فایلی در این دسته‌بندی یافت نشد.
    </div>

    <!-- 1. GRID VIEW (Crisp, Non-Overlapped Cards) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
      <div
        v-for="item in filteredItems"
        :key="item.url"
        class="group rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden shadow-sm"
      >
        <!-- Media Visual Container -->
        <div class="relative aspect-square bg-zinc-950 flex items-center justify-center p-2 overflow-hidden">
          <img
            v-if="item.category === 'image' || item.category === 'vector'"
            :src="item.url"
            :alt="item.filename"
            class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />

          <div v-else-if="item.category === 'video'" class="flex flex-col items-center justify-center gap-1.5 text-cyan-400">
            <AdminIcon name="play" class="w-8 h-8" />
            <span class="text-[10px] font-mono font-bold uppercase">ویدیو MP4</span>
          </div>

          <div v-else-if="item.category === 'audio'" class="flex flex-col items-center justify-center gap-1.5 text-purple-400">
            <AdminIcon name="sparkles" class="w-8 h-8" />
            <span class="text-[10px] font-mono font-bold uppercase">صدا MP3</span>
          </div>

          <div v-else class="flex flex-col items-center justify-center gap-1.5 text-amber-400">
            <AdminIcon name="download" class="w-8 h-8" />
            <span class="text-[10px] font-mono font-bold uppercase">{{ item.format }}</span>
          </div>

          <!-- Format Tag -->
          <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-zinc-950/80 text-zinc-300 border border-white/10 backdrop-blur-md">
            {{ item.format }}
          </span>

          <!-- Hover Overlay with Fast Actions -->
          <div class="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <button
              v-if="item.category === 'image'"
              type="button"
              @click="openInStudio(item)"
              class="px-2.5 py-1 rounded-xl bg-najmgreen text-white text-[11px] font-bold font-d4 flex items-center gap-1 shadow-md cursor-pointer"
            >
              <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
              <span>ویرایش تصویر</span>
            </button>

            <button
              type="button"
              @click="copyUrl(item.url)"
              class="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer font-d4"
            >
              <AdminIcon name="link" class="w-3.5 h-3.5" />
              <span>کپی لینک</span>
            </button>
          </div>
        </div>

        <!-- Card Caption -->
        <div class="p-2.5 border-t border-white/5 space-y-0.5 bg-zinc-950/40">
          <div class="text-[11px] font-medium text-white truncate font-mono" :title="item.filename">
            {{ item.filename }}
          </div>
          <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>{{ item.size ? formatBytes(item.size) : 'فایل لوکال' }}</span>
            <span class="uppercase">{{ item.format }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. LIST VIEW -->
    <div v-else class="rounded-3xl bg-zinc-900/80 border border-white/10 overflow-hidden divide-y divide-white/5 text-xs">
      <div
        v-for="item in filteredItems"
        :key="item.url"
        class="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-900 transition-colors"
      >
        <div class="flex items-center gap-3 truncate">
          <div class="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              v-if="item.category === 'image' || item.category === 'vector'"
              :src="item.url"
              :alt="item.filename"
              class="max-w-full max-h-full object-contain"
              loading="lazy"
            />
            <span v-else class="text-[10px] font-mono font-bold text-emerald-400 uppercase">{{ item.format }}</span>
          </div>

          <div class="truncate">
            <div class="font-bold text-white font-mono truncate" :title="item.filename">{{ item.filename }}</div>
            <div class="text-[11px] text-zinc-400 font-mono truncate">{{ item.url }}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span class="text-[11px] text-zinc-400 font-mono">{{ item.size ? formatBytes(item.size) : 'سرور' }}</span>
          <span class="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 font-mono text-[10px] uppercase font-bold">{{ item.format }}</span>

          <button
            v-if="item.category === 'image'"
            type="button"
            @click="openInStudio(item)"
            class="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold font-d4 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
            <span>ویرایش</span>
          </button>

          <button
            type="button"
            @click="copyUrl(item.url)"
            class="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer transition-colors"
            title="کپی آدرس فایل"
          >
            <AdminIcon name="link" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { openMediaStudio } from '@/store/adminEditStore'
import { useAdminMedia } from '@/composables/useAdminMedia'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const { formatBytes, uploadMedia } = useAdminMedia()

const loading = ref(true)
const isUploading = ref(false)
const isDragging = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const activeCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const fileInputRef = ref<HTMLInputElement | null>(null)

const items = ref<any[]>([])

const categories = [
  { id: 'all', label: 'همه رسانه‌ها' },
  { id: 'image', label: 'عکس‌ها' },
  { id: 'video', label: 'ویدیوها' },
  { id: 'document', label: 'اسناد PDF/PSD/AI' },
  { id: 'vector', label: 'وکتور و SVG' }
]

function getCategoryCount(catId: string): number {
  if (catId === 'all') return items.value.length
  return items.value.filter(i => i.category === catId).length
}

const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return item.filename?.toLowerCase().includes(q) || item.format?.toLowerCase().includes(q) || item.url?.toLowerCase().includes(q)
    }
    return true
  })
})

function triggerUpload() {
  fileInputRef.value?.click()
}

function onFileSelected(e: any) {
  const file = e.target?.files?.[0]
  if (file) handleUpload(file)
}

function onDropFile(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleUpload(file)
}

async function handleUpload(file: File) {
  isUploading.value = true
  uploadProgress.value = 25
  try {
    const res = await uploadMedia(file, (p) => { uploadProgress.value = p })
    if (res.url) {
      items.value.unshift({
        id: `up-${Date.now()}`,
        filename: file.name,
        file: file.name,
        format: file.name.split('.').pop()?.toUpperCase() || 'PNG',
        size: file.size,
        url: res.url,
        category: 'image'
      })
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `فایل "${file.name}" با موفقیت آپلود گردید.` } }))
    }
  } catch (err) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: 'خطا در آپلود فایل.' } }))
  } finally {
    isUploading.value = false
  }
}

function openInStudio(item: any) {
  openMediaStudio({
    path: `media.${item.filename}`,
    url: item.url,
    meta: {
      format: item.format.toLowerCase(),
      width: item.width || 800,
      height: item.height || 600,
      size: item.size
    }
  })
}

function copyUrl(url: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'آدرس فایل در کلیپ‌بورد کپی شد.' } }))
  }
}

async function loadMedia() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/media')
    items.value = res?.items || []
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMedia()
})
</script>
