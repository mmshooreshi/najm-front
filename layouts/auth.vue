<template>
  <div
    class="relative flex justify-center bg-[#F9FBFA] pt-14 px-0 w-full"
    style="touch-action:none; height:100dvh;"
  >
    <!-- close btn (returns home) -->
    <NuxtLink to="/" class="absolute top-5 left-5 text-gray-400 transition hover:text-gray-600 hover:scale-105">
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
    style: 'touch-action:none; height:100dvh;'
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    }
  ]
})
</script>


<style>
button,
a,
[role="button"],
[tabindex],
input,
textarea,
select,
label {
  -webkit-tap-highlight-color: transparent;
}
</style>