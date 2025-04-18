<!-- /components/products/ProductGrid.vue
<template>
    <div class="grid grid-cols-3 gap-6">
      <slot v-for="item in items" :key="item.id" name="card" :item="item"/>
    </div>
  </template>
  <script setup lang="ts">
  const props = defineProps<{ items: any[] }>()
  </script>
   -->



<!-- // components/products/ProductGrid.vue -->
<template>
  <div class="grid grid-cols-3 gap-4">
    <slot
      v-for="item in items"
      :key="item.id"
      name="card"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ items: any[] }>()
</script>
