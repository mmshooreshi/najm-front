<!-- layouts/dash.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-[#070D0C] text-zinc-100 font-sans flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
    <!-- Desktop & Mobile Sidebar -->
    <DashSidebar
      :is-mobile-open="isMobileMenuOpen"
      :is-mobile="isMobile"
      @close-mobile="isMobileMenuOpen = false"
    />

    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileMenuOpen"
      @click="isMobileMenuOpen = false"
      class="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity"
    ></div>

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
      <!-- Header -->
      <DashHeader @open-mobile="isMobileMenuOpen = true" />

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        <slot />
      </main>
    </div>

    <!-- Floating Mobile Bottom Navigation -->
    <DashMobileNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DashSidebar from '~/components/dash/DashSidebar.vue'
import DashHeader from '~/components/dash/DashHeader.vue'
import DashMobileNav from '~/components/dash/DashMobileNav.vue'

const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
    if (!isMobile.value) isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
  }
})
</script>

<style>
/* Custom subtle scrollbar for dashboard */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
