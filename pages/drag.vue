<template>
    <div class=" -mx-4 overflow-visible">
        <Swiper slides-per-view="1" space-between="20" :autoplay="{
            delay: 50000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }" class="h-[500px] w-full  !px-2 mb-8">
            <SwiperSlide v-for="(pkg, pkgIdx) in packages" :key="pkgIdx"
                class="flex p-2 bg-[#F6EC9E] rounded-3xl content-end overflow-hidden">
                <!-- Inner Swiper: auto-snap + 0.5s autoplay -->
                <Swiper slides-per-view="auto" space-between="8" loop :autoplay="{
                    delay: 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }" class="w-full !h-42 !overflow-visible">
                    <SwiperSlide v-for="prod in pkg" :key="prod.id" v-motion-pop-visible-once :delay="(prod.id%5)*100"
                        class="w-max h-max max-h-42 max-w-42 p-2 bg-white rounded-2xl flex content-center items-center justify-center overflow-hidden">
                        <img :src="prod.image" :alt="`Product ${prod.id}`"
                            class="object-contain max-h-[120px] max-w-[150px] mx-auto my-auto" />
                    </SwiperSlide>
                </Swiper>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore from 'swiper'
import { FreeMode, Autoplay } from 'swiper/modules'

import 'swiper/css'
//   import 'swiper/css/free-mode'
//   import 'swiper/css/autoplay'

SwiperCore.use([FreeMode, Autoplay])

interface Product {
    id: number
    image: string
}

// Three packages, each with five products
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
</script>

<style scoped>
/* Outer Swiper container */
.swiper {
    width: 100%;
    height: 500px;
}

/* Center inner slides vertically */
.swiper .swiper-wrapper {
    align-items: center;
}
</style>