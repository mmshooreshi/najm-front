<template>
  <div class="overflow-visible">
    <NuxtLayout >

      <NuxtPage :page-key="route.name" />

      </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const route = useRoute()
onMounted(() => {
  useGSAP().registerPlugin(ScrollTrigger)
})
</script>


<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}</style>