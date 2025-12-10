<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface VerticalSlide {
  id: string
  title: string
  body: string
  image: string
}

const props = defineProps<{
  sectionId: string
  slides: VerticalSlide[]
  rtl?: boolean
}>()

const containerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let observer: IntersectionObserver | null = null

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const slideEls = Array.from(
    container.querySelectorAll<HTMLElement>('[data-snap-slide]')
  )

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = slideEls.indexOf(entry.target as HTMLElement)
          if (index !== -1) activeIndex.value = index
        }
      }
    },
    {
      root: container,
      threshold: 0.55 // more than half in view → active
    }
  )

  slideEls.forEach(el => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <!-- Outer section so the main nav can anchor via #solutions etc. -->
  <section
    :id="sectionId"
    :dir="rtl ? 'rtl' : 'ltr'"
    class="relative min-h-screen bg-[#f7f3f3]"
  >
    <!-- Vertical snap container -->
    <div
      ref="containerRef"
      class="h-screen max-h-screen overflow-y-auto overscroll-y-contain
             snap-y snap-mandatory scroll-smooth"
    >
      <!-- Slides -->
      <article
        v-for="(slide, index) in slides"
        :key="slide.id"
        data-snap-slide
        class="snap-start h-screen flex items-center"
      >
        <div
          class="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-12
                 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <!-- Text -->
          <div class="space-y-6">
            <div
              class="text-xs uppercase tracking-[0.25em] text-gray-400"
            >
              راهکارها و ویژگی‌ها
            </div>

            <h2
              class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed
                     motion-safe:transition-all motion-safe:duration-700
                     motion-safe:ease-out"
              :class="
                activeIndex === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6 pointer-events-none'
              "
            >
              {{ slide.title }}
            </h2>

            <p
              class="text-sm sm:text-base leading-8 text-gray-700
                     motion-safe:transition-all motion-safe:duration-700
                     motion-safe:ease-out delay-100"
              :class="
                activeIndex === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              "
            >
              {{ slide.body }}
            </p>

            <!-- Small bullets / progress indicator -->
            <div class="flex items-center gap-2 pt-4">
              <span
                v-for="(s, i) in slides"
                :key="s.id"
                class="h-2 rounded-full motion-safe:transition-all motion-safe:duration-500"
                :class="[
                  i === activeIndex ? 'w-6 bg-najmgreen' : 'w-2 bg-gray-300'
                ]"
              />
            </div>
          </div>


          <!-- Image -->
          <div
            class="relative w-full aspect-[4/7] max-h-[540px]
                   overflow-hidden rounded-3xl 
                   bg-black/5 
                   motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
            :class="
              activeIndex === index
                ? 'opacity-100 translate-y-0 rounded-3xl'
                : 'opacity-0 translate-y-3 rounded-[20rem]'
            "
          >
            <!-- Frame inner layer -->
            <div
              class="absolute inset-0 rounded-2xl overflow-hidden
                     motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
              :class="
                activeIndex === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-80 translate-y-3'
              "
            >
              <img
                :src="slide.image"
                :alt="slide.title"
                class="h-full w-full object-cover
                       motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out"
                :class="
                  activeIndex === index
                    ? 'scale-110 translate-y-0'
                    : 'scale-125 -translate-y-2'
                "
              />

              <!-- overlay -->
              <div
                class="pointer-events-none absolute inset-0
                       bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.25),transparent_55%)]"
              />
            </div>
          </div>

        </div>
      </article>
    </div>
  </section>
</template>
