<!-- <template>
    <div class="border rounded flex flex-col overflow-hidden">
      <NuxtImg
        :src="item.image"
        alt="" class="h-32 w-full object-cover"
        format="webp" loading="lazy"
      />
      <div class="p-4 flex-1 flex flex-col">
        <h3 class="font-medium mb-2">{{ item.title }}</h3>
        <button class="mt-auto px-4 py-2 bg-green-600 text-white rounded">
          نمایش ابعاد
        </button>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  defineProps<{ item: Record<string, any> }>()
  </script> -->



<!-- // components/products/ProductCard.vue -->
<template>
  <div class="border rounded-lg overflow-hidden shadow-sm">
    <img :src="item.image" alt="" class="w-full h-32 object-cover" />
    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ item.title }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ item: { id: number; title: string; image: string } }>()
</script>
