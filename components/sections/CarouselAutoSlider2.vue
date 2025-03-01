<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import ChevronDownIcon from '~/assets/icons/chevron-down-icon.svg'
import ArrowIconBtn from '~/assets/icons/arrow-icon-btn.svg'
const containerRef3 = ref(null)
const isOpen = ref(false)

// Define your slides array; add more slides as needed.
const slides = ref([

  {
    image: '/images/sections/printing/Stationery_Stones_Mockup_psd-960x640.jpg',
    alt: 'Stationery Stones Mockup',
    text: 'پکیج اداری'
  },
  {
    image: '/images/sections/printing/Free-US-Stationary-Mockup-PSD-Set.jpg',
    alt: 'US Stationary Mockup',
    text: 'پکیج اداری و سازمانی'
  },
  {
    image: '/images/sections/printing/Scene_Creator_Business_Stationery.jpg',
    alt: 'Business Stationery',
    text: 'پکیج اداری'
  },
  {
    image: '/images/sections/printing/close-up-paper-envelope-mockup_266768-302.jpg',
    alt: 'Paper Envelope Mockup',
    text: 'پکیج اداری و سازمانی'
  },
  {
    image: '/images/sections/printing/Free_Stationery_Mockup_psd-960x640.jpg',
    alt: 'Stationery Mockup',
    text: 'پکیج اداری'
  },
  {
    image: '/images/sections/printing/Free-DL-Bi-Fold-Brochure-Mockup-PSD-Set-.jpg',
    alt: 'Brochure Mockup',
    text: 'پکیج اداری و سازمانی'
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
  <div class="relative h-[312px] ">
    <ClientOnly>
      <swiper-container ref="containerRef3" class="" :modules="[Autoplay, EffectFade, Pagination]"
        :loop="true" :autoplay="{ delay: 3500, disableOnInteraction: false }" :effect="'fade'"
        :fadeEffect="{ crossFade: true }" :pagination="{ el: `#pagination-${uniqueId}`, clickable: true }"
        @slideChange="onSlideChange">
        <swiper-slide v-for="(slide, index) in slides" :key="index" class="relative">
          <div
            class="cursor-pointer group relative flex flex-col items-center w-full h-full rounded-3xl overflow-hidden">
            <div class="group-hover:scale-110 duration-1000 w-full transition-all">

              <img :src="slide.image" :alt="slide.alt" class="w-full h-[312px]  object-cover rounded-3xl" />
            </div>


            <div class="absolute inset-0 flex flex-col items-center justify-between p-6">
              <!-- Caption -->
              <div
                class="group-hover:opacity-100 transition-all duration-1000 group-hover:-translate-x-[5px] opacity-50 bg-[#DFEED7] text-d4 text-base font-extrabold px-4 py-2 rounded-3xl transition-all self-end">
                {{ slide.text }}
              </div>



              <div class="flex flex-row w-full  justify-between  items-center">
                <div></div>

                <div
                  class="hover:scale-105 transition-all cursor-pointer bg-white w-12 h-12 flex items-center justify-center rounded-xl">
                  <ArrowIconBtn />
                </div>

              </div>
            </div>
          </div>

        </swiper-slide>
        <!-- Swiper built-in pagination indicators -->
        <div :id="`pagination-${uniqueId}`" class="!left-6 !bottom-6 swiper-pagination"></div>
      </swiper-container>
    </ClientOnly>
  </div>
</template>



<style scoped>
.swiper-pagination {
  display: flex;
  justify-content: start !important;
  align-items: center;
}


</style>