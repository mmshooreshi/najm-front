<template>
  <div 
    :style="{ backgroundImage: `url('https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-33.png')` }" 
    class="flex flex-col w-full h-full  gap-[236px] overflow-hidden bg-gray p-0 bg-cover rounded-[25px]"
  >

  <CarouselAutoFader2 class="w-full h-full" />

    <!-- Header section -->
    <!-- <div class="flex flex-row items-center bg-[#daebd0] rounded-[25px]  p-3 px-6 w-fit">
      <img 
        src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/arrow-up.png" 
        alt="arrow" 
        class="w-6 h-6 cursor-pointer hover:opacity-80"
        @click="handleArrowClick"
      />
      <span class="self-center text-black font-semibold text-base mr-0 font-['IRANSansX']">انواع تقویم رومیزی</span>
    </div> -->

    <!-- Calendar types list -->
    <!-- <div class="flex flex-col gap-[175px] items-end justify-end flex-grow">
      <div 
        class="flex flex-row items-end justify-end rounded-[25px]  p-3 px-6 cursor-pointer "
        @click="handleCalendarClick"
      >
        <img 
          src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-32.png" 
          alt="calendar" 
          class="w-[192px] h-[21px]"
        />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import CarouselAutoFader2 from '~/components/sections/CarouselAutoFader2.vue'

const handleArrowClick = () => {
  console.log('Arrow clicked')
}

const handleCalendarClick = () => {
  console.log('Calendar type selected')
}
</script>
