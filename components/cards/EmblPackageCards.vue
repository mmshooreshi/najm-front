<!-- components/cards/EmblPackageCards.vue -->
<template>
  <div
    dir="rtl"
    class="relative overflow-x-visible py-0 focus:outline-none focus-visible:outline-none"
    role="region"
    aria-roledescription="carousel"
    aria-label="Package carousel"
    @keydown.left.prevent="scrollNext"
    @keydown.right.prevent="scrollPrev"
    tabindex="0"
  >
    <!-- VIEWPORT -->
    <div
      class="overflow-visible w-full"
      ref="viewportRef"
      @pointermove="onPointerMove"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <div class="flex">
        <div
          v-for="(pkg, idx) in packages"
          :key="`${selectedType}${pkg.id}`"
          role="group"
          :aria-label="`${pkg.name} (${idx + 1} of ${packages.length})`"
          @click.prevent="onSlideClick(idx)"
          @mouseenter="onSlideHover(idx, $event)"
          class="tak group z-40 hover:z-50 relative flex-none w-4/5 mr-2.5 rounded-[1.5rem] overflow-visible rtl cursor-pointer
                 transition-all duration-500 ease-out will-change-transform will-change-opacity"
          :class="[
            selectedType !== pkg.type
              ? 'scale-0 opacity-0 max-w-0 pointer-events-none'
              : 'sm:max-w-[400px] sm:h-[400px] sm:min-h-[400px] sm:min-w-[300px] max-w-[80vw] h-[55vw] min-h-[260px] min-w-[220px]',
            selectedIndex === idx
              ? 'opacity-100 scale-100'
              : 'opacity-70 scale-95'
          ]"
        >
          <div
            class="takcon z-10"
            :style="{
              '--tc-base': pkg.color,
              '--tc-shade1': adjustColor(pkg.color, -0.12, 0.85),
              '--tc-shade2': adjustColor(pkg.color, -0.22, 0.75),
              backgroundColor: pkg.color
            }"
          >
            <CardOverlayWrapper
              :toFade="selectedType !== pkg.type"
              :currentPackage="selectedIndex"
              :style="{ backgroundColor: pkg.color }"
              :name="pkg.name"
              :items="pkg.items"
            >
              <NuxtImg
                v-if="pkg.image"
                :src="pkg.image"
                :alt="pkg.name"
                loading="lazy"
                placeholder="blur"
                v-memotion-pop-visible="{
                  ystart: 60,
                  delay: idx * 0.12,
                  duration: 0.5,
                  ease: 'power3.out'
                }"
                class="object-cover h-full w-full scale-100 rounded-[1.5rem]
                       transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </CardOverlayWrapper>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTROLS -->
    <div
      :class="['flex items-center mt-4 gap-3', wrapperClass]"
      ref="dotsContainerRef"
    >
      <!-- arrows -->
      <div v-if="showArrows" class="flex gap-2">
        <button
          class="bg-white/70 backdrop-blur active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 shadow-sm
                 disabled:opacity-30 disabled:cursor-default transition-all duration-200"
          :disabled="!canScrollPrev"
          @click="scrollPrev"
          aria-label="Prev Slide"
        >
          <!-- prev SVG -->
        </button>
        <button
          class="bg-white/70 backdrop-blur active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 shadow-sm
                 disabled:opacity-30 disabled:cursor-default transition-all duration-200"
          :disabled="!canScrollNext"
          @click="scrollNext"
          aria-label="Next Slide"
        >
          <!-- next SVG -->
        </button>
      </div>

      <!-- dots -->
      <div v-if="showDots" class="flex gap-2">
        <button
          v-for="(pkg, idx) in packages"
          :key="pkg.id"
          @pointerdown.prevent="scrollTo(idx)"
          @mouseenter="scrollTo(idx)"
          @touchstart.prevent="scrollTo(idx)"
          :style="{ backgroundColor: pkg.color }"
          class="h-3 rounded-2xl border-none cursor-pointer transition-all duration-250 ease-out"
          :class="[
            'w-3 bg-gray-300/40 hover:w-6',
            selectedIndex === idx ? 'w-6 !bg-najmgreen shadow-sm' : ''
          ]"
          :aria-label="`Go to slide ${idx + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  defineExpose,
} from 'vue'
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import CardOverlayWrapper from '@/components/CardOverlayWrapper.vue'

const props = defineProps({
  packages: {
    type: Array,
    required: true,
  },
  controls: {
    type: String,
    default: 'all',
    validator: v => ['all', 'arrows', 'dots', 'none'].includes(v),
  },
  position: {
    type: String,
    default: 'default',
    validator: v => ['default', 'reverse', 'center'].includes(v),
  },
  selectedType: {
    type: String,
    default: 'Applications',
  },
})

/* --- UI STATE --- */
const showArrows = computed(
  () => props.controls === 'all' || props.controls === 'arrows',
)
const showDots = computed(
  () => props.controls === 'all' || props.controls === 'dots',
)

