<template>
    <div class="group transition-colors transition-border duration-1000  bg-[#F1F5F9] hover:border-[#F1F5F9] border-1 border-transparent rounded-xl overflow-hidden" :class="{'!border-[#014439]': activeFiltersCount>0}">
      <!-- Header -->
      <button
        class="w-full flex bg-transparent transition-colors justify-between items-center py-3 px-6 text-sm "
        :class="{'!bg-white':openValue}"
        @click="toggleOpen"
      >
        
        <span class="text-demibold text-d4 flex flex-row gap-2">{{ title }}
            <div v-show="activeFiltersCount>0"
  class="text-xs text-white font-semibold bg-[#014439] border border-[#014439] rounded-lg p-2 pt-0.5 pr-1.2 h-5 w-5"
  :class="{ '!w-6': activeFiltersCount > 9 }"
>
  {{ toPersianDigits(activeFiltersCount) }}
</div>
        </span>
        <Icon
          :name="openValue ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          ref="arrowRef"
          :style="arrowStyles"
          class="w-5 h-5 text-gray-600/50 group-hover:text-gray-600 "
        />
      </button>
  


      <div
  ref="containerRef"
  class="overflow-hidden transition-colors"
  :class="{'!bg-white': openValue}"
  :style="containerStyles"
>
  <div ref="contentRef" class="overflow-auto p-2">
          <div v-if="tabs && panes?.length">
            <nav class="flex w-max mx-auto items-center justify-between p-1 mb-5 rounded-full border border-gray-300 text-xs">
              <button
                v-for="(pane, idx) in panes"
                :key="pane.slug || idx"
                @click="activeTab = idx"
                class="px-8 py-2 rounded-2xl font-medium text-center bg-transparent transition-all duration-200" 
                :class="[
                  activeTab === idx ? '!bg-[#014439] text-white' : 'text-gray-700'
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
  import { toPersianDigits } from '~/utils/digits'
  const props = defineProps<{
    title: string
    tabs?: boolean
    open?: boolean
    activeFiltersCount?: number
    panes?: Array<{ name: string; slug: string }>
  }>()
  
  // state & refs
  const openValue   = ref(props.open ?? false)
  const activeTab   = ref(0)
  const containerRef = ref<HTMLElement|null>(null)
  const contentRef   = ref<HTMLElement|null>(null)    // <— measure this!
  const arrowRef     = ref<SVGSVGElement|null>(null)
  
  // motion props
  const { motionProperties: containerStyles } = useMotionProperties(containerRef, {
    height: 0, opacity: 0, translateY: -10,
  })
  const { motionProperties: arrowStyles } = useMotionProperties(arrowRef, {
    rotate: 180, scale: 1,
  })
  
  const springConfig = useMediaQuery('(prefers-reduced-motion)')
    .value
    ? { duration: 0 }
    : { stiffness: 200, damping: 30, overshootClamping: true }
  
  const { set: animateContainer, stop: stopContainer } = useSpring(containerStyles, springConfig)
  const { set: animateArrow,     stop: stopArrow     } = useSpring(arrowStyles,     springConfig)
  
  // toggle open
  function toggleOpen() {
    openValue.value = !openValue.value
  }
  
  // unified watcher
  watch(
    [openValue, activeTab],
    async () => {
      await nextTick()
  
      stopContainer()
      stopArrow()
  
      if (openValue.value && contentRef.value) {
        const fullHeight = contentRef.value.scrollHeight
        animateContainer({ height: fullHeight, opacity: 1, translateY: 0 })
        animateArrow({ rotate: 180, scale: 1.1 })
      }
      else {
        animateContainer({ height: 0, opacity: 0, translateY: -10 })
        animateArrow({ rotate: 0, scale: 1 })
      }
    },
    { immediate: true }
  )
  
  // keep prop sync’d
  watch(() => props.open, v => v !== undefined && (openValue.value = v))
  </script>
    
  <style scoped>
  /* Overflow handled via motion inline styles */
  </style>
  