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
              ? 'مدیریت و آپلود تصاویر محصولات، کاتالوگ‌ها و فایل‌های بسته‌بندی با کش پرسرعت و پوشه‌بندی تودرتو'
              : 'Product images, PDFs, packaging templates, and CDN media assets with nested folders'
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

    <!-- Category Filter Bar & Search & Breadcrumbs -->
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
              ? 'bg-najmgreen text-white shadow-xs font-bold'
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
            class="p-1.5 rounded-lg transition cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="شبکه‌ای متراکم"
          >
            <Icon name="mdi:view-grid-outline" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'cards'"
            class="p-1.5 rounded-lg transition cursor-pointer"
            :class="viewMode === 'cards' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="کارت‌های همراه با جزئیات"
          >
            <Icon name="mdi:view-agenda-outline" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            class="p-1.5 rounded-lg transition cursor-pointer"
            :class="viewMode === 'table' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
            title="جدول"
          >
            <Icon name="mdi:view-list" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Workspace Layout: Nested Folder Sidebar + File Grid -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
      <!-- Left Nested Folder Tree Navigation Card (3.5 cols) -->
      <div class="lg:col-span-4 bg-white rounded-3xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <h3 class="text-xs font-bold text-gray-900 font-d4 flex items-center gap-1.5">
            <Icon name="mdi:folder-tree" class="h-4 w-4 text-najmgreen" />
            {{ isRTL ? 'ساختار درختی پوشه‌ها' : 'Folders Tree' }}
          </h3>
          <button
            @click="expandAllFolders = !expandAllFolders"
            class="text-[10px] text-gray-500 hover:text-najmgreen transition"
          >
            {{ expandAllFolders ? 'بستن همه' : 'باز کردن همه' }}
          </button>
        </div>

        <!-- Root Folder Item -->
        <button
          @click="selectFolder('')"
          class="flex items-center justify-between w-full rounded-2xl px-3.5 py-2.5 text-start font-semibold transition cursor-pointer"
          :class="!currentFolder ? 'bg-emerald-50 text-najmgreen font-bold border border-najmgreen/30' : 'text-gray-700 hover:bg-gray-50'"
        >
          <div class="flex items-center gap-2">
            <Icon name="mdi:folder-home-outline" class="h-4.5 w-4.5 text-najmgreen" />
            <span class="text-xs font-bold">پوشه اصلی (/root)</span>
          </div>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600">
            {{ toLocalizedDigits(countInFolder('')) }}
          </span>
        </button>

        <!-- Recursive Nested Folder Tree List -->
        <div class="space-y-1 text-xs max-h-[60vh] overflow-y-auto pe-1">
          <template v-for="node in nestedFolderTree" :key="node.path">
            <div class="space-y-1">
              <!-- Level 1 Node -->
              <div
                class="flex items-center justify-between rounded-xl px-2.5 py-1.5 transition cursor-pointer group"
                :class="currentFolder === node.path ? 'bg-emerald-50 text-najmgreen font-bold' : 'text-gray-700 hover:bg-gray-50'"
                @click="selectFolder(node.path)"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <button
                    v-if="node.children?.length"
                    @click.stop="toggleNode(node)"
                    class="p-1 rounded text-gray-400 hover:text-gray-800 transition"
                  >
                    <Icon
                      :name="isNodeOpen(node) ? 'mdi:chevron-down' : 'mdi:chevron-left'"
                      class="w-3.5 h-3.5"
                    />
                  </button>
                  <span v-else class="w-5"></span>

                  <Icon
                    :name="isNodeOpen(node) ? 'mdi:folder-open-outline' : 'mdi:folder-outline'"
                    class="w-4 h-4 text-najmgreen flex-shrink-0"
                  />
                  <span class="truncate font-mono text-[11px]">{{ node.name }}</span>
                </div>

                <div class="flex items-center gap-1">
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 font-mono">
                    {{ toLocalizedDigits(countInFolder(node.path)) }}
                  </span>
                </div>
              </div>

              <!-- Level 2 Sub-nodes (if open) -->
              <div v-if="isNodeOpen(node) && node.children?.length" class="pr-5 space-y-1 border-r border-gray-100 mr-3">
                <template v-for="child in node.children" :key="child.path">
                  <div
                    class="flex items-center justify-between rounded-xl px-2.5 py-1.5 transition cursor-pointer group"
                    :class="currentFolder === child.path ? 'bg-emerald-50 text-najmgreen font-bold' : 'text-gray-600 hover:bg-gray-50'"
                    @click="selectFolder(child.path)"
                  >
                    <div class="flex items-center gap-1.5 min-w-0">
                      <button
                        v-if="child.children?.length"
                        @click.stop="toggleNode(child)"
                        class="p-0.5 rounded text-gray-400 hover:text-gray-800"
                      >
                        <Icon :name="isNodeOpen(child) ? 'mdi:chevron-down' : 'mdi:chevron-left'" class="w-3 h-3" />
                      </button>
                      <Icon name="mdi:folder-outline" class="w-3.5 h-3.5 text-gray-400 group-hover:text-najmgreen" />
                      <span class="truncate font-mono text-[11px]">{{ child.name }}</span>
                    </div>

                    <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-500 font-mono">
                      {{ toLocalizedDigits(countInFolder(child.path)) }}
                    </span>
                  </div>

                  <!-- Level 3 Sub-nodes -->
                  <div v-if="isNodeOpen(child) && child.children?.length" class="pr-4 space-y-1 border-r border-gray-100 mr-2">
                    <div
                      v-for="subchild in child.children"
                      :key="subchild.path"
                      class="flex items-center justify-between rounded-lg px-2 py-1 transition cursor-pointer"
                      :class="currentFolder === subchild.path ? 'bg-emerald-50 text-najmgreen font-bold' : 'text-gray-500 hover:bg-gray-50'"
                      @click="selectFolder(subchild.path)"
                    >
                      <div class="flex items-center gap-1 min-w-0">
                        <Icon name="mdi:folder-outline" class="w-3 h-3 text-gray-400" />
                        <span class="truncate font-mono text-[10px]">{{ subchild.name }}</span>
                      </div>
                      <span class="text-[9px] font-mono text-gray-400">
                        {{ toLocalizedDigits(countInFolder(subchild.path)) }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Right Media Assets Canvas (8.5 cols) -->
      <div class="lg:col-span-8 space-y-4">
        <!-- Interactive Breadcrumbs -->
        <div class="bg-white p-3.5 px-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-1.5 text-gray-500 flex-wrap">
            <button @click="selectFolder('')" class="hover:text-najmgreen font-bold flex items-center gap-1">
              <Icon name="mdi:home" class="w-3.5 h-3.5 text-najmgreen" />
              root
            </button>
            <template v-for="(seg, idx) in breadcrumbSegments" :key="idx">
              <span>/</span>
              <button
                @click="selectFolder(seg.path)"
                class="hover:text-najmgreen"
                :class="idx === breadcrumbSegments.length - 1 ? 'text-gray-900 font-bold' : ''"
              >
                {{ seg.name }}
              </button>
            </template>
          </div>

          <span class="text-[11px] text-gray-400 font-sans">
            {{ filteredFiles.length }} فایل در این مسیر
          </span>
        </div>

        <!-- Drag & Drop Uploader -->
        <div class="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 hover:border-najmgreen transition shadow-xs">
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
const expandAllFolders = ref(true)
const openNodesMap = ref<Record<string, boolean>>({})

const allFolders = ref<any[]>([])
const allFiles = ref<any[]>([])

const categoryOptions = [
  { labelFa: 'همه فایل‌ها', labelEn: 'All', value: 'all' },
  { labelFa: 'تصاویر', labelEn: 'Images', value: 'images' },
  { labelFa: 'قالب‌ها و PDF', labelEn: 'PDFs', value: 'pdfs' },
]

const syncLabel = computed(() => {
  if (syncState.value === 'syncing') return 'در حال همگام‌سازی...'
  if (syncState.value === 'synced') return `همگام‌شده (${lastSyncTime.value || 'الان'})`
  return 'بارگذاری از کش محلی'
})

interface FolderNode {
  name: string
  path: string
  children: FolderNode[]
}

const nestedFolderTree = computed<FolderNode[]>(() => {
  const rootMap = new Map<string, any>()
  const sorted = [...allFolders.value].sort((a, b) => (a.path || a.name || '').localeCompare(b.path || b.name || ''))

  for (const f of sorted) {
    const rawPath = (f.path || f.name || '').replace(/^\/+|\/+$/g, '')
    if (!rawPath) continue
    const parts = rawPath.split('/')

    let current = ''
    let parentMap = rootMap

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      current = current ? `${current}/${part}` : part

      if (!parentMap.has(part)) {
        parentMap.set(part, {
          name: part,
          path: current,
          _childrenMap: new Map<string, any>()
        })
      }
      parentMap = parentMap.get(part)._childrenMap
    }
  }

  function mapToArray(map: Map<string, any>): FolderNode[] {
    const list: FolderNode[] = []
    for (const [, item] of map) {
      list.push({
        name: item.name,
        path: item.path,
        children: mapToArray(item._childrenMap)
      })
    }
    return list
  }

  return mapToArray(rootMap)
})

