<script setup lang="ts">
const cards = ref<HTMLElement[]>([])
const snap = ref(true)
const gap = ref(32)
const topOffset = ref(160)
import {useStackedCards} from '@/composables/useStackedCards'

useStackedCards(cards, { snap, gap, topOffset })

definePageMeta({
  name: 'g',
  layout: 'd',
})
</script>

<template>
  <div class="stack">
    <StackCard
      v-for="(c,i) in 5"
      :key="i"
      :ref="el => cards[i] = el!"
      :dir="i % 2 ? 'x' : 'y'"
      :gap="gap"
      :top="topOffset"
    >
      Card {{ i + 1 }}
    </StackCard>
  </div>

  <!-- toggle snapping runtime -->
  <button @click="snap = !snap">
    {{ snap ? 'free scroll' : 'snap scroll' }}
  </button>
</template>
