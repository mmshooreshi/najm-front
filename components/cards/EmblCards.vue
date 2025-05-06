<template>
  <div dir="rtl" class="relative overflow-x-visible    absolute py-6">
    <div class="overflow-visible w-full" ref="viewportRef">
      <div class="flex">
        <div
          v-for="(card, idx) in cards"
          :key="card.id"
          
          class="relative flex-none w-4/5 mr-2.5 max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible rtl"
        >
          <NuxtImg
            :src="card.image"
            :alt="card.text"
            v-motion
            :initial="{scale: 0.8}"
            :visible="{scale: 1}"
            :duration="100"
            class="object-cover h-full w-full scale-100 rounded-[1.5rem]"
          />
          
          <div   v-motion
            :initial="{scale: 0.8}"
            :visible="{scale: 1}"
            :duration="100"  class="absolute bottom-6 right-6 bg-[#D6E6E3] px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px]  max-w-[210px]  md:max-w-[260px] text-xs md:text-sm md:font-medium text-d4">
            {{ card.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mt-4">
  
      <div class="flex gap-2">
        <button
          class="bg-white/60  active:scale-105 active:bg-white hover:bg-white  rounded-xl p-3  disabled:opacity-30 disabled:cursor-default"
          :disabled="!canScrollPrev"
          @click="scrollPrev"
          aria-label="Prev Slide"
        >
          <svg class="w-6 h-6" viewBox="0 0 532 532">
            <path
              fill="#014439"
              d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
            />
          </svg>
        </button>

        <button
          class="bg-white/60 active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 disabled:opacity-10 disabled:cursor-default"
          :disabled="!canScrollNext"
          @click="scrollNext"
          aria-label="Next slide"
        >
          <svg class=" w-6 h-6" viewBox="0 0 532 532">
            <path
              fill="#014439"
              d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
            />
          </svg>
        </button>
      </div>
      <div class="flex gap-2">
        <button
          v-for="(card, idx) in cards"
          :key="card.id"
          @click="scrollTo(idx)"
          :class="['w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all', selectedIndex === idx ? 'bg-[#014439] w-8' : 'bg-gray-300/70']"
          :aria-label="`Go to slide ${idx + 1}`"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import EmblaCarousel from 'embla-carousel'
// import DescriptionBubble if needed

const props = defineProps({
  cards: {
    type: Array,
    required: true,
    // expects something like { text: '...' }
  }
})
const viewportRef = ref(null)
const embla = ref(null)



const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const scrollPrev = () => embla.value && embla.value.scrollPrev()
const scrollNext = () => embla.value && embla.value.scrollNext()
const scrollTo = (index) => embla.value && embla.value.scrollTo(index)

const onSelect = () => {
  selectedIndex.value = embla.value.selectedScrollSnap()
  canScrollPrev.value = embla.value.canScrollPrev()
  canScrollNext.value = embla.value.canScrollNext()
}

onMounted(() => {
  embla.value = EmblaCarousel(viewportRef.value, {
    containScroll: 'keepSnaps',
    draggable: true,
    speed: 100,
    delay: 3000,
    align: 'start',
    dragFree: false,
    direction: 'rtl',
    loop: false
  })
  embla.value.on('init', onSelect)
  embla.value.on('select', onSelect)
})
</script>