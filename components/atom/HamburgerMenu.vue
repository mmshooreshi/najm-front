<!-- components/atom/HamburgerMenu.vue -->
<template>
  <button
    type="button"
    @click="toggleMenu"
    class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white hover:bg-gray-100/80 active:scale-95 flex items-center justify-center transition-all duration-200 border border-gray-200/80 shadow-xs cursor-pointer select-none"
    :aria-label="menuOpen ? 'بستن منو' : 'باز کردن منو'"
  >
    <div class="w-5 h-4 flex flex-col justify-between items-center relative">
      <span
        class="w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center"
        :class="menuOpen ? 'translate-y-[7px] rotate-45 !bg-najmgreen' : ''"
      />
      <span
        class="w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300"
        :class="menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'"
      />
      <span
        class="w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center"
        :class="menuOpen ? '-translate-y-[7px] -rotate-45 !bg-najmgreen' : ''"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ menuOpen: boolean }>()
const emit = defineEmits<{
  (e: 'update:menuOpen', value: boolean): void
}>()

function toggleMenu() {
  emit('update:menuOpen', !props.menuOpen)
}
</script>
