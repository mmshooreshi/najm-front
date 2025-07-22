<!-- components/CopyWrapper.vue -->
<template>
  <div
    :class="[
      'group relative cursor-pointer',
      containerClass,
      copied ? 'opacity-100 scale-105 text-green-400' : 'opacity-90 scale-100 text-gray-500',
      'smooth-transition',
    ]"
    @click="copy"
    tabindex="0"
  >
    <!-- if link action, wrap slot in anchor -->
    <component
      :is="isLink ? 'a' : 'div'"
      :href="isLink ? value : undefined"
      target="_blank"
      rel="noopener noreferrer"
      class="block"
      @click.prevent="handleAction"
    >
      <slot />
    </component>
    <button
      v-if="showIcon"
      :class="[
        'absolute flex items-center justify-center transition-transform transition-colors duration-400',
        position,
        wrapperClass,
        copied ? 'opacity-100 scale-110 text-green-400' : 'opacity-0 scale-90 text-gray-500',
        'group-hover:opacity-80 focus-visible:opacity-100 active:scale-100'
      ]"
      @mousedown="onPress"
      @mouseup="onRelease"
      @click.stop="copy"
      :title="copied ? copiedLabel : copyLabel"
    >
      <Icon :name="copied ? successIcon : triggerIcon" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults } from 'vue'

const posMap = {
  'top-right': 'top-2 right-2',
  'top-left': 'top-2 left-2',
  'bottom-right': 'bottom-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'center-right': 'top-1/2 right-2 -translate-y-1/2',
  'center-left': 'top-1/2 left-2 -translate-y-1/2'
} as const

type Pos = keyof typeof posMap

const props = withDefaults(defineProps<{
  value: string
  containerClass?: string
  wrapperClass?: string
  showIcon?: boolean
  triggerIcon?: string
  successIcon?: string
  copyLabel?: string
  copiedLabel?: string
  iconPosition?: Pos
}>(), {
  containerClass: '', wrapperClass: '', showIcon: true,
  triggerIcon: 'mdi:content-copy', successIcon: 'mdi:check',
  copyLabel: 'Copy', copiedLabel: 'Copied!', iconPosition: 'center-right'
})

const { value, containerClass, wrapperClass, showIcon, triggerIcon,
  successIcon, copyLabel, copiedLabel, iconPosition } = props

const copied = ref(false)
const position = computed(() => posMap[iconPosition])
const isLink = computed(() => triggerIcon === 'mdi:open-in-new')

function copy() {
  navigator.clipboard.writeText(value)
  copied.value = true
  setTimeout(() => (copied.value = false), 500)
}

function handleAction() {
  if (isLink.value) {
    window.open(value, '_blank', 'noopener')
  } else {
    copy()
  }
}

const pressing = ref(false)
function onPress() {
  pressing.value = true
}
function onRelease() {
  pressing.value = false
}
</script>

<style scoped>
.smooth-transition {
  transition: background-color 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
              transform 0.3s ease-out,
              box-shadow 0.4s ease;
}

.group:hover,
.group:focus-within {
  background-color: rgba(255,255,255,0.08);
}

.group:active {
  transform: scale(0.98);
}
</style>