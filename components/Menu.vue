<!-- components/Menu.vue -->
<template>
  <nav class="w-full max-w-xl mx-auto py-2" :dir="isRTL ? 'rtl' : 'ltr'" aria-label="Sidebar Navigation" data-admin-slug="menu">
    <div
      v-for="(section, sIdx) in sections || []"
      :key="section?.id || sIdx"
      class="mb-4 drawer-stagger-item"
      :style="{ '--item-idx': sIdx + 1 }"
    >
      
      <!-- Accordion Section -->
      <BaseAccordionGroupNew 
        v-if="section && section.type === 'accordion'"
        :title="section.name"
        :edit-path="`menu:${section.key}.name`"
        :tabs="section.tabs"
        :panes="section.children"
        class="mb-3"
      >
        <template #default>
          <MenuLevel
            :items="section.children"
            :parent-slug="section.slug"
            :parent-path="`menu:${section.key}.children`"
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
          <span v-editable="`menu:${section.key}.name`">{{ section.name }}</span>
        </div>

        <MenuLevel
          :items="section.children"
          :parent-slug="section.slug"
          :parent-path="`menu:${section.key}.children`"
          @link-click="emit('close')"
        />
      </div>

      <!-- Hidden / Flat Section (e.g. Links, Contact) -->
      <div
        v-else-if="section && section.type === 'hidden'"
        class="my-3 border-t border-gray-100 pt-3"
      >
        <div v-if="section.name" class="text-gray-400 font-bold text-[11px] uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
          <span v-editable="`menu:${section.key}.name`">{{ section.name }}</span>
        </div>

        <MenuLevel
          :items="section.children"
          :parent-slug="section.slug"
          :parent-path="`menu:${section.key}.children`"
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

const sections = computed(() => {
  const data = menuUIData?.value || {}
  return [
    data.products ? { key: 'products', ...data.products } : null,
    data.services ? { key: 'services', ...data.services } : null,
    data.links ? { key: 'links', ...data.links } : null,
    data.contact ? { key: 'contact', ...data.contact } : null
  ].filter(Boolean)
})
</script>
  