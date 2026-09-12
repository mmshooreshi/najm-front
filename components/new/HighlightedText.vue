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
    </ClientOnly>
  </div>
</template>



<script lang="ts" setup>
import HighlightedMotion from '@/components/Main/HighlightedMotion.vue'

import { useLocale } from '@/composables/useLocale' // ADD THIS IMPORT

const { language } = useLocale() // GET THE LANGUAGE STATE

const homeUI = inject<any>('homeUI') ?? {}
const highlights = computed(() => homeUI.value?.highlightedText ?? [])


        // :highlights="[

        //   { label:'', sentence: 'یه راهکار خلاقانه برای ' },
        //   { label: 'چاپ', bgColor: '#F4FFD0', textColor: 'black', rotation: '-3.2deg' },
        //   { label:'', sentence: ' و ' },
        //   { label:'break'},
        //   { label: 'بسته‌بندی', bgColor: '#B9ADFF', textColor: 'black', rotation: '3.36deg' },
        //   { label:'', sentence: ' مورد نیاز شما' },
        //   { label: 'end' } // invisible, only used for timeline alignment

        // ]"


</script>

