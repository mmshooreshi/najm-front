<template>
  <!-- backdrop-blur -->
  <div dir="rtl" class="fixed top-0 z-50 w-full  bg-white bg-opacity-100  flex  p-2 w-full">
    <!-- Mobile View -->
    <div class=" flex flex-row-reverse w-full transition-all justify-between items-center  z-100">
<transition name="menu-switch" mode="out-in">
  <!-- OPEN STATE -->
  <div 
    key="open" 
    class="flex flex-row w-full transition-all duration-500 justify-end gap-2 items-center z-100"
  >
    <!-- always keep logo at the very right → give it order-first and no grow/shrink -->
    <Logo 
      
      :menuOpen="menuOpen" 
      class="max-w-0 sm:max-w-28 order-first flex-shrink-0 flex-grow-0" 
    />
    <div         :class="menuOpen ? ' !flex-shrink' : '!flex-grow'" class="transition-all duration-500 mx-0.5"     > </div>

    <NavLinks  :class="menuOpen ? 'w-0 -mx-4' : 'mx-0 max-w-98'"   class="transition-all duration-500 text-nowrap overflow-hidden" v-if="isDesktop"/>

  <!-- Profile Button with blur transition -->
  <transition name="blur">
    <ProfileButton 
    v-if="!searchIsOpen && (menuOpen || !isSmall)"
      :menuOpen="menuOpen" 
      class="flex-shrink-0 flex-grow-0" 
    />
  </transition>

  <!-- Language Switcher with blur transition -->
  <transition name="blur">
    <!-- <LanguageSwitcher 
      v-if="!searchIsOpen && (menuOpen || !isSmall)"

      :menuOpen="menuOpen" 
      class="flex-shrink-0 flex-grow-0" 
    /> -->

    <LanguageSwitcher
    v-if="!searchIsOpen && (menuOpen || !isSmall)"
    v-model="language"
    class="flex-shrink-0 flex-grow-0"
  />

  </transition>
    <div     :class="!menuOpen ? '!flex-shrink' : '!flex-grow'" class=" -mx-1 duration-500 transition-all"     > </div>

    <!-- search box flexes only when menu is open -->
    <SearchBox 
       @update:searchOpen="searchIsOpen = $event" 
      :menuOpen="menuOpen" 
       :class="searchIsOpen ? ' z-100' : ''" 

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
import { useLocale } from '~/composables/useLocale'

const { language } = useLocale()

// Tailwind “md” breakpoint is 768px:
const isDesktop = useMediaQuery('(min-width: 768px)')
const isSmall = useMediaQuery('(max-width: 400px)')
const searchIsOpen = ref(false)
// Menu state
const menuOpen = ref(false)

function openDesktopSearch() {
  // placeholder for desktop search action
}
</script>




<style scoped>
/* 1) Duration & easing of the transition */
.blur-enter-active, .blur-leave-active {
  transition: filter 0.1s ease, opacity 0.1s ease;
}

/* 2) Initial state when component is inserted, or after removal */
.blur-enter-from, .blur-leave-to {
  filter: blur(10px);
  opacity: 0;
}

/* 3) Final state once the transition finishes */
.blur-enter-to, .blur-leave-from {
  filter: blur(0);
  opacity: 1;
}
</style>
