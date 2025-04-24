<template>
  <!-- Root container: swiper slider for packages -->
  <div class="package-slider ">

    <Swiper
      :slides-per-view="1"
      :space-between="20"
      centeredSlides
      @slideChange="onSlideChange"
      class="h-full"
    >
    s
      <SwiperSlide
        v-for="pkg in packages"
        :key="pkg.id"
        class="flex justify-center"
      >
        <!-- Each slide is a PackageSlide component -->
        <PackageSlide
          :pkg="pkg"
          :expanded="expandedPackageId === pkg.id"
          @toggleExpand="toggleExpand(pkg.id)"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
// 1. Import dependencies
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import type { Package } from '@/types/index.ts'
import PackageSlide from '@/components/Base/BasePackageSlide.vue'

// 2. Define props
const props = defineProps<{ packages: Package[] }>()

// 3. Local state: which package is expanded
const expandedPackageId = ref<number | null>(null)

// 4. Handle slide change (for lazy animations / cleanup)
function onSlideChange(swiper: any) {
  // Optionally reset expanded state when sliding
  expandedPackageId.value = null
}

// 5. Toggle expand / collapse
function toggleExpand(id: number) {
  expandedPackageId.value = (expandedPackageId.value === id ? null : id)
}
</script>

<style scoped>
.package-slider {
  width: 100%;
  height: 100%;
}
</style>

<!--
Next steps:
1. Create PackageSlide.vue:
   - Manage floating product items using CSS animations or requestAnimationFrame
   - Transition between floating state and grid layout on expand
2. Define ProductItem.vue for each product card
3. Use GSAP (optional) or pure CSS transitions with will-change: transform for performance
4. Optimize re-renders: use v-once, virtual lists if many items
5. Add horizontal scrolling on expanded mode: CSS scroll-snap or JS-driven scroll
-->
