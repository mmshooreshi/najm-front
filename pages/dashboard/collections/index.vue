<!-- pages/dashboard/collections/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Header Title & Filter Bar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4">
          {{ isRTL ? 'کالکشن‌های اطلاعات' : 'Collections Explorer' }}
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          {{
            isRTL
              ? 'مدیریت داده‌ها، صفحات، محصولات و رسانه‌های سایت'
              : 'Manage products, pages, services, and content collections'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Search filter -->
        <div class="relative flex-1 sm:w-48">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="isRTL ? 'جستجو...' : 'Search...'"
            class="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#018786] transition"
          />
        </div>

        <!-- System collections toggle -->
        <label class="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition cursor-pointer select-none">
          <input type="checkbox" v-model="showSystemCols" class="rounded text-[#018786] focus:ring-0" />
          <span>{{ isRTL ? 'سیستمی (_)' : 'System' }}</span>
        </label>

        <button
          @click="refresh"
          :disabled="pending"
          class="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer shrink-0"
        >
          <Icon name="mdi:refresh" class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending && !collections.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="i in 6" :key="i" class="h-28 rounded-2xl bg-gray-100 animate-pulse border border-gray-200"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCollections.length === 0" class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
      <Icon name="mdi:database-search-outline" class="h-8 w-8 text-gray-300 mx-auto mb-2" />
      <p class="text-xs font-semibold">{{ isRTL ? 'کالکشنی یافت نشد' : 'No collections found.' }}</p>
    </div>

    <!-- Collections Content Sections -->
    <div v-else class="space-y-6">
      <!-- Main Content Collections Section -->
      <div v-if="mainCollections.length" class="space-y-3">
        <h3 class="text-xs font-bold text-gray-500 font-d4 flex items-center gap-1.5">
          <Icon name="mdi:star-outline" class="h-4 w-4 text-[#018786]" />
          {{ isRTL ? 'کالکشن‌های اصلی سایت' : 'Main Content Collections' }}
        </h3>

        <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <NuxtLink
            v-for="col in mainCollections"
            :key="col.name"
            :to="`/dashboard/collections/${col.name}`"
            class="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-[#018786] hover:shadow-md transition min-w-0"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="rounded-xl bg-teal-50 p-2 text-[#018786] group-hover:bg-[#018786] group-hover:text-white transition shrink-0">
                    <Icon :name="getCollectionIcon(col.name)" class="h-5 w-5" />
                  </div>
                  <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#018786] transition truncate font-d4">
                    {{ getHumanTitle(col.name) }}
                  </h4>
                </div>
              </div>
              <p class="text-[11px] text-gray-500 font-mono">{{ col.name }}</p>
            </div>

            <div class="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
              <span class="text-gray-500">{{ isRTL ? 'رکوردها:' : 'Records:' }}</span>
              <span class="rounded-lg bg-gray-100 px-2.5 py-0.5 font-bold text-gray-800 group-hover:bg-teal-50 group-hover:text-[#018786] transition">
                {{ toLocalizedDigits(col.count) }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Other / System Collections Section (Shown if enabled or non-system others) -->
      <div v-if="otherCollections.length" class="space-y-3 pt-2 border-t border-gray-100">
        <h3 class="text-xs font-bold text-gray-500 font-d4 flex items-center gap-1.5">
          <Icon name="mdi:cog-outline" class="h-4 w-4 text-gray-400" />
          {{ isRTL ? 'سایر کالکشن‌ها و سیستمی' : 'System & Other Collections' }}
        </h3>

        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <NuxtLink
            v-for="col in otherCollections"
            :key="col.name"
            :to="`/dashboard/collections/${col.name}`"
            class="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/60 p-3 hover:bg-gray-100 transition min-w-0"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="mdi:table" class="h-4 w-4 text-gray-400 shrink-0" />
              <span class="text-xs font-semibold text-gray-700 truncate font-mono">{{ col.name }}</span>
            </div>
            <span class="rounded-lg bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-700 shrink-0">
              {{ toLocalizedDigits(col.count) }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { toLocalizedDigits } from '~/utils/digits'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const searchQuery = ref('')
const showSystemCols = ref(false)

const { data: statsData, pending, refresh } = await useAsyncData<{ name: string; count: number }[]>(
  'pb-collections-list',
  () => $fetch<{ name: string; count: number }[]>('/api/admin/pb/stats'),
  { lazy: true, default: () => [] }
)

const collections = computed(() => statsData.value || [])

const filteredCollections = computed(() => {
  let list = collections.value
  if (!showSystemCols.value) {
    list = list.filter((c) => !c.name.startsWith('_'))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((c) => c.name.toLowerCase().includes(q) || getHumanTitle(c.name).toLowerCase().includes(q))
  }
  return list
})

const mainCollections = computed(() => {
  const priorityList = ['pages', 'products', 'services', 'orders', 'media_files', 'blog', 'iasli_items']
  return filteredCollections.value.filter((c) => priorityList.includes(c.name) || !c.name.startsWith('_'))
})

const otherCollections = computed(() => {
  const mainNames = mainCollections.value.map((c) => c.name)
  return filteredCollections.value.filter((c) => !mainNames.includes(c.name))
})

function getHumanTitle(name: string): string {
  if (name === 'pages') return isRTL.value ? 'صفحات سایت' : 'Pages'
  if (name === 'products') return isRTL.value ? 'محصولات' : 'Products'
  if (name === 'services') return isRTL.value ? 'خدمات چاپ' : 'Services'
  if (name === 'orders') return isRTL.value ? 'سفارش‌ها' : 'Orders'
  if (name === 'media_files') return isRTL.value ? 'فایل‌های رسانه' : 'Media Files'
  if (name === 'blog') return isRTL.value ? 'مقالات و اخبار' : 'Blog Posts'
  if (name === 'iasli_items') return isRTL.value ? 'آیتم‌های اصلی' : 'Main Items'
  return name
}

function getCollectionIcon(name: string) {
  if (name.includes('user')) return 'mdi:account-group-outline'
  if (name.includes('media') || name.includes('file')) return 'mdi:folder-multiple-image'
  if (name.includes('product') || name.includes('item')) return 'mdi:package-variant-closed'
  if (name.includes('order')) return 'mdi:cart-outline'
  if (name.includes('page') || name.includes('content')) return 'mdi:file-document-outline'
  return 'mdi:table'
}
</script>
