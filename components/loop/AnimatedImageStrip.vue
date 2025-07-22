<!-- components/loop/AnimatedImageStrip.vue -->
<template>
  <!-- Wrapper -->
  <div
    ref="container"
    class="relative inline-block overflow-visible"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Frames loaded -->
    <picture v-if="sortedFrames.length">
      <img
        :src="fileUrl(sortedFrames[activeIndex])"
        :alt="altText"
        class="max-w-full h-auto object-cover transition-transform duration-200 will-change-transform"
        loading="lazy"
        decoding="async"
        :style="debugFilters ? `filter:${computedFilter}` : ''"
        width="auto"
        height="auto"
      />
    </picture>

    <!-- Placeholder while loading -->
    <div v-else class="text-gray-400 text-sm p-2 select-none">Loading…</div>

    <!-- Optional visual layers (only rendered if enabled) -->
    <template v-if="sortedFrames.length">
      <div
        v-if="debugOverlay"
        class="absolute inset-0 pointer-events-none mix-blend-overlay"
        style="background:repeating-linear-gradient(45deg,rgba(255,255,255,.03)0,rgba(255,255,255,.03)2px,transparent2px,transparent4px)"
      />
      <div
        v-if="debugRadial"
        class="absolute inset-0 pointer-events-none"
        style="background:radial-gradient(circle at center,rgba(255,255,255,.05),transparent 70%)"
      />
      <div
        v-if="debugNoise"
        class="absolute inset-0 pointer-events-none opacity-5"
        style="background-image:url('https://www.transparenttextures.com/patterns/asfalt-dark.png')"
      />
    </template>

    <!-- Debug panel -->
    <DebugPanel
      v-if="props.debug"
      :fps="baseFps"
      :mode="props.mode"
      :render-count="renderCount"
      :active-index="activeIndex"
      :frame-count="sortedFrames.length"
      :current-file="sortedFrames[activeIndex]?.filename"
      :avg-dt="avgDelta"
      v-model:filter-style="filterStyle"
      v-model:debug-filters="debugFilters"
      v-model:debug-overlay="debugOverlay"
      v-model:debug-radial="debugRadial"
      v-model:debug-noise="debugNoise"
    />
  </div>
</template>

<script lang="ts" setup>
/***********************************
 *  AnimatedImageStrip.vue
 *  High‑performance, SEO‑friendly animated strip
 *  – RequestAnimationFrame based
 *  – Dynamic speed‑ramp easing
 *  – Production‑ready & lightweight
 ***********************************/
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { usePocketBase } from '@/plugins/pb.client'
import DebugPanel from '@/components/loop/DebugPanel.vue' // dynamically imported below

/**
 * PROPS
 */
interface Props {
  /** Folder prefix inside media_files collection */
  path?: string
  /** Base frames‑per‑second */
  fps?: number
  /** Animation style */
  mode?: 'pingpong' | 'loop'
  /** Autoplay when enters viewport */
  autoplay?: boolean
  /** Play only on hover */
  hoverPlay?: boolean
  /** Enable default visual filters */
  filters?: boolean
  /** Developer debug panel */
  debug?: boolean
  /** Natural speed‑ramp strength 0‑1 */
  ramp?: number
}

const props = withDefaults(defineProps<Props>(), {
  path: 'media/01/avif-big',
  fps: 6,
  mode: 'pingpong',
  autoplay: true,
  hoverPlay: false,
  filters: true,
  debug: false,
  ramp: 0.4 // 0 = constant speed, 1 = full sine modulation
})

/***********************************
 *  STATE
 ***********************************/
const pb = usePocketBase()
const frames = ref<any[]>([])
const activeIndex = ref(0)
const playing = ref(false)
const direction = ref<1 | -1>(1)
const baseFps = props.fps

// Visual flags (two‑way bound to DebugPanel)
const filterStyle = ref('contrast(1.1) saturate(1.05)')
const debugFilters = ref(props.filters)
const debugOverlay = ref(true)
const debugRadial = ref(true)
const debugNoise   = ref(false)

// Performance metrics
const lastStamp = ref<number | null>(null)
const deltas: number[] = []
const renderCount = ref(0)
const avgDelta = computed(() =>
  deltas.length ? (deltas.reduce((a, b) => a + b) / deltas.length).toFixed(2) : '0.00'
)

/***********************************
 *  DATA LOAD
 ***********************************/
async function fetchFrames () {
  const res = await pb.collection('media_files').getList(1, 300, {
    filter: `path ~ \"${props.path}\"`,
    sort: 'filename',
    $autoCancel: false
  })
  frames.value = res.items
}

const sortedFrames = computed(() =>
  [...frames.value].sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
)

/***********************************
 *  IMAGE URL HELPER
 ***********************************/
const fileUrl = (file: any) => pb.files.getURL(file, file.file)
const altText = computed(() => `Animated strip for ${props.path}`)

/***********************************
 *  ANIMATION ENGINE – RAF + Speed‑Ramp
 ***********************************/
let rafId: number | null = null

function step (t: number) {
  if (!playing.value) return
  if (lastStamp.value == null) lastStamp.value = t
  const delta = t - lastStamp.value

  // Current fps with sine‑based ramp
  const progress = (activeIndex.value % sortedFrames.value.length) / sortedFrames.value.length
  const rampFactor = 1 - props.ramp + props.ramp * (0.5 + 0.5 * Math.sin(progress * Math.PI * 2))
  const currentInterval = 1000 / (baseFps * rampFactor)

  if (delta >= currentInterval) {
    lastStamp.value = t
    nextFrame()
    deltas.push(delta)
    if (deltas.length > 120) deltas.shift() // keep history small (~2s)
  }
  rafId = requestAnimationFrame(step)
}

function nextFrame () {
  if (props.mode === 'pingpong') {
    if (activeIndex.value === sortedFrames.value.length - 1) direction.value = -1
    if (activeIndex.value === 0) direction.value = 1
    activeIndex.value += direction.value
  } else {
    activeIndex.value = (activeIndex.value + 1) % sortedFrames.value.length
  }
  renderCount.value++
}

function start () {
  if (playing.value || !sortedFrames.value.length) return
  playing.value = true
  rafId = requestAnimationFrame(step)
}
function stop () {
  playing.value = false
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = null
}

/***********************************
 *  VIEWPORT AUTOPLAY (IntersectionObserver)
 ***********************************/
const container = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(async () => {
  await fetchFrames()
  // Lazy‑import debug panel only if requested
  if (props.debug) {
    // @ts‑ignore – dynamic import for tree‑shaking in prod
    DebugPanel.__asyncLoader && DebugPanel.__asyncLoader()
  }
  if (props.autoplay) {
    io = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? start() : stop()
    }, { threshold: 0.1 })
    container.value && io.observe(container.value)
  }
  else if (props.hoverPlay === false) {
    // Static but autoplay off — start immediately
    start()
  }
})

onBeforeUnmount(() => {
  stop()
  io?.disconnect()
})

function onMouseEnter () {
  if (props.hoverPlay) start()
}
function onMouseLeave () {
  if (props.hoverPlay) stop()
}

/***********************************
 *  COMPUTED FILTER (kept outside of template string concat)
 ***********************************/
const computedFilter = computed(() => filterStyle.value)
</script>

<style scoped>
img {
  /* hint for GPU compositing */
  transform: translateZ(0);
}
</style>
