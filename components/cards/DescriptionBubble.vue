<template>
  <div
    class="absolute px-4 py-3 pt-2 bg-[#D6E6E3] rounded-[25px] rounded-br-[5px] bottom-6 right-6 text-sm font-medium text-d4"
    :style="{ maxWidth: currentMaxWidth + 'px' }"
  >
    <p ref="textEl" :style="{ lineHeight: lineHeight + 'px' }">
      {{ card.text }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true,
    // expects something like { text: '...' }
  }
})

// configuration
const lineHeight = 20    // match your actual CSS line-height in px
const thresholdLines = 3 // at 3 or more lines we switch

// reactive state
const textEl = ref(null)
const currentMaxWidth = ref(350)

// measure how many lines the text is taking
function updateWidth() {
  if (!textEl.value) return

  // total height in px
  const totalHeight = textEl.value.scrollHeight
  
  // compute number of lines (round up)
  const lines = Math.ceil(totalHeight / lineHeight)
  console.log(totalHeight, lines)
  
  console.log("thresholdLines: ", thresholdLines)
  console.log("totalHeight: ", lines)
  console.log("lines: ", totalHeight)
  console.log("currentMaxWidth: ", currentMaxWidth)
  console.log("- - - - - - - - - -")


  currentMaxWidth.value = lines >= thresholdLines ? 200 : 300
}

onMounted(() => {
  // initial measurement
  nextTick(updateWidth)
})

watch(() => props.card.text, () => {
  // re-measure whenever the text changes
  nextTick(updateWidth)
})
</script>

<style scoped>
/* ensure the <p> can wrap */
p {
  margin: 0;
  /* if your global stylesheet defines a different line-height, override here */
  /* line-height: 1.25; */
}
</style>
