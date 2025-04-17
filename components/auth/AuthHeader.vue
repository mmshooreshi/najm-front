

<!-- components/AuthHeader.vue -->
<template>
    <div class="flex flex-col items-start rtl gap-9 text-center">
      <div class="flex h-16 w-16 self-center items-center justify-center rounded-full bg-[#E4F0DC]">
        <Icon :name="icon" class="h-7 w-7 text-[#3A7C2B]" />
      </div>
      <div class="flex flex-col items-start text-right space-y-2 rtl">
      <h1 class="text-2xl font-extrabold leading-tight">{{ title }}</h1>
      <!-- subtitle slot if provided, else fallback to prop -->
      <div class="text-xs leading-5 text-[#797B7D]">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    icon: string
    title: string
    subtitle?: string
  }
  defineProps<Props>()
  </script>
  