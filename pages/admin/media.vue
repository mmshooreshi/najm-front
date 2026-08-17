<!-- pages/admin/media.vue -->
<template>
  <div dir="rtl" class="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 bg-[#F8FAFC]">
    <!-- Top Header: Title & Sync Signal Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center font-bold">
            <Icon name="mdi:image-multiple-outline" class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">مدیریت رسانه و فایل‌ها (Media Lab)</h1>
            <p class="text-xs text-gray-500">
              مدیریت پرسرعت دارایی‌های دیجیتال، تصاویر و کاتالوگ‌ها با کش محلی هوشمند
            </p>
          </div>
        </div>
      </div>

      <!-- Sync Status & Stats -->
      <div class="flex items-center gap-3">
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
          @click="fetchData"
          class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          title="همگام‌سازی مجدد با سرور"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" :class="{ 'animate-spin': syncState === 'syncing' }" />
        </button>

        <button
          @click="createFolder"
          class="px-4 py-2 bg-najmgreen hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Icon name="mdi:folder-plus-outline" class="w-4 h-4" />
          <span>+ پوشه جدید</span>
        </button>
      </div>
    </div>

    <!-- Recent Folders Quick Jump Bar -->
    <div v-if="recentFolders.length" class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <span class="text-gray-400 font-bold whitespace-nowrap">پوشه‌های اخیر:</span>
      <button
        v-for="rf in recentFolders"
        :key="rf"
        @click="goToFolder(rf)"
        class="px-3 py-1 rounded-xl bg-white border border-gray-200 hover:border-najmgreen/40 hover:bg-emerald-50/50 text-gray-700 transition flex items-center gap-1 font-mono text-[11px]"
      >
        <Icon name="mdi:folder-outline" class="w-3.5 h-3.5 text-najmgreen" />
        <span>{{ rf || 'root' }}</span>
      </button>
    </div>

    <!-- Main Workspace Layout: Sidebar Tree + Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Sidebar: Folder Hierarchy Tree (3 cols) -->
      <div class="lg:col-span-3 bg-white rounded-3xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100">
          <span class="text-xs font-bold text-gray-700">ساختار پوشه‌ها</span>
          <span class="text-[10px] text-gray-400 font-mono">{{ allFolders.length }} پوشه</span>
        </div>

        <div class="space-y-1 max-h-[60vh] overflow-y-auto">
          <!-- Root item -->
          <button
            @click="goToFolder('')"
            class="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition"
            :class="!currentFolder ? 'bg-najmgreen/10 text-najmgreen font-bold' : 'text-gray-700 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:home-outline" class="w-4 h-4" />
              <span>ریشه (root)</span>
            </div>
            <span class="text-[10px] font-mono text-gray-400">{{ countFilesInFolder('') }}</span>
          </button>

          <!-- Dynamic Folder Tree List -->
          <div
            v-for="folder in allFolders"
            :key="folder.id"
            class="group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer"
            :class="currentFolder === folder.path ? 'bg-najmgreen/10 text-najmgreen font-bold' : 'text-gray-700 hover:bg-gray-50'"
            @click="goToFolder(folder.path)"
          >
            <div class="flex items-center gap-2 truncate">
              <Icon name="mdi:folder-outline" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen flex-shrink-0" />
              <span class="truncate font-mono text-[11px]">{{ folder.name || folder.path }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">
                {{ countFilesInFolder(folder.path) }}
              </span>
              <button
                @click.stop="removeFolder(folder.name, folder.path)"
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-0.5 transition"
                title="حذف پوشه"
              >
                <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Workspace (9 cols) -->
      <div class="lg:col-span-9 space-y-4">
        <!-- Interactive Breadcrumbs & Search/Sort Bar -->
        <div class="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <!-- Breadcrumb -->
          <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <button @click="goToFolder('')" class="hover:text-najmgreen font-bold flex items-center gap-1">
                <Icon name="mdi:home" class="w-3.5 h-3.5 text-najmgreen" />
                root
              </button>
              <template v-for="(seg, idx) in breadcrumbSegments" :key="idx">
                <span>/</span>
                <button
                  @click="goToFolder(seg.path)"
                  class="hover:text-najmgreen"
                  :class="idx === breadcrumbSegments.length - 1 ? 'text-gray-900 font-bold' : ''"
                >
                  {{ seg.name }}
                </button>
              </template>
            </div>

            <!-- View Mode Switcher -->
            <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                @click="viewMode = 'grid'"
                class="p-1.5 rounded-lg transition"
                :class="viewMode === 'grid' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                title="نمایش شبکه‌ای متراکم"
              >
                <Icon name="mdi:view-grid-outline" class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'cards'"
                class="p-1.5 rounded-lg transition"
                :class="viewMode === 'cards' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                title="نمایش کارت‌های همراه با جزئیات"
              >
                <Icon name="mdi:view-agenda-outline" class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'table'"
                class="p-1.5 rounded-lg transition"
                :class="viewMode === 'table' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                title="نمایش جدولی"
              >
                <Icon name="mdi:view-list" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- In-place Filter & Sort -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="relative w-full sm:w-72">
              <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                v-model="searchFilter"
                type="text"
                placeholder="فیلتر نام فایل در این پوشه..."
                class="w-full pr-9 pl-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition font-mono text-right"
              />
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <span class="text-xs text-gray-500 whitespace-nowrap">مرتب‌سازی:</span>
              <select
                v-model="sortCriteria"
                class="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-najmgreen transition"
              >
                <option value="-created">جدیدترین آپلودها</option>
                <option value="created">قدیمی‌ترین آپلودها</option>
                <option value="name-asc">نام (الف تا ی / A-Z)</option>
                <option value="name-desc">نام (ی تا الف / Z-A)</option>
                <option value="-size">حجم فایل (بزرگ به کوچک)</option>
                <option value="size">حجم فایل (کوچک به بزرگ)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Fast Dropzone Uploader -->
        <div class="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 hover:border-najmgreen transition shadow-xs">
          <FileUploader :currentPath="currentFolder" @uploaded="fetchData" />
        </div>

        <!-- Files Grid/Cards/Table -->
        <FileGrid
          :files="filteredAndSortedFiles"
          :viewMode="viewMode"
          @refresh="fetchData"
          @info="infoFile = $event"
        />
      </div>
    </div>

    <!-- Image Info Modal -->
    <ImageInfoModal v-if="infoFile" :file="infoFile" @close="infoFile = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePocketBase } from '~/plugins/pb.client'
import { useMediaCache } from '~/composables/useMediaCache'
import FileUploader from '@/components/FileUploader.vue'
import FileGrid from '@/components/FileGrid.vue'
import ImageInfoModal from '@/components/ImageInfoModal.vue'

definePageMeta({ name: 'MediaLab', layout: 'raw' })

const route = useRoute()
const router = useRouter()
const pb = usePocketBase()

const {
  syncState,
  lastSyncTime,
  recentFolders,
  loadRecentFolders,
  addRecentFolder,
  getCachedFolders,
  getCachedFiles,
  saveCache
} = useMediaCache()

const allFiles = ref<any[]>([])
const allFolders = ref<any[]>([])
const currentFolder = ref<string>('')
const searchFilter = ref<string>('')
const sortCriteria = ref<string>('-created')
const viewMode = ref<'grid' | 'cards' | 'table'>('grid')
const infoFile = ref<any | null>(null)

function normalize(path = ''): string {
  return path.replace(/^\/+|\/+$/g, '')
}

const syncLabel = computed(() => {
  if (syncState.value === 'syncing') return 'در حال همگام‌سازی...'
  if (syncState.value === 'synced') return `همگام‌شده (${lastSyncTime.value || 'الان'})`
  return 'بارگذاری از کش محلی'
})

const breadcrumbSegments = computed(() => {
  const norm = normalize(currentFolder.value)
  if (!norm) return []
  const parts = norm.split('/')
  return parts.map((part, idx) => ({
    name: part,
    path: parts.slice(0, idx + 1).join('/')
  }))
})

function countFilesInFolder(path: string): number {
  const target = normalize(path)
  return allFiles.value.filter(f => normalize(f.path) === target).length
}

const filteredAndSortedFiles = computed(() => {
  const target = normalize(currentFolder.value)
  let list = allFiles.value.filter(f => normalize(f.path) === target)

  // Filter search
  if (searchFilter.value.trim()) {
    const q = searchFilter.value.trim().toLowerCase()
    list = list.filter(f => f.filename?.toLowerCase().includes(q))
  }

  // Sort
  const sorted = [...list]
  if (sortCriteria.value === '-created') {
    sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  } else if (sortCriteria.value === 'created') {
    sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
  } else if (sortCriteria.value === 'name-asc') {
    sorted.sort((a, b) => (a.filename || '').localeCompare(b.filename || ''))
  } else if (sortCriteria.value === 'name-desc') {
    sorted.sort((a, b) => (b.filename || '').localeCompare(a.filename || ''))
  } else if (sortCriteria.value === '-size') {
    sorted.sort((a, b) => (b.size || 0) - (a.size || 0))
  } else if (sortCriteria.value === 'size') {
    sorted.sort((a, b) => (a.size || 0) - (b.size || 0))
  }

  return sorted
})

async function fetchData() {
  syncState.value = 'syncing'
  try {
    const [folders, filesList] = await Promise.all([
      pb.collection('media_folders').getFullList({ sort: 'path' }),
      pb.collection('media_files').getFullList({ sort: '-created' })
    ])
    allFolders.value = folders
    allFiles.value = filesList
    saveCache(folders, filesList)
  } catch (err) {
    console.error('Fetch failed, keeping cached data', err)
    syncState.value = 'error'
  }
}

function goToFolder(path: string) {
  currentFolder.value = normalize(path)
  addRecentFolder(currentFolder.value)
  router.replace({
    query: {
      ...route.query,
      path: currentFolder.value || undefined
    }
  })
}

async function createFolder() {
  const name = prompt('نام پوشه جدید:')?.trim()
  if (!name) return
  const parent = normalize(currentFolder.value)
  const path = parent ? `${parent}/${name}` : name
  try {
    await pb.collection('media_folders').create({ name, path })
    await fetchData()
    goToFolder(path)
  } catch {
    alert('خطا در ایجاد پوشه')
  }
}

async function removeFolder(name: string, path: string) {
  if (!confirm(`آیا از حذف پوشه "${name}" و تمامی فایل‌های درون آن اطمینان دارید؟`)) return
  try {
    const toDel = allFiles.value.filter(f => normalize(f.path) === path)
    await Promise.all(toDel.map(f => pb.collection('media_files').delete(f.id)))
    const rec = allFolders.value.find(f => normalize(f.path) === path)
    if (rec) await pb.collection('media_folders').delete(rec.id)
    await fetchData()
    if (currentFolder.value === path) goToFolder('')
  } catch {
    alert('خطا در حذف پوشه')
  }
}

onMounted(() => {
  loadRecentFolders()
  // 1. Instant load from local cache
  const cf = getCachedFolders()
  const cfl = getCachedFiles()
  if (cf.length) allFolders.value = cf
  if (cfl.length) {
    allFiles.value = cfl
    syncState.value = 'cached'
  }

  // 2. Set active folder from URL query
  const initial = (route.query.path as string | undefined) || ''
  currentFolder.value = normalize(initial)
  if (currentFolder.value) addRecentFolder(currentFolder.value)

  // 3. Stale-while-revalidate background fetch
  fetchData()
})
</script>
