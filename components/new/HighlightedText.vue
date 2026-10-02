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
        <div class="flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl md:text-5xl font-black text-d4 text-center leading-normal py-2">
          <template v-for="(item, idx) in highlights" :key="idx">
            <span v-if="item.sentence">{{ item.sentence }}</span>
            <span v-else-if="item.label === 'break'" class="w-full basis-full h-0"></span>
            <span
              v-else-if="item.label && item.label !== 'end'"
              class="inline-block px-3 py-1 rounded-xl shadow-xs"
              :style="{
                backgroundColor: item.bgColor || '#F4FFD0',
                color: item.textColor || '#000',
                transform: item.rotation ? `rotate(${item.rotation})` : undefined
              }"
            >
              {{ item.label }}
            </span>
          </template>
        </div>
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

