<!-- components/Menu.vue -->

<!-- components/menu.vue -->
<template>
    <div class="max-w-xl mx-auto px-4 my-20 rtl" >
      <div  class="absolute h-16 pointer-events-none bg-white  left-3 right-3 top-0 z-100 transition-all "></div>

      <div v-for="section in sections || []" :key="section?.id" class="my-0 py-0" >

        <!-- {{section.type}} -->
        {{ console.log('[MenuPage] section =', section) }}
  
        <BaseAccordionGroup 
          v-if="section && section.type === 'accordion'"
          :title="section.name"
          :tabs="section.tabs"
          class="mb-4"
        >
          <template #default>
            <MenuLevel :items="section.children" :parent-slug="section.slug" />
          </template>
        </BaseAccordionGroup>
  
        <div
          v-else-if="section && section.type === 'label'"
          class="mb-2"
        >
        <div class="text-[#797B7D] text-d4 text-sm px-6  mb-5 mt-12">          {{ section.name }}
        </div>

            <MenuLevel :items="section.children" :parent-slug="section.slug" />

        </div>
  
        <NuxtLink
          v-else-if="section && section.type === 'hidden'"
          :to="`/${section.slug}`"
          class="py-3 border-t flex justify-between items-center"
        >
        <template #default>
            <MenuLevel :items="section.children" :parent-slug="section.slug" />
          </template>

        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import BaseAccordionGroup from '~/components/Base/BaseAccordionGroup.vue'
  import MenuLevel from '~/components/MenuLevel.vue'
  import { useMenuUIData } from '@/composables/ui/menuUI'
  const { menuUIData } = useMenuUIData()
//   console.log('[MenuPage] menuUIData products =', menuUIData.value.products)
  
  const sections = computed(() => [
  menuUIData?.value?.products,
  menuUIData?.value?.services,
  menuUIData?.value?.links,
  menuUIData?.value?.contact

  ])
  </script>
  