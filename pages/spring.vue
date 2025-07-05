<!-- pages/spring.vue -->
<template>
    <div class="page-container">
      <h1>Spring Animation Showcase</h1>
      <div class="grid">
        <div
          v-for="(cfg, idx) in configs"
          :key="idx"
          class="demo-item"
          @click="play(idx)"
        >
          <div
            :ref="setBoxRef(idx)"
            class="box"
          >
            {{ cfg.label }}
          </div>
          <div class="desc">{{ cfg.desc }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useMotionProperties, useSpring } from '@vueuse/motion'
  
  // Configuration for 10 different spring demos
  const configs = [
    { initial: { x: 0 }, springOpts: {},                        target: { x: 200 },                 label: 'Default Spring',  desc: 'Default settings' },
    { initial: { x: 0 }, springOpts: { duration: 500, bounce: 0.5 }, target: { x: 200 },                 label: 'Dur & Bounce',    desc: 'duration:500, bounce:0.5' },
    { initial: { x: 0 }, springOpts: { stiffness: 200, damping: 10 }, target: { x: 200 },                 label: 'Stiff & Damp',   desc: 'stiffness:200, damping:10' },
    { initial: { scale: 1 }, springOpts: { stiffness: 300, damping: 20 }, target: { scale: 1.5 },   label: 'Scale Up',        desc: 'scale:1 → 1.5' },
    { initial: { scale: 1 }, springOpts: { mass: 2, stiffness: 100, damping: 10 }, target: { scale: 0.5 }, label: 'Mass & Spring',   desc: 'mass:2, stiff:100' },
    { initial: { rotate: 0 }, springOpts: { duration: 800, bounce: 0.7 },  target: { rotate: 45 },      label: 'Rotate Bounce',   desc: 'rotate to 45°' },
    { initial: { rotate: 0 }, springOpts: { stiffness: 150, damping: 5 },  target: { rotate: -45 },     label: 'Rotate Spring',   desc: 'stiffness:150' },
    { initial: { x: 0, y: 0 }, springOpts: { stiffness: 200, damping: 20 }, target: { x: 100, y: 100 }, label: 'XY Motion',       desc: 'x:100, y:100' },
    { initial: { y: 0 }, springOpts: { duration: 1000, bounce: 1 },       target: { y: 150 },                 label: 'Y Bounce',        desc: 'duration:1000, bounce:1' },
    { initial: { x: 0 }, springOpts: { stiffness: 400, damping: 30 },     target: { x: -200 },                label: 'Fast Spring',     desc: 'stiffness:400, damping:30' },
  ]
  
  // Create refs for each demo box
  const boxes = configs.map(() => ref(null))
  
  // Helper to assign refs in v-for
  const setBoxRef = (idx) => (el) => {
    boxes[idx].value = el
    console.log(`[SpringShowcase] set ref for index ${idx}:`, el)
  }
  
  // Initialize springs for each config, with debug logs
  const springs = configs.map((cfg, idx) => {
    console.log(`[SpringShowcase] init spring ${idx}:`, cfg.springOpts)
    const { motionProperties } = useMotionProperties(boxes[idx], cfg.initial)
    const { set, stop } = useSpring(motionProperties, cfg.springOpts)
    // log motionProperties changes
    watch(
      () => motionProperties,
      (props) => console.log(`[SpringShowcase] motionProperties[${idx}] updated:`, props),
      { deep: true }
    )
    return { set, stop }
  })
  
  // Play forward then back on click with logs
  const play = (idx) => {
    const cfg = configs[idx]
    console.log(`[SpringShowcase] play() called for index ${idx}`, cfg)
    const spring = springs[idx]
    if (!spring) {
      console.warn(`[SpringShowcase] no spring found for index ${idx}`)
      return
    }
    // animate to target
    console.log(`[SpringShowcase] animating to target:`, cfg.target)
    spring.set(cfg.target)
    // after springOpts.duration or default 800ms, animate back
    const delay = cfg.springOpts.duration ?? 800
    setTimeout(() => {
      console.log(`[SpringShowcase] animating back to initial:`, cfg.initial)
      spring.set(cfg.initial)
    }, delay)
  }
  </script>
  
  <style scoped>
  .page-container {
    padding: 2rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
  }
  
  .demo-item {
    cursor: pointer;
    text-align: center;
  }
  
  .box {
    width: 100px;
    height: 100px;
    background-color: #41B883;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin: 0 auto;
  }
  
  .desc {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #333;
  }
  </style>
  