<script setup lang="ts">
import { ref } from 'vue'

import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Footer2 from '~/components/Footer2.vue'

const menuOpen = ref(false)
</script>
<template>
  <!-- Background -->
  <BackgroundGradient />

  <!-- Fixed Header -->
  <Header
    :menu-open="menuOpen"
    @update:menu-open="menuOpen = $event"
    class="fixed  top-0 left-0 w-full z-50"
  />

  <!-- Page Wrapper -->
  <div class="bg-white bg-[#e4eaeb] w-full overflow-hidden min-h-screen pt-16">
    <main class="w-full max-w-screen-xl  mx-auto">
      <slot />
    </main>
    <Footer2 />
  </div>

</template>
