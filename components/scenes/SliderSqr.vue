<!-- components/scenes/SliderSqr.vue -->
<template>
  <div ref="containerEl" class="h-full w-full relative group">
    <!-- Subtle Loading Shimmer Skeleton -->
    <div
      class="absolute inset-0 rounded-3xl bg-neutral-200/60 backdrop-blur-xs z-10 pointer-events-none transition-opacity duration-500 overflow-hidden"
      :class="{ 'opacity-0': isLoaded, 'opacity-100 animate-pulse': !isLoaded }"
    />

    <Swiper
      ref="swiperRef"
      :modules="modules"
      :loop="shouldLoop"
      :autoplay="{ delay: autoplayDelay, disableOnInteraction: false }"
      :effect="effect"
      :fadeEffect="{ crossFade }"
      :pagination="{ el: '#' + paginationId, clickable: true }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="h-full w-full rounded-3xl overflow-hidden"
    >
      <SwiperSlide
        v-for="(slide, index) in slides"
        :key="index"
        class="relative flex flex-col items-center w-full h-full rounded-3xl overflow-hidden cursor-pointer"
      >
        <div class="transition-all duration-1000 group-hover:scale-105 w-full h-full">
          <NuxtImg
            v-if="!slide.image.endsWith('mp4')"
            :src="slide.image"
            :alt="slide.alt"
            width="400"
            height="400"
            sizes="xs:300px sm:400px md:400px"
            format="webp"
            quality="80"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            @load="onMediaLoad"
            class="w-full h-full object-cover rounded-3xl"
          />
          <video
            v-else
            muted
            loop
            :preload="isVisible && index === 0 ? 'metadata' : 'none'"
            :autoPlay="isVisible && index === 0"
            playsInline
            :src="isVisible ? slide.image : undefined"
            :aria-label="slide.alt"
            @loadeddata="onMediaLoad"
            class="w-full h-full object-cover rounded-3xl"
          >
            <track kind="captions" src="data:text/vtt,WEBVTT" default label="بدون صدا" />
          </video>
        </div>

        <!-- Slide Bottom Link -->
        <div class="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 pointer-events-none">
          <NuxtLink
            :to="resolveHref(slide.href)"
            class="pointer-events-auto gap-2 self-end bg-white hover:bg-najmgrey transition-all flex flex-row items-center text-d4 text-xs font-demibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-3xl cursor-pointer shadow-xs active:scale-95"
          >
            <Icon name="mdi:arrow-left" class="w-4 h-4 text-najmgreen" />
            <span v-editable="path ? `${path}.${index}.text` : ''">{{ slide.text }}</span>
          </NuxtLink>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Top Overlay Controls: Minibars on Left, Both Navigation Arrows on Right (Strict LTR) -->
    <div
      class="absolute top-0 inset-x-0 p-5 sm:p-6 z-20 pointer-events-none flex items-center justify-between"
      dir="ltr"
    >
      <!-- Minibars (Swiper pagination bullets) -->
      <div
        :id="paginationId"
        class="slider-sqr-pagination pointer-events-auto flex items-center gap-1.5"
      />

      <!-- Navigation Arrows (grouped together on the right side) -->
      <div
        v-if="!hideArrows && slides && slides.length > 1"
        class="pointer-events-auto flex items-center gap-1.5"
        dir="ltr"
      >
        <button
          type="button"
          class="bg-white/75 hover:bg-white active:scale-95 backdrop-blur-md rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer transition-all shadow-sm text-najmgreen hover:shadow"
          @click.stop="slidePrev"
          aria-label="Previous Slide"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 532 532">
            <path
              fill="#014439"
              d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="bg-white/75 hover:bg-white active:scale-95 backdrop-blur-md rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer transition-all shadow-sm text-najmgreen hover:shadow"
          @click.stop="slideNext"
          aria-label="Next Slide"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 532 532">
            <path
              fill="#014439"
              d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import '~/assets/css/swiper-overrides.css'

import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import type { PropType } from 'vue'

interface Slide {
  image: string
  alt?: string
  text?: string
  href?: string
}

function resolveHref(href?: string): string {
  if (!href || href === '/home2') return '/facilities'
  return href
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
  path: {
    type: String,
    default: '',
  },
  modules: {
    type: Array as PropType<any[]>,
    default: () => [Autoplay, EffectFade, Pagination],
  },
})

const shouldLoop = computed(() => props.loop && Array.isArray(props.slides) && props.slides.length > 1)

const swiperRef = ref<InstanceType<typeof Swiper> | null>(null)
const instanceId = useId()
const paginationId = `sqr-pagination-${instanceId}`

const swiperInstance = ref<any>(null)
const isLoaded = ref(false)

function onMediaLoad() {
  isLoaded.value = true
}

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
  if (swiper.pagination) {
    swiper.pagination.init()
    swiper.pagination.render()
    swiper.pagination.update()
  }
  isLoaded.value = true
}

function onSlideChange(_swiper: any) {
  // Silent slide change
}

const isAutoplayPaused = ref(false)
const containerEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let intersectionObserver: IntersectionObserver | null = null

function toggleAutoplay() {
  if (!swiperInstance.value) return
  isAutoplayPaused.value = !isAutoplayPaused.value
  if (isAutoplayPaused.value) {
    swiperInstance.value.autoplay?.stop()
  } else {
    swiperInstance.value.autoplay?.start()
  }
}

function onAdminStateChange(e: any) {
  const detail = e?.detail
  if (detail?.active) {
    swiperInstance.value?.autoplay?.stop()
    isAutoplayPaused.value = true
  } else if (!isAutoplayPaused.value) {
    swiperInstance.value?.autoplay?.start()
  }
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 400)
  if (typeof window !== 'undefined') {
    window.addEventListener('najm:admin-editing-state', onAdminStateChange)

    if (typeof IntersectionObserver !== 'undefined' && containerEl.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            isVisible.value = true
            intersectionObserver?.disconnect()
          }
        },
        { rootMargin: '200px' }
      )
      intersectionObserver.observe(containerEl.value)
    } else {
      isVisible.value = true
    }
  } else {
    isVisible.value = true
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('najm:admin-editing-state', onAdminStateChange)
  }
  intersectionObserver?.disconnect()
})

function slidePrev() {
  swiperInstance.value?.slidePrev()
}
function slideNext() {
  swiperInstance.value?.slideNext()
}
</script>
