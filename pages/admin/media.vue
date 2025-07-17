<!-- pages/admin/media.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'
import FileUploader from '@/components/FileUploader.vue'
import FileGrid from '@/components/FileGrid.vue'
import ImageInfoModal from '@/components/ImageInfoModal.vue'
import AsComponent from '@/components/as.vue'
import { useRoute, useRouter } from 'vue-router'   // ← NEW


const route   = useRoute()                         // ← NEW
const router  = useRouter()                        // ← NEW


// PocketBase client
const pb = usePocketBase()

// State
const allFiles = ref<any[]>([])
const allFolders = ref<any[]>([])
const files = ref<any[]>([])
const currentFolder = ref<string>('') // root
const infoFile = ref<any|null>(null)

// Normalize paths
function normalize(path = ''): string {
  return path.replace('/(^\/+|\/+$/g', '')
}

// Load from cache
function loadCacheData() {
  const fc = localStorage.getItem('media_folders_cache')
  if (fc) allFolders.value = JSON.parse(fc)
  const ff = localStorage.getItem('media_files_cache')
  if (ff) allFiles.value = JSON.parse(ff)
}

// Update view immediately based on cache or fresh data
function updateView() {
  const folder = normalize(currentFolder.value)
  // show files exactly in current folder
  files.value = allFiles.value.filter(f => normalize(f.path) === folder)
}

// Fetch fresh data
async function fetchData() {
  try {
    const [folders, filesList] = await Promise.all([
      pb.collection('media_folders').getFullList({ sort: 'path' }),
      pb.collection('media_files').getFullList({ sort: '-created' })
    ])
    allFolders.value = folders
    allFiles.value = filesList
    localStorage.setItem('media_folders_cache', JSON.stringify(folders))
    localStorage.setItem('media_files_cache', JSON.stringify(filesList))
    updateView()
  } catch (e) {
    console.error('Fetch failed', e)
  }
}

// Compute subfolders
const uniqueSubfolders = computed(() => {
  const folder = normalize(currentFolder.value)
  const prefix = folder ? `${folder}/` : ''
  return allFolders.value
    .map(f => normalize(f.path))
    .filter(path => {
      if (!folder) return !path.includes('/')
      return path.startsWith(prefix) && !path.slice(prefix.length + 1).includes('/')
    })
    .map(path => path.split('/').pop()!)
})

// Count files directly in subfolder
function countInFolder(name: string): number {
  const parent = normalize(currentFolder.value)
  const target = parent ? `${parent}/${normalize(name)}` : normalize(name)
  return allFiles.value.filter(f => normalize(f.path) === target).length
}


/* ───── whenever the folder changes, patch the URL ─── */
watch(currentFolder, (val) => {
  router.replace({
    query: {                                      // preserve other params
      ...route.query,
      path: val || undefined                      // remove param if at root
    }
  })
  updateView()
  fetchData()
})

// Navigation with immediate view update
function enterFolder(name: string) {
  const folder = normalize(currentFolder.value)
  currentFolder.value = folder ? `${folder}/${name}` : name
  updateView()
  // then fetch fresh
  fetchData()
}

function goUp() {
  const parts = normalize(currentFolder.value).split('/')
  parts.pop()
  currentFolder.value = parts.join('/')
  updateView()
  fetchData()
}

// Create and remove folders
async function createFolder() {
  const name = prompt('New folder name:')?.trim()
  if (!name) return
  const parent = normalize(currentFolder.value)
  const path = parent ? `${parent}/${name}` : name
  try {
    await pb.collection('media_folders').create({ name, path })
    await fetchData()
  } catch { alert('Create failed') }
}

async function removeFolder(name: string) {
  if (!confirm(`Remove folder "${name}"?`)) return
  const parent = normalize(currentFolder.value)
  const path = parent ? `${parent}/${name}` : name
  // delete files
  const toDel = allFiles.value.filter(f => normalize(f.path) === path)
  await Promise.all(toDel.map(f => pb.collection('media_files').delete(f.id)))
  // delete folder rec
  const rec = allFolders.value.find(f => normalize(f.path) === path)
  if (rec) await pb.collection('media_folders').delete(rec.id)
  await fetchData()
}

// Lifecycle
onMounted(() => {
  const initial = (route.query.path as string | undefined) || ''
  currentFolder.value = initial

  loadCacheData()
  updateView()
  fetchData()
})

watch(currentFolder, (newVal, oldVal) => {
  // already handled in enter/goUp
})

definePageMeta({ name: 'MediaLab', layout: 'raw' })
</script>

<template>
  <section class="flex flex-col h-full space-y-3 overflow-auto">
    <AsComponent />
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold title-panbe">Media Lab</h1>
      <nav class="text-sm flex items-center gap-2">
        <button v-if="currentFolder" @click="goUp" class="underline font-mono font-extrabold text-[20px]">..</button>
        <span class="font-extrabold font-mono text-[20px] tracking-[3px]">/{{ currentFolder }}</span>
        <button @click="createFolder" class="ml-4 px-2 py-1 bg-teal-500 text-white rounded">+ New Folder</button>
      </nav>
    </div>

    <!-- Upload -->
    <div class="border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 transition bg-white p-6">
      <FileUploader :currentPath="currentFolder" @uploaded="fetchData" />
      <!-- {{ currentFolder }} -->
    </div>

    <!-- Folders -->
    <div v-if="uniqueSubfolders.length" class="flex flex-wrap gap-2">
      <div v-for="name in uniqueSubfolders" :key="name" class="relative px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-teal-200 flex items-center">
        <span @click="enterFolder(name)">📁 {{ name }}</span>
        <span class="ml-2 bg-white text-xs text-gray-700 px-1 rounded-full border">{{ countInFolder(name) }}</span>
        <button @click.stop="removeFolder(name)" class="ml-2 text-red-500 text-sm">✕</button>
      </div>
    </div>

    <!-- Files -->
    <div class="flex-1 h-max">
      <FileGrid :files="files" @refresh="fetchData" class="h-full" @info="infoFile = $event" />
    </div>

    <!-- Info -->
    <ImageInfoModal v-if="infoFile" :file="infoFile" @close="infoFile = null" />
  </section>
</template>

<style scoped>
.image-pixelated { image-rendering: pixelated; }
</style>
