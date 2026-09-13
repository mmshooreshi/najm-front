<!-- components/Header.vue -->
<template>
  <header
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed top-0 z-50 w-full transition-transform duration-300"
    :class="direction === 'down' && !menuOpen && !searchIsOpen ? '-translate-y-full' : 'translate-y-0'"
  >
    <!-- Header Bar -->
    <div class="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between transition-all duration-300">

      <!-- Start Side: Brand Logo -->
      <div class="flex items-center flex-shrink-0">
        <Logo :menuOpen="menuOpen" class="w-24 sm:w-28 flex-shrink-0" />
      </div>

      <!-- Center: Adaptive Desktop Navigation (4 items on lg, 5 items on xl) -->
      <div class="hidden lg:flex items-center justify-center flex-1 px-4 max-w-2xl transition-all duration-300">
        <NavLinks v-if="!searchIsOpen" />
      </div>

      <!-- End Side: Action Cluster (Profile, Language, Search, Hamburger) -->
      <div class="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-shrink-0">
        <!-- Profile CTA: strictly hidden on low-width / mobile screens when sidebar is closed -->
        <div
          v-if="!searchIsOpen && (isDesktop || menuOpen)"
          class="flex-shrink-0"
          :class="menuOpen ? 'flex' : 'hidden lg:flex'"
        >
          <ProfileButton :menuOpen="menuOpen" />
        </div>

        <!-- Language Switcher (hidden on mobile, visible on sm+) -->
        <LanguageSwitcher
          v-if="!searchIsOpen"
          v-model="language"
          class="hidden sm:flex flex-shrink-0"
        />

        <!-- Search Box -->
        <SearchBox
          @update:searchOpen="searchIsOpen = $event"
          :menuOpen="menuOpen"
          class="relative z-[100] flex-shrink-0"
        />

        <!-- Hamburger Menu Trigger -->
        <HamburgerMenu
          v-model:menuOpen="menuOpen"
          class="flex-shrink-0"
        />
      </div>

    </div>

    <!-- Slide-over Drawer / Sidebar -->
    <Drawer v-model:open="menuOpen" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useScrollDirection } from '~/composables/useScrollDirection'
import Logo from '~/components/atom/logo.vue'
import ProfileButton from '@/components/atom/ProfileButton.vue'
import LanguageSwitcher from '@/components/atom/LanguageSwitcher.vue'
import SearchBox from '@/components/atom/SearchBox.vue'
import HamburgerMenu from '@/components/atom/HamburgerMenu.vue'
import NavLinks from '@/components/atom/NavLinks.vue'
import Drawer from '@/components/Drawer.vue'
import { useLocale } from '~/composables/useLocale'

const { language } = useLocale()
const isRTL = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  return l === 'FA' || l === 'AR'
})
const { direction } = useScrollDirection()
const isDesktop = useMediaQuery('(min-width: 1024px)')

const props = withDefaults(
  defineProps<{
    topLabel?: any
    menuOpen?: boolean
  }>(),
  {
    menuOpen: false
  }
)

const emit = defineEmits<{
  (e: 'update:menuOpen', value: boolean): void
}>()

const searchIsOpen = ref(false)

const menuOpen = computed({
  get: () => props.menuOpen,
  set: (val: boolean) => emit('update:menuOpen', val)
})
</script>
