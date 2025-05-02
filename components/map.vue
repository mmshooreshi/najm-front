<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

/* lazy‑load the client‑only map container the moment we need it */
const NeshanContainer = defineAsyncComponent(() =>
  import('~/components/neshan-container.client.vue')
)

const isFullScreen = ref(false)
const openMap  = () => (isFullScreen.value = true)
const closeMap = () => (isFullScreen.value = false)
</script>

<template>
  <!-- ────────────────  Thumbnail  ──────────────── -->
  <div
    v-motion-pop-visible
    class="relative mt-2  mx-auto px-10 max-w-sm md:max-w-md   md:my-4 h-[280px] md:h-[300px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800
           cursor-pointer transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:scale-[1.01]"
    @click="openMap"
  >
    <!-- a tiny blurred preview image for faster paint; swap for your own -->
    <img
      src="/images/map.avif"
      alt="map thumbnail"
      class="absolute inset-0 w-full h-full object-cover  "
      decoding="async"
      loading="lazy"
    />
  </div>

  <!-- ────────────────  Fullscreen modal  ──────────────── -->
  <Transition name="fade-scale">
    <div
      v-if="isFullScreen"
      class="fixed inset-0 z-50 flex flex-col bg-[#014439] dark:bg-black"
    >
      <!-- close btn -->
      <button
        class="self-end m-2 p-2 rounded-full 
               backdrop-blur 
               text-2xl leading-none hover:scale-110 transition text-white"
        @click="closeMap"
      >
        
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 6L6 18M18 18L6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
      </button>

      <!-- 100 vh map (loads lazily) -->
      <client-only>
        <Suspense>
          <NeshanContainer class="flex-1" />
          <template #fallback>
            <div class="flex-1 grid place-items-center">
              <span class="animate-pulse text-sm opacity-70">…در حال بارگیری نقشه</span>
            </div>
          </template>
        </Suspense>
      </client-only>
    </div>
  </Transition>
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
</style>
