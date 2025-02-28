<template>

<div class="mt-28 -mb-28 max-w-md mx-auto animate-pulse-alt" dir="rtl">
  <!-- Wrap the image and icon together -->
  <div class="group relative cursor-pointer  fixed -z-10" @click="isShown=!isShown">
    <!-- <img :src="contoursPath" class="w-full" /> -->

    <div class="w-full mx-auto" dir="rtl">
  <svg
    width="100%"
    viewBox="0 0 248 248"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="contours-svg"
  >
    <rect x="100.5" y="100.5" width="47" height="47" rx="23.5" stroke="#FEFDD3" stroke-opacity="0.5"/>
    <rect x="88.5" y="88.5" width="71" height="71" rx="31.5" stroke="#FEFDD3" stroke-opacity="0.5"/>
    <rect x="72.5" y="72.5" width="103" height="103" rx="43.5" stroke="#FEFDD3" stroke-opacity="0.4"/>
    <rect x="52.5" y="52.5" width="143" height="143" rx="63.5" stroke="#FEFDD3" stroke-opacity="0.3"/>
    <rect x="28.5" y="28.5" width="191" height="191" rx="87.5" stroke="#FEFDD3" stroke-opacity="0.2"/>
    <rect x="0.5" y="0.5" width="247" height="247" rx="115.5" stroke="#FEFDD3" stroke-opacity="0.1"/>
  </svg>
</div>

    <div class="absolute inset-0 flex items-center justify-center">
      <div class="z-10 w-10 h-10 bg-[#EAFED3] group-active:bg-[#014439] flex items-center justify-center rounded-full group-hover:scale-150 transition-transform duration-300 ease-in-out">
        <TargetIcon />
      </div>
    </div>
  </div>




  <!-- Place the SVG below the image -->
  <!-- <svg class="w-full" viewBox="0 0 343 115" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M290 0C283.032 0 276.54 2.03601 271.086 5.54554C254.831 16.0054 239.33 35 220 35H35C15.67 35 0 50.67 0 70V114C0 114.552 0.447712 115 0.999997 115H342C342.552 115 343 114.552 343 114V35C343 15.67 327.33 0 308 0H290Z" 
      fill="white" />
  </svg> -->
</div>





<div 
  class=" z-10 transition-[max-height] duration-500 ease-in-out relative max-w-md mx-auto px-3 pt-6 pb-3 bg-white rounded-[35px] shadow-lg prevent-select overflow-hidden" 
  :style="{ maxHeight: isShown ? '500px' : '0px', opacity: isShown ? '1' : '0' }" 
  dir="rtl">



    <div class="relative px-3 z-20">
      <!-- Header Section -->
    
        <div class="flex items-center justify-between">
        <h2 class="text-[18px] font-extrabold">از طراحی تا بسته‌بندی، همه زیر یه سقف!</h2>
        </div>
        <p class="text-gray-600 mt-2 text-[12px] font-medium">چه چیزی نیاز دارید؟</p>
      </div>
      <!-- Dropdowns using SelectBox -->
      <div class="mt-6 space-y-3 px-3">
        <SelectBox v-model="selectedMarket" :options="marketOptions" />
        <SelectBox v-model="selectedCategory" :options="categoryOptions" />
        <SearchBox v-model="searchQuery" :options="productOptions" />
      </div>
  
      <!-- CTA Button -->
      <div
        class="group mt-6 bg-[#014439] rounded-[25px] px-[90px] py-[20px] space-y-2 flex flex-col items-center text-center text-white transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:rounded-[0px] hover:translate-y-2.5 hover:shadow-xl hover:bg-[#016a50]">
        <span class="text-lg font-semibold">رزرو پروژه جدید</span>
        <p class="animate-pulse-alt text-white/50 text-sm font-normal mt-2">
            شروع دهی از <span class=" text-white underline underline-offset-4">۵</span> روز دیگر
        </p>
        </div>

</div>
  </template>
  
  <script setup>
import TargetIcon from "~/assets/icons/target-icon.svg";
import SelectBox from "@/components/new/SelectBox.vue";
import SearchBox from "@/components/new/SearchBox.vue";
import { ref } from "vue";
const contoursPath = '/images/sections/contours-white.svg';
const isShown = ref(false);
// Dropdown Values
const selectedMarket = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref("");

// Options for SelectBoxes
const marketOptions = [
  { label: "بازار مصرفی", value: "market" },
  { label: "صنعتی", value: "industrial" },
  { label: "کشاورزی", value: "agriculture" },
];

const categoryOptions = [
  { label: "دسته‌بندی ۱", value: "category-1" },
  { label: "دسته‌بندی ۲", value: "category-2" },
  { label: "دسته‌بندی ۳", value: "category-3" },
];

// Searchable Product Options
const productOptions = [
  { label: "محصول ۱", value: "product-1" },
  { label: "محصول ۲", value: "product-2" },
  { label: "محصول ۳", value: "product-3" },
];
</script>

  <style scoped>
  /* Custom styling if needed */
/* Base Styles */
.contours-svg {
  overflow: visible;
  touch-action: manipulation;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.contours-svg rect {
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(1);
  stroke: #FEFDD3;
  transition: transform 1s ease, stroke 1s ease;
}

/* 
  Set base (non-hover/active) transition delays for reverse (exit) animation.
  This makes the innermost rect (child 1) animate last and the outermost (child 6) first when reverting.
*/
.contours-svg rect:nth-child(1) { transition-delay: 0.5s; }
.contours-svg rect:nth-child(2) { transition-delay: 0.4s; }
.contours-svg rect:nth-child(3) { transition-delay: 0.3s; }
.contours-svg rect:nth-child(4) { transition-delay: 0.2s; }
.contours-svg rect:nth-child(5) { transition-delay: 0.1s; }
.contours-svg rect:nth-child(6) { transition-delay: 0s; }

/* 
  Forward animation on hover/active: scale up and change stroke and background color.
  Here, we override the transition delays so that the innermost rect animates first 
  and the outermost last.
*/
.max-w-md.mx-auto:hover .contours-svg,
.max-w-md.mx-auto:active .contours-svg {
  /* background-color: #EAFED3; */
}

.max-w-md.mx-auto:hover .contours-svg rect{
  transform: scale(1.2);

}
.max-w-md.mx-auto:active .contours-svg rect {
  stroke: #00a186;
}

.max-w-md.mx-auto:hover .contours-svg rect:nth-child(1),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(1) { transition-delay: 0s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(2),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(2) { transition-delay: 0.01s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(3),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(3) { transition-delay: 0.02s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(4),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(4) { transition-delay: 0.03s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(5),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(5) { transition-delay: 0.04s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(6),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(6) { transition-delay: 0.05s; }

  </style>
  