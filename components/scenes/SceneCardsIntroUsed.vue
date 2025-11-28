<!-- components/scenes/SceneCardsIntro.vue -->
<template>
  <div class="flex h-full w-full flex-col justify-center gap-8 pt-8 md:pt-12">
    <ClientOnly>
      <TexPop
        :highlights="sceneCardsIntro.highlightedText"
        :paragraphes="sceneCardsIntro.paragraphes"
        :bounce-scale="1.1"
        :bounce-duration="0.2"
        :type-speed="20"
        animation-type="split"
        :scrub="false"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue"
import TexPop from "@/components/Main/TexPop.vue"

const homeUI = inject<any>("homeUI", ref({}))

const sceneCardsIntro = computed(() => homeUI.value?.sceneCardsIntro ?? {})
</script>
