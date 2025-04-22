<template>
    <div dir="rtl" class="fixed top-0 z-50 w-full backdrop-blur-sm bg-white/80 flex  p-2 w-full">
      <!-- Mobile View -->
      <div class="md:hidden flex flex-row-reverse w-full transition-all justify-between items-center  z-100">
  <transition name="menu-switch" mode="out-in">
    <!-- OPEN STATE -->
    <div 
      key="open" 
      class="flex flex-row w-full transition-all duration-500 justify-end gap-2 items-center z-100"
    >
      <!-- always keep logo at the very right → give it order-first and no grow/shrink -->
       <div  :class="menuOpen ? 'visible' : 'invisible'" class="absolute bg-white left-0 w-full h-full right-[68px] z-100"></div>
      <Logo 
        
        :menuOpen="menuOpen" 
        class="max-w-0 sm:max-w-28 order-first flex-shrink-0 flex-grow-0" 
      />
      <div         :class="menuOpen ? ' !flex-shrink' : '!flex-grow'" class="transition-all duration-500 mx-0.5"     > </div>

      <!-- profile & language never grow -->
      <ProfileButton 
        :menuOpen="menuOpen" 
        class="flex-shrink-0 flex-grow-0" 
      />
      <LanguageSwitcher 
        :menuOpen="menuOpen" 
        class="flex-shrink-0 flex-grow-0" 
      />
      <div         :class="!menuOpen ? ' !flex-shrink' : '!flex-grow'" class="transition-all duration-500 -mx-1"     > </div>

      <!-- search box flexes only when menu is open -->
      <SearchBox 
        :menuOpen="menuOpen" 
      />

      <!-- hamburger never grows -->
      <HamburgerMenu 
        v-model:menuOpen="menuOpen" 
        class="flex-shrink-0 flex-grow-0" 
      />
    </div>
  </transition>
</div>

      <!-- Desktop View -->
      <nav class="hidden md:flex items-center justify-between w-full">
        <!-- Logo + Title -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <NajmLogo class="h-12 w-12" />
          <span class="text-base text-black">چاپ و بسته‌بندی</span>
          <span class="text-2xl font-bold text-black">نجم</span>
        </NuxtLink>
  
        <!-- Navigation Links + Search Icon -->
        <div class="flex items-center gap-3">
          <NavLinks />
          <div
            @click="openDesktopSearch"
            class="p-3 w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer"
          >
            <SearchIcon class="fill-current text-gray-700 w-6 h-6" />
          </div>
        </div>
      </nav>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { NuxtLink } from '#components'
  import NajmLogo from '~/assets/icons/najm-logo.svg'
  import SearchIcon from '~/assets/icons/search-icon.svg'
  
  // Modular Components
  import Logo from '@/components/atom/Logo.vue'
  import ProfileButton from '@/components/atom/ProfileButton.vue'
  import LanguageSwitcher from '@/components/atom/LanguageSwitcher.vue'
  import SearchBox from '@/components/atom/SearchBox.vue'
  import HamburgerMenu from '@/components/atom/HamburgerMenu.vue'
  import NavLinks from '@/components/atom/NavLinks.vue'
  
  // Menu state
  const menuOpen = ref(false)
  
  function openDesktopSearch() {
    // placeholder for desktop search action
  }
  </script>
  