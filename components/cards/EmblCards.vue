<!-- components/cards/EmblCards.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" ref="emblContainer" class="relative overflow-x-visible    absolute py-6">
    <div class="overflow-visible w-full" ref="viewportRef">
      <div class="flex">
        <!-- v-gsap.whileHover.delay-500.to="{ rotate: '-2deg', y: -12 }" -->
         <!-- :style="{ zIndex: i, backgroundColor: card.bgColor }" -->
        <div v-for="(card, idx) in cards" :key="card.id" :data-id="card.id" :class="[isRTL ? 'rtl' : 'ltr']"           

          class="embla-slide shrink-0 grow-0 basis-[80%] md:basis-[70%] mx-2 h-[300px] md:h-[400px] max-h-[400px] max-w-[500px] bg-najmgrey relative rounded-[1.5rem] overflow-visible sm:max-w-[400px] sm:h-[400px] sm:min-h-[400px] sm:min-w-[300px] max-w-[80vw] h-[55vw] min-h-[260px] min-w-[220px]">
          <!-- class="h-[300px] md:h-[400px] bg-najmgrey embl-card  relative flex-none w-4/5 mr-2.5 max-h-[300px] md:max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible"> -->


          <!-- {{ props.stackIds }} -->
          <!-- border-black border -->

          <img v-gsap.magnetic :src="card.loop" :alt="card.text" :duration="100"
            class="object-contain h-full w-[80%] mx-auto rounded-[1.5rem] -mt-8" />

          <div v-gsap.magnetic :class="[isRTL ? 'right-6' : 'left-6']" :duration="100"
            class="projects-intro absolute z-10 bottom-6  bg-[#D6E6E3]/40 px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px]  max-w-[210px]  md:max-w-[260px] text-xs md:text-sm md:font-medium text-d4">
            {{ card.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mt-6 projects-intro">

      <div class="flex gap-2">
        <button
          class="bg-white/60  active:scale-105 active:bg-white hover:bg-white  rounded-xl p-3  disabled:opacity-30 disabled:cursor-default w-10 h-10"
          :disabled="!canScrollPrev" @click="scrollPrev" aria-label="Prev Slide">
          <svg :class="[isRTL ? '' : 'rotate-180']" class="transition-transform" viewBox="0 0 532 532"   height="16" >
            <path fill="#014439"
              d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
          </svg>
        </button>

        <button
          class="bg-white/60 active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 disabled:opacity-10 disabled:cursor-default w-10 h-10"
          :disabled="!canScrollNext" @click="scrollNext" aria-label="Next slide">
          <svg :class="[isRTL ? '' : 'rotate-180']" class="transition-transform" viewBox="0 0 532 532"   height="16" >
            <path fill="#014439"
              d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
          </svg>
        </button>
      </div>

      <div ref="dotsContainerRef" class="flex gap-2 items-center justify-center h-4" :dir="isRTL ? 'rtl' : 'ltr'">
        <button v-for="(card, index) in cards" :key="card.id" @click="scrollTo(index)" v-show="shouldShowDot(index)"
          :class="[
            'rounded-full transition-all duration-300 ease-out border-none cursor-pointer hover:!bg-najmgreen',
            getDotClasses(index)
          ]" :aria-label="`Go to slide ${index + 1}`" />
      </div>


    </div>
  </div>
</template>
<script setup>
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits(['visibleStackChanged'])

const emblContainer = ref(null)
const viewportRef = ref(null)
const embla = ref(null)

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const props = defineProps({
  cards: {
    type: Array,
    required: true
  },
  stackIds: {
    type: Array,
    default: () => []
  }
})

const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const scrollPrev = () => embla.value && embla.value.scrollPrev()
const scrollNext = () => embla.value && embla.value.scrollNext()
const scrollTo = (index) => embla.value && embla.value.scrollTo(index)

// ... existing imports ...

// Configuration for Instagram-style window
const MAX_VISIBLE_DOTS = 8

// Calculate the start index of the sliding window
const windowStart = computed(() => {
  const total = props.cards.length
  if (total <= MAX_VISIBLE_DOTS) return 0

  // Center the selection in the window (2 is half of 5)
  let start = selectedIndex.value - 2

  // Clamp the window so it doesn't go out of bounds
  if (start < 0) start = 0
  if (start > total - MAX_VISIBLE_DOTS) start = total - MAX_VISIBLE_DOTS

  return start
})

// Helper to determine if a dot is within the visible window
const shouldShowDot = (index) => {
  return index >= windowStart.value && index < windowStart.value + MAX_VISIBLE_DOTS
}

// Helper to generate classes based on position and selection
const getDotClasses = (index) => {
  const isSelected = selectedIndex.value === index

  // 1. Base Green/Gray color
  let classes = isSelected ? 'bg-najmgreen' : 'bg-gray-300/70'

  // 2. Size Logic
  if (isSelected) {
    // The active dot (Wide)
    classes += ' w-6 h-2 opacity-100'
  } else {
    // Determine if this dot is at the very edge of the visible window
    const isEdgeDot = index === windowStart.value || index === windowStart.value + MAX_VISIBLE_DOTS - 1
    const isEndorStart = index ===  props.cards.length || index === 0

    // If it's an edge dot, make it small (Instagram effect), otherwise normal size
    if (isEdgeDot && props.cards.length > MAX_VISIBLE_DOTS && !isEndorStart) {
      classes += ' w-1.5 h-1.5 opacity-60' // Small dot
    } else {
      classes += ' w-2 h-2' // Normal dot
    }
  }

  return classes
}

// ... existing onSelect, initializeEmbla, etc ...
const dotsContainerRef=ref(null)
// autoplay + visibility

const onSelect = () => {
  if (!embla.value) return

  selectedIndex.value = embla.value.selectedScrollSnap()
  canScrollPrev.value = embla.value.canScrollPrev()
  canScrollNext.value = embla.value.canScrollNext()

  // visible stack calculation stays as you had it
  const start = Math.max(0, selectedIndex.value - 2)
  const end = Math.min(props.cards.length, start + 5)
  const visible = props.cards.slice(start, end).map(c => c.id)
  emit('visibleStackChanged', visible)
}

let autoplayPlugin

const initializeEmbla = () => {
  if (embla.value) {
    embla.value.destroy()
    embla.value = null
  }

  autoplayPlugin = Autoplay({
    delay: 2000,
    stopOnInteraction: false
  })

  embla.value = EmblaCarousel(
    viewportRef.value,
    {
      draggable: true,
      speed: 100,
      align: 'center',
      dragFree: true,
      direction: isRTL.value ? 'rtl' : 'ltr',
      loop: true
    },
    [autoplayPlugin]
  )

  embla.value.on('select', onSelect)
  // run once after init to set initial state
  onSelect()
}

onMounted(() => {
  initializeEmbla()
  const dotsContainer = dotsContainerRef.value

    // Pause/resume autoplay when hovering dots container
  if (dotsContainer && autoplayPlugin) {
    dotsContainer.addEventListener('mouseenter', () => {
      if (autoplayPlugin) autoplayPlugin.stop()
    })
    dotsContainer.addEventListener('mouseleave', () => {
      if (!autoplayPlugin || !embla.value) return
      const slides = embla.value.slideNodes ? embla.value.slideNodes() : []
      if (!slides.length) return
      autoplayPlugin.play()
    })
  }


})
</script>
