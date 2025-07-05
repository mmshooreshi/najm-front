<!-- components/scenes/r3col.vue -->
<template>
  <div class="w-full mx-auto px-0">
    <!-- Ensure grid items stretch to full height -->
    <div class="grid grid-cols-12 gap-4 items-stretch h-full">
      <!-- left slider -->
      <div class="col-span-12 md:col-span-4 h-full">
        <slot name="left"/>
      </div>

      <!-- center content -->
      <div class="col-span-12 md:col-span-4 flex justify-center h-full">
        <slot name="center"/>
      </div>

      <!-- right slider -->
      <div class="col-span-12 md:col-span-4 h-full">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// no props needed
</script>

<style scoped>
/* If you need a fixed row height, you can apply it via a wrapper or utility class */
</style>
