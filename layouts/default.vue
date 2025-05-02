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
  <!-- snap-y snap-mandatory -->
  <div class="relative prevent-select overflow-x-visible pt-8 top-16 bg-[#e4eaeb]">
    <!-- <div class="snap-start py-8 px-4 md:px-8 2xl:px-28"> -->
    <div class=" py-0 px-4 md:px-8 2xl:px-28">
      <slot/>
    </div>
    <div class="">
      <!-- <FooterLayout/> -->
      <Footer2/>
    </div>
  </div>
</template>
