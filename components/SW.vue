<!-- components/ScrollWrapperW-webp.vue -->
<template>
  <section
    ref="sectionEl"
    class="relative w-full py-20 md:py-28 bg-najmback"
  >
          <SceneCardsIntroUsed />

    <div
      class="mx-auto flex max-w-6xl flex-col gap-16 px-4 md:flex-row md:items-start md:px-6 lg:px-8"
    >
      <!-- Left column: intro + simple card list -->
      <div class="flex w-full flex-col gap-10 md:w-1/2">

        <!-- <div
          v-if="cardStates.length"
          class="flex flex-wrap gap-4"
        >
          <div
            v-for="card in cardStates"
            :key="card.id"
            class="card-preview relative inline-flex h-40 w-64 shrink-0 items-stretch overflow-hidden rounded-3xl border border-white/10 shadow-md backdrop-blur-sm"
            :style="{ backgroundColor: card.bgColor }"
          >
            <img
              :src="card.loop"
              :alt="card.text"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div> -->
      </div>

      <!-- Right column: projects -->
      <div class="w-full">
        <SceneProjects
          :stackIds="stackIds"
          @visibleStackChanged="syncStackIds"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch } from "vue"
import SceneCardsIntroUsed from "@/components/scenes/SceneCardsIntroUsed.vue"
import SceneProjects from "@/components/scenes/SceneProjects.vue"

interface Card {
  id: number
  loop: string
  text: string
}

interface CardState extends Card {
  bgColor: string
}

const sectionEl = ref<HTMLElement | null>(null)

// homeUI is assumed to be a ref injected higher in the tree
const homeUI = inject<any>("homeUI", ref({}))

const rawCards = computed<Card[]>(() => homeUI.value?.sceneProjects?.cards ?? [])

/* -------------------------------------------------------------------------- */
/* Card data – simple color assignment                                        */
/* -------------------------------------------------------------------------- */

const colorPalette = [
  "#8FBC8F",
  "#E7A7A7",
  "#A4A4D3",
  "#C3C3B4",
  "#D6D6D6",
  "#D6D9D1",
  "#C5C6F1",
  "#88A8B6",
]

const cardStates = computed<CardState[]>(() =>
  rawCards.value.map((card, index) => ({
    ...card,
    bgColor: colorPalette[index % colorPalette.length],
  }))
)

/**
 * stackIds is still passed down so EmblCards / SceneProjects can
 * keep their existing API, but we no longer animate or "stack" here.
 */
const stackIds = ref<number[]>([])

watch(
  rawCards,
  cards => {
    stackIds.value = cards.map(c => c.id)
  },
  { immediate: true }
)

function syncStackIds(newIds: number[]) {
  if (!Array.isArray(newIds) || !newIds.length) return
  stackIds.value = newIds
}
</script>

<style scoped>
.card-preview {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.card-preview:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}
</style>
