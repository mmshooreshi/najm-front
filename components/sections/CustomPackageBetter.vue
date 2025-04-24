<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'

// define where “mobile” ends and “desktop” begins
const bp = useBreakpoints({
  mobile: 0,
  desktop: 768,
})

// `isDesktop` will update reactively
const isDesktop = bp.greater('desktop')
</script>

<template>
  <!-- 
    On desktop: use our "grid-121" shortcut (1fr 2fr 1fr)
    On mobile:   switch to "grid-stack" (single-column)
  -->
  <div :class="isDesktop ? 'grid-121' : 'grid-stack'">
    <div class="bg-gray-100 p-4 rounded">Left</div>
    <div class="bg-gray-200 p-4 rounded">Middle</div>
    <div class="bg-gray-100 p-4 rounded">Right</div>
  </div>
</template>
