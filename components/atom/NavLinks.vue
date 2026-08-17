<!-- components/atom/NavLinks.vue -->
<!-- components/NavLinks.vue -->
<template>
  <ul class="hidden md:flex flex-row ml-4 gap-6 text-sm text-black/70 font-medium">
    <template v-for="section in sections" :key="section.name">
      <li v-for="child in section.children" :key="child.slug">
        <NuxtLink
          :to="child.slug"
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
import { NuxtLink } from '#components'

const { menuUIData } = useMenuUIData()
const sections = computed(() => [menuUIData.value.links, menuUIData.value.contact])
</script>
