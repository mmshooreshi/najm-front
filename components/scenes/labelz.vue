<template>
    <div class="w-full h-56 overflow-hidden relative flex flex-col items-center justify-center gap-2">
      <div
        v-for="(lbl, idx) in labels"
        :key="idx"
        ref="el => setLabelRef(el, idx)"
        class="label absolute rounded-[12px] transition-all text-2xl duration-500 text-d4 px-2 py-0 font-extrabold" 
        :class="{
          '!delay-0 scale-80 z-10 top-0   flash-blur': nextIndex   === idx,
          '!delay-0  z-30 opacity-100 top-8 py-1 rounded-2xl  ':     activeIndex === idx,
          '!delay-0  scale-80 z-20  opacity-100 top-18':      prevIndex   === idx,
          '!delay-0  z-0 scale-50 top-9 opacity-0 ':       next2Index  === idx,
          '!delay-0  z-0 scale-50 top-10 opacity-0':    next3Index  === idx  /* ← fifth slot */
        }"
        :style="{ background: activeIndex === idx ? lbl.bg : 'lightgray' }"
      >
        {{ lbl.text }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  
  const labels = [
    // { text: 'یکپارچگی در فرایند تولید',  bg: '#F4FFD0' },
    // { text: 'تجربه و تخصص',              bg: '#B9ADFF' },
    // { text: 'تعادل بین کیفیت و هزینه',   bg: '#ADFAFF' },
    // { text: 'دقت و سرعت',               bg: '#FFEBB7' },
    // { text: 'انعطاف‌پذیری در اجرا', bg: '#FFD0F4' },  // ← new fifth item

    { text: 'تجربه و تخصص',              bg: '#B9ADFF' },
    { text: 'دقت و سرعت',               bg: '#FFEBB7' },
    { text: 'یکپارچگی در فرایند',  bg: '#F4FFD0' },
    { text: 'تعادل بین کیفیت و هزینه',   bg: '#ADFAFF' },
    { text: 'انعطاف‌پذیری در اجرا', bg: '#FFD0F4' },  // ← new fifth item

  ]
  
  const activeIndex = ref(0)
  const prevIndex   = computed(() => (activeIndex.value - 1 + labels.length) % labels.length)
  const nextIndex   = computed(() => (activeIndex.value + 1) % labels.length)
  const next2Index  = computed(() => (activeIndex.value + 2) % labels.length)
  const next3Index  = computed(() => (activeIndex.value + 3) % labels.length)  // ← three ahead
  
  let intervalId: number
  onMounted(() => {
    intervalId = window.setInterval(() => {
      activeIndex.value = nextIndex.value
    },800)
  })
  onBeforeUnmount(() => clearInterval(intervalId))
  </script>
  
  <style scoped>
  .label {
    display: inline-block;
    transform-origin: center center;
  }
  
  @keyframes blurToClear {
    0%   { filter: blur(0px); }
    50%  { filter: blur(4px); }
    100% { filter: blur(0); }
  }
  .flash-blur {
    animation: blurToClear 0.4s ease;
  }
  </style>
  