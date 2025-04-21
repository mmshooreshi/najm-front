<template>
    <div class="border rounded-xl overflow-hidden">
      <!-- Header -->
      <button
        class="w-full flex transition-colors justify-between items-center py-3 px-6 text-sm bg-[#F1F5F9] hover:bg-gray-200/50"
        :class="{'!bg-gray-200':openValue}"
        @click="toggleOpen"
      >
        <span class="text-demibold text-d4">{{ title }}</span>
        <Icon
          :name="openValue ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          ref="arrowRef"
          :style="arrowStyles"
          class="w-5 h-5 text-gray-600"
        />
      </button>
  
      <!-- Animated content container -->
      <div
        ref="containerRef"
        class="overflow-hidden transition-colors bg-gray-200/50"
        :class="{'!bg-gray-200':openValue}"
        :style="containerStyles"
      >
        <div class="p-4">
          <div v-if="tabs && panes?.length">
            <nav class="flex space-x-4 border-b mb-4">
              <button
                v-for="(pane, idx) in panes"
                :key="pane.slug || idx"
                @click="activeTab = idx"
                :class="[
                  'py-2 px-4 -mb-px',
                  activeTab === idx ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'
                ]"
              >
                {{ pane.name }}
              </button>
            </nav>
            <slot name="pane" :pane="panes[activeTab]" />
          </div>
          <div v-else>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, nextTick, onMounted } from 'vue'
  import { useMediaQuery } from '@vueuse/core'
  import { useMotionProperties, useSpring } from '@vueuse/motion'
  
  // Props
  const props = defineProps<{
    title: string
    tabs?: boolean
    open?: boolean
    panes?: Array<{ name: string; slug: string; children?: any[] }>
  }>()
  
  // Local open state
  const openValue = ref(props.open ?? false)
  const activeTab = ref(0)
  
  // Refs to DOM elements
  const containerRef = ref<HTMLElement | null>(null)
  const arrowRef = ref<SVGSVGElement | null>(null)
  
  // Respect user motion preference
  const prefersReduced = useMediaQuery('(prefers-reduced-motion)')
  
  // Motion properties for container (height, opacity, translateY)
  const { motionProperties: containerStyles } = useMotionProperties(containerRef, {
    height: 0,
    opacity: 0,
    translateY: -10,
  })
  
  // Motion properties for arrow rotation
  const { motionProperties: arrowStyles } = useMotionProperties(arrowRef, {
    rotate: 0,
  })
  
  // Spring config
  const springConfig = prefersReduced.value
    ? { duration: 0 }
    : { stiffness: 200, damping:30  }

    // : { stiffness: 100, damping: 40, mass: 0.8, restDelta: 0.5, overshootClamping: true }
  
  // Springs
  const { set: animateContainer, stop: stopContainer } = useSpring(containerStyles, springConfig)
  const { set: animateArrow, stop: stopArrow } = useSpring(arrowStyles, springConfig)
  
  // Toggle function
  function toggleOpen() {
    openValue.value = !openValue.value
  }
  
  // Update animation on open change
  async function updateAnimation() {
    await nextTick()
    const el = containerRef.value
    stopContainer(); stopArrow()
  
    if (openValue.value && el) {
      const fullHeight = el.scrollHeight
      animateContainer({ height: fullHeight+10, opacity: 1, translateY: 0 })
      animateArrow({ rotate: 180 })
    } else {
      animateContainer({ height: 0, opacity: 1, translateY: 0 })
      animateArrow({ rotate: 0 })
    }
  }
  
  watch(openValue, updateAnimation)
  onMounted(updateAnimation)
  
  // Reflect external open prop
  watch(() => props.open, val => {
    if (val !== undefined) openValue.value = val
  })
  </script>
  
  <style scoped>
  /* Overflow handled via motion inline styles */
  </style>
  