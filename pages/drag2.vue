<!-- pages/drag2.vue -->
<template>
    <!-- note the ref="wrapper" here -->
    <div ref="wrapper" class="-mx-4 overflow-visible">
        <!-- Outer Swiper: one slide per package -->
        <Swiper slides-per-view="1" space-between="20"
            :autoplay="{ delay: 50000, disableOnInteraction: false, pauseOnMouseEnter: true }"
            class="h-[500px] w-full !px-2 mb-8">
            <SwiperSlide v-for="(pkg, pkgIdx) in packages" :key="pkgIdx"
                class="flex flex-col p-2 bg-[#F6EC9E] rounded-3xl overflow-hidden content-end cont-slide" @click="toggle(pkgIdx)">
                <!-- per-slide toggle -->
                <!-- <div class="mb-4 flex justify-center w-full">
                    <button @click="toggle(pkgIdx)"
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition z-50">
                        {{ isFree[pkgIdx] ? 'Switch to Stacked' : 'Switch to Free' }}
                    </button>
                </div> -->

                <!-- Inner Swiper -->
                <Swiper slides-per-view="auto" space-between="8" 
                    :autoplay="{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }"
                    class="w-full !h-42 !overflow-visible" @swiper="(swiper) => onInnerSwiper(swiper, pkgIdx)">
                    <SwiperSlide v-for="(prod, idx) in pkg" :key="prod.id"
                        class="product-card w-max h-max max-h-42 max-w-42 p-2 rounded-2xl flex items-center justify-center overflow-hidden"
                        :class="[
                            isFree[pkgIdx] ? 'bg-transparent' : 'bg-white'
                        ]" :style="cardStyle(pkgIdx, idx)">
                        <img :src="prod.image" :alt="`Product ${prod.id}`"
                            class="object-contain max-h-[120px] max-w-[150px] mx-auto my-auto" />
                    </SwiperSlide>
                </Swiper>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore from 'swiper'
import { FreeMode, Autoplay } from 'swiper/modules'
import 'swiper/css'

SwiperCore.use([FreeMode, Autoplay])

interface Product { id: number; image: string }

// your data
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
        { id: 11, image: '/images/main/1.png' },
        { id: 12, image: '/images/main/2.png' },
        { id: 13, image: '/images/main/3.png' },
        { id: 14, image: '/images/main/4.png' },
        { id: 15, image: '/images/main/5.png' }
    ]
]
function onInnerSwiper(swiper: SwiperCore, pkgIdx: number) {
    innerSwipers.value[pkgIdx] = swiper
}

const innerSwipers = ref<(SwiperCore | null)[]>(packages.map(() => null))

// track each slide’s “free” state
const isFree = ref<boolean[]>(packages.map(() => false))

// random targets per slide/item
const freeTargets = ref(
    packages.map(pkg =>
        pkg.map(() => ({ x: 0, y: 0, r: 0 }))
    )
)

// ref to the yellow wrapper
const wrapper = ref<HTMLElement | null>(null)
    async function toggle(pkgIdx: number) {
  const swiper = innerSwipers.value[pkgIdx]

  if (!swiper) return

  isFree.value[pkgIdx] = !isFree.value[pkgIdx]

  if (isFree.value[pkgIdx]) {
      swiper.slideTo(0, 200)
      swiper.autoplay.stop()

    // 🛑 First, wait for swiper to finish any ongoing transition
    if (swiper.animating) {
      await new Promise((resolve) => swiper.once('transitionEnd', resolve))
      await nextTick()
    }

    // 🎯 Now that swiper is idle, slide back to first slide

    // ✅ Wait for slide-to-0 animation to complete
    // await new Promise((resolve) => swiper.once('transitionEnd', resolve))
    // await nextTick()

    // 📏 Now measure positions safely
    if (wrapper.value) {
      const { clientWidth, clientHeight } = wrapper.value

      const centerX = clientWidth / 2
      const centerY = clientHeight / 2

    //   const outerSlides = wrapper.value.querySelectorAll('.cont-slide')[pkgIdx]
    const activeSlide = wrapper.value?.querySelectorAll('.swiper-slide-active:not(.product-card)')[0];

    // Now inside the real slide, find .cont-slide
    const innerCards = activeSlide?.querySelectorAll('.product-card')
    console.log(innerCards)

      if (!innerCards) return

      freeTargets.value[pkgIdx] = packages[pkgIdx].map((_, idx) => {
        const cardEl = innerCards[idx] as HTMLElement
        if (!cardEl) return { x: 0, y: 0, r: 0 }

        const cardRect = cardEl.getBoundingClientRect()

        const cardCenterX = cardRect.left + cardRect.width / 2
        const cardCenterY = cardRect.top + cardRect.height / 2

        const offsetX =  centerX - cardCenterX
        const offsetY =  centerY - cardCenterY +100
        const randomRotation = (Math.random() - 0.5) * 60

        return {
          x: offsetX,
          y: offsetY,
          r: randomRotation,
        }
      })
    }
  } else {
    swiper.autoplay.start()

    freeTargets.value[pkgIdx] = packages[pkgIdx].map(() => ({
      x: 0,
      y: 0,
      r: 0,
    }))
  }
}


// compute inline style for each card
function cardStyle(pkgIdx: number, idx: number) {
    // const { x, y, r } = isFree.value[pkgIdx]
    //     ? freeTargets.value[pkgIdx][idx]
    //     : { x: 0, y: 0, r: 0 }
    

        const { x, y, r } = isFree.value[pkgIdx] ? freeTargets.value[pkgIdx][idx] : {x:0, y: 0, r: 0 }



    return {
        transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
    transition: 'transform 0.6s ease-in-out',

        // transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
        // transition: 'transform 0.6s ease-out',

    }
}
</script>

<style scoped>
.swiper {
    width: 100%;
    height: 500px;
}

.swiper .swiper-wrapper {
    align-items: center;
}
</style>