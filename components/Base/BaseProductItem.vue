<!-- components/Base/BaseProductItem.vue -->
<script setup lang="ts">
// Define the product prop
defineProps<{ product: import('@/types').Product }>()
</script>

<template>
  <!-- Wrap in a Vue <Transition> for enter/leave animations -->
  <!-- <Transition name="mooov" mode="out-in"> -->
    <div class="product-card bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-24 h-24 object-contain mb-2"
      />
      <h3 class="text-sm font-semibold">{{ product.name }}</h3>
    </div>
  <!-- </Transition> -->
</template>
<!-- 
<style scoped>
/* Entering and leaving animation */
.mooov-enter-active, .mooov-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease;
}
/* Starting state for enter, end state for leave */
.mooov-enter-from, .mooov-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
/* End state for enter, starting state for leave */
.mooov-enter-to, .mooov-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
/* Move transitions (if this were in a <transition-group>) */
.mooov-move {
  transition: transform 0.6s ease;
}
</style> -->
