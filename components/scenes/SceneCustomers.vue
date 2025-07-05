<!-- components/scenes/SceneCustomers.vue -->
<!-- ScenePromo6.vue -->
<template>
  <section :dir="isRTL? 'rtl' : 'ltr'" lang="fa" class="relative py-32 mx-0  text-center">
    <h2 class="text-lg text-d4 font-extrabold">
      {{ data.heading }}
    </h2>
    <p class="mt-4 text-d4 text-xs font-medium text-gray-600">
      {{ data.description }}
    </p>

    <!-- Embla viewport -->
    <div ref="viewportRef" class="absolute left-0 mt-12 overflow-visible w-full  cursor-[url(/images/mdi--company-light.png),pointer]">
      <div class="flex">
        <div
          v-for="(logo, idx) in data.logos"
          :key="idx"
          class="flex-none px-10 "
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-18 w-max object-contain mx-2 !opacity-100 transition-all brightness-[1.1]  hover:brightness-[0.9] hover:scale-110 cursor-[url(/images/mdi--company.png),pointer]"

          />
        </div>
        <div
          v-for="(logo, idx) in data.logos"
          :key="idx"
          class="flex-none px-10"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-18 w-max object-contain mx-2 !opacity-100  transition-all brightness-[1.1]    hover:brightness-[0.9] hover:scale-110 cursor-[url(/images/mdi--company.png),pointer]"
          />
        </div>

      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EmblaCarousel from 'embla-carousel'
import autoScroll from 'embla-carousel-auto-scroll'
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const logosPrev = [
  { src: '/images/customers/l1.svg', alt: 'Snapp! Market' },
  { src: '/images/customers/l2.svg', alt: 'Pakshoma' },
  { src: '/images/customers/l3.svg', alt: 'Bonmano' },
  { src: '/images/customers/l4.svg', alt: 'Pakshoo' },
  { src: '/images/customers/l5.svg', alt: 'Danone' },
  { src: '/images/customers/l6.svg', alt: 'رهپویان دانش و اندیشه' },
  { src: '/images/customers/l7.svg', alt: 'کانون فرهنگی آموزش قلم چی' },
]


const homeUI = inject<any>('homeUI') ?? {}
const data = computed(() => homeUI?.value?.sceneCustomers ?? {})

const viewportRef = ref(null)
let embla: any = null
let autoScrollApi: any = null



function initCarousel() {
  // Destroy any existing instance
  embla?.destroy()
  autoScrollApi?.destroy()

  // Recreate scroll plugin
  autoScrollApi = autoScroll(
    {
      speed: 3,
      startDelay: 0,
      direction: isRTL.value ? 'forward' : 'backward',
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    },
    (emblaApi) => emblaApi
  )

  // Create Embla with correct direction
  embla = EmblaCarousel(
    viewportRef.value,
    {
      loop: true,
      dragFree: true,
      draggable: false,
      align: 'start',
      containScroll: 'keepSnaps',
      direction: isRTL.value ? 'rtl' : 'ltr',
    },
    [autoScrollApi]
  )

  embla.on('autoScroll:stop', () => {
    autoScrollApi?.play()
  })
}

onMounted(() => {
  initCarousel()
})

watch(language, () => {
  nextTick(() => {
    initCarousel()
  })
})

watch(isRTL, () => {
  nextTick(() => {
    initCarousel()
  })
})

onBeforeUnmount(() => {
  autoScrollApi && autoScrollApi.destroy()
  embla && embla.destroy()
})
</script>

<style scoped>
/* all layout via Tailwind */
</style>
