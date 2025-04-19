<template>
    <BackgroundGradient />
  
<!-- <NavBar/> -->
    <div
      class=" relative h-screen prevent-select overflow-x-visible overflow-y-auto snap-y snap-mandatory"
    >
    <Header/>


  
      <div class="snap-start py-8 px-4 md:px-8 2xl:px-28">
        <slot /> <!-- This is where your page content goes -->
      </div>
  
      <div class="snap-start">
      <FooterLayout />
    </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Header from '~/components/Header.vue'
  import FooterLayout from '~/components/FooterLayout.vue'
//   import NavBar from '~/components/Main/NavBar.vue'

  import BackgroundGradient from '~/components/BackgroundGradient.vue'
  </script>
  