<!-- components/Menu.vue -->
<template>
  <nav class="w-full max-w-xl mx-auto py-2" :dir="isRTL ? 'rtl' : 'ltr'" aria-label="Sidebar Navigation">
    <div v-for="(section, sIdx) in sections || []" :key="section?.id || sIdx" class="mb-4">
      
      <!-- Accordion Section -->
      <BaseAccordionGroupNew 
        v-if="section && section.type === 'accordion'"
        :title="section.name"
        :tabs="section.tabs"
        :panes="section.children"
        class="mb-3"
      >
        <template #default>
          <MenuLevel
            :items="section.children"
            :parent-slug="section.slug"
            @link-click="emit('close')"
          />
        </template>
      </BaseAccordionGroupNew>

      <!-- Label Section (e.g. Categories, Services) -->
      <div
        v-else-if="section && section.type === 'label'"
        class="mb-4"
      >
        <div class="text-gray-400 font-bold text-xs uppercase tracking-wider px-2 mb-2 mt-4 flex items-center justify-between">
          <span>{{ section.name }}</span>
        </div>

        <MenuLevel
          :items="section.children"
          :parent-slug="section.slug"
          @link-click="emit('close')"
        />
      </div>

      <!-- Hidden / Flat Section (e.g. Links, Contact) -->
      <div
        v-else-if="section && section.type === 'hidden'"
        class="my-3 border-t border-gray-100 pt-3"
      >
        <MenuLevel
          :items="section.children"
          :parent-slug="section.slug"
          @link-click="emit('close')"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseAccordionGroupNew from '~/components/Base/BaseAccordionGroupNew.vue'
import MenuLevel from '~/components/MenuLevel.vue'
import { useMenuUIData } from '@/composables/ui/menuUI'
import { useLocale } from '~/composables/useLocale'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { menuUIData } = useMenuUIData()
const { language } = useLocale()

const isRTL = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  return l === 'FA' || l === 'AR'
})

const sections = computed(() => [
  menuUIData?.value?.products,
  menuUIData?.value?.services,
  menuUIData?.value?.links,
  menuUIData?.value?.contact
])
</script>
  