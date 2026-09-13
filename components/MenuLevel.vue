<!-- components/MenuLevel.vue -->
<template>
  <div class="space-y-1">
    <div
      v-for="(item, idx) in items || []"
      :key="item.id || idx"
      class="relative group"
    >
      <!-- Accordion Type -->
      <BaseAccordionGroupNew
        v-if="item.type === 'accordion'"
        :activeFiltersCount="trueCounts[item.id]"
        :open="false"
        :title="item.name"
        :tabs="item.tabs"
        :panes="item.children"
        class="border border-gray-200/80 rounded-2xl overflow-hidden bg-gray-50/60"
      >
        <!-- Tabbed pane slot -->
        <template #pane="{ pane }">
          <MenuLevel
            :items="pane.children"
            :parent-slug="fullSlug(pane)"
            @link-click="emit('link-click')"
          />
        </template>

        <!-- Default slot -->
        <template #default>
          <MenuLevel
            :items="item.children"
            :parent-slug="fullSlug(item)"
            @link-click="emit('link-click')"
          />
        </template>
      </BaseAccordionGroupNew>

      <!-- Label Type -->
      <div
        v-else-if="item.type === 'label'"
        class="text-gray-400 font-bold text-xs uppercase tracking-wider px-3 pt-3 pb-1"
      >
        {{ item.name }}
      </div>

      <!-- Main Link Type (e.g. Services) -->
      <NuxtLink
        v-else-if="item.type === 'link'"
        :to="formatToUrl(item)"
        @click="onLinkClick"
        class="min-h-[44px] py-2.5 px-3 sm:px-4 flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-najmgreen hover:bg-gray-100/80 active:bg-gray-200/70 active:scale-[0.99] rounded-xl transition-all duration-200"
      >
        <span class="truncate">{{ item.name }}</span>
        <Icon
          :name="isRTL ? 'mdi:chevron-left' : 'mdi:chevron-right'"
          class="w-5 h-5 text-gray-400 group-hover:text-najmgreen transition-transform group-hover:-translate-x-1 flex-shrink-0"
          :class="isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
        />
      </NuxtLink>

      <!-- Filter Type -->
      <div
        v-else-if="item.type === 'filter'"
        @click="item.value = !item.value"
        class="min-h-[40px] py-2 px-3 sm:px-4 flex items-center gap-2.5 cursor-pointer hover:bg-gray-100/70 active:scale-[0.99] rounded-xl transition-all select-none"
      >
        <Icon
          v-if="item.value"
          name="mdi:checkbox-marked"
          class="w-5 h-5 text-najmgreen flex-shrink-0"
        />
        <Icon
          v-else
          name="mdi:checkbox-blank-outline"
          class="w-5 h-5 text-gray-400 hover:text-gray-600 flex-shrink-0"
        />
        <div class="text-xs font-semibold" :class="item.value ? 'text-gray-900 font-bold' : 'text-gray-600'">
          {{ item.name }}
        </div>
        <div v-if="item.count" class="text-[11px] text-gray-400">
          ({{ toLocalizedDigits(item.count) }} {{ countSuffix }})
        </div>
      </div>

      <!-- Simple Link Type (e.g. Catalog, About, Contact) -->
      <NuxtLink
        v-else-if="item.type === 'link-simple'"
        :to="formatToUrl(item)"
        @click="onLinkClick"
        class="min-h-[44px] py-2.5 px-3 sm:px-4 flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-najmgreen hover:bg-gray-100/80 active:bg-gray-200/70 active:scale-[0.99] rounded-xl transition-all duration-200"
      >
        <span class="truncate">{{ item.name }}</span>
        <div v-if="item.count" class="text-xs font-normal text-gray-400 flex-shrink-0">
          ({{ toLocalizedDigits(item.count) }} {{ countSuffix }})
        </div>
      </NuxtLink>

      <!-- Simple Small Link Type (Leaf Products Subcategory) -->
      <NuxtLink
        v-else-if="item.type === 'link-simple-xs'"
        :to="formatToUrl(item)"
        @click="onLinkClick"
        class="min-h-[40px] py-2 px-3 sm:px-4 flex items-center justify-between text-xs sm:text-sm text-gray-600 hover:text-najmgreen hover:bg-white active:bg-gray-100 rounded-xl transition-all duration-150"
      >
        <div class="flex items-center gap-2 truncate">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
          <span class="truncate">{{ item.name }}</span>
        </div>
        <span v-if="item.count" class="text-[11px] text-gray-400 flex-shrink-0">
          ({{ toLocalizedDigits(item.count) }})
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseAccordionGroupNew from '~/components/Base/BaseAccordionGroupNew.vue'
import { toLocalizedDigits } from '~/utils/digits'
import { useLocale } from '~/composables/useLocale'

const emit = defineEmits<{
  (e: 'link-click'): void
}>()

const props = defineProps<{
  items?: Array<any>
  parentSlug?: string
}>()

const { language, localePath } = useLocale()

const isRTL = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return l === 'fa' || l === 'ar'
})

const countSuffix = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  if (l === 'en') return 'models'
  if (l === 'ar') return 'موديل'
  return 'مدل'
})

function fullSlug(item: any): string {
  if (!item || !item.slug) return props.parentSlug || '/'
  if (item.slug.startsWith('/')) return item.slug
  if (!props.parentSlug || props.parentSlug === '/') return `/${item.slug}`
  return `${props.parentSlug.replace(/\/+$/, '')}/${item.slug.replace(/^\/+/, '')}`
}

function formatToUrl(item: any): string {
  const raw = fullSlug(item)
  if (raw.startsWith('http')) return raw
  return localePath(raw)
}

function onLinkClick() {
  emit('link-click')

  // Smoothly scroll to top only if not already near top, ensuring soothing page transition
  if (typeof window !== 'undefined' && window.scrollY > 20) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Grandchildren count helper
function countGrandchildrenTrue(children: Array<any> = []) {
  return children.reduce((sum, child) => {
    if (Array.isArray(child.children)) {
      sum += child.children.filter(gc => gc.value === true).length
    }
    return sum
  }, 0)
}

const trueCounts = computed<Record<string | number, number>>(() =>
  (props.items || []).reduce((acc, item) => {
    if (item.type === 'accordion' && Array.isArray(item.children)) {
      acc[item.id] = countGrandchildrenTrue(item.children)
    }
    return acc
  }, {} as Record<string | number, number>)
)
</script>
  