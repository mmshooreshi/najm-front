<!-- components/BaseButton.vue -->
<template>
    <button
      class="w-full rounded-2xl bg-[#E4F0DC] text-[#3A7C2B] p-4 text-base font-semibold transition-all duration-200 hover:scale-102 disabled:scale-100 disabled:text-black hover:bg-primary-600 disabled:bg-gray-200 active:scale-98 focus:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts"></script>