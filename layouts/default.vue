<!-- layouts/default.vue -->
<!-- ./najm-front/layouts/default.vue -->
<script setup lang="ts">
import { ref } from 'vue'

import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Footer2 from '~/components/Footer2.vue'

const menuOpen = ref(false)

onMounted(async () => {
    useHead({
    bodyAttrs: {
      class: 'debugg'
    }
  })
})
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
  <div class="bg-najmback w-full overflow-visible touch-pan-y  bg-blue min-h-screen pt-16 ">
    <main class="w-full  overflow-visible  mx-auto ">
      <slot />
    </main>
    <Footer2 />
  </div>

</template>
