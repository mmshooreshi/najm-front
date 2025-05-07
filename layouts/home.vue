<!-- Layout.vue -->
<template>
    <BackgroundGradient />
  
    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />
  
    <div
      id="smooth-wrapper"
      class="relative overflow-hidden min-h-screen pt-16 bg-[#e4eaeb]"
    >
      <div id="smooth-content">
        <!-- ===== Responsive containerCustom ===== -->
        <div class="containerCustom flex flex-col gap-0 px-4 md:px-8 mx-auto">
          <!-- ===== Page sections (slot) ===== -->
          <slot />
  
          <Footer2 />
        </div>
      </div>
    </div>
  
    <!-- <DebugPane :debugVars="debugVars" /> -->
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import gsap from 'gsap'
  import { ScrollSmoother } from 'gsap/ScrollSmoother'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  
  const menuOpen = ref(false)
  const debugVars = ref({
    scrollPos: 0,
    scrollProgress: 0,
    currentSnap: 0,
  })
  
  onMounted(async () => {
    await nextTick()
  
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    })
  
    ScrollTrigger.defaults({ scroller: smoother.content() })
  
    // snap sections by grid containerCustom children
    const sections = gsap.utils.toArray<HTMLElement>('.section-snap')
  
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        debugVars.value.scrollPos = Math.round(self.scroll())
        debugVars.value.scrollProgress = +self.progress.toFixed(3)
      },
    })
  
    const snapPoints = sections.map(sec => {
      const st = ScrollTrigger.create({ trigger: sec, start: 'top top' })
      return st.start
    })
  
    ScrollTrigger.create({
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.2, max: 0.5 },
        ease: 'power2.out',
        delay: 0.05,
      },
      start: 0,
      end: ScrollTrigger.maxScroll(smoother.content()),
      scroller: smoother.content(),
    })
  
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle({ isActive }) {
          if (isActive) debugVars.value.currentSnap = i
        },
        markers: false,
      })
    })
  })
  </script>


<style>


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