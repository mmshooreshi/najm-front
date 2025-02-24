<template>
  <!-- Wrap everything in a relative container -->
  <div class="relative bg-gray/10 min-h-screen w-screen prevent-select">
    <!-- SVG Background Gradient -->
    <BackgroundGradient />

    <!-- Your Main Content (positioned above the background) -->
    <div class="mx-4 md:mx-8 2xl:mx-28 relative ">
      <Header />
      <!-- Header Container (Frame 277 + 216 + 285 merged) -->
      <div
        class=" z-[1] flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px] backdrop-blur-sm"
        style="left:16px; right:16px; top:68px; padding:64px 24px;"
      >
        <!-- Header Text -->
        <!-- <div class="sm:w-[343px] md:w-[543px] h-[138px] text-center font-IRANSansX font-bold text-[35px] leading-[51px] text-black">
          یه راهکار خلاقانه برای چاپ و بسته‌بندی مورد نیاز شما
        </div> -->
        <HighlightedText/>
        <!-- Floating Images -->
        <ImagesFloating />
      </div>


      <ProjectReservation/>


      <div class="mt-2 mx-auto py-16 px-6">
        <PrintingSection />

        <div class="flex flex-col md:max-w-screen items-center  md:flex-row gap-2 my-8 mx-0">
          <CarouselAutoFader class="w-[100%] md:w-[50%] h-[100%]"/>
          <Accordion />
        </div>
        <Btn class="absolute left-[50%] -translate-x-[50%] text-nowrap text-d4 text-demibold text-base hover:tracking-wide bg-[#014439] bg-opacity-90 text-white hover:bg-opacity-100 py-[20px] px-[20px] sm:px-[90px]" label="با امکانات ما آشنا شو"  :loading="isLoading" @clicked="handleSubmit" />

      </div>


      <div class="overflow-hidden border border-0 border-black rounded-3xl flex flex-col md:flex-row max-w-[450px] md:max-w-screen items-center justify-center w-full my-8 mx-auto px-6 gap-4">
        <!-- <CarousalDet/> -->
        <CarouselAutoSlider  class="w-full md:max-w-[350px] lg:max-w-[450px]"/>

        <CustomPackage/>

      </div>

      <div>

        <FollowupWheel/>
      </div>
      
      <!-- <testing/> -->



      <div class="h-[1000px] w-full">
        .
      </div>
      <!-- Grid Layout -->
      <div class="absolute grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12 h-screen">
        <div v-for="n in columns" :key="n" class="bg-red-200/0 text-center h-full">
          <!-- Content for column {{ n }} -->
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Header from '~/components/Header.vue'
import ImagesFloating from '~/components/ImagesFloating.vue'
import ProjectReservation from '~/components/sections/ProjectReservation.vue'
import PrintingSection from '~/components/sections/PrintingSection.vue'
import CarouselAutoFader from '~/components/sections/CarouselAutoFader.vue'
import CarouselAutoSlider from '~/components/sections/CarouselAutoSlider.vue'

import CustomPackage from '~/components/sections/CustomPackage.vue'
import CarousalDet from '~/components/sections/CarousalDet.vue'

import Accordion from '~/components/Accordion.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import HighlightedText from '~/components/new/HighlightedText.vue';
import testing from '~/components/testing.vue';
import Btn from "~/components/re/Btn.vue";
import FollowupWheel from '~/components/sections/FollowupWheel.vue';

const isLoading = ref(false);

const handleSubmit = () => {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 2000);
};



const { width } = useWindowSize()
const columns = computed(() => (width.value >= 1024 ? 12 : width.value >= 768 ? 8 : 4))
</script>
