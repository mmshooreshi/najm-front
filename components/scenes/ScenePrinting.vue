
 <!-- ScenePrinting2.vue  -->
 <template>
    <div class=" flex flex-col flex-grow  w-full h-full  gap-0 md:gap-6  px-8 md:px-16 py-14">
      <SceneLabel v-motion-pop-visible label="خدمات و توانایی‌ها"/>
      <PrintingSection/>
      <SceneAccordionLayout  />

    </div>
  </template>
  
  <script setup lang="ts">
  import PrintingSection from '@/components/sections/PrintingSection.vue'
  import SceneLabel from '~/components/scenes/SceneLabel.vue'
  import SceneAccordionLayout from '~/components/scenes/SceneAccordionLayout.vue'

  </script>
  
  