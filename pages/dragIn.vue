<template>
    <div class="-mx-4 overflow-visible">
      <!-- outer Swiper -->
      <Swiper
        slides-per-view="1"
        space-between="20"
        :autoplay="{ delay: 50000, disableOnInteraction: false, pauseOnMouseEnter: true }"
        class="h-[500px] w-full !px-2 mb-8"
      >
        <SwiperSlide
          v-for="(pkg, pkgIdx) in packages"
          :key="pkgIdx"
          class="flex flex-col p-2 bg-[#F6EC9E] rounded-3xl overflow-hidden"
        >
          <!-- per-slide toggle -->
          <div class="mb-4 flex justify-center">
            <button
              @click="toggle(pkgIdx)"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              {{ isFree[pkgIdx] ? 'Switch to Stacked' : 'Switch to Free' }}
            </button>
          </div>
  
          <!-- Inner Swiper: auto-snap + 0.5s autoplay -->
          <Swiper
            slides-per-view="auto"
            space-between="8"
            loop
            :autoplay="{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }"
            class="w-full !h-42 !overflow-visible"
          >
            <SwiperSlide
              v-for="(prod, idx) in pkg"
              :key="prod.id"
              class="w-max h-max max-h-42 max-w-42 p-2 bg-white rounded-2xl flex items-center justify-center overflow-hidden"
            >
              <div
                class="product-card relative"
                :ref="el => registerRef(el, pkgIdx, idx)"
              >
                <img
                  :src="prod.image"
                  :alt="`Product ${prod.id}`"
                  class="object-contain max-h-[120px] max-w-[150px] mx-auto my-auto"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { useMotion } from '@vueuse/motion'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import SwiperCore from 'swiper'
  import { Autoplay } from 'swiper/modules'
  import 'swiper/css'
  
  SwiperCore.use([Autoplay])
  
  interface Product { id: number; image: string }
  const packages: Product[][] = [
    [
      { id: 1, image: '/images/main/1.png' },
      { id: 2, image: '/images/main/2.png' },
      { id: 3, image: '/images/main/3.png' },
      { id: 4, image: '/images/main/4.png' },
      { id: 5, image: '/images/main/5.png' }
    ],
    [
      { id: 6, image: '/images/main/6.png' },
      { id: 7, image: '/images/main/7.png' },
      { id: 8, image: '/images/main/8.png' },
      { id: 9, image: '/images/main/9.png' },
      { id: 10, image: '/images/main/10.png' }
    ],
    [
      { id: 11, image: '/images/main/11.png' },
      { id: 12, image: '/images/main/12.png' },
      { id: 13, image: '/images/main/13.png' },
      { id: 14, image: '/images/main/14.png' },
      { id: 15, image: '/images/main/15.png' }
    ]
  ]
  
  // Free vs stacked per slide
  const isFree = ref<boolean[]>(packages.map(() => false))
  function toggle(index: number) {
    isFree.value[index] = !isFree.value[index]
  }
  
  // Element refs and motion controllers
  const itemEls = ref<HTMLElement[][]>(packages.map(pkg => Array(pkg.length).fill(null)))
  const itemMotions: ReturnType<typeof useMotion>[][] = []
  const targets = ref<{ x: number; y: number; r: number }[][]>([])
  
  // Initialize empty targets
  packages.forEach((_, i) => {
    targets.value[i] = packages[i].map(() => ({ x: 0, y: 0, r: 0 }))
  })
  
  function randomize(slideIdx: number) {
    targets.value[slideIdx] = packages[slideIdx].map(() => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      r: Math.random() * 30 - 15
    }))
  }
  
  onMounted(async () => {
    await nextTick()
  
    // Setup motions
    packages.forEach((pkg, slideIdx) => {
      itemMotions[slideIdx] = []
      pkg.forEach((_, idx) => {
        const el = itemEls.value[slideIdx][idx]
        if (el) {
          // ensure absolute transform origin
          el.style.position = 'relative'
          const motion = useMotion(el, {
            initial: { x: 0, y: 0, rotate: 0, scale: 1 },
            transition: { type: 'spring', stiffness: 180, damping: 12 }
          })
          itemMotions[slideIdx].push(motion)
        }
      })
    })
  
    // Watch each slide's free state
    packages.forEach((_, slideIdx) => {
      watch(
        () => isFree.value[slideIdx],
        async (free) => {
          if (free) {
            randomize(slideIdx)
            await nextTick()
            targets.value[slideIdx].forEach(({ x, y, r }, idx) => {
              itemMotions[slideIdx][idx]?.apply({ x, y, rotate: r, scale: 1 })
            })
          } else {
            itemMotions[slideIdx].forEach(m => m.apply({ x: 0, y: 0, rotate: 0, scale: 1 }))
          }
        },
        { immediate: false }
      )
    })
  })
  
  function registerRef(el: HTMLElement | null, slideIdx: number, idx: number) {
    if (el) itemEls.value[slideIdx][idx] = el
  }
  </script>
  
  <style scoped>
  .swiper { width: 100%; height: 500px; }
  .swiper .swiper-wrapper { align-items: center; }
  .product-card { display: inline-block; }
  </style>
  