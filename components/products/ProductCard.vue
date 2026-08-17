<template>
  <NuxtLink
    :to="to || '/products/packaging/boxes'"
    class="block mx-4 md:mx-0 hover:scale-103 transition-all duration-200 cursor-pointer rounded-2xl p-0 flex flex-col items-center space-y-3 group"
  >
    <!-- Image container with overlay button -->
    <div class="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
      <img
        :src="imageSrc"
        :alt="title"
        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
      />
      <button
        v-if="buttonText"
        class="absolute px-4 py-2 bottom-3 right-3 bg-white/80 backdrop-blur hover:bg-white transition-all duration-200 text-xs font-semibold rounded-full shadow-sm"
      >
        {{ buttonText }}
      </button>
    </div>

    <!-- Product Info -->
    <div class="w-full text-right space-y-1 flex flex-col items-start px-1">
      <h3 class="text-sm font-bold text-gray-900 truncate group-hover:text-najmgreen transition-colors">{{ title }}</h3>
      <p v-if="subtitle" class="text-xs text-gray-500 truncate">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  imageSrc: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  to?: string;
}

const props = defineProps<Props>();
</script>
  
  <style scoped>
  /* Customize as needed */
  </style>