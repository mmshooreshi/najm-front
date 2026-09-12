<!-- components/InlineSvgMask.vue -->
<template>
  <!-- Container with explicit size matching original layout -->
  <div :style="{ position: 'relative', width: W + 'px', height: H + 'px', direction: 'ltr' }">
    <!-- Inline image with exact styling and zero CPU tracing overhead -->
    <img
      ref="imgEl"
      :src="src"
      :width="W"
      :height="H"
      alt="Packaging Visual"
      style="position: relative; top: 0; left: 0; right: auto; opacity: 1; pointer-events: auto;"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src:    { type: String, required: true },
  width:  { type: Number, required: true },
  height: { type: Number, required: true },
})

const emit = defineEmits(['hover', 'leave'])

const W = ref(props.width)
const H = ref(props.height)
const imgEl = ref(null)

function onMouseEnter() {
  if (imgEl.value) {
    imgEl.value.classList.add('png-hovered')
  }
  emit('hover', { src: props.src, state: 'top' })
}

function onMouseLeave() {
  if (imgEl.value) {
    imgEl.value.classList.remove('png-hovered')
  }
  emit('leave', props.src)
}
</script>

<style scoped>
.png-hovered {
  will-change: transform;
}
</style>
