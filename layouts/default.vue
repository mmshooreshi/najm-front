<!-- layouts/default.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import FooterLayout from '~/components/FooterLayout.vue'
import Footer2 from '~/components/Footer2.vue'
const menuOpen = ref(false)
</script>

<template>
  <BackgroundGradient/>

  <!-- Pass menuOpen + listener down to Header -->
  <Header  class=""
    :menu-open="menuOpen"
    @update:menu-open="menuOpen = $event"
  />

  <!-- Now lock overflow here, not on body -->
  <div
    :class="[
      'relative h-screen prevent-select snap-y snap-mandatory overflow-x-visible pt-16 top-16 ',
      menuOpen ? 'overflow-y-hidden' : 'overflow-y-auto'
    ]"
  >
    <!-- <div class="snap-start py-8 px-4 md:px-8 2xl:px-28"> -->
    <div class="snap-start py-0 px-4 md:px-8 2xl:px-28">
      <slot/>
    </div>
    <div class="snap-start">
      <!-- <FooterLayout/> -->
      <Footer2/>
    </div>
  </div>
</template>
