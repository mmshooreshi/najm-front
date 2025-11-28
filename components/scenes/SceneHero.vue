<!-- components/scenes/SceneHero.vue -->
<!-- SceneHero.vue -->
<!-- <template>
  <div class=" py-16 md:pt-16  flex flex-col flex-grow">
    <teleport to="body">
      <RotatoryPane/>
    </teleport>

    <HighlightedText />

    <div
      class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px]"
      style="top:48px; padding:0px 0px;">
      <ImagesFloating />
    </div>


    <div class="bok gap-3 flex flex-col flex-grow h-full translate-y-0">
      <div class="h-46  overflow-visible">
        <LazyProjectReservation />
      </div>
      <div class="flex-grow"></div>
      <GreenButton :fullWidth="false" :label="ui.cta"  @click="" />
      <div v-motion
      :initial="{ scale: 0, }" :visible="{ scale: 1, }">
        <p class="text-center font-medium text-sm text-d4 text-black/50 transition-transform">
          {{ ui.countdownLabelStart }}
          <span
            class=" text-najmgreen underline decoration-0.5 decoration-offset-3 decoration-najmgreen px-0.5">{{ toLocalizedDigits(ui.countdownDays) }}</span>
          {{ ui.countdownLabelEnd }}
        </p>
      </div>
    </div>


  </div>
</template> -->


<!-- components/scenes/SceneHero.vue -->
<!-- components/scenes/SceneHero.vue -->
<template>

  <BackgroundGradient />
  <div class="h-full section-snap pb-2  md:pb-6 flex flex-col pt-16  ">

    <teleport to="body">
      <RotatoryPane/>
    </teleport>

    <HighlightedText />

    <div
      class="z-10 relative flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px]"
      style="top:10vh; padding:0px 0px;">
      <ImagesFloating />
    </div>

    <div class="bok gap-3 flex flex-col grow h-full invisible md:visible">
      <div class="flex-grow"></div>
      <!-- <div class="h-46 translate-y-16 overflow-visible">
        <LazyProjectReservation />
      </div> -->

      <!-- EDITABLE BUTTON TEXT -->
      <GreenButton :fullWidth="false" >
        <span v-editable="'sceneHero.cta'">{{ ui.cta }}</span>
      </GreenButton>


      <div v-motion :initial="{ scale: 0 }" :visible="{ scale: 1 }">
        <p class="text-center font-medium text-sm text-d4 text-black/50 transition-transform">
          <span v-editable="'sceneHero.countdownLabelStart'">{{ ui.countdownLabelStart }}</span>
          <span
            class=" text-najmgreen underline decoration-0.5 decoration-offset-3 decoration-najmgreen px-0.5"
            v-editable="'sceneHero.countdownDays'">{{ toLocalizedDigits(ui.countdownDays) }}</span>
          <span v-editable="'sceneHero.countdownLabelEnd'">{{ ui.countdownLabelEnd }}</span>
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import HighlightedText from '@/components/new/HighlightedText.vue'
import GreenButton from '@/components/buttons/GreenButton.vue'
import RotatoryPane from '@/components/fixed/RotatoryPane.vue'
import rotatoryLg from '~/components/rotatoryLegacy.vue'
import { toLocalizedDigits } from '~/utils/digits'

import ImagesFloating from '@/components/ImagesFloating.vue'
import LazyProjectReservation from '@/components/sections/LazyProjectReservation.vue'
// const homeUI = inject<any>('homeUI') ?? {}
// const ui = computed(() => homeUI.value?.sceneHero ?? {})
// SceneHero.vue
const homeUI = inject<any>('homeUI') ?? ref({})
const ui = computed(() => homeUI.value.sceneHero ?? {})

// watch(ui, (val) => {
//   console.log("ui changed to", val)
// })


</script>


<style scoped>
/* in your Layout.vue or global styles */
.section-snap {
  border: 0px solid teal;;
  position: relative;              /* make ::before sit on top */
  
  min-height: calc(100vh - 64px);
}

</style>