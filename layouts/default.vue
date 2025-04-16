<template>
    <BackgroundGradient />
  
    <div
      class="px-4 md:px-8 2xl:px-28 relative h-screen prevent-select overflow-x-visible overflow-y-auto snap-y snap-mandatory"
    >
      <div class="snap-start max-h-screen">
        <Header />
      </div>
  
      <div class="snap-start pb-8">
        <slot /> <!-- This is where your page content goes -->
      </div>
  
      <FooterLayout />
    </div>
  </template>
  
  <script setup lang="ts">
  import Header from '~/components/Header.vue'
  import FooterLayout from '~/components/FooterLayout.vue'
  import BackgroundGradient from '~/components/BackgroundGradient.vue'
  </script>
  