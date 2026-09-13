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
  >
    <transition name="scale">
      <span :key="modelValue" class="inline-block origin-center text-sm sm:text-base font-bold text-d4">
        {{ modelValue }}
      </span>
    </transition>
  </div>
</template>
<script setup lang="ts">
import {useLocale} from "@/composables/useLocale"

  const props = defineProps<{ modelValue: string }>()
  const emit  = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  
  const { nextLanguage: localNext, language } = useLocale()
  
  function nextLanguage() {
    localNext()
    emit('update:modelValue', language.value)
  }
  </script>
  
<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) , opacity 0.1s ease-in-out;
}

/* OLD → NEW */
/* leave phase: scale 1 → 0 */
.scale-leave-from {
  transform: scale(1);
  opacity: 1;

}
.scale-leave-to {
  transform: scale(1);
  opacity: 0;

}

/* enter phase: scale 0 → 1 */
.scale-enter-from {
  transform: scale(0);
  opacity: 0;

}
.scale-enter-to {
  transform: scale(1);
  opacity: 1;
  
}
</style>
