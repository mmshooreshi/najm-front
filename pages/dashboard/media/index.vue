<!-- pages/dashboard/media/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Header & Action Bar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:folder-multiple-image" class="h-5 w-5 text-[#018786]" />
          {{ isRTL ? 'مخزن رسانه و تصاویر' : 'Media Studio' }}
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          {{
            isRTL
              ? 'مدیریت و آپلود تصاویر محصولات، کاتالوگ‌ها و فایل‌های بسته بندی'
              : 'Product images, PDFs, packaging templates, and CDN media assets'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="createFolderPrompt"
          class="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
        >
          <Icon name="mdi:folder-plus-outline" class="h-4 w-4 text-[#018786]" />
          {{ isRTL ? 'پوشه جدید' : 'New Folder' }}
        </button>

        <button
          @click="fetchData"
          :disabled="loading"
          class="flex items-center gap-1 rounded-xl bg-[#018786] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#018786]/90 transition shadow-xs disabled:opacity-50 cursor-pointer"
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
              ? 'bg-[#018786] text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          {{ isRTL ? cat.labelFa : cat.labelEn }}
        </button>
      </div>

      <!-- File Search -->
      <div class="relative w-full sm:w-56">
        <input
          v-model="fileSearchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجوی نام فایل...' : 'Search files...'"
          class="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#018786] transition"
        />
      </div>
    </div>

    <!-- Main Workspace Layout: Folder Sidebar + File Grid -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <!-- Left/Right Folder Tree Navigation Card -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3 h-fit">
        <div class="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <h3 class="text-xs font-bold text-gray-900 font-d4 flex items-center gap-1.5">
            <Icon name="mdi:folder-tree" class="h-4 w-4 text-[#018786]" />
            {{ isRTL ? 'ساختار پوشه‌ها' : 'Folders' }}
          </h3>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
            {{ toLocalizedDigits(allFolders.length) }}
          </span>
        </div>

        <!-- Folder List Tree -->
        <div class="space-y-1 text-xs">
          <!-- Root item -->
          <button
            @click="currentFolder = ''"
            class="flex items-center justify-between w-full rounded-xl px-3 py-2 text-start font-semibold transition cursor-pointer"
            :class="!currentFolder ? 'bg-teal-50 text-[#018786] font-bold' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:folder-home-outline" class="h-4 w-4 text-[#018786]" />
              <span>/root</span>
            </div>
            <span class="rounded-full bg-gray-200 px-1.5 py-0.2 text-[10px]">
              {{ toLocalizedDigits(countInFolder('')) }}
            </span>
          </button>

          <!-- Subfolders -->
          <div v-for="folder in allFolders" :key="folder.id" class="ps-2">
            <button
              @click="currentFolder = folder.path"
              class="flex items-center justify-between w-full rounded-xl px-3 py-1.5 text-start transition cursor-pointer"
              :class="currentFolder === folder.path ? 'bg-teal-50 text-[#018786] font-bold' : 'text-gray-700 hover:bg-gray-100'"
            >
              <div class="flex items-center gap-2 truncate">
                <Icon name="mdi:folder-outline" class="h-4 w-4 text-[#018786] shrink-0" />
                <span class="truncate">{{ folder.name }}</span>
              </div>
              <span class="rounded-full bg-gray-100 px-1.5 py-0.2 text-[10px] text-gray-600 shrink-0">
                {{ toLocalizedDigits(countInFolder(folder.path)) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right/Left Media Assets Canvas -->
      <div class="lg:col-span-3 space-y-4">
        <!-- Drag & Drop Uploader -->
        <div class="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 hover:border-[#018786] transition">
          <FileUploader :currentPath="currentFolder" @uploaded="fetchData" />
        </div>

        <!-- Media Assets Gallery -->
        <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xs min-h-[350px]">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 text-xs">
            <span class="font-bold text-gray-900 font-d4">
              {{ isRTL ? 'فایل‌های انتخاب‌شده' : 'Assets' }} ({{ toLocalizedDigits(filteredFiles.length) }})
            </span>

            <span class="text-gray-500 font-mono text-[11px]">
              Path: {{ currentFolder ? `/${currentFolder}` : '/root' }}
            </span>
          </div>

          <!-- Empty Files -->
          <div v-if="filteredFiles.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400 space-y-2">
            <Icon name="mdi:file-image-outline" class="h-10 w-10 opacity-40" />
            <p class="text-xs">{{ isRTL ? 'فایلی یافت نشد.' : 'No media files in this path.' }}</p>
          </div>

          <!-- Assets Cards Grid -->
          <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              @click="infoFile = file"
              class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xs hover:border-[#018786] hover:shadow-md transition cursor-pointer"
            >
              <!-- Thumbnail preview -->
              <div class="relative h-28 w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center">
                <img
                  v-if="isImageFile(file)"
                  :src="getMediaFileUrl(file)"
                  :alt="file.filename || file.name"
                  class="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div v-else class="flex flex-col items-center text-gray-400">
                  <Icon :name="getFileTypeIcon(file)" class="h-8 w-8 text-[#018786]" />
                  <span class="text-[10px] font-bold uppercase mt-1">{{ getFileExt(file) }}</span>
                </div>
              </div>

              <!-- Metadata -->
              <div class="mt-2 text-start">
                <h4 class="text-xs font-bold text-gray-900 truncate font-mono" :title="file.filename || file.name">
                  {{ file.filename || file.name || 'نام‌گذاری نشده' }}
                </h4>
                <div class="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                  <span>{{ formatFileSize(file.size) }}</span>
                  <span class="rounded bg-gray-100 px-1 font-mono uppercase">{{ getFileExt(file) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Media Lightbox Inspector Modal -->
    <div
      v-if="infoFile"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="infoFile = null"
    >
      <div class="flex flex-col md:flex-row max-w-4xl w-full rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        <!-- Preview Box -->
        <div class="md:w-1/2 bg-gray-950 p-6 flex items-center justify-center min-h-[250px]">
          <img
            v-if="isImageFile(infoFile)"
            :src="getMediaFileUrl(infoFile)"
            :alt="infoFile.filename"
            class="max-h-[350px] w-auto object-contain rounded-xl shadow-lg"
          />
          <div v-else class="text-center text-white space-y-2">
            <Icon :name="getFileTypeIcon(infoFile)" class="h-16 w-16 text-[#018786] mx-auto" />
            <p class="text-xs font-bold uppercase">{{ getFileExt(infoFile) }} File</p>
          </div>
        </div>

        <!-- Asset Details & Copy Snippets -->
        <div class="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 class="text-sm font-bold text-gray-900 font-d4 truncate max-w-[220px]">
                {{ infoFile.filename || infoFile.name }}
              </h3>
              <button @click="infoFile = null" class="text-gray-400 hover:text-gray-700">
                <Icon name="mdi:close" class="h-5 w-5" />
              </button>
            </div>

            <!-- Copy Snippets -->
            <div class="space-y-2.5 text-xs">
              <div>
                <label class="block text-[11px] font-bold text-gray-600 mb-1">{{ isRTL ? 'لینک CDN مستقیم:' : 'Direct CDN URL:' }}</label>
                <div class="flex items-center gap-1">
                  <input
                    readonly
                    :value="getMediaFileUrl(infoFile)"
                    class="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 font-mono truncate"
                  />
                  <button
                    @click="copyText(getMediaFileUrl(infoFile))"
                    class="rounded-xl bg-[#018786] px-2.5 py-1 font-bold text-white hover:bg-[#018786]/90 transition cursor-pointer"
                  >
                    {{ isRTL ? 'کپی' : 'Copy' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-600 mb-1">HTML Image Tag:</label>
                <div class="flex items-center gap-1">
                  <input
                    readonly
                    :value="`<img src='${getMediaFileUrl(infoFile)}' alt='${infoFile.filename}' />`"
                    class="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 font-mono truncate"
                  />
                  <button
                    @click="copyText(`<img src='${getMediaFileUrl(infoFile)}' alt='${infoFile.filename}' />`)"
                    class="rounded-xl bg-gray-800 px-2.5 py-1 font-bold text-white hover:bg-gray-700 transition cursor-pointer"
                  >
                    {{ isRTL ? 'کپی' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 font-mono text-[11px]">ID: {{ infoFile.id }}</span>
            <button
              @click="deleteFile(infoFile.id)"
              class="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
            >
              {{ isRTL ? 'حذف فایل' : 'Delete Asset' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { usePocketBase } from '~/plugins/pb.client'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { useDashboardState } from '~/composables/useDashboardCache'
import { toLocalizedDigits } from '~/utils/digits'
import FileUploader from '@/components/FileUploader.vue'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const pb = usePocketBase()
const { logInfo, logError, logNetwork } = useAdminLogger()

const loading = ref(false)
const selectedCategory = ref('all')
const fileSearchQuery = ref('')
const currentFolder = ref('')
const infoFile = ref<any | null>(null)

const cachedFolders = useDashboardState<any[]>('media-folders', () => [])
const cachedFiles = useDashboardState<any[]>('media-files', () => [])

const allFolders = computed(() => cachedFolders.value)
const allFiles = computed(() => cachedFiles.value)

const categoryOptions = [
  { labelFa: 'همه', labelEn: 'All', value: 'all' },
  { labelFa: 'تصاویر', labelEn: 'Images', value: 'images' },
  { labelFa: 'قالب‌ها (PDF)', labelEn: 'PDFs', value: 'pdfs' },
]

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

function getMediaFileUrl(file: any): string {
  const pbUrl = useRuntimeConfig().public.pbUrl || 'http://65.108.80.205:8090'
  const fn = file.file || file.filename
  return `${pbUrl}/api/files/${file.collectionId || 'media_files'}/${file.id}/${fn}`
}

function isImageFile(file: any): boolean {
  const fn = String(file.file || file.filename || '').toLowerCase()
  return /\.(jpg|jpeg|png|webp|svg|gif|avif)$/.test(fn)
}

function getFileExt(file: any): string {
  const fn = String(file.file || file.filename || '')
  return fn.split('.').pop()?.toLowerCase() || 'file'
}

function getFileTypeIcon(file: any): string {
  const ext = getFileExt(file)
  if (ext === 'pdf') return 'mdi:file-pdf-box'
  if (ext === 'zip' || ext === 'rar') return 'mdi:folder-zip-outline'
  return 'mdi:file-outline'
}

function formatFileSize(bytes = 0): string {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function copyText(text: string) {
  navigator.clipboard.writeText(text)
  alert(isRTL.value ? 'کپی شد.' : 'Copied.')
}

async function fetchData() {
  loading.value = true
  try {
    logNetwork('Media', 'Fetching media folders and files')
    const [folders, filesList] = await Promise.all([
      pb.collection('media_folders').getFullList({ sort: 'path' }),
      pb.collection('media_files').getFullList({ sort: '-created' }),
    ])
    cachedFolders.value = folders
    cachedFiles.value = filesList
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

async function deleteFile(id: string) {
  if (!confirm(isRTL.value ? 'حذف فایل؟' : 'Delete file?')) return
  try {
    logNetwork('Media', `Deleting file ${id}`)
    await pb.collection('media_files').delete(id)
    infoFile.value = null
    await fetchData()
  } catch (err: any) {
    logError('Media', `Failed to delete file: ${err?.message || err}`)
  }
}

onMounted(() => {
  fetchData()
})
</script>
