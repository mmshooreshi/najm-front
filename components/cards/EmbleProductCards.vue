<template>
    <div dir="rtl" class="relative overflow-x-visible py-0">
      <div class="overflow-visible w-full" ref="viewportRef">
        <div class="flex" :class="wrapperClass">
          <div
            v-for="(product, idx) in products"
            :key="`${selectedType}-${product.group}-${product.id}`"
            class="relative flex-none w-4/5 mr-2.5 max-h-[430px] max-w-[267px] rtl flex-shrink-0"
          >
            <NuxtImg
              :src="product.image"
              :alt="product.name"
              v-motion
              :initial="{ scale: 0.8 }"
              :visible="{ scale: 1 }"
              :duration="150"
              class="object-cover w-full h-auto rounded-[1.5rem] max-h-[267px]"
            />
            <div class="m-1 mt-4 flex flex-col gap-1">
              <div class="font-bold text-d4 text-md">{{ product.name }}</div>
              <div class="text-d4 text-xs">{{ product.subtitle }}</div>
              <div class="text-d4 text-xs">{{ product.type }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- controls -->
      <div class="flex items-center mt-4 px-2" :class="wrapperClass">
        <div v-if="showArrows" class="flex gap-2">
          <button
            class="bg-white/60 active:scale-105 hover:bg-white rounded-xl p-3 disabled:opacity-30"
            :disabled="!canScrollPrev"
            @click="scrollPrev"
            aria-label="Prev Slide"
          >
            <!-- prev icon -->
          </button>
          <button
            class="bg-white/60 active:scale-105 hover:bg-white rounded-xl p-3 disabled:opacity-30"
            :disabled="!canScrollNext"
            @click="scrollNext"
            aria-label="Next Slide"
          >
            <!-- next icon -->
          </button>
        </div>
  
        <div v-if="showDots" class="flex gap-2">
          <button
            v-for="(_, idx) in products"
            :key="idx"
            @click="scrollTo(idx)"
            :class="[
              'h-2.5 rounded-full transition-all',
              selectedIndex === idx
                ? 'bg-[#014439] w-8'
                : 'bg-gray-300/70 w-2.5'
            ]"
            :aria-label="`Go to slide ${idx + 1}`"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import EmblaCarousel from 'embla-carousel'
  
  interface Product {
    id: number
    image: string
    name: string
    subtitle: string
    price: string
    buttonText: string
    group: string
    type: string
  }
  
  const props = defineProps<{
    products: Product[]
    controls?: 'all' | 'arrows' | 'dots' | 'none'
    position?: 'default' | 'reverse' | 'center'
    selectedType?: string
  }>()
  
  const showArrows = computed(
    () => props.controls === 'all' || props.controls === 'arrows'
  )
  const showDots = computed(
    () => props.controls === 'all' || props.controls === 'dots'
  )
  const wrapperClass = computed(() => {
    // ensure correct RTL ordering
    if (props.position === 'center') return 'justify-center flex-row-reverse'
    if (props.position === 'reverse') return 'justify-between flex-row'
    // default: start at right, RTL
    return 'justify-start flex-row-reverse'
  })
  
  const viewportRef = ref<HTMLElement | null>(null)
  const embla = ref<ReturnType<typeof EmblaCarousel> | null>(null)
  const selectedIndex = ref(0)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)
  


function scrollToIndex(index) {
  embla.value && embla.value.scrollTo(index)
}
defineExpose({
  scrollToIndex,
  // optionally expose shortcuts:
  scrollToStart: () => scrollToIndex(0),
  scrollToEnd: () => scrollToIndex(props.products.length - 1)
})


  const scrollPrev = () => embla.value?.scrollPrev()
  const scrollNext = () => embla.value?.scrollNext()
  const scrollTo = (i: number) => embla.value?.scrollTo(i)
  
  const onSelect = () => {
    if (!embla.value) return
    selectedIndex.value = embla.value.selectedScrollSnap()
    canScrollPrev.value = embla.value.canScrollPrev()
    canScrollNext.value = embla.value.canScrollNext()
  }
  
  onMounted(() => {
    if (!viewportRef.value) return
    embla.value = EmblaCarousel(viewportRef.value, {
      containScroll: 'keepSnaps',
      draggable: true,
      loop: false,
      align: 'start',
      direction: 'rtl'
    })
    embla.value.on('init', onSelect)
    embla.value.on('select', onSelect)
  })
  </script>
  