<!-- components/map.vue -->
<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { currentLangCode, isRTL } = useLocale()

/* lazy‑load the client‑only map container */
const MapboxContainer = defineAsyncComponent(() =>
  import('~/components/mapbox-container.client.vue')
)

const isFullScreen = ref(false)
const isMounted = ref(false)

const thumbnailText = computed(() => {
  if (currentLangCode.value === 'en') return 'Directions & Full Map'
  if (currentLangCode.value === 'ar') return 'الملاحة وعرض الخريطة كاملة'
  return 'مسیریابی و مشاهده نقشه کامل'
})

const closeLabel = computed(() => {
  if (currentLangCode.value === 'en') return 'Close map (ESC)'
  if (currentLangCode.value === 'ar') return 'إغلاق الخريطة (ESC)'
  return 'بستن نقشه (ESC)'
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullScreen.value) {
    closeMap()
  }
}

onMounted(() => {
  isMounted.value = true
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})

const preloadMap = () => {
  // Preload component code in the background on hover or interaction
  import('~/components/mapbox-container.client.vue')
}

const openMap = () => {
  preloadMap()
  isFullScreen.value = true
}

const closeMap = () => {
  isFullScreen.value = false
}
</script>

<template>
  <!-- ────────────────  Thumbnail  ──────────────── -->
  <div
    v-motion-pop-visible
    class="w-full h-full min-h-[220px] sm:min-h-[260px] rounded-2xl overflow-hidden relative bg-gray-100 dark:bg-gray-800 cursor-pointer transition-[transform,box-shadow] duration-300 hover:shadow-md group select-none"
    :dir="isRTL ? 'rtl' : 'ltr'"
    @click="openMap"
    @pointerenter="preloadMap"
  >
    <!-- a tiny blurred preview image for faster paint; swap for your own -->
    <img
      src="/images/map.avif"
      alt="map thumbnail"
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      decoding="async"
      loading="lazy"
    />
    <!-- Click to Expand Pill Badge -->
    <div class="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
      <span class="px-3.5 py-1.5 rounded-full bg-najmgreen/95 text-white text-[11px] font-bold font-d4 shadow-md backdrop-blur-xs flex items-center gap-1.5 group-hover:bg-najmgreen transition-colors border border-white/20">
        <Icon name="mdi:map-marker-radius" class="w-3.5 h-3.5 text-emerald-300" />
        {{ thumbnailText }}
      </span>
    </div>
  </div>

  <!-- ────────────────  Fullscreen modal  ──────────────── -->
  <Teleport to="body" v-if="isMounted">
    <Transition name="bounce-up">
      <div
        v-if="isFullScreen"
        class="fixed inset-0 z-100 flex flex-col bg-najmgreen dark:bg-black font-d4"
        :dir="isRTL ? 'rtl' : 'ltr'"
      >
        <!-- close btn -->
        <button
          class="self-end m-3 p-2 rounded-full 
                 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20
                 text-2xl leading-none hover:scale-110 active:scale-95 transition text-white cursor-pointer z-50 shadow-lg"
          @click="closeMap"
          :aria-label="closeLabel"
          :title="closeLabel"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M18 18L6 6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- 100 vh map -->
        <MapboxContainer class="flex-1 w-full h-full mt-0 overflow-hidden" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* subtle fade + scale for the modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}


/* slide-up transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}


.bounce-up-enter-active {
  animation: bounceEnter 0.3s ease-in-out both;
}
.bounce-up-leave-active {
  animation: bounceLeave 0.3s ease-in-out both;
}

@keyframes bounceEnter {
  0% {
    transform: translateY(120%) scale(1);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
 
}

@keyframes bounceLeave {
  to {
    transform: translateY(120%) scale(1);
    opacity: 0;
  }
}

</style>
