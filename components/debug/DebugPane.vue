<!-- components/debug/DebugPane.vue -->
<!-- components/DebugPane.vue -->
<template>
  <div v-if="show" class="fixed bottom-4 right-4 bg-black/70 text-white p-3 rounded-lg z-[9999] text-xs">
    <div v-for="(val, key) in debugVars" :key="key">{{ key }}: {{ val }}</div>
    <button @click="toggle" class="mt-2 bg-white/30 px-2 py-1 rounded">Toggle Debug</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(true);
const debugVars = defineProps(['debugVars']);

const toggle = () => { show.value = !show.value; };
</script>
