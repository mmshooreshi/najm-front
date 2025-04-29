
<!-- AnimatedContainer.vue -->
<template>
    <div class="space-y-6 flex flex-col items-center p-6">
      <MotionBox
        :initial="initial"
        :enter="enter"
        :hovered="hovered"
        :tapped="tapped"
        :transition="transition"
         :transform="state"
        @move="randomMove"
      />
  
      <button @click="resetAll" class="px-4 py-2 bg-blue-500 text-white rounded">
        Reset All
      </button>
  
      <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <MotionControls
          title="Position"
          :controls="positionControls"
          @update:controls="onControlUpdate"
        />
        <MotionControls
          title="Transform"
          :controls="transformControls"
          @update:controls="onControlUpdate"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import MotionBox from './MotionBox.vue'
  import MotionControls from './MotionControls.vue'
  
  // State for all motion props
  const state = reactive({
    x: -200,
    y: -200,
    scale: 0,
    rotate: 0
  })
  
  // Initial/enter/etc definitions
  const initial = { x: 0, y: -200, rotate: 180, scale: 0 }
  const enter = { x: 0, y: 0, rotate: 0, scale: 1 }
  const hovered = { scale: 1.2 }
  const tapped = { scale: 0.8 }
  const transition = { type: 'spring', stiffness: 200, damping: 12 }
  
  // Define control descriptors
  function makeControls(keys: string[]) {
    return keys.map(key => {
      const ranges: Record<string, any> = {
        x: { min: -200, max: 200, step: 1 },
        y: { min: -200, max: 200, step: 1 },
        scale: { min: 0, max: 2, step: 0.01 },
        rotate: { min: 0, max: 360, step: 1 }
      }
      return {
        key,
        label: key.toUpperCase(),
        range: ranges[key],
        value: state[key]
      }
    })
  }
  
  const positionControls = computed(() => makeControls(['x', 'y']))
  const transformControls = computed(() => makeControls(['scale', 'rotate']))
  
  // Handle updates from controls
  function onControlUpdate({ key, value }: { key: string; value: number }) {
    state[key] = value
  }
  
  // Move to random
  function randomMove() {
    state.x = Math.random() * 400 - 200
    state.y = Math.random() * 400 - 200
    console.log("random move triggered to ", state.x , state.y)
  }
  
  // Reset
  function resetAll() {
    state.x = -200
    state.y = -200
    state.scale = 0
    state.rotate = 0
  }
  </script>
  