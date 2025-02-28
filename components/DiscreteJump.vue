<template>
    <section class="demo-wrapper">
      <!-- Inline the SVG at build time; #circlePath is in the DOM from the start -->
      <div class="svg-holder" v-html="circleSvg" />
  
      <!-- Dot: uses a 0.2s jump so you can see it move, then a 1.8s pause => total 2s per step -->
      <div class="dot" v-gsap.timeline="{ repeat: -1 }">
        <!-- Step 1: 0.0 -> 0.1 -->
        <div
          v-gsap.add.call="() => console.log('Jump 1: 0->0.1')"
        />
        <div
          v-gsap.add.to="{
            motionPath: { path: '#circlePath', start: 0, end: 2 },
            duration: 1,
            ease: 'bounce'
          }"
        />
        <!-- 1.8s wait -->
        <div
          v-gsap.add.to="{
            duration: 1.8,
            ease: 'none'
          }"
        />
  
        <!-- Step 2: 0.1 -> 0.2 -->
        <div
          v-gsap.add.call="() => console.log('Jump 2: 0.1->0.2')"
        />
        <div
          v-gsap.add.to="{
            motionPath: { path: '#circlePath', start: 3, end: 4 },
            duration: 1,
            ease: 'bounce'
          }"
        />
        <div
          v-gsap.add.to="{
            duration: 1.8,
            ease: 'none'
          }"
        />
  
        <!-- Repeat steps 3..10 similarly -->
        <!-- Final step: 0.9 -> 1.0, loop again -->
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  // Import raw text from circlePath.svg at build time
  import circleSvg from '~/assets/svg/circlePath.svg?raw'
  
  // Because it's a static import, we can bind it directly in template
  </script>
  
  <style scoped lang="scss">
  .demo-wrapper {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    position: relative;
    background: #fafafa;
    border: 1px solid #ccc;
  }
  
  .svg-holder {
    width: 100%;
    height: 100%;
  }
  
  .dot {
    @apply absolute top-0 left-0 w-8 h-8 bg-pink-400 rounded-full;
  }
  </style>
  