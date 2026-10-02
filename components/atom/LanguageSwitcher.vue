<!-- components/atom/LanguageSwitcher.vue -->
<!-- components/LanguageSwitcher.vue -->
<!-- <template>
  <div
  @click="nextLanguage"
  class="z-100 w-12 h-12 rounded-2xl active:bg-gray-300/50 bg-white flex items-center justify-center
  text-gray-700 
  hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer"
  >
  <transition name="scale" mode="out-in">
           inline-block so transform is centered
           <span :key="currentLabel" class="inline-block origin-center text-lg  mt-1">
             {{ currentLabel }}
            </span>
          </transition>
          </div>
</template> -->


<template>
  <div class="relative inline-flex items-center">
    <button
      type="button"
      @click="nextLanguage"
      class="z-100 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl active:bg-gray-200/80 bg-white 
             flex items-center justify-center text-gray-700 select-none
             hover:bg-gray-100 hover:text-gray-900 cursor-pointer border border-gray-200/80 shadow-2xs active:scale-95 transition-transform duration-100"
      aria-label="Switch Language"
    >
      <transition name="lang-flip" mode="out-in">
        <span :key="modelValue" class="inline-block origin-center text-base sm:text-lg">
          {{ modelValue }}
        </span>
      </transition>
    </button>

    <!-- Semantic Crawlable Alternates for Googlebot & Accessibility -->
    <nav class="sr-only" aria-label="Language Alternates">
      <NuxtLink :to="localePath(currentPath, 'FA')" hreflang="fa" rel="alternate">فارسی</NuxtLink>
      <NuxtLink :to="localePath(currentPath, 'EN')" hreflang="en" rel="alternate">English</NuxtLink>
      <NuxtLink :to="localePath(currentPath, 'AR')" hreflang="ar" rel="alternate">العربية</NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import { useLocale } from "@/composables/useLocale"

defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const route = useRoute()
const currentPath = computed(() => route?.path || '/')

const { nextLanguage: localNext, language, localePath } = useLocale()

function nextLanguage() {
  localNext()
  emit('update:modelValue', language.value)
}
</script>

<style scoped>
.lang-flip-enter-active,
.lang-flip-leave-active {
  transition: transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.12s ease;
  will-change: transform, opacity;
}

.lang-flip-enter-from {
  transform: scale(0.65) translateY(2px);
  opacity: 0;
}

.lang-flip-leave-to {
  transform: scale(0.65) translateY(-2px);
  opacity: 0;
}
</style>
