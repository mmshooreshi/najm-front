<!-- components/InlineSvgMask.vue -->
<template>
  <!-- Container with explicit size matching original layout -->
  <div :style="{ position: 'relative', width: W + 'px', height: H + 'px', direction: 'ltr' }">
    <!-- Lightweight SVG silhouette mask with Najm green tint displayed while image loads -->
    <svg
      :width="W"
      :height="H"
      class="absolute inset-0 pointer-events-none transition-opacity duration-300"
      :style="{
        opacity: isLoaded ? 0 : 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: W + 'px',
        height: H + 'px'
      }"
    >
      <rect
        x="0"
        y="0"
        :width="W"
        :height="H"
        rx="16"
        ry="16"
        fill="#014439"
        fill-opacity="0.07"
        stroke="#014439"
        stroke-opacity="0.12"
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
      alt="Packaging Visual"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'low'"
      :preload="priority"
      decoding="async"
      :style="{
        position: 'relative',
        top: 0,
        left: 0,
        right: 'auto',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'auto'
      }"
      @load="onLoad"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    width: number
    height: number
    priority?: boolean
  }>(),
  {
    priority: false
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
</style>

