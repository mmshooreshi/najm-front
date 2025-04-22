<template>
  <div class="page-container">
    <h1>Spring Animation Showcase</h1>
    <div class="grid">
      <div v-for="(cfg, idx) in configs" :key="idx" class="demo-item">
        <div
          :ref="el => boxes[idx].value = el"
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
import { ref, onMounted } from 'vue'
import { useMotionProperties, useSpring } from '@vueuse/motion'

// Configuration for 10 different spring demos
const configs = [
  { initial: { x: 0 }, springOpts: {}, target: { x: 200 },                 label: 'Default Spring',        desc: 'Default settings' },
  { initial: { x: 0 }, springOpts: { duration: 500, bounce: 0.5 }, target: { x: 200 },        label: 'Dur & Bounce',          desc: 'duration:500, bounce:0.5' },
  { initial: { x: 0 }, springOpts: { stiffness: 200, damping: 10 },  target: { x: 200 },        label: 'Stiff & Damp',         desc: 'stiffness:200, damping:10' },
  { initial: { scale: 1 }, springOpts: { stiffness: 300, damping: 20 }, target: { scale: 1.5 },   label: 'Scale Up',              desc: 'scale:1 → 1.5' },
  { initial: { scale: 1 }, springOpts: { mass: 2, stiffness: 100, damping: 10 }, target: { scale: 0.5 }, label: 'Mass & Spring',         desc: 'mass:2, stiff:100, damp:10' },
  { initial: { rotate: 0 }, springOpts: { duration: 800, bounce: 0.7 }, target: { rotate: 45 },      label: 'Rotate Bounce',          desc: 'rotate to 45°' },
  { initial: { rotate: 0 }, springOpts: { stiffness: 150, damping: 5 }, target: { rotate: -45 },     label: 'Rotate Spring',         desc: 'stiffness:150, damping:5' },
  { initial: { x: 0, y: 0 }, springOpts: { stiffness: 200, damping: 20 }, target: { x: 100, y: 100 }, label: 'XY Motion',             desc: 'x:100, y:100' },
  { initial: { y: 0 }, springOpts: { duration: 1000, bounce: 1 },      target: { y: 150 },        label: 'Y Bounce',              desc: 'duration:1000, bounce:1' },
  { initial: { x: 0 }, springOpts: { stiffness: 400, damping: 30 },  target: { x: -200 },       label: 'Fast Spring',           desc: 'stiffness:400, damping:30' },
]

// Create refs for each demo box
const boxes = configs.map(() => ref(null))

// Set up motionProperties and springs
const springs = configs.map((cfg, idx) => {
  const { motionProperties } = useMotionProperties(boxes[idx], cfg.initial)
  const { set } = useSpring(motionProperties, cfg.springOpts)
  return set
})

// Play forward then back on click
const play = (idx: number) => {
  const cfg = configs[idx]
  // animate to target
  springs[idx](cfg.target)
  // after a delay, animate back to initial
  const delay = cfg.springOpts.duration ?? 800
  setTimeout(() => {
    springs[idx](cfg.initial)
  }, delay)
}
