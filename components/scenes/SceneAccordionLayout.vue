
   <!-- SceneAccordionLayout3.vue  -->
   <template>
    
    <div  class="flex-grow md:h-min overflow-y-hidden mt-0 md:pt-0 px-0   pt-0 md:pt-0 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 md:gap-2 h-full my-0 mx-0 items-start">
      <div class=" flex justify-center items-center h-full flex-col gap-2  row-span-1 md:row-span-2 md:col-span-2 py-0 py-8 md:py-0">
        <div class="bg-[#A5E4EB]/100 w-full h-full relative overflow-hidden  p-6 rounded-3xl">
          <img   v-motion-pop-visible ref="imageRef" src="/images/aut/trade-box.gif" alt="Box Mapping" class="absolute inset-0 w-full h-full object-contain object-center" />
        </div>
      </div>
  
  <div  class="flex-grow h-full  pt-12 md:pt-0 w-full h-full row-span-1 md:row-span-2 col-span-2">
      
        <Accordion />
      

    </div>
  </div>
</template>

<script setup lang="ts">
import CarouselAutoFader from '@/components/sections/CarouselAutoFader.vue'
import Accordion from '@/components/Accordion.vue'
</script>

