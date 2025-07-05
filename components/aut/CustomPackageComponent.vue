<!-- components/aut/CustomPackageComponent.vue -->
<template>
    <div class="flex flex-col w-full gap-4">
      <!-- Office Package Section -->
      <div class="w-full h-[312px] p-6  bg-[#d3d6ce]/100  rounded-[25px] bg-[url('https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-33-2.png')] bg-cover">
        <div class="flex flex-row justify-between items-start w-full">
          <div class="w-12 h-12 bg-[#ffffff80] rounded-[15px] p-3">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/arrow-up-2.png" class="w-6 h-6" alt="arrow" />
          </div>
          <button class="px-6 py-3  bg-[#daebd0]/100  rounded-[25px] border border-[#c2d3d1]">
            <span class="text-base font-semibold">پکیج اداری و سازمانی</span>
          </button>
        </div>
        <div class="mt-[219px] flex justify-end">
          <button class="px-6 py-3 rounded-[25px] border border-[#c2d3d1]">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-32-2.png" class="h-[21px]" alt="frame" />
          </button>
        </div>
      </div>
  
      <!-- Custom Package Section -->
      <div class="flex flex-row gap-4 h-[264px]">
        <!-- Left Package Info -->
        <div class="w-[264px]  bg-[#e4edf0]/100  rounded-[25px] p-6">
          <div class="relative w-full h-full">
            <div class="flex flex-col gap-2">
              <div class="p-4 bg-[#ffffff80] rounded-[25px] border border-[#c2d3d1]">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2 bg-[#e4edf080] rounded-[25px] p-2 border border-[#c2d3d1]">
                    <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/check-ci.png" class="w-6 h-6" alt="check" />
                    <span class="text-xs font-semibold">هاردباکس هدیه</span>
                  </div>
                  <div class="flex items-center gap-2  bg-[#f2f6f8]/100  rounded-[25px] p-2 border border-[#c2d3d1]">
                    <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/check-ci-3.png" class="w-6 h-6" alt="check" />
                    <span class="text-xs font-semibold">استیکر</span>
                  </div>
                  <div class="flex items-center gap-2 bg-[#e4edf080] rounded-[25px] p-2 border border-[#c2d3d1]">
                    <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/check-ci-2.png" class="w-6 h-6" alt="check" />
                    <span class="text-xs font-semibold">پوستر میزی</span>
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <div class="px-6 py-5 bg-white rounded-[25px] border border-[#c2d3d1]">
                  <span class="text-xs font-semibold ml-2">تومان</span>
                  <span class="text-base font-semibold">10.000.000</span>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-[142px]">
              <div class="bg-[#e1ff00]/100 rounded-full p-2">
                <span class="text-base font-semibold">+3</span>
              </div>
            </div>
            <div class="absolute bottom-0 left-0">
              <div class="bg-[#e1ff00]/100 rounded-[26px] py-2 px-3 flex items-center gap-1">
                <span class="text-sm font-semibold">%1 تخفیف</span>
                <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/sale-02.png" class="w-6 h-6" alt="sale" />
              </div>
            </div>
            <img src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/trend-do.png" class="absolute bottom-0 right-[178px] w-8 h-8" alt="trend" />
          </div>
        </div>
  
        <!-- Right Package Info -->
        <div class="flex-1  bg-[#e4edf0]/100  rounded-[25px] p-6">
          <div class="flex flex-col gap-[45px]">
            <div class="flex flex-col gap-6">
              <h2 class="text-2xl font-extrabold">پکیج سفارشی خودتو بساز!</h2>
              <p class="text-sm font-medium">
                یه پکیج آماده انتخاب کن یا به اونا آیتم‌های جدید اضافه کن، به ازای هر آیتم، تخفیف بیشتری روی اون پکیج بگیر! هرچقدر پکیجت بزرگ‌تر بشه، قیمتش کمتر میشه.
              </p>
            </div>
            <div class="flex justify-end">
              <button class="px-6 py-3 bg-white rounded-[25px] border border-[#c2d3d1] hover:bg-gray-50">
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
  </script>
  
  <style scoped>
  /* Add any component-specific styles here if needed */
  </style>
  
  