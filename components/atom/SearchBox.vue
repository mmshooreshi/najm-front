<!-- components/atom/SearchBox.vue -->
<!-- components/atom/SearchBox.vue: -->
<template>
    <div
      @pointerdown.prevent="openSearch"
      class="grid items-center bg-white  rounded-2xl cursor-pointer p-3 min-w-12  bg-red overflow-hidden hover:bg-[#A8ABAE]/20 transition-all "
      :style="{
        gridTemplateColumns: searchOpen ? 'auto 1fr' : 'auto 0fr'      }"
    >
      <SearchIcon class="fill-current text-gray-700 flex-shrink-0 w-6 h-6 z-100" />
  
      <input
        v-model="searchQuery"
        id="mobile-search-input"
        type="text"
        placeholder="جستجو…"
        @click.stop
        @blur="closeSearch"
        class="mr-0 w-full bg-transparent outline-none text-gray-800 transition-all duration-200 ease-in-out"
        :class="searchOpen ? 'opacity-100 mr-2' : 'opacity-0 pointer-events-none'"
      />

   <SearchModal
     :visible="searchOpen && searchQuery.trim() !== ''"
     :query="searchQuery"
   />

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import SearchIcon from '~/assets/icons/search-icon.svg'
  import SearchModal from './SearchModal.vue'


  // Declare emitted events for parent communication
  const emit = defineEmits<{
    (e: 'update:searchOpen', open: boolean): void
  }>()
  
  const props = defineProps<{ menuOpen: boolean }>()
  const searchOpen = ref(false)
  const searchQuery = ref('')
  
  function openSearch() {
    emit('update:searchOpen', true)

    setTimeout(() => {
        searchOpen.value = true

    }, 100)
    nextTick(() => document.getElementById('mobile-search-input')?.focus())
  }
  
  function closeSearch() {
    searchOpen.value = false

  // wait 1000 ms (1 second) before running the close logic
  setTimeout(() => {
    emit('update:searchOpen', false)
  }, 100)
}

  </script>
  
  <style scoped>
  /* Inline style handles grid transition; input opacity transitions via Tailwind */
  </style>