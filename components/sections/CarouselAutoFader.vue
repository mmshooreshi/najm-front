<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import ChevronDownIcon from '~/assets/icons/chevron-down-icon.svg'

const containerRef = ref(null)
const isOpen = ref(false)

// Define your slides array; add more slides as needed.
const slides = ref([
  {
    image: '/images/sections/printing/printing-section-1.png',
    alt: 'Printing Machine',
    text: 'چاپخانه اختصاصی ما'
  },
  {
    image: '/images/sections/printing/Stationery_Stones_Mockup_psd-960x640.jpg',
    alt: 'Stationery Stones Mockup',
    text: 'نمونه کار ۱'
  },
  {
    image: '/images/sections/printing/Free-US-Stationary-Mockup-PSD-Set.jpg',
    alt: 'US Stationary Mockup',
    text: 'نمونه کار ۲'
  },
  {
    image: '/images/sections/printing/Scene_Creator_Business_Stationery.jpg',
    alt: 'Business Stationery',
    text: 'نمونه کار ۳'
  },
  {
    image: '/images/sections/printing/close-up-paper-envelope-mockup_266768-302.jpg',
    alt: 'Paper Envelope Mockup',
    text: 'نمونه کار ۴'
  },
  {
    image: '/images/sections/printing/Free_Stationery_Mockup_psd-960x640.jpg',
    alt: 'Stationery Mockup',
    text: 'نمونه کار ۵'
  },
  {
    image: '/images/sections/printing/Free-DL-Bi-Fold-Brochure-Mockup-PSD-Set-.jpg',
    alt: 'Brochure Mockup',
    text: 'نمونه کار ۶'
  }
])

// Optionally listen for slide changes via the @slideChange event in the template.
const onSlideChange = (swiperInstance: any) => {
  if (swiperInstance.realIndex === 0) {
    console.log('Carousel completed a full cycle!')
  }
}
const uniqueId = Math.random().toString(36).substring(2, 9);

onMounted(() => {
  console.log('Swiper initialized')
})
</script>

<template>
  <div  class="relative">
    <ClientOnly>
      <swiper-container
        ref="containerRef"
        class="h-96 md:h-full "
        :modules="[Autoplay, EffectFade, Pagination]"
        :loop="true"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        :effect="'fade'"
        :fadeEffect="{ crossFade: true }"
        :pagination="{ el: `#pagination-${uniqueId}`, clickable: true }"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index" class="relative">
          <img
            :src="slide.image"
            :alt="slide.alt"
            class="w-full h-96 md:h-full object-cover rounded-3xl"
          />
          <!-- Overlay Button with Chevron Icon -->
          <div class="absolute left-[50%] -translate-x-[50%] bottom-[1%] group cursor-pointer transition-all bg-opacity-95 hover:bg-opacity-100 duration-300 hover:scale-105 hover:text-gray-900 w-max bg-white py-0 px-2 sm:px-4 sm:py-2 rounded-3xl shadow-md text-sm font-bold flex items-center mb-4">
            <!-- Center the icon -->
            <div class="text text-xs text-demibold">{{slide.text}}</div>

            <div class="ml-2 flex justify-center items-center w-6 h-6 transition-transform -rotate-90" :class="{ 'rotate-180': isOpen }">
                <ChevronDownIcon class="group-hover:translate-y-2 transition-all duration-300" />
            </div>
        </div>

        </swiper-slide>
        <!-- Swiper built-in pagination indicators -->
        <div :id="`pagination-${uniqueId}`" class="swiper-pagination  h-min !top-8 gap-1 !w-full"></div>
      </swiper-container>
    </ClientOnly>
  </div>
</template>
