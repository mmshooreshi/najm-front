<!-- components/HeaderPrev.vue -->
<template>
      <header dir="rtl" class="sticky top-0 z-50 flex items-center justify-between p-2 bg-white/80  backdrop-blur-sm  w-full">
      <!-- Right: Logo + Hamburger -->
      <div v-if="width < 768" class="flex flex-row items-center gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex justify-center">
          <NajmLogo class="h-12 w-12" />
        </NuxtLink>
      </div>
  
      <!-- Left: Language + Search -->
      <div v-if="width < 768" class="flex flex-row items-center gap-1">
        <!-- Language Switch -->
        <div 
          class="w-12 h-12 rounded-2xl bg-white flex flex-col items-center justify-center text-gray-700 font-bold   border border-gray-200
                 transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
          <span class="block">FA</span>
        </div>
        <!-- Search Button -->
        <div 
          class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center   border border-gray-200
                 transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
          <SearchIcon class="fill-current text-gray-700" />
        </div>
        <!-- Hamburger Menu -->
        <div 
          @click="toggleMenu" 
          class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center   border border-gray-200
                 transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
          <HamburgerIcon class="fill-current text-gray-700" />
        </div>

      </div>

      <!-- Desktop Navigation (>= 768px) -->
      <nav v-if="width >= 768" class="flex items-center justify-between w-full">
        <!-- Right Side: Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
            <NajmLogo class="h-12 w-12" />
            <span><span class="text-base text-black">چاپ و بسته‌بندی </span><span class="text-black text-2xl">نجم</span></span>
        </NuxtLink>

        <!-- Left Side: Profile + Hamburger + Search -->
        <div class="flex items-center gap-3">
            <!-- Profile Icon + Dropdown Arrow -->
            <div 
              class="flex items-center gap-x-3 h-12 py-3 px-6 p-2 rounded-xl border border-1 border-black/10 
                     transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
                <UserIcon class="text-gray-700" />
                <span class="text-black text-sm">محمدمهدی</span>
                <BottomArrowIcon class="text-gray-500" />
            </div>

            <!-- Hamburger Icon -->
            <div 
              @click="toggleMenu" 
              class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center 
                     transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
              <HamburgerIcon class="fill-current text-gray-700" />
            </div>

            <!-- Search Icon -->
            <div 
              class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center 
                     transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
              <SearchIcon class="fill-current text-gray-700" />
            </div>
        </div>
      </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";

// Import SVGs as Vue components
import NajmLogo from "~/assets/icons/najm-logo.svg";
import HamburgerIcon from "~/assets/icons/hamburger-icon.svg";
import SearchIcon from "~/assets/icons/search-icon.svg";
import UserIcon from "~/assets/icons/user-icon.svg";
import BottomArrowIcon from "~/assets/icons/bottom-arrow-icon.svg";

const { width } = useWindowSize();
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>
