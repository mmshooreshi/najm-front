<template>
  <div class="avif-video-creator">
    <h2>AVIF Video Creator</h2>
    <input type="file" accept="image/avif" multiple @change="onFilesSelected" />

    <div v-if="frames.length" class="preview-playground">
      <label>
        Preview Frame:
        <input
          type="range"
          v-model.number="currentFrame"
          :min="0"
          :max="frames.length - 1"
        />
        {{ currentFrame + 1 }} / {{ frames.length }}
      </label>
      <canvas
        ref="previewCanvas"
        :width="width"
        :height="height"
      />
    </div>

    <div v-if="frames.length" class="settings">
      <h3>Export Settings</h3>
      <label>
        Frame Rate:
        <input type="number" v-model.number="settings.fps" min="1" max="60" /> fps
      </label>
      <label>
        Bitrate:
        <input type="text" v-model="settings.bitrate" placeholder="e.g., 1000k" />
      </label>
      <label>
        Loop Video:
        <input type="checkbox" v-model="settings.loop" />
      </label>
      <button @click="exportVideo" :disabled="isExporting">
        {{ isExporting ? 'Exporting...' : 'Export AVIF Video' }}
      </button>
    </div>

    <div v-if="videoUrl" class="playback">
      <h3>Exported Video</h3>
      <video :src="videoUrl" controls :loop="settings.loop" width="400" />
      <a :href="videoUrl" download="output.ivf">Download AV1 IVF Video</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// FFmpeg dynamic import
let ffmpeg: any
let fetchFile: any

async function ensureFFmpeg() {
  if (!ffmpeg) {
    const module = await import('@ffmpeg/ffmpeg')
    const { createFFmpeg, fetchFile: ffFetch } = (module as any)
    ffmpeg = createFFmpeg({ log: true })
    fetchFile = ffFetch
    await ffmpeg.load()
  }
  return ffmpeg
}

const width = 640
const height = 480
const files = ref<File[]>([])
const frames = ref<HTMLImageElement[]>([])
const currentFrame = ref(0)
const settings = ref({ fps: 24, bitrate: '1000k', loop: false })
const isExporting = ref(false)
const videoUrl = ref<string | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

onMounted(() => {
  ctx.value = previewCanvas.value?.getContext('2d') || null
})

function onFilesSelected(event: Event) {
  files.value = Array.from((event.target as HTMLInputElement).files || [])
  loadFrames()
}

async function loadFrames() {
  frames.value = []
  for (const file of files.value) {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    await img.decode()
    frames.value.push(img)
  }
  currentFrame.value = 0
  drawPreview()
}

watch(currentFrame, () => drawPreview())

function drawPreview() {
  if (!ctx.value) return
  ctx.value.clearRect(0, 0, width, height)
  ctx.value.drawImage(frames.value[currentFrame.value], 0, 0, width, height)
}

async function exportVideo() {
  isExporting.value = true
  const ff = await ensureFFmpeg()

  // write frames
  for (let i = 0; i < frames.value.length; i++) {
    const img = frames.value[i]
    const canvasEl = document.createElement('canvas')
    canvasEl.width = width
    canvasEl.height = height
    const c = canvasEl.getContext('2d')!
    c.drawImage(img, 0, 0, width, height)

    const blob: Blob = await new Promise(r =>
      canvasEl.toBlob(b => r(b! as Blob), 'image/png')
    )
    const data = await fetchFile(blob)
    ff.FS('writeFile', `frame${String(i).padStart(3, '0')}.png`, data)
  }

  const args = [
    ...frames.value.map((_, i) => ['-i', `frame${String(i).padStart(3,'0')}.png`]).flat(),
    '-filter_complex', `fps=${settings.value.fps},scale=${width}:${height}`,
    '-c:v', 'libaom-av1',
    '-b:v', settings.value.bitrate,
    '-row-mt', '1',
    'out.ivf'
  ]

  await ff.run(...args)
  const output = ff.FS('readFile', 'out.ivf')
  const blob = new Blob([output.buffer], { type: 'video/ivf' })
  videoUrl.value = URL.createObjectURL(blob)
  isExporting.value = false
}
</script>

<style scoped>
.avif-video-creator {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.preview-playground,
.settings,
.playback {
  margin-top: 1.5rem;
}
.settings label,
.preview-playground label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
