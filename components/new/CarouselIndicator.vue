<!-- components/new/CarouselIndicator.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useCarouselStore } from "@/store/useCarouselStore";

// Define emits
const emit = defineEmits<{
  (e: "cycleComplete"): void;
}>();

// Store instance
const store = useCarouselStore();
const interval = ref<ReturnType<typeof setInterval> | null>(null);
const duration = 1000; // Change every second

// Computed function to check if a step is active
const isActive = (index: number) => computed(() => index === store.currentStep);

// Function to start the looping carousel
const startCarousel = () => {
  if (interval.value) clearInterval(interval.value);

  interval.value = setInterval(() => {
    store.nextStep();
    if (store.currentStep === 0) {
      emit("cycleComplete"); // Emit event when looping back to start
    }
  }, duration);
};

// Start the carousel on mount
onMounted(startCarousel);

// Cleanup the interval on unmount
onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
</script>

<template>
  <div class="carousel-indicator">
    <div
      v-for="(step, index) in store.steps"
      :key="index"
      class="circle"
      :class="{ 'active': isActive(index).value }"
    ></div>
  </div>
</template>

<style scoped>
.carousel-indicator {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 8px;
}

.circle {
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.active {
  width: 20px;
  background: #66ba58;
  border-radius: 4px;

}
</style>
