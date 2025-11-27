<!-- components/Accordion2.vue -->
<template>
    <div class="border rounded-xl overflow-hidden bg-[#F1F5F9]">
      <button
        class="w-full text-sm px-4 py-3 flex justify-between items-center"
        @click="open = !open"
      >
        <span class="font-semibold">{{ item.name }}</span>
        <Icon :name="open ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
      </button>
  
      <div v-if="open" class="bg-white p-4">
        <Menu :sections="item.children" :parent-slug="item.slug" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import Menu from './Menu.vue'
  
  const props = defineProps<{ item?: any }>()
  const open = ref(false)
  </script>
  