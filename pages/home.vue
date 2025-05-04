<template>
  <!-- bg-[#FFEBEE] -->
   <div class="">
    <div id="scene-hero" class=" scene-full ">
      <SceneHero />
    </div>
    <div id="scene-printing" class="bg-[#E3F2FD] scene-full">
      <ScenePrinting />
      <SceneAccordionLayout />
    </div>
    <!-- <div id="scene-boxes" class="bg-[#FFF8E1] scene-full"> -->
      <!-- <SceneBoxes /> -->
    <!-- </div> -->
    <!-- <div id="scene-nccc" class="bg-[#F3E5F5] scene-full">
      <SceneNccc />
    </div> -->
    <!-- <div id="scene-promo" class="bg-[#FBE9E7] scene-full">
      <ScenePromo />
    </div> -->
    <div id="scene-slider" class="bg-[#E0F7FA] scene-full">
      <SceneSlider />
    </div>
    <div id="scene-final" class="bg-[#FFF3E0] scene-full">
      <SceneFinalMessage />
    </div>
    <div id="scene-faq" class="bg-[#EDE7F6] scene-full">
      <SceneFaq />
    </div>

    <div id="imagez-wrapper">
      <Imagez />
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneHero from '~/components/scenes/SceneHero.vue'

import ScenePrinting from '~/components/scenes/ScenePrinting.vue'
import SceneAccordionLayout from '~/components/scenes/SceneAccordionLayout.vue'
// import SceneBoxes from '~/components/scenes/SceneBoxes.vue'
import SceneNccc from '~/components/scenes/SceneNccc.vue'
import ScenePromo from '~/components/scenes/ScenePromo.vue'
import SceneSlider from '~/components/scenes/SceneSlider.vue'
import SceneFinalMessage from '~/components/scenes/SceneFinalMessage.vue'
import SceneFaq from '~/components/scenes/SceneFaq.vue'
import Imagez from '@/components/imagez.vue'
</script>

<style scoped>
.scene-full {
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertically center */
  align-items: center;     /* horizontally center */
  min-height: calc(100vh - 64px);
}
</style>