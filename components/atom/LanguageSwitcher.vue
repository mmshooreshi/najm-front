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
  <div
    @click="nextLanguage"
    class="z-100 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl active:bg-gray-200/80 bg-white 
           flex items-center justify-center text-gray-700 select-none
           hover:bg-gray-100 hover:text-gray-900 cursor-pointer border border-gray-200/80 shadow-2xs active:scale-95 transition-transform duration-100"
    aria-label="Switch Language"
  >
    <transition name="lang-flip" mode="out-in">
      <span :key="modelValue" class="inline-block origin-center text-base sm:text-lg font-medium font-sans">
        {{ modelValue }}
      </span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/composables/useLocale"

defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { nextLanguage: localNext, language } = useLocale()

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