const wrapperClass = computed(() => {
  if (props.position === 'center') return 'justify-center flex-row'
  if (props.position === 'reverse') return 'justify-between flex-row-reverse'
  return 'justify-between flex-row'
})

const viewportRef = ref(null)
const dotsContainerRef = ref(null)
const embla = ref(null)

/* autoplay + visibility */
let autoplayPlugin = null
let observer = null

/* selection state */
const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const scrollPrev = () => embla.value && embla.value.scrollPrev()
const scrollNext = () => embla.value && embla.value.scrollNext()
const scrollTo = index => embla.value && embla.value.scrollTo(index)

const onSelect = () => {
  if (!embla.value) return
  selectedIndex.value = embla.value.selectedScrollSnap()
  canScrollPrev.value = embla.value.canScrollPrev()
  canScrollNext.value = embla.value.canScrollNext()
}

const currentPackage = computed(() => props.packages[selectedIndex.value])

/* --- HOVER GRAVITY STATE --- */
const hoverX = ref(0)
const hoverInside = ref(false)
let hoverIntervalId = null
let isProgrammaticScroll = false // block hover-scroll while Embla is animating
const lastHoveredScrollIndex = ref(null)

const EDGE_ZONE = 0.18 // 18% left/right
const HOVER_SCROLL_DELAY = 350 // ms between auto scrolls

const clearHoverInterval = () => {
  if (hoverIntervalId !== null) {
    clearInterval(hoverIntervalId)
    hoverIntervalId = null
  }
}

/* --- TAP/CLICK: make slide active + center it --- */
const onSlideClick = index => {
  if (!embla.value) return

  // Kill hover auto-scroll so it doesn't fight the click
  hoverInside.value = false
  clearHoverInterval()

  isProgrammaticScroll = true
  selectedIndex.value = index
  embla.value.scrollTo(index)
}

/* --- UTILITY: is slide fully in viewport? --- */
const isSlideFullyVisible = index => {
  if (!embla.value || !viewportRef.value) return true
  const slides = embla.value.slideNodes ? embla.value.slideNodes() : []
  const slide = slides[index]
  if (!slide) return true

  const viewportRect = viewportRef.value.getBoundingClientRect()
  const slideRect = slide.getBoundingClientRect()
  const padding = 4 // small tolerance

  return (
    slideRect.left >= viewportRect.left + padding &&
    slideRect.right <= viewportRect.right - padding
  )
}

/* --- HOVER ON SLIDE AT EDGE: bring fully into view --- */
const onSlideHover = (index, event) => {
  if (!embla.value) return
  // ignore during programmatic scroll
  if (isProgrammaticScroll) return

  // only care about desktop-ish hover
  if (event && 'pointerType' in event && event.pointerType !== 'mouse') {
    return
  }

  // if already fully visible, do nothing
  if (isSlideFullyVisible(index)) return

  // avoid re-trigger for the same slide while visible
  if (lastHoveredScrollIndex.value === index) return

  hoverInside.value = false
  clearHoverInterval()

  isProgrammaticScroll = true
  lastHoveredScrollIndex.value = index
  embla.value.scrollTo(index)
}

/* --- HOVER GRAVITY ON DESKTOP (edge auto scroll) --- */
const startHoverScrollDirection = direction => {
  clearHoverInterval()
  if (!embla.value) return
  if (isProgrammaticScroll) return

  hoverIntervalId = window.setInterval(() => {
    if (!hoverInside.value || !embla.value) {
      clearHoverInterval()
      return
    }
    if (isProgrammaticScroll) return

    if (direction === 'right') {
      if (embla.value.canScrollNext()) embla.value.scrollNext()
      else clearHoverInterval()
    } else if (direction === 'left') {
      if (embla.value.canScrollPrev()) embla.value.scrollPrev()
      else clearHoverInterval()
    }
  }, HOVER_SCROLL_DELAY)
}

const updateHoverAutoScroll = () => {
  if (!viewportRef.value || !hoverInside.value || !embla.value) return
  if (isProgrammaticScroll) {
    clearHoverInterval()
    return
  }

  const rect = viewportRef.value.getBoundingClientRect()
  const width = rect.width || 1
  const xRel = hoverX.value / width // 0 .. 1

  const inLeftZone = xRel < EDGE_ZONE
  const inRightZone = xRel > 1 - EDGE_ZONE

  if (inRightZone && embla.value.canScrollNext()) {
    startHoverScrollDirection('right')
  } else if (inLeftZone && embla.value.canScrollPrev()) {
    startHoverScrollDirection('left')
  } else {
    clearHoverInterval()
  }
}

const onPointerMove = event => {
  if (!viewportRef.value) return
  if (event.pointerType && event.pointerType !== 'mouse') return

  const rect = viewportRef.value.getBoundingClientRect()
  hoverX.value = event.clientX - rect.left
  updateHoverAutoScroll()
}

const onPointerEnter = event => {
  if (event.pointerType && event.pointerType !== 'mouse') return
  hoverInside.value = true
  onPointerMove(event)
}

const onPointerLeave = () => {
  hoverInside.value = false
  clearHoverInterval()
}

