<template>

    <div class="flex flex-col w-full gap-4">
      
      <!-- Office Package Section -->
      <div class="w-full h-[312px] p-0  bg-[#d3d6ce]/100  rounded-[25px] bg-[url('https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-33-2.png')] bg-cover">
        <!-- <div class="flex flex-row justify-between items-start w-full">
          <div class="w-12 h-12 bg-[#ffffff80] rounded-[15px] p-3">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/arrow-up-2.png" class="w-6 h-6" alt="arrow" />
          </div>
          <button class="px-6 py-3  bg-[#daebd0]/100  rounded-[25px] ">
            <span class="text-base font-semibold">پکیج اداری و سازمانی</span>
          </button>
        </div>
        <div class="flex mt-[180px] justify-end">
          <button class="px-6 py-3 bg-transparent rounded-[25px] ">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-32-2.png" class="h-[21px]" alt="frame" />
          </button>
        </div> -->


        <CarouselAutoSlider2 class="w-full" />

      </div>
  
      <!-- Custom Package Section -->
      <div class="flex flex-col md:flex-row gap-4 md:h-[264px]">
        <!-- Left Package Info -->
        <div class="w-full md:w-[33%]  bg-[#e4edf0]/100  rounded-[25px] overflow-hidden p-0 content-center" >
          <img src="/images/aut/Frame 26.png" class="object-cover p-0" alt="frame" />

          
        </div>
  
        <!-- Right Package Info -->
        <div dir="rtl" class="flex-1  bg-[#e4edf0]/100  rounded-[25px] p-6 w-full overflow-hidden">
          <div class="flex flex-col justify-between h-full gap-4">
            <div class="flex flex-col gap-6">
              <h2 class="text-xl lg:text-2xl font-extrabold">پکیج سفارشی خودتو بساز!</h2>
              <p class="text-sm font-medium">
                یه پکیج آماده انتخاب کن یا به اونا آیتم‌های جدید اضافه کن، به ازای هر آیتم، تخفیف بیشتری روی اون پکیج بگیر! هرچقدر پکیجت بزرگ‌تر بشه، قیمتش کمتر میشه.
              </p>
            </div>
            <div class="flex justify-end">
              <button class="px-6 py-3 bg-white rounded-[25px]  hover:bg-gray-50">
                <span class="text-base font-semibold text-[#2f3136]">ساخت پکیج سفارشی</span>
              </button>
            </div>
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
  
  