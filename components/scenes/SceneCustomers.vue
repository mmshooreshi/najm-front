<!-- ScenePromo6.vue -->
<template>
  <section dir="rtl" lang="fa" class="relative overflow-x-visible absolute py-32  text-center">
    <h2 class="text-lg text-d4 font-extrabold">
      مورد اعتماد شرکت‌های بزرگ و کوچک
    </h2>
    <p class="mt-4 text-d4 text-xs font-medium text-gray-600">
      بیش از ۵۰۰۰ مشتری راضی از این امکانات استفاده کردن! تو هم امتحان کن.
    </p>

    <!-- Embla viewport -->
    <div ref="viewportRef" class="mt-12 overflow-visible w-full max-w-[1000px]">
      <div class="flex">
        <div
          v-for="(logo, idx) in logos"
          :key="idx"
          class="flex-none px-10"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-12 w-max object-contain mx-0"
          />
        </div>
        <div
          v-for="(logo, idx) in logos"
          :key="idx"
          class="flex-none px-10"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-12 w-max object-contain mx-0"
          />
        </div>

      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EmblaCarousel from 'embla-carousel'
import autoScroll from 'embla-carousel-auto-scroll'

const logos = [
  { src: '/images/customers/l1.svg', alt: 'Snapp! Market' },
  { src: '/images/customers/l2.svg', alt: 'Pakshoma' },
  { src: '/images/customers/l3.svg', alt: 'Bonmano' },
  { src: '/images/customers/l4.svg', alt: 'Pakshoo' },
  { src: '/images/customers/l5.svg', alt: 'Danone' },
  { src: '/images/customers/l6.svg', alt: 'رهپویان دانش و اندیشه' },
  { src: '/images/customers/l7.svg', alt: 'کانون فرهنگی آموزش قلم چی' },
]

const viewportRef = ref(null)
let embla = null
let autoScrollApi = null

onMounted(() => {
  // set up continuous auto-scroll
  autoScrollApi = autoScroll(
    {
      speed: 2,                 // 2px per frame
      startDelay: 1000,         // wait 1s before starting (and after interactions)
      direction: 'forward',    // scroll leftwards for RTL
      playOnInit: true,         // start automatically
      stopOnInteraction: false, // keep going after drag
      stopOnMouseEnter: false,  // don't pause on hover
      stopOnFocusIn: false,     // don't pause on focus
    },
    (emblaApi) => emblaApi
  )

  embla = EmblaCarousel(  
    viewportRef.value,
    {
      loop: true,
      dragFree: false,
      draggable: false,
      align: 'start',
      containScroll: 'trimSnaps',
      direction: 'rtl',
    },
    [autoScrollApi]
  )
})

onBeforeUnmount(() => {
  autoScrollApi && autoScrollApi.destroy()
  embla && embla.destroy()
})
</script>

<style scoped>
/* all layout via Tailwind */
</style>
