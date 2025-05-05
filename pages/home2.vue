<template>
  <!-- Each scene wrapped in a section-snap for ScrollTrigger snapping -->
  <div class="section-snap">
    <SceneHero />
  </div>

  <div class="section-snap lg:px-56">
    <ScenePrinting />
  </div>

  <div class="section-snap">
    <SceneSlider />
  </div>

  <div class="section-snap">
    <!-- <SceneFinalMessage /> -->
  </div>

  <div class="section-snap">
    <SceneFaq />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SceneHero from '~/components/scenes/SceneHero.vue'
import ScenePrinting from '~/components/scenes/ScenePrinting.vue'
import SceneSlider from '~/components/scenes/SceneSlider.vue'
import SceneFinalMessage from '~/components/scenes/SceneFinalMessage.vue'
import SceneFaq from '~/components/scenes/SceneFaq.vue'

gsap.registerPlugin(ScrollTrigger)

definePageMeta({
  name: 'چاپ نجم - خانه',
  layout: 'home',
})

onMounted(async () => {
  // Wait for smoother initialization in layout
  await nextTick()
  // Refresh ScrollTrigger to pick up new sections
  ScrollTrigger.refresh()
})
</script>


<style scoped>


.section-snap {
  min-height: calc(100vh - 64px);
  border: 1px solid rgba(106, 196, 73, 0.752);
}
</style>