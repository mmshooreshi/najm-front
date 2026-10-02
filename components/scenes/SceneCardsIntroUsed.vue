<!-- components/scenes/SceneCardsIntro.vue -->
<template>
  <div class="flex h-full w-full flex-col justify-center gap-6 pt-0 pb-8 md:pb-12">
    <ClientOnly>
      <TexPop
        :key="language"
        :highlights="highlights"
        :paragraphes="paragraphes"
        :bounce-scale="1.1"
        :bounce-duration="0.2"
        :type-speed="20"
        animation-type="split"
        :scrub="false"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue"
import TexPop from "@/components/Main/TexPop.vue"
import { useLocale } from "@/composables/useLocale"

const { language } = useLocale()
const homeUI = inject<any>("homeUI", ref({}))
const sceneCardsIntro = computed(() => homeUI.value?.sceneCardsIntro ?? {})

const defaultHighlights = [
  { label: 'یه نیاز خاص', sentence: 'داری؟', bgColor: '#B9ADFF', textColor: 'black', rotation: '3.36deg' },
  { indent: '5px', label: 'یه هدف مشخص', sentence: '؟', bgColor: '#F4FFD0', textColor: 'black', rotation: '-3.2deg' },
  { label: 'break' },
  { indent: '0px', label: '', sentence: 'یا حتی فقط' },
  { label: 'یه تصویر ذهنی', sentence: '؟', bgColor: '#A5E4EB', textColor: 'black', rotation: '3.36deg' }
]

const defaultParagraphes = [
  { sentence: 'ما از همون‌جایی که هستی باهات همراه می‌شیم!' },
  { delay: '100ms', sentence: 'از طراحی و انتخاب متریال تا انجام چاپ و بسته بندی محصول...' }
]

const highlights = computed(() => {
  const val = sceneCardsIntro.value?.highlightedText
  if (Array.isArray(val) && val.length > 0) return val
  return defaultHighlights
})

const paragraphes = computed(() => {
  const val = sceneCardsIntro.value?.paragraphes
  if (Array.isArray(val) && val.length > 0) return val
  return defaultParagraphes
})
</script>
