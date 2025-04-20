<!-- Header.vue -->
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
        
                  <div v-if="isAuthenticated" class="floating-badge">
                  <router-link :to="`/user/${user.id}`" class="badge-link">
                    <div class="badge">{{user.name}} {{user.familyName}}</div> <!-- You can customize this to display user initials or avatar -->
                  </router-link>
                </div>
                <div v-else>
                    <NuxtLink to="/login" class="ml-0 flex items-center gap-3">
                      <button @click="handleLogin" class="text-xs text-d4 px-3 h-12 rounded-2xl bg-white flex flex-col items-center justify-center text-gray-700 font-bold   border border-gray-200 transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
                        ورود / ثبت نام
                      </button>
                    </NuxtLink>
            
                </div>
      <!-- Language Switch -->
      <div 
        class="w-12 h-12 rounded-2xl bg-white flex flex-col items-center justify-center text-gray-700 font-bold   border border-gray-200
               transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
        <span class="block">FA</span>
      </div>


      <!-- Search Button -->
      <!-- Sliding Search Container -->
      <div
        @click="openSearch"
        class="relative flex items-center overflow-hidden 
               bg-white border border-gray-200 rounded-2xl
               transition-[width] duration-300 ease-in-out cursor-pointer  p-3"
        :class="searchOpen ? 'w-44' : 'w-12'"
      >
        <!-- Icon stays put -->
        <SearchIcon class="fill-current text-gray-700 flex-shrink-0 w-6 h-6"  :class="searchOpen ? '' : ''" />

        <!-- Input slides in -->
        <input
          v-show="searchOpen"
          v-model="searchQuery"
          id="mobile-search-input"
          type="text"
          placeholder="جستجو…"
          class="mr-8 grow bg-transparent outline-none text-gray-800"
          @click.stop
          @blur="closeSearch"

        />
      </div>

      <!-- Hamburger Menu -->
   

      <div 
        @click="toggleMenu" 
        class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center   border border-gray-200
               transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
        <!-- <HamburgerIcon class="fill-current text-gray-700" /> -->
        <Drawer v-model:open="menuOpen">
            <ul class="space-y-0 rtl:text-right p-0">
              <li class="hover:pl-0 transition-all rounded-lg flex justify-between items-center px-2 pl-6 py-3"><NuxtLink to="/">خانه</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li class="hover:pl-0 transition-all rounded-lg flex justify-between items-center px-2 pl-6 py-3"><NuxtLink to="/products">محصولات</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li class="hover:pl-0 transition-all rounded-lg flex justify-between items-center px-2 pl-6 py-3"><NuxtLink to="/about">درباره ما</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li class="hover:pl-0 transition-all rounded-lg flex justify-between items-center px-2 pl-6 py-3"><NuxtLink to="/contact">تماس با ما</NuxtLink><Icon name="mdi:arrow-left"/></li>
            </ul>
          </Drawer>


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
          <!-- <div 
            class="flex items-center gap-x-3 h-12 py-3 px-6 p-2 rounded-xl border border-1 border-black/10 
                   transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
              <UserIcon class="text-gray-700" />
              <span class="text-black text-sm">محمدمهدی</span>
              <BottomArrowIcon class="text-gray-500" />
          </div> -->

          <!-- Hamburger Icon -->
          <!-- <div 
            @click="toggleMenu" 
            class="p-3 w-12 h-12 rounded-2xl bg-white flex items-center justify-center 
                   transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer">
            <HamburgerIcon class="fill-current text-gray-700" />
          </div> -->

          <ul class="flex flex-row ml-4 gap-6 text-sm text-black/70 font-medium">
              <li><NuxtLink to="/">کاتالوگ</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li><NuxtLink to="/products">فایل‌های راهنما</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li><NuxtLink to="/about">درباره ما</NuxtLink><Icon name="mdi:arrow-left"/></li>
              <li><NuxtLink to="/contact">تماس با ما</NuxtLink><Icon name="mdi:arrow-left"/></li>
            </ul>


          <!-- Search Icon -->
          <div 
            class="p-3 w-12 h-12 rounded-2xl border  flex items-center justify-center 
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
import Drawer from "@/components/Drawer.vue";
import { useAuth } from '~/composables/useAuth'  // Import the useAuth composable to check if the user is authenticated

const { token, user, isAuthenticated } = useAuth()  // Destructure the token and user data from useAuth

const { width } = useWindowSize();
const searchOpen = ref(false);
const searchQuery = ref("");

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}



 function openSearch() {
  searchOpen.value = true
  nextTick(() => {
    const el = document.getElementById('mobile-search-input') as HTMLInputElement | null
    el?.focus()
  })
}
// close on blur
function closeSearch() {
  searchOpen.value = false
}

</script>


<style scoped>


button,
a,
[role="button"],
[tabindex],
input,
textarea,
select,
label,
* {
    -webkit-tap-highlight-color: transparent;
}


* {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.floating-badge {
  position: fixed;
  bottom: 20px;
  right: 80px;
  z-index: 1000;
}

</style>