<template>
  <div class="overflow-hidden">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
})

</script>
