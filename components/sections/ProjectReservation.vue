<template>

<div class="max-w-md mx-auto  relative inset-x-0 top-15 z-1" dir="rtl">
        <svg class="w-full" viewBox="0 0 343 115" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M290 0C283.032 0 276.54 2.03601 271.086 5.54554C254.831 16.0054 239.33 35 220 35H35C15.67 35 0 50.67 0 70V114C0 114.552 0.447712 115 0.999997 115H342C342.552 115 343 114.552 343 114V35C343 15.67 327.33 0 308 0H290Z" 
            fill="white" />
        </svg>
        <div class="z-2 w-10 h-10 bg-[#EAFED3] flex items-center justify-center rounded-full top-4 right-4 mr-5 right-0 absolute" dir="rtl">
            <TargetIcon />
        </div>

    </div>




    <div class="relative max-w-md mx-auto px-3 pt-6 pb-3 bg-white rounded-[35px] shadow-lg prevent-select overflow-hidden"
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
  </style>
  