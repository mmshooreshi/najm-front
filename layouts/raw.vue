<!-- layouts/raw.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'

const menuOpen = ref(false)

onMounted(() => {
  useHead({
    bodyAttrs: {
      class: 'antialiased text-gray-900 bg-white',
    },
  })
})
</script>

<template>
  <!-- full-screen flex container -->
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- background layer -->
    <BackgroundGradient class="absolute inset-0 -z-10" />

    <!-- header (fixed height) -->
    <header class="flex-shrink-0">
      <Header
        :menu-open="menuOpen"
        @update:menu-open="menuOpen = $event"
        class="w-full bg-white/80 backdrop-blur border-b border-gray-200"
      />
    </header>

        <div class="h-16 shrink-0"></div>

    <!-- main content fills remaining space, no scroll on page -->
    <main class="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 lg:px-8 pt-6">
      <slot />
    </main>
  </div>
</template>
