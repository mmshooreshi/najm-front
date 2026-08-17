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
    <div class="bg-najmback w-full overflow-visible touch-pan-y min-h-screen pt-16">
      <main class="w-full overflow-visible mx-auto">
        <slot />
      </main>
      <Footer2 />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Footer2 from '~/components/Footer2.vue'

const menuOpen = ref(false)

onMounted(() => {
  useHead({
    bodyAttrs: {
      class: 'debugg'
    }
  })
})
</script>
