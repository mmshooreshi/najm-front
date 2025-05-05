<template>
  <div class="flex max-h-md h-lg overflow-hidden  p-0  md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2">
    <div class="md:col-span-2 overflow-hidden md:row-span-2 flex items-center justify-center h-full rounded-3xl bg-red  bg-[#A5E4EB] p-0  relative">
      <NuxtImg
        v-motion-pop-visible
        ref="imageRef"
        src="/images/aut/trade-box.gif"
        alt="Box Mapping"
        class="absolute inset-0 w-full h-max object-contain "
      />
    </div>
    <div class="md:col-span-2 row-span-2 flex items-start  h-full">
      <Accordion />
    </div>
  </div>
</template>

<script setup lang="ts">
import Accordion from '@/components/Accordion.vue'
</script>
