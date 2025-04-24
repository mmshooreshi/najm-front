<script setup lang="ts">
defineProps<{ product: import('@/types').Product }>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
    <img :src="product.image" :alt="product.name" class="w-24 h-24 object-contain mb-2"/>
    <h3 class="text-sm font-semibold">{{ product.name }}</h3>
    <!-- you can expand to show specs on hover if you like -->
  </div>
</template>

<style scoped>
/* nothing fancy here yet */
</style>
