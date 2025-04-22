 <!-- components/SearchBox.vue -->
<template>
  <div
    @click="openSearch"
    class="relative flex items-center overflow-hidden bg-white border border-gray-200 rounded-2xl transition-[width] duration-300 ease-in-out cursor-pointer p-3"
  >
    <SearchIcon class="fill-current text-gray-700 flex-shrink-0 w-6 h-6" />
    <input
      v-show="searchOpen"
      v-model="searchQuery"
      id="mobile-search-input"
      type="text"
      placeholder="جستجو…"
      class="mr-8 grow bg-transparent outline-none text-gray-800"
      @click.stop
      @blur="closeSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import SearchIcon from '~/assets/icons/search-icon.svg'

const props = defineProps<{ menuOpen: boolean }>()
const searchOpen = ref(false)
const searchQuery = ref('')

function openSearch() {
  searchOpen.value = true
  nextTick(() => {
    document.getElementById('mobile-search-input')?.focus()
  })
}
function closeSearch() {
  searchOpen.value = false
}
</script>
