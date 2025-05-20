<template>
<!-- Each scene wrapped in a section-snap for ScrollTrigger snapping -->
  <div class="section-snap">
    <SceneHero />
  </div>

   <div class="section-snap">
    <SceneServicesAndCapabilities />
  </div>
<!--  
  <div class="section-snap">
    <SceneCardsIntro />
  </div> 
  <div class="section-snap">
    <SceneProjects />
  </div> -->

  <div class="section-snap">
    <ScrollWrapperW />  
  </div>





  <div class="section-snap">
    <SceneApplicationsAndIndustries />
  </div>

  
  <div class="section-snap">
    <SceneFacilities />
  </div>

  <div class="section-snap">
    <SceneProducts />
  </div>

  <div class="section-snap">
    <ScenePromo />
  </div>
  <SceneCustomers />


  <!-- <div class="section-snap"> -->
    <!-- <SceneSlider /> -->
  <!-- </div> -->

  <!-- <div class="section-snap"> -->
    <!-- <SceneFinalMessage /> -->
  <!-- </div> -->

  <div class="section-snap">
    <SceneFaq />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SceneHero from '~/components/scenes/SceneHero.vue'
import SceneServicesAndCapabilities from '@/components/scenes/SceneServicesAndCapabilities.vue'
import SceneFacilities from '~/components/scenes/SceneFacilities.client.vue'
import SceneProjects from '@/components/scenes/SceneProjects.vue'
import SceneCardsIntro from '@/components/scenes/SceneCardsIntro.vue'
import SceneApplicationsAndIndustries from '@/components/scenes/SceneApplicationsAndIndustries.vue'
import SceneProducts from '@/components/scenes/SceneProducts.vue'
import ScenePromo from '@/components/scenes/ScenePromo.vue'
import SceneCustomers from '@/components/scenes/SceneCustomers.vue'
import ScrollWrapperW from '@/components/ScrollWrapperW.vue'


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


/* in your Layout.vue or global styles */
.section-snap {
  border: 0px solid teal;;
  position: relative;              /* make ::before sit on top */
  
  min-height: calc(100vh - 64px);
}

.section-snap.debug-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;            /* clicks pass through */
  background-image: repeating-linear-gradient(
    to right,
    rgba(255, 0, 0, 0.25),          /* line color */
    rgba(255, 0, 0, 0.25) 1px,
    transparent 1px,
    transparent calc(100%/12)
  );
  /* if you also want horizontal lines every row-height: */
  /* background-image:
       repeating-linear-gradient(to right, rgba(255,0,0,0.25) 1px, transparent 1px calc(100%/12)),
       repeating-linear-gradient(to bottom, rgba(0,0,255,0.25) 1px, transparent 1px 4rem); */
  z-index: 10;
}

</style>