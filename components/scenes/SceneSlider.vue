<!-- components/scenes/SceneSlider.vue -->

   <!-- SceneSlider7.vue  -->
   <template>
    <div class="snap-start pt-4 pb-4 px-8 overflow-hidden border border-0 border-black rounded-3xl flex flex-col md:flex-row max-w-[450px] md:max-w-screen items-center justify-center w-full mx-auto px-0 gap-4">
      <CarouselAutoSlider class="w-full" />
    </div>
  </template>
  
  <script setup lang="ts">
  import CarouselAutoSlider from '@/components/sections/CarouselAutoSlider.vue'
  </script>
  
  