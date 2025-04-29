<!-- MotionBox.vue -->
<template>
  <div
    v-motion="{ initial, enter, hovered, tapped, transition }"
    :initial="initial"
    :enter="enter"
    :hovered="hovered"
    :tapped="tapped"
    :transition="transition"
    @click="move"
    class="h-24 w-24 rounded-3xl border-8 border-indigo-400 bg-indigo-500 shadow-xl cursor-pointer"
  />
</template>

<script setup lang="ts">
import { useMotions } from '@vueuse/motion'

const props =  defineProps<{
  initial: Record<string, number>,
  enter: Record<string, number>,
  hovered: Record<string, number>,
  tapped: Record<string, number>,
  transition: Record<string, unknown>
  transform: Record<string, number>
}>()

const emit =  defineEmits<{
  (e: 'move'): void
}>()

const motions = useMotions()
const editor = motions.editor

watch(
  () => props.transform,
  (val) => { editor?.apply(val); console.log(val) },
  { deep: true, immediate: true }
)

function move() {
  emit('move')
}
</script>
