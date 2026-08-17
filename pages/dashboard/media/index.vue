<!-- pages/dashboard/media/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Header & Action Bar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:folder-multiple-image" class="h-5 w-5 text-najmgreen" />
          {{ isRTL ? 'مخزن رسانه و تصاویر' : 'Media Studio' }}
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          {{
            isRTL
              ? 'مدیریت و آپلود تصاویر محصولات، کاتالوگ‌ها و فایل‌های بسته‌بندی با کش پرسرعت'
              : 'Product images, PDFs, packaging templates, and CDN media assets'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Live Sync Badge -->
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
          :class="[
            syncState === 'syncing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            syncState === 'synced' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            'bg-gray-50 text-gray-700 border-gray-200'
          ]"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="[
              syncState === 'syncing' ? 'bg-amber-500 animate-pulse' :
              syncState === 'synced' ? 'bg-emerald-500' :
              'bg-blue-500'
            ]"
          ></span>
          <span>{{ syncLabel }}</span>
        </div>

        <button
          @click="createFolderPrompt"
          class="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
        >
          <Icon name="mdi:folder-plus-outline" class="h-4 w-4 text-najmgreen" />
          {{ isRTL ? 'پوشه جدید' : 'New Folder' }}
        </button>

        <button
          @click="fetchData"
          :disabled="loading"
          class="flex items-center gap-1 rounded-xl bg-najmgreen px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Icon name="mdi:refresh" class="h-4 w-4" :class="loading ? 'animate-spin' : ''" />
          <span class="hidden xs:inline">{{ isRTL ? 'به‌روزرسانی' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Category Filter Bar & Search -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <!-- Mime Category Chips -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="cat in categoryOptions"
          :key="cat.value"
          @click="selectedCategory = cat.value"
          class="rounded-xl px-3 py-1 text-xs font-semibold transition cursor-pointer"
          :class="
            selectedCategory === cat.value
              ? 'bg-najmgreen text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          {{ isRTL ? cat.labelFa : cat.labelEn }}
        </button>
      </div>

      <!-- File Search & View Mode -->
      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-56">
          <input
            v-model="fileSearchQuery"
            type="text"
            :placeholder="isRTL ? 'جستجوی نام فایل...' : 'Search files...'"
            class="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-najmgreen transition font-mono text-right"
          />
        </div>

        <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            @click="viewMode = 'grid'"
            class="p-1 rounded-lg transition"
            :class="viewMode === 'grid' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="شبکه‌ای"
          >
            <Icon name="mdi:view-grid-outline" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'cards'"
            class="p-1 rounded-lg transition"
            :class="viewMode === 'cards' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="کارت‌ها"
          >
            <Icon name="mdi:view-agenda-outline" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            class="p-1 rounded-lg transition"
            :class="viewMode === 'table' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="جدول"
          >
            <Icon name="mdi:view-list" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Workspace Layout: Folder Sidebar + File Grid -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <!-- Left/Right Folder Tree Navigation Card -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3 h-fit">
        <div class="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <h3 class="text-xs font-bold text-gray-900 font-d4 flex items-center gap-1.5">
            <Icon name="mdi:folder-tree" class="h-4 w-4 text-najmgreen" />
            {{ isRTL ? 'ساختار پوشه‌ها' : 'Folders' }}
          </h3>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 font-mono">
            {{ toLocalizedDigits(allFolders.length) }}
          </span>
        </div>

        <!-- Folder List Tree -->
        <div class="space-y-1 text-xs max-h-[50vh] overflow-y-auto">
          <!-- Root item -->
          <button
            @click="currentFolder = ''"
            class="flex items-center justify-between w-full rounded-xl px-3 py-2 text-start font-semibold transition cursor-pointer"
            :class="!currentFolder ? 'bg-emerald-50 text-najmgreen font-bold' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:folder-home-outline" class="h-4 w-4 text-najmgreen" />
              <span>/root</span>
            </div>
            <span class="rounded-full bg-gray-200 px-1.5 py-0.2 text-[10px] font-mono">
              {{ toLocalizedDigits(countInFolder('')) }}
            </span>
          </button>

          <!-- Subfolders -->
          <div v-for="folder in allFolders" :key="folder.id">
            <button
              @click="currentFolder = folder.path"
              class="flex items-center justify-between w-full rounded-xl px-3 py-1.5 text-start transition cursor-pointer font-mono text-[11px]"
              :class="currentFolder === folder.path ? 'bg-emerald-50 text-najmgreen font-bold' : 'text-gray-700 hover:bg-gray-100'"
            >
              <div class="flex items-center gap-2 truncate">
                <Icon name="mdi:folder-outline" class="h-4 w-4 text-gray-400 shrink-0" />
                <span class="truncate">{{ folder.name || folder.path }}</span>
              </div>
              <span class="rounded-full bg-gray-100 px-1.5 py-0.2 text-[10px] text-gray-600 shrink-0 font-mono">
                {{ toLocalizedDigits(countInFolder(folder.path)) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right/Left Media Assets Canvas -->
      <div class="lg:col-span-3 space-y-4">
        <!-- Drag & Drop Uploader -->
        <div class="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 hover:border-najmgreen transition">
          <FileUploader :currentPath="currentFolder" @uploaded="fetchData" />
        </div>

        <!-- Files Grid/Cards/Table using unified FileGrid component -->
        <FileGrid
          :files="filteredFiles"
          :viewMode="viewMode"
          @refresh="fetchData"
          @info="infoFile = $event"
        />
      </div>
    </div>

    <!-- Image Info Lightbox Modal -->
    <ImageInfoModal v-if="infoFile" :file="infoFile" @close="infoFile = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { usePocketBase } from '~/plugins/pb.client'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { useMediaCache } from '~/composables/useMediaCache'
import { toLocalizedDigits } from '~/utils/digits'
import FileUploader from '@/components/FileUploader.vue'
import FileGrid from '@/components/FileGrid.vue'
import ImageInfoModal from '@/components/ImageInfoModal.vue'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const pb = usePocketBase()
const { logInfo, logError, logNetwork } = useAdminLogger()

const {
  syncState,
  lastSyncTime,
  getCachedFolders,
  getCachedFiles,
  saveCache,
} = useMediaCache()

const loading = ref(false)
const selectedCategory = ref('all')
const fileSearchQuery = ref('')
const currentFolder = ref('')
const viewMode = ref<'grid' | 'cards' | 'table'>('grid')
const infoFile = ref<any | null>(null)

const allFolders = ref<any[]>([])
const allFiles = ref<any[]>([])

const categoryOptions = [
  { labelFa: 'همه', labelEn: 'All', value: 'all' },
  { labelFa: 'تصاویر', labelEn: 'Images', value: 'images' },
  { labelFa: 'قالب‌ها (PDF)', labelEn: 'PDFs', value: 'pdfs' },
]

const syncLabel = computed(() => {
  if (syncState.value === 'syncing') return 'در حال همگام‌سازی...'
  if (syncState.value === 'synced') return `همگام‌شده (${lastSyncTime.value || 'الان'})`
  return 'بارگذاری از کش محلی'
})

const filteredFiles = computed(() => {
  let list = allFiles.value.filter((f) => (f.path || '') === currentFolder.value)

  if (selectedCategory.value === 'images') {
    list = list.filter((f) => isImageFile(f))
  } else if (selectedCategory.value === 'pdfs') {
    list = list.filter((f) => getFileExt(f) === 'pdf')
  }

  if (fileSearchQuery.value.trim()) {
    const q = fileSearchQuery.value.toLowerCase()
    list = list.filter((f) => (f.filename || f.name || '').toLowerCase().includes(q))
  }
  return list
})

function countInFolder(path: string): number {
  return allFiles.value.filter((f) => (f.path || '') === path).length
}

function isImageFile(file: any): boolean {
  const fn = String(file.file || file.filename || '').toLowerCase()
  return /\.(jpg|jpeg|png|webp|svg|gif|avif)$/.test(fn)
}

function getFileExt(file: any): string {
  const fn = String(file.file || file.filename || '')
  return fn.split('.').pop()?.toLowerCase() || 'file'
}

async function fetchData() {
  loading.value = true
  syncState.value = 'syncing'
  try {
    logNetwork('Media', 'Fetching media folders and files')
    const [folders, filesList] = await Promise.all([
      pb.collection('media_folders').getFullList({ sort: 'path' }),
      pb.collection('media_files').getFullList({ sort: '-created' }),
    ])
    allFolders.value = folders
    allFiles.value = filesList
    saveCache(folders, filesList)
    logInfo('Media', `Loaded ${filesList.length} media files across ${folders.length} folders`)
  } catch (err: any) {
    logError('Media', `Failed to load media: ${err?.message || err}`)
  } finally {
    loading.value = false
  }
}

async function createFolderPrompt() {
  const name = prompt(isRTL.value ? 'نام پوشه جدید:' : 'New folder name:')?.trim()
  if (!name) return

  try {
    logNetwork('Media', `Creating folder "${name}"`)
    await pb.collection('media_folders').create({ name, path: name })
    await fetchData()
  } catch (err: any) {
    logError('Media', `Failed to create folder: ${err?.message || err}`)
  }
}

onMounted(() => {
  const cf = getCachedFolders()
  const cfl = getCachedFiles()
  if (cf.length) allFolders.value = cf
  if (cfl.length) allFiles.value = cfl
  fetchData()
})
</script>
