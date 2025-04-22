<!-- components/NavLinks.vue -->
<template>
  <ul class="flex flex-row ml-4 gap-6 text-sm text-black/70 font-medium">
    <template v-for="section in sections" :key="section.name">
      <li v-for="child in section.children" :key="child.slug">
        <NuxtLink :to="child.slug">{{ child.name }}</NuxtLink>
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
