<template>
<div>
    <!-- Your Main Content (positioned above the background) -->
    <div class="snap-start  max-h-screen">
      <!-- Header Container (Frame 277 + 216 + 285 merged) -->
      <div
        class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px] "
        style="top:68px; padding:0px 24px;">
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
    <div class="snap-start  mt-2 mx-auto py-8 pb-0 px-6 ">
      <PrintingSection />
    </div>

    <div class="snap-start snap-y snap-mandatory  overflow-y-hidden md:pt-8">
      <div
        class=" pt-4 md:pt-0 grid grid-cols-1 md:grid-cols-7  md:grid-rows-2 md:gap-2 h-full my-8 mx-0 md:mx-0  items-start">
        <!-- Left Section (Auto-fading Carousel) -->
        <div class="w-full  h-full row-span-1 md:row-span-2 md:col-span-2">
          <CarouselAutoFader class="w-full h-full" />
        </div>
        <!-- Center Section (Accordion) -->
        <div class="pt-4 md:pt-0 w-full h-full row-span-1 md:row-span-2 col-span-3">
          <Accordion class="" />
        </div>


        <!-- Right Section (Two stacked boxes inside a flex container) -->
        <div
          class="snap-end flex justify-center items-center h-full flex-col gap-2 row-span-1 md:row-span-2 md:col-span-2 py-4 md:py-0">
          <div class="bg-[#A5E4EB] w-full h-full relative overflow-hidden min-h-56 p-6 rounded-3xl"> 
            
            <img ref="imageRef"
              src="/images/aut/trade-box.gif" alt="Box Mapping"
              class="absolute inset-0 w-full h-full object-cover object-center" />
          </div>
          <div class="bg-[#DAEBD0] w-full h-full min-h-56  p-6 rounded-3xl">

          </div>
        </div>



      </div>

    </div>


    <div class="snap-start  mt-2 mx-auto py-8 pb-0 px-6 ">
      <nccc />
    </div>

    <div dir="rtl" class="snap-start m-2 pt-8 mb-12 overflow-visible mx-8">
      <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h1 class="text-3xl font-bold text-d4 md:max-w-[30%]">چیزی فراتر از یک جعبه!</h1>
        <p class="text-md md:text-xl text-justify md:max-w-[470px]">هر سبک جعبه برای نمایش محصول منحصر به فرد شما طراحی
          شده است. برش
          ها و پنجره های سفارشی را اضافه کنید.</p>
      </div>
      <HorizontalCategories />
      <BoxCard />
    </div>
    <div class="snap-start flex flex-col md:flex-row w-full h-auto gap-4 p-4">
      <DesignExecutionCard class="flex-grow" />
      <ProductDesignCard class="flex-grow" />
    </div>

    <div dir="rtl" class="my-8 mx-8 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h1 class="text-3xl font-bold text-d4 md:max-w-[30%]">پیدا کردن یک چاپگر آسان است، اما پیدا کردن یک شریک چاپ سخت است.</h1>
        <p class="text-md md:text-xl text-justify md:max-w-[470px]">شما لایق شریکی هستید که رسیدن به اهدافتان را آسان کند
          از سبک های ساده تا بسیار پیچیده، ما طیف کاملی از محصولات و قابلیت ها را برای برآوردن هر نیازی داریم.
        </p>
      </div>

    <div
      class="snap-start pt-4 overflow-hidden border border-0 border-black rounded-3xl flex flex-col md:flex-row max-w-[450px] md:max-w-screen items-center justify-center w-full mt-0 mb-4 mx-auto px-0 gap-4">
      <!-- <CarousalDet/> -->

      <CarouselAutoSlider class="w-full md:max-w-[350px] lg:max-w-lg" />

      <!-- <CustomPackage class="" /> -->
      <CustomPackageBetter />


    </div>



    <div class="pb-8 snap-end">
      <!-- <FollowupWheel /> -->

    </div>

    <div class="pb-8 snap-start">
      <!-- <FollowupWheel /> -->
      <FaqSec/>

    </div>

    <!-- <FaqSection /> -->

  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import FooterLayout from '~/components/FooterLayout.vue'

import ImagesFloating from '~/components/ImagesFloating.vue'
import ProjectReservation from '~/components/sections/ProjectReservation.vue'
import PrintingSection from '~/components/sections/PrintingSection.vue'
import nccc from '~/components/aut/n.vue'

import CarouselAutoFader from '~/components/sections/CarouselAutoFader.vue'
import CarouselAutoSlider from '~/components/sections/CarouselAutoSlider.vue'
import popDiv from '~/components/popDiv.vue'
import HorizontalCategories from '~/components/sections/HorizontalCategories.vue'
import CustomPackage from '~/components/sections/CustomPackage.vue'
import CustomPackageBetter from '~/components/sections/CustomPackageBetter.vue'

import CarousalDet from '~/components/sections/CarousalDet.vue'
import BoxCard from '~/components/BoxCard.vue'
import Accordion from '~/components/Accordion.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import HighlightedText from '~/components/new/HighlightedText.vue';
import testing from '~/components/testing.vue';
import Btn from "~/components/re/Btn.vue";
import FollowupWheel from '~/components/sections/FollowupWheel.vue';
import DesignExecutionCard from '~/components/aut/DesignExecutionCard.vue';
import ProductDesignCard from '~/components/aut/ProductDesignCard.vue';
import { useAuthStore } from '~/composables/useAuth'
import FaqSection from '~/components/sections/FaqSection.vue'
import FaqSec from '~/components/sections/FaqSec.vue'

const {     token,user,identifier,isAuthenticated,logout} = useAuthStore()

const isLoading = ref(false);

const handleSubmit = () => {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 2000);
};



const { width } = useWindowSize()
const columns = computed(() => (width.value >= 1024 ? 12 : width.value >= 768 ? 8 : 4))
</script>
