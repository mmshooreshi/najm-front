<!-- components/new/HighlightedText.vue -->
<template>
  <div class="min-h-[100px] flex items-center justify-center w-full">
    <h1 class="sr-only">یه راهکار خلاقانه برای چاپ و بسته‌بندی مورد نیاز شما | مجتمع چاپ و بسته‌بندی نجم</h1>
    <ClientOnly>
      <!-- ADD :key="language" HERE -->
      <HighlightedMotion
        :key="language"
        :initialDelay="0.2"  
        :speed="2"
        start="top top"
        :markers="false"
        :highlights="highlights"
        :bounce-scale="1.1"
        :bounce-duration="0.2"
        :type-speed="20"
        animation-type="split"
        :scrub="false"
      />
      <template #fallback>
        <div class="min-h-[100px] w-full" aria-hidden="true"></div>
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import HighlightedMotion from '@/components/Main/HighlightedMotion.vue'
import { useLocale } from '@/composables/useLocale'

const { language } = useLocale()

const defaultHighlights = [
  { label: '', sentence: 'یه راهکار خلاقانه برای ' },
  { label: 'چاپ', bgColor: '#F4FFD0', textColor: 'black', rotation: '-3.2deg' },
  { label: '', sentence: ' و ' },
  { label: 'break' },
  { label: 'بسته‌بندی', bgColor: '#B9ADFF', textColor: 'black', rotation: '3.36deg' },
  { label: '', sentence: ' مورد نیاز شما' }
]

const homeUI = inject<any>('homeUI') ?? {}
const highlights = computed(() => {
  const val = homeUI.value?.highlightedText
  if (Array.isArray(val) && val.length > 0) return val
  return defaultHighlights
})


</script>

