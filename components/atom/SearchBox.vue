<!-- components/atom/SearchBox.vue -->
<template>
  <div>
    <!-- Interactive Search Button Trigger -->
    <button
      type="button"
      @click="openSearch"
      :title="searchBtnTooltip"
      aria-label="Search"
      class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white hover:bg-najmgrey transition-all duration-200 border border-gray-100/60 shadow-2xs group cursor-pointer"
    >
      <Icon name="mdi:magnify" class="w-5 h-5 text-gray-700 group-hover:text-najmgreen transition-colors flex-shrink-0" />
      <span class="hidden lg:inline-block text-xs text-gray-400 font-medium whitespace-nowrap">
        {{ searchPromptText }}
      </span>
      <kbd class="hidden lg:inline-block px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-400 group-hover:border-najmgreen/40 group-hover:text-najmgreen transition-colors">
        ⌘K
      </kbd>
    </button>

    <!-- Modern Full Spotlight / Modal Search Experience -->
    <SearchModal
      :visible="searchOpen"
      @close="closeSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SearchModal from './SearchModal.vue'
import { useLocale } from '~/composables/useLocale'

const emit = defineEmits<{
  (e: 'update:searchOpen', open: boolean): void
}>()

const props = defineProps<{ menuOpen?: boolean }>()
const searchOpen = ref(false)

const { language } = useLocale()

const searchPromptText = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return 'Search...'
  if (lang === 'AR') return 'بحث...'
  return 'جست‌وجو…'
})

const searchBtnTooltip = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return 'Search site (Ctrl+K / ⌘K)'
  if (lang === 'AR') return 'البحث في الموقع (Ctrl+K)'
  return 'جستجوی سریع در سایت (Ctrl+K)'
})

function openSearch() {
  searchOpen.value = true
  emit('update:searchOpen', true)
}

function closeSearch() {
  searchOpen.value = false
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
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleGlobalKeydown)
  }
})
</script>
