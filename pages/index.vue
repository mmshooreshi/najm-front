<template>
  <!-- Wrap everything in a relative container -->
  <BackgroundGradient />

  <div
    class="px-4 md:px-8 2xl:px-28  relative h-screen  prevent-select  overflow-x-hidden overflow-y-auto snap-y snap-mandatory ">
    <!-- SVG Background Gradient -->


    <!-- Your Main Content (positioned above the background) -->
    <div class="snap-start  max-h-screen">
      <Header />
      <!-- Header Container (Frame 277 + 216 + 285 merged) -->
      <div
        class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px] "
        style="top:68px; padding:64px 24px;">
        <!-- Header Text -->
        <!-- <div class="sm:w-[343px] md:w-[543px] h-[138px] text-center font-IRANSansX font-bold text-[35px] leading-[51px] text-black">
          یه راهکار خلاقانه برای چاپ و بسته‌بندی مورد نیاز شما
        </div> -->
        <HighlightedText />
        <!-- Floating Images -->
        <ImagesFloating />
      </div>

      <!-- <popDiv/> -->
      <ProjectReservation />

    </div>
    <div class="snap-start  mt-2 mx-auto py-16 px-6 ">
      <PrintingSection />
    </div>
    <div class="snap-y snap-mandatory  h-max pt-4">
        <div
          class="snap-start pt-8 md:pt-0 grid grid-cols-1 md:grid-cols-7  md:grid-rows-2 md:gap-2  my-8 mx-0 md:mx-0 lg:mx-28 items-start">
          <!-- Left Section (Auto-fading Carousel) -->
          <div class="w-full  h-full row-span-1 md:row-span-2 md:col-span-2">
            <CarouselAutoFader class="w-full h-full" />
          </div>
          <!-- Center Section (Accordion) -->
          <div class="snap-start pt-8 md:pt-0 w-full row-span-1 md:row-span-2 col-span-3">
            <Accordion class="" />
          </div>


          <!-- Right Section (Two stacked boxes inside a flex container) -->
          <div class="snap-end flex justify-center items-center h-full flex-col gap-2 row-span-1 md:row-span-2 md:col-span-2 pb-8">
            <div class="bg-[#A5E4EB] w-full h-full  min-h-56 p-6 rounded-3xl">.</div>
            <div class="bg-[#DAEBD0] w-full h-full min-h-56  p-6 rounded-3xl">.</div>
          </div>



        </div>

    </div>

    <div class="mx-auto relative w-max ">
    <Btn
      class="text-nowrap text-d4 text-demibold text-base hover:tracking-wide bg-[#014439] bg-opacity-90 text-white hover:bg-opacity-100 py-[20px]  px-[20px] sm:px-[90px]"
      label="با امکانات ما آشنا شو" :loading="isLoading" @clicked="handleSubmit" />
    </div>
    <div
      class="snap-start pt-8 overflow-hidden border border-0 border-black rounded-3xl flex flex-col md:flex-row max-w-[450px] md:max-w-screen items-center justify-center w-full mt-0 mb-4 mx-auto px-0 gap-4">
      <!-- <CarousalDet/> -->
      <CarouselAutoSlider class="w-full md:max-w-[350px] lg:max-w-lg" />

      <CustomPackage class="" />

    </div>

    <div class="pb-8 snap-end">
      <FollowupWheel />

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
import popDiv from '~/components/popDiv.vue'

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
