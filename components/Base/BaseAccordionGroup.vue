<template>
  <div class="space-y-4">
    <BaseAccordinItem
      v-for="(item, i) in items"
      :key="i"
      :title="item.title"
      :expanded="openIndex === i"
      @toggle="() => handleToggle(i)"
    >
      {{ item.content }}
    </BaseAccordinItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseAccordinItem from './BaseAccordionItem.vue' 
// Accept items as a prop
const props = defineProps<{
  items: { title: string; content: string }[]
}>()

const openIndex = ref<number|null>(null)
const handleToggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}
</script>
