<!-- SliderSqr.vue: -->
<template>
    <div class="h-full w-full  relative">
      <Swiper
        ref="swiperRef"
        :modules="modules"
        :loop="loop"
        :autoplay="{ delay: autoplayDelay, disableOnInteraction: false }"
        :effect="effect"
        :fadeEffect="{ crossFade }"
        :pagination="{ clickable: true }"
        @swiper="onSwiper"

        @slideChange="onSlideChange"
        class="h-full w-full"
        >
        <!-- :pagination="pagination ? paginationOptions : false" -->
        <SwiperSlide
          v-for="(slide, index) in slides"
          :key="index"
          class="relative flex flex-col items-center w-full h-full rounded-3xl overflow-hidden cursor-pointer"
        >
          <div class="transition-all duration-1000 group-hover:scale-110 w-full h-full">
            <NuxtImg
              :src="slide.image"
              :alt="slide.alt"
              class="w-full h-full object-cover rounded-3xl"
            />
          </div>
  
          <div class="absolute inset-0 flex flex-col justify-between p-6">
            <div v-if="!hideArrows" class="flex justify-between items-center w-full gap-1">
                <div class="flex-grow"/>

              <button
                class="flex items-center justify-center w-12 h-12 bg-white/50 hover:bg-white rounded-2xl hover:scale-105 transition-all"
                @click="slidePrev"
              >
                <ChevronRightIcon class="-rotate-180" />
              </button>
              <button
                class="flex items-center justify-center w-12 h-12 bg-white/50 hover:bg-white rounded-2xl hover:scale-105 transition-all"
                @click="slideNext"
              >
                <ChevronRightIcon class="" />
              </button>


            </div>

            
            <div class="flex-grow"></div>
            
            <NuxtLink :to="slide.href"
              class="gap-2 self-end bg-white flex flex-row items-center text-d4 text-xs text-demibold px-6 py-3 rounded-3xl"
            >
                <Icon name="mdi:arrow-left" class="w-4 h-4"/>

              {{ slide.text }}
              
            </NuxtLink>
  

          </div>
        </SwiperSlide>
      </Swiper>
  
      <!-- Dynamic pagination container -->
      <div
  v-if="pagination"
  :id="paginationId"
  class="swiper-pagination absolute z-10 bg-red h-6"
  :class="paginationPositionClasses"
/>

      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
    import 'swiper/css/effect-fade'
    import 'swiper/css/pagination'
    import '~/assets/css/swiper-overrides.css'

    import ChevronRightIcon from "~/assets/icons/chevron-right-icon.svg";

  import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
  import ArrowIconBtn from '~/assets/icons/arrow-icon-btn.svg'
  import type { PropType } from 'vue'
  import type SwiperCore from 'swiper'

  interface Slide {
    image: string
    alt?: string
    text?: string
    href?: string
  }
  
  const props = defineProps({
    hideArrows: {
      type: Boolean,
      default: false,
    },
    slides: {
      type: Array as PropType<Slide[]>,
      required: true,
    },
    autoplayDelay: {
      type: Number,
      default: 3500,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    effect: {
      type: String as PropType<'fade' | 'slide'>,
      default: 'fade',
    },
    crossFade: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    paginationPosition: {
      type: String as PropType<
        'top left' |
        'top center' |
        'top right' |
        'bottom left' |
        'bottom center' |
        'bottom right'
      >,
      default: 'bottom center',
    },
    modules: {
      type: Array as PropType<any[]>,
      default: () => [Autoplay, EffectFade, Pagination],
    },
  })
  

  const swiperRef = ref<InstanceType<typeof Swiper> | null>(null)
  const paginationId = `pagination-${Math.random().toString(36).substr(2, 9)}`
  
  const paginationOptions = computed(() => ({
    el: `#${paginationId}`,
    clickable: true,
  }))
  
  const paginationPositionClasses = computed(() => {
    const [vertical, horizontal] = props.paginationPosition.split(' ')
    const classes: string[] = []
    // vertical positioning
    if (vertical === 'top') classes.push('top-6')
    else classes.push('bottom-6')
    // horizontal positioning
    if (horizontal === 'left') classes.push('left-6')
    else if (horizontal === 'center') classes.push('left-1/2', '-translate-x-1/2')
    else if (horizontal === 'right') classes.push('right-6')
    return classes.join(' ')
  })
  
  function onSlideChange(swiper: any) {
    if (swiper.realIndex === 0) {
      console.log('Looped to first slide')
    }
  }

  const swiperInstance = ref<SwiperCore | null>(null)
    function onSwiper(swiper: SwiperCore) {
  swiperInstance.value = swiper
}


// Slide navigation methods using captured instance
function slidePrev() {
  swiperInstance.value?.slidePrev()
}
function slideNext() {
  swiperInstance.value?.slideNext()
}


  
  onMounted(() => {
    console.log('SwiperSlider mounted')
  })
  </script>

