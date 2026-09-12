<!-- layouts/home.vue -->
<!-- Layout.vue -->
<template>

  <Header
    :menu-open="menuOpen"
    @update:menu-open="menuOpen = $event"
    class="fixed top-0 left-0 w-full z-50"
  />



  
    <div id="smooth-wrapper" class="relative overflow-visible min-h-screen pt-16 bg-najmback overflow-x-clip">
      <div id="smooth-content" class="w-full max-w-full">
        <div class="containerCustom gap-0 px-4 md:px-8 mx-auto flex flex-col min-h-[calc(100vh-64px)]">
          <slot />
        </div>

        <Footer2 />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const menuOpen = ref(false)
let smootherInstance: ScrollSmoother | null = null

onMounted(async () => {
  await nextTick()

  // Detect touch devices (iOS Safari, Android Chrome, tablets)
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (ScrollTrigger.isTouch === 1 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches)

  // On desktop pointer/mouse environments, enable refined ScrollSmoother
  // On mobile/touch devices, NEVER hijack scroll: allow native 120Hz compositor momentum scrolling!
  if (!isTouchDevice) {
    smootherInstance = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      smoothTouch: false,
    })
  }

  // Refresh ScrollTrigger so trigger positions are calculated accurately
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  if (smootherInstance) {
    smootherInstance.kill()
    smootherInstance = null
  }
})
</script>


<style>
#smooth-wrapper {
  overflow-x: clip;
}

#smooth-content {
  overflow: visible;
}

    /* containerCustom utility CSS */
.containerCustom {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 640px) {
  .containerCustom { max-width: 640px; }
}
@media (min-width: 768px) {
  .containerCustom { max-width: 768px; }
}
@media (min-width: 1024px) {
  .containerCustom { max-width: 1024px; }
}
@media (min-width: 1280px) {
  .containerCustom { max-width: 1280px; }
}
@media (min-width: 1536px) {
  .containerCustom { max-width: 1280px; }
}

</style>