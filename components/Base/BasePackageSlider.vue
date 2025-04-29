<!-- components/Base/BasePackageSlider.vue -->
<template>
  <div class="package-slider">
    <Swiper
      :slides-per-view="1"
      :space-between="20"
      centeredSlides
      @slideChange="onSlideChange"
      class="h-full"
    >
      <SwiperSlide
        v-for="pkg in packages"
        :key="pkg.id"
        class="flex justify-center h-full"
      >
        <PackageSlide
          :pkg="pkg"
          :expanded="expandedId === pkg.id"
          @toggleExpand="toggleExpand(pkg.id)"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import type { Package } from '@/types'
import PackageSlide from '@/components/Base/BasePackageSlide.vue'

const props = defineProps<{ packages: Package[] }>()
const emit  = defineEmits(['expanded-change'])

const expandedId = ref<number | null>(null)

function onSlideChange () { expandedId.value = null }
function toggleExpand (id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

watch(expandedId, id => emit('expanded-change', id !== null))
</script>

<style scoped>
.package-slider { width: 100%; height: 100%; }
</style>
