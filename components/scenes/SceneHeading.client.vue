<template>
  
  <div 
    class="flex flex-col gap-4" 
    :class="itemsClass"
  >
    <div 
    v-memotion-pop-visible="{ delay: 0, duration: 0.6, ease: 'smoothPop' }"

    v-if="data.label!='' && !hideLabel"
      class="border border-black rounded-full py-2 px-4 text-xs text-d4 font-medium w-max"
    >
      {{ data.label }}
    </div>

    <div 
      dir="rtl" 
      class="relative max-w-2xl rounded-3xl mt-12 md:mt-0" 
      :class="textClass"
    >
      <h2     v-memotion-pop-visible="{ delay: 0.3, duration: 0.6, ease: 'smoothPop' }"      class="text-2xl font-extrabold text-d4">
        
        <span v-html="formattedHeader"></span>
      </h2>

      <p    v-memotion-pop-visible="{ delay: 0.6, duration: 0.6, ease: 'smoothPop' }"      class="text-sm text-d4 mt-4">
        {{ data.description1 }}<br>{{ data.description2 }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import CustomEase from 'gsap/CustomEase'
CustomEase.create('smoothPop', '0.25, 0.1, 0.25, 1')  // ease-in-out cubic-bezier


const props = defineProps({
  data:    { type: Object, default: () => ({}) },
  align:   { type: String, default: 'center' },
  hideLabel: { type: Boolean, default: false}
})

const isSmall = useMediaQuery('(max-width: 400px)')

const formattedHeader = computed(() => {
  if (!props.data.header) return ''
  return isSmall.value
    ? props.data.header.replace(/<mobile>/g, '<br>')
    : props.data.header.replace(/<mobile>/g, ' ')
})

// choose flex-items-* for positioning the children
const itemsClass = computed(() => ({
  'items-start':  props.align === 'left',
  'items-center': props.align === 'center',
  'items-end':    props.align === 'right',
}))

// choose text-* for aligning text inside the content
const textClass = computed(() => ({
  'text-left':   props.align === 'left',
  'text-center': props.align === 'center',
  'text-right':  props.align === 'right',
}))
</script>
