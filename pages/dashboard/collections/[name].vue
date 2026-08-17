<!-- pages/dashboard/collections/[name].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Top Action Bar & Breadcrumbs -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
          <NuxtLink to="/dashboard" class="hover:underline">{{ isRTL ? 'پیشخوان' : 'Home' }}</NuxtLink>
          <span>/</span>
          <NuxtLink to="/dashboard/collections" class="hover:underline">{{ isRTL ? 'دیتابیس' : 'DB' }}</NuxtLink>
          <span>/</span>
          <span class="font-bold text-gray-800">{{ collectionName }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:table" class="h-5 w-5 text-[#018786]" />
          {{ getHumanTitle(collectionName) }}
          <span class="text-xs font-normal text-gray-500">({{ toLocalizedDigits(totalRecords) }})</span>
        </h2>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Add New Record Drawer -->
        <RecordDrawer :collection="collectionName" @saved="refreshData" />

        <button
          @click="refreshData"
          :disabled="pending"
          class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon name="mdi:refresh" class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
          <span class="hidden xs:inline">{{ isRTL ? 'به‌روزرسانی' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar & View Mode Toggle -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 max-w-sm">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجو...' : 'Search...'"
          class="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#018786] transition"
        />
      </div>

      <!-- View Mode Buttons -->
      <div class="flex items-center gap-2 justify-between sm:justify-end text-xs">
        <div class="flex items-center rounded-xl bg-gray-100 p-1">
          <button
            @click="viewMode = 'grid'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-white text-[#018786] shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:view-grid-outline" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'کارت‌ها' : 'Grid' }}</span>
          </button>

          <button
            @click="viewMode = 'list'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'list' ? 'bg-white text-[#018786] shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:view-headline" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'لیست' : 'List' }}</span>
          </button>

          <button
            @click="viewMode = 'table'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'table' ? 'bg-white text-[#018786] shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:table" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'جدول' : 'Table' }}</span>
          </button>
        </div>

        <span class="text-gray-500 hidden md:inline">
          {{ isRTL ? 'صفحه' : 'Page' }} <strong class="text-gray-900">{{ toLocalizedDigits(page) }}</strong>
        </span>
      </div>
    </div>

    <!-- Loading Shimmer (Only if no cached items exist) -->
    <div v-if="pending && !items.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-44 rounded-2xl bg-gray-100 animate-pulse border border-gray-200"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredItems.length === 0" class="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
      <Icon name="mdi:text-box-remove-outline" class="h-10 w-10 text-gray-300 mx-auto mb-2" />
      <p class="text-xs font-semibold">{{ isRTL ? 'هیچ رکوردی یافت نشد.' : 'No records found.' }}</p>
    </div>

    <!-- VIEW MODE 1: GRID CARDS (Default Ordinary Admin View) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-[#018786] hover:shadow-md transition"
      >
        <div>
          <!-- Thumbnail Image Header -->
          <div v-if="getFileUrl(item)" class="mb-3 h-36 w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80">
            <img
              :src="getFileUrl(item)!"
              :alt="getRecordTitle(item)"
              class="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          </div>

          <!-- Title & Type Badge -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#018786] transition font-d4 line-clamp-2">
              {{ getRecordTitle(item) }}
            </h3>

            <span v-if="item.layoutType || item.type || item.status" class="rounded-lg bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#018786] shrink-0">
              {{ item.layoutType || item.type || item.status }}
            </span>
          </div>

          <!-- Description Excerpt -->
          <p v-if="getRecordExcerpt(item)" class="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">
            {{ getRecordExcerpt(item) }}
          </p>
        </div>

        <!-- Footer Actions & Quick Controls -->
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span class="text-gray-400 text-[11px] font-mono">ID: {{ item.id.slice(0, 8) }}</span>

          <div class="flex items-center gap-1">
            <!-- Edit Record Drawer -->
            <RecordDrawer
              :collection="collectionName"
              :record="item"
              icon="mdi:pencil"
              @saved="refreshData"
            />

            <!-- Duplicate Record Button -->
            <button
              @click="duplicateRecord(item)"
              class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition cursor-pointer"
              :title="isRTL ? 'کپی و تکثیر' : 'Duplicate'"
            >
              <Icon name="mdi:content-copy" class="h-3.5 w-3.5" />
            </button>

            <!-- JSON Payload Toggle -->
            <button
              @click="toggleExpand(item.id)"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              :title="isRTL ? 'مشاهده JSON' : 'Inspect JSON'"
            >
              <Icon name="si:json-fill" class="h-3.5 w-3.5" :class="expandedMap[item.id] ? 'text-[#018786]' : ''" />
            </button>

            <!-- Delete Record Button -->
            <button
              @click="deleteRecord(item.id)"
              class="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
              :title="isRTL ? 'حذف' : 'Delete'"
            >
              <Icon name="mdi:delete-outline" class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <!-- Expanded JSON Block -->
        <div v-if="expandedMap[item.id]" class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-800 overflow-x-auto shadow-inner" dir="ltr">
          <div class="flex items-center justify-between mb-1 text-gray-400 text-[10px] pb-1 border-b">
            <span>Raw JSON Payload</span>
            <button @click="toggleExpand(item.id)" class="hover:text-gray-700">Close</button>
          </div>
          <pre class="whitespace-pre-wrap break-words">{{ JSON.stringify(item, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 2: COMPACT LIST -->
    <div v-else-if="viewMode === 'list'" class="space-y-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-[#018786] transition gap-3"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div v-if="getFileUrl(item)" class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
            <img :src="getFileUrl(item)!" :alt="getRecordTitle(item)" class="h-full w-full object-cover" />
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-gray-900 font-d4 truncate">
                {{ getRecordTitle(item) }}
              </h3>
              <span v-if="item.layoutType || item.type" class="rounded bg-teal-50 px-1.5 py-0.2 text-[10px] font-bold text-[#018786]">
                {{ item.layoutType || item.type }}
              </span>
            </div>
            <p v-if="getRecordExcerpt(item)" class="text-xs text-gray-500 truncate max-w-xl mt-0.5">
              {{ getRecordExcerpt(item) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <RecordDrawer :collection="collectionName" :record="item" icon="mdi:pencil" @saved="refreshData" />
          <button @click="duplicateRecord(item)" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Icon name="mdi:content-copy" class="h-3.5 w-3.5" />
          </button>
          <button @click="toggleExpand(item.id)" class="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
            <Icon name="si:json-fill" class="h-3.5 w-3.5" />
          </button>
          <button @click="deleteRecord(item.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
            <Icon name="mdi:delete-outline" class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Expanded JSON -->
        <div v-if="expandedMap[item.id]" class="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] overflow-x-auto" dir="ltr">
          <pre class="whitespace-pre-wrap">{{ JSON.stringify(item, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 3: SIMPLE TABLE -->
    <div v-else class="relative overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs max-w-full">
      <table class="w-full text-xs text-left">
        <thead class="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th class="px-3 py-2.5">ID</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'عنوان / نام' : 'Title' }}</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'توضیحات' : 'Description' }}</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'نوع' : 'Type' }}</th>
            <th class="px-3 py-2.5 text-center w-24">{{ isRTL ? 'عملیات' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-3 py-2.5 font-bold text-gray-900 font-mono">{{ item.id }}</td>
            <td class="px-3 py-2.5 text-gray-900 font-bold truncate max-w-[200px]">{{ getRecordTitle(item) }}</td>
            <td class="px-3 py-2.5 text-gray-600 truncate max-w-[250px]">{{ getRecordExcerpt(item) || '—' }}</td>
            <td class="px-3 py-2.5 text-gray-500">{{ item.layoutType || item.type || item.status || '—' }}</td>
            <td class="px-3 py-2.5 text-center">
              <div class="flex items-center justify-center gap-1">
                <RecordDrawer :collection="collectionName" :record="item" icon="mdi:pencil" @saved="refreshData" />
                <button @click="deleteRecord(item.id)" class="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Icon name="mdi:delete-outline" class="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-between rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 text-xs">
      <button
        @click="page = Math.max(1, page - 1)"
        :disabled="page === 1 || pending"
        class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
      >
        <Icon :name="isRTL ? 'mdi:chevron-right' : 'mdi:chevron-left'" class="h-4 w-4" />
        {{ isRTL ? 'قبلی' : 'Previous' }}
      </button>

      <span class="font-semibold text-gray-600">
        {{ isRTL ? 'صفحه' : 'Page' }} <strong class="text-gray-900">{{ toLocalizedDigits(page) }}</strong>
      </span>

      <button
        @click="page++"
        :disabled="items.length < per || pending"
        class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
      >
        {{ isRTL ? 'بعدی' : 'Next' }}
        <Icon :name="isRTL ? 'mdi:chevron-left' : 'mdi:chevron-right'" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { useDashboardState } from '~/composables/useDashboardCache'
import { toLocalizedDigits } from '~/utils/digits'
import RecordDrawer from '~/components/RecordDrawer.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const collectionName = computed(() => (route.params.name as string) || '')
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { logInfo, logError, logNetwork } = useAdminLogger()

const page = ref(1)
const per = 24
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list' | 'table'>('grid')
const expandedMap = ref<Record<string, boolean>>({})

interface CollectionResponse {
  items: Record<string, any>[]
  totalItems: number
}

// 0ms instant cached state
const cachedState = useDashboardState<CollectionResponse>(`col-${collectionName.value}`, () => ({ items: [], totalItems: 0 }))

const { data: colData, pending, refresh } = await useAsyncData<CollectionResponse>(
  `pb-col-${collectionName.value}`,
  () =>
    $fetch<CollectionResponse>('/api/admin/pb/collection', {
      params: { name: collectionName.value, page: page.value, per },
    }),
  {
    watch: [page, collectionName],
    lazy: true,
    default: () => cachedState.value,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || cachedState.value,
  }
)

const items = computed(() => colData.value?.items || cachedState.value.items || [])
const totalRecords = computed(() => colData.value?.totalItems || cachedState.value.totalItems || items.value.length)

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((item) => {
    return Object.values(item).some((v) => String(v ?? '').toLowerCase().includes(q))
  })
})

function getHumanTitle(name: string): string {
  if (name === 'pages') return isRTL.value ? 'صفحات سایت' : 'Pages'
  if (name === 'products') return isRTL.value ? 'محصولات' : 'Products'
  if (name === 'services') return isRTL.value ? 'خدمات' : 'Services'
  if (name === 'orders') return isRTL.value ? 'سفارش‌ها' : 'Orders'
  if (name === 'media_files') return isRTL.value ? 'فایل‌های رسانه' : 'Media'
  return name
}

function getRecordTitle(item: Record<string, any>): string {
  return (
    item.title ||
    item.name ||
    item.headline ||
    item.label ||
    item.slug ||
    item.id ||
    'رکورد بدون عنوان'
  )
}

function getRecordExcerpt(item: Record<string, any>): string {
  const text = item.description || item.content || item.summary || item.text || item.bio || ''
  if (!text) return ''
  return String(text).replace(/<[^>]*>/g, '').trim()
}

function getFileUrl(item: Record<string, any>): string | null {
  const filename = item.coverImage || item.image || item.file || item.avatar || item.thumbnail
  if (!filename || typeof filename !== 'string') return null

  const pbUrl = useRuntimeConfig().public.pbUrl || 'http://65.108.80.205:8090'
  const colId = item.collectionId || collectionName.value
  return `${pbUrl}/api/files/${colId}/${item.id}/${filename}`
}

function toggleExpand(id: string) {
  expandedMap.value[id] = !expandedMap.value[id]
}

async function refreshData() {
  logNetwork('Collections', `Refreshing ${collectionName.value}`)
  await refresh()
}

async function duplicateRecord(item: Record<string, any>) {
  try {
    logNetwork('Collections', `Duplicating record ${item.id} in ${collectionName.value}`)
    const clone = { ...item }
    delete clone.id
    delete clone.created
    delete clone.updated

    if (clone.title) clone.title = `${clone.title} (کپی)`
    if (clone.name) clone.name = `${clone.name}-copy`
    if (clone.slug) clone.slug = `${clone.slug}-copy-${Date.now().toString().slice(-4)}`

    await $fetch('/api/admin/pb/collection', {
      method: 'POST',
      params: { name: collectionName.value },
      body: clone,
    })

    logInfo('Collections', `Successfully duplicated record ${item.id}`)
    await refresh()
  } catch (err: any) {
    logError('Collections', `Failed to duplicate record: ${err?.message || err}`)
  }
}

async function deleteRecord(id: string) {
  const confirmMsg = isRTL.value ? 'حذف این رکورد؟' : 'Delete this record?'
  if (!confirm(confirmMsg)) return

  try {
    logNetwork('Collections', `Deleting record ${id} from ${collectionName.value}`)
    await $fetch('/api/admin/pb/collection', {
      method: 'DELETE',
      params: { name: collectionName.value, id },
    })
    logInfo('Collections', `Deleted record ${id}`)
    await refresh()
  } catch (err: any) {
    logError('Collections', `Failed to delete record: ${err?.message || err}`)
  }
}
</script>
