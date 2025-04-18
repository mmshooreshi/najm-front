<template>
  <div :class="['flex items-center', containerClass]">
    <button
      type="button"
      @click="open = !open"
      :class="['p-2 rounded-full transition', buttonClass]"
      aria-label="Toggle Search"
    >
      <slot name="icon">
        <!-- Default magnifying‐glass icon -->
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke-width="2" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </slot>
    </button>

    <transition name="fade">
      <input
        v-if="open"
        v-model="localValue"
        :placeholder="placeholder"
        :class="['ml-2 flex-1 border rounded-lg px-3 py-1 outline-none transition', inputClass]"
        @input="$emit('update:modelValue', localValue)"
        @keydown.esc="open = false"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  /** Tailwind (or custom) classes on the root container */
  containerClass?: string | string[]
  /** Classes for the toggle button */
  buttonClass?: string | string[]
  /** Classes for the input */
  inputClass?: string | string[]
  /** Control initial open state */
  initialOpen?: boolean
}>()

const localValue = ref(props.modelValue)
watch(() => props.modelValue, v => (localValue.value = v))

const open = ref(props.initialOpen ?? false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
