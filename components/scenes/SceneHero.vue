<!-- components/scenes/SceneHero.vue -->
<template>
  <BackgroundGradient />
  <div class="w-full flex flex-col items-center justify-start pt-2 sm:pt-4 md:pt-6 pb-2 md:pb-6">
    <teleport to="body">
      <RotatoryPane />
    </teleport>

    <HighlightedText />

    <div class="z-10 relative flex flex-col items-center w-full mt-4 sm:mt-6 md:mt-8">
      <ClientOnly>
        <ImagesFloating />
        <template #fallback>
          <div class="w-full h-[220px] sm:h-[240px] md:h-[260px] -mt-6 sm:-mt-8 md:-mt-10" aria-hidden="true" />
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