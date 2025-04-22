<template>
  <header
    dir="rtl"
    class="fixed top-0 z-50 w-full backdrop-blur-sm bg-white/80 flex items-center justify-between p-2"
  >
    <!-- Mobile: Logo + Profile + Language + Search + Hamburger -->
    <div v-if="width < 768" class="flex items-center gap-4 w-full">
      <!-- Logo -->
      <NuxtLink to="/" class="flex-shrink-0">
        <NajmLogo class="h-12 w-12" />
      </NuxtLink>

      <!-- Spacer -->
      <div class="flex-1 flex items-center gap-1">
        <!-- Profile / Login -->
        <NuxtLink :to="isAuthenticated ? `/user/${user.id}` : '/login'" class="z-50">
          <button
            @click="handleLogin"
            class="flex items-center gap-3 px-4 h-12 rounded-3xl border border-gray-200 bg-white text-xs font-medium text-gray-700 transition hover:bg-[#A8ABAE]/20 transform"
            :class="menuOpen ? 'right-[28vw]' : ''"
          >
            <profileUserIcon />
            <span>{{ isAuthenticated ? `${user.name} ${user.familyName}` : 'ورود' }}</span>
            <Icon
              name="mdi:chevron-left"
              class="w-5 h-5 text-[#A8ABAE] transition-transform group-hover:-translate-x-2"
            />
          </button>
        </NuxtLink>

        <!-- Language Switch -->
        <div
          class="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-200 bg-white font-bold text-gray-700 cursor-pointer transition hover:bg-gray-300/25 hover:text-gray-900"
          :class="menuOpen ? '!border-0' : ''"
        >
          FA
        </div>

        <!-- Search -->
        <div
          @click="openSearch"
          class="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer transition-[width] duration-300 ease-in-out overflow-hidden"
          :class="menuOpen ? 'xs:w-20 sm:w-24' : 'w-12'"
        >
          <SearchIcon class="w-6 h-6 flex-shrink-0 text-gray-700" />
          <input
            v-show="searchOpen"
            v-model="searchQuery"
            id="mobile-search-input"
            type="text"
            placeholder="جستجو…"
            @click.stop
            @blur="closeSearch"
            class="mr-8 flex-1 bg-transparent outline-none text-gray-800"
          />
        </div>
      </div>

      <!-- Hamburger -->
      <div class="flex items-center">
        <div
          ref="menuContainer"
          @click="toggleMenu"
          class="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-200 bg-white cursor-pointer transition hover:bg-gray-300/25 hover:text-gray-900"
        >
          <Drawer v-model:open="menuOpen">
            <Menu @click="handleWrapperClick" />
          </Drawer>
        </div>
      </div>
    </div>

    <!-- Desktop Navigation -->
    <nav
      v-else
      class="hidden md:flex items-center justify-between w-full"
    >
      <!-- Logo + Title -->
      <NuxtLink to="/" class="flex items-center gap-3">
        <NajmLogo class="h-12 w-12" />
        <span class="text-base text-black">چاپ و بسته‌بندی</span>
        <span class="text-2xl font-bold text-black">نجم</span>
      </NuxtLink>

      <!-- Menu Links + Search -->
      <div class="flex items-center gap-3">
        <ul class="flex ml-4 gap-6 text-sm font-medium text-black/70">
          <template v-for="section in sections" :key="section.name">
            <li v-for="child in section.children" :key="child.slug">
              <NuxtLink :to="child.slug">{{ child.name }}</NuxtLink>
            </li>
          </template>
        </ul>
        <div
          @click="openSearch"
          class="flex items-center justify-center w-12 h-12 rounded-2xl border bg-white cursor-pointer transition hover:bg-gray-300/25 hover:text-gray-900"
        >
          <SearchIcon class="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWindowSize, useScrollLock } from '@vueuse/core'
import { useAuth } from '~/composables/useAuth'
import { useMenuUIData } from '@/composables/ui/menuUI'

import NajmLogo from '~/assets/icons/najm-logo.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'
import profileUserIcon from '~/assets/icons/profile-user-icon.svg'
import Drawer from '@/components/Drawer.vue'

// Auth
const { user, isAuthenticated } = useAuth()

// Responsive
const { width } = useWindowSize()

// Menu UI data
const { menuUIData } = useMenuUIData()
const sections = computed(() => [menuUIData.value.links, menuUIData.value.contact])

// Search
const searchOpen = ref(false)
const searchQuery = ref('')
function openSearch() {
  searchOpen.value = true
  nextTick(() => {
    document.getElementById('mobile-search-input')?.focus()
  })
}
function closeSearch() {
  searchOpen.value = false
}

// Hamburger Menu
const menuOpen = ref(false)
const menuContainer = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(menuContainer)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
  isLocked.value = menuOpen.value
}
function handleWrapperClick(event: MouseEvent) {
  if (!event.target || (event.target as HTMLElement).closest('a')) return
  event.stopPropagation()
}

// Close when clicking outside drawer
function handleClickOutside(event: MouseEvent) {
  const drawerEl = document.querySelector('.drawer-container')
  if (
    menuOpen.value &&
    drawerEl &&
    !drawerEl.contains(event.target as Node) &&
    menuContainer.value &&
    !menuContainer.value.contains(event.target as Node)
  ) {
    menuOpen.value = false
    isLocked.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
