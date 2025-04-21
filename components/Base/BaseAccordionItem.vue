<template>
  <div class="border rounded-lg overflow-hidden">
    <!-- Header with rotating arrow -->
    <div
      @click="toggle"
      class="flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2 select-none"
    >
      <span class="font-semibold">{{ title }}</span>
      <svg
        ref="arrowRef"
        class="w-4 h-4 transform transition-transform"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>

    <!-- Animated container -->
    <div ref="containerRef" :style="containerStyles">
      <div ref="contentRef" class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useMotionProperties, useSpring } from '@vueuse/motion'

// props & emit
const props = defineProps({
  expanded: Boolean,
  title:   String,
})
const emit = defineEmits(['toggle'])

// refs
const contentRef   = ref(null)
const containerRef = ref(null)
const arrowRef     = ref(null)

// detect reduced‑motion
const prefersReduced = useMediaQuery('(prefers-reduced-motion)')

// base motion properties: height, opacity, y-offset
const { motionProperties: containerStyles } = useMotionProperties(containerRef, {
  height:   0,
  opacity:  0,
  translateY: -10,
})

// arrow rotation
const { motionProperties: arrowStyles } = useMotionProperties(arrowRef, {
  rotate: 0,
})

// use a physics spring (stiffness/damping)
const springConfig = prefersReduced.value
  ? { duration: 0 } // no animation
  : { stiffness: 300, damping: 30, mass: 0.8, restDelta: 0.5, overshootClamping: true }

  const springConfig2 = prefersReduced.value
  ? { duration: 0 } // no animation
  : { duration: 0.5 }

const { set: animateContainer, stop: stopContainer } =
  useSpring(containerStyles, springConfig)

const { set: animateArrow, stop: stopArrow } =
  useSpring(arrowStyles, springConfig2)

// measure & animate
async function update() {
  await nextTick()
  const el = contentRef.value
  // stop any running animations
  stopContainer(); stopArrow()

  if (props.expanded && el) {
    const fullH = el.scrollHeight
    // expand: height → scrollHeight, fade in, slide up into place
    animateContainer({ height: fullH, opacity: 1, translateY: 0 })
    // rotate arrow downwards
    animateArrow({ rotate: 180 })
  }
  else {
    // collapse: height → 0, fade out, slide up
    animateContainer({ height: 0, opacity: 0, translateY: -10 })
    // reset arrow
    animateArrow({ rotate: 0 })
  }
}

// watch & init
watch(() => props.expanded, update)
onMounted(update)

// emit toggle
function toggle() {
  emit('toggle')
}
</script>

<style scoped>
/* ensure overflow hidden on container */
div[ref="containerRef"] {
  overflow: hidden;
}
</style>
