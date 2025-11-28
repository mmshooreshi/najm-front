<!-- components/buttons/GreenButton.vue -->
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  label:     { type: String,  default: 'Click me' },   // fallback if no slot
  fullWidth: { type: Boolean, default: false },
  bgColor:   { type: String,  default: '#014439' },    // default was hardcoded
  textColor: { type: String,  default: '#ffffff' },
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <div
    v-motion
    :initial="{ scale: 0 }"
    :visible="{ scale: 1 }"
    class="cursor-pointer space-y-6 flex flex-col items-center"
  >
    <!-- Use a <button> for accessibility; forward $attrs -->
    <button
      type="button"
      class="group active:scale-100 hover:scale-110 transition-all ease-in-out
             inline-flex items-center justify-center h-12 px-6 mx-auto rounded-2xl outline-none
             border-0"
      :class="[{ 'w-full': fullWidth }]"
      :style="{ backgroundColor: bgColor, color: textColor }"
      @click="handleClick"
      v-bind="attrs"
    >
      <div class="text-sm font-semibold group-hover:scale-102 group-active:scale-100 transition-all ease-in-out">
        <!-- If a slot is provided, use it; otherwise show the label prop -->
        <slot>{{ label }}</slot>
      </div>
    </button>
  </div>
</template>


<!-- 



<template>
  <div
    v-if="isMounted"
    ref="btnn"
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0, scale: 1 }"
    :variants="{ custom: { scale: 2 } }"
    :hovered="{ scale: 1.2 }"
    :delay="200"
    :duration="1200"

    class="hover:bg-najmgreen bg-najmgreen/90 text-white cursor-pointer inline-flex items-center justify-center h-12 px-6 mx-auto rounded-2xl text-sm font-semibold border border-black outline-none z-10"
    @click="handleClick"
  >
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const btnn = ref<HTMLElement | null>(null)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const props = defineProps({
  label:     { type: String,  default: 'Click me' },
  fullWidth: { type: Boolean, default: false },
  bgColor:   { type: String,  default: 'transparent' },
  textColor: { type: String,  default: 'black' }
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script> -->
