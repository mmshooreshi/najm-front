<template>
  <div
    class="relative flex min-h-screen justify-center bg-[#F9FBFA] pt-14 px-0 w-full"
    style="overflow:hidden; touch-action:none; height:100vh;"
  >
    <!-- close btn (returns home) -->
    <NuxtLink to="/" class="absolute top-5 left-5 text-gray-400 transition hover:text-gray-600">
      <Icon name="mdi:close" class="h-6 w-6" />
    </NuxtLink>

    <!-- page container -->
    <div class="w-max p-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title?: string) => (title ? `${title} • پنج` : 'پنج'),
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl',
    style: 'overflow:hidden;'
  },
  bodyAttrs: {
    class: 'text-right rtl bg-[#F9FBFA] antialiased',
    style: 'overflow:hidden; height:100vh; touch-action:none;'
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    }
  ]
})
</script>