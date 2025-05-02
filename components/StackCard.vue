
<template>
  <div
    ref="el"
    class="stack-card w-full h-[75vh] bg-white shadow-xl rounded-xl grid place-content-center"
    :style="{ '--stack-top': top + 'px', '--stack-gap': gap + 'px' }"
    :data-dir="dir"
  >
    <slot/>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  dir?: 'y' | '-y' | 'x' | '-x'
  gap?: number
  top?: number
}>()



</script>

<style scoped>
.stack-card {
  will-change: transform;
}
</style>