function isNodeOpen(node: FolderNode): boolean {
  if (openNodesMap.value[node.path] !== undefined) {
    return openNodesMap.value[node.path]
  }
  return expandAllFolders.value
}

function toggleNode(node: FolderNode) {
  openNodesMap.value[node.path] = !isNodeOpen(node)
}

function selectFolder(path: string) {
  currentFolder.value = path.replace(/^\/+|\/+$/g, '')
}

const breadcrumbSegments = computed(() => {
  const norm = currentFolder.value.replace(/^\/+|\/+$/g, '')
  if (!norm) return []
  const parts = norm.split('/')
  return parts.map((part, idx) => ({
    name: part,
    path: parts.slice(0, idx + 1).join('/')
  }))
})

const filteredFiles = computed(() => {
  const target = currentFolder.value.replace(/^\/+|\/+$/g, '')
  let list = allFiles.value.filter((f) => (f.path || '').replace(/^\/+|\/+$/g, '') === target)

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
  const target = path.replace(/^\/+|\/+$/g, '')
  return allFiles.value.filter((f) => (f.path || '').replace(/^\/+|\/+$/g, '') === target).length
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

  const parent = currentFolder.value.replace(/^\/+|\/+$/g, '')
  const path = parent ? `${parent}/${name}` : name

  try {
    logNetwork('Media', `Creating folder "${name}" at ${path}`)
    await pb.collection('media_folders').create({ name, path })
    await fetchData()
    selectFolder(path)
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
