<template>
    <div class="relative w-full">
      <!-- Search Input Field -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جست‌وجوی محصول"
          class="w-full p-4 pl-12 border border-gray-300 rounded-[15px] text-[12px] font-semibold placeholder:text-[#626262] placeholder:font-medium hover:shadow-md focus:border-[#014439] focus:ring-2 focus:ring-[#014439] transition-all"          @focus="isFocused = true"
          @input="filterResults"
          @blur="handleBlur"
          ref="searchInput"
        />
        <!-- Magnifier Icon -->
        <span class="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500">
          <MagnifierIcon />
        </span>
      </div>
  
      <!-- Search Dropdown (Only Show When Focused) -->
      <div
        v-show="isFocused && searchResults.length"
        class="absolute w-full mt-2 bg-white border border-[#014439] rounded-lg shadow-xl overflow-hidden z-50"
        ref="dropdown"
      >
        <ul class="max-h-60 overflow-y-auto">
          <li
            v-for="(result, index) in searchResults"
            :key="index"
            @click="selectSearchResult(result)"
            class="px-4 py-3 cursor-pointer transition-all hover:bg-[#014439]/100 hover:text-white"
          >
            {{ result }}
          </li>
        </ul>
      </div>
      
    </div>
  </template>
  

  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import gsap from "gsap";
  import MagnifierIcon from "~/assets/icons/magnifier-icon.svg";
  
  const searchQuery = ref("");
  const searchResults = ref([]);
  const isFocused = ref(false);
  const searchInput = ref(null);
  const dropdown = ref(null);
  
  // Dummy Product Data for Search
  const allProducts = ["محصول ۱", "محصول ۲", "محصول ۳", "محصول ۴", "محصول ۵"];
  
  const filterResults = () => {
    searchResults.value = allProducts.filter((product) =>
      product.includes(searchQuery.value)
    );
  };
  
  const selectSearchResult = (result) => {
    searchQuery.value = result;
    searchResults.value = [];
    isFocused.value = false;
  };
  
  // Handle Blur (Adds Short Delay to Allow Click on Dropdown)
  const handleBlur = () => {
    setTimeout(() => {
      isFocused.value = false;
    }, 200);
  };
  
  // Close Dropdown if Clicked Outside
  const handleClickOutside = (event) => {
    if (
      searchInput.value &&
      !searchInput.value.contains(event.target) &&
      dropdown.value &&
      !dropdown.value.contains(event.target)
    ) {
      isFocused.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  </script>
  