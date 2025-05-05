<template>
    <BackgroundGradient />
  
    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />
  
    <div id="smooth-wrapper" class="min-h-screen pt-16 bg-[#e4eaeb] overflow-hidden">
      <div id="smooth-content">
        <slot />
        <Footer2 />
      </div>
    </div>
  
    <DebugPane :debugVars="debugVars" />
  </template>
  
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

  // ✅ Explicitly typed as HTMLElement[]
  const sections = gsap.utils.toArray<HTMLElement>('.snap-section')

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => {
      debugVars.value.scrollPos = Math.round(self.scroll())
      debugVars.value.scrollProgress = +self.progress.toFixed(3)
    },
  })

  const snapPoints = sections.map(section => {
    const st = ScrollTrigger.create({ trigger: section, start: 'top top' })
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

  sections.forEach((section: HTMLElement, i: number) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle({ isActive }) {
        if (isActive) debugVars.value.currentSnap = i
      },
      markers: true,
    })
  })
})
</script>


<style scoped>
#smooth-wrapper {
  position: relative;
  overflow: hidden;
}
</style>





