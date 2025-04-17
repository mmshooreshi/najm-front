<!-- layouts/auth.vue -->
<template>
  <div class="relative flex min-h-screen justify-center bg-[#F9FBFA] pt-14">
    <!-- close btn (returns home) -->
    <NuxtLink to="/" class="absolute top-5 left-5 text-gray-400 transition hover:text-gray-600">
      <Icon name="mdi:close" class="h-6 w-6" />
    </NuxtLink>

    <!-- page container -->
    <div class="w-full max-w-[375px] ">
        
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title?: string) => (title ? `${title} • پنج` : 'پنج'),
  htmlAttrs: { lang: 'fa', dir: 'rtl' },
  bodyAttrs: { class: 'text-right rtl bg-[#F9FBFA] antialiased' },
})
</script>