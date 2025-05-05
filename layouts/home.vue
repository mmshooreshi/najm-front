<template>
    <BackgroundGradient />
  
    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />
  
    <div id="smooth-wrapper" class="min-h-screen pt-16 bg-[#e4eaeb] overflow-x-hidden">
      <div id="smooth-content">
        <slot />
        <Footer2 />
      </div>
    </div>
  
    <!-- your floating debug pane -->
    <!-- <DebugPane :debugVars="debugVars" /> -->
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useNuxtApp } from '#app'
  import Header from '~/components/Header.vue'
  import BackgroundGradient from '~/components/BackgroundGradient.vue'
  import Footer2 from '~/components/Footer2.vue'
  import DebugPane from '@/components/debug/DebugPane.vue'
  
  const menuOpen = ref(false)
  const debugVars = ref({
    scrollPos: 0,
    scrollProgress: 0,
    currentSnap: 0,
    // …add up to 15 keys here
  })
  
  // get the injected gsap & plugins (optional; you can also import directly)
  const { $gsap: gsap, $ScrollTrigger: ScrollTrigger, $ScrollSmoother: ScrollSmoother } = useNuxtApp()
  
  onMounted(() => {
    // 1) Create the smoother
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    })
  
    // 2) Tell every ScrollTrigger to use our smooth-content as the scroller
    ScrollTrigger.defaults({ scroller: '#smooth-content' })
  
    // 3) Global scroll watcher → update debug vars
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        debugVars.value.scrollPos = self.scroll()
        debugVars.value.scrollProgress = +self.progress.toFixed(3)
      },
    })
  
    // 4) Section snap setup
    document.querySelectorAll('.snap-section').forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        snap: 1,
        duration: { min: 0.2, max: 1 },
        onToggle({ isActive }) {
          if (isActive) debugVars.value.currentSnap = i
        },
      })
    })
  })
  </script>
  
  <style scoped>
  #smooth-wrapper {
    position: relative;
    overflow: hidden;
  }
  #smooth-content {
    /* no special styles needed */
  }
  </style>
  