<template>
  <div
    id="smooth-content"
    class="overflow-y-scroll h-screen snap-y snap-mandatory scroll-smooth touch-pan-y border border-black"
  >
    <!-- Hero Section -->
    <section
      id="scene-hero"
      class="snap-start h-screen flex items-center justify-center border border-black"
    >
      <SceneHero />
    </section>

    <!-- Printing Section -->
    <section
      id="scene-printing"
      class="snap-start h-screen flex items-center justify-center lg:px-56 border border-black"
    >
      <ScenePrinting />
    </section>

    <!-- Slider Section -->
    <section
      id="scene-slider"
      class="snap-start h-screen flex items-center justify-center border border-black"
    >
      <SceneSlider />
    </section>

    <!-- Final Message Section -->
    <section
      id="scene-final"
      class="snap-start h-screen flex items-center justify-center border border-black"
    >
      <SceneFinalMessage />
    </section>

    <!-- FAQ Section -->
    <section
      id="scene-faq"
      class="snap-start h-screen flex items-center justify-center px-4 border border-black"
    >
      <SceneFaq />
    </section>

    <!-- Floating Image Component -->
    <div id="imagez-wrapper" class="fixed inset-0 pointer-events-none" border border-black>
      <!-- <Imagez /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneHero from '~/components/scenes/SceneHero.vue'
import ScenePrinting from '~/components/scenes/ScenePrinting.vue'
import SceneSlider from '~/components/scenes/SceneSlider.vue'
import SceneFinalMessage from '~/components/scenes/SceneFinalMessage.vue'
import SceneFaq from '~/components/scenes/SceneFaq.vue'
import Imagez from '@/components/imagez.vue'

definePageMeta({
  name: 'چاپ نجم - خانه',
  layout: 'home',
})
</script>

<style scoped>
/* Fallbacks if Tailwind classes aren’t enough */
.scroll-snap-y {
  scroll-snap-type: y mandatory;
}
.scroll-smooth {
  scroll-behavior: smooth;
}
section.snap-start {
  scroll-snap-align: start;
}
</style>
