<!-- components/BaseButton.vue -->
<template>
    <button
      class="w-full rounded-2xl bg-[#EBEBEB] p-4 text-base font-semibold transition-all duration-200 hover:scale-102 disabled:scale-100 hover:bg-primary-600 disabled:bg-gray-200 bg-green/50 active:scale-98 focus:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts"></script>