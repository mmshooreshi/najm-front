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

// 1 viewport height per slide
const totalHeight = computed(() =>
//   Math.max(1, props.slides.length) * windowHeight.value
    windowHeight.value*3
)

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
  const end = start + totalHeight.value - windowHeight.value
  const y = window.scrollY

  if (y <= start) {
    progress.value = 0
  } else if (y >= end) {
    progress.value = 1
  } else {
    progress.value = (y - start) / (end - start)
  }
}

// helper so we can easily know where a slide is
function slideState(index: number) {
  const current = activeIndex.value
  if (index === current) return 'active'
  if (index < current) return 'past'     // has gone up
  return 'future'                        // is coming from below
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


<template>
  <!-- participates in main page scroll -->
  <section
    :id="sectionId"
    ref="sectionRef"
    :dir="rtl ? 'rtl' : 'ltr'"
    class="relative w-full"
    :style="{ height: `${totalHeight}px` }"
  >
    <!-- pinned area -->
    <div class="sticky top-0 h-screen flex items-center bg-[#f7f3f3]">
      <div class="relative w-full h-full">
        <!-- all slides occupy the same area -->
                       <!-- <div
                v-if="label"
                class="text-xs uppercase tracking-[0.25em] text-gray-400 text-anim origin-right"
                >
                {{ label }}
              </div> -->
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 flex items-start mt-16 justify-center slide-layer"
        >
          <div
            class="mx-auto w-full max-w-6xl px-2 sm:px-8 lg:px-12 py-2
                   grid lg:grid-cols-2 gap-3 md:gap-10 lg:gap-16 items-center"
          >


                      <!-- Image -->
<div
  class="relative w-full aspect-[4/4] md:aspect-[4/7] max-h-[270px] md:max-h-[540px]
         overflow-hidden bg-black/5 rounded-3xl
         motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
  :class="{
    // active → in place, visible, normal radius
    'opacity-100 translate-y-0 rounded-3xl blur-none scale-100':
      slideState(index) === 'active',

    // past → went up, faded, blurred, more rounded
    'opacity-0 -translate-y-50 rounded-[20rem] blur-xl scale-95':
      slideState(index) === 'past',

    // future → coming from below, faded, blurred, more rounded
    'opacity-0 translate-y-50 rounded-[20rem] blur-xl scale-95':
      slideState(index) === 'future'
  }"
>
  <!-- Frame inner layer -->
  <div
    class="absolute inset-0 rounded-2xl overflow-hidden
           motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
    :class="{
      'opacity-100 translate-y-0 blur-none':
        slideState(index) === 'active',

      'opacity-80 -translate-y-24 blur-sm':
        slideState(index) === 'past',

      'opacity-80 translate-y-24 blur-sm':
        slideState(index) === 'future'
    }"
  >
    <img
      :src="slide.image"
      :alt="slide.title"
      class="h-full w-full object-cover
             motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out"
      :class="{
        // active image → a bit zoomed in, centered
        'scale-110 translate-y-0':
          slideState(index) === 'active',

        // gone up
        'scale-125 -translate-y-2':
          slideState(index) === 'past',

        // coming from below
        'scale-125 translate-y-2':
          slideState(index) === 'future'
      }"
    />

    <!-- overlay -->
    <div
      class="pointer-events-none absolute inset-0
             bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.25),transparent_55%)]"
    />
  </div>
</div>


            <!-- TEXT -->
            <div
              class="space-y-4 origin-bottom px-4"
     
            >

              <h2
                class="text-xl sm:text-3xl lg:text-4xl font-bold leading-relaxed text-anim-fast origin-right"
                :class="{
                // active
                'opacity-100 translate-y-0 scale-100 blur-none':
                  slideState(index) === 'active',
                // already scrolled past → go up, fade, blur, shrink
                'opacity-0 -translate-y-16 scale-50 blur-md':
                  slideState(index) === 'past',
                // yet to come → from down, faint, blurred, a bit smaller
                'opacity-0 translate-y-16 scale-50  blur-none':
                  slideState(index) === 'future'
              }"

              >
                {{ slide.title }}
              </h2>

              <p
                class="text-xs sm:text-base md:leading-8 text-gray-700 whitespace-pre-line text-anim-fast origin-right"
                              :class="{
                // active
                'opacity-100 translate-y-0 scale-100 leading-6':
                  slideState(index) === 'active',
                // already scrolled past → go up, fade, blur, shrink
                'opacity-0 scale-0 leading-4':
                  slideState(index) === 'past',
                // yet to come → from down, faint, blurred, a bit smaller
                'opacity-0 translate-y-50 scale-90 leading-12 blur-sm':
                  slideState(index) === 'future'
              }"


                >
                {{ slide.body }}
              </p>

              <!-- <div class="flex items-center gap-2 pt-4">
                <span
                  v-for="(s, i) in slides"
                  :key="s.id"
                  class="h-2 rounded-full transition-all duration-500"
                  :class="
                    i === activeIndex
                      ? 'w-6 bg-najmgreen'
                      : 'w-2 bg-gray-300'
                  "
                />
              </div> -->
            </div>

            
            <!-- <div
              class="relative w-full aspect-[4/3] max-h-[480px]
                     overflow-hidden image-anim"
              :class="{
                // active image: normal size, visible, rounded-3xl
                'opacity-100 translate-y-0 scale-100 blur-none rounded-3xl':
                  slideState(index) === 'active',
                // going out: move up, fade, blur, more rounded + smaller
                'opacity-0 -translate-y-6 scale-95 blur-sm rounded-[3rem]':
                  slideState(index) === 'past',
                // coming in: from down, blurred and small at first
                'opacity-0 translate-y-6 scale-95 blur-sm rounded-[3rem]':
                  slideState(index) === 'future'
              }"
            >
              <img
                :src="slide.image"
                :alt="slide.title"
                class="h-full w-full object-cover"
              />

              <div
                class="pointer-events-none absolute inset-0
                       bg-gradient-to-t from-black/5 via-transparent to-white/10"
              />
            </div> -->


          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
.slide-layer {
  /* parent layer, in case you later add motion here */
}

.text-anim,
.image-anim {
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out,
    filter 0.7s ease-out,
    border-radius 0.7s ease-out,
    line-height 0.7s ease-out;
}
.text-anim-fast{
      transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out,
    filter 0.3s ease-out,
    border-radius 0.3s ease-out,
        line-height 0.6s ease-out;

}
</style>
