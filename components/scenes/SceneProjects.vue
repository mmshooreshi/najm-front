<!-- components/scenes/SceneProjects.vue -->
<template>
  <div class="snap-start flex flex-col flex-grow w-full h-full gap-12 pt-12">
    <!-- Intro for projects (this will fade in/out) -->
    <div class="projects-intro">
      <SceneHeading
        :data="sceneProjects"
        :align="isRTL ? 'right' : 'left'"
      />
    </div>

    <!-- Embl cards: always visible -->
    <EmblCards
      :cards="sceneProjects.cards"
      :stackIds="stackIds"
      @visibleStackChanged="$emit('visibleStackChanged', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import EmblCards from '@/components/cards/EmblCards.vue'
import { useLocale } from '@/composables/useLocale'

defineProps({
  stackIds: Array as PropType<number[]>
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const homeUI = inject<any>('homeUI') ?? {}
const sceneProjects = computed(() => homeUI?.value?.sceneProjects ?? {})
</script>
