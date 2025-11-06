<!-- components/scenes/SceneHeading.client.vue -->
<template>
  <div class="flex flex-col gap-4" :class="itemsClass">
    <div
      v-memotion-pop-visible="{ delay: 0, duration: 0.6, ease: 'smoothPop' }"
      v-if="data.label!='' && !hideLabel"
      class="border border-black rounded-full py-2 px-4 text-xs text-d4 font-medium w-max"
      v-editable="`${path}.label`"
    >
      {{ data.label }}
    </div>

    <div :dir="isRTL ? 'rtl' : 'ltr'" :class="[isRTL ? 'rtl' : 'ltr', textClass]"
         class="relative max-w-2xl rounded-3xl mt-12 md:mt-0">
      <h2 v-memotion-pop-visible="{ delay: 0.3, duration: 0.6, ease: 'smoothPop' }"
          class="text-2xl font-extrabold text-d4">
        <span v-html="formattedHeader"></span>
      </h2>
      <!-- hidden editor that writes to the real source string -->
      <span class="sr-only" v-editable="`${path}.header`">{{ data.header }}</span>

      <p v-memotion-pop-visible="{ delay: 0.6, duration: 0.6, ease: 'smoothPop' }"
         class="text-sm text-d4 mt-4">
        <span v-editable="`${path}.description1`">{{ data.description1 }}</span><br>
        <span v-editable="`${path}.description2`">{{ data.description2 }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import CustomEase from 'gsap/CustomEase'
import { useLocale } from '@/composables/useLocale'
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

CustomEase.create('smoothPop', '0.25, 0.1, 0.25, 1')

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  align: { type: String, default: 'center' },
  hideLabel: { type: Boolean, default: false },
  /** base path for v-editable, e.g. "sceneServicesAndCapabilities" */
    path: {
    type: String,
    required: false,   // ⬅️ change this
    default: '',       // ⬅️ and add a safe default
  },

})

const isSmall = useMediaQuery('(max-width: 400px)')

const formattedHeader = computed(() => {
  if (!props.data.header) return ''
  return isSmall.value
    ? props.data.header.replace(/<mobile>/g, '<br>')
    : props.data.header.replace(/<mobile>/g, ' ')
})

const itemsClass = computed(() => ({
  'items-start':  props.align === 'left',
  'items-center': props.align === 'center',
  'items-end':    props.align === 'right',
}))

const textClass = computed(() => ({
  'text-left':   props.align === 'left',
  'text-center': props.align === 'center',
  'text-right':  props.align === 'right',
}))
</script>
