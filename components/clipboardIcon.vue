<!-- components/clipboardIcon.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ text: string }>()
const copied = ref(false)

async function handleClick() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <button @click="handleClick" :title="copied ? 'Copied!' : 'Copy'">
    <Icon :name="copied ? 'solar:clipboard-bold' : 'solar:clipboard-bold-duotone'" />
  </button>
</template>
