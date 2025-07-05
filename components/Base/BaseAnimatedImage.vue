<!-- components/Base/BaseAnimatedImage.vue -->
<template>



<div class="flex min-h-screen items-center justify-center bg-gray-900">
salam
    <div class="animated animate-shimmy  animated-infinite bg-black mt-18  z-100 w-18 h-18"></div>
    <h1 class="animated animated-[wiggle] animated-infinite">
  Forever Bouncing Heading
</h1>

<div class="skeleton w-32 h-32">hahahah</div>

    <div class="grid w-[600px] grid-cols-3 gap-6">
      <!-- First Card Begins Here -->
      <div class="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full animated before:animated-shimmer before:border-t before:border-rose-100/10 before:bg-gradient-to-r before:from-transparent before:via-rose-100/10 before:to-transparent">
        <div class="h-24 rounded-lg bg-rose-100/10"></div>
        <div class="space-y-3">
          <div class="h-3 w-3/5 rounded-lg bg-rose-100/10"></div>
          <div class="h-3 w-4/5 rounded-lg bg-rose-100/20"></div>
          <div class="h-3 w-2/5 rounded-lg bg-rose-100/20"></div>
        </div>
      </div>
      <!-- First Card Ends Here -->
      <!--Second Card Begins Here  -->
      <div class="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full animated before:animated-shimmer before:border-t before:border-rose-100/10 before:bg-gradient-to-r before:from-transparent before:via-rose-100/10 before:to-transparent">
        <div class="h-24 rounded-lg bg-rose-100/10"></div>
        <div class="space-y-3">
          <div class="h-3 w-3/5 rounded-lg bg-rose-100/10"></div>
          <div class="h-3 w-4/5 rounded-lg bg-rose-100/20"></div>
          <div class="h-3 w-2/5 rounded-lg bg-rose-100/20"></div>
        </div>
      </div>
      <!-- Second Card Ends Here -->
      <!-- Third Card Begins Here  -->
      <div class="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full animated before:animated-shimmer before:border-t before:border-rose-100/10 before:bg-gradient-to-r before:from-transparent before:via-rose-100/10 before:to-transparent">
        <div class="h-24 rounded-lg bg-rose-100/10"></div>
        <div class="space-y-3">
          <div class="h-3 w-3/5 rounded-lg bg-rose-100/10"></div>
          <div class="h-3 w-4/5 rounded-lg bg-rose-100/20"></div>
          <div class="h-3 w-2/5 rounded-lg bg-rose-100/20"></div>
        </div>
      </div>
      <!-- Third Card Ends Here -->
    </div>
  </div>
  
    <!-- 
    <NuxtImg
      :src="src"
      :class="[!loaded ? 'skeleton-loader' : '', 'transition-opacity duration-500']"
      @load="loaded = true"
      class="w-full h-auto rounded-md"
    />
    -->
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const props = defineProps<{ src: string }>()
  const loaded = ref(false)
  </script>


<style>
.skeleton {
    border-radius: var(--radius-box);
    background-color: var(--color-base-300);
    will-change: background-position;
    background-image: linear-gradient(105deg, #0000 0% 40%, var(--color-base-100) 50%, #0000 60% 100%);
    background-position-x: -50%;
    background-repeat: no-repeat;
    background-size: 200%;
    animation: 1.8s ease-in-out infinite skeleton;
}
</style>
    

