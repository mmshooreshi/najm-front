<template>
    <VPNavBar isScreenOpen />
    <div class="vp-main">
      <VPSidebar open/>
      <div class="vp-content">
        <slot/>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import VPNavBar   from '~/components/vp/components/VPNavBar.vue'
  import VPSidebar from '~/components/vp/components/VPSidebar.vue'
  </script>
  
  <style src="~/assets/css/vp-styles/index.css" />
  