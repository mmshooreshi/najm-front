<!-- components/LanguageSwitcher.vue -->
<template>
  <div
    @click="lang.nextLanguage()"
    class="z-100 w-12 h-12 rounded-2xl bg-white flex items-center justify-center
           text-gray-700 border border-gray-200
           transition-transform duration-200 ease-in-out
           hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer"
  >
    <span>{{ lang.currentLabel }}</span>

  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const lang = useLanguage()
</script>
