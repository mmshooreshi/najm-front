<template>
  <div class="absolute top-0 left-0 z-10 m-4 w-max rounded-xl bg-black/70 text-green-200 text-xs p-3 select-none" role="status" aria-label="Debug statistics and controls">
    <!-- Stats -->
    <div class="mb-1">▶️ FPS: {{ fps }} | Mode: {{ mode }} | Frames: {{ frameCount }}</div>
    <div class="mb-1">🧠 Index: {{ activeIndex }} / {{ frameCount - 1 }}</div>
    <div class="mb-1 truncate max-w-[220px]">📦 File: {{ currentFile || '—' }}</div>
    <div class="mb-2">⏱ Avg Δt: {{ avgDt }} ms | Render #: {{ renderCount }}</div>

    <!-- Ramp graph -->
    <svg :width="svgW" :height="svgH" class="block select-none">
      <!-- Linear baseline -->
      <polyline :points="baselinePts" stroke="#555" stroke-width="1" fill="none" />
      <!-- Ramp curve -->
      <polyline :points="rampPts" stroke="lime" stroke-width="1.5" fill="none" />
      <!-- Moving playhead -->
      <line :x1="progressX" :x2="progressX" y1="0" :y2="svgH" stroke="red" stroke-width="2" />
    </svg>

    <!-- Collapsible controls -->
    <details open>
      <summary class="cursor-pointer text-blue-300 focus:outline-none">🔧 Visual Controls</summary>
      <div class="grid grid-cols-2 gap-3 pt-2">
        <!-- Preset selector -->
        <div class="col-span-2 sm:col-span-1">
          <label class="block mb-1 text-green-300">🎨 Filter Preset</label>
          <select
            class="w-full rounded border border-green-500 bg-gray-900 text-green-100 p-1 text-xs focus:outline-none focus:ring focus:ring-green-400"
            :value="modelFilterStyle"
            @change="$emit('update:filterStyle', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="preset in presets" :key="preset" :value="preset">{{ preset }}</option>
          </select>
        </div>

        <!-- Toggles -->
        <div class="flex flex-col space-y-1 col-span-2 sm:col-span-1">
          <label class="inline-flex items-center">
            <input type="checkbox" class="mr-2" :checked="modelDebugFilters" @change="$emit('update:debugFilters', ($event.target as HTMLInputElement).checked)" />
            Filters
          </label>
          <label class="inline-flex items-center">
            <input type="checkbox" class="mr-2" :checked="modelDebugOverlay" @change="$emit('update:debugOverlay', ($event.target as HTMLInputElement).checked)" />
            Overlay Grid
          </label>
          <label class="inline-flex items-center">
            <input type="checkbox" class="mr-2" :checked="modelDebugRadial" @change="$emit('update:debugRadial', ($event.target as HTMLInputElement).checked)" />
            Radial Light
          </label>
          <label class="inline-flex items-center">
            <input type="checkbox" class="mr-2" :checked="modelDebugNoise" @change="$emit('update:debugNoise', ($event.target as HTMLInputElement).checked)" />
            Noise Texture
          </label>
        </div>
      </div>
    </details>
  </div>
</template>

<script lang="ts" setup>
/***********************************
 * DebugPanel – now with real‑time ramp graph
 ***********************************/
import { computed } from 'vue'

interface PanelProps {
  fps: number
  mode: 'pingpong' | 'loop'
  renderCount: number
  activeIndex: number
  frameCount: number
  currentFile?: string
  avgDt?: string | number
  // v-model props
  filterStyle: string
  debugFilters: boolean
  debugOverlay: boolean
  debugRadial: boolean
  debugNoise: boolean
  // optional
  ramp?: number // 0‑1 strength
}

const props = withDefaults(defineProps<PanelProps>(), { ramp: 0.4 })

/* ---------- v‑model proxies ---------- */
const modelFilterStyle   = computed(() => props.filterStyle)
const modelDebugFilters  = computed(() => props.debugFilters)
const modelDebugOverlay  = computed(() => props.debugOverlay)
const modelDebugRadial   = computed(() => props.debugRadial)
const modelDebugNoise    = computed(() => props.debugNoise)

/* ---------- Graph constants ---------- */
const svgW = 160
const svgH = 50
const samples = 60

/* ---------- Pre‑compute ramp + baseline curves ---------- */
const rampPts = computed(() => {
  const pts: string[] = []
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * svgW
    const phase = (i / samples) * Math.PI * 2
    const f = 1 - props.ramp + props.ramp * (0.5 + 0.5 * Math.sin(phase))
    const y = svgH - f * svgH
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
})

const baselinePts = computed(() => `0,${svgH / 2} ${svgW},${svgH / 2}`)

/* ---------- Moving playhead ---------- */
const progressX = computed(() => {
  if (props.frameCount === 0) return 0
  const ratio = props.activeIndex / props.frameCount
  return Math.round(ratio * svgW)
})

/* ---------- Filter presets ---------- */
const presets = [
  'none',
  'contrast(1.1) saturate(1.05)',
  'grayscale(0.3) sepia(0.2)',
  'brightness(1.2) contrast(1.2)',
  'invert(1)',
  'blur(2px)',
  'hue-rotate(30deg) saturate(2)'
]
</script>

<style scoped>
svg {
  overflow: visible;
}
</style>
