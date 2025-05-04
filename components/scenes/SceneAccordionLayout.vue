
   <!-- SceneAccordionLayout3.vue  -->
   <template>
    <div class="snap-start snap-y snap-mandatory overflow-y-hidden md:pt-8 px-8">
      <div class="pt-4 md:pt-0 grid grid-cols-1 md:grid-cols-7 md:grid-rows-2 md:gap-2 h-full my-8 mx-0 items-start">
        <div class="w-full h-full row-span-1 md:row-span-2 md:col-span-2">
          <CarouselAutoFader class="w-full h-full" />
        </div>
        <div class="pt-4 md:pt-0 w-full h-full row-span-1 md:row-span-2 col-span-3">
          <Accordion />
        </div>
        <div class="snap-end flex justify-center items-center h-full flex-col gap-2 row-span-1 md:row-span-2 md:col-span-2 py-4 md:py-0">
          <div class="bg-[#A5E4EB]/100 w-full h-full relative overflow-hidden min-h-56 p-6 rounded-3xl">
            <img ref="imageRef" src="/images/aut/trade-box.gif" alt="Box Mapping" class="absolute inset-0 w-full h-full object-contain object-center" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import CarouselAutoFader from '@/components/sections/CarouselAutoFader.vue'
  import Accordion from '@/components/Accordion.vue'
  </script>
  
  