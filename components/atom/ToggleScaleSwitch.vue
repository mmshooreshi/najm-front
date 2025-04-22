<template>
  <div class="p-4">
    <button
      @click="show = !show"
      class="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
    >
      Toggle
    </button>

    <!-- out-in mode + keyed inline-block span -->
    <transition name="scale" mode="out-in">
      <span
        v-if="show"
        key="on"
        class="inline-block text-xl font-bold"
      >
        ON
      </span>
      <span
        v-else
        key="off"
        class="inline-block text-xl font-bold"
      >
        OFF
      </span>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

/* both enter-from & leave-to start at scale(0) */
.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

/* both enter-to & leave-from end at scale(1) */
.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
