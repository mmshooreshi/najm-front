<!-- pages/loop2.vue -->
<template>
  <div class="border shadow-xl rounded-3xl max-w-[70%] space-x-8">
    <!-- 1. Default usage -->
<!-- 1 ▸ AV1 video, gradient overlay -->
<Av1VideoLoop path="media/01/avig-big" gradient="linear-gradient(135deg,#14b8a6AA,#ec4899AA)" alt="Hero animation"/>

<!-- 2 ▸ Animated AVIF, grayscale, plays on hover -->
<AnimatedAvifLoop path="media/01/avig-big" play-on="hover" color-filter="grayscale(.6)" alt="Team loop"/>

<!-- 3 ▸ Frame swap ping‑pong, 8 fps, click to start/stop -->
<FrameSwapLoop path="media/01/avig-big" fps="8" play-on="click" mode="pingPong" alt="Lab prototype"/>

<!-- 4 ▸ Frame swap loop, warm radial gradient, noise off -->
<FrameSwapLoop path="media/01/avig-big" mode="loop" :noise="false"
               gradient="radial-gradient(circle at center,#fbbf24AA 0%,transparent 70%)"
               alt="Heatmap demo"/>

<!-- 5 ▸ 20 animated AVIF thumbnails in a grid -->
<div class="grid grid-cols-5 gap-4">
  <AnimatedAvifLoop v-for="i in 20" :key="i" path="media/01/avig-big" fps="6" alt="Thumb loop"/>
</div>

  </div>
</template>

<script lang="ts" setup>
import AnimatedAvifLoop from '@/components/loop/AnimatedAvifLoop.vue'
definePageMeta({
  layout: "raw",
})
</script>

<style>

</style>