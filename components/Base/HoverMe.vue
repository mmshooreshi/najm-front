<!-- components/Base/HoverMe.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMotions } from '@vueuse/motion'

interface MotionProp {
  key: string
  label: string
  value: { value: number }
  range: { min: number; max: number; step: number }
  group: string
}

const motions = useMotions()

// Base properties
const baseProps: Partial<MotionProp>[] = [
  { key: 'x', label: 'X', range: { min: -200, max: 200, step: 1 }, group: 'Position' },
  { key: 'y', label: 'Y', range: { min: -200, max: 200, step: 1 }, group: 'Position' },
  { key: 'scale', label: 'Scale', range: { min: 0, max: 2, step: 0.01 }, group: 'Transform' },
  { key: 'rotate', label: 'Rotate', range: { min: 0, max: 360, step: 1 }, group: 'Transform' },
]


// Combine and initialize refs
const motionProps = [...baseProps].map(p => ({
  ...p as MotionProp,
  value: ref<number>(p.range ? p.range.min : 0)
}))

// Apply watchers for each property
motionProps.forEach(({ key, value }) => {
  watch(value, val => {
    if (motions.editor) {
      motions.editor.apply({ [key]: val })
    }
  })
})

// Grouped props for template
const groups = computed(() => {
  const map: Record<string, MotionProp[]> = {}
  motionProps.forEach(p => {
    map[p.group] = map[p.group] || []
    map[p.group].push(p)
  })
  return map
})

function replay() {
  motionProps.forEach(p => p.value.value = p.range.min)
}
</script>

<template>
  <div class="space-y-6 flex flex-col items-center">
    <!-- Animated Element -->
    <div
      v-motion="'editor'"
      :initial="{ x: 0, y: -200, rotate: 180, scale: 0 }"
      :enter="{ x: 0, y: 0, rotate: 0, scale: 1 }"
      :hovered="{ scale: 1.2 }"
      :tapped="{ scale: 0.8 }"
      class="h-24 w-24 rounded-3xl border-8 border-indigo-400 bg-indigo-500 shadow-xl cursor-pointer"
    />

    <button @click="replay" class="px-4 py-2 bg-blue-500 text-white/100 rounded">Reset All</button>

    <!-- Controls grouped into Position, Transform, Custom -->
    <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <fieldset v-for="(props, group) in groups" :key="group" class="border p-4 rounded">
        <legend class="px-2 font-semibold">{{ group }}</legend>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="prop in props" :key="prop.key" class="flex items-center justify-between">
            <label class="mr-4 w-24">{{ prop.label }}</label>
            <input
              type="range"
              :min="prop.range.min"
              :max="prop.range.max"
              :step="prop.range.step"
              v-model.number="prop.value.value"
              class="flex-1 border rounded px-2 py-1"
            />
            <span class="ml-2 w-12 text-right">{{ prop.value.value.toFixed(2) }}</span>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>
