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
  <div class="px-8 mt-20">


  <slot/>

    <div class="">
      <!-- <FooterLayout/> -->
    </div>
  </div>
</template>
