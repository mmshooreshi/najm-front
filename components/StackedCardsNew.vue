<template>
    <div class="stacked-container">
      <div
        v-for="(card, i) in cards"
        :key="card.id"
        class="stacked-card" 
        :style="{ backgroundImage: `url(${card.image})` }"
      >
        {{card.text}}
      </div>
    </div>
  </template>
  
  
  <script setup>
  
  const props = defineProps({
    cards: {
      type: Array,
      required: true
    }
  })
  </script>
  