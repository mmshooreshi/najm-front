<template>
  <div class="grid grid-cols-4 gap-4 mx-4 sm:grid-cols-8 sm:mx-8 md:grid-cols-12 h-screen">
    <div
      v-for="n in columns"
      :key="n"
      class="bg-red-200/50 text-center h-full"
    >
      {{ n }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { width } = useWindowSize();

const columns = computed(() => (width.value >= 768 ? 12 : width.value >= 375 ? 8 : 4));
</script>

<style scoped>

</style>

