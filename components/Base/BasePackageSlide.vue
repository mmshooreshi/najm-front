<template>
  <div
    ref="container"
    :class="['package-slide', { expanded } ]"
    @click="onClick"
  >
    <!-- Loop through each product and apply initial and enter motion -->
    <div
      v-for="(p, i) in pkg.products"
      :key="p.id"
      ref="el => itemEls[i] = el"
      class="product-wrapper"
      v-motion
      :initial="floatingStyles(i)"
      :enter="expanded ? gridStyles : floatingStyles(i)"
      :delay="i * 0.1"
      @mouseenter="showTooltip(i)"
      @mouseleave="hideTooltip"
    >
      <img :src="p.image" :alt="p.name" class="floating-item" />
      <!-- Tooltip on hover -->
      <div v-if="tooltipIndex === i" class="tooltip">{{ p.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { Package } from '@/types'



const props = defineProps<{ pkg: Package; expanded: boolean }>()
const emit = defineEmits(['toggleExpand'] as const)

const container = ref<HTMLElement | null>(null)
const itemEls = ref<HTMLElement[]>([])
const tooltipIndex = ref<number | null>(null)

// Store random positions, we will calculate these dynamically
const randomPositions = ref<{ x: number; y: number }[]>([])

// Randomly distribute positions on mount, keeping within the visible viewport
onMounted(() => {
  // Calculate random positions within the viewport size
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  randomPositions.value = props.pkg.products.map(() => ({
    x: Math.random() * (viewportWidth - 200), // 200px width for spacing
    y: Math.random() * (viewportHeight - 200) // 200px height for spacing
  }))
})

// Return initial floating style for each product, smoothly transitioning
function floatingStyles(i: number) {
  const pos = randomPositions.value[i] || { x: 0, y: 0 }
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
}

// For expanded view, when products become aligned horizontally
function gridStyles() {
  return {
    transform: 'translate(0, 0)',
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

// Hover effects: Subtle scaling for interaction
function showTooltip(i: number) { tooltipIndex.value = i }
function hideTooltip() { tooltipIndex.value = null }

// On click, trigger package expand/collapse
function onClick() { emit('toggleExpand') }
</script>

<style scoped>
.package-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}
.package-slide.expanded {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  padding: 1rem;
}
.product-wrapper {
  position: absolute;
  will-change: transform;
}
.package-slide.expanded .product-wrapper {
  position: static;
  margin-right: 1rem;
}
.floating-item {
  display: block;
  max-width: 200px;
  height: auto;
  transition: transform 0.3s ease;
}

.floating-item:hover {
  transform: scale(1.05); /* Slight scaling on hover */
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  pointer-events: none;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tooltip:hover {
  opacity: 1;
}
</style>
