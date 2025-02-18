<template>
    <div class="max-w-md mx-auto px-3 pt-6 pb-3 bg-white rounded-[35px] shadow-lg prevent-select overflow-hidden" dir="rtl">
      <div class="px-3">
        <!-- Header Section -->
        <div class="w-10 h-10 bg-[#EAFED3] flex items-center justify-center rounded-full mb-6">
            <TargetIcon />
        </div>
    
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
  