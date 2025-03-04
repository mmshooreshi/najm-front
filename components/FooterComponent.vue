<template>
  <div class="w-full sm:w-auto">
  <div class="text-d4 flex flex-col items-start">
    <h3 class="text-sm font-extrabold mb-2">{{ title }}</h3>
    <ul class="text-start text-xs">
      <li class="mb-2" v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
  items: string[];
}>();
</script>

<style scoped>
/* Scoped styles for FooterComponent */
</style>
