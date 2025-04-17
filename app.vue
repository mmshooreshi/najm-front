<template>
  <div class="overflow-hidden">
    <NuxtLayout >
      <NuxtPage/>
      </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

onMounted(() => {
  useGSAP().registerPlugin(ScrollTrigger)
})
</script>
