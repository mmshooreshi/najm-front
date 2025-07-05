<!-- components/Main/NavBar.vue -->
<template>
    <nav
      dir="ltr"
      class="flex items-center justify-between w-full bg-white px-0 py-4"
    >
      <!-- Left group: Search + Links -->
      <div class="flex items-center space-x-8">
        <!-- Search button -->
        <button
          @click="onSearchToggle"
          type="button"
          class="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          aria-label="جستجو"
        >
          <slot name="search-icon">
            <!-- default Heroicon: magnifying-glass -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/>
            </svg>
          </slot>
        </button>
  
        <!-- Nav links -->
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium text-gray-500 hover:text-gray-700 transition"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
  
      <!-- Right group: Category Dropdown, Services, Hamburger -->
      <div class="flex items-center space-x-4">
        <!-- Category Dropdown -->
        <div
          ref="dropdown"
          class="relative"
        >
          <button
            @click="onDropdownToggle"
            type="button"
            class="flex items-center h-10 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            aria-haspopup="true"
            :aria-expanded="isDropdownOpen"
          >
            <slot name="dropdown-label">دسته‌بندی</slot>
            <slot name="dropdown-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 ml-2 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 7l5 5 5-5H5z" />
              </svg>
            </slot>
          </button>
  
          <ul
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-sm z-10 overflow-hidden"
          >
            <li
              v-for="(cat, i) in categories"
              :key="i"
            >
              <button
                @click="selectCategory(cat)"
                type="button"
                class="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                {{ cat }}
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Services button -->
        <button
        type="button"
        class="px-4 w-full h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        aria-label="خدمات">
        <NuxtLink
          to="/services"
          class="text-sm font-medium text-gray-700"
        >
          خدمات
        </NuxtLink>
    </button>
        <!-- Hamburger -->
        <button
          @click="onMobileToggle"
          type="button"
          class="w-full px-2 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          aria-label="بازکردن منو"
        >
          <slot name="mobile-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </slot>
        </button>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter, useLink } from 'vue-router'
  
  /** Your nav links */
  const links = [
    { label: 'کاتالوگ',        href: '/catalog' },
    { label: 'فایل‌های راهنما', href: '/docs'    },
    { label: 'درباره ما',      href: '/about'   },
    { label: 'تماس با ما',     href: '/contact' },
  ]
  
  /** Your dropdown items */
  const categories = ['محصولات', 'خدمات', 'راهنما', 'سوالات متداول']
  
  /** Local state */
  const isDropdownOpen = ref(false)
  const dropdown = ref<HTMLElement | null>(null)
  
  function onDropdownToggle() {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  function selectCategory(cat: string) {
    isDropdownOpen.value = false
    // emit or handle selection...
    console.log('Selected:', cat)
  }
  
  /** Click‑outside to close dropdown */
  function onClickOutside(e: MouseEvent) {
    if (dropdown.value && !dropdown.value.contains(e.target as Node)) {
      isDropdownOpen.value = false
    }
  }
  onMounted(() => document.addEventListener('click', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
  
  /** stubs for search & mobile toggles */
  const isSearchOpen = ref(false)
  function onSearchToggle() {
    isSearchOpen.value = !isSearchOpen.value
  }
  const isMobileOpen = ref(false)
  function onMobileToggle() {
    isMobileOpen.value = !isMobileOpen.value
  }
  </script>
  