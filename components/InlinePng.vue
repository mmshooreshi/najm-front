<template>
  <!-- Render the PNG inline -->
  <img ref="imgEl" :src="src" alt="Loaded PNG" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  src: { type: String, required: true }
})
const emit = defineEmits(['hover', 'leave'])

const imgEl = ref(null)

onMounted(() => {
  // Add event listeners directly to the image element.
  if (imgEl.value) {
    imgEl.value.addEventListener('mouseenter', () => {
      imgEl.value.classList.add('png-hovered')
      emit('hover')
    })
    imgEl.value.addEventListener('mouseleave', () => {
      imgEl.value.classList.remove('png-hovered')
      emit('leave')
    })
  }
})
</script>

<style scoped>
/* When hovered, add a dashed red outline and a blue drop shadow */
.png-hovered {
  outline: 2px dashed red;
  filter: drop-shadow(10px 10px 50px blue);
}
</style>
