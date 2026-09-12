<!-- components/BackgroundGradient.vue -->
<template>
  <div class="background-gradient-layer fixed -z-1 inset-0 w-screen h-full pointer-events-none" aria-hidden="true" />
</template>

<script setup>
</script>

<style scoped>
.background-gradient-layer {
  background: linear-gradient(180deg, #E7F0F2 0%, #F8FAFC 360px, #F8FAFC 100%);
  will-change: transform;
}
</style>