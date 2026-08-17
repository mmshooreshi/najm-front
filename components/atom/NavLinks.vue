<!-- components/atom/NavLinks.vue -->
<template>
  <ul class="hidden md:flex flex-row ml-4 gap-6 text-sm text-black/70 font-medium">
    <template v-for="section in sections" :key="section?.name || 'sec'">
      <li v-for="child in section?.children || []" :key="child.slug">
        <NuxtLink
          :to="formatToUrl(child.slug)"
          class="hover:text-najmgreen transition-colors duration-200"
          active-class="text-najmgreen font-semibold"
        >
          {{ child.name }}
        </NuxtLink>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenuUIData } from '@/composables/ui/menuUI'

const { menuUIData } = useMenuUIData()
const sections = computed(() => [menuUIData.value?.links, menuUIData.value?.contact].filter(Boolean))

function formatToUrl(slug = ''): string {
  if (!slug) return '/'
  if (slug.startsWith('/') || slug.startsWith('http')) return slug
  return '/' + slug
}
</script>
