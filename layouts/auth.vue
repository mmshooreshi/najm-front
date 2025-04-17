<template>
    <div
      class="relative flex justify-center bg-[#F9FBFA] pt-14 px-6 w-full"
      style="touch-action:none; height:100dvh;"
    >
      <!-- close btn (returns home) -->
      <NuxtLink
        to="/"
        class="absolute w-6 h-6 left-5 top-5 cursor-pointer top-0 left-0 text-gray-400 transition hover:text-gray-600  p-0 focus:rotate-45"
      >
        <Icon name="mdi:close" class="h-6 w-6" />
      </NuxtLink>
  
      <!-- back btn (goes back) -->
      <div
        @click="goBack"
        class="absolute bg-transparent cursor-pointer top-0 right-0 text-gray-400 transition hover:text-gray-600  py-4 px-4 hover:scale-110 active:translate-x-4"
        aria-label="Back"
      >
        <Icon name="mdi:chevron-left" class="h-8 w-8 rotate-180" />
      </div>
  
      <!-- page container -->
      <div class="w-full max-w-[375px]">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  function goBack() {
    router.back()
  }
  
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
  label,
  * {
    -webkit-tap-highlight-color: transparent;
  }


  * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

  </style>
  