<template>
  <div class="h-full  flex-grow pt-16">
    <HighlightedText />

    <div
      class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px]"
      style="top:68px; padding:0px 24px;">
      <ImagesFloating />
    </div>



    <div class="bok gap-3 flex flex-col">
      <div class="h-46 -translate-y-10 overflow-visible">
        <LazyProjectReservation />
      </div>
      <GreenButton :fullWidth="false" label="شروع مشاوره و رزرو سفارش" @click="" />

      <div v-motion
      :initial="{ scale: 0, }" :visible="{ scale: 1, }">
        <p class="text-center font-medium text-sm text-d4 text-black/50 transition-transform">
          شروع سفارش‌دهی از
          <span
            class=" text-[#014439] underline decoration-0.5 decoration-offset-3 decoration-[#014439] px-0.5">۵</span>
          روز دیگر
        </p>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import HighlightedText from '@/components/new/HighlightedText.vue'
import GreenButton from '@/components/buttons/GreenButton.vue'

import ImagesFloating from '@/components/ImagesFloating.vue'
import LazyProjectReservation from '@/components/sections/LazyProjectReservation.vue'
</script>
