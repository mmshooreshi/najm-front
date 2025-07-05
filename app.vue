<!-- app.vue -->
<!-- app.vue -->
<template>
    <NuxtLayout>
      <NuxtPage :page-key="route.name" />
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  import '@unocss/reset/tailwind-compat.css'
  import '@unocss/reset/normalize.css'
  import '@unocss/reset/tailwind.css'

  const route = useRoute()
  provideHeadlessUseId(() => useId())

  </script>
  