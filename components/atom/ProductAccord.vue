<template>
    <div class="relative ">
      <!-- Floating label -->
  
      <div
        class="group transition-  transition-border duration-1000  border-2 rounded-xl overflow-hidden"
        :class="{'!border-[#014439]': activeFiltersCount > 0}">
        <!-- Header -->
        <button
          class="w-full flex  transition-colors justify-between items-center bg-transparent py-3 px-6 text-sm"
          @click="toggleOpen"
        >
        
        <div
        class="absolute right-4 bg-transparent transition-all ease-in-out  text-md pointer-events-none"
      >
        {{ computedLabel }}
      </div>

          <span class="text-demibold text-d4 flex flex-row w-full items-end  px-4 justify-between gap-2 items-center">
            <div class=" flex-grow"></div>
            <span v-if="selectedValue">
            {{ selectedValue  }}
        </span>
        <span v-else-if="openValue" class="text-gray-600/50 scale-90 group-hover:scale-100 transition-all group-hover:text-gray-600/80">
            {{computedPlaceholder}}
    </span>
            <div
              v-if="activeFiltersCount > 0"
              class="text-xs text-white/100 font-semibold border border-[#014439] rounded-lg p-2 pt-0.5 pr-1.2 h-5 w-5"
              :class="{'!w-6': activeFiltersCount > 9}"
            >
              {{ toPersianDigits(activeFiltersCount) }}
            </div>
          </span>
          <Icon
            name="mdi:chevron-down"
            ref="arrowRef"
            :style="arrowStyles"
            class="w-5 h-5 text-gray-600/50 group-hover:text-gray-600"
          />
        </button>
  
        <!-- Animated Content -->
        <div
          ref="containerRef"
          class="overflow-hidden transition-colors"
          :style="containerStyles"
        >
          <div ref="contentRef" class="pb-4">
            <div v-for="group in groups" :key="group.name" class="mb-4 px-6 pt-2">
              <!-- Group Name -->
              <h3
                class="text-sm font-semibold mb-2 cursor-pointer"
                @click="toggleOpen"
              >
                <!-- {{ group.name }} -->
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="item in group.items"
                  :key="item.label"
                  class="flex items-center justify-between cursor-pointer text/50 text-xs rounded-lg p-2"
                  :class="{'bg-teal-700/20': selectedValue === item.label}"
                  @click.stop="selectItem(item)"
                >
                  <span>{{ item.label }}</span>
                  <span v-if="item.count" class="text-xs text-gray-500">
                    ({{ item.count }})
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, ref, watch, nextTick, computed } from 'vue'
  import { useMotionProperties, useSpring } from '@vueuse/motion'
  import { useMediaQuery } from '@vueuse/core'
  import { toPersianDigits } from '~/utils/digits'
  
  type OptionItem = { label: string; value: any; count?: number }
  type OptionGroup = { name: string; type: string; items: OptionItem[] }
  
  const props = defineProps<{
    title: string
    groups: OptionGroup[]
    open?: boolean
    selected?: string
    activeFiltersCount?: number
  }>()
  const emit = defineEmits<{
    (e: 'update:selected', value: string): void
  }>()
  
  const openValue = ref(props.open ?? false)
  const selectedValue = ref(props.selected || '')
  
  watch(() => props.open, val => { if (val !== undefined) openValue.value = val })
  watch(() => props.selected, val => { if (val !== undefined) selectedValue.value = val })
  
  function toggleOpen() {
    openValue.value = !openValue.value
  }
  function selectItem(item: OptionItem) {
    if(selectedValue.value==item.label){
        selectedValue.value = ""

    } else {

        selectedValue.value = item.label
    }
    emit('update:selected', item.label)
    openValue.value = false
  }
  
  // Placeholder for button when no selection and closed
  const computedPlaceholder = computed(() => 'انتخاب کنید')
  // Label text: title always, animates small above
  const computedLabel = computed(() => props.title)
  
  // Floating label motion
  const labelRef = ref<HTMLElement | null>(null)
  const { motionProperties: labelStyles } = useMotionProperties(labelRef, {
    y: 0,
    scale: 1,
    opacity: 1
  })
  const springConfig = useMediaQuery('(prefers-reduced-motion)').value
    ? { duration: 0 }
    : { stiffness: 200, damping: 30, overshootClamping: true }
  const { set: animateLabel } = useSpring(labelStyles, springConfig)
  
  const isFloating = computed(() => openValue.value || !!selectedValue.value)
  watch(isFloating, floating => {
    animateLabel({ y: floating ? -16 : 0, scale: floating ? 0.75 : 1, opacity: floating ? 1 : 1 })
  }, { immediate: true })
  
  // Container & arrow motion (unchanged)
  const containerRef = ref<HTMLElement | null>(null)
  const contentRef = ref<HTMLElement | null>(null)
  const arrowRef = ref<SVGSVGElement | null>(null)
  const { motionProperties: containerStyles } = useMotionProperties(containerRef, {
    height: 0, opacity: 0, translateY: -10
  })
  const { motionProperties: arrowStyles } = useMotionProperties(arrowRef, {
    rotate: 0, scale: 1
  })
  const { set: animateContainer, stop: stopContainer } = useSpring(containerStyles, springConfig)
  const { set: animateArrow, stop: stopArrow } = useSpring(arrowStyles, springConfig)
  
  watch(openValue, async () => {
    await nextTick()
    stopContainer(); stopArrow()
    if (openValue.value && contentRef.value) {
      const fullHeight = contentRef.value.scrollHeight
      animateContainer({ height: fullHeight, opacity: 1, translateY: 0 })
      animateArrow({ rotate: 180, scale: 1.1 })
    } else {
      animateContainer({ height: 0, opacity: 0, translateY: -10 })
      animateArrow({ rotate: 0, scale: 1 })
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  /* Motion & utility classes handle everything */
  </style>