<!-- components/Motion/MotionControls.vue -->

<!-- MotionControls.vue -->
<template>
  <fieldset class="border p-4 rounded">
    <legend class="px-2 font-semibold">{{ title }}</legend>
    <div class="space-y-4">
      <div
        v-for="prop in controls"
        :key="prop.key"
        class="flex items-center justify-between"
      >
        <label class="mr-4 w-24">{{ prop.label }}</label>
        <input
          type="range"
          :min="prop.range.min"
          :max="prop.range.max"
          :step="prop.range.step"
          v-model.number="prop.value"
          class="flex-1"
        />
        <span class="ml-2 w-12 text-right">
          {{ prop.value.toFixed(2) }}
        </span>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">

const props = defineProps<{
  title: string,
  controls: {
    key: string,
    label: string,
    range: { min: number; max: number; step: number },
    value: number
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:controls', payload: { key: string; value: number }): void
}>()

// Watch each control and emit updates
props.controls.forEach(control => {
  watch(() => control.value, val => {
    emit('update:controls', { key: control.key, value: val })
  })
})
</script>
