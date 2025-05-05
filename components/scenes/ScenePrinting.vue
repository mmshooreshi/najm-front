
 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  py-12">
    <div class="flex flex-col gap-4">
    <SceneLabel v-motion-pop-visible label="خدمات و توانایی‌ها"/>
    <PrintingSection/>
  </div>
    <SceneAccordionLayout  />

  </div>
</template>

<script setup lang="ts">
import PrintingSection from '@/components/sections/PrintingSection.vue'
import SceneLabel from '~/components/scenes/SceneLabel.vue'
import SceneAccordionLayout from '~/components/scenes/SceneAccordionLayout.vue'

</script>

