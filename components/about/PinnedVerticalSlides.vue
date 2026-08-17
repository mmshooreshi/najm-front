<!-- components/about/PinnedVerticalSlides.vue -->
<template>
  <section
    :id="sectionId"
    ref="sectionRef"
    :dir="rtl ? 'rtl' : 'ltr'"
    class="relative w-full"
    :style="{ height: `${totalHeight}px` }"
  >
    <!-- Sticky Viewport Area -->
    <div class="sticky top-16 h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-4">
      <div class="relative w-full h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <!-- Slide Layers -->
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 transition-all duration-500 ease-out"
          :class="[
            slideState(index) === 'active'
              ? 'opacity-100 translate-y-0 pointer-events-auto z-20'
              : slideState(index) === 'past'
              ? 'opacity-0 -translate-y-8 pointer-events-none z-10'
              : 'opacity-0 translate-y-8 pointer-events-none z-10'
          ]"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-najmborder/40 shadow-sm">
            <!-- Visual Asset Column -->
            <div class="lg:col-span-6 order-2 lg:order-1">
              <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[360px] rounded-2xl overflow-hidden bg-najmgrey/50 border border-najmborder/30 group">
                <img
                  :src="'/' + slide.image.replace(/^\//, '')"
                  :alt="slide.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                <span class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-najmgreen text-white text-[11px] font-bold font-mono">
                  ۰{{ index + 1 }} / ۰{{ slides.length }}
                </span>
              </div>
            </div>

            <!-- Narrative Content Column -->
            <div class="lg:col-span-6 space-y-4 order-1 lg:order-2 text-right">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-najmgreen"></span>
                <span class="text-xs font-bold text-gray-500 font-mono">راهکار شماره ۰{{ index + 1 }}</span>
              </div>

              <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug text-d4">
                {{ slide.title }}
              </h2>

              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {{ slide.body }}
              </p>

              <!-- Progress Indicator Bars -->
              <div class="flex items-center gap-2 pt-4">
                <div
                  v-for="(s, i) in slides"
                  :key="s.id"
                  class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  :class="i === activeIndex ? 'w-8 bg-najmgreen' : 'w-2 bg-gray-200'"
                  @click="jumpToSlide(i)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'

export interface PinnedSlide {
  id: string
  title: string
  body: string
  image: string
}

const props = defineProps<{
  sectionId: string
  slides: PinnedSlide[]
  rtl?: boolean
  label?: string
}>()

const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const { height: windowHeight } = useWindowSize()

// Generous travel height so each slide is crisp and readable during scroll
const totalHeight = computed(() => {
  const count = Math.max(1, props.slides.length)
  return count * (windowHeight.value || 800) * 1.1
})

const activeIndex = computed(() => {
  const count = props.slides.length
  if (!count) return 0
  const idx = Math.floor(progress.value * count)
  return Math.min(count - 1, Math.max(0, idx))
})

const sectionTop = ref(0)

function updateSectionTop() {
  const el = sectionRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  sectionTop.value = rect.top + window.scrollY
}

function handleScroll() {
  const el = sectionRef.value
  if (!el) return

  const start = sectionTop.value
  const end = start + totalHeight.value - (windowHeight.value || 800)
  const y = window.scrollY

  if (y <= start) {
    progress.value = 0
  } else if (y >= end) {
    progress.value = 0.999
  } else {
    progress.value = (y - start) / (end - start)
  }
}

function slideState(index: number) {
  const current = activeIndex.value
  if (index === current) return 'active'
  if (index < current) return 'past'
  return 'future'
}

function jumpToSlide(index: number) {
  const el = sectionRef.value
  if (!el) return
  const step = (totalHeight.value - (windowHeight.value || 800)) / props.slides.length
  const target = sectionTop.value + index * step + 50
  window.scrollTo({ top: target, behavior: 'smooth' })
}

onMounted(async () => {
  await nextTick()
  updateSectionTop()
  handleScroll()

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', () => {
    updateSectionTop()
    handleScroll()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
