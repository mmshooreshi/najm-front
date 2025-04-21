<!-- components/MenuLevel.vue -->
<template>
    <div>
      <div v-for="item in items || []" :key="item.id" class="mb-0">
        <!-- only use the accordion when type=accordion -->
        <BaseAccordionGroupNew
        :open=false
          v-if="item.type === 'accordion'"
          :title="item.name"
          :tabs="item.tabs"
          :panes="item.children"   
          class="border rounded overflow-hidden mb-1"
        >
          <!-- ② named slot for each pane when tabs=true -->
          <template #pane="{ pane }">
            <MenuLevel
              :items="pane.children"
              :parent-slug="fullSlug(pane)"
            />
          </template>
  
          <!-- ③ default-slot fallback (e.g. when tabs is false) -->
          <template #default>
            <MenuLevel
              :items="item.children"
              :parent-slug="fullSlug(item)"
            />
          </template>
        </BaseAccordionGroupNew>
  
        <!-- non-accordion items -->
        <div
          v-else-if="item.type === 'label'"
          class="text-gray-500 font-medium text-sm mt-4 mb-2"
        >
          {{ item.name }}
        </div>
  
        <RouterLink
          v-else-if="item.type === 'link'"
          :to="fullSlug(item)"
          class="py-3 my-0  flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
          <Icon name="mdi:arrow-left" class="w-6 h-6 " />
        </RouterLink>

        <RouterLink
          v-else-if="item.type === 'link-simple'"
          :to="fullSlug(item)"
          class="py-3 my-0  flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
        </RouterLink>

      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import BaseAccordionGroupNew from '~/components/Base/BaseAccordionGroupNew.vue'
  import MenuLevel from '~/components/MenuLevel.vue'
  
  const props = defineProps<{
    items?: Array<any>
    parentSlug?: string
  }>()
  
  const fullSlug = (item: any) =>
    props.parentSlug
      ? `${props.parentSlug}/${item.slug}`
      : `${item.slug}`
  </script>
  