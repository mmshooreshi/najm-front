<!-- components/products/ProductCard.vue -->
<template>
    <div class="mx-4 md:mx-0 hover:scale-103 transition-all duration-100 cursor-pointer rounded-2xl  p-0 flex flex-col items-center space-y-4">
      <!-- Image container with overlay button -->
      <div class="relative w-full">
        <img
          :src="imageSrc"
          :alt="title"
          class="w-full object-contain rounded-lg"
        />
        <button
          v-if="buttonText"
          class="absolute p-1 md:px-6 md:py-3  bottom-2 right-2 bg-white/50 hover:bg-white transition-all duration-200 text-xs font-medium rounded-full "
        >
          {{ buttonText }}
        </button>
      </div>
  
      <!-- Product Info -->
      <div class="w-full text-center space-y-1 flex flex-col items-start">
        <h3 class="text-sm font-semibold truncate">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-gray-500 truncate">{{ subtitle }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Props for the product card
  interface Props {
    imageSrc: string;
    title: string;
    subtitle?: string;
    buttonText?: string;
  }
  
  const props = defineProps<Props>();
  </script>
  
  <style scoped>
  /* Customize as needed */
  </style>