<template>
  <!-- Render the SVG inline -->
  <div ref="svgContainer" v-if="svgContent" v-html="svgContent"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  src: { type: String, required: true }
})
const emit = defineEmits(['hover', 'leave'])

const svgContent = ref('')
const svgContainer = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(props.src)
    svgContent.value = await response.text()
    await nextTick()

    // Find the injected SVG element.
    const svgEl = svgContainer.value.querySelector('svg')
    if (svgEl) {
      // Only painted pixels will receive pointer events.
      svgEl.style.pointerEvents = 'visiblePainted'

      // Add event listeners directly to the SVG element.
      svgEl.addEventListener('mouseenter', () => {
        svgEl.classList.add('svg-hovered')
        emit('hover')
      })
      svgEl.addEventListener('mouseleave', () => {
        svgEl.classList.remove('svg-hovered')
        emit('leave')
      })
    }
  } catch (e) {
    console.error('Error loading SVG:', e)
  }
})
</script>

<style scoped>
/* When hovered, add a dashed red outline and blue drop shadow */
.svg-hovered {
  outline: 2px dashed red;
  filter: drop-shadow(10px 10px 50px blue);
}
</style>