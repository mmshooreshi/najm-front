<template>
  <div class="grid grid-cols-4 gap-4 mx-4 md:grid-cols-8 md:mx-8 lg:grid-cols-12 h-screen">
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

const columns = computed(() => (width.value >= 1024 ? 12 : width.value >= 768 ? 8 : 4));
</script>

<style scoped>

</style>

