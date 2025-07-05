<!-- components/Base/BaseImage.vue -->
<script setup>
import { useImage } from '@vueuse/core'

// Change this to a non-existent URL to see the error state
const url = 'http://localhost:6636/images/sections/printing/Free-DL-Bi-Fold-Brochure-Mockup-PSD-Set-.jpg'
const { isLoading, error } = useImage(
  {
    src: url,
  },
  {
    // Just to show the loading effect more clearly
    delay: 2000,
  }
)
</script>

<template>
  
  <div class=" absolute left-16 right-16 top-16 bottom-16">
    <div v-if="isLoading" class="loading gradient"></div>
    <div v-else-if="error">Couldn't load the image :(</div>
    <img v-else :src="url" />
  </div>





<div class="mx-auto bg-white rounded shadow-lg w-96 rounded-2xl">
  <div class="h-48 p-3 overflow-hidden bg-gray-200 animate-pulse">
  </div>
  <div class="p-3 h-">
      <div class="grid grid-cols-3 gap-4 mt-2">
          <div class="h-8 bg-gray-200 rounded animate-pulse">
          </div>
          <div class="h-8 bg-gray-200 rounded animate-pulse">
          </div>
          <div class="h-8 bg-gray-200 rounded animate-pulse">
          </div>
          <div class="h-8 col-span-2 bg-gray-200 rounded animate-pulse">
          </div>
          <div class="h-8 bg-gray-200 rounded  animate-pulse">
          </div>
          <div class="...">
          </div>
          <div class="col-span-2 ...">
          </div>
      </div>
  </div>
</div>

</template>



