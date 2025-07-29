<!-- components/scenes/SceneFacilities.client.vue -->
<template>
  <div class="snap-start flex flex-col w-full gap-12 pt-12">
    <SceneHeading :data="data"/>

    <!-- 1) Add h-[400px] and items-stretch here -->
    <r3col class="md:h-[400px]  items-stretch">

      <template #left>
        <div v-memotion-pop-visible="{ delay: 1, duration: 0.4 }"   class="h-[300px] md:h-[400px] rounded-3xl w-full">
          <SliderSqr class="h-full w-full" :slides="data.facilitiesSlides" paginationPosition="bottom left" />

          <!-- 2) SliderSqr just needs to be full -->
        </div>
      </template>

      <template #center>
        <div v-memotion-pop-visible="{ delay: 0.8, duration: 0.4 }"  class="h-[300px] md:h-[400px] rounded-3xl w-full  flex items-center justify-center">
          <div class="h-[300px] md:h-[400px] relative w-full rounded-3xl overflow-hidden">
          <NuxtImg
            src="/images/sections/facilities/center.avif"
            fill
            class="absolute inset-0 w-full h-full object-cover object-center"
            alt="Facility Center"
          />

        <div class="absolute  flex flex-col gap-2 h-full  w-full items-center">

          <div class="relative w-full h-full flex flex-row items-center  overflow-hidden">
            <labelz :labels="data.labels" />
          </div>

        </div>

        </div>
        </div>
      </template>

      <template #right>
        <div v-memotion-pop-visible="{ delay: 0.5, duration: 0.4 }"  class="h-[300px] md:h-[400px] rounded-3xl w-full">
          <SliderSqr hideArrows class="h-full w-full" :slides="data.machinesSlides" paginationPosition="bottom left"/>

        </div>
      </template>

    </r3col>
  </div>
</template>


<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import r3col from '@/components/scenes/r3col.vue'
import SliderSqr from '@/components/scenes/SliderSqr.vue'
import labelz from '@/components/scenes/labelz.vue'

const dataPrev = {
  label : "امکانات و تجهیزات",
  header:"کیفیت و دقتی که درباره اون صحبت می‌کنیم رو از نزدیک ببینید",
  description1: "یه تیم یکپارچه به شما این امکان رو می‌ده که تمام مراحل تولید، از طراحی تا چاپ و بسته‌بندی رو با یک پارتنر پیش ببرید و به جای مدیریت چندین تأمین‌کننده جداگانه فقط بر کار خودتون متمرکز بشید.",
  description2: ""
}

// ——————————————
// Slides for the *left* (machines) slider
const machinesSlidesPrev = [
  {
    image: '/images/sections/facilities/machines-1.mp4',
    alt:   'تجهیزات و دستگاه‌ها',
    text:  'تجهیزات و دستگاه‌ها',
    href: '/home2'
  }
]

// ——————————————
// Slides for the *right* (facilities) slider
const facilitiesSlidesPrev = [
  {
    image: '/images/sections/facilities/facilities-1.mp4',
    alt:   'امکانات و بخش‌ها',
    text:  'امکانات و بخش‌ها',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/facilities-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/machines-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/facilities-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/machines-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/facilities-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/machines-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/facilities-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  },
  {
    image: '/images/sections/facilities/machines-1.avif',
    alt:   'بخش‌ها و امکانات',
    text:  'بخش‌ها و امکانات',
    href: '/home2'
  }

]


const homeUI = inject<any>('homeUI') ?? {}
const data = computed(() => homeUI?.value?.sceneFacilities ?? {})


</script>



