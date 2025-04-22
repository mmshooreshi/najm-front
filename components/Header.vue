<template>
  <div dir="rtl" class="fixed top-0 z-50 w-full backdrop-blur-sm bg-white/80 flex  p-2 w-full">
    <!-- Mobile View -->
    <div class=" flex flex-row-reverse w-full transition-all justify-between items-center  z-100">
<transition name="menu-switch" mode="out-in">
  <!-- OPEN STATE -->
  <div 
    key="open" 
    class="flex flex-row w-full transition-all duration-500 justify-end gap-2 items-center z-100"
  >
    <!-- always keep logo at the very right → give it order-first and no grow/shrink -->
     <div  :class="menuOpen ? 'visible' : 'invisible'" class="absolute bg-white left-0 w-full h-full right-[68px] md: z-100 transition-all "></div>
    <Logo 
      
      :menuOpen="menuOpen" 
      class="max-w-0 sm:max-w-28 order-first flex-shrink-0 flex-grow-0" 
    />
    <div         :class="menuOpen ? ' !flex-shrink' : '!flex-grow'" class="transition-all duration-500 mx-0.5"     > </div>

    <NavLinks  :class="menuOpen ? 'w-0 -mx-4' : 'mx-0 max-w-98'"   class="transition-all duration-500 text-nowrap overflow-hidden" v-if="isDesktop"/>

    <!-- profile & language never grow -->
    <ProfileButton 
      :menuOpen="menuOpen" 
      class="flex-shrink-0 flex-grow-0" 
    />


    <LanguageSwitcher 
      :menuOpen="menuOpen" 
      class="flex-shrink-0 flex-grow-0" 
    />
    <div     :class="!menuOpen ? '!flex-shrink' : '!flex-grow'" class="transition-all duration-500 -mx-1"     > </div>

    <!-- search box flexes only when menu is open -->
    <SearchBox 
      :menuOpen="menuOpen" 
      v-if="!isSmall"
      class="" 

    />

    <!-- hamburger never grows -->
    <HamburgerMenu 
      v-model:menuOpen="menuOpen" 
      class="flex-shrink-0 flex-grow-0" 
    />
  </div>
</transition>
</div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NuxtLink } from '#components'
import NajmLogo from '~/assets/icons/najm-logo.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'

// Modular Components
import Logo from '~/components/atom/logo.vue'
import ProfileButton from '@/components/atom/ProfileButton.vue'
import LanguageSwitcher from '@/components/atom/LanguageSwitcher.vue'
import SearchBox from '@/components/atom/SearchBox.vue'
import HamburgerMenu from '@/components/atom/HamburgerMenu.vue'
import NavLinks from '@/components/atom/NavLinks.vue'
import { useMediaQuery } from '@vueuse/core'

// Tailwind “md” breakpoint is 768px:
const isDesktop = useMediaQuery('(min-width: 768px)')
const isSmall = useMediaQuery('(max-width: 380px)')

// Menu state
const menuOpen = ref(false)

function openDesktopSearch() {
  // placeholder for desktop search action
}
</script>
