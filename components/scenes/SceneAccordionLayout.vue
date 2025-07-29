<!-- components/scenes/SceneAccordionLayout.vue -->
<template>
  <div
  :dir="isRTL ? 'rtl' : 'ltr'"
    class="flex flex-col gap-4 p-0
           md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 md:max-h-[400px] md:overflow-hidden">


    <!-- ACCORDION: full-width under image on mobile, right 2 cols on md+ -->
    <div
      class="w-full flex-shrink-0
             md:col-span-2 row-span-2
             flex items-start h-auto md:h-full">
      <Accordion />
    </div>

        <!-- IMAGE: full-width h-56 on mobile, grid-fill on md+ -->
    <div
      class="w-full h-[300px] flex-shrink-0
             md:col-span-2 md:row-span-2 md:h-full
             flex items-center justify-center
             rounded-3xl relative overflow-hidden"> 
      <!-- <NuxtImg
        src="/images/aut/trade-box.gif"
        alt="Box Mapping"
        class="w-full h-auto object-contain   md:object-cover  rounded-3xl
                md:inset-0 md:h-full" /> -->
      <!-- 29,13,05,01 -->
                <img
        :src="'/videos/08.webp'"
        alt="Box Mapping"
        class="w-min transition-all duration-200 hover:scale-110  h-full object-contain   md:object-contain  rounded-3xl
                md:inset-0 md:h-full" />


                
    </div>


  </div>
</template>

<script setup lang="ts">
import Accordion from '@/components/Accordion.vue'

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

</script>