/* --- COLORS / SHADES --- */
function adjustColor(hex, amount, alpha = 1) {
  const c = hex.replace(/^#/, '')
  const num = parseInt(c, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff

  const clamp = v =>
    Math.max(0, Math.min(255, Math.floor(v + amount * 255)))

  r = clamp(r)
  g = clamp(g)
  b = clamp(b)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* --- JSON DOWNLOAD HELPERS (optional) --- */
function downloadJson(pkg) {
  const dataStr = JSON.stringify(pkg, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `package-${pkg.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadAllJson() {
  const dataStr = JSON.stringify(props.packages, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `all-packages.json`
  a.click()
  URL.revokeObjectURL(url)
}

/* --- EMBLA SETUP --- */
onMounted(() => {
  if (!viewportRef.value) return

  embla.value = EmblaCarousel(
    viewportRef.value,
    {
      containScroll: 'keepSnaps',
      draggable: true,
      align: 'center', // center active slide
      direction: 'rtl',
      dragFree: true,
      loop: false,
      duration: 28,
    },
    [
      Autoplay({
        delay: 1000,
        stopOnInteraction: true,
        playOnInit: false,
      }),
    ],
  )

  const plugins = embla.value.plugins ? embla.value.plugins() : {}
  autoplayPlugin = plugins.autoplay || null

  if (autoplayPlugin) autoplayPlugin.stop()

  embla.value.on('select', onSelect)

  // When Embla finishes any scroll, re-enable hover features
  embla.value.on('settle', () => {
    isProgrammaticScroll = false
  })

  embla.value.on('reInit', () => {
    onSelect()
    isProgrammaticScroll = false
    lastHoveredScrollIndex.value = null
  })

  // initial state
  onSelect()

  const node = viewportRef.value
  const dotsContainer = dotsContainerRef.value

  // Pause/resume autoplay on hover over main area
  if (node && autoplayPlugin) {
    node.addEventListener('mouseenter', () => {
      autoplayPlugin && autoplayPlugin.stop()
    })
    node.addEventListener('mouseleave', () => {
      if (!autoplayPlugin || !embla.value) return
      const slides = embla.value.slideNodes
        ? embla.value.slideNodes()
        : []
      if (!slides.length) return
      autoplayPlugin.play()
    })
  }

  // Pause/resume autoplay when hovering dots container
  if (dotsContainer && autoplayPlugin) {
    dotsContainer.addEventListener('mouseenter', () => {
      autoplayPlugin && autoplayPlugin.stop()
    })
    dotsContainer.addEventListener('mouseleave', () => {
      if (!autoplayPlugin || !embla.value) return
      const slides = embla.value.slideNodes
        ? embla.value.slideNodes()
        : []
      if (!slides.length) return
      autoplayPlugin.play()
    })
  }

  setupIntersectionObserver()
})

const setupIntersectionObserver = () => {
  if (!viewportRef.value) return
  const node = viewportRef.value

  observer = new IntersectionObserver(
    entries => {
      const entry = entries[0]
      if (!entry || !embla.value || !autoplayPlugin) return

      const inView =
        entry.isIntersecting && entry.intersectionRatio > 0.3

      const slides = embla.value.slideNodes
        ? embla.value.slideNodes()
        : []
      if (!slides.length) return

      if (inView) autoplayPlugin.play()
      else autoplayPlugin.stop()
    },
    {
      threshold: [0, 0.3, 1],
    },
  )

  observer.observe(node)
}

onBeforeUnmount(() => {
  clearHoverInterval()

  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (autoplayPlugin) {
    autoplayPlugin.stop()
    autoplayPlugin = null
  }
  if (embla.value) {
    embla.value.destroy()
    embla.value = null
  }
})

/* --- EXPOSED API --- */
function scrollToIndex(index) {
  embla.value && embla.value.scrollTo(index)
}

defineExpose({
  scrollToIndex,
  scrollToStart: () => scrollToIndex(0),
  scrollToEnd: () => scrollToIndex(props.packages.length - 1),
})
</script>

<style scoped>
.tak {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  line-height: 1.6;
}

.takcon {
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 22px;
  color: #ffffff;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.takcon::before {
  z-index: 0;
  position: absolute;
  content: "";
  top: 0%;
  left: 50%;
  width: 92%;
  height: 92%;
  transform: translate(-50%);
  background-color: var(--tc-shade1);
  transform-origin: bottom;
  border-radius: inherit;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon::after {
  z-index: 0;
  position: absolute;
  content: "";
  top: 0%;
  left: 50%;
  width: 84%;
  height: 84%;
  transform: translate(-50%);
  background-color: var(--tc-shade2);
  transform-origin: bottom;
  border-radius: inherit;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.tak:hover {
  transform: translate(-4px, -14px);
}

.tak:hover .takcon::before {
  rotate: -7deg;
  top: 0;
  width: 96%;
  height: 96%;
}

.tak:hover .takcon::after {
  rotate: 7deg;
  top: 0;
  width: 96%;
  height: 96%;
}
</style>
