<!-- layouts/home.vue -->
<!-- Layout.vue -->
<template>
  <div class="min-h-screen w-full relative">
    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />

    <div id="smooth-wrapper" class="relative overflow-visible min-h-screen bg-najmback overflow-x-clip touch-pan-y">
      <div id="smooth-content" class="w-full max-w-full pt-16 touch-pan-y">
        <main id="main-content" class="containerCustom gap-0 px-4 md:px-8 mx-auto flex flex-col min-h-[calc(100vh-64px)] touch-pan-y">
          <slot />
        </main>

        <Footer2 />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMenu } from '~/composables/useMenu'

const { isMenuOpen: menuOpen } = useMenu()
let smootherInstance: ScrollSmoother | null = null
let contentResizeObserver: ResizeObserver | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

function scheduleScrollRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh()
  }, 100)
}

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

    // On desktop with ScrollSmoother, continuously synchronize scroll boundaries as dynamic content loads
    const contentEl = document.getElementById('smooth-content')
    if (contentEl && typeof ResizeObserver !== 'undefined') {
      contentResizeObserver = new ResizeObserver(() => {
        scheduleScrollRefresh()
      })
      contentResizeObserver.observe(contentEl)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('load', scheduleScrollRefresh, { passive: true })
      if ('fonts' in document) {
        document.fonts.ready.then(scheduleScrollRefresh).catch(() => {})
      }
    }
  }

  // Initial trigger calculation for entry transitions
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  if (contentResizeObserver) {
    contentResizeObserver.disconnect()
    contentResizeObserver = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('load', scheduleScrollRefresh)
  }
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
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