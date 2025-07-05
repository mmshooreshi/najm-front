<!-- components/scenes/SceneLabel.vue -->
<template>
<div class="border border-black rounded-full py-2 px-4 text-xs text-d4 font-medium w-max mx-auto">{{ label }}</div>
</template>


<script setup lang="ts">

const props = defineProps({
  label:     { type: String,  default: 'Click me' }
})

</script>