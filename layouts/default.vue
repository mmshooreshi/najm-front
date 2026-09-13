<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen w-full relative">
    <!-- Background -->
    <BackgroundGradient />

    <!-- Fixed Header -->
    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />

    <!-- Page Wrapper -->
    <div class="bg-najmback w-full overflow-x-clip touch-pan-y min-h-screen pt-16 flex flex-col justify-between">
      <main class="w-full overflow-x-clip mx-auto flex-grow">
        <slot />
      </main>
      <Footer2 />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Footer2 from '~/components/Footer2.vue'
import { useMenu } from '~/composables/useMenu'

const { isMenuOpen: menuOpen } = useMenu()

onMounted(() => {
  useHead({
    bodyAttrs: {
      class: 'debugg'
    }
  })
})
</script>
