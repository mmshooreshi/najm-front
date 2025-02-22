<template>
    <figure class="relative flex flex-col items-center w-full h-full rounded-3xl overflow-hidden">
      <!-- Image (Fills the width completely) -->
      <div class="w-full">
        <img src="/images/sections/carousel-det-1.png" alt="پکیج اداری و سازمانی" class="w-full h-full object-cover" />
      </div>
  
      <!-- Overlay Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-between p-6">
        <!-- Caption -->
        <figcaption class="bg-[#DFEED7] text-d4 text-base font-extrabold px-4 py-2 rounded-3xl self-start">
          پکیج اداری و سازمانی
        </figcaption>
  

  
        <!-- Carousel Indicator -->
         <div class="flex flex-row w-full justify-between"> 
            <div class="hover:scale-105 transition-all cursor-pointer bg-white w-12 h-12 flex items-center justify-center rounded-xl">
            <ArrowIconBtn />
            </div>
            <CarouselIndicator class="self-end" @cycleComplete="handleCycleComplete" />

        </div>
      </div>
    </figure>
  </template>
  
  <script setup lang="ts">
  import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";
  import CarouselIndicator from "~/components/new/CarouselIndicator.vue";
  import ArrowIconBtn from '~/assets/icons/arrow-icon-btn.svg'
  const isOpen = ref(false);
  const handleCycleComplete = () => console.log("Carousel completed!");
  </script>
  