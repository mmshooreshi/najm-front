
<!-- components/LanguageSwitcher.vue -->
<template>
  <div
    md:hidden
    class="z-100 w-12 h-12 rounded-2xl bg-white flex flex-col items-center justify-center text-gray-700 font-bold border border-gray-200 transition-transform duration-200 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer"
    :class="menuOpen ? '!border-0' : ''"
  >
    <span class="block">FA</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ menuOpen: boolean }>()
</script>
