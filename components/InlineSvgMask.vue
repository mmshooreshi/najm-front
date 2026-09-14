<!-- components/InlineSvgMask.vue -->
<template>
  <!-- Container with explicit size matching original layout -->
  <div
    :style="{ position: 'relative', width: W + 'px', height: H + 'px', direction: 'ltr', userSelect: 'none', WebkitUserSelect: 'none' }"
    class="select-none"
    @dragstart.prevent
  >
    <!-- Exact vector silhouette mask with animated Najm green shimmer displayed while image loads -->
    <svg
      :width="W"
      :height="H"
      :viewBox="maskData ? `0 0 ${maskData.w} ${maskData.h}` : `0 0 ${W} ${H}`"
      class="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-0"
      :style="{
        opacity: isLoaded ? 0 : 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: W + 'px',
        height: H + 'px'
      }"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#014439" stop-opacity="0.14">
            <animate attributeName="stop-color" values="#014439;#10b981;#014439" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stop-opacity" values="0.12;0.26;0.12" dur="2.4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stop-color="#10b981" stop-opacity="0.28">
            <animate attributeName="stop-color" values="#10b981;#34d399;#10b981" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stop-opacity" values="0.22;0.38;0.22" dur="2.4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#014439" stop-opacity="0.14">
            <animate attributeName="stop-color" values="#014439;#10b981;#014439" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stop-opacity" values="0.12;0.26;0.12" dur="2.4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      <!-- Exact vector silhouette path if precomputed -->
      <path
        v-if="maskData?.d"
        :d="maskData.d"
        :fill="`url(#${gradientId})`"
        stroke="#10b981"
        stroke-opacity="0.22"
        stroke-width="1"
        class="silhouette-shimmer"
      />
      <!-- Fallback rounded rectangle if image has no vector silhouette -->
      <rect
        v-else
        x="0"
        y="0"
        :width="W"
        :height="H"
        rx="16"
        ry="16"
        :fill="`url(#${gradientId})`"
        stroke="#10b981"
        stroke-opacity="0.22"
        stroke-width="1"
        stroke-dasharray="4 4"
      />
    </svg>

    <!-- Inline image with exact styling and lazy/priority loading -->
    <NuxtImg
      ref="imgEl"
      :src="src"
      :width="W"
      :height="H"
      format="webp"
      quality="85"
      :alt="alt || 'چاپ و بسته‌بندی نجم'"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :preload="priority"
      decoding="async"
      draggable="false"
      class="relative z-10 w-full h-full object-contain pointer-events-auto select-none"
      :style="{
        position: 'relative',
        top: 0,
        left: 0,
        right: 'auto',
        userSelect: 'none',
        WebkitUserDrag: 'none',
        WebkitUserSelect: 'none'
      }"
      @load="onLoad"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @dragstart.prevent
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import imageMasksData from '~/utils/imageMasks.json'

const imageMasks = imageMasksData as Record<string, { w: number; h: number; d: string }>

const props = withDefaults(
  defineProps<{
    src: string
    width: number
    height: number
    priority?: boolean
    alt?: string
  }>(),
  {
    priority: false,
    alt: 'چاپ و بسته‌بندی نجم'
  }
)

const emit = defineEmits<{
  (e: 'hover', payload: { src: string; state: string }): void
  (e: 'leave', src: string): void
}>()

const W = ref(props.width)
const H = ref(props.height)
const imgEl = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)

// Unique gradient ID per component instance
const gradientId = `mask-shimmer-${Math.random().toString(36).slice(2, 9)}`

// Resolve vector mask data if available for this image
const maskData = computed(() => {
  if (!props.src) return null
  const cleanKey = props.src.replace(/^\/?(?:images\/)?/, '')
  return imageMasks[cleanKey] || null
})

function onLoad() {
  isLoaded.value = true
}

function getTargetEl(): HTMLElement | null {
  if (!imgEl.value) return null
  return (imgEl.value as any)?.$el || (imgEl.value as any)
}

onMounted(() => {
  const el = getTargetEl()
  if ((el as any)?.complete) {
    isLoaded.value = true
  }
})

function onMouseEnter() {
  const el = getTargetEl()
  if (el?.classList) {
    el.classList.add('png-hovered')
  }
  emit('hover', { src: props.src, state: 'top' })
}

function onMouseLeave() {
  const el = getTargetEl()
  if (el?.classList) {
    el.classList.remove('png-hovered')
  }
  emit('leave', props.src)
}
</script>

<style scoped>
.png-hovered {
  will-change: transform;
}

@keyframes maskPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(0.985);
  }
  50% {
    opacity: 1;
    transform: scale(1.015);
  }
}

.silhouette-shimmer {
  animation: maskPulse 2.4s ease-in-out infinite;
  transform-origin: center center;
  will-change: transform, opacity;
}
</style>

