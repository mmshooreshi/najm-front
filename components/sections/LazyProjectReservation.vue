<!-- components/sections/LazyProjectReservation.vue -->
<template>
  <div ref="lazyTriggerRef" class="min-h-[400px]">
    <ProjectReservationLight v-if="shouldRender" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ProjectReservationLight from "@/components/sections/ProjectReservationLight.vue"; // your current component

const shouldRender = ref(false);
const lazyTriggerRef = ref(null);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      shouldRender.value = true;
      observer.disconnect(); // Only trigger once
    }
  }, {
    root: null,
    threshold: 0.1,
  });

  if (lazyTriggerRef.value) {
    observer.observe(lazyTriggerRef.value);
  }
});

onUnmounted(() => {
  if (observer && lazyTriggerRef.value) {
    observer.unobserve(lazyTriggerRef.value);
  }
});
</script>
