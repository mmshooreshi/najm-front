<template>

    <div class="flex flex-col h-full w-full gap-4 max-h-full ">
      
      <div class="flex-1 min-h-[150px]">
      <CarouselAutoSlider2 class="w-full h-full" />
    </div>

  
      <!-- Custom Package Section -->
      <div class="flex flex-row gap-4 max-h-[150px]">
        <!-- Left Package Info -->
        <div class="w-full max-w-[30%] md:w-[30%]  bg-[#e4edf0]/100  rounded-[25px] overflow-hidden p-0 content-center" >
          <NuxtImg src="./images/aut/Frame 26.png" class="object-contain p-0 h-full mx-auto" alt="frame" />

          
        </div>
        <div dir="rtl" class="w-full bg-[#e4edf0] rounded-[25px] p-4 space-y-4 overflow-hidden">
  <!-- Text -->
  <div>
    <h2 class="text-base font-bold mb-2">
      پکیج سفارشی خودتو بساز!
    </h2>
    <p class="text-sm leading-relaxed">
      یه پکیج آماده انتخاب کن یا به اونا آیتم‌های جدید اضافه کن،
      به ازای هر آیتم، تخفیف بیشتری روی اون پکیج بگیر! هرچقدر پکیجت بزرگ‌تر بشه، قیمتش کمتر میشه.
    </p>
  </div>

  <!-- Button -->
  <div class="w-full flex justify-end -translate-y-8">
    <button class="w-max bg-white px-2 py-2 rounded-[25px] hover:bg-gray-100 text-sm font-semibold text-[#2f3136]">
      ساخت پکیج سفارشی
    </button>
  </div>
</div>


      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Component logic can be added here if needed
  import CarouselAutoSlider2 from '~/components/sections/CarouselAutoSlider2.vue'

  </script>
  
  <style scoped>
  /* Add any component-specific styles here if needed */
  </style>
  
  