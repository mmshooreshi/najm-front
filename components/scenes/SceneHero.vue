<!-- components/scenes/SceneHero.vue -->
<template>
  <BackgroundGradient />
  <div class="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-10 md:py-14">
    <teleport to="body">
      <RotatoryPane />
    </teleport>

    <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
      <HighlightedText />
    </div>

    <div class="z-10 relative flex flex-col items-center w-full mt-6 sm:mt-10 md:mt-14">
      <ClientOnly>
        <ImagesFloating />
        <template #fallback>
          <div class="w-full h-[220px] sm:h-[250px] md:h-[280px]" aria-hidden="true" />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import HighlightedText from '@/components/new/HighlightedText.vue'
import RotatoryPane from '@/components/fixed/RotatoryPane.vue'
import ImagesFloating from '@/components/ImagesFloating.vue'

const homeUI = inject<any>('homeUI') ?? {}
const ui = computed(() => homeUI.value?.sceneHero ?? {})
</script>