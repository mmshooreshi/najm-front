<!-- components/new/HighlightedText.vue -->
<template>
    <div class="h-[100px]">
    <ClientOnly>
      <HighlightedMotion
        :initialDelay="0.5"  
        :speed="2"
        start="top top"
        :markers=true
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

const homeUI = inject<any>('homeUI') ?? {}
const highlights = computed(() => homeUI?.value?.highlightedText ?? [])


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

<style>
</style>

<!-- <template>
    <div class="text-container ">
      <p class="text">
        یه راهکار خلاقانه برای 
        <span class="highlight highlight-yellow">چاپ</span>
        و
        <span class="highlight highlight-purple">بسته‌بندی</span>
        مورد نیاز شما
      </p>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .text-container {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  
  .text {
    font-family: 'IRANSansX-D4', sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    color: black;
    max-width: 543px;
    position: relative;
  }
  
  /* Base styling for highlights */
  .highlight {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    font-weight: 900;
    font-size: 24px;
    line-height: 36px;
    color: black;
    border-radius: 12px;
    position: relative;
    transform-origin: center;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1.2), box-shadow 0.4s ease-in-out;
  }

  /* "چاپ" Styles */
  .highlight-yellow {
    background: #F4FFD0;
    width: 61px;
    height: 36px;
    transform: rotate(-3.2deg);
  }

  .highlight-yellow:hover {
    color: #F4FFD0;
  }
  
  /* "بسته‌بندی" Styles */
  .highlight-purple {
      background: #B9ADFF;
      width: 116px;
      height: 36px;
      transform: rotate(3.36deg);
    }
    
  .highlight-purple:hover {
    color: #B9ADFF;
  }
  /* Hover Effect: Rotate to 0deg, add shadow, slight scale-up */
  .highlight:hover {
    background: black;
    transform: rotate(0deg);
    cursor: pointer;
    /* box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15); */
  }
  </style> -->
