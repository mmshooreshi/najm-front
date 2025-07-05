<!-- pages/tex.vue -->
<template>
  <div>
    <ClientOnly>
  <TexPop
    :highlights="[
      { label: 'یه نیاز خاص',  sentence: 'داری؟',    bgColor: '#B9ADFF', textColor: 'black', rotation: '3.36deg' },
      { indent: '5px', label: 'یه هدف مشخص', sentence: '؟',        bgColor: '#F4FFD0', textColor: 'black', rotation: '-3.2deg' },
      { label: 'break' },
      { indent: '0px', label: '', sentence: 'یا حتی فقط'},
      { label: 'یه تصویر ذهنی', sentence: '؟',        bgColor: '#A5E4EB', textColor: 'black', rotation: '3.36deg' }
    ]"
    :paragraphes="[
      {sentence: 'ما از همون‌جایی که هستی باهات همراه می‌شیم!'},
      {delay: '100ms', sentence: 'از طراحی و انتخاب متریال تا انجام چاپ و بسته بندی محصول، با تجربه، دید تخصصی و تیم یکپارچه، همه‌چیز رو متناسب با خواسته‌ت می‌چینیم.'}
    ]"
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
import TexPop from '@/components/Main/TexPop.vue'
</script>

<style>

</style>