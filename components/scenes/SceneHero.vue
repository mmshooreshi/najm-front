<!-- SceneHero.vue -->
<template>
  <div class=" py-16 md:pt-16  flex flex-col flex-grow">
    <teleport to="body">
      <RotatoryPane/>
    </teleport>

    <HighlightedText />

    <div
      class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px]"
      style="top:48px; padding:0px 0px;">
      <ImagesFloating />
    </div>


    <div class="bok gap-3 flex flex-col flex-grow h-full translate-y-0">
      <div class="h-46  overflow-visible">
        <LazyProjectReservation />
      </div>
      <div class="flex-grow"></div>
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
import RotatoryPane from '@/components/fixed/RotatoryPane.vue'
import rotatoryLg from '~/components/rotatoryLegacy.vue'

import ImagesFloating from '@/components/ImagesFloating.vue'
import LazyProjectReservation from '@/components/sections/LazyProjectReservation.vue'
</script>
