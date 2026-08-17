<!-- components/atom/SearchBox.vue -->
<template>
  <div
    @click="openSearch"
    class="grid items-center bg-white rounded-2xl cursor-pointer p-2.5 min-w-12 overflow-hidden hover:bg-[#A8ABAE]/20 transition-all duration-300 border border-gray-100/50"
    :style="{
      gridTemplateColumns: searchOpen ? 'auto 1fr auto' : 'auto 0fr 0fr'
    }"
  >
    <SearchIcon class="fill-current text-gray-700 flex-shrink-0 w-5 h-5 z-10" />

    <input
      v-model="searchQuery"
      id="mobile-search-input"
      type="text"
      placeholder="جستجوی محصول، خدمات، کاتالوگ…"
      @click.stop
      @keydown.esc="closeSearch"
      class="mr-2 w-full bg-transparent outline-none text-xs text-gray-800 transition-all duration-200 ease-in-out"
      :class="searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    />

    <button
      v-if="searchOpen"
      @click.stop="closeSearch"
      class="text-gray-400 hover:text-gray-600 p-1 transition"
    >
      <Icon name="mdi:close" class="w-4 h-4" />
    </button>

    <!-- Teleport modal to body so it renders cleanly above header/pages without overflow issues -->
    <Teleport to="body">
      <div v-if="searchOpen" @click="closeSearch" class="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"></div>
      <SearchModal
        :visible="searchOpen"
        :query="searchQuery"
        @update:query="searchQuery = $event"
        @close="closeSearch"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import SearchIcon from '~/assets/icons/search-icon.svg'
import SearchModal from './SearchModal.vue'

const emit = defineEmits<{
  (e: 'update:searchOpen', open: boolean): void
}>()

const props = defineProps<{ menuOpen?: boolean }>()
const searchOpen = ref(false)
const searchQuery = ref('')

function openSearch() {
  if (searchOpen.value) return
  searchOpen.value = true
  emit('update:searchOpen', true)
  nextTick(() => {
    document.getElementById('mobile-search-input')?.focus()
  })
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
  emit('update:searchOpen', false)
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (searchOpen.value) closeSearch()
    else openSearch()
  } else if (e.key === 'Escape' && searchOpen.value) {
    closeSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>