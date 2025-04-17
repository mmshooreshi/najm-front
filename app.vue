<template>
  <div class="overflow-hidden">
    <NuxtLayout>
      <div class="page-stack">
      <NuxtPage :transition="pageTransition" />
    </div>

    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
// import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed } from 'vue'
import { useNavDirection } from '~/composables/useNavDirection'
const dir = useNavDirection()

onMounted(() => {
  useGSAP().registerPlugin(ScrollTrigger)
})
const pageTransition = computed(() => ({
  name: dir.value === 'back' ? 'slide-fwd' : 'slide-back',
  mode: 'out-in'
}))

</script>

<style>
.page-stack{
  position:relative;
  overflow:visible;
  height:100%; 
}

</style>

