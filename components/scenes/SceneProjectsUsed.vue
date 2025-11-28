<!-- components/scenes/SceneProjects.vue -->
<template>
  <div class="flex h-full w-full flex-col gap-10 pt-10 md:pt-12">
    <!-- Section heading -->
    <SceneHeading
      :data="sceneProjects"
      :align="isRTL ? 'right' : 'left'"
    />

    <!-- Project cards -->
    <EmblCards
      :cards="sceneProjects.cards"
      :stackIds="stackIds"
      @visibleStackChanged="$emit('visibleStackChanged', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  ref,
  type PropType,
} from "vue"

import SceneHeading from "~/components/scenes/SceneHeading.client.vue"
import EmblCards from "@/components/cards/EmblCards.vue"
import { useLocale } from "@/composables/useLocale"

defineProps({
  stackIds: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
})

const { language } = useLocale()
const isRTL = computed(() => language.value === "FA" || language.value === "AR")

const homeUI = inject<any>("homeUI", ref({}))
const sceneProjects = computed(
  () => homeUI.value?.sceneProjects ?? { cards: [] }
)
</script>
