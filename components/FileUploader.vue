<!-- components/FileUploader.vue -->

<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition h-full w-full hover:bg-teal-400/10"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <input
      ref="input"
      type="file"
      multiple
      class="hidden"
      @change="onInputChange"
    />
    <button
      @click="triggerFileDialog"
      class="group btn btn-outline flex items-center justify-center h-64 w-full"
    >
      <span class="text-center title-panbe">Drag & drop files here or click to browse</span>
    </button>

    <div class="mt-4 flex flex-row overflow-auto gap-0">
    
      <div v-for="f in uploading" :key="f.variantId" class="group relative rounded overflow-hidden p-1">
        <img
          :src="f.preview"
          aria-hidden="true"
          class="w-max min-w-44 h-32 object-contain rounded-2xl border-2 border-transparent outline outline-2 outline-teal-800/0 shadow"
          :class="[formatSupportsTransparency(f.format) ? 'bg-transparent' : 'bg-black']"
        />

        <img
          :src="f.url"
          class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
          :class="[f.loaded ? 'opacity-100' : 'opacity-0 blur-md']"
          @load="() => (f.loaded = true)"
        />

         
        <div class="absolute m-1 cursor-pointer top-0 rounded-2xl pt-2 bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 space-y-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div><strong>Path:</strong> {{ f.path || '/' }}</div>
          <div><strong>Progress:</strong> {{ Math.round(f.progress) }}%</div>
          <div><strong>Variant:</strong> {{ f.label }}</div>
          <div><strong>File Size:</strong> {{
            f.size < 1024 ? `${f.size} B` :
            f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(1)} KB` :
            f.size < 1024 * 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` :
            `${(f.size / (1024 * 1024 * 1024)).toFixed(1)} GB`
          }}</div>
          <div><strong>Dimensions:</strong> {{ f.width }}×{{ f.height }} ({{ f.aspectRatio.toFixed(2) }})</div>
          <div><strong>Format:</strong> {{ f.format }}</div>
          <div><strong>User:</strong> {{ f.user }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'
import generateLqip from '~/utils/generateLqip'

// Props
const props = defineProps<{ currentPath: string }>()
const { currentPath } = toRefs(props)   // <── keeps it reactive


// PocketBase client
const pb = usePocketBase()

// Variant specifications
interface VariantSpec {
  label: string
  width: number | null
  format: string
  quality: number
}
const VARIANTS: VariantSpec[] = [
  { label: 'thumb', width: 200, format: 'image/jpeg', quality: 0.6 },
  { label: 'medium', width: 800, format: 'image/webp', quality: 0.8 },
  { label: 'full', width: null, format: 'image/png', quality: 1 },
]

// Upload entry model
interface UploadEntry {
  variantId: string
  url: string
  preview: string
  lqip: string
  progress: number
  loaded: boolean
  width: number
  height: number
  aspectRatio: number
  label: string
  format: string
  user: string
  path: string
  size: number
}

// State
const uploading = ref<UploadEntry[]>([])
const input = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['uploaded'])

// Handle a single file
async function handleFile(file: File) {
  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  await new Promise<void>(res => { img.onload = () => res(); img.src = objectUrl })
  const origW = img.width
  const origH = img.height
  URL.revokeObjectURL(objectUrl)

  const lqip = await generateLqip(file)
  const userId = pb.authStore.model?.id || pb.authStore.token || ''

  for (const spec of VARIANTS) {
    const w = spec.width || origW
    const h = Math.round((origH / origW) * w)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)

    const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), spec.format, spec.quality))
    const variantFile = new File([blob], `${spec.label}_${file.name}`, { type: spec.format })
    const variantId = `${file.name}_${spec.label}_${Date.now()}`
    const preview = URL.createObjectURL(variantFile)

    const entry: UploadEntry = { variantId, url: '', lqip, preview, progress: 0, loaded: false,
      width: w, height: h, aspectRatio: w / h, label: spec.label, format: spec.format,
      user: userId, path: currentPath.value, size: variantFile.size }
    uploading.value.push(entry)

    const form = new FormData()
    form.append('file', variantFile)
    form.append('filename', variantFile.name)
    form.append('path', currentPath.value)
    form.append('mime', variantFile.type)
    form.append('size', variantFile.size.toString())
    form.append('lqip', lqip)
    form.append('variant', spec.label)
    form.append('width', w.toString())
    form.append('height', h.toString())
    form.append('aspectRatio', (w / h).toString())
    form.append('format', spec.format)
    form.append('user', userId)

    const rec = await pb.collection('media_files').create(form, {
      onUploadProgress: e => entry.progress = (e.loaded / e.total) * 100
    })

    entry.url = rec.path || rec.url
    entry.progress = 100
    emit('uploaded')
  }
}

function onFiles(files: FileList | null) {
  if (!files) return
  Array.from(files).forEach(handleFile)
}
function onDrop(e: DragEvent) {
  if (e.dataTransfer) onFiles(e.dataTransfer.files)
}
function onInputChange(e: Event) {
  onFiles((e.target as HTMLInputElement).files)
}
function triggerFileDialog() {
  input.value?.click()
}

function formatSupportsTransparency(format: string): boolean {
  const fmt = format.replace('image/', '').trim().toLowerCase().replace(/^\./, '')
  return ['png','webp','gif','tiff','tif','avif','bmp','ico'].includes(fmt)
}
</script>

<style scoped>
.image-pixelated { image-rendering: pixelated; }
</style>
